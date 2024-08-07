/**
 * Parses a google maps place url to a url with the listugcposts endpoint
 * @param {string} url URL of the google maps place as a string
 * @param {1|2|3|4} sort - Sorting order of reviews (1 for Most Relevant, 2 for Newest, 3 for Highest Rating, 4 for Lowest Rating)
 * @param {string} [page=""] base64 encoding of the page number
 * @param {string} [search=""] search query if searching for something in reviews
 * @returns {string} link to fetch reviews
 */
export default async function (url, sort, page="", search="") {
    try {
        const match = url.match(/!1s([a-zA-Z0-9_:]+)!/);
        if (!match && !match[1]) {
            throw new Error('Invalid URL')
        }
        return `https://www.google.com/maps/rpc/listugcposts?authuser=0&hl=en&gl=in&pb=!1m7!1s${match[1]}!3s${search}!6m4!4m1!1e1!4m1!1e3!2m2!1i10!2s${page}!5m2!1sBnOwZvzePPfF4-EPy7LK0Ak!7e81!8m5!1b1!2b1!3b1!5b1!7b1!11m6!1e3!2e1!3sen!4slk!6m1!1i2!13m1!1e${sort}`;
    }
    catch (e) {
        console.error(e)
    }
};