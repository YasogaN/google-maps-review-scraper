import { hexToDec } from "hex2dec";

/**
 * Converts a Google Maps place URL to a reviews endpoint URL.
 * @param {string} url Google Maps place URL.
 * @param {string} [p=""] Base64 encoding of the page number.
 * @returns {string} URL to fetch reviews.
 * @throws Will throw an error if the URL is invalid.
 */
export default function parseReviewURL(url, p = "") {
    const m = url.match(/!1s([a-zA-Z0-9_:]+)!/);
    if (!m || !m[1]) {
        throw new Error("Invalid URL")
    }
    const [h1, h2] = m[1].split(":").map(hexToDec)
    const pS = p ? `!2m2!2i10!3s${p}` : `!2m1!2i10`
    return `https://www.google.com/maps/preview/review/listentitiesreviews?authuser=0&hl=en&gl=in&pb=!1m2!1y${h1}!2y${h2}${pS}!3e1!4m5!3b1!4b1!5b1!6b1!7b1!5m2!1sdzvaXrvAMImImAXHsLPICA!7e81`;
}