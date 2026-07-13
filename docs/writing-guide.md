# Writing effective personalization settings

The goal is not to write the longest possible instruction. The goal is to make a small number of durable preferences easy to follow.

## Write observable behavior

“Be helpful” is too vague to test. “Explain unfamiliar technical terms in plain language before using them” describes visible behavior.

“Give high-quality answers” adds no useful direction. “For troubleshooting, explain the likely cause, the smallest safe fix, how to test it, and possible side effects” does.

## State the default and the exception

Rigid rules often fail on tasks that need a different format. Prefer a default with a reasoned exception:

> Use connected paragraphs by default. Use bullets for short option sets, requirements, or checks that need to be scanned individually.

This is more robust than banning bullets entirely.

## Separate content from presentation

Content rules affect what the answer covers: evidence, uncertainty, trade-offs, risks, and testing. Presentation rules affect how the answer is arranged: headings, paragraphs, lists, tables, and tone.

Keeping them separate makes conflicts easier to spot.

## Avoid prestige roles

Telling the model to be a “world-famous expert” does not provide domain knowledge. It can encourage confidence without improving evidence. Describe the work to be done instead:

> Evaluate the interface as a product designer. Check hierarchy, spacing, typography, consistency, accessibility, responsive behavior, and user flow.

## Use examples for ambiguous preferences

A short before-and-after example is useful when a style preference is difficult to describe. Do not add many examples to global settings; they consume space and may overfit unrelated tasks.

## Prefer positive instructions

“Do not be confusing” is weaker than “define unfamiliar terms before relying on them.” Negative constraints are useful for recurring failure modes, but the profile should still explain the desired alternative.

## Keep facts current

Do not freeze model names, subscription rules, prices, laws, or product interfaces into a profile unless they are essential and regularly maintained. Ask for current verification instead.

## Review for duplication

If the same preference appears in `about`, `response`, memory, and a selected personality, it may receive too much weight or create awkward repetition. Keep one authoritative version where possible.

## Edit by subtraction

When a profile grows, remove sentences that are obvious, redundant, unenforceable, or only relevant to one task. A shorter profile is easier to audit and leaves more room for the actual conversation.
