import listugcposts from "./listugcposts.js";
import { SortEnum } from "./types.js";
import { URL } from "url";
import parser from "./parser.js";

/**
 * Validates parameters for the Google Maps review scraper.
 *
 * @param {string} url - Must include "https://www.google.com/maps/place/".
 * @param {string} sort_type - Must be a valid key in SortEnum.
 * @param {string|number} pages - "max" or a number.
 * @param {boolean} clean - Must be a boolean.
 * @throws {Error} If any parameter is invalid.
 */
export function validateParams(url, sort_type, pages, clean) {
    const parsedUrl = new URL(url);
    if (parsedUrl.host !== "www.google.com" || !parsedUrl.pathname.startsWith("/maps/place/")) {
        throw new Error(`Invalid URL: ${url}`);
    }
    if (!SortEnum[sort_type]) {
        throw new Error(`Invalid sort type: ${sort_type}`);
    }
    if (pages !== "max" && isNaN(pages)) {
        throw new Error(`Invalid pages value: ${pages}`);
    }
    if (typeof clean !== "boolean") {
        throw new Error(`Invalid value for 'clean': ${clean}`);
    }
}

/**
 * Fetches reviews from a given URL with sorting and pagination options.
 *
 * @param {string} url - The URL to fetch reviews from.
 * @param {string} sort - The sorting option for the reviews.
 * @param {string} [nextPage=""] - Token for the next page, if any.
 * @param {string} [search_query=""] - Search query to filter reviews, if any.
 * @returns {Promise<Object>} Parsed JSON data of reviews.
 * @throws {Error} If the request fails or the response is invalid.
 */
export async function fetchReviews(url, sort, nextPage = "", search_query = "") {
    const apiUrl = listugcposts(url, sort, nextPage, search_query);
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }
    const textData = await response.text();
    const rawData = textData.split(")]}'")[1];
    return JSON.parse(rawData);
}


/**
 * Paginates through reviews from a given URL.
 *
 * @param {string} url - The URL to fetch reviews from.
 * @param {string} sort - Sorting parameter for reviews.
 * @param {string|number} pages - Number of pages or "max".
 * @param {string} search_query - Search query to filter reviews.
 * @param {boolean} clean - Whether to clean and parse the data.
 * @param {Array} initialData - Initial data containing reviews and next page token.
 * @returns {Promise<Array>} Array of reviews or parsed reviews.
 */
export async function paginateReviews(url, sort, pages, search_query, clean, initialData) {
    let reviews = initialData[2];
    let nextPage = initialData[1]?.replace(/"/g, "");
    let currentPage = 2;
    while (nextPage && (pages === "max" || currentPage <= +pages)) {
        console.log(`Scraping page ${currentPage}...`);
        const data = await fetchReviews(url, sort, nextPage, search_query);
        reviews = [...reviews, ...data[2]];
        nextPage = data[1]?.replace(/"/g, "");
        if (!nextPage) break;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Avoid rate-limiting
        currentPage++;
    }
    return clean ? await parser(reviews) : reviews;
}
