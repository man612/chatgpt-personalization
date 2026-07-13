# Manual profile evaluation

The automated test suite checks the renderer, linter, malformed inputs, and example-profile structure. It does not prove that a profile improves model responses. Behavioral evaluation remains manual because outputs vary by model, product surface, and time.

## Build a small test set

Choose prompts that represent the work the profile is expected to support. Include a simple explanation, a long analytical question, a rewriting request where the artifact needs its own tone, a troubleshooting task, a current or uncertain topic, an unrelated topic that should not trigger professional interests, and a request whose best format is a short list or table.

Reusable prompts are available in [`tests/scenarios.md`](../tests/scenarios.md).

## Define pass criteria first

Write observable criteria before running the prompts. Examples include unfamiliar terms being explained before heavy use, technical fixes including a verification step, uncertainty being stated instead of hidden, artifact tone matching its audience, irrelevant interests not leaking into unrelated answers, and lists appearing when they materially improve usability.

Avoid vague criteria such as “sounds smarter” or “feels better.” They are difficult to compare consistently.

## Compare against a baseline

Run the same prompts with personalization disabled or with a smaller profile. Record the profile version, model, product surface, date, prompt, expected behavior, and observed failure.

Run important scenarios more than once because one strong or weak response is not reliable evidence. Keep a rule only when it produces a repeatable improvement that matters to the user.

## Make small revisions

Do not rewrite the entire profile after one failure. Change the smallest relevant instruction, then repeat the affected scenarios and at least one unrelated scenario to check for side effects.

Re-test after major product or model changes. The repository provides a method and reusable scenarios; it does not currently publish automated behavioral scores or claim a measured performance improvement.
