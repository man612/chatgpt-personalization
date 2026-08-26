# Profiles

The repository separates **reusable presets**, **public reference profiles**, **operational account targets**, and **private local profiles**. These roles are intentionally different: a generic starter, a public example, a real account source of truth, and private working context should not collapse into one file.

```text
profiles/
├── presets/       reusable, anonymous starting points
├── maintainers/   public reference implementations
├── operational/   public-safe account targets for self-audit and AI-assisted setup
└── local/         private profiles for your own machine; JSON files are gitignored
```

## Presets

Files in `presets/` are public starting points. They may describe a role such as student, product designer, or technology generalist, but they should not contain a real person's name, employer, client data, private project history, or secrets.

Choose the nearest preset, then customize it. `blank.json` is the least opinionated starting point.

## Maintainer profiles

Files in `maintainers/` are intentionally public reference implementations. They show how the generic schema can represent a real person without adding person-specific branches to the renderer, linter, schema, or browser builder.

`maintainers/yasman.json` is a reference example, not the maintainer's live account source of truth, not a universal recommendation, and not the default template in the browser builder.

## Operational profiles

Files in `operational/` are version-controlled targets for an actual account or user workflow. They are useful when a human or AI assistant needs to audit current ChatGPT settings, detect drift, or regenerate the intended Personalization fields.

Operational profiles use the same v2 schema and renderer as the rest of the repository. They are deliberately separate from maintainer examples so a public reference can stay stable while the real desired setup evolves.

Because this repository is public, committed operational profiles must remain public-safe. Read [`operational/README.md`](operational/README.md) before adding one.

## Local profiles

Create personal profiles in `profiles/local/` when you do not want them committed:

```bash
cp profiles/presets/blank.json profiles/local/me.json
python tools/profile.py lint profiles/local/me.json --limit 5000
python tools/profile.py render profiles/local/me.json --out build/me
```

`profiles/local/*.json` and `*.jsonc` are ignored by Git. The directory README stays tracked so the privacy-first workflow is discoverable.

A local profile may be more private or experimental than an operational profile, but gitignore is not encryption. Do not put credentials or unnecessary sensitive information there.

## Scope rules

A global profile should contain durable user context and global response preferences. Temporary project details belong in a ChatGPT Project or the current conversation. Secrets, credentials, client data, and sensitive information that does not need to be global should stay out of public profiles entirely.

Product controls such as Personality, Characteristics, Memory options, field labels, and Custom Instructions limits can change over time. The profile stores intended settings; the product-mapping documentation explains how to apply them to the current ChatGPT interface.
