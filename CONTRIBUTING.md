# Contributing

Thanks for helping improve ChatGPT Personalization. The project favors focused, reviewable changes over large prompt dumps or broad rewrites.

## Good contributions

Useful contributions include:

- fixes to the schema, renderer, linter, browser builder, or tests;
- documentation corrections backed by current product behavior or primary sources;
- new regression scenarios for a real, repeated failure mode;
- reusable presets that cover a genuinely distinct use case;
- accessibility, mobile, or usability improvements to the browser builder and repository documentation.

## Presets are not personal profiles

Files in `profiles/presets/` must be reusable by people who share a broad use case. They may describe a role, but must not include a real person's name, employer, client data, private project history, credentials, or other identifying context.

Intentionally public real-world examples belong in `profiles/maintainers/`. Private personal profiles belong in `profiles/local/`, which is ignored by Git by default.

Core tooling must remain identity-agnostic. Do not add special-case behavior for a named profile.

## Design principles

- Keep product settings, durable user context, global instructions, project rules, and task-local requirements separate.
- Prefer observable behavior over prestige personas or vague quality adjectives.
- Add a behavioral rule only when it encodes a real requirement or addresses an observed failure.
- Keep formatting conditional on the shape of the information rather than answer length.
- State a preference once when possible; duplicated instructions can over-weight minor rules.
- Treat ChatGPT field names, plan availability, limits, and UI controls as changeable product details.
- Keep runtime dependencies minimal. Optional integrations should stay optional.

## Before opening a pull request

Run:

```bash
python -m unittest discover -s tests -p "test_*.py" -v
python tools/profile.py lint profiles/presets/*.json profiles/maintainers/*.json
node --check docs/renderer.js
node --check docs/app.js
node --check tests/render_profile.js
python tests/check_renderer_parity.py
```

If you change behavioral guidance, also run the relevant prompts from `tests/scenarios.md` against a baseline and record the failure you are trying to fix. Structural tests alone are not evidence of better model behavior.

For browser or README presentation changes, check both a normal desktop width and a narrow mobile width. Avoid layouts that only look correct on a wide screen.

## Pull request scope

Small, coherent pull requests are easier to review. A schema migration may legitimately touch tooling, tests, docs, and examples together; unrelated visual, wording, and behavioral changes should usually be separate.

Explain:

- what changed;
- why the change is needed;
- what user-visible behavior it affects;
- how you validated it;
- any compatibility or migration impact.

## Schema changes

Backward-incompatible changes require a schema version bump and migration notes. Do not silently reinterpret older profiles.

## Security and privacy

Never include API keys, access tokens, credentials, client data, or sensitive personal information in issues, pull requests, fixtures, or public profiles. Read `SECURITY.md` before reporting a vulnerability.

By participating in the project, you agree to follow `CODE_OF_CONDUCT.md`.
