# Mapping the profile to ChatGPT

The repository stores personalization intent in a stable schema while the ChatGPT interface can change. Do not assume every plan, platform, or rollout exposes identical labels or controls.

## Product settings

`product.personality` maps to the current Base style and tone control when available. `product.characteristics` maps to Characteristics such as warmth, enthusiasm, Headers & Lists, and emoji level when those controls are available. `product.memory` records the intended Memory state.

These values are rendered into `settings.md` as a checklist because they are product controls, not text that should be pasted into Custom Instructions.

## User context and instructions

`identity.occupation` renders to `occupation.txt`. The rest of stable identity/context renders to `more-about-you.txt`. Global response behavior renders to `custom-instructions.txt`. Paste them into the closest matching fields available on your current ChatGPT surface. If the UI exposes fewer fields, preserve the separation conceptually and remove duplicated text before combining fields.

## Custom Instructions character target

As of the 2026-08-16 source review, OpenAI documents 1,500 characters for Free and Go and 5,000 for Plus, Pro, Business, Enterprise, and Education. The profile does not store a plan because plans and limits can change. Use the CLI `--limit` option or browser target selector at validation time.

## Memory is not a config file

Memory can automatically synthesize useful context from prior chats and other sources. It can evolve and may not expose every remembered detail. Use the profile for explicit, reviewable instructions and durable context; use Memory for context that benefits from evolving with conversation history.

## Projects are a separate scope

Project instructions and project memory should contain rules and context limited to that project. Do not copy every project convention into global personalization. Shared or project-only contexts can have different memory boundaries from global ChatGPT personalization.

Always check current OpenAI documentation before relying on an exact label, availability claim, or limit.
