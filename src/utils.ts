import listugcposts from "./listugcposts.js";
import { SortEnum } from "./types.js";
import parser from "./parser.js";

/**
 * Validates parameters for the Google Maps review scraper.
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
 */
export async function fetchReviews(url: string, sort: 1 | 2 | 3 | 4, nextPage = "", search_query = "") {
    const apiUrl = listugcposts(url, sort, nextPage, search_query);
    const response = await fetch(apiUrl);

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
 */
export async function paginateReviews(
    url: string,
    sort: 1 | 2 | 3 | 4,
    pages: string | number,
    search_query: string,
    clean: boolean,
    initialData: any
) {
    // InitialData[2] is the reviews array, InitialData[1] is the token
    let allReviews = [...(initialData[2] || [])];
    let nextPageToken = initialData[1]?.toString().replace(/"/g, "");
    let currentPage = 2;
    const maxPages = pages === "max" ? Infinity : Number(pages);

    while (nextPageToken && currentPage <= maxPages) {
        try {
            console.log(`Scraping page ${currentPage}...`);
            const data = await fetchReviews(url, sort, nextPageToken, search_query);

            if (data[2]) {
                allReviews = [...allReviews, ...data[2]];
            }

            nextPageToken = data[1]?.toString().replace(/"/g, "");

            if (!nextPageToken) break;

            // Simple back-off to prevent 429 errors
            await new Promise(resolve => setTimeout(resolve, 1500));
            currentPage++;
        } catch (error) {
            console.error(`Error on page ${currentPage}:`, error);
            break; // Stop pagination on error but return what we have
        }
    }

    // Use the optimized parser from the previous turn
    // No 'await' needed now as it's a synchronous transformation
    return clean ? parser(allReviews) : allReviews;
}

/**
 * Safely converts a hex string to a BigInt.
 * Checks for the '0x' prefix and adds it if missing.
 */
export function hexToBigInt(hex: string): bigint {
    const cleanHex = hex.startsWith("0x") ? hex : `0x${hex}`;
    return BigInt(cleanHex);
};