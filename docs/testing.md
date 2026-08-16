# Testing a personalization profile

The automated suite checks whether the repository machinery works. It does **not** prove that the profile improves ChatGPT responses.

Behavioral evaluation should test the specific failures the profile is meant to prevent.

## Compare against a baseline

For important profile changes, run the same prompt with:

1. personalization disabled or a minimal baseline;
2. the previous profile;
3. the candidate profile.

Record the date, ChatGPT surface, model, profile commit/version, prompt, expected behavior, and observed failure.

Run important scenarios more than once. Model output is variable, so one unusually good response is not enough evidence.

## Define pass criteria before reading the answer

Useful criteria are observable:

- unfamiliar terminology appears after or alongside an understandable concept;
- deep explanations preserve mechanisms and trade-offs;
- a continuous explanation is not fragmented into unnecessary numbered sections;
- troubleshooting prioritizes likely causes and includes verification;
- current claims are actually verified;
- repository analysis inspects source/configuration when those change the conclusion;
- UI/UX feedback names concrete elements and user impact;
- a formal artifact keeps the artifact's required tone;
- unrelated interests do not leak into unrelated questions;
- a naturally list-shaped request still produces a list;
- a simple factual question remains concise.

Avoid pass criteria such as “sounds smarter” or “feels more human”. They are difficult to compare consistently.

## Diagnose the smallest failure

Do not rewrite the whole profile after one bad answer.

If a response is too outline-like, change the structure rule. If jargon appears too early, change the explanation sequence. If research is shallow, strengthen the evidence contract. Then rerun the affected scenario and at least one unrelated scenario to check for side effects.

## Regression scenarios

Use [`tests/scenarios.md`](../tests/scenarios.md) as the default suite. Add a new scenario when a real repeated failure appears. A good regression prompt represents an actual use case rather than a contrived benchmark trick.

## What the automated tests do prove

The repository's automated tests can establish that:

- v2 profiles have the expected structure;
- invalid enums and types are rejected;
- common secret patterns and prompt-bloat patterns are surfaced;
- outline-forcing wording can trigger a warning;
- example profiles lint successfully;
- Python and browser renderers produce identical output;
- the CLI fails cleanly on malformed profiles.

Those are engineering guarantees about the toolkit, not claims about model intelligence or response quality.
