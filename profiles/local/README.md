# Local profiles

Put personal or experimental profile JSON files here when they should stay on your machine. `*.json` and `*.jsonc` in this directory are ignored by Git.

Start from a public preset:

```bash
cp ../presets/blank.json ./me.json
python ../../tools/profile.py lint ./me.json --limit 5000
```

Do not assume Git ignore rules are a security boundary. Review `git status` before every commit, and do not store secrets in personalization profiles.
