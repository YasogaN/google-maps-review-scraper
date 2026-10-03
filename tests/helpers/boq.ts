import { vi } from "vitest";

/**
 * Shared builders for BOQ review/page fixtures used across the unit,
 * integration and live test suites.
 */

export const GOOGLE_SOURCE = ["Google", ["img"], null, null, 1];

/**
 * An element that exercises every branch of `_isImageCandidate`: non-array
 * items, arrays whose first entry is not a string, gstatic URLs, non-http
 * schemes, protocol-relative URLs, googleusercontent URLs and plain http URLs.
 */
export function imageElement(): unknown[] {
  return [
    123,
    [123],
    ["https://gstatic.com/x"],
    ["ftp://example.com/x"],
    ["//cdn.example.com/a", "caption", "//report", "img-1", 0.5],
    ["https://lh3.googleusercontent.com/a", "caption", "//report", "img-2", 0.5],
    ["http://example.com/a", "caption", "//report", "img-3", 0.5],
  ];
}

export function qaElement(): unknown[] {
  return [[["QUESTION_ID"], "Question", 2, null, null]];
}

/**
 * Build a syntactically valid BOQ review array. Indexes 7-9 are the language,
 * full text and short text relative to the QA anchor at index 11; index 12 is
 * the Google source object that anchors the end of the review.
 */
export function makeReview(overrides: Record<number, unknown> = {}): unknown[] {
  const review: unknown[] = [
    null,
    5,
    ["2 days ago", null, 1700000000000],
    ["Test User", "pic", "https://www.google.com/maps/contrib/123456789/reviews", 10, 2],
    [null, "1 day ago", "Thanks for visiting", null, "English", "translated", null, "English", 1, "report"],
    "review-1",
    imageElement(),
    "en",
    "Full review text",
    "Short text",
    null,
    qaElement(),
    GOOGLE_SOURCE,
  ];
  for (const [index, value] of Object.entries(overrides)) {
    review[Number(index)] = value;
  }
  return review;
}

/** A minimal review that still parses successfully. */
export function validReview(id = "r1"): unknown[] {
  return [
    null,
    5,
    ["2 days ago", null, 1],
    ["Name", "pic", "https://www.google.com/maps/contrib/1/reviews"],
    null,
    id,
    ["Google"],
  ];
}

/** A minimal owner response array: [?, time, text, ...]. */
export function responseElement(text = "Thanks for visiting", published: unknown = "1 day ago"): unknown[] {
  return [null, published, text, null, "English"];
}

/** Build the parsed `data` array shape consumed by `extractPage`. */
export function makePage(reviews: unknown[], nextToken?: string): unknown[] {
  const node: unknown[] = [null, null, reviews];
  if (nextToken !== undefined) node[6] = nextToken;
  const payload: unknown[] = new Array(11).fill(null);
  payload[10] = node;
  return [null, payload];
}

/** Build a raw JSON body shaped like the BOQ response consumed by `extractPage`. */
export function pageBody(reviews: unknown[], nextToken?: string): string {
  return JSON.stringify(makePage(reviews, nextToken));
}

export interface FakeResponse {
  ok: boolean;
  status: number;
  statusText: string;
  text: () => Promise<string>;
}

export function textResponse(body: string, ok = true): FakeResponse {
  return {
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    text: async () => body,
  };
}

export function clientOf(...responses: Array<FakeResponse | Error>): { fetch: ReturnType<typeof vi.fn> } {
  const fetch = vi.fn();
  for (const response of responses) {
    if (response instanceof Error) fetch.mockRejectedValueOnce(response);
    else fetch.mockResolvedValueOnce(response);
  }
  return { fetch };
}

export function asClient(client: { fetch: ReturnType<typeof vi.fn> }): never {
  return client as never;
}
