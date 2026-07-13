# Example profiles

The files in this directory are starting points, not universal presets. Choose the closest profile, remove details that do not describe the intended user, and rewrite the remaining text in that user's own terms.

Each file follows `spec/profile.schema.json` and can be checked and rendered with:

```bash
python tools/profile.py lint profiles/<name>.json
python tools/profile.py render profiles/<name>.json --out build/<name>
```

Current examples:

- `knowledge-worker.json` for office work, research, writing, planning, and practical decisions;
- `tech-generalist.json` for practical technology work, troubleshooting, UI/UX, and assisted development;
- `student.json` for structured learning without assuming expert vocabulary;
- `product-designer.json` for product and UI/UX evaluation;
- `writer-editor.json` for drafting, editing, and language-sensitive work;
- `blank.json` as a minimal starting point.

A useful example should be reusable, distinct from the existing profiles, free of identifying information, and specific enough to request observable behavior. More profiles are not automatically better; add one only when it represents a meaningfully different use case.
