<h1 align="center">ChatGPT Personalization</h1>

<p align="center">
  Build, validate, and maintain reusable ChatGPT personalization profiles.
</p>

<p align="center">
  <a href="README.md"><strong>English</strong></a> · <a href="README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://man612.github.io/chatgpt-personalization/"><strong>Open Builder</strong></a>
  · <a href="docs/guide.md">Guide</a>
  · <a href="docs/testing.md">Testing</a>
</p>

<p align="center">
  <a href="https://github.com/man612/chatgpt-personalization/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/man612/chatgpt-personalization/ci.yml?branch=main&style=flat-square&label=CI" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/man612/chatgpt-personalization?style=flat-square" alt="MIT License"></a>
  <a href="spec/profile.schema.json"><img src="https://img.shields.io/badge/schema-v2.0-8250df?style=flat-square" alt="Schema v2.0"></a>
</p>

<p align="center"><sub>Independent open-source project · not affiliated with or endorsed by OpenAI</sub></p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark-v3.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-light-v3.svg">
  <img alt="ChatGPT Personalization workflow" src="assets/hero-light-v3.svg" width="100%">
</picture>

ChatGPT Personalization stores product settings, durable user context, and response instructions in a structured JSON profile. Use the browser builder for the simplest setup or the repository tools for a version-controlled workflow.

## Quick start

### Browser builder — recommended

Open the **[ChatGPT Personalization Builder](https://man612.github.io/chatgpt-personalization/)**.

1. Choose a preset. **General** is the recommended default for everyday English or Indonesian use.
2. Customize product settings, durable context, and response behavior.
3. Select the Custom Instructions character target for your ChatGPT plan.
4. Validate the profile.
5. Copy the rendered fields into **ChatGPT → Settings → Personalization**.
6. Save the profile JSON if you want a reusable copy.

The builder is static, requires no sign-in, and keeps edits in the browser.

### Repository / CLI

Use this path when you want version control, local profiles, repeatable rendering, or regression testing.

```bash
git clone https://github.com/man612/chatgpt-personalization.git
cd chatgpt-personalization

cp profiles/presets/general.json profiles/local/me.json
python tools/profile.py lint profiles/local/me.json --limit 5000
python tools/profile.py render profiles/local/me.json --out build/me --limit 5000
```

Use `profiles/presets/blank.json` instead if you want no behavioral defaults.

The renderer creates:

```text
build/me/
├── settings.md
├── occupation.txt
├── more-about-you.txt
└── custom-instructions.txt
```

`settings.md` is a checklist for ChatGPT product controls. The remaining files map to the closest matching Personalization fields.

## Presets

| Preset | Intended use |
| --- | --- |
| [`general.json`](profiles/presets/general.json) | Recommended balanced starting point for everyday English or Indonesian use |
| [`blank.json`](profiles/presets/blank.json) | No behavioral defaults |
| [`tech-generalist.json`](profiles/presets/tech-generalist.json) | Technology, troubleshooting, assisted development, research, and UI/UX |
| [`knowledge-worker.json`](profiles/presets/knowledge-worker.json) | Research, planning, documentation, and practical decisions |
| [`student.json`](profiles/presets/student.json) | Learning and explanation without assuming expert vocabulary |
| [`product-designer.json`](profiles/presets/product-designer.json) | Product thinking, interface critique, and design decisions |
| [`writer-editor.json`](profiles/presets/writer-editor.json) | Drafting, rewriting, editing, and tone-sensitive work |

Public presets are anonymous and reusable. They must not contain maintainer-specific identity or private context.

## Writing behavior

All opinionated public presets use the repository's compact **natural-writing core** for English and Indonesian. It preserves facts and source voice, uses user-provided writing samples when available, and performs one light audit for recurring assistant residue such as filler, rigid symmetry, fake casualness, staged rhetoric, generic endings, and unsupported drafting residue.

The core is adapted from high-value ideas in **Sepia** with selected **Humanizer** audit patterns. It is not an AI detector and is not intended to bypass detection systems. Language-specific punctuation and grammar follow the actual language and destination rather than a universal blacklist.

See [`docs/writing/core.md`](docs/writing/core.md) and [`docs/writing/indonesian-ai-tells.md`](docs/writing/indonesian-ai-tells.md). **Blank** intentionally does not inherit these rules.

## Profile roles

```text
profiles/
├── presets/       reusable public starting points
├── local/         private or experimental profiles; gitignored
├── maintainers/   intentionally public reference examples
└── operational/   public-safe account targets used for dogfooding/audit
```

Normal users should start from `profiles/presets/` and save personal work under `profiles/local/`.

Maintainer and operational profiles are not defaults and are not shown as builder starting points. The Yasman files are retained as public examples of how the maintainer uses and audits the project; they are not profiles other users are expected to copy.

## Validation and evaluation

The linter checks schema validity, field limits, possible secrets, repeated text, prompt bloat, over-constraint, and outline bias. Browser and Python renderers are checked for parity in CI.

Structural validity does not prove better model behavior. Behavioral changes should be tested with representative prompts before they become defaults. Human-readable scenarios live in [`tests/scenarios.md`](tests/scenarios.md); machine-readable cases live in [`tests/scenarios.json`](tests/scenarios.json).

## Documentation

- [`docs/guide.md`](docs/guide.md) — profile design and maintenance
- [`docs/product-mapping.md`](docs/product-mapping.md) — mapping profile fields to ChatGPT product surfaces
- [`docs/testing.md`](docs/testing.md) — behavioral evaluation
- [`docs/privacy.md`](docs/privacy.md) — data hygiene
- [`docs/references.md`](docs/references.md) — research basis and limitations
- [`docs/writing/core.md`](docs/writing/core.md) — generic natural-writing policy
- [`profiles/operational/README.md`](profiles/operational/README.md) — operational-profile scope

## Contributing

Focused contributions are welcome. Keep generic tooling identity-agnostic, keep public presets reusable, and add behavioral rules only for observable requirements or repeated failure modes.

Read [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and [`SECURITY.md`](SECURITY.md) before contributing.

## License

Released under the [MIT License](LICENSE). Third-party adaptations and their original notices are documented in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
