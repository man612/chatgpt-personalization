## Purpose

Explain the concrete failure, product change, or maintenance problem this PR addresses.

## What changed

Describe the affected v2 layers (`product`, `identity`, `instructions`) and any renderer, linter, browser, documentation, or evaluation changes.

## Validation

```bash
python -m unittest discover -s tests -p "test_*.py" -v
python tools/profile.py lint profiles/*.json
node --check docs/renderer.js
node --check docs/app.js
python tests/check_renderer_parity.py
```

Describe any behavioral scenarios you compared against a baseline. Structural tests alone do not prove response quality improved.

## Checklist

- [ ] Product-specific assumptions are documented as changeable rather than permanent facts.
- [ ] Public profiles contain no secrets, confidential information, or unnecessary personal data.
- [ ] New instructions describe observable behavior rather than prestige or vague quality claims.
- [ ] Formatting rules follow information shape rather than answer length.
- [ ] Documentation, migration notes, and changelog are updated when needed.
