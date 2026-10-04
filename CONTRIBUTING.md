# Contributing to Project

Thank you for considering contributing to this project! I welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you encounter a bug, please create an issue on GitHub with the following details:
- A clear and descriptive title
- A detailed description of the bug
- Steps to reproduce the bug
- Any relevant screenshots or code snippets

### Suggesting Enhancements

If you have an idea to improve the project, please open an issue with the following details:
- A clear and descriptive title
- A detailed description of the enhancement
- Any relevant mockups or examples

### Submitting Pull Requests

To submit a pull request (PR):
1. Fork the repository and create your branch from `dev`.
2. If you’ve added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints.
5. Create your pull request, provide a clear description of your changes, and reference any related issues.

## Testing

Tests are written with [Vitest](https://vitest.dev/) and are split into two
tiers:

- **`tests/unit` + `tests/integration`** — deterministic tests that run on every
  push and pull request. Integration tests exercise the full pipeline against a
  fake HTTP client, plus response-shape contract checks.
- **`tests/live`** — tests that hit the real Google Maps endpoint. They run on a
  schedule on a self-hosted runner (see `.github/workflows/live.yml`) and also
  detect changes to the undocumented BOQ response shape. The committed
  `tests/fixtures/boq-schema.json` pins the top-level type of each review index;
  nested parser invariants (time, author, owner response) are enforced
  separately by `contractViolations` in `tests/helpers/contract.ts`.

```bash
pnpm test               # unit + integration tests
pnpm test:unit          # unit tests only
pnpm test:integration   # integration tests only
pnpm test:live          # live tests (requires network)
pnpm test:coverage      # unit + integration with 100% coverage enforcement
```

The coverage thresholds are set to 100% for statements, branches, functions
and lines, so every new branch of logic must be covered by a test. Shared
fixtures and builders live in `tests/helpers`.

## Code Style

Please follow the existing code style and conventions used in the project.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

Thank you for contributing!
