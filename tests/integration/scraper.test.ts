import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/utils.js", async importOriginal => {
  const actual = await importOriginal<typeof import("../../src/utils.js")>();
  return { ...actual, paginateReviews: vi.fn() };
});

import { scraper } from "../../src/index.js";
import { paginateReviews } from "../../src/utils.js";

const mockPaginate = vi.mocked(paginateReviews);

const URL_ONE = "https://www.google.com/maps/place/x/data=!3m1!1s0xAAA:0xBBB!9z";
const URL_TWO = "https://www.google.com/maps/place/x/data=!4m2!1sFIRST!4m2!1sSECOND!9z";

beforeEach(() => {
  mockPaginate.mockReset();
});

describe("scraper", () => {
  it("returns parsed reviews and forwards normalized parameters", async () => {
    mockPaginate.mockResolvedValueOnce([{ review_id: "x" }] as never);
    const result = await scraper({ url: URL_ONE, sort_type: "newest", pages: 1, clean: true });

    expect(result).toEqual([{ review_id: "x" }]);
    expect(mockPaginate).toHaveBeenCalledTimes(1);
    expect(mockPaginate.mock.calls[0]![0]).toMatchObject({
      placeId: "0xAAA:0xBBB",
      sortOrder: 2,
      pages: 1,
      clean: true,
    });
  });

  it("prefers the second place id when the url contains two matches", async () => {
    mockPaginate.mockResolvedValueOnce([]);
    await scraper({ url: URL_TWO });
    expect(mockPaginate.mock.calls[0]![0]).toMatchObject({ placeId: "SECOND" });
  });

  it("returns an empty array when there are no reviews", async () => {
    mockPaginate.mockResolvedValueOnce([]);
    expect(await scraper({ url: URL_ONE })).toEqual([]);
  });

  it("forwards proxy configuration", async () => {
    mockPaginate.mockResolvedValueOnce([]);
    await scraper({
      url: URL_ONE,
      proxy: { proxyUrl: "http://proxy:8080", ignoreTls: true },
    });
    expect(mockPaginate).toHaveBeenCalledTimes(1);
  });

  it("wraps validation errors", async () => {
    await expect(scraper({ url: "not a url" })).rejects.toThrow(
      /Scraper Error: Invalid URL format/,
    );
  });

  it("wraps a missing place id error", async () => {
    await expect(scraper({ url: "https://www.google.com/maps/place/x" })).rejects.toThrow(
      /Scraper Error: Invalid URL/,
    );
  });

  it("wraps non-Error failures", async () => {
    mockPaginate.mockImplementationOnce(() => {
      throw "string failure";
    });
    await expect(scraper({ url: URL_ONE })).rejects.toThrow(
      /Scraper Error: string failure/,
    );
  });
});
