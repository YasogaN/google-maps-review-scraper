import { SortEnum } from "./types.js";
import { validateParams, paginateReviews } from "./utils.js";
import fetchSessionToken from "./extraction.js";

/**
 * Scrapes reviews from a given Google Maps URL.
 *
 * @param {string} url - The URL of the Google Maps location to scrape reviews from.
 * @param {Object} options - The options for scraping.
 * @param {string} [options.sort_type="relevent"] - The type of sorting for the reviews ("relevent", "newest", "highest_rating", "lowest_rating").
 * @param {string} [options.search_query=""] - The search query to filter reviews.
 * @param {string} [options.pages="max"] - The number of pages to scrape (default is "max"). If set to a number, it will scrape that number of pages (results will be 10 * pages) or until there are no more reviews.
 * @param {boolean} [options.clean=false] - Whether to return clean reviews or not.
 * @returns {Promise<Array|number>} - Returns an array of reviews or 0 if no reviews are found.
 * @throws {Error} - Throws an error if the URL is not provided or if fetching reviews fails.
 */
export async function scraper(
    url: string,
    { sort_type = "relevent", search_query = "", pages = "max", clean = false } = {}
) {
    try {
        validateParams(url, sort_type, pages, clean);

        const sortValue = SortEnum[sort_type as keyof typeof SortEnum] as 1 | 2 | 3 | 4;

        const m = [...url.matchAll(/!1s([a-zA-Z0-9_:]+)!/g)];
        if (!m || !m[0] || !m[0][1]) {
            throw new Error("Invalid URL");
        }
        const placeId = m[1]?.[1] ? m[1][1] : m[0][1];

        const sessionToken = await fetchSessionToken(placeId);

        if (!sessionToken) {
            throw new Error("Could not fetch session token.");
        }

        await new Promise(r => setTimeout(r, 2000));

        const reviews = await paginateReviews(placeId, sortValue, pages, search_query, clean, sessionToken);

        if (!reviews || (Array.isArray(reviews) && reviews.length === 0)) {
            return 0;
        }

        return reviews;

    } catch (e) {
        console.error("Scraper Error:", e instanceof Error ? e.message : e);
        return 0;
    }
}