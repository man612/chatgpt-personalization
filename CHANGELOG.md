# Changelog

All notable changes to this project will be documented here.

## Unreleased

- Added a dependency-free browser builder with template loading, dynamic profile editing, schema-based validation, copy-ready previews, JSON import, and JSON export.
- Added one shared rendering contract for the browser and Python CLI, plus an automated renderer parity check.
- Added rendered-field length warnings and errors to the browser while keeping full lint-only checks in the Python CLI.
- Restored automatic CI for pull requests and changes to `main`, with separate Python and browser-parity jobs.
- Sharpened repository discovery copy around ChatGPT custom instructions and structured JSON profiles.
- Added a 1280 × 640 PNG social-preview asset for the Pages site and repository settings.
- Added a product field-mapping guide and clarified that the profile's three sections are not fixed ChatGPT UI labels.
- Simplified the sitemap to supported metadata and added a current `lastmod` value.
- Aligned the dependency-free linter with the current profile schema for nested types, unsupported fields, duplicate array values, and string length constraints.
- Added malformed-input and CLI regression tests.
- Improved rendered tone prose and made the practical technology example less personal.
- Replaced broad testability claims with explicit manual-evaluation language.
- Consolidated overlapping architecture, writing, anti-pattern, and migration documents into one profile guide.
- Replaced the research-basis document with a transparent references and limitations page.

## 0.1.0 - 2026-07-13

Initial public release.

- Added the field-aware profile format and JSON Schema.
- Added the dependency-free renderer and linter.
- Added manual evaluation scenarios.
- Added reusable example profiles.
- Added documentation for profile design, privacy, and testing.
