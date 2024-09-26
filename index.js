import { SortEnum } from "./src/types.js";
import listugcposts from "./src/listugcposts.js";
import axios from "axios";


/**
 * This function retrieves the reviews from the specified URL
 * @param {string} url - Google Maps place url.
 * @param {SortEnum} sort - The sort parameter ("relevent", "newest", "highest_rating", "lowest_rating").
 * @param {string} [search_query=""] - Search query to search in reviews (optional)
 * @returns {Promise<JSON>} A promise that resolves to a JSON object containing the reviews.
 */
export async function scraper(url, sort_type, search_query = "") {
    try {
        // Check if the sort parameter is valid
        const sort = SortEnum[sort_type];
        if (sort === undefined) {
            throw new Error(`Invalid sort value: ${sort_type}`);
        }

        // Check if the URL is valid
        if (!url.includes("https://www.google.com/maps/place/")) {
            throw new Error(`Invalid URL: ${url}`);
        }

        //Create the URL
        var newurl = await listugcposts(url, sort, "", search_query);

        //Get the reviews
        var response = await axios.get(newurl);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        var data = response.data.split(")]}'")[1];
        var json = JSON.parse(data);

        //Check if there are any reviews
        if (!json || json.length == 0) {
            return 0;
        }

        //Store the reviews in the reviews array
        var reviews = json[2];

        //Check if there are any reviews on nextpage
        if (json[1] == null) {
            return reviews; //Return the reviews if there are no more pages
        }

        //Get the next page
        var nextpage = json[1].replace(/"/g, "");

        //Get the reviews on all the next pages until there are no more
        while (nextpage && nextpage !== "null") {
            //Create the URL
            var newurl = await listugcposts(url, sort, nextpage, search_query);

            //Get the reviews
            var response = await axios.get(newurl);
            if (response.status !== 200) {
                throw new Error(`Failed to fetch reviews: ${response.status}`);
            }
            var data = response.data.split(")]}'")[1];
            var json = JSON.parse(data);

            //Store the reviews in the reviews array
            var reviews = reviews.concat(json[2]);

            //Check if there are any reviews on nextpage
            if (json[1] == null) {
                return reviews;
            }
            var nextpage = json[1].replace(/"/g, "");

            // Sleep for 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) {
        console.error(e);
        return;
    }
}