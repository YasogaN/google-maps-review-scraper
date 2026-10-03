import { describe, expect, it } from "vitest";
import { validateParams } from "../../src/utils.js";

const VALID_PARAMS = {
  url: "https://www.google.com/maps/place/x",
  sort_type: "relevant",
  pages: 5,
  clean: false,
};

describe("validateParams", () => {
  it("accepts valid parameters", () => {
    expect(() => validateParams({ ...VALID_PARAMS })).not.toThrow();
  });

  it("accepts every sort type", () => {
    for (const sort_type of ["relevant", "newest", "highest_rating", "lowest_rating"]) {
      expect(() => validateParams({ ...VALID_PARAMS, sort_type })).not.toThrow();
    }
  });

  it("accepts the -1 unlimited page sentinel", () => {
    expect(() => validateParams({ ...VALID_PARAMS, pages: -1 })).not.toThrow();
  });

  it("rejects non-google hosts", () => {
    expect(() => validateParams({ ...VALID_PARAMS, url: "https://example.com" })).toThrow(
      /Invalid URL format/,
    );
  });

  it("rejects malformed urls", () => {
    expect(() => validateParams({ ...VALID_PARAMS, url: "not a url" })).toThrow(
      /Invalid URL format/,
    );
  });

  it("rejects unknown sort types", () => {
    expect(() => validateParams({ ...VALID_PARAMS, sort_type: "bogus" })).toThrow(
      /Invalid sort type/,
    );
  });

  it("rejects NaN page counts", () => {
    expect(() => validateParams({ ...VALID_PARAMS, pages: Number.NaN })).toThrow(
      /Invalid pages value/,
    );
  });

  it("rejects a non-boolean clean flag", () => {
    expect(() =>
      validateParams({ ...VALID_PARAMS, clean: "yes" as unknown as boolean }),
    ).toThrow(/Invalid value for 'clean'/);
  });
});
