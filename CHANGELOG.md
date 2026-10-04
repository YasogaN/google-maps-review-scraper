# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2026-10-04

### Added

- Owner responses are now included in the cleaned output (`clean: true`)
- Vitest test suites: deterministic `tests/unit` and `tests/integration` suites plus network-dependent `tests/live` tests, with shared fixtures and builders
- Scheduled live contract detection that compares the undocumented BOQ response against the committed `tests/fixtures/boq-schema.json`
- CodeQL code scanning for JavaScript/TypeScript on pushes, pull requests targeting `main` and `dev`, and a weekly schedule

### Changed

- Node.js support now targets Node 26 LTS; CI runs the test suite on Node 22, 24, and 26 and typechecks each runtime against its matching `@types/node`
- Added `engines.node` (`>=22.12.0`); Node.js 20 and older are no longer supported
- CI now typechecks the source and tests and enforces 100% coverage on statements, branches, functions, and lines
- CI lets a `pull_request` run take priority over a duplicate `push` run and reports skipped gates with an explanatory check summary
- Release workflow builds the artifact on the pinned Node and no longer configures GitHub Packages

### Fixed

- `validateParams` rejects numeric enum reverse-mapping keys (`"1"`–`"4"`) as `sort_type`
- `validateParams` rejects inherited object keys (`toString`, `constructor`, `__proto__`, ...) as `sort_type`
- `validateParams` rejects spoofed `google.com` hosts (e.g. `evilgoogle.com`, `google.com.evil.com`) while accepting fully-qualified hostnames with a trailing dot
- Owner responses that are absent are returned as `null`, and their timestamp is parsed
- Corrected the `sort_type` value in the `scraper` JSDoc and the host requirement documented for `validateParams`

### Removed

- Unused `tsx` and `rimraf` dev dependencies; the build clean step now uses `scripts/clean.mjs`
- Unused GitHub Packages publishing setup and `packages: write` permission from the release workflow

### Docs

- Updated the `CONTRIBUTING.md` test commands and replaced the stale lint step with the type check CI enforces

## [3.0.0] - 2026-07-05

### Changed

- **Breaking:** Replaced `listugcposts` endpoint with `GetLocalBoqProxy` (BOQ) as the sole scraping mechanism — `listugcposts` was moved behind Google's WAA (BotGuard), and fixing it would require Playwright, bloating the library
- **Breaking:** `scraper()` now accepts a single options object `{ url, ...options }` instead of positional `(url, options)` arguments
- **Breaking:** `pages` default changed from `"max"` to `-1`; string `"max"` no longer accepted
- **Breaking:** Return type changed from `Promise<ParsedReview[] | JsonArray | 0>` to `Promise<ParsedReview[] | JsonArray>` — returns `[]` instead of `0`
- **Breaking:** Removed `search_query`, `experimental`, and `cookies` parameters from `scraper()`
- **Breaking:** Removed `rotate` export (formerly `rotateCookies`)
- Promoted BOQ modules from `src/experimental/` to `src/` root
- Simplified `createClient()` — removed cookie jar population logic
- Moved `boqParser.ts` shared imports to relative paths
- Updated `SortEnum` — removed misspelled `"relevent"` key

### Removed

- Removed `src/experimental/` directory (`boqEndpoint.ts`, `types.ts`, `utils.ts`)
- Removed `src/extraction.ts` — session token fetch no longer needed
- Removed `src/listugcposts.ts` — endpoint builder for deprecated API
- Removed `src/parser.ts` — old `listugcposts` parser superseded by `boqParser`
- Removed `src/rotate.ts` — cookie rotation utility
- Removed `cookies` field from `HTTPClient` and `Scraper` interfaces
- Removed `SessionToken`, `ListUgcPosts`, `Reviews`, `Paginate` interfaces
- Removed `valueOrNull` utility from `sharedParser.ts`

### Added

- JSDoc comments to all modules for improved documentation

### Fixed

- Throws error instead of silently returning `0` on scraper failure
- Improved error logging in `paginateReviews`
- Updated `ReadMe.md` with corrected usage examples and new API shape

## [2.2.0] - 2026-07-05

### Changed

- Improved image handling and review parsing in `boqParser`
- Reworked `boqParser` review parsing with dynamic anchor detection
- Enhanced `boqParser` for improved review parsing and image detection
- Moved utility functions to `sharedParser` for better reusability
- Updated parameter types and names for clarity and consistency
- Updated pnpm workspace configuration
- Created `Scraper` interface and updated scraper function for improved type safety
- Renamed parameters for clarity and updated interfaces for improved type safety
- Updated parameter name from `so` to `sortOrder` for clarity and consistency
- Created proper interfaces for `RotateClientReturn` and `RotateCookies`
- Updated `boqParser` function return type to `ParsedReview[]`
- Updated `parseReviews` function parameter type for improved type safety
- Created `ListUgcPosts` interface and updated function signature
- Added return types to `createClient` and `fetchSessionToken` functions
- Updated `fetchSessionToken` to use `SessionToken` interface
- Created proper interfaces for `HTTPClient` and `ProxyConfig`
- Changed `JsonObject` type to interface for consistency
- Refactored types and functions to use interfaces for better type safety
- Refactored `getBoqUrl` function to use `BoqUrl` interface for parameters
- Restructured proxy options in scraper function

### Added

- Parameter to ignore TLS

### Fixed

- Surfaced scraper failures
- Normalized parsed review output
- Typed review response payloads
- Updated parameter types in `boqParser` and `_parseReview` to use `unknown`
- Added `"relevent"` enum value for backwards compatibility
- Updated type definition for `cookies` parameter in scraper function
- Corrected spelling mistakes in documentation and code
- Fixed typo in readme

### Docs

- Updated JSDoc

## [2.1.1] - 2026-05-11

### Removed

- Removed GitHub Packages publish step from release workflow

## [2.1.0] - 2026-05-11

### Added

- Release and publish workflow for npm and GitHub Packages
- Cookie rotation functionality for Google accounts
- Experimental `GetLocalBoqProxy` endpoint for review scraping
- Support for cookie authentication
- Ability to pass cookies for authentication
- Experimental option for `GetLocalBoqProxy` endpoint with cookie auth support

### Changed

- Centralized client creation and pass Impit instance as a dependency
- Refactored cookie warning log placement
- Updated user-agent strings
- Updated dependencies
- Added JSDoc docstrings and comments
- Implemented private helper function
- Updated Chrome version in User-Agent string
- Encoded search query in URL

### Fixed

- Corrected repository and homepage URLs in package.json
- Corrected spelling of "relevant" in `SortEnum` with backwards compatibility
- Corrected BOQ endpoint payload structure (sort order and fetch limit indices)
- Increased initial fetch limit to 10; ensured sort order in paginated requests

### Docs

- Improved `getlocalboqproxy` endpoint documentation (detailed `reqpld` structure, cookies note)
- Added experimental `GetLocalBoqProxy` endpoint docs
- Added acknowledgment for Minh's help

## [2.0.0] - 2026-01-12

### Added

- Dynamic session token retrieval
- PlaceId-based review scraping (replacing URL-based)
- JSDoc comments to utility functions and new extraction module

### Changed

- **Breaking:** Migrated from JavaScript to TypeScript
- **Breaking:** Switched from axios to `impit` for all HTTP requests
- **Breaking:** Replaced URL-based scraping with placeId
- Migrated project from JavaScript to TypeScript (type definitions, removed hex2dec dependency)
- Switched package manager to pnpm
- Updated package files to include `dist/` instead of source files
- Adjusted geo region to US
- Made URL creation more graceful
- Removed calculation for next page token

### Fixed

- Improved review parsing to handle nested structures
- Fixed type definitions
- Reliability improvements

### Removed

- Removed unused `initialData` parameter from `paginateReviews` JSDoc
- Deleted outdated endpoint
- Removed CodeQL workflow

### Docs

- Updated documentation to reflect v2 changes

## [1.5.0] - 2025-04-03

### Added

- Review response parser

## [1.4.0] - 2024-12-18

### Fixed

- Updated regex matching to handle additional URL segments; fixes compatibility with all valid Google Maps URLs
- Added additional check for `initialData` in scraper function to prevent `TypeError`

## [1.3.2] - 2024-12-02

### Fixed

- Added missing import
- Fixed review cleaning on first page

### Changed

- Migrated from axios to built-in Node.js fetch

## [1.3.1] - 2024-12-02

### Changed

- Code optimization to reduce package size

## [1.3.0] - 2024-12-02

### Added

- Support for cleaned/parsed output with configurable `clean` option
- Parser function to clean and transform review data into JSON format
- `clean` parameter validation
- Documentation for clean and raw output options

### Fixed

- Fixed default parameter for scraper function to prevent errors
- Fixed URL substring sanitization (security alert)
- Fixed URL for `pgnum` file path

### Changed

- Refactored code to be more modular
- Renamed and reorganized docs

## [1.2.0] - 2024-09-29

### Added

- Pagination support
- URL validation for Google Maps URLs
- Documentation for output formats
- Added `files` field to reduce npm package size

### Changed

- Switched to MIT License
- Bumped axios dependency

### Removed

- Removed debug statements
- Removed unused import

## [1.0.2] - 2024-08-11

### Added

- Error handling for failed review fetching
- Homepage URL in package.json

### Fixed

- Updated documentation URLs to use absolute paths

## [1.0.1] - 2024-08-07

### Fixed

- Fixed broken links
- Updated gitignore

### Added

- Added package-lock.json to fix workflow errors
- CodeQL workflow for security analysis

### Changed

- Updated CI workflows for npm publish

## [1.0.0] - 2024-08-07

### Added

- Initial release of google-maps-review-scraper
- Core scraper functionality to fetch Google Maps reviews
- Source code and basic documentation
- npm publish workflows
- Stale issue management workflow
- CodeQL security analysis

[Unreleased]: https://github.com/YasogaN/google-maps-review-scraper/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v2.2.0...v3.0.0
[2.2.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/YasogaN/google-maps-review-scraper/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.5.0...v2.0.0
[1.5.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.3.2...v1.4.0
[1.3.2]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.0.2...v1.2.0
[1.0.2]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/YasogaN/google-maps-review-scraper/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/YasogaN/google-maps-review-scraper/releases/tag/v1.0.0
