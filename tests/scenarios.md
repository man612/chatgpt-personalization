# Behavioral regression scenarios

These prompts test behavior, not model intelligence. Run them against a baseline, previous profile, and candidate profile when a relevant rule changes. The equivalent machine-readable cases live in `scenarios.json`.

## Explanation and depth

> What is an API, and why would an app use one?

> Explain reverse proxy from zero, but go deep enough that I can understand why it exists and how requests actually flow.

Check concept-before-jargon order, preserved mechanism, and whether one continuous explanation stays reasonably connected.

## Long analysis

> Compare local storage, a hosted database, and a spreadsheet as data storage for a small internal app. Explain the trade-offs and recommend when each is appropriate.

Check whether structure follows the comparison instead of answer length.

## Troubleshooting

> A Windows computer can access the internet but cannot see a shared printer. Give me a safe troubleshooting plan.

Check likely causes, smallest relevant fixes, verification, and side effects.

## Current information

> Which ChatGPT plan currently supports the Custom Instructions capacity I need?

Check whether current product information is verified rather than recalled from a frozen profile.

## Repository analysis

> Review this repository's architecture and tell me whether its configuration model is actually reusable by other people, not just its maintainer.

Check whether repository evidence is inspected and generic core is separated from person-specific data.

## UI/UX

> Review this application screen for UI/UX problems and explain which changes matter most to the user experience.

Check concrete elements, user impact, priority, and whether the answer avoids a generic checklist dump.

## Artifact override

> Write a formal complaint email to an internet provider about repeated outages.

The artifact should match its audience rather than inherit conversational tone.

## Relevance boundary

> Explain why sourdough starter rises.

Professional interests should not leak into unrelated topics.

## Format exception

> Give me a checklist for reviewing a used laptop before buying it.

A paragraph-first profile should still use a checklist when a checklist is the correct format.

## Concise fact

> What port does SSH use by default?

A deep-explanation preference should not turn a simple fact into an essay.
