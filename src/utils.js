import listugcposts from "./listugcposts.js";
import axios from "axios";
import { SortEnum } from "./types.js";

/**
 * Helper function that validates the parameters for the Google Maps review scraper.
 *
 * @param {string} url - The URL to validate. Must include "https://www.google.com/maps/place/".
 * @param {string} sort_type - The sort type to validate. Must be a valid key in SortEnum.
 * @param {string|number} pages - The number of pages to validate. Must be "max" or a number.
 * @throws {Error} Throws an error if the URL is invalid.
 * @throws {Error} Throws an error if the sort type is invalid.
 * @throws {Error} Throws an error if the pages value is invalid.
 */
export function validateParams(url, sort_type, pages) {
    if (!url.includes("https://www.google.com/maps/place/")) {
        throw new Error(`Invalid URL: ${url}`);
    }
    if (!SortEnum[sort_type]) {
        throw new Error(`Invalid sort value: ${sort_type}`);
    }
    if (pages !== "max" && isNaN(pages)) {
        throw new Error(`Invalid pages value: ${pages}`);
    }
}

/**
 * Helper function to fetche reviews from a given URL with specified sorting and pagination options.
 *
 * @param {string} url - The URL to fetch reviews from.
 * @param {string} sort - The sorting option for the reviews.
 * @param {string} [nextPage=""] - The token for the next page of reviews, if any.
 * @param {string} [search_query=""] - The search query to filter reviews, if any.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data of reviews.
 * @throws {Error} If the request fails or the response status is not 200.
 */
export async function fetchReviews(url, sort, nextPage = "", search_query = "") {
    const apiUrl = await listugcposts(url, sort, nextPage, search_query);
    const response = await axios.get(apiUrl);
    if (response.status !== 200) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
    }
    const data = response.data.split(")]}'")[1];
    return JSON.parse(data);
}

/**
 * Helper function to paginate through reviews from a given URL, sorting and searching as specified.
 *
 * @param {string} url - The URL to fetch reviews from.
 * @param {string} sort - The sorting parameter for the reviews.
 * @param {string|number} pages - The number of pages to paginate through, or "max" for all pages.
 * @param {string} search_query - The search query to filter reviews.
 * @param {Array} initialData - The initial data containing reviews and the next page token.
 * @returns {Promise<Array>} - A promise that resolves to an array of reviews.
 */
export async function paginateReviews(url, sort, pages, search_query, initialData) {
    let reviews = initialData[2];
    let nextPage = initialData[1]?.replace(/"/g, "");
    let currentPage = 2;

    while (nextPage && (pages === "max" || currentPage <= parseInt(pages))) {
        console.log(`Scraping page ${currentPage}...`);
        const data = await fetchReviews(url, sort, nextPage, search_query);
        reviews = reviews.concat(data[2]);
        if (!data[1]) break;
        nextPage = data[1]?.replace(/"/g, "");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Avoid rate-limiting
        currentPage++;
    }

    return reviews;
}