import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeReview, pageBody, textResponse } from "../helpers/boq.js";

const { mockFetch } = vi.hoisted(() => ({ mockFetch: vi.fn() }));

vi.mock("../../src/client.js", () => ({
  createClient: () => ({ fetch: mockFetch }),
}));

import { scraper } from "../../src/index.js";
import type { ParsedReview } from "../../src/types.js";

const URL_ONE = "https://www.google.com/maps/place/x/data=!3m1!1s0xAAA:0xBBB!9z";

beforeEach(() => {
  mockFetch.mockReset();
});

describe("scraper pipeline (integration)", () => {
  it("runs the full pipeline against a fake HTTP client", async () => {
    mockFetch
      .mockResolvedValueOnce(textResponse(pageBody([makeReview({ 5: "a" })], "t1")))
      .mockResolvedValueOnce(textResponse(pageBody([makeReview({ 5: "b" })])));

    const result = (await scraper({
      url: URL_ONE,
      sort_type: "newest",
      pages: -1,
      clean: true,
    })) as ParsedReview[];

    expect(result.map(review => review.review_id)).toEqual(["a", "b"]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("passes the built endpoint url to the client", async () => {
    mockFetch.mockResolvedValueOnce(textResponse(pageBody([makeReview()])));
    await scraper({ url: URL_ONE, sort_type: "highest_rating", pages: 1, clean: false });

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain("GetLocalBoqProxy");
    expect(calledUrl).toContain("reqpld=");
  });

  it("returns raw reviews when clean is false", async () => {
    mockFetch.mockResolvedValueOnce(textResponse(pageBody([makeReview()])));
    const result = await scraper({ url: URL_ONE, pages: 1, clean: false });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it("returns [] when the endpoint yields no parsable page", async () => {
    mockFetch.mockResolvedValueOnce(textResponse("[]"));
    expect(await scraper({ url: URL_ONE, clean: true })).toEqual([]);
  });
});
