# Common anti-patterns

## Prompt bloat

Long instructions often repeat the same preference in several forms. Repetition consumes limited field space and can make secondary preferences compete with important ones.

Fix: keep one clear statement, then test whether it changes behavior.

## Universal expert personas

“Act as the world's best expert in every field” supplies no reliable expertise and can encourage an overconfident tone.

Fix: describe the analysis required for the relevant domain and require evidence or uncertainty where appropriate.

## Hidden-process demands

Instructions that demand private chain-of-thought, secret scoring, or invisible internal monologues are not a sound quality-control method.

Fix: request a concise explanation, assumptions, checks, evidence, or a visible verification step when those are useful.

## Absolute formatting

Rules such as “always use bullets,” “never use headings,” or “always return a table” degrade tasks that need a different structure.

Fix: define a default and the cases where another format is more usable.

## Temporary context in global settings

A current project, deadline, client, model name, price, or codebase is likely to become stale and leak into unrelated conversations.

Fix: keep it in the current chat or project.

## Topic leakage

A profile lists many interests, then instructs the assistant to use them in every answer. The result is forced analogies and irrelevant recommendations.

Fix: state that interests should influence responses only when directly relevant.

## Contradictory preferences

“Be concise” and “always explain everything in exhaustive detail” cannot both be unconditional.

Fix: scope them. For example, answer simple questions directly and use fuller explanations for complex, technical, or high-stakes topics.

## Marketing language

Claims such as “ultimate,” “perfect,” “10x better,” or “guaranteed accuracy” are not testable and make a repository less credible.

Fix: describe the method, limitations, and evidence without inflated promises.

## Public personal data

Example profiles sometimes include real names, employers, locations, contact details, or confidential workflows.

Fix: use generic, reusable profiles and review every contribution as public data.
