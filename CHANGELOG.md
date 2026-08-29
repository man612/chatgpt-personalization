# Changelog

All notable changes to this project are documented here.

## Unreleased

### Sepia writing layer

- Added a lightweight Sepia-derived writing pass to the maintainer operational profile while keeping the rendered Custom Instructions within the repository's 4,500-character headroom target.
- Added `docs/writing/sepia-yasman.md` for maintainer-specific routing, voice preservation, revision order, failure modes, and public/private sample boundaries.
- Added `docs/writing/indonesian-ai-tells.md` as explicitly heuristic Indonesian guidance for structural AI-writing patterns without pretending it is a scientific detector.
- Added voice-preserving and de-AI-without-overcorrection behavioral regression scenarios.
- Added Sepia research provenance, retained the upstream MIT notice in `THIRD_PARTY_NOTICES.md`, and documented that the adaptation does not imply upstream endorsement.

### Operational profiles

- Added `profiles/operational/` for version-controlled, public-safe account targets used for self-audit and AI-assisted setup.
- Added `profiles/operational/yasman.json` as the maintainer's current operational ChatGPT setup while keeping `profiles/maintainers/yasman.json` as a stable public reference example.
- Documented AI audit precedence: explicit current user intent first, observable product state second, operational target for desired state, and unobservable settings reported as unverified rather than mismatched.
- Kept private or experimental variants in the existing gitignored `profiles/local/` workflow instead of expanding the public operational profile with sensitive or transient context.
- Added regression tests for operational-profile validity, schema resolution, rendered-field headroom, expected setup behaviors, and separation from the public reference profile.

### Behavioral hardening

- Strengthened the maintainer reference profile so beginner-oriented explanations assume unknown domain vocabulary without reducing reasoning depth.
- Added explicit first-principles explanation behavior: actors/components, who communicates with whom, end-to-end flows, jargon-at-first-use, failure modes, risks, and verification.
- Reworked deep-research behavior from generic source-quality advice into an operational evidence-gathering protocol with targeted search angles, primary-source hierarchy, independent cross-checking, date/version/tier checks, contradiction handling, counter-evidence, quantitative normalization, and an evidence-based stopping rule.
- Expanded behavioral regression scenarios to distinguish quick current lookups from deep multi-source research, conflicting-source analysis, quantitative research, and repository triangulation.
- Added regression tests for the Yasman explanation/research contract and field-limit headroom.
- Fixed profile `$schema` references after the preset/maintainer directory reorganization and added a regression test that resolves every profile schema path.
- Documented that Project Instructions override global Custom Instructions and that standard Search and dedicated Deep Research are different product behaviors.

### Repository experience

- Restored theme-aware README visuals for the v2 architecture.
- Improved README mobile readability, onboarding, support links, contributing guidance, and license explanation.
- Standardized the README trust row as three compact CI, license, and schema badges.
- Added a dedicated 1280×640 social preview asset plus Open Graph/Twitter metadata and a lightweight favicon for the browser builder.
- Repaired the social-preview asset as a valid PNG binary after the previous repository blob could not be rendered by GitHub.
- Rebuilt the browser builder presentation as separate experience, motion, and mobile layers instead of a single generic responsive form surface.
- Added a dimensional profile-model hero, differentiated Product/Identity/Instructions/Output surfaces, scroll and pointer micro-interactions, mobile section collapsing, custom mobile select sheets, and a safe-area-aware bottom action dock.
- Added reduced-motion fallbacks and CI syntax checks for the dedicated motion and mobile scripts while keeping renderer output unchanged.
- Added a clear independent-project disclaimer to avoid implying OpenAI affiliation or endorsement.
- Added a project code of conduct and expanded the security policy.
- Added Dependabot monitoring for GitHub Actions and updated the workflow to the current v7 major releases of `actions/checkout`, `actions/setup-python`, and `actions/setup-node`.
- Aligned the preset issue form filename and label with the public-first terminology.
- Refreshed the GitHub Pages sitemap date.

### Schema v2 and public-first architecture

- Reframed the repository from a three-field Custom Instructions helper into a complete ChatGPT personalization configuration toolkit.
- Added explicit `product`, `identity`, and `instructions` layers.
- Added Personality, Characteristics, and Memory intent to the profile schema.
- Added a dedicated explanation contract with principle, dependency sequence, terminology policy, and depth policy.
- Removed `long_answers` as a formatting trigger and added `OUTLINE_BIAS` linting for rules that may force numbered or outline-style responses.
- Added UI/UX and writing sections as first-class instruction groups.
- Expanded research guidance around primary sources, repositories, source code, releases, issues, evidence separation, and testing.
- Reorganized reusable starting points into `profiles/presets/`, public real-world examples into `profiles/maintainers/`, and private user profiles into gitignored `profiles/local/`.
- Added the public maintainer reference profile at `profiles/maintainers/yasman.json`.
- Changed renderer output to `settings.md`, `occupation.txt`, `more-about-you.txt`, and `custom-instructions.txt`.
- Rebuilt the browser builder for the v2 profile model and four-output preview.
- Made the browser start from the anonymous Blank preset and separated maintainer examples from public presets.
- Added selectable 1,500- and 5,000-character validation targets without storing plan data inside profiles.
- Added v1-to-v2 migration documentation.
- Added machine-readable behavioral regression cases alongside the human-readable scenario suite.
- Expanded behavioral scenarios for paragraph flow, beginner depth, repository analysis, deep research, UI/UX critique, format exceptions, and concise factual answers.

## 0.1.0 - 2026-07-13

Initial public release.

- Added the field-aware v1 profile format and JSON Schema.
- Added the dependency-free renderer and linter.
- Added manual evaluation scenarios.
- Added reusable example profiles.
- Added documentation for profile design, privacy, and testing.
