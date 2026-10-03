import { describe, expect, it } from "vitest";
import { scraper } from "../../src/index.js";
import type { ParsedReview } from "../../src/types.js";
import { LIVE_PLACE_URL } from "../helpers/live.js";

/**
 * Live end-to-end tests against the real Google Maps BOQ endpoint.
 *
 * These exercise the full stack (URL parsing -> HTTP client -> endpoint builder
 * -> pagination -> parser). They require network access and are run on a
 * schedule by the `Live tests` workflow, not on every pull request.
 */
describe("scraper (live)", () => {
  it("fetches raw reviews from the live endpoint", async () => {
    const reviews = await scraper({
      url: LIVE_PLACE_URL,
      sort_type: "newest",
      pages: 1,
      clean: false,
    });

    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);
    expect(Array.isArray(reviews[0])).toBe(true);
  });

  it("fetches cleaned reviews from the live endpoint", async () => {
    const reviews = (await scraper({
      url: LIVE_PLACE_URL,
      sort_type: "newest",
      pages: 1,
      clean: true,
    })) as ParsedReview[];

    expect(reviews.length).toBeGreaterThan(0);
    for (const review of reviews) {
      expect(typeof review.review_id).toBe("string");
      expect(typeof review.review.rating).toBe("number");
      expect(review.source).toBe("Google Local Search Panel");
    }
  });

  it("supports every sort order", async () => {
    for (const sort_type of ["relevant", "newest", "highest_rating", "lowest_rating"] as const) {
      const reviews = await scraper({ url: LIVE_PLACE_URL, sort_type, pages: 1, clean: false });
      expect(reviews.length).toBeGreaterThan(0);
    }
  });

  it("paginates more than a single page", async () => {
    const reviews = await scraper({
      url: LIVE_PLACE_URL,
      sort_type: "newest",
      pages: 2,
      clean: false,
    });
    expect(reviews.length).toBeGreaterThan(10);
  });

  it("rejects an invalid url", async () => {
    await expect(scraper({ url: "https://example.com/not-a-place" })).rejects.toThrow(
      /Scraper Error/,
    );
  });
});
