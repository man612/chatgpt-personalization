# Profile architecture

Personalization works better when information is separated by scope rather than collected into one large prompt.

## 1. Stable identity

Stable identity is the smallest layer. It answers “what kind of work or role does this user have?” A useful occupation field is short, factual, and broad enough to remain true for months.

Good:

> Office worker and freelance technology generalist focused on practical digital work.

Weak:

> World-class multidisciplinary expert, visionary founder, elite software architect, creative genius, and strategic leader.

The weak version adds prestige claims but little decision-relevant context.

## 2. Stable user context

This layer contains durable facts that change how an answer should be explained. Examples include the user's experience level, recurring use cases, accessibility needs, preferred units, or a stable professional context.

It should not become a biography. A fact belongs here only when it is likely to change future answers in a useful way.

## 3. Response preferences

Response preferences govern communication and workflow. They cover language, tone, assumed audience, formatting defaults, research expectations, and domain-specific explanation requirements.

Preferences should be conditional where context matters. “Use paragraphs by default and lists when scanning is more useful” is stronger than “never use lists.” The conditional version preserves the reason behind the preference.

## 4. Task-local instructions

Temporary requirements belong in the current message. Examples include a deadline, a specific codebase, a word limit, a target audience for one document, or the format required by a client.

Moving task-local requirements into global customization causes leakage: the model starts applying them when they are irrelevant.

## 5. Project context and memory

Project instructions, uploaded files, and project-specific conventions belong in the relevant ChatGPT Project or workspace when available. Memory can hold useful context from past interactions, but it should not be treated as a precise configuration file.

When a preference must be exact, inspectable, and intentionally maintained, keep it in the structured profile and in the appropriate personalization field.

## Precedence and conflict

ChatGPT combines product-level behavior, selected personality, custom instructions, saved memory, project context, the current conversation, and the immediate user request. These layers can overlap or conflict.

A profile should therefore avoid pretending it has absolute control. Write preferences that are clear, scoped, and compatible with task-specific requests. When a user asks for a formal legal letter, a global preference for casual conversation should not override the requested artifact style.

## The relevance test

Before adding a sentence, ask:

1. Is this likely to remain true?
2. Will it materially improve more than one future conversation?
3. Is this the correct layer?
4. Could it expose private information?
5. Can its effect be tested?

If the answer to the first three questions is no, leave it out of the global profile.
