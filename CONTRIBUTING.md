# Contributing

Contributions are welcome when they improve the schema, renderer, linter, browser builder, documentation, behavioral scenarios, or a genuinely distinct reusable profile.

## Design principles

- Keep product settings, durable user context, global instructions, project rules, and task-local requirements separate.
- Prefer observable behavior over prestige personas or vague quality adjectives.
- Do not add a rule only because it sounds good. Point to a real failure mode or evaluation scenario.
- Keep formatting conditional on information shape rather than answer length.
- Keep example profiles reusable and free of secrets or unnecessary personal data.
- Treat current ChatGPT field names, plan availability, limits, and UI controls as changeable product details.

## Before opening a pull request

Run:

```bash
python -m unittest discover -s tests -p "test_*.py" -v
python tools/profile.py lint profiles/*.json
node --check docs/renderer.js
node --check docs/app.js
python tests/check_renderer_parity.py
```

If you change behavior guidance, also run the relevant prompts from `tests/scenarios.md` against a baseline and describe the observed failure you are trying to fix. Do not claim a model-performance improvement from structural tests alone.

## Schema changes

Schema changes that break existing profiles require a version bump and migration notes. Do not silently reinterpret an older schema version.
