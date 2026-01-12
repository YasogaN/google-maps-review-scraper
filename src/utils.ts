import { client } from "./client.js";
import listugcposts from "./listugcposts.js";
import { SortEnum } from "./types.js";
import parser from "./parser.js";

/**
 * Validates parameters for the Google Maps review scraper.
 * @param {string} url - The URL of the Google Maps location to scrape reviews from.
 * @param {string} sort_type - The type of sorting for the reviews ("relevent", "newest", "highest_rating", "lowest_rating").
 * @param {string | number} pages - The number of pages to scrape (default is "max"). If set to a number, it will scrape that number of pages (results will be 10 * pages) or until there are no more reviews.
 * @param {boolean} clean - Whether to return clean reviews or not.
 */
export function validateParams(url: string, sort_type: string, pages: string | number, clean: boolean) {
    try {
        const parsedUrl = new URL(url);
        // Google Maps URLs can be google.com/maps/place/ or maps.app.goo.gl
        // If you strictly want the desktop web version:
        if (!parsedUrl.host.includes("google.com")) {
            throw new Error(`Invalid host: ${parsedUrl.host}`);
        }
    } catch (e) {
        throw new Error(`Invalid URL format: ${url}`);
    }

    if (!(sort_type in SortEnum)) {
        throw new Error(`Invalid sort type: ${sort_type}. Expected: ${Object.keys(SortEnum).join(", ")}`);
    }

    if (pages !== "max" && isNaN(Number(pages))) {
        throw new Error(`Invalid pages value: ${pages}`);
    }

    if (typeof clean !== "boolean") {
        throw new Error(`Invalid value for 'clean': ${clean}`);
    }
}

/**
 * Fetches and handles the XSSI security prefix.
 * @param {string} placeId - The CID (e.g., 0x3ae2575b18d322ff:0x3c53adf6ab35b12b)
 * @param {1 | 2 | 3 | 4} sort - The type of sorting for the reviews (1: Most Relevant, 2: Newest, 3: Highest Rating, 4: Lowest Rating).
 * @param {string} nextPage - The next page token for pagination.
 * @param {string} search_query - The search query to filter reviews.
 * @param {string} sessionToken - The session token for authentication.
 */
export async function fetchReviews(placeId: string, sort: 1 | 2 | 3 | 4, nextPage = "", search_query = "", sessionToken: string) {
    const apiUrl = listugcposts(placeId, sort, nextPage, search_query, sessionToken);
    const response = await client.fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const textData = await response.text();

    // Safety check for the prefix before splitting
    const parts = textData.split(")]}'");
    const rawJson = parts.length > 1 ? parts[1] : parts[0];

    if (!rawJson) {
        throw new Error("No valid JSON data found in the response.");
    }

    return JSON.parse(rawJson);
}

/**
 * Paginates through reviews.
 * @param {string} placeId - The CID (e.g., 0x3ae2575b18d322ff:0x3c53adf6ab35b12b)
 * @param {1 | 2 | 3 | 4} sort - The type of sorting for the reviews (1: Most Relevant, 2: Newest, 3: Highest Rating, 4: Lowest Rating).
 * @param {string | number} pages - The number of pages to scrape (default is "max"). If set to a number, it will scrape that number of pages (results will be 10 * pages) or until there are no more reviews.
 * @param {string} search_query - The search query to filter reviews.
 * @param {boolean} clean - Whether to return clean reviews or not.
 * @param {string} sessionToken - The session token for authentication.
 */
export async function paginateReviews(
    placeId: string,
    sort: 1 | 2 | 3 | 4,
    pages: string | number,
    search_query: string,
    clean: boolean,
    sessionToken: string
) {
    const initialData = await fetchReviews(placeId, sort, "", search_query, sessionToken);

    if (!initialData || !Array.isArray(initialData[2]) || initialData[2].length === 0) {
        return [];
    }

    let allReviews = [...(initialData[2] || [])];
    let nextToken = initialData[1]?.toString().replace(/"/g, "");

    if (!nextToken || Number(pages) === 1) {
        return clean ? parser(allReviews) : allReviews;
    }

    const max = pages === "max" ? Infinity : Number(pages);
    let pageCount = 1;

    while (nextToken && pageCount < max) {
        try {
            const data = await fetchReviews(placeId, sort, nextToken, search_query, sessionToken);

            if (data[2] && data[2].length > 0) {
                allReviews.push(...data[2]);
            }

            // Update nextToken for the next iteration
            const newNextToken = data[1]?.toString().replace(/"/g, "");

            if (!newNextToken || newNextToken === nextToken) {
                break;
            }

            nextToken = newNextToken;
            pageCount++;

        } catch (error) {
            console.error("Error fetching page:", error);
            break;
        }
    }

    return clean ? parser(allReviews) : allReviews;

}
