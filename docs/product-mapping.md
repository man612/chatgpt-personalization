# Mapping the profile to ChatGPT

The repository stores personalization intent in a stable schema while the ChatGPT interface can change. Do not assume every plan, platform, or rollout exposes identical labels or controls.

## Applying a rendered profile

The browser builder and CLI render four outputs:

- `settings.md` — intended product controls such as Personality, Characteristics, and Memory;
- `occupation.txt` — occupation or role context;
- `more-about-you.txt` — other durable identity/context;
- `custom-instructions.txt` — global response behavior.

Open **ChatGPT → Settings → Personalization**. Match the product settings manually, then paste the three text outputs into the closest corresponding fields available in the current interface. If a label has changed, use the field with the same purpose rather than relying on an old name.

## Product settings

`product.personality` maps to the current Base style and tone control when available. `product.characteristics` maps to Characteristics such as warmth, enthusiasm, Headers & Lists, and emoji level when those controls are available. `product.memory` records the intended Memory state.

These values are rendered into `settings.md` as a checklist because they are product controls, not text that should be duplicated into Custom Instructions.

## User context and instructions

`identity.occupation` renders to `occupation.txt`. The rest of stable identity/context renders to `more-about-you.txt`. Global response behavior renders to `custom-instructions.txt`.

If the current ChatGPT interface exposes fewer text fields, preserve the separation conceptually and remove duplicated wording before combining content.

## Character limits

As of the **2026-09-03** source review, OpenAI documents 1,500 characters for Free and Go and 5,000 for Plus, Pro, Business, Enterprise, and Education Custom Instructions targets.

The profile does not store a plan because plans and limits can change. Use the CLI `--limit` option or browser validation selector at render time. Treat the configured limit as a ceiling rather than a writing target and leave headroom when practical.

The public `General` preset is kept below the 1,500-character target so it can serve as the default cross-plan starting point. Larger role-specific presets may require the 5,000-character target or further editing.

## Operational target versus observed state

An operational profile records a **desired account target**, not proof of the account's live state.

When auditing an account, compare the operational profile only with settings that the current ChatGPT surface or an authorized tool can actually expose. A confirmed difference is a mismatch. A setting that cannot be read should be reported as **unverified**, not assumed to match and not treated as a failure.

Current explicit user intent takes precedence over an older operational target. If the user deliberately changes a preference, treat that as a candidate profile update rather than automatically restoring the old value.

Operational profiles are not builder presets. See [`../profiles/operational/README.md`](../profiles/operational/README.md).

## Projects override global Custom Instructions

Project instructions are a separate scope and, according to current OpenAI documentation, override global Custom Instructions inside that project.

If a project needs behavior that normally comes from the global profile, carry only the relevant rules into that project's instructions together with project-specific requirements. Do not blindly duplicate every global identity detail or unrelated preference.

Shared projects can have different memory boundaries from personal global ChatGPT context. Do not assume a project inherits all personal memory or personalization context.

## Search and Deep Research are different product behaviors

A Custom Instructions profile can request stronger evidence gathering, but it does not turn every standard Search response into the dedicated Deep Research product flow.

Use ordinary Search for quick current lookups and Deep Research when a task genuinely requires multi-step investigation and synthesis. A profile can still define what good research behavior means—source hierarchy, cross-checking, date/version checks, contradiction handling, calculations, counter-evidence, and an evidence-based stopping rule.

## Memory is not a config file

Memory can synthesize and evolve useful context from prior chats and other sources. It may not expose every remembered detail. Use the profile for explicit, reviewable settings and durable context; use Memory for context that benefits from evolving with conversation history.

Always check current OpenAI documentation before relying on an exact label, availability claim, plan limit, or product interaction.
