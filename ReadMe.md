![YasogaN](https://socialify.git.ci/YasogaN/google-maps-review-scraper/image?description=1&descriptionEditable=A%20NPM%20module%20to%20scrape%20reviews%20from%20Google%20Maps&font=Source%20Code%20Pro&name=1&owner=1&theme=Auto)

<div align="center">

![](https://img.shields.io/github/license/YasogaN/google-maps-review-scraper.svg?style=for-the-badge&color=blue) 
![](https://img.shields.io/github/forks/YasogaN/google-maps-review-scraper.svg?style=for-the-badge) 
![](https://img.shields.io/github/stars/YasogaN/google-maps-review-scraper.svg?style=for-the-badge) 
![](https://img.shields.io/github/watchers/YasogaN/google-maps-review-scraper.svg?style=for-the-badge) 
![](https://img.shields.io/github/issues/YasogaN/google-maps-review-scraper.svg?style=for-the-badge) 
![](https://img.shields.io/github/languages/code-size/YasogaN/google-maps-review-scraper?style=for-the-badge) 


## Frameworks/Technologies

![](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
[![hex2dec](https://img.shields.io/badge/hex2dec-blue?&style=for-the-badge)](https://www.npmjs.com/package/hex2dec)

</div>

---

## Installation

Install with npm

```bash
  npm install google-maps-review-scraper
```
Install with yarn
```bash
  yarn add google-maps-review-scraper
```
---

## Usage/Examples

```ts
import { scraper } from "google-maps-review-scraper"

const reviews = await scraper("url", { sort_type: "sort_type", search_query: "search_query", pages: "pages", clean: false })
```

### Arguments
`url` - `string`: A google maps place url as explained [here](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/urls/place.md) 

`sort_type` - `string`: The sort parameter (`"relevent"`, `"newest"`, `"highest_rating"`, `"lowest_rating"`). Defaults to `"relevent"`

`search_query` - `string`: Search query to search in reviews. Defaults to nothing.

`pages` - `integer`: Number of pages that will be scraped. Will return less reviews if no more reviews exist. Defaults to max pages.

`clean` - `boolean`: Whether to return a cleaned output or not. Defaults to false.

> [!NOTE]
> `sort_type`, `search_query` and `pages` are all optional paremeters which should be included within the object literals (the curly brackets).

### Returns

`reviews` - `Promise<Array|number>`: A promise that resolves to a array containing the reviews in these [formats](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/outputs/output.md) depending on the value of `clean` or the number `0` if no reivews exist.

---

## Documentation of API's/URL's used

All documentation related to API's and URL's used in this project can be found in the [docs](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/) folder divided into endpoints for API's and urls for URL's. Note that everything included here was based on my reasearch, so errors could be present. A pull request is always welcome (see [contributing](#contributing))

---

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/YasogaN/google-maps-review-scraper/blob/main/LICENSE) file for details.


### Summary of the MIT License

The **MIT License** is a permissive open-source license that allows users significant freedom with minimal conditions.

### Key Permissions:

1. **Freedom to Use**: You can use the software for any purpose, including commercial use.
2. **Freedom to Modify**: You are free to modify the software as needed.
3. **Freedom to Distribute**: You can distribute copies of the software, whether in its original or modified form.
4. **Freedom to Sell**: You can sublicense, distribute, and even sell the software.

### Key Conditions:

- **Attribution**: You must include the original copyright notice and the MIT license text in any copies or substantial portions of the software.

### No Warranty:
- The software is provided "as is," with no warranties or guarantees. The author is not liable for any damages arising from the use of the software.

For full details, refer to the license text.

---

## Contributing

I welcome contributions from the community! Please see our [CONTRIBUTING.md](https://github.com/YasogaN/google-maps-review-scraper/blob/main/CONTRIBUTING.md) for details on how to contribute to this project.

---

## Code of Conduct

Please note that this project is governed by a [Code of Conduct](https://github.com/YasogaN/google-maps-review-scraper/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Acknowledgements

Special thanks to [@marin-m](https://github.com/marin-m) for his outstanding work on the [pbtk](https://github.com/marin-m/pbtk) repository. His contributions and insights on protocol buffers were invaluable in my research and development process.

### Dependencies

 - [hex2dec](https://npm.im/hex2dec) by [@donmccurdy](https://github.com/donmccurdy)

---

## Legal Disclaimer

This project is not affiliated with, endorsed by, or associated with Google LLC or any of its products and services. All product and company names are trademarks or registered trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.

### Purpose of the Project

This project was created with the primary intent of serving as an educational tool and proof of concept. The objectives include:

- **Educational Use**: To provide a hands-on learning experience in developing software, using APIs, and understanding the integration of various technologies. The project is intended to help developers, students, and enthusiasts enhance their skills and knowledge.
- **Proof of Concept**: To demonstrate the feasibility and potential of certain technical approaches and solutions. This includes showcasing how different APIs and tools can be utilized together in a functional application.

### Non-Commercial Nature

This project is non-commercial and is not intended for any form of profit generation or business use. It is shared openly with the community to foster learning and collaboration.

### Intellectual Property and Fair Use

We acknowledge and respect the intellectual property rights of Google and other third parties. Any content used from external sources is credited appropriately, and no proprietary data or materials are misused.

### Contact and Legal Concerns

If you have any concerns or questions regarding the legality of this project, any specific legal queries or issues, please seek professional legal advice.
