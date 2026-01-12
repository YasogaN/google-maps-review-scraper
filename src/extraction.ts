import { client } from "./client.js";

/**
 * Main function to fetch data for a place.
 * @param {string} placeId - The CID (e.g., 0x3ae2575b18d322ff:0x3c53adf6ab35b12b)
 */
export default async function fetchSessionToken(placeId: string) {
    try {
        // fetch page
        const sourceUrl = `https://maps.google.com/maps/place/${placeId}?hl=en&gl=US`;
        const sourceRes = await client.fetch(sourceUrl);
        const html = await sourceRes.text();

        // Grab the kEI token using the fast split method
        const token = html.split("var kEI='")[1]?.split("'")[0];
        if (!token) throw new Error("Could not find session token (kEI) in source.");

        return token;
    } catch (error) {
        console.error("[-] Fetch error:", (error as Error).message);
        return null;
    }
}
