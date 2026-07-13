# Contributing

This project values small, reviewable improvements over large prompt dumps.

## Useful contributions

Good contributions include clearer documentation, reproducible evaluation cases, validator improvements, corrections to current product notes, and example profiles that represent a genuinely distinct use case.

A new example profile should explain who it is for, avoid private or identifying details, pass the linter, and differ materially from existing profiles.

## Before opening a pull request

Run the tests and lint every example profile:

```bash
python -m unittest discover -s tests -v
python tools/profile.py lint profiles/*.json
```

Keep changes focused. Do not combine a documentation rewrite, a schema change, and several new profiles in one pull request unless they are inseparable.

## Writing standard

Use plain English. Avoid marketing claims, decorative headings, fake authority, unexplained acronyms, and phrases such as “ultimate,” “revolutionary,” “unlock the power,” or “100% accurate.”

Explain why a rule exists when that reason is not obvious. Prefer an example over a paragraph of abstract advice.

## Profile standard

A profile must contain only stable, reusable information. Temporary tasks, employer-confidential information, account credentials, medical records, financial identifiers, and other sensitive details do not belong in a public example.

Global response preferences should not force a single format onto every task. For example, “use numbered sections for long analytical answers” is acceptable; “always use seven numbered sections” is not.

## Schema changes

Changes to `spec/profile.schema.json` require an update to the renderer, tests, documentation, and `CHANGELOG.md`. Backward-incompatible changes require a new major schema version.

## Commit messages

Use concise, descriptive commit messages. Conventional prefixes such as `docs:`, `feat:`, `fix:`, and `test:` are welcome but not required.
