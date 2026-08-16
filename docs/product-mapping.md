# Mapping v2 profiles to ChatGPT

The v2 schema models intent rather than one frozen screenshot of the ChatGPT settings UI. Product labels, plans, availability, and limits can change.

## `product`

Apply these fields in ChatGPT Personalization when the controls are available:

- `personality` → Base style and tone / Personality;
- `characteristics.warm` → Warm;
- `characteristics.enthusiastic` → Enthusiastic;
- `characteristics.headers_and_lists` → Headers & Lists;
- `characteristics.emojis` → Emojis;
- `memory.saved_memories` → saved-memory setting;
- `memory.reference_chat_history` → reference-chat-history setting.

Relative values such as `slightly_more` describe intent, not a guaranteed UI tick position. If a characteristic is unavailable on the account, leave the profile unchanged and apply the closest behavior through instructions only when it materially matters.

## `identity`

`identity.occupation` maps to the closest occupation/role field.

The rest of `identity` renders to `more-about-you.txt` and belongs in the closest field for durable user context.

Do not paste the raw JSON. Render it first so list-oriented source data becomes compact prose.

## `instructions`

The rendered `custom-instructions.txt` belongs in the field that controls how ChatGPT should respond.

If the product surface exposes several instruction fields, preserve semantic separation rather than duplicating text across them.

## Memory is not a configuration file

The profile may recommend that Memory be enabled, but Memory itself should store useful evolving context—not exact global rules that must retain precise wording.

Global behavioral rules belong in the versioned profile. Project rules belong in the project. Temporary requirements belong in the prompt that needs them.

## Character limits

The CLI default long-field validation target is 5,000 characters because that matches the maintainer's current paid ChatGPT surface at the time of the v2 review in August 2026.

Do not treat that number as permanent. Use `--limit` to match the surface you are actually targeting:

```bash
python tools/profile.py lint profiles/tech-generalist.json --limit 1500
```

The repository intentionally avoids a hard-coded plan-to-limit table in the schema because product limits can change independently of profile semantics.
