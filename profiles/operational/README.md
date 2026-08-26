# Operational profiles

Operational profiles are version-controlled, account-specific targets intended for **self-audit and AI-assisted setup**, not reusable recommendations.

They use the same v2 profile schema and renderer as presets and maintainer examples, so the desired ChatGPT settings can be linted and rendered without creating a second personalization format.

## How an AI assistant should use this directory

When the user asks to check, restore, compare, or update their ChatGPT personalization setup:

1. Treat the user's explicit current request as highest priority.
2. Read the matching operational profile as the desired account target.
3. Compare it with product settings that are actually observable in the current session when tools expose them.
4. Mark settings that cannot be read as **unverified**, not mismatched.
5. Use `profiles/maintainers/` only as public reference examples; do not treat a maintainer example as the user's live source of truth.
6. Do not infer temporary project state, conversation history, private relationships, finances, credentials, or other transient context into the operational profile.
7. Recommend the smallest change that restores the intended setup and call out deliberate deviations separately.

An operational profile is **not automatically loaded by ChatGPT** merely because it exists in this repository. It is a reviewable source of truth for humans and tools that explicitly read it.

## Public-safe versus private context

Files committed here are public. Keep only durable information that is safe to publish.

If a more private or experimental variant is needed, put it in `profiles/local/`. JSON and JSONC files there are gitignored by default. A local file may refine the operational target when it is explicitly available to the assistant, but remote GitHub readers cannot see uncommitted local files.

Never store passwords, API keys, tokens, client secrets, confidential customer data, or sensitive personal history in either an operational or local personalization profile.
