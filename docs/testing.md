# Testing personalization

The repository intentionally separates **engineering tests** from **behavioral evaluation**. A green CI run can prove that the toolkit works; it cannot prove that a profile makes ChatGPT answers better.

## Engineering tests

The automated repository suite checks schema handling, enums and types, profile `$schema` path resolution, secret-pattern warnings, prompt-bloat heuristics, outline-bias heuristics, output limits, CLI failures, machine-readable scenario shape, and parity between the Python and browser renderers. CI runs those checks across supported Python versions.

## Behavioral evals

For important profile changes, compare the same prompt with a baseline, the previous profile, and the candidate profile. Define pass criteria before reading the answer. Run important cases more than once because model output varies.

Useful criteria are observable. For example: prerequisite concepts appear before unfamiliar terminology; a beginner explanation identifies the important actors and follows an end-to-end flow instead of defining jargon with more jargon; troubleshooting includes verification; current claims are actually verified; repository analysis inspects implementation evidence; UI/UX feedback identifies concrete user impact; list-shaped requests still produce lists; and simple factual questions remain concise.

`tests/scenarios.md` is the human-readable suite. `tests/scenarios.json` contains equivalent machine-readable cases so external harnesses can consume or transform them.

## Test quick lookup and deep research separately

A profile should not turn every current-fact question into research theatre. Some questions are correctly answered by one current authoritative source. Keep at least one quick-lookup scenario to verify that behavior.

Deep-research scenarios should be materially harder. Their rubric should evaluate the **research process represented in the answer and evidence**, not just whether the final conclusion sounds reasonable. Useful checks include:

- decomposing the question into material claims and uncertainties;
- using multiple targeted search angles rather than one broad query;
- establishing current product facts from primary sources;
- cross-checking load-bearing claims with independent evidence;
- checking dates, versions, product tiers, rollout scope, and stale sources;
- investigating contradictory evidence instead of silently choosing a convenient source;
- looking for limitations, failure cases, and counter-evidence;
- normalizing units and exposing assumptions for quantitative comparisons;
- separating verified facts, source claims, community reports, inference, assumptions, and unresolved uncertainty;
- stopping only after additional evidence is unlikely to change a material conclusion.

Do not use a fixed source count as a universal quality metric. Five redundant articles can provide less evidence than two direct primary sources plus one independent source. When a user explicitly requests broad research or many sources, however, source-type and search-angle breadth becomes part of the task and should be evaluated accordingly.

## Optional automated evals

The core repository has no LLM-evaluation runtime dependency. That is deliberate: public users should be able to lint and render a profile without an API account.

For automated experimentation, adapt `tests/scenarios.json` to an eval framework such as OpenAI's evaluation tooling or promptfoo. Keep provider and grader configuration outside the profile itself. Record the model, date, number of candidate samples, grader setup, rubric, and scoring method.

Automated API evals are only a **proxy** for consumer ChatGPT personalization. The API can test rendered instruction text, but it does not expose every consumer ChatGPT control in exactly the same way as Personality, Characteristics, Memory, Projects, and other product context. Do not label an API score as “ChatGPT personalization performance” without that caveat.

## Repeated samples matter

One response is weak evidence. OpenAI's public Model Spec Evals supports multiple candidate epochs and multiple grader samples because both model output and grading can vary. For this smaller project, the exact sample count depends on cost and importance, but meaningful claims should be based on repeated runs rather than a single favorite output.

## Diagnose the smallest failure

If a response is too outline-like, change the structure rule. If jargon arrives before its prerequisites, change the explanation contract. If research stops after one plausible result, strengthen the research process or stopping rule. If every current lookup becomes over-researched, narrow the research trigger. Rerun the affected scenario and at least one unrelated scenario to check for regressions.

Do not rewrite the entire profile after one bad answer. Prefer the smallest instruction change that repeatedly improves the relevant eval without degrading unrelated tasks.
