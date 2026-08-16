## Unreleased

- Reorganized public starting points into `profiles/presets/`, public real-world examples into `profiles/maintainers/`, and private user profiles into gitignored `profiles/local/`.
- Changed the browser builder to start from the anonymous Blank preset and moved the maintainer profile into a separate reference group.
- Added a plan-aware Custom Instructions validation target in the browser without storing plan/limit data inside the profile.
- Added machine-readable behavioral regression cases alongside the human-readable scenarios.
- Expanded research, testing, privacy, product-mapping, and contribution guidance for public reuse and optional automated eval workflows.

# Changelog

All notable changes to this project are documented here.

## Unreleased — schema v2

- Reframed the repository from a three-field Custom Instructions helper into a complete ChatGPT personalization configuration toolkit.
- Added explicit `product`, `identity`, and `instructions` layers.
- Added Personality, Characteristics, and Memory intent to the profile schema.
- Added a dedicated explanation contract with principle, dependency sequence, terminology policy, and depth policy.
- Removed `long_answers` as a formatting trigger and added `OUTLINE_BIAS` linting for rules that may force numbered/outline-style responses.
- Added UI/UX and writing sections as first-class instruction groups.
- Expanded research guidance around primary sources, repositories, source code, releases, issues, evidence separation, and testing.
- Added a public maintainer profile (`profiles/maintainers/yasman.json`) and rebuilt all example profiles for schema v2.
- Changed renderer output to `settings.md`, `occupation.txt`, `more-about-you.txt`, and `custom-instructions.txt`.
- Rebuilt the browser builder for the v2 profile model and four-output preview.
- Added v1-to-v2 migration documentation.
- Expanded manual behavioral regression scenarios to cover paragraph flow, beginner depth, repository analysis, deep research, UI/UX critique, format exceptions, and concise factual answers.
- Updated the default long-field validation target to 5,000 characters while keeping `--limit` configurable for other product surfaces.

## 0.1.0 - 2026-07-13

Initial public release.

- Added the field-aware v1 profile format and JSON Schema.
- Added the dependency-free renderer and linter.
- Added manual evaluation scenarios.
- Added reusable example profiles.
- Added documentation for profile design, privacy, and testing.
