import { SortEnum } from "./types.js";
import { validateParams, fetchReviews, paginateReviews } from "./utils.js";
import parseReviews from "./parser.js";

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

        const initialData = await fetchReviews(url, sortValue, "", search_query);

        if (!initialData || !Array.isArray(initialData[2]) || initialData[2].length === 0) {
            return 0;
        }

        const nextPageToken = initialData[1];
        if (!nextPageToken || Number(pages) === 1) {
            return clean ? parseReviews(initialData[2]) : initialData[2];
        }

        return await paginateReviews(url, sortValue, pages, search_query, clean, initialData);

    } catch (e) {
        console.error("Scraper Error:", e instanceof Error ? e.message : e);
        return 0;
    }
}