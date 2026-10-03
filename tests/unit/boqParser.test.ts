import { describe, expect, it } from "vitest";
import boqParser from "../../src/boqParser.js";
import { makeReview, qaElement } from "../helpers/boq.js";

describe("boqParser", () => {
  it("returns an empty array for non-array input", () => {
    expect(boqParser(null)).toEqual([]);
    expect(boqParser("nope")).toEqual([]);
    expect(boqParser({})).toEqual([]);
  });

  it("skips invalid review entries", () => {
    expect(boqParser([null, "x", 42, [1, 2, 3]])).toEqual([]);
  });

  it("parses a complete review including images and an owner response", () => {
    const [parsed] = boqParser([makeReview()]);

    expect(parsed).toBeDefined();
    expect(parsed!.review_id).toBe("review-1");
    expect(parsed!.time).toEqual({ published: 1700000000000, last_edited: null });
    expect(parsed!.author).toEqual({
      name: "Test User",
      profile_url: "pic",
      url: "https://www.google.com/maps/contrib/123456789/reviews",
      id: "123456789",
    });
    expect(parsed!.review).toEqual({ rating: 5, text: "Full review text", language: "en" });
    expect(parsed!.source).toBe("Google Local Search Panel");
    expect(parsed!.response).toEqual({
      text: "Thanks for visiting",
      time: { published: "1 day ago", last_edited: null },
    });
    expect(parsed!.images).toEqual([
      {
        id: "img-1",
        url: "//cdn.example.com/a",
        size: { width: 0, height: 0 },
        location: { lat: 0, long: 0 },
        caption: null,
      },
      {
        id: "img-2",
        url: "https://lh3.googleusercontent.com/a",
        size: { width: 0, height: 0 },
        location: { lat: 0, long: 0 },
        caption: null,
      },
      {
        id: "img-3",
        url: "http://example.com/a",
        size: { width: 0, height: 0 },
        location: { lat: 0, long: 0 },
        caption: null,
      },
    ]);
  });

  it("defaults rating to 0 and published to null when values are missing", () => {
    const [parsed] = boqParser([makeReview({ 1: "not a number", 2: null })]);
    expect(parsed!.review.rating).toBe(0);
    expect(parsed!.time.published).toBeNull();
  });

  it("defaults published to null when the timestamp is absent", () => {
    const [parsed] = boqParser([makeReview({ 2: ["just now"] })]);
    expect(parsed!.time.published).toBeNull();
  });

  it("falls back to anonymous author defaults when the author object is missing", () => {
    const [parsed] = boqParser([makeReview({ 3: null })]);
    expect(parsed!.author).toEqual({
      name: "A Google User",
      profile_url: "",
      url: "",
      id: "Unknown",
    });
  });

  it("uses Unknown author id when the contributor url does not match", () => {
    const [parsed] = boqParser([makeReview({ 3: ["Anon", "pic", "https://example.com/x"] })]);
    expect(parsed!.author).toEqual({
      name: "Anon",
      profile_url: "pic",
      url: "https://example.com/x",
      id: "Unknown",
    });
  });

  it("returns null response when there is no owner reply", () => {
    expect(boqParser([makeReview({ 4: null })])[0]!.response).toBeNull();
  });

  it("returns null response when the reply array has no text", () => {
    expect(boqParser([makeReview({ 4: [null] })])[0]!.response).toBeNull();
    expect(boqParser([makeReview({ 4: [null, null, 5] })])[0]!.response).toBeNull();
    expect(boqParser([makeReview({ 4: [null, null, ""] })])[0]!.response).toBeNull();
  });

  it("returns null response published when the reply has no time", () => {
    const [parsed] = boqParser([makeReview({ 4: [null, null, "hello"] })]);
    expect(parsed!.response).toEqual({
      text: "hello",
      time: { published: null, last_edited: null },
    });
  });

  it("skips reviews without a Google source anchor", () => {
    expect(boqParser([makeReview({ 12: null })])).toEqual([]);
  });

  it("falls back to scanning for review text when there is no QA anchor", () => {
    const review = makeReview({
      7: "First long string",
      8: "First long string",
      9: "Second long string",
      10: "http://example.com",
      11: "short",
    });
    const [parsed] = boqParser([review]);
    expect(parsed!.review.text).toBe("First long string");
    expect(parsed!.review.language).toBeNull();
  });

  it("leaves review text null when no candidate text is found", () => {
    const review = makeReview({ 6: [], 7: null, 8: 5, 9: {}, 10: [], 11: qaElement() });
    const [parsed] = boqParser([review]);
    expect(parsed!.review.text).toBeNull();
    expect(parsed!.review.language).toBeNull();
  });

  it("ignores a language value that is not exactly two characters", () => {
    const [parsed] = boqParser([makeReview({ 7: "english" })]);
    expect(parsed!.review.language).toBeNull();
    expect(parsed!.review.text).toBe("Full review text");
  });

  it("returns null images when no image candidates are present", () => {
    const review = makeReview({
      6: [],
      7: "not an array",
      8: [1, 2],
      9: [["https://lh3.googleusercontent.com/real", null, null, "id", 0]],
    });
    const [parsed] = boqParser([review]);
    expect(parsed!.images).toHaveLength(1);
    expect(parsed!.images![0]!.id).toBe("id");
  });

  it("ignores image holders that are empty or contain no candidates", () => {
    const review = makeReview({
      6: [],
      7: [1, 2, 3],
      8: ["not a url"],
      9: "text",
      10: null,
      11: qaElement(),
    });
    const [parsed] = boqParser([review]);
    expect(parsed!.images).toBeNull();
  });

  it("parses multiple reviews and discards invalid ones", () => {
    const result = boqParser([makeReview(), null, makeReview({ 5: "review-2" })]);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.review_id)).toEqual(["review-1", "review-2"]);
  });
});
