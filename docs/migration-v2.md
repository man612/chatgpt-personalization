# Migrating from schema v1 to v2

v2 deliberately breaks the v1 profile shape because the old model could not represent product-level personalization separately from Custom Instructions.

The CLI rejects `schema_version: "1.0"` with an explicit migration error instead of silently guessing how old fields should map.

## Field mapping

| v1 | v2 |
| --- | --- |
| `occupation` | `identity.occupation` |
| `about.background` | `identity.background` |
| `about.experience` | `identity.experience` |
| `about.recurring_uses` | `identity.recurring_uses` |
| `about.stable_preferences` | `identity.stable_preferences` |
| `response.language` | `instructions.language` |
| `response.tone` | `instructions.tone` |
| `response.audience` | `instructions.audience` |
| `response.technical` | `instructions.technical` |
| `response.research` | `instructions.research` |
| `response.avoid` | `instructions.avoid` |

New v2 fields include `product`, `instructions.explanation`, `instructions.ui_ux`, and `instructions.writing`.

## Structure migration

v1 used:

```json
"structure": {
  "long_answers": "...",
  "body": "...",
  "lists": "...",
  "tables": "..."
}
```

v2 uses:

```json
"structure": {
  "default": "...",
  "headings": "...",
  "lists": "...",
  "tables": "..."
}
```

Do not mechanically move an old `long_answers` instruction into `headings`.

If the old rule says “use numbered sections for long analysis”, remove the length trigger. Describe when headings actually help, for example: “Use headings when a long answer genuinely changes topic; keep a continuous explanation connected.”

## Add an explanation contract

Convert vague instructions such as “explain for a beginner” into the new explanation fields:

- `principle` — the main teaching rule;
- `sequence` — the dependency order for unfamiliar material;
- `terminology` — how jargon/acronyms should be introduced;
- `depth` — what must not be lost when language becomes simpler.

## Add product settings deliberately

Do not infer Personality or Characteristics from old tone adjectives. Choose them explicitly after reviewing the current ChatGPT controls.

Use the product layer to reduce duplicated prompt text. For example, lower `headers_and_lists` at the product level, then keep only the semantic rule about when lists are useful in Custom Instructions.
