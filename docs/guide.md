# Designing a profile

A personalization profile should contain a small amount of durable context and observable response behavior. It should not become a biography, project notebook, prompt-trick collection, or dump of every preference a user has ever expressed.

## Start with the right profile type

Use `profiles/presets/` when publishing a reusable starting point. Use `profiles/maintainers/` for intentionally public reference implementations. Use `profiles/operational/` for a version-controlled, public-safe account target that a human or AI assistant can use for self-audit and setup. Use `profiles/local/` for private or experimental personal profiles that should not be committed.

The distinction is architectural, not cosmetic: a preset should work without knowing who the user is; a maintainer reference should demonstrate the generic schema without becoming live account truth; an operational profile may evolve with a real account's intended configuration; and a local profile may contain private working context. The renderer and linter should still treat all profile JSON through the same schema.

## Separate information by scope

`product` records intended product-level settings such as Personality, Characteristics, and Memory. `identity` contains durable context that affects how explanations should be shaped. `instructions` contains global response behavior.

Temporary project rules belong in a ChatGPT Project or current workspace. One-off output requirements belong in the current request. Memory can carry useful evolving context, but it should not be treated as a precise configuration file.

## Write observable behavior

“Be helpful”, “be smart”, or “act like a world-class expert” are hard to test. Prefer visible behavior:

> Define unfamiliar terminology at or before first meaningful use.

> For troubleshooting, explain the likely cause, the smallest safe fix, why it works, how to verify it, and important side effects.

> Use headings when the topic genuinely changes; do not create numbered sections merely because an answer is long.

Observable instructions can become regression criteria. Vague personality adjectives usually cannot.

## Treat vocabulary and reasoning ability separately

A reader can be capable of following complex reasoning while still being unfamiliar with a domain's vocabulary. Avoid profiles that collapse those two dimensions into a vague label such as “beginner” and then accidentally remove the mechanism.

For beginner-oriented or cross-domain profiles, make the assumption explicit: **do not assume specialist vocabulary until it has been established, but do not reduce reasoning depth merely because vocabulary needs explanation**.

A robust explanation contract can use dependency order such as:

ordinary-language purpose → problem solved → important actors/components → who does what to whom → concrete end-to-end flow → technical terminology → mechanism/implementation → trade-offs, failure modes, verification, and edge cases.

The exact sequence can vary by task. The important invariant is that a core concept should not be explained mainly through several other unexplained concepts. Plain language should reduce linguistic friction, not informational depth.

## Distinguish lookup from research

“Verify current claims” is useful but too weak to define deep research. One authoritative lookup may correctly answer a narrow current-fact question. A research request needs a different contract.

When a profile is intended for serious research, define observable research behavior such as:

- decompose the question into material claims and uncertainties;
- search multiple targeted angles and refine queries as evidence appears;
- establish current facts from primary sources first;
- cross-check load-bearing claims independently;
- check dates, versions, product tiers, rollout scope, and stale sources;
- investigate contradictions, limitations, failure cases, and counter-evidence;
- normalize units and expose assumptions for quantitative comparisons;
- distinguish verified facts, source claims, community reports, inference, assumptions, and unresolved uncertainty;
- use a stopping rule based on evidence saturation rather than the first plausible answer.

Avoid hard-coding one universal minimum source count. Source diversity and independence matter more than collecting redundant links. If a user explicitly asks for broad research or many sources, breadth across source types and search angles becomes part of the requested behavior.

## Keep prompts lean

Do not repeat the same preference across identity, tone, structure, research, and avoid lists. When a profile grows, remove redundant wording before adding more. Keep a rule when it encodes a real requirement or repeatedly fixes an observed failure.

A longer profile is not automatically a stronger profile. Leave headroom below the target field limit so later product wording or rendering changes do not immediately create overflow.

## Product details are validation inputs, not identity

ChatGPT plan limits and UI controls change. Do not write a plan name into a generic preset merely to select a character limit. Choose the appropriate `--limit` value at lint/render time, or choose the target in the browser builder.

## Privacy

A public preset should never contain secrets or real personal history. A public maintainer or operational profile should contain only information that is deliberately safe to publish. Operational does not mean private: if the repository is public, the profile is public too.

Use `profiles/local/` for private or experimental variants, but remember that Git ignore is only a convenience—not encryption or a security boundary. Review diffs before commits and keep credentials out of profile JSON entirely.

## Iterate with evals

Start from the smallest profile that captures the requirement. Run representative scenarios, note a repeated failure, change the smallest relevant rule, then rerun the affected case plus unrelated cases for side effects. Keep quick-lookup, deep-research, long-explanation, and concise-fact scenarios separate so one improvement does not silently make another task worse.

This is more reliable than continuously lengthening the prompt.
