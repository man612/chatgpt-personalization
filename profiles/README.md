# Profiles

The repository separates **reusable presets** from **real personal profiles**. This matters because a public starter template and one person's long-term context are different things.

```text
profiles/
├── presets/       reusable, anonymous starting points
├── maintainers/   public reference profiles used by project maintainers
└── local/         private profiles for your own machine; JSON files are gitignored
```

## Presets

Files in `presets/` are public starting points. They may describe a role such as student, product designer, or technology generalist, but they should not contain a real person's name, employer, client data, private project history, or secrets.

Choose the nearest preset, then customize it. `blank.json` is the least opinionated starting point.

## Maintainer profiles

Files in `maintainers/` are public reference implementations. They show how the same generic schema can represent a real person without adding person-specific branches to the renderer, linter, schema, or browser builder.

`maintainers/yasman.json` is the maintainer's working profile. It is **not** a universal recommendation and is not the default template in the browser builder.

## Local profiles

Create personal profiles in `profiles/local/` when you do not want them committed:

```bash
cp profiles/presets/blank.json profiles/local/me.json
python tools/profile.py lint profiles/local/me.json --limit 5000
python tools/profile.py render profiles/local/me.json --out build/me
```

`profiles/local/*.json` and `*.jsonc` are ignored by Git. The directory README stays tracked so the privacy-first workflow is discoverable.

## Scope rules

A global profile should contain durable user context and global response preferences. Temporary project details belong in a ChatGPT Project or the current conversation. Secrets, credentials, client data, and sensitive information that does not need to be global should stay out of public profiles entirely.

Product controls such as Personality, Characteristics, Memory options, field labels, and Custom Instructions limits can change over time. The profile stores intended settings; the product-mapping documentation explains how to apply them to the current ChatGPT interface.
