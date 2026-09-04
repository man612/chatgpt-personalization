# Changelog

All notable changes to this project are documented here.

## Unreleased

No unreleased changes yet.

## 0.2.0 - 2026-09-04

### Release hardening

- Added real Chromium end-to-end tests for desktop and mobile builder flows, locale switching, edit preservation, preset interaction, and invalid JSON handling.
- Added browser/CLI validator parity fixtures for malformed profiles and tightened the browser validator to match schema constraints.
- Made GitHub Pages serve commit-matched preset and schema snapshots instead of fetching mutable `main` data at runtime.
- Moved dynamic preview guidance into the normal EN/ID localization layer and removed obsolete motion code left by the compositor hotfix.
- Hardened validation rendering by using text nodes rather than interpolated HTML.


### Natural writing architecture

- Added `docs/writing/core.md` as the generic English/Indonesian writing policy for opinionated public presets.
- Kept high-value Sepia principles—voice and venue matching, preservation, minimal editing, and structure-aware revision—as the main writing framework.
- Reviewed `blader/humanizer` as supplemental prior art and selectively added bounded second-pass auditing, false-positive handling, staged rhetoric, drafting residue, formulaic punchlines, and present-state documentation checks instead of importing its full English-oriented pattern catalog.
- Reworked `docs/writing/indonesian-ai-tells.md` into a generic Indonesian heuristic layer rather than a maintainer-specific rule set.
- Reworked `docs/writing/sepia-yasman.md` into an explicit maintainer-only extension of the generic core.
- Added the public `General` preset as a compact bilingual starting point that remains below the 1,500-character Custom Instructions target.
- Applied the compact natural-writing contract to every opinionated public preset while keeping `Blank` intentionally free of behavioral defaults.
- Added regression coverage for generic preset behavior, separation from maintainer identity, drafting-residue cleanup, and preservation of legitimate objections, alternatives, constraints, and technical trade-offs.
- Retained Sepia and Humanizer MIT attribution in `THIRD_PARTY_NOTICES.md` and documented benchmark limitations and the non-detector-evasion goal.

### Builder performance hotfix

- Fixed a smart-select event-listener leak that accumulated document-level `pointerdown` handlers after locale changes, resets, preset loads, or JSON apply.
- Smart selects now share one document-level outside-click listener, preventing detached form DOM from being retained across rebuilds.
- Added a regression guard for the single-listener invariant and bumped the builder asset version so browsers do not retain the affected runtime.
- Removed idle decorative animations that kept the GPU compositor active continuously even when the builder was not being used.
- Removed pointer-following magnetic buttons, hero tilt, card spotlight tracking, and particle bursts; short interaction feedback and one-shot entrance motion remain.
- Replaced backdrop blur on sticky/interactive builder surfaces with opaque-enough backgrounds for more predictable GPU performance.
- Added an idle-compositor regression guard and bumped the builder asset version again for the performance fix.

### Global onboarding and bilingual builder

- Made `General` the default browser-builder starting point while keeping `Blank` available for users who want no behavioral defaults.
- Removed maintainer and operational profiles from the builder's normal starting-point list.
- Added first-class English and Indonesian interface localization with a persistent EN/ID switch that updates the desktop and mobile builder without reloading or discarding edits.
- Kept JSON schema keys and stored profile values stable while localizing labels, help text, status messages, selectors, mobile controls, and onboarding copy.
- Added an explicit “Apply to ChatGPT” section that maps rendered output to the current Personalization workflow and keeps the repository/CLI path first-class for version-controlled use.
- Replaced marketing-heavy builder copy with direct product descriptions.
- Rewrote the canonical English README as a concise onboarding document and added `README.id.md` as the official Indonesian README.
- Clarified `profiles/operational/` as public-safe maintainer/account targets for dogfooding and audit, not reusable presets.
- Updated profile-design and product-mapping documentation for the General-first public workflow and current 2026-09-03 product-limit review.
- Extended builder asset/version tests and CI syntax checks to cover the bilingual runtime.

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
- Expanded behavioral regression scenarios to distinguish quick current lookups from deep multi-source research, conflicting-source analysis, quantitative research, repository triangulation, writing cleanup, and false-positive preservation.
- Added regression tests for the Yasman explanation/research contract and field-limit headroom.
- Fixed profile `$schema` references after the preset/maintainer directory reorganization and added a regression test that resolves every profile schema path.
- Documented that Project Instructions override global Custom Instructions and that standard Search and dedicated Deep Research are different product behaviors.

### Repository experience

- Restored theme-aware README visuals for the v2 architecture.
- Added a dedicated 1280×640 social preview asset plus Open Graph/Twitter metadata and a lightweight favicon for the browser builder.
- Rebuilt the browser builder presentation as separate experience, motion, mobile, and localization layers.
- Added reduced-motion fallbacks and CI syntax checks for the browser runtime.
- Added a clear independent-project disclaimer to avoid implying OpenAI affiliation or endorsement.
- Added a project code of conduct and expanded the security policy.
- Added Dependabot monitoring for GitHub Actions and updated the workflow to the current v7 major releases of `actions/checkout`, `actions/setup-python`, and `actions/setup-node`.

### Schema v2 and public-first architecture

- Reframed the repository from a three-field Custom Instructions helper into a complete ChatGPT personalization configuration toolkit.
- Added explicit `product`, `identity`, and `instructions` layers.
- Added Personality, Characteristics, and Memory intent to the profile schema.
- Added a dedicated explanation contract with principle, dependency sequence, terminology policy, and depth policy.
- Removed `long_answers` as a formatting trigger and added `OUTLINE_BIAS` linting for rules that may force numbered or outline-style responses.
- Added UI/UX and writing sections as first-class instruction groups.
- Expanded research guidance around primary sources, repositories, source code, releases, issues, evidence separation, and testing.
- Reorganized reusable starting points into `profiles/presets/`, public real-world examples into `profiles/maintainers/`, operational account targets into `profiles/operational/`, and private user profiles into gitignored `profiles/local/`.
- Changed renderer output to `settings.md`, `occupation.txt`, `more-about-you.txt`, and `custom-instructions.txt`.
- Added selectable 1,500- and 5,000-character validation targets without storing plan data inside profiles.
- Added v1-to-v2 migration documentation.
- Added machine-readable behavioral regression cases alongside the human-readable scenario suite.

## 0.1.0 - 2026-07-13

Initial public release.

- Added the field-aware v1 profile format and JSON Schema.
- Added the dependency-free renderer and linter.
- Added manual evaluation scenarios.
- Added reusable example profiles.
- Added documentation for profile design, privacy, and testing.
