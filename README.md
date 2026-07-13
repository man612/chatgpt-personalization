# ChatGPT Personalization

A field-aware, testable way to write ChatGPT personalization settings.

Most custom-instruction repositories give you a large prompt to copy. This repository takes a different approach: it separates stable user context from response preferences, keeps task-specific instructions out of global settings, and gives you a small validator so profiles can be reviewed instead of trusted by intuition.

## What this repository includes

- a structured profile format for occupation, user context, and response preferences;
- a dependency-free renderer that produces copy-ready text for ChatGPT;
- checks for field length, duplication, likely secrets, and common prompt-bloat patterns;
- scenario-based tests for evaluating whether a profile behaves as intended;
- practical example profiles that are meant to be adapted, not copied blindly;
- documentation on conflicts, privacy, maintenance, and anti-patterns.

This is not a jailbreak collection, a persona role-play pack, or a claim that longer instructions make a model smarter.

## Quick start

Clone the repository and render one of the example profiles:

```bash
python tools/profile.py render profiles/tech-generalist.json --out build/tech-generalist
```

The command writes three files:

```text
occupation.txt
more-about-you.txt
response-preferences.txt
```

Review the output, remove anything that is not stable or useful, then paste each file into the matching ChatGPT personalization field available in your interface.

Run the linter before using a profile:

```bash
python tools/profile.py lint profiles/tech-generalist.json
```

No third-party Python packages are required.

## The model

A profile has three layers.

**Occupation** is a short factual label. It should describe the user's work or primary role without turning into a résumé.

**More about you** contains stable context that materially changes how answers should be explained: experience level, recurring activities, durable constraints, and important preferences.

**Response preferences** describe how answers should be written and reasoned about. They should not contain biographical facts, temporary project requirements, or instructions that belong only to one conversation.

Task-specific details still belong in the current prompt. Project-specific rules belong in a ChatGPT Project or the relevant workspace. Facts that may change should not be frozen into a global profile.

Read [Profile architecture](docs/architecture.md) for the full separation model. If you already have a large instruction block, use the [migration guide](docs/migration.md).

## Why structured profiles

Natural-language custom instructions are easy to write and hard to audit. A single paragraph can quietly mix identity, tone, formatting, technical workflow, and temporary context. That makes conflicts difficult to notice and encourages instruction bloat.

The JSON format in this repository keeps those concerns separate. The renderer then turns the structured data into natural prose. The source remains reviewable, versionable, and suitable for pull requests.

A profile file looks like this:

```json
{
  "$schema": "../spec/profile.schema.json",
  "schema_version": "1.0",
  "name": "Knowledge worker",
  "occupation": "Operations specialist and generalist knowledge worker.",
  "about": {
    "background": [
      "Works across documentation, research, planning, and practical problem solving."
    ],
    "experience": "Comfortable with complex ideas but not assumed to know specialist terminology.",
    "recurring_uses": [
      "Understanding unfamiliar topics",
      "Improving writing",
      "Comparing tools and decisions"
    ],
    "stable_preferences": [
      "Values practical recommendations and explicit trade-offs."
    ]
  },
  "response": {
    "language": "Match the user's language unless asked otherwise.",
    "tone": ["plainspoken", "calm", "direct"],
    "audience": "an intelligent beginner",
    "structure": {
      "long_answers": "Use descriptive numbered sections.",
      "body": "Use connected paragraphs as the default.",
      "lists": "Use lists only when they improve scanning or sequence.",
      "tables": "Use tables only for direct comparison."
    },
    "technical": [],
    "research": [],
    "avoid": ["generic openings", "unnecessary praise"]
  }
}
```

See [profiles/](profiles/) for complete examples.

## Evaluation, not folklore

A personalization profile should be tested against representative prompts. The repository includes a lightweight evaluation method covering explanation, rewriting, research, troubleshooting, and irrelevant-domain leakage. It does not score model intelligence. It checks whether the profile consistently produces the behavior it claims to request.

Start with [Testing a profile](docs/testing.md).

## Design principles

The repository follows six rules:

1. Keep global instructions stable and broadly applicable.
2. Put each fact or preference in the field where it belongs.
3. Prefer specific behavior over inflated roles or claims.
4. Use examples when wording alone is ambiguous.
5. Test representative prompts after meaningful changes.
6. Remove instructions that do not produce a visible benefit.

## Repository map

```text
docs/       Architecture, research basis, migration, privacy, testing, and anti-patterns
profiles/   Adaptable example profiles
spec/       JSON Schema for profile files
tools/      Dependency-free renderer and linter
tests/      Unit tests for the tooling
.github/    Contribution templates and continuous integration
```

## Product notes

ChatGPT's personalization interface changes over time and labels may vary by platform or account. The renderer uses generic field names rather than assuming one exact screen layout. OpenAI currently documents that custom instructions apply across chats, work alongside personality and memory, and that long-form custom-instruction fields have a 1,500-character limit. Review current product documentation before relying on a UI-specific assumption. The project's source review is documented in [Research basis](docs/research-basis.md).

## Contributing

Contributions are welcome when they improve the method, tooling, documentation, or quality of example profiles. New profiles should represent a reusable user type, not advertise a personal brand or duplicate an existing example with minor wording changes.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT. See [LICENSE](LICENSE).
