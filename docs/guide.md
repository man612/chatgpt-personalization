# Designing a profile

A personalization profile should contain a small amount of durable context and observable response behavior. It should not become a biography, project notebook, prompt-trick collection, or dump of every preference a user has ever expressed.

## Start with the right profile type

Use `profiles/presets/` when publishing a reusable starting point. Use `profiles/local/` for a private personal profile. `profiles/maintainers/` exists only for maintainers who intentionally publish a real profile as a reference implementation.

The distinction is architectural, not cosmetic: a preset should work without knowing who the user is, while a personal profile can contain durable user-specific context. The renderer and linter must treat both through the same schema.

## Separate information by scope

`product` records intended product-level settings such as Personality, Characteristics, and Memory. `identity` contains durable context that affects how explanations should be shaped. `instructions` contains global response behavior.

Temporary project rules belong in a ChatGPT Project or current workspace. One-off output requirements belong in the current request. Memory can carry useful evolving context, but it should not be treated as a precise configuration file.

## Write observable behavior

“Be helpful”, “be smart”, or “act like a world-class expert” are hard to test. Prefer visible behavior:

> Define unfamiliar terminology when it first matters.

> For troubleshooting, explain the likely cause, the smallest safe fix, how to verify it, and important side effects.

> Use headings when the topic genuinely changes; do not create numbered sections merely because an answer is long.

Observable instructions can become regression criteria. Vague personality adjectives usually cannot.

## Explain before naming

For beginner-oriented profiles, “simple language” should not mean “remove the mechanism”. A robust explanation contract can define a dependency order: ordinary-language concept → problem solved → bigger-picture role → example if useful → technical terminology and mechanism → trade-offs, verification, or edge cases.

This keeps informational depth while reducing linguistic friction.

## Keep prompts lean

Do not repeat the same preference across identity, tone, structure, and avoid lists. When a profile grows, remove redundant wording before adding more. Keep a rule when it encodes a real requirement or repeatedly fixes an observed failure.

## Product details are validation inputs, not identity

ChatGPT plan limits and UI controls change. Do not write “I am a Plus user” into a generic preset merely to select a character limit. Choose `--limit 1500` or `--limit 5000` at lint/render time, or choose the target in the browser builder.

## Privacy

A public preset should never contain secrets or real personal history. A local profile can still be sensitive, so Git ignore is only a convenience—not a security boundary. Review diffs before commits and keep credentials out of profile JSON entirely.

## Iterate with evals

Start from the smallest profile that captures the requirement. Run representative scenarios, note a repeated failure, change the smallest relevant rule, then rerun the affected case plus unrelated cases for side effects. This is more reliable than continuously lengthening the prompt.
