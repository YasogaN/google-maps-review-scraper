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
    // "relevant" surfaces owner responses for this place; "newest" does not,
    // which would make the owner-response check below vacuous.
    sort_type: "relevant",
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

  it("extracts owner responses when the payload contains them", () => {
    const withResponse = reviews.filter(
      review => Array.isArray(review) && Array.isArray(review[4]) && typeof review[4][2] === "string",
    );
    const hasResponseObjects = reviews.some(
      review => Array.isArray(review) && Array.isArray(review[4]),
    );

    if (hasResponseObjects) {
      // Response objects exist, so failing to extract any text means the
      // response layout moved and the parser needs updating.
      expect(withResponse.length).toBeGreaterThan(0);
    } else {
      // The place may simply have no owner replies. Report instead of failing so
      // a content change does not turn the scheduled run red.
      console.warn(
        "No owner responses found in the live payload. The selected place may have no replies, " +
          "or Google may have moved the response field.",
      );
    }
  });
});
