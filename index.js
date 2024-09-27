import { SortEnum } from "./src/types.js";
import listugcposts from "./src/listugcposts.js";
import axios from "axios";


/**
 * Scrapes reviews from a given Google Maps URL.
 *
 * @param {string} url - The URL of the Google Maps location to scrape reviews from.
 * @param {Object} options - The options for scraping.
 * @param {string} [options.sort_type="relevent"] - The type of sorting for the reviews ("relevent", "newest", "highest_rating", "lowest_rating").
 * @param {string} [options.search_query=""] - The search query to filter reviews.
 * @param {string} [options.pages="max"] - The number of pages to scrape (default is "max"). If set to a number, it will scrape that number of pages (results will be 10 * pages) or until there are no more reviews.
 * @returns {Promise<Array|number>} - Returns an array of reviews or 0 if no reviews are found.
 * @throws {Error} - Throws an error if the URL is not provided or if fetching reviews fails.
 */
export async function scraper(url, { sort_type = "relevent", search_query = "", pages = "max" }) {
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

        // Check if the pages parameter is valid
        if (pages !== "max" && isNaN(pages)) {
            throw new Error(`Invalid pages value: ${pages}`);
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
        if (json[1] == null || pages === 1) {
            return reviews; //Return the reviews if there are no more pages
        }

        //Get the next page
        var nextpage = json[1].replace(/"/g, "");

        var currentPage = 2;

        //Get the reviews on all the next pages until there are no more
        while ((nextpage && nextpage !== "null") || pages === currentPage) {
            console.log("Scraping page " + currentPage + "..." + " Next page: " + nextpage);
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

            //Check if there are any reviews on nextpage or the currentPage equals the number of pages requested
            if (json[1] == null || (pages !== "max" && parseInt(pages) === currentPage)) {
                return reviews;
            }
            var nextpage = json[1].replace(/"/g, "");

            // Sleep for 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Increment the current page
            currentPage++;
        }
    } catch (e) {
        console.error(e);
        return;
    }
}