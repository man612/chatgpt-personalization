# Example profiles

The profiles in this directory are starting points, not universal presets.

Each file follows `spec/profile.schema.json` and can be rendered with:

```bash
python tools/profile.py render profiles/<name>.json --out build/<name>
```

Choose the closest profile, remove irrelevant details, and rewrite it in your own words. A smaller accurate profile is better than a comprehensive profile that describes someone else.

Current examples:

- `knowledge-worker.json` for general office, research, writing, and planning work;
- `tech-generalist.json` for practical technology work and AI-assisted development;
- `student.json` for structured learning without assuming expert vocabulary;
- `product-designer.json` for product and UI/UX evaluation;
- `writer-editor.json` for drafting, editing, and language-sensitive work.

Profiles must remain generic enough to reuse and specific enough to produce observable behavior.
