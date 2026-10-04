import { describe, expect, it } from "vitest";
import {
  getPath,
  numberOrZero,
  stringOrDefault,
  stringOrEmpty,
  stringOrNull,
} from "../../src/sharedParser.js";

describe("getPath", () => {
  it("returns the value itself for an empty path", () => {
    const value = { a: 1 };
    expect(getPath(value, [])).toBe(value);
  });

  it("traverses nested arrays", () => {
    const value = [[0, 1], [2, 3]];
    expect(getPath(value, [1, 0])).toBe(2);
  });

  it("returns undefined when the value is not an array", () => {
    expect(getPath("nope", [0])).toBeUndefined();
  });

  it("returns undefined when an intermediate value is not an array", () => {
    expect(getPath({ a: [1] }, [0])).toBeUndefined();
    expect(getPath([1], [0, 0])).toBeUndefined();
  });
});

describe("stringOrEmpty", () => {
  it("returns strings unchanged", () => {
    expect(stringOrEmpty("hello")).toBe("hello");
  });

  it("returns an empty string for non-strings", () => {
    expect(stringOrEmpty(123)).toBe("");
    expect(stringOrEmpty(null)).toBe("");
    expect(stringOrEmpty(undefined)).toBe("");
    expect(stringOrEmpty({})).toBe("");
  });
});

describe("stringOrNull", () => {
  it("returns non-empty strings unchanged", () => {
    expect(stringOrNull("hello")).toBe("hello");
  });

  it("returns null for an empty string", () => {
    expect(stringOrNull("")).toBeNull();
  });

  it("returns null for non-strings", () => {
    expect(stringOrNull(123)).toBeNull();
    expect(stringOrNull(null)).toBeNull();
    expect(stringOrNull(undefined)).toBeNull();
  });
});

describe("numberOrZero", () => {
  it("returns numbers unchanged", () => {
    expect(numberOrZero(4)).toBe(4);
    expect(numberOrZero(0)).toBe(0);
  });

  it("returns zero for non-numbers", () => {
    expect(numberOrZero("4")).toBe(0);
    expect(numberOrZero(null)).toBe(0);
    expect(numberOrZero(undefined)).toBe(0);
  });
});

describe("stringOrDefault", () => {
  it("returns non-empty strings", () => {
    expect(stringOrDefault("hello", "fallback")).toBe("hello");
  });

  it("returns the fallback for empty strings", () => {
    expect(stringOrDefault("", "fallback")).toBe("fallback");
  });

  it("returns the fallback for non-strings", () => {
    expect(stringOrDefault(null, "fallback")).toBe("fallback");
    expect(stringOrDefault(42, "fallback")).toBe("fallback");
  });
});
