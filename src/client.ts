
import { Impit } from "impit";
import { CookieJar } from "tough-cookie";

const cookieJar = new CookieJar();

export const client = new Impit({
    cookieJar: cookieJar,
    browser: "chrome"
});
