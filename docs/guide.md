# Designing a profile

A personalization profile should contain durable context and observable response behavior. It should not become a biography, project notebook, prompt-trick collection, or dump of every preference a user has expressed.

## Choose a starting point

For most users, start with [`profiles/presets/general.json`](../profiles/presets/general.json). It is a compact bilingual starting point for everyday English or Indonesian use and is small enough for the current 1,500-character Custom Instructions target.

Use [`profiles/presets/blank.json`](../profiles/presets/blank.json) when you want no inherited behavioral defaults. Other presets add role-specific behavior for technology, knowledge work, study, product design, or writing.

The browser builder exposes only reusable public presets as starting points. Maintainer and operational profiles are not user templates.

## Profile roles

- `profiles/presets/` — anonymous, reusable public starting points.
- `profiles/local/` — private or experimental profiles; ignored by Git by default.
- `profiles/maintainers/` — intentionally public reference examples.
- `profiles/operational/` — public-safe account targets for dogfooding, self-audit, and AI-assisted setup.

A preset should work without knowing who the user is. A maintainer or operational profile may be person-specific because it is an explicit example or account target, but that context must never leak into generic tooling or presets.

## Separate information by scope

`product` records intended product-level settings such as Personality, Characteristics, and Memory. `identity` contains durable context that materially affects how answers should be shaped. `instructions` contains global response behavior.

Temporary project rules belong in a ChatGPT Project or the current workspace. One-off output requirements belong in the current request. Memory can carry evolving context, but it is not a precise configuration file.

## Write observable behavior

Avoid instructions such as “be smart”, “be helpful”, or “act like a world-class expert”. Prefer rules that can be evaluated:

> Define unfamiliar terminology at or before first meaningful use.

> For troubleshooting, explain the likely cause, the smallest safe fix, why it works, how to verify it, and important side effects.

> Use headings for genuine topic changes; do not create an outline merely because an answer is long.

Observable instructions can become regression criteria. Prestige labels and vague quality adjectives usually cannot.

## Keep language simple without reducing reasoning

Vocabulary familiarity and reasoning ability are different. A capable reader can still be unfamiliar with one domain's jargon.

For cross-domain profiles, explain prerequisite concepts before relying on specialist terms, but preserve the mechanisms, trade-offs, failure modes, and verification needed to understand the answer.

A useful dependency order is:

ordinary-language purpose → problem solved → actors/components → concrete flow → technical terminology → mechanism → trade-offs and failure modes.

Use that as a reasoning aid, not a rigid answer template.

## Natural writing behavior

All opinionated public presets use the compact policy documented in [`writing/core.md`](writing/core.md). It preserves facts and source register, treats user writing samples and destination conventions as stronger evidence than generic “human” style rules, and performs one light audit for recurring assistant residue.

The core supports English and Indonesian. [`writing/indonesian-ai-tells.md`](writing/indonesian-ai-tells.md) adds language-specific structural heuristics for Indonesian. English-specific punctuation or grammar rules must not be transferred blindly into Indonesian.

`Blank` intentionally contains no writing policy. The maintainer-specific [`writing/sepia-yasman.md`](writing/sepia-yasman.md) extends the generic core only for the maintainer's own voice and must not become a preset default.

## Distinguish lookup from research

One authoritative lookup may correctly answer a narrow current-fact question. Deep research needs a different contract.

For research-oriented profiles, define behavior such as:

- decompose the question into material claims and uncertainties;
- establish current facts from primary sources first;
- cross-check important claims independently;
- check dates, versions, product tiers, rollout scope, and stale sources;
- investigate contradictions, limitations, failure cases, and counter-evidence;
- normalize units and expose assumptions for quantitative comparisons;
- separate verified facts, source claims, community reports, inference, assumptions, and unresolved uncertainty;
- stop when further evidence is unlikely to change the material conclusion.

Avoid a universal minimum source count. Independence and relevance matter more than collecting redundant links.

## Keep prompts lean

State a rule once when possible. When a profile grows, remove redundant wording before adding more.

A longer profile is not automatically stronger. Leave headroom below the target field limit so later product or rendering changes do not immediately create overflow.

Product limits are validation inputs rather than identity data. Use the browser target selector or CLI `--limit` argument instead of storing a plan name in a generic preset.

## Privacy

Public presets must never contain secrets or personal history. Maintainer and operational profiles are also public when committed to this repository and should contain only deliberately public-safe information.

Use `profiles/local/` for private or experimental variants, but remember that Git ignore is a convenience rather than encryption. Never put credentials in profile JSON.

## Iterate with evals

Start from the smallest profile that captures the requirement. Run representative scenarios, identify a repeated failure, change the smallest relevant rule, then rerun the affected case and unrelated cases for regressions.

Keep quick lookup, deep research, long explanation, writing, and concise-fact scenarios separate so one improvement does not silently damage another task.

See [`testing.md`](testing.md) for the evaluation workflow and [`references.md`](references.md) for the research basis and limitations.
