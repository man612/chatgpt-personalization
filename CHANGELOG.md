# Changelog

All notable changes to this project will be documented here.

## Unreleased

- Added a dependency-free browser builder with template loading, dynamic profile editing, schema-based validation, copy-ready previews, JSON import, and JSON export.
- Sharpened repository discovery copy around ChatGPT custom instructions and structured JSON profiles.
- Added a 1280 × 640 social-preview asset.
- Changed CI to manual dispatch while repository-level runner access is failing before workflow steps begin.
- Aligned the dependency-free linter with the current profile schema for nested types, unsupported fields, duplicate array values, and string length constraints.
- Added malformed-input and CLI regression tests.
- Added a render smoke test to the Python 3.11–3.13 CI matrix and disabled matrix fail-fast.
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
