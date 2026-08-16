<h1 align="center">ChatGPT Personalization</h1>

<p align="center">
  Build, version, lint, render, and evaluate ChatGPT personalization profiles without turning one person's preferences into a universal prompt.
</p>

<p align="center">
  <a href="https://man612.github.io/chatgpt-personalization/"><strong>Open the browser builder</strong></a>
  · <a href="#quick-start">Quick start</a>
  · <a href="#profile-types">Profile types</a>
  · <a href="docs/testing.md">Evaluation</a>
</p>

<p align="center"><sub>Python 3.11+ · no runtime dependencies · JSON Schema · browser builder · MIT</sub></p>

ChatGPT Personalization is an open-source toolkit for treating personalization as **maintainable configuration** instead of an unversioned block of prompt text. The core is generic: anyone can start from a preset, customize a profile, validate it, render copy-ready settings, and test whether the behavior actually improves.

The project also contains a public maintainer profile for Yasman, but that profile is only a real-world reference implementation. Nothing in the schema, renderer, linter, browser builder, or CI has Yasman-specific behavior.

> [!NOTE]
> This project does not make a model more capable, bypass product rules, or guarantee better answers. Structural validation proves that a profile is well-formed; behavioral improvement still needs evaluation on representative prompts.

## Why this exists

ChatGPT personalization is no longer one text box. Current product behavior can involve a selected Personality, Characteristics, Memory, Custom Instructions, project-scoped context, and task-local instructions. These layers have different scopes and can conflict, so the repository keeps them conceptually separate instead of stuffing everything into one giant prompt.

The project also follows a test-driven approach to prompt changes. OpenAI's current model guidance recommends leaner prompts, stating instructions once, and validating changes on representative evals rather than assuming that more instruction text is better. OpenAI's public Model Spec Evals similarly separates evaluation prompts from the harness that measures behavior. See `docs/references.md` for the research basis and limitations.

## Profile types

```text
profiles/
├── presets/
│   ├── blank.json
│   ├── knowledge-worker.json
│   ├── product-designer.json
│   ├── student.json
│   ├── tech-generalist.json
│   └── writer-editor.json
├── maintainers/
│   └── yasman.json
└── local/
    └── README.md
```

**Presets** are anonymous public starting points. **Maintainer profiles** are public real-world examples. **Local profiles** are for personal configuration and are gitignored by default. This separation keeps the repository useful to everyone without pretending one maintainer's preferences are universal.

## The v2 model

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

## Current Custom Instructions limits

The CLI does not store a plan name in the profile. Instead, choose the validation target that matches the product surface you are using. At the time of this repository review, ChatGPT Free and Go support 1,500 characters, while Plus, Pro, Business, Enterprise, and Education support 5,000. Product limits can change, so the number is a validation input, not permanent schema truth.

```bash
# Free / Go target
python tools/profile.py lint profiles/local/me.json --limit 1500

# Plus / Pro / Business / Enterprise / Education target
python tools/profile.py lint profiles/local/me.json --limit 5000
```

The browser builder exposes the same target choice without storing it in the downloaded profile.

## Browser builder

The GitHub Pages builder is dependency-free and runs entirely in the browser. It starts from **Blank**, not from the maintainer profile. Public presets are grouped separately from the maintainer reference example.

The browser checks profile structure and the selected Custom Instructions target. The Python CLI adds secret-pattern, repeated-text, prompt-bloat, over-constraint, and outline-bias checks.

## Evaluation

A valid JSON profile is not automatically a better personalization. The repository therefore keeps two kinds of tests separate:

- **engineering tests** verify schema handling, linting, rendering, browser/Python parity, and CLI behavior;
- **behavioral evals** compare real outputs against predefined criteria such as terminology order, paragraph flow, research evidence, troubleshooting verification, or correct use of lists.

`tests/scenarios.md` is human-readable and `tests/scenarios.json` is machine-readable. You can run the scenarios manually in ChatGPT, or adapt the JSON cases to an external eval harness. Automated API evals are useful for regression testing instruction text, but they are not a perfect reproduction of consumer ChatGPT because the API does not expose every ChatGPT personalization control.

## Design rules

The generic core follows a few deliberately boring rules: presets must stay anonymous; personal data belongs in local or explicitly public maintainer profiles; project-specific instructions do not belong in global personalization; product details that can change are documented rather than hard-coded as permanent truths; and a new instruction should fix an observed failure or encode a real product requirement.

Read `docs/guide.md` for profile design, `docs/product-mapping.md` for current ChatGPT mapping, `docs/testing.md` for evaluation, `docs/privacy.md` for data hygiene, and `docs/references.md` for the sources reviewed.

## Contributing

Contributions are welcome for schema improvements, generic presets, tooling, browser UX, tests, and documentation. Personal profiles should not be proposed as universal defaults. See `CONTRIBUTING.md`.

## License

MIT.
