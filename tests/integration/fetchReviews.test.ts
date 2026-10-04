import { describe, expect, it } from "vitest";
import { extractPage, fetchReviews } from "../../src/utils.js";
import { asClient, clientOf, textResponse } from "../helpers/boq.js";

describe("fetchReviews", () => {
  it("parses json after the XSSI prefix", async () => {
    const client = clientOf(textResponse(")]}'\n[1,2]"));
    expect(
      await fetchReviews({ placeId: "p", sortOrder: 1, client: asClient(client) }),
    ).toEqual([1, 2]);
  });

  it("parses json without the XSSI prefix", async () => {
    const client = clientOf(textResponse("[3,4]"));
    expect(
      await fetchReviews({ placeId: "p", sortOrder: 2, client: asClient(client) }),
    ).toEqual([3, 4]);
  });

  it("throws on a non-ok response", async () => {
    const client = clientOf(textResponse("nope", false));
    await expect(
      fetchReviews({ placeId: "p", sortOrder: 1, client: asClient(client) }),
    ).rejects.toThrow(/Failed to fetch/);
  });

  it("throws when no json payload is present", async () => {
    const client = clientOf(textResponse(")]}'"));
    await expect(
      fetchReviews({ placeId: "p", sortOrder: 1, client: asClient(client) }),
    ).rejects.toThrow(/No valid JSON data/);
  });

  it("throws when the payload is not an array", async () => {
    const client = clientOf(textResponse("{}"));
    await expect(
      fetchReviews({ placeId: "p", sortOrder: 1, client: asClient(client) }),
    ).rejects.toThrow(/Invalid JSON data/);
  });

  it("throws when the payload is not valid json", async () => {
    const client = clientOf(textResponse("[not json"));
    await expect(
      fetchReviews({ placeId: "p", sortOrder: 1, client: asClient(client) }),
    ).rejects.toThrow();
  });
});

describe("extractPage", () => {
  function payloadWith(node: unknown): unknown[] {
    return [...new Array(10).fill(null), node];
  }

  it("returns null for non-arrays and short arrays", () => {
    expect(extractPage("nope")).toBeNull();
    expect(extractPage([1])).toBeNull();
  });

  it("returns null for invalid payloads", () => {
    expect(extractPage([1, "nope"])).toBeNull();
    expect(extractPage([1, new Array(10).fill(null)])).toBeNull();
    expect(extractPage([1, new Array(11).fill(null)])).toBeNull();
  });

  it("returns null for invalid nodes", () => {
    expect(extractPage([1, payloadWith("node")])).toBeNull();
    expect(extractPage([1, payloadWith([null])])).toBeNull();
    expect(extractPage([1, payloadWith([null, null, "x"])])).toBeNull();
  });

  it("defaults nextToken when it is missing or not a string", () => {
    const reviews = [{ a: 1 }];
    expect(extractPage([1, payloadWith([null, null, reviews])])).toEqual({
      reviews,
      nextToken: "",
    });
    expect(extractPage([1, payloadWith([null, null, reviews, null, null, null, 123])])).toEqual({
      reviews,
      nextToken: "",
    });
  });

  it("returns the reviews and pagination token", () => {
    const reviews = [{ a: 1 }];
    expect(extractPage([1, payloadWith([null, null, reviews, null, null, null, "tok"])])).toEqual({
      reviews,
      nextToken: "tok",
    });
  });
});
