<h1 align="center">ChatGPT Personalization</h1>

<p align="center">
  Version, lint, render, and evaluate a complete ChatGPT personalization setup as reviewable JSON.
</p>

<p align="center">
  <a href="https://man612.github.io/chatgpt-personalization/"><strong>Open the browser builder</strong></a>
  ·
  <a href="#quick-start">CLI quick start</a>
  ·
  <a href="#v2-profile-model">v2 model</a>
  ·
  <a href="#evaluation">Evaluation</a>
</p>

<p align="center">
  <sub>Python 3.11+ · Node only for parity tests · no runtime dependencies · JSON Schema · MIT</sub>
</p>

ChatGPT Personalization is a small toolkit for treating personalization like configuration instead of an unversioned prompt pasted into a settings box.

Version 2 expands the project beyond Custom Instructions. A profile now separates **product-level personalization**, **durable user context**, and **response behavior** so Personality, Characteristics, Memory, identity, and instructions do not compete inside one oversized prompt.

> [!NOTE]
> This project does not make a model more capable, bypass product rules, or guarantee better answers. It helps make intended behavior explicit, reviewable, testable, and easier to maintain.

## Why v2 exists

The original v1 model rendered three fields: occupation, more-about-you, and response preferences. That was useful, but it mixed two different concerns: product settings and prompt text.

Modern ChatGPT personalization can include a selected Personality, Characteristics such as warmth and Headers & Lists, Memory settings, Custom Instructions, Project instructions, and task-local requests. These layers have different scopes and can conflict. v2 makes that separation explicit.

It also removes one problematic design assumption from the original technology profile: **answer length no longer triggers numbered sections**. Long explanations should stay connected when they are teaching one continuous idea; headings and lists are used because they improve comprehension, not because the answer crossed an arbitrary length threshold.

## v2 profile model

```text
profile
├── product
│   ├── personality
│   ├── characteristics
│   │   ├── warm
│   │   ├── enthusiastic
│   │   ├── headers_and_lists
│   │   └── emojis
│   └── memory
│       ├── saved_memories
│       └── reference_chat_history
├── identity
│   ├── occupation
│   ├── background
│   ├── experience
│   ├── recurring_uses
│   └── stable_preferences
└── instructions
    ├── language / tone / audience
    ├── explanation
    │   ├── principle
    │   ├── sequence
    │   ├── terminology
    │   └── depth
    ├── structure
    ├── technical
    ├── research
    ├── ui_ux
    ├── writing
    └── avoid
```

The important addition is `instructions.explanation`. “Beginner-friendly” is too ambiguous by itself. v2 can specify an actual teaching sequence such as ordinary-language concept → problem solved → bigger-picture position → example → technical term/mechanism → implementation details and trade-offs.

That makes it possible to express a rule such as:

> Plain language should reduce linguistic complexity, not informational depth.

## What gets rendered

The CLI and browser renderer produce four outputs:

```text
settings.md
occupation.txt
more-about-you.txt
custom-instructions.txt
```

`settings.md` is a human-readable checklist for product-level settings. The other three are copy-ready text for the closest matching fields in the current ChatGPT interface.

The repository deliberately does **not** pretend that every ChatGPT account exposes identical fields, labels, sliders, plans, or limits. Product surfaces change. The schema stores intent; the mapping guide explains how to apply it to the current UI.

## Quick start

```bash
git clone https://github.com/man612/chatgpt-personalization.git
cd chatgpt-personalization

python tools/profile.py lint profiles/yasman.json
python tools/profile.py render profiles/yasman.json --out build/yasman
```

Use a different configured long-field limit when your ChatGPT surface has a smaller limit:

```bash
python tools/profile.py lint profiles/tech-generalist.json --limit 1500
```

The default limit is 5,000 characters because the repository's current maintainer profile targets a paid ChatGPT surface. Treat the number as a configurable validation target, not a permanent product guarantee.

## Profiles

| Profile | Purpose |
| --- | --- |
| [`yasman.json`](profiles/yasman.json) | Maintainer's public working profile; deepest example of the v2 model |
| [`tech-generalist.json`](profiles/tech-generalist.json) | Practical technology, troubleshooting, AI-assisted development, research, UI/UX |
| [`knowledge-worker.json`](profiles/knowledge-worker.json) | Office work, research, planning, documentation, decisions |
| [`student.json`](profiles/student.json) | Learning without assuming expert vocabulary |
| [`product-designer.json`](profiles/product-designer.json) | Product thinking, interface critique, interaction flows |
| [`writer-editor.json`](profiles/writer-editor.json) | Drafting and editing while preserving voice |
| [`blank.json`](profiles/blank.json) | Minimal v2 starting point |

## Validation

Run the automated checks with:

```bash
python -m unittest discover -s tests -p "test_*.py" -v
python tools/profile.py lint profiles/*.json
node --check docs/renderer.js
node --check docs/app.js
python tests/check_renderer_parity.py
```

The linter checks structure, field types, unsupported properties, duplicate array values, configured output limits, several recognizable secret formats, repeated text, prompt-bloat patterns, and a specific `OUTLINE_BIAS` warning for rules that may force numbered/outline-style answers.

The browser and Python renderers share the same output contract. `tests/check_renderer_parity.py` compares them across fixtures and every example profile.

## Evaluation

Passing unit tests does not prove that personalization improves model behavior.

The repository therefore keeps behavioral evaluation separate. [`tests/scenarios.md`](tests/scenarios.md) includes regression scenarios for:

- beginner explanations that remain technically deep;
- programming concepts explained in dependency order;
- deep research with source verification;
- actual repository analysis rather than README-only summaries;
- troubleshooting with cause → minimal fix → verification → risk;
- concrete UI/UX critique;
- artifact-tone overrides;
- relevance boundaries;
- format exceptions such as checklists;
- short factual questions that should remain short.

Compare a candidate profile against a baseline on the same ChatGPT model and product surface. Keep a rule only when it produces a repeatable improvement that matters.

## Scope rules

Use each layer for one job:

- **product** — recommended ChatGPT Personality, Characteristics, and Memory intent;
- **identity** — stable information about the user that changes explanations;
- **instructions** — global response behavior;
- **Memory** — useful evolving context that does not need exact wording;
- **Project instructions** — rules limited to one project/workspace;
- **current prompt** — temporary requirements and output details.

Do not put project names, deadlines, secrets, client data, or one-off formatting requirements into a global profile.

## Browser builder

The GitHub Pages builder runs entirely in the browser. It loads public profile templates, lets you edit nested fields, validates the v2 shape, previews all four rendered outputs, and downloads the resulting JSON.

Edited profile contents are not uploaded by the page.

## Migration from v1

v1 profiles are intentionally rejected with a migration message instead of being silently reinterpreted. See [`docs/migration-v2.md`](docs/migration-v2.md).

The key migration is:

```text
occupation        -> identity.occupation
about.*           -> identity.*
response.*        -> instructions.*
new               -> product.*
new               -> instructions.explanation.*
removed           -> response.structure.long_answers
```

## Documentation

- [`docs/guide.md`](docs/guide.md) — how to design a profile without prompt bloat
- [`docs/product-mapping.md`](docs/product-mapping.md) — how v2 layers map to current ChatGPT surfaces
- [`docs/testing.md`](docs/testing.md) — behavioral evaluation method
- [`docs/migration-v2.md`](docs/migration-v2.md) — migration from v1
- [`docs/privacy.md`](docs/privacy.md) — keep secrets and unnecessary personal data out
- [`docs/references.md`](docs/references.md) — official sources and design basis

## License

MIT.
