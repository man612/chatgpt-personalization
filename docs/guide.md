# Profile design guide

A good personalization profile is not the longest prompt you can fit into a settings field. It is a small set of durable instructions that changes future answers in predictable, observable ways.

## Separate scope before writing instructions

Use `product` for product-level intent such as Personality, Characteristics, and Memory. Use `identity` for durable user context. Use `instructions` for global response behavior.

Do not copy the same preference into all three layers. If `headers_and_lists` is already set lower in product Characteristics, the instruction layer only needs the semantic rule that explains when a list is actually appropriate.

Temporary requirements belong in the current request. Project architecture, repository conventions, client rules, and project-specific sources of truth belong in project instructions or workspace context.

## Describe observable behavior

Avoid instructions such as “be smart”, “be helpful”, or “be expert”. They do not tell you what success looks like.

Prefer behavior you can test:

> Define unfamiliar terms when they first become important.

> For troubleshooting, identify the likely cause, give the smallest relevant fix, explain how to verify it, and warn about important side effects.

> Use headings when the topic genuinely changes, not simply because an answer is long.

## Separate comprehension from terminology

A common failure in “beginner-friendly” prompts is that the model simplifies the information instead of simplifying the language.

Use `instructions.explanation` to define the teaching path. A strong default is:

1. ordinary-language concept;
2. problem it solves;
3. where it fits in the bigger picture;
4. concrete example or mental model when useful;
5. technical term and mechanism;
6. implementation details, trade-offs, verification, and edge cases when relevant.

The sequence is not a rigid template for every answer. It is a dependency order for unfamiliar material.

A useful rule is: **plain language should reduce linguistic complexity, not informational depth.**

## Avoid outline bias

Formatting should follow the information shape.

A long explanation about one mechanism may be best as connected paragraphs. A short installation task may be best as numbered steps. A direct comparison may be best as a table. A checklist request should remain a checklist.

Do not use “always use numbered sections for long answers”. The v2 linter warns about several recognizable forms of that rule with `OUTLINE_BIAS`.

## Keep research instructions operational

“Research deeply” is hard to evaluate. A stronger research contract says what evidence to inspect and how to treat uncertainty.

For technical research, prefer primary sources when relevant: official documentation, specifications, papers, repositories, source code, release notes, changelogs, configuration, and issue trackers. Use secondary reporting for context and community reports for real-world experience, but do not present all three as the same kind of evidence.

Depth should come from cross-checking, mechanisms, trade-offs, and testing where possible—not from increasing the number of headings or bullets.

## Keep the profile lean

Repetition can overemphasize a minor preference. Before adding a new rule, ask:

- Is it stable across many conversations?
- Is it stored in the right layer?
- Can I observe whether it worked?
- Is another rule already saying the same thing?
- Did a real failure motivate it?

Edit by subtraction before adding more instructions.

## Public profiles and privacy

A public profile should contain only information the owner intentionally publishes. Do not store credentials, API keys, tokens, private client information, internal URLs, or sensitive biography in a repository profile.

The linter recognizes a small set of common secret formats, but it is not a security scanner.
