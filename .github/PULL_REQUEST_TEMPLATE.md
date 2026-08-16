## Purpose

Explain the problem this change solves and whether it affects the generic core, a public preset, or a maintainer reference profile.

## What changed

Describe the focused changes. Personal preferences should not silently become preset defaults.

## Validation

```bash
python -m unittest discover -s tests -p "test_*.py" -v
python tools/profile.py lint profiles/presets/*.json profiles/maintainers/*.json
node --check docs/renderer.js
node --check docs/app.js
python tests/check_renderer_parity.py
```

Describe any behavioral scenarios tested and the baseline used.

## Checklist

- [ ] Public presets are anonymous and reusable.
- [ ] No secrets, client data, or unintended personal information were added.
- [ ] Product-specific limits or UI assumptions are documented as changeable.
- [ ] New behavioral rules correspond to a real requirement or observed failure.
- [ ] Documentation/changelog are updated when needed.
