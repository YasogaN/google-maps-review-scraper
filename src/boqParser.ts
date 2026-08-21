import { getPath, numberOrZero, stringOrDefault, stringOrEmpty } from "./sharedParser.js";
import type { ParsedReview } from "./types.js";

/**
 * Check whether a raw array item represents a candidate image URL.
 *
 * @param item The raw array element to inspect.
 * @returns `true` if the item looks like a Google-hosted image URL.
 */
function _isImageCandidate(item: unknown): boolean {
    if (!Array.isArray(item) || typeof item[0] !== "string") return false;
    if (item[0].includes("googleusercontent")) return true;
    return (item[0].startsWith("//") || item[0].startsWith("http")) && !item[0].includes("gstatic.com");
}

/**
 * Extract image metadata from a raw review array by scanning sub-arrays.
 *
 * @param review The raw review array.
 * @param until  The upper bound index to search within the review.
 * @returns An array of parsed image objects, or `null` if none are found.
 */
function _findImages(review: unknown[], until: number): ParsedReview["images"] {
    for (let i = 6; i < until; i++) {
        const el = review[i];
        if (!Array.isArray(el) || el.length === 0) continue;
        const entries: unknown[] = [];
        for (const item of el) {
            if (_isImageCandidate(item)) entries.push(item);
        }
        if (entries.length === 0) continue;
        return entries.map(image => ({
            id: stringOrEmpty(getPath(image, [3])),
            url: stringOrEmpty(getPath(image, [0])),
            size: { width: 0, height: 0 },
            location: { lat: 0, long: 0 },
            caption: null,
        }));
    }
    return null;
}

/**
 * Find the last index in an array whose element satisfies the predicate.
 *
 * @param arr       The array to search.
 * @param predicate A function that returns `true` for the target element.
 * @returns The last matching index, or `-1`.
 */
function _lastIndex<T>(arr: T[], predicate: (v: T | undefined) => boolean): number {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) return i;
    }
    return -1;
}

/**
 * Parse a single raw BOQ review entry into a structured `ParsedReview` object.
 *
 * @param review The raw review array from the API response.
 * @returns A parsed review object, or `null` if the entry is invalid.
 */
function _parseReview(review: unknown): ParsedReview | null {
    if (!Array.isArray(review) || review.length < 6) return null;

    const rating = numberOrZero(review[1]);

    const timeArr = review[2];
    const published = Array.isArray(timeArr) ? (timeArr[2] ?? null) : null;

    const authorArr = review[3];
    const authorName = stringOrDefault(Array.isArray(authorArr) ? authorArr[0] : null, "A Google User");
    const authorProfileUrl = stringOrEmpty(Array.isArray(authorArr) ? authorArr[1] : null);
    const authorUrl = stringOrEmpty(Array.isArray(authorArr) ? authorArr[2] : null);
    let authorId = "Unknown";
    const match = authorUrl.match(/\/contrib\/(\d+)/);
    if (match?.[1]) authorId = match[1];

    const responseArr = review[4];
    const responseText = stringOrEmpty(Array.isArray(responseArr) ? responseArr[2] : null);

    const reviewId = stringOrEmpty(review[5]);

    const googleIdx = _lastIndex(review, el => Array.isArray(el) && el[0] === "Google");
    if (googleIdx === -1) return null;

    const qaIdx = _lastIndex(
        review.slice(6, googleIdx),
        el => typeof getPath(el, [0, 0, 0]) === "string",
    );
    const qaOffset = qaIdx === -1 ? -1 : qaIdx + 6;

    let fullText: string | null = null;
    let shortText: string | null = null;
    let language: string | null = null;

    if (qaOffset !== -1) {
        if (typeof review[qaOffset - 2] === "string") shortText = review[qaOffset - 2];
        if (typeof review[qaOffset - 3] === "string") fullText = review[qaOffset - 3];
        if (typeof review[qaOffset - 4] === "string" && review[qaOffset - 4].length === 2) language = review[qaOffset - 4];
    }

    if (!fullText && !shortText) {
        for (let i = 6; i < googleIdx; i++) {
            if (typeof review[i] === "string" && review[i].length > 5 && !review[i].startsWith("http")) {
                if (!fullText) fullText = review[i];
                else if (review[i] !== fullText && !shortText) shortText = review[i];
            }
        }
    }

    const images = _findImages(review, googleIdx);

    return {
        review_id: reviewId,
        time: { published, last_edited: null },
        author: {
            name: authorName,
            profile_url: authorProfileUrl,
            url: authorUrl,
            id: authorId,
        },
        review: { rating, text: fullText ?? shortText, language },
        images,
        source: "Google Local Search Panel",
        response: {
            text: responseText,
            time: {
                published: null,
                last_edited: null,
            }
        },
    };
}

/**
 * Parse an array of raw BOQ review responses into structured `ParsedReview` objects.
 *
 * @param reviews The raw reviews array from the API response.
 * @returns An array of parsed review objects (invalid entries are skipped).
 */
export default function boqParser(reviews: unknown): ParsedReview[] {
    if (!Array.isArray(reviews)) return [];
    return reviews.reduce<ParsedReview[]>((acc, r) => {
        const parsed = _parseReview(r);
        if (parsed) acc.push(parsed);
        return acc;
    }, []);
}
