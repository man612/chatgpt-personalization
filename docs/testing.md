# Testing a profile

Personalization should be evaluated with representative conversations, not judged only by how polished the instruction text looks.

## Build a small test set

Choose prompts from the work the profile is expected to support. A balanced set usually includes:

1. a simple factual explanation;
2. a long analytical question;
3. a rewriting request where the artifact's tone should override the assistant's conversational tone;
4. a technical troubleshooting task;
5. a current or uncertain topic that requires verification;
6. an unrelated topic that should not trigger the user's professional interests;
7. a request whose best format is a short list or table.

The last two cases matter. They reveal whether global preferences leak into irrelevant answers or rigidly block useful formats.

## Define pass criteria

Write observable criteria before testing. Examples include:

- unfamiliar terms are explained before they are used heavily;
- long analysis uses descriptive sections and connected paragraphs;
- factual uncertainty is stated rather than hidden;
- technical fixes include a verification step;
- a requested email sounds appropriate for its recipient, not like the assistant's default conversation style;
- irrelevant technology interests are not forced into a cooking or history answer;
- lists appear when they genuinely improve usability.

## Run more than once

Model outputs vary. One good answer does not prove the profile is reliable, and one weak answer does not prove it is useless. Run each important scenario several times, especially after changing a major rule or switching models.

## Compare against a baseline

Test the same prompts with personalization disabled or with a simpler profile. Keep a rule only when it produces a repeatable improvement that matters to the user.

## Record failures

Use `tests/scenarios.md` or an issue to record the prompt, expected behavior, observed failure, model or product surface, and date. Avoid rewriting the entire profile after one failure. Make the smallest change that addresses a recurring pattern.

## Re-test after product changes

Personality settings, memory behavior, model families, and personalization interfaces can change. Re-test important profiles after a major product update rather than assuming old wording still behaves the same.
