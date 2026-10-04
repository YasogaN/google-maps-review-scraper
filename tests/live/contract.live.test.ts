import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { scraper } from "../../src/index.js";
import { contractViolations, schemaViolations, type BoqSchema } from "../helpers/contract.js";
import { LIVE_PLACE_URL } from "../helpers/live.js";

/**
 * Response-change detection.
 *
 * Google's BOQ response is undocumented and may change without notice. These
 * tests compare a fresh live response against the committed schema fixture and
 * against the structural assumptions the parser depends on, so a change fails
 * the scheduled live workflow with a readable diff instead of silently
 * breaking the scraper.
 */
const schema = JSON.parse(
  readFileSync(new URL("../fixtures/boq-schema.json", import.meta.url), "utf8"),
) as BoqSchema;

async function fetchLiveReviews(): Promise<unknown[]> {
  return (await scraper({
    url: LIVE_PLACE_URL,
    sort_type: "newest",
    pages: 5,
    clean: false,
  })) as unknown[];
}

describe("live response contract", () => {
  let reviews: unknown[] = [];

  beforeAll(async () => {
    reviews = await fetchLiveReviews();
  });

  it("matches the committed response schema", () => {
    const problems = schemaViolations(reviews, schema);
    expect(problems, `Response schema changed:\n${problems.join("\n")}`).toEqual([]);
  });

  it("satisfies the parser's structural assumptions", () => {
    const problems = contractViolations(reviews);
    expect(problems, `Response contract changed:\n${problems.join("\n")}`).toEqual([]);
  });

  it("still exposes owner responses in the raw payload", () => {
    const withResponse = reviews.filter(
      review => Array.isArray(review) && Array.isArray(review[4]) && typeof review[4][2] === "string",
    );
    // The selected place is documented to have owner replies, so an empty result
    // means Google moved the response field or stopped returning owner responses
    // rather than there simply being none to show.
    expect(withResponse.length).toBeGreaterThan(0);
  });
});
