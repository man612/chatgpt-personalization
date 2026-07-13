## Purpose

Explain the problem this change solves.

## What changed

Describe the focused changes in this pull request.

## Validation

```bash
python -m unittest discover -s tests -v
python tools/profile.py lint "profiles/*.json"
```

Describe any manual profile scenarios you tested.

## Checklist

- [ ] The change is written in plain English.
- [ ] Public examples contain no sensitive or identifying information.
- [ ] Documentation and changelog are updated when needed.
- [ ] The change does not add inflated claims or redundant prompt text.
