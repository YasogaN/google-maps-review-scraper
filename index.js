import { SortEnum } from "./src/types.js";
import listenentities from "./src/listenentities.js";
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
        //console.debug(sort)

        //Create the URL
        var newurl = await listugcposts(url, sort, "", search_query);
        //console.debug(`Constructed URL: ${newurl}`);

        //Get the reviews
        var response = await axios.get(newurl);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        var data = response.data.split(")]}'")[1];
        var json = JSON.parse(data);
        //console.debug(json);

        //Check if there are any reviews
        if (!json || json.length == 0) {
            //console.debug("No reviews found.");
            return 0;
        }

        //Store the reviews in the reviews array
        var reviews = json[2];
        //console.debug(reviews);

        //Check if there are any reviews on nextpage
        if (json[1] == null) {
            //console.debug("No more reviews found.");
            return reviews; //Return the reviews if there are no more pages
        }

        //Get the next page
        var nextpage = json[1].replace(/"/g, "");
        //console.debug(`Next page: ${nextpage}`);

        //Get the reviews on all the next pages until there are no more
        while (nextpage && nextpage !== "null") {
            //Create the URL
            var newurl = await listugcposts(url, sort, nextpage, search_query);
            //console.debug(`Constructed URL: ${newurl}`);

            //Get the reviews
            var response = await axios.get(newurl);
            if (response.status !== 200) {
                throw new Error(`Failed to fetch reviews: ${response.status}`);
            }
            var data = response.data.split(")]}'")[1];
            var json = JSON.parse(data);
            //console.debug(json);

            //Store the reviews in the reviews array
            var reviews = reviews.concat(json[2]);
            //console.debug(reviews);

            //Check if there are any reviews on nextpage
            if (json[1] == null) {
                //console.debug("No more reviews found.");
                return reviews;
            }
            var nextpage = json[1].replace(/"/g, "");
            //console.debug(`Next page: ${nextpage}`);

            // Sleep for 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) {
        console.error(e);
        return;
    }
}