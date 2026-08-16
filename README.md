<h1 align="center">ChatGPT Personalization</h1>

<p align="center">
  Build, version, lint, render, and evaluate ChatGPT personalization profiles without turning one person's preferences into a universal prompt.
</p>

<p align="center">
  <a href="https://man612.github.io/chatgpt-personalization/"><strong>Open the browser builder</strong></a>
  · <a href="#quick-start">Quick start</a>
  · <a href="#choose-a-starting-point">Presets</a>
  · <a href="docs/testing.md">Evaluation</a>
</p>

<p align="center">
  <sub>Python 3.11+ · no runtime dependencies · JSON Schema · browser builder · MIT</sub>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark-v3.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-light-v3.svg">
  <img alt="ChatGPT Personalization public-first workflow" src="assets/hero-light-v3.svg" width="100%">
</picture>

<br>

<table>
<tr>
<td width="33%" valign="top">
<strong>Start reusable</strong><br><br>
Pick an anonymous preset instead of inheriting someone else's identity or preferences.
</td>
<td width="33%" valign="top">
<strong>Keep personal things personal</strong><br><br>
Customize in <code>profiles/local/</code>, which is ignored by Git by default. Public maintainer profiles stay clearly separated.
</td>
<td width="33%" valign="top">
<strong>Test the behavior</strong><br><br>
Validate structure, render copy-ready fields, then use repeatable scenarios to catch regressions in explanation, research, and formatting.
</td>
</tr>
</table>

ChatGPT Personalization is an open-source toolkit for treating personalization as **maintainable configuration** instead of an unversioned block of prompt text. The core is generic: anyone can start from a preset, customize a profile, validate it, render copy-ready settings, and test whether the behavior actually improves.

The repository also contains a public maintainer profile for Yasman as a real-world reference implementation. Nothing in the schema, renderer, linter, browser builder, or CI contains Yasman-specific behavior.

> [!NOTE]
> This project does not make a model more capable, bypass product rules, or guarantee better answers. Structural validation proves that a profile is well-formed; behavioral improvement still needs evaluation on representative prompts.

## Why this exists

ChatGPT personalization can span a selected Personality, Characteristics, Memory, Custom Instructions, project-scoped context, and task-local instructions. Those layers have different scopes and can conflict, so this repository keeps them conceptually separate instead of stuffing everything into one giant prompt.

The project also follows a test-driven approach to prompt changes: keep instructions lean, state rules once, and validate changes against representative scenarios rather than assuming that more prompt text is better. See [`docs/references.md`](docs/references.md) for the research basis and limitations.

## Public-first architecture

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/architecture-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/architecture-light.svg">
  <img alt="Public-first personalization profile architecture" src="assets/architecture-light.svg" width="100%">
</picture>

<br>

The boundary is intentional:

- **Presets** are anonymous, reusable starting points.
- **Local profiles** are personal configurations and are gitignored by default.
- **Maintainer profiles** are intentionally public real-world examples, not universal defaults.

<details>
<summary><strong>See the v2 profile model</strong></summary>

```text
profile
├── product
│   ├── personality
│   ├── characteristics
│   └── memory
├── identity
│   ├── occupation
│   ├── background
│   ├── experience
│   ├── recurring_uses
│   └── stable_preferences
└── instructions
    ├── language / tone / audience
    ├── explanation
    ├── structure
    ├── technical
    ├── research
    ├── ui_ux
    ├── writing
    └── avoid
```

`instructions.explanation` is intentionally explicit. A label such as “beginner-friendly” is ambiguous; a useful profile can instead define the teaching sequence, terminology policy, and how much technical depth must be preserved.

The structure rules also avoid using answer length as a formatting trigger. A long explanation can remain connected prose when it is teaching one continuous idea, while checklists, procedures, and comparisons can still use lists or tables when those formats improve usability.

</details>

## Choose a starting point

| Preset | Best suited for |
| --- | --- |
| [`blank.json`](profiles/presets/blank.json) | Least-opinionated starting point |
| [`knowledge-worker.json`](profiles/presets/knowledge-worker.json) | Office work, research, planning, documentation, and practical decisions |
| [`tech-generalist.json`](profiles/presets/tech-generalist.json) | Troubleshooting, practical technology, AI-assisted development, research, and UI/UX |
| [`student.json`](profiles/presets/student.json) | Structured learning without assuming expert vocabulary |
| [`product-designer.json`](profiles/presets/product-designer.json) | Product thinking, interface critique, flows, and design systems |
| [`writer-editor.json`](profiles/presets/writer-editor.json) | Drafting, rewriting, editing, tone, and language-sensitive work |

The maintainer's public reference profile lives separately at [`profiles/maintainers/yasman.json`](profiles/maintainers/yasman.json).

## Quick start

Clone the repository, copy a preset into the private local area, edit it, then lint and render it:

```bash
git clone https://github.com/man612/chatgpt-personalization.git
cd chatgpt-personalization

cp profiles/presets/blank.json profiles/local/me.json
python tools/profile.py lint profiles/local/me.json --limit 5000
python tools/profile.py render profiles/local/me.json --out build/me --limit 5000
```

The renderer creates:

```text
build/me/
├── settings.md
├── occupation.txt
├── more-about-you.txt
└── custom-instructions.txt
```

`settings.md` is a human-readable checklist for product-level controls. The text files are copy-ready for the closest matching personalization fields in the current ChatGPT interface.

## Browser builder

The GitHub Pages builder is dependency-free and runs entirely in the browser. It starts from **Blank**, not from the maintainer profile. Public presets are grouped separately from the maintainer reference example.

The browser checks profile structure and the selected Custom Instructions target. The Python CLI adds secret-pattern, repeated-text, prompt-bloat, over-constraint, and outline-bias checks.

<p align="center">
  <a href="https://man612.github.io/chatgpt-personalization/"><strong>Open the browser builder →</strong></a>
</p>

## Validation targets

The CLI does not store a plan name in the profile. Instead, choose the Custom Instructions validation target that matches the product surface you are using. Product limits can change, so the number stays a validation input rather than permanent schema truth.

```bash
# 1,500-character target
python tools/profile.py lint profiles/local/me.json --limit 1500

# 5,000-character target
python tools/profile.py lint profiles/local/me.json --limit 5000
```

The browser builder exposes the same target choice without storing it in the downloaded profile.

## Evaluation

A valid JSON profile is not automatically a better personalization. The repository therefore keeps two kinds of tests separate:

- **Engineering tests** verify schema handling, linting, rendering, browser/Python parity, and CLI behavior.
- **Behavioral evals** compare real outputs against predefined criteria such as terminology order, paragraph flow, research evidence, troubleshooting verification, or correct use of lists.

[`tests/scenarios.md`](tests/scenarios.md) is human-readable and [`tests/scenarios.json`](tests/scenarios.json) is machine-readable. Run the scenarios manually in ChatGPT, or adapt the JSON cases to an external eval harness.

## Design rules

The generic core follows a few deliberately boring rules: presets stay anonymous; personal data belongs in local or explicitly public maintainer profiles; project-specific instructions do not belong in global personalization; product details that can change are documented rather than hard-coded as permanent truths; and a new instruction should fix an observed failure or encode a real product requirement.

| Guide | Purpose |
| --- | --- |
| [`docs/guide.md`](docs/guide.md) | Design and maintain a profile |
| [`docs/product-mapping.md`](docs/product-mapping.md) | Map profile intent to the current ChatGPT surface |
| [`docs/testing.md`](docs/testing.md) | Evaluate behavior without overstating the evidence |
| [`docs/privacy.md`](docs/privacy.md) | Keep secrets and unnecessary personal data out |
| [`docs/references.md`](docs/references.md) | Research basis, related projects, and limitations |

<details>
<summary><strong>Repository structure</strong></summary>

```text
.github/    Contribution templates and CI
assets/     Theme-aware README visuals
docs/       Browser builder, mapping, guidance, privacy, and references
profiles/   Public presets, maintainer examples, and private-local workflow
spec/       JSON Schema for profile files
tests/      Unit tests, renderer parity, and behavioral scenarios
tools/      Dependency-free renderer and linter
```

</details>

## Contributing

Contributions are welcome for schema improvements, generic presets, tooling, browser UX, tests, and documentation. Personal profiles should not be proposed as universal defaults. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

MIT.
