# Testing personalization

The repository intentionally separates **engineering tests** from **behavioral evaluation**. A green CI run can prove that the toolkit works; it cannot prove that a profile makes ChatGPT answers better.

## Engineering tests

The automated repository suite checks schema handling, enums and types, secret-pattern warnings, prompt-bloat heuristics, outline-bias heuristics, output limits, CLI failures, and parity between the Python and browser renderers. CI runs those checks across supported Python versions.

## Behavioral evals

For important profile changes, compare the same prompt with a baseline, the previous profile, and the candidate profile. Define pass criteria before reading the answer. Run important cases more than once because model output varies.

Useful criteria are observable: unfamiliar terminology appears after or alongside an understandable concept; deep explanations preserve mechanisms and trade-offs; continuous explanations are not fragmented into unnecessary numbered sections; troubleshooting includes verification; current claims are actually verified; repository analysis inspects relevant source/configuration; UI/UX feedback identifies concrete user impact; list-shaped requests still produce lists; and simple factual questions remain concise.

`tests/scenarios.md` is the human-readable suite. `tests/scenarios.json` contains the same style of cases in a machine-readable form so external harnesses can consume or transform them.

## Optional automated evals

The core repository has no LLM-evaluation runtime dependency. That is deliberate: public users should be able to lint and render a profile without an API account.

For automated experimentation, adapt `tests/scenarios.json` to an eval framework such as OpenAI's evaluation tooling or promptfoo. Keep the provider and grader configuration outside the profile itself. Record model, date, number of samples, rubric, and scoring method.

Automated API evals are only a **proxy** for consumer ChatGPT personalization. The API can test rendered instruction text, but it does not expose every consumer ChatGPT control in exactly the same way as Personality, Characteristics, Memory, Projects, and other product context. Do not label an API score as “ChatGPT personalization performance” without that caveat.

## Repeated samples matter

One response is weak evidence. OpenAI's public Model Spec Evals supports multiple candidate epochs and multiple grader samples specifically because output and grading can vary. For this smaller project, the exact sample count depends on cost and importance, but meaningful claims should be based on repeated runs rather than a single favorite output.

## Diagnose the smallest failure

If a response is too outline-like, change the structure rule. If jargon arrives too early, change the explanation contract. If research is shallow, strengthen evidence requirements. Rerun the affected scenario and at least one unrelated scenario to check for regressions.

Do not rewrite the entire profile after one bad answer.
