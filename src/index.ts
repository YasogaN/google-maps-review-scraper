import { SortEnum, type JsonArray, type ParsedReview, type Scraper } from "./types.js";
import { validateParams, paginateReviews } from "./utils.js";
import { createClient } from "./client.js";

/**
 * Scrape Google Maps reviews for a given place URL.
 *
 * @param options                    - Scraper configuration.
 * @param options.url                - Full Google Maps place URL.
 * @param options.sort_type          - Sort order: `"relevant"`, `"newest"`, `"highest_rating"`, `"lowest_rating"`.
 * @param options.pages              - Number of pages to fetch (`-1` for all, default).
 * @param options.clean              - When `true`, return parsed `ParsedReview` objects.
 * @param options.proxy              - Optional proxy configuration.
 * @param options.proxy.proxyUrl     - Proxy URL string.
 * @param options.proxy.ignoreTls    - Bypass TLS errors when using the proxy.
 * @returns An array of raw review data or parsed `ParsedReview` objects.
 * @throws {Error} If the URL is invalid or scraping fails.
 */
export async function scraper(
  {
    url,
    sort_type = "relevant",
    pages = -1,
    clean = false,
    proxy: {
      proxyUrl = undefined,
      ignoreTls = false
    } = {}
  }: Scraper
): Promise<ParsedReview[] | JsonArray> {
  try {
    validateParams({ url, sort_type, pages, clean });

    const sortValue = SortEnum[sort_type as keyof typeof SortEnum] as 1 | 2 | 3 | 4;

    const m = [...url.matchAll(/!1s([a-zA-Z0-9_:]+)!/g)];
    if (!m[0]?.[1]) {
      throw new Error("Invalid URL");
    }
    const placeId = m[1]?.[1] ? m[1][1] : m[0][1];

    const client = createClient({ proxy: { url: proxyUrl, tls: ignoreTls } });

    const reviews = await paginateReviews({ placeId, sortOrder: sortValue, pages, clean, client });

    if (reviews.length === 0) {
      return [];
    }

    return reviews;
  } catch (e) {
    throw new Error(`Scraper Error: ${e instanceof Error ? e.message : e}`);
  }
}

