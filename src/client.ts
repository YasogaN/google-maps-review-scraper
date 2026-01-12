
import { Impit } from "impit";
import { CookieJar } from "tough-cookie";

const cookieJar = new CookieJar();

export const client = new Impit({
    cookieJar: cookieJar,
    browser: "chrome",
    headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
    }
});
