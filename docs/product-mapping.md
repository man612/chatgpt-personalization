# Mapping the profile to ChatGPT

The repository stores personalization intent in a stable schema while the ChatGPT interface can change. Do not assume every plan, platform, or rollout exposes identical labels or controls.

## Product settings

`product.personality` maps to the current Base style and tone control when available. `product.characteristics` maps to Characteristics such as warmth, enthusiasm, Headers & Lists, and emoji level when those controls are available. `product.memory` records the intended Memory state.

These values are rendered into `settings.md` as a checklist because they are product controls, not text that should be pasted into Custom Instructions.

## Operational target versus observed state

An operational profile records the **desired account target**, not a guarantee about the account's live state.

When auditing an account, compare the operational profile only with settings that the current ChatGPT surface or an authorized tool can actually expose. A confirmed difference is a mismatch. A setting that cannot be read should be reported as **unverified**, not assumed to match and not treated as a failure.

Current explicit user intent takes precedence over an older operational target. If the user deliberately changes a preference, treat that as a candidate profile update rather than automatically restoring the old value.

This distinction also keeps the repository honest about product controls. The renderer can say what should be configured, but it cannot prove that a particular ChatGPT client has applied every control.

## User context and instructions

`identity.occupation` renders to `occupation.txt`. The rest of stable identity/context renders to `more-about-you.txt`. Global response behavior renders to `custom-instructions.txt`. Paste them into the closest matching fields available on your current ChatGPT surface. If the UI exposes fewer fields, preserve the separation conceptually and remove duplicated text before combining fields.

## Custom Instructions character target

As of the 2026-08-19 source review, OpenAI documents 1,500 characters for Free and Go and 5,000 for Plus, Pro, Business, Enterprise, and Education. The profile does not store a plan because plans and limits can change. Use the CLI `--limit` option or browser target selector at validation time.

Treat the configured limit as a ceiling, not a writing target. Leave reasonable headroom so small rendering or product changes do not immediately create overflow.

## Projects override global Custom Instructions

Project instructions are a separate scope and, according to current OpenAI documentation, **override global Custom Instructions inside that project**. This matters for users whose global profile contains important explanation, research, or formatting behavior.

If a project needs those global behaviors, carry the relevant behavioral rules into the project's instructions together with project-specific rules. Do not blindly paste every global identity detail or unrelated preference. Keep project instructions scoped to what should actually apply inside that workspace.

For example, a software project may need repository-specific rules plus the user's global “explain unfamiliar dependencies before jargon” and “deep research means multi-source evidence gathering” behaviors, while omitting unrelated UI/UX or writing preferences.

Shared projects can have different memory boundaries from personal global ChatGPT context. Do not assume a project inherits all personal memory or personalization context.

## Search and Deep Research are different product behaviors

A Custom Instructions profile can request stronger evidence gathering, but it does not turn every standard Search response into the dedicated Deep Research product flow. Use ordinary Search for quick current lookups; use Deep Research when the task genuinely needs multi-step investigation, aggregation, and synthesis across many sources.

The profile should still define what “deep” means behaviorally—source hierarchy, cross-checking, version/date checks, contradiction handling, calculations, counter-evidence, and a stopping rule—so the user's expectations remain explicit across supported contexts.

## Memory is not a config file

Memory can automatically synthesize useful context from prior chats and other sources. It can evolve and may not expose every remembered detail. Use the profile for explicit, reviewable instructions and durable context; use Memory for context that benefits from evolving with conversation history.

Always check current OpenAI documentation before relying on an exact label, availability claim, plan limit, or product interaction.
