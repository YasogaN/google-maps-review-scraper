import getBoqUrl from "./boqEndpoint.js";
import boqParser from "./boqParser.js";
import { SortEnum, type FetchReviewsParams, type JsonArray, type PaginateReviewsParams, type ParsedReview, type Validate } from "./types.js";

/**
 * Validate scraper input parameters, throwing on invalid values.
 *
 * @param options           - The parameters to validate.
 * @param options.url       - The Google Maps URL (must be on `google.com` or a subdomain).
 * @param options.sort_type - Sort order name key that resolves to a numeric `SortEnum` value.
 * @param options.pages     - Number of pages (must be a number).
 * @param options.clean     - Whether to return parsed reviews (must be boolean).
 * @throws {Error} If any parameter is invalid.
 */
export function validateParams({ url, sort_type, pages, clean }: Validate) {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }

  // A trailing dot denotes the DNS root (e.g. "www.google.com."), so strip one
  // optional dot to treat fully-qualified hostnames the same as their normal form.
  const host = parsedUrl.hostname.replace(/\.$/, "");
  if (host !== "google.com" && !host.endsWith(".google.com")) {
    throw new Error(`Invalid host: ${host}`);
  }

  // Numeric TypeScript enums emit a reverse mapping, so `SortEnum` also has the
  // keys "1"-"4" whose values are the *name* strings. Resolving the value and
  // requiring a number rejects those reverse keys (and inherited keys) rather
  // than accepting mere key presence.
  const sortValue = SortEnum[sort_type as keyof typeof SortEnum];
  if (typeof sortValue !== "number") {
    const validSortTypes = Object.keys(SortEnum).filter((key) => Number.isNaN(Number(key)));
    throw new Error(`Invalid sort type: ${sort_type}. Expected: ${validSortTypes.join(", ")}`);
  }

  if (Number.isNaN(pages)) {
    throw new Error(`Invalid pages value: ${pages}`);
  }

  if (typeof clean !== "boolean") {
    throw new Error(`Invalid value for 'clean': ${clean}`);
  }
}

/**
 * Fetch a single page of raw reviews from the BOQ endpoint.
 *
 * @param options                 - The fetch parameters.
 * @param options.placeId         - The Google Place ID.
 * @param options.sortOrder       - Sort order enum value.
 * @param options.client          - The HTTP client to use.
 * @param options.paginationToken - Token for fetching the next page.
 * @returns The raw JSON array response.
 * @throws {Error} On fetch failure or invalid response format.
 */
export async function fetchReviews({ placeId, sortOrder, client, paginationToken = "" }: FetchReviewsParams): Promise<JsonArray> {
  const apiUrl = getBoqUrl({ placeId, sortOrder, paginationToken });
  const response = await client.fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const textData = await response.text();

  const parts = textData.split(")]}'");
  const rawJson = parts.length > 1 ? parts[1] : parts[0];

  if (!rawJson) {
    throw new Error("No valid JSON data found in the response.");
  }

  const data: unknown = JSON.parse(rawJson);
  if (!Array.isArray(data)) {
    throw new Error("Invalid JSON data found in the response.");
  }

  return data as JsonArray;
}

/**
 * Extract the review array and pagination token from a raw BOQ response.
 *
 * @param data The raw JSON-parsed response.
 * @returns An object with `reviews` and `nextToken`, or `null` if extraction fails.
 */
export function extractPage(data: unknown): { reviews: JsonArray; nextToken: string } | null {
  if (!Array.isArray(data) || data.length < 2) return null;
  const payload = data[1];
  if (!Array.isArray(payload) || payload.length <= 10 || !payload[10]) return null;
  const node = payload[10];
  if (!Array.isArray(node) || node.length < 3 || !Array.isArray(node[2])) return null;
  return {
    reviews: node[2] as JsonArray,
    nextToken: node.length > 6 && typeof node[6] === "string" ? node[6] : "",
  };
}

/**
 * Fetch multiple pages of reviews, optionally parsing into structured objects.
 *
 * @param options           - Pagination parameters.
 * @param options.placeId   - The Google Place ID.
 * @param options.sortOrder - Sort order enum value.
 * @param options.pages     - Number of pages to fetch (`-1` for all).
 * @param options.clean     - When `true`, return parsed `ParsedReview` objects.
 * @param options.client    - The HTTP client to use.
 * @returns An array of raw review data or parsed `ParsedReview` objects.
 */
export async function paginateReviews({ placeId, sortOrder, pages, clean, client }: PaginateReviewsParams): Promise<ParsedReview[] | JsonArray> {
  const initialData = await fetchReviews({ placeId, sortOrder, client });
  const initial = extractPage(initialData);
  if (!initial) return [];

  let allReviews = [...initial.reviews];
  let nextToken = initial.nextToken;

  if (!nextToken || pages === 1) {
    return clean ? boqParser(allReviews) : allReviews;
  }

  const maxReviews = pages === -1 ? Infinity : pages * 10;

  while (nextToken && allReviews.length < maxReviews) {
    try {
      const data = await fetchReviews({ placeId, sortOrder, client, paginationToken: nextToken });
      const page = extractPage(data);
      if (!page) break;

      allReviews.push(...page.reviews);

      if (!page.nextToken || page.nextToken === nextToken) break;

      nextToken = page.nextToken;
    } catch (error) {
      console.error("Error fetching page:", error);
      break;
    }
  }

  if (pages !== -1 && allReviews.length > maxReviews) {
    allReviews = allReviews.slice(0, maxReviews);
  }

  return clean ? boqParser(allReviews) : allReviews;
}
