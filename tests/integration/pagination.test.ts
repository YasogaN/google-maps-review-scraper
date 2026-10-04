import { describe, expect, it, vi } from "vitest";
import { paginateReviews } from "../../src/utils.js";
import type { ParsedReview } from "../../src/types.js";
import { asClient, clientOf, pageBody, textResponse, validReview } from "../helpers/boq.js";

describe("paginateReviews", () => {
  it("returns an empty array when the first page cannot be parsed", async () => {
    const client = clientOf(textResponse("[]"));
    expect(
      await paginateReviews({
        placeId: "p",
        sortOrder: 1,
        pages: -1,
        clean: false,
        client: asClient(client),
      }),
    ).toEqual([]);
  });

  it("returns a single page when there is no next token", async () => {
    const client = clientOf(textResponse(pageBody([1, 2, 3])));
    expect(
      await paginateReviews({
        placeId: "p",
        sortOrder: 1,
        pages: 5,
        clean: false,
        client: asClient(client),
      }),
    ).toEqual([1, 2, 3]);
  });

  it("returns after a single page when pages is 1", async () => {
    const client = clientOf(textResponse(pageBody([1, 2], "t1")));
    expect(
      await paginateReviews({
        placeId: "p",
        sortOrder: 1,
        pages: 1,
        clean: false,
        client: asClient(client),
      }),
    ).toEqual([1, 2]);
  });

  it("parses the output when clean is true", async () => {
    const client = clientOf(textResponse(pageBody([validReview()])));
    const result = (await paginateReviews({
      placeId: "p",
      sortOrder: 1,
      pages: 1,
      clean: true,
      client: asClient(client),
    })) as ParsedReview[];
    expect(result).toHaveLength(1);
    expect(result[0]!.review_id).toBe("r1");
  });

  it("parses the final result when clean is true across multiple pages", async () => {
    const client = clientOf(
      textResponse(pageBody([validReview()], "t1")),
      textResponse(pageBody([validReview()])),
    );
    const result = (await paginateReviews({
      placeId: "p",
      sortOrder: 1,
      pages: 5,
      clean: true,
      client: asClient(client),
    })) as ParsedReview[];
    expect(result).toHaveLength(2);
  });

  it("paginates through every page and stops at the end", async () => {
    const client = clientOf(
      textResponse(pageBody([1], "t1")),
      textResponse(pageBody([2], "t2")),
      textResponse(pageBody([3], "t3")),
      textResponse(pageBody([4])),
    );
    const result = await paginateReviews({
      placeId: "p",
      sortOrder: 1,
      pages: -1,
      clean: false,
      client: asClient(client),
    });
    expect(result).toEqual([1, 2, 3, 4]);
    expect(client.fetch).toHaveBeenCalledTimes(4);
  });

  it("stops when a page cannot be parsed", async () => {
    const client = clientOf(textResponse(pageBody([1], "t1")), textResponse("[]"));
    expect(
      await paginateReviews({
        placeId: "p",
        sortOrder: 1,
        pages: -1,
        clean: false,
        client: asClient(client),
      }),
    ).toEqual([1]);
  });

  it("stops when the next token repeats", async () => {
    const client = clientOf(
      textResponse(pageBody([1], "t1")),
      textResponse(pageBody([2], "t1")),
    );
    expect(
      await paginateReviews({
        placeId: "p",
        sortOrder: 1,
        pages: -1,
        clean: false,
        client: asClient(client),
      }),
    ).toEqual([1, 2]);
  });

  it("stops gracefully when a page request fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const client = clientOf(textResponse(pageBody([1], "t1")), new Error("boom"));
    try {
      expect(
        await paginateReviews({
          placeId: "p",
          sortOrder: 1,
          pages: -1,
          clean: false,
          client: asClient(client),
        }),
      ).toEqual([1]);
      expect(errorSpy).toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("trims the collected reviews to the requested page count", async () => {
    const reviews = Array.from({ length: 25 }, (_, index) => index);
    const client = clientOf(textResponse(pageBody(reviews, "t1")));
    const result = await paginateReviews({
      placeId: "p",
      sortOrder: 1,
      pages: 2,
      clean: false,
      client: asClient(client),
    });
    expect(result).toHaveLength(20);
    expect(result).toEqual(reviews.slice(0, 20));
  });

  it("does not trim when the collected count is within the page limit", async () => {
    const client = clientOf(textResponse(pageBody([1, 2, 3], "t1")), textResponse(pageBody([4])));
    const result = await paginateReviews({
      placeId: "p",
      sortOrder: 1,
      pages: 5,
      clean: false,
      client: asClient(client),
    });
    expect(result).toEqual([1, 2, 3, 4]);
  });
});
