# Operational profiles

Operational profiles are version-controlled, public-safe targets for a specific account or maintainer workflow. They support dogfooding, self-audit, and AI-assisted setup while using the same schema and renderer as every other profile.

They are **not public presets** and must not appear as normal builder starting points.

## Boundary

- An operational profile belongs to a named account or maintainer context.
- Keep only information that is intentionally safe to publish in this repository.
- Reusable behavior belongs in `profiles/presets/` or generic documentation, not only in one operational profile.
- Private or experimental variants belong in `profiles/local/`, which is gitignored by default.
- Product state can change independently of this file. Treat an operational profile as the desired setup target, not proof of the account's live state.
- Never store credentials, private chat logs, client data, secrets, or sensitive personal history here.

## AI-assisted audit

When the user explicitly asks an assistant to check, restore, compare, or update their setup:

1. Treat the user's current request as highest priority.
2. Read the matching operational profile as the desired account target.
3. Compare it only with product settings that are actually observable.
4. Mark settings that cannot be read as **unverified**, not mismatched.
5. Recommend the smallest change needed to restore the intended setup.

An operational profile is not automatically loaded by ChatGPT merely because it exists in this repository. A human or tool must explicitly read and apply it.

## Current maintainer target

`yasman.json` is intentionally retained as the maintainer's public-safe operational target. It is useful for dogfooding this project and auditing the maintainer's own ChatGPT setup, but it is **not** a profile other users are expected to copy.

A stable public reference example is kept separately at `profiles/maintainers/yasman.json`.
