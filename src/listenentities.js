import { hexToDec } from "hex2dec";

/**
 * Parses a google maps place url to a url with the listenentitesreviews endpoint
 * @param {string} url URL of the google maps place as a string
 * @param {string} [page] base64 encoding of the page number
 * @returns {string} link to fetch reviews
 */
export default async function (url, page = "") {
    const match = url.match(/!1s([a-zA-Z0-9_:]+)!/);
    if (!match && !match[1]) {
        throw new Error('Invalid URL')
    }
    const hex = match[1].split(':');
    const d = hex.map(part => hexToDec(part));
    var p
    if (page.length == 0) {
        p = '!2m1!2i10'
    }
    else {
        p = '!2m2!2i10!3s' + page;
    }
    return `https://www.google.com/maps/preview/review/listentitiesreviews?authuser=0&hl=en&gl=in&pb=!1m2!1y${d[0]}!2y${d[1]}${p}!3e1!4m5!3b1!4b1!5b1!6b1!7b1!5m2!1sdzvaXrvAMImImAXHsLPICA!7e81`;
};

