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
 * @param {string} url - The URL of the Google Maps location to scrape reviews from.
 * @param {1 | 2 | 3 | 4} sort - The type of sorting for the reviews (1: Most Relevant, 2: Newest, 3: Highest Rating, 4: Lowest Rating).
 * @param {string} nextPage - The next page token for pagination.
 * @param {string} search_query - The search query to filter reviews.
 * @param {string} sessionToken - The session token for authentication.
 */
export async function fetchReviews(url: string, sort: 1 | 2 | 3 | 4, nextPage = "", search_query = "", sessionToken: string) {
    const apiUrl = listugcposts(url, sort, nextPage, search_query, sessionToken);
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
 * @param {string} url - The URL of the Google Maps location to scrape reviews from.
 * @param {1 | 2 | 3 | 4} sort - The type of sorting for the reviews (1: Most Relevant, 2: Newest, 3: Highest Rating, 4: Lowest Rating).
 * @param {string | number} pages - The number of pages to scrape (default is "max"). If set to a number, it will scrape that number of pages (results will be 10 * pages) or until there are no more reviews.
 * @param {string} search_query - The search query to filter reviews.
 * @param {boolean} clean - Whether to return clean reviews or not.
 * @param {any} initialData - The initial data returned from the first fetch.
 * @param {string} sessionToken - The session token for authentication.
 */
export async function paginateReviews(
    url: string,
    sort: 1 | 2 | 3 | 4,
    pages: string | number,
    search_query: string,
    clean: boolean,
    initialData: any,
    sessionToken: string
) {
    let allReviews = [...(initialData[2] || [])];
    let nextToken = initialData[1]?.toString().replace(/"/g, "");

    if (!nextToken) {
        return clean ? parser(allReviews) : allReviews;
    }

    const max = pages === "max" ? Infinity : Number(pages);

    const BATCH_SIZE = 10;
    let batchStart = 0;

    while (true) {
        const batchTokens = [];

        const pagesNeeded = (max === Infinity) ? Infinity : max - 1 - batchStart;
        if (pagesNeeded <= 0) break;

        const currentBatchSize = Math.min(BATCH_SIZE, pagesNeeded);

        for (let i = 0; i < currentBatchSize; i++) {
            batchTokens.push(nextToken);
            nextToken = calculateNextId(nextToken);
        }

        if (batchTokens.length === 0) break;

        console.log(`Scraping pages batch starting with token prefix ${batchTokens[0].substring(0, 10)}...`);

        const results = await Promise.allSettled(
            batchTokens.map(token => fetchReviews(url, sort, token, search_query, sessionToken))
        );

        let stopPagination = false;

        for (const res of results) {
            if (res.status === "fulfilled") {
                const data = res.value;
                if (data[2] && data[2].length > 0) {
                    allReviews.push(...data[2]);
                } else {
                    stopPagination = true;
                }
            } else {
                console.error("Error fetching page:", res.reason);
            }
        }

        batchStart += batchTokens.length;

        if (stopPagination || (max !== Infinity && batchStart >= max - 1)) {
            break;
        }

        if (max === Infinity && !stopPagination) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return clean ? parser(allReviews) : allReviews;

}


/**
 * Calculates the next sequential ID based on the provided Base64 pattern.
 * @param {string} base64Str - The Base64 string to calculate the next ID from.
 * @returns {string} The next sequential ID.
 */
export function calculateNextId(base64Str: string): string {
    // Decode Base64 to a Buffer (Node.js) or Uint8Array (Browser)
    let buf: any;
    if (typeof (globalThis as any).Buffer !== 'undefined') {
        buf = (globalThis as any).Buffer.from(base64Str, 'base64');
    } else {
        const binaryString = atob(base64Str);
        buf = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            buf[i] = binaryString.charCodeAt(i);
        }
    }

    // Increment the value (Starting from the last byte)
    // This logic handles carry-over (e.g., if a byte is 255, it resets to 0 and increments the next)
    for (let i = buf.length - 1; i >= 0; i--) {
        if (buf[i] < 255) {
            buf[i]++;
            break;
        } else {
            buf[i] = 0;
        }
    }

    // Re-encode the modified buffer back to Base64
    if (typeof (globalThis as any).Buffer !== 'undefined') {
        return buf.toString('base64').replace(/=/g, '');
    } else {
        let binary = '';
        buf.forEach((b: number) => binary += String.fromCharCode(b));
        return btoa(binary).replace(/=/g, '');
    }
}
