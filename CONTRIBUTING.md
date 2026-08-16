# Contributing

Contributions are welcome when they improve the generic schema, renderer, linter, browser builder, documentation, behavioral scenarios, or a genuinely distinct reusable preset.

## Presets are not personal profiles

A file in `profiles/presets/` must be reusable by people who share a broad use case. It may describe a role, but it must not contain a real person's name, employer, client, private project history, credentials, or other identifying context.

Real public examples belong in `profiles/maintainers/`. Private user profiles belong in `profiles/local/` and are gitignored by default. No named profile may require special-case behavior in the core tooling.

## Design principles

- Keep product settings, durable user context, global instructions, project rules, and task-local requirements separate.
- Prefer observable behavior over prestige personas or vague quality adjectives.
- Do not add a rule only because it sounds good. Point to a real failure mode, product requirement, or evaluation scenario.
- Keep formatting conditional on information shape rather than answer length.
- State a preference once when possible; duplicated instructions can over-weight minor rules.
- Treat ChatGPT field names, plan availability, limits, and UI controls as changeable product details.
- Keep runtime dependencies minimal. Optional eval integrations should remain optional.

## Before opening a pull request

Run:

```bash
python -m unittest discover -s tests -p "test_*.py" -v
python tools/profile.py lint profiles/presets/*.json profiles/maintainers/*.json
node --check docs/renderer.js
node --check docs/app.js
python tests/check_renderer_parity.py
```

If you change behavior guidance, also run the relevant prompts from `tests/scenarios.md` against a baseline and record the failure you are trying to fix. Do not claim model-performance improvement from structural tests alone.

## Schema changes

Schema changes that break existing profiles require a version bump and migration notes. Do not silently reinterpret an older schema version.
