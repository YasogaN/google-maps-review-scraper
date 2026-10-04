import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  contractViolations,
  kind,
  schemaViolations,
  topLevelShape,
  type BoqSchema,
} from "../helpers/contract.js";
import { makeReview, validReview } from "../helpers/boq.js";

const schema = JSON.parse(
  readFileSync(new URL("../fixtures/boq-schema.json", import.meta.url), "utf8"),
) as BoqSchema;

describe("response contract helpers", () => {
  it("classifies raw values", () => {
    expect(kind(null)).toBe("null");
    expect(kind([])).toBe("array");
    expect(kind("x")).toBe("string");
    expect(kind(1)).toBe("number");
    expect(kind(true)).toBe("boolean");
    expect(kind({})).toBe("object");
    expect(kind(undefined)).toBe("undefined");
  });

  it("collects the top-level shape", () => {
    expect(topLevelShape([])).toEqual({});
    const shape = topLevelShape([validReview(), makeReview()]);
    expect(shape["1"]).toEqual(["number"]);
    expect(shape["5"]).toEqual(["string"]);
    expect(shape["4"]).toEqual(["array", "null"]);
  });

  it("accepts compliant reviews against a matching schema", () => {
    const reviews = [makeReview()];
    const matching: BoqSchema = {
      reviewLength: { min: 1 },
      indices: topLevelShape(reviews),
      requiredIndices: ["1", "2", "3", "5"],
    };
    expect(schemaViolations(reviews, matching)).toEqual([]);
  });

  it("flags new indexes", () => {
    const reviews = [makeReview()];
    const problems = schemaViolations(reviews, {
      reviewLength: { min: 1 },
      indices: {},
      requiredIndices: [],
    });
    expect(problems).toEqual(expect.arrayContaining([expect.stringContaining("new top-level index")]));
  });

  it("flags new types at known indexes", () => {
    const reviews = [makeReview()];
    const wrongType = { ...topLevelShape(reviews), "1": ["string"] };
    const problems = schemaViolations(reviews, {
      reviewLength: { min: 1 },
      indices: wrongType,
      requiredIndices: [],
    });
    expect(problems).toEqual(expect.arrayContaining([expect.stringContaining('new type "number"')]));
  });

  it("flags missing required indexes", () => {
    const reviews = [makeReview()];
    const problems = schemaViolations(reviews, {
      reviewLength: { min: 1 },
      indices: topLevelShape(reviews),
      requiredIndices: ["99"],
    });
    expect(problems).toEqual(expect.arrayContaining([expect.stringContaining("required index 99 is missing")]));
  });

  it("flags too few reviews", () => {
    const reviews = [makeReview()];
    const problems = schemaViolations(reviews, {
      reviewLength: { min: 5 },
      indices: topLevelShape(reviews),
      requiredIndices: [],
    });
    expect(problems).toEqual(expect.arrayContaining([expect.stringContaining("only 1 reviews")]));
  });

  it("accepts compliant reviews for the parser contract", () => {
    expect(contractViolations([makeReview(), validReview()])).toEqual([]);
  });

  it("flags parser contract violations", () => {
    expect(contractViolations([])).toContain("no reviews returned");
    expect(contractViolations([null])).toEqual(
      expect.arrayContaining([expect.stringContaining("is not an array")]),
    );
    expect(contractViolations([[1, 2, 3]])).toEqual(
      expect.arrayContaining([expect.stringContaining("shorter than 6")]),
    );
    expect(contractViolations([makeReview({ 1: "x" })])).toEqual(
      expect.arrayContaining([expect.stringContaining("rating is not a number")]),
    );
    expect(contractViolations([makeReview({ 2: null })])).toEqual(
      expect.arrayContaining([expect.stringContaining("time is not an array")]),
    );
    expect(contractViolations([makeReview({ 3: null })])).toEqual(
      expect.arrayContaining([expect.stringContaining("author is not an array")]),
    );
    expect(contractViolations([makeReview({ 5: 5 })])).toEqual(
      expect.arrayContaining([expect.stringContaining("id is not a string")]),
    );
    expect(contractViolations([makeReview({ 12: null })])).toEqual(
      expect.arrayContaining([expect.stringContaining("no Google source anchor")]),
    );
    expect(contractViolations([makeReview({ 4: "x" })])).toEqual(
      expect.arrayContaining([expect.stringContaining("response is not an array or null")]),
    );
    expect(contractViolations([makeReview({ 4: [null, null, 5] })])).toEqual(
      expect.arrayContaining([expect.stringContaining("response text is not a string")]),
    );
  });

  it("ships a real schema fixture with the expected anchors", () => {
    expect(schema.indices["1"]).toContain("number");
    expect(schema.indices["2"]).toContain("array");
    expect(schema.indices["3"]).toContain("array");
    expect(schema.indices["4"]).toEqual(expect.arrayContaining(["array", "null"]));
    expect(schema.indices["5"]).toContain("string");
    expect(schema.requiredIndices).toEqual(["1", "2", "3", "5"]);
  });
});
