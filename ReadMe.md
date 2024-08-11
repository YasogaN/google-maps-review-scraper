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
![](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)

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

const reviews = await scraper("url", "sort_type", "search_query")
```

### Arguments
`url` - `string`: A google maps place url as explained [here](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/urls/place.md) 

`sort_type` - `string`: The sort parameter (`"relevent"`, `"newest"`, `"highest_rating"`, `"lowest_rating"`).

`search_query` - `string`: Search query to search in reviews (optional)

### Returns

`reviews` - `Promise<JSON>`: A promise that resolves to a JSON object containing the reviews.

---

## Documentation of API's/URL's used

All documentation related to API's and URL's used in this project can be found in the [docs](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/) folder divided into endpoints for API's and urls for URL's. Note that everything included here was based on my reasearch, so errors could be present. A pull request is always welcome (see [contributing](#contributing))

---

## License

This project is licensed under the GNU Affero General Public License v3.0 only - see the [LICENSE](https://github.com/YasogaN/google-maps-review-scraper/blob/main/LICENSE) file for details.

### Summary of AGPL-3.0-only

The GNU Affero General Public License (AGPL) is a free, copyleft license for software and other kinds of works, specifically designed to ensure cooperation with the community in the case of network server software.

### Key Permissions and Conditions:

- **Freedom to use**: You may use the software for any purpose.
- **Freedom to study**: You have the freedom to study how the software works and make changes to it.
- **Freedom to share**: You can redistribute copies of the original software.
- **Freedom to contribute**: You must release the source code of your version and your modifications to others when you distribute the software or if you operate it as a service over a network.
- **No additional restrictions**: You cannot impose additional restrictions on the rights granted by the license.

### Requirements:

1. **Source Code Availability**: You must provide access to the source code of your modifications when you distribute the software.
2. **Network Use Disclosure**: If you make the software available over a network, you must also provide the source code to users interacting with it remotely.
3. **No Warranty**: The software is provided "as is", without warranty of any kind.

For more detailed information, please refer to the [AGPL-3.0 license text](https://www.gnu.org/licenses/agpl-3.0.en.html).

---

## Contributing

I welcome contributions from the community! Please see our [CONTRIBUTING.md](https://github.com/YasogaN/google-maps-review-scraper/blob/main/CONTRIBUTING.md) for details on how to contribute to this project.

---

## Code of Conduct

Please note that this project is governed by a [Code of Conduct](https://github.com/YasogaN/google-maps-review-scraper/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Acknowledgements

Special thanks to [@marin-m](https://github.com/marin-m) for his outstanding work on the [pbtk](https://github.com/marin-m/pbtk) repository. His contributions and insights on protocol buffers were invaluable in my research and development process.

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
