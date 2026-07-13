# Profile guide

A profile is useful when it contains a small amount of stable information that changes future answers in a predictable way. It should not become a biography, project notebook, or collection of prompt tricks.

## Separate information by scope

Use `occupation` for a short and durable role description. Use `about` for stable context such as experience level, recurring use cases, accessibility needs, or preferences that genuinely affect explanations. Use `response` for communication and workflow preferences.

Temporary requirements belong in the current request. Project rules belong in the relevant project or workspace. Memory may hold useful background, but it is not a precise configuration file.

Before adding a sentence, ask whether it is likely to remain true, useful across several conversations, stored in the correct layer, safe to expose, and possible to evaluate. Remove it when those conditions are not met.

## Write observable behavior

Vague instructions such as “be helpful” or “give high-quality answers” are difficult to evaluate. Describe visible behavior instead:

> Define unfamiliar terms before relying on them.

> For troubleshooting, explain the likely cause, the smallest safe fix, how to test it, and important side effects.

Prefer conditional defaults over rigid formatting rules. “Use paragraphs by default and lists when scanning is easier” is more robust than “never use lists.” Artifact requests should also override conversational tone when necessary; a formal letter should sound appropriate for its recipient.

## Keep the language restrained

Do not use prestige personas such as “world-class expert,” accuracy guarantees, emotional pressure, or demands for private reasoning. They do not add reliable expertise or verification.

Avoid repeating the same preference in several fields. Repetition consumes limited space and can overemphasize a minor rule. When a profile grows, edit by subtraction before adding more text.

Common failure patterns include temporary project details in global settings, forcing professional interests into unrelated topics, contradictory instructions, fixed product names or prices that become stale, and marketing claims that cannot be tested.

## Migrate an existing instruction block

Start by marking stable facts, response preferences, and temporary details separately. Move only the shortest role summary into `occupation`; put durable explanatory context in `about`; map language, tone, structure, technical workflow, research expectations, and recurring failure modes into `response`.

Delete temporary project names, deadlines, client requirements, one-off output formats, secrets, and repeated commands. Then create a profile from `profiles/blank.json` and run:

```bash
python tools/profile.py lint path/to/profile.json
python tools/profile.py render path/to/profile.json --out build/profile
```

The linter checks structure, field types, unsupported properties, duplicate array values, configured field limits, several common secret formats, repeated text, and a small set of prompt-bloat patterns. It is not a complete security scanner and cannot decide whether every sentence is useful.

Review the rendered files before pasting them into ChatGPT. Compare the profile against a simpler baseline using the manual scenarios in [Testing a profile](testing.md), and keep only changes that produce a repeatable benefit.
