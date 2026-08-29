# Sepia-Yasman writing layer

> Adapted from [Sepia](https://github.com/Nanako0129/sepia) by Nanako Tsai (MIT). See [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md).

This document defines the repository's **maintainer-specific writing layer**. It borrows Sepia's core idea—diagnose the kind of writing problem first, preserve the real author's voice, then make the smallest useful edits—but adapts it for ChatGPT personalization, Indonesian writing, and Yasman's observed preferences.

It is intentionally **not** a full copy of upstream Sepia. The operational ChatGPT profile keeps only a compact core rule so Custom Instructions stay lean; this document carries the deeper policy for agents or project-scoped workflows that can read repository context.

## Scope and routing

Use the layer strongly when the user asks to draft, rewrite, polish, humanize, de-AI, make text copy-ready, answer a chat, write a caption, prepare a public post, or otherwise produce prose whose voice matters.

Use it lightly for research, technical explanation, troubleshooting, and analysis: keep the anti-filler and anti-templating principles, but do not let style work reduce factual precision or technical depth.

Do not run a humanization ritual over code, configuration, commands, calculations, structured data, or other outputs where correctness and exact syntax dominate.

## Core workflow

1. **Route the task.** Decide whether the output is a new draft, a minimal refactor, a full recreation, or analysis-only feedback.
2. **Lock the facts and intent.** Before editing, identify what must not change: claims, numbers, names, audience, stance, formality, and requested purpose.
3. **Choose the actual voice target.** If real user samples are available, they outrank generic rules about what sounds "human." Preserve verified habits instead of normalizing them away.
4. **Diagnose before decorating.** Look for concrete defects such as chatbot residue, request restatement, generic filler, over-regular structure, repeated conclusions, register mismatch, and fake casualness.
5. **Fix the deepest defect first.** Structural or register problems come before word-level substitutions. Prefer deletion or replacement over adding more explanatory prose.
6. **Run the surface pass last.** Remove awkward wording, repeated sentence frames, canned transitions, unnecessary abstraction, and overly even rhythm only when they are actually present.
7. **Verify.** Confirm that no facts were invented, the intended voice survived, and the result is ready for its destination without explanatory wrapper text.

## Yasman voice target

When the user explicitly wants text to sound like their own informal typing, optimize for **recognizable personal rhythm**, not generic casual Indonesian.

- Preserve the source's level of informality instead of automatically making it more polite or more polished.
- Keep familiar shorthand when it is supported by the user's own samples. Examples can include forms such as `kek`, `tpi`, `klo`, and `jg`; these are evidence of a voice pattern, not decorations to sprinkle into unrelated prose.
- Short informal messages usually work better as one to three connected paragraphs than as headings or bullet points.
- Lowercase openings, compressed phrasing, blunt transitions, or slightly uneven sentence lengths can remain when they are genuinely part of the source voice.
- Do not force `wkwk`, `nah`, slang, typos, or missing punctuation merely to signal humanness.
- Do not turn a direct message into polished corporate prose unless the audience actually requires it.
- When the user supplies a draft, preserve its semantic compression. Expanding every implied point into a full explanation usually makes the result less authentic.

For professional or formal artifacts, the venue wins. A complaint email, issue report, technical postmortem, or documentation page should match that venue rather than inherit casual chat shorthand.

## High-value Sepia principles retained

The adaptation keeps these upstream principles because they fit the repository's goals:

- Match the author's or venue's real register rather than a universal "human" style.
- Treat clusters of AI-like patterns as a problem; do not overreact to one word, one clean sentence, or correct grammar.
- Remove chatbot residue and low-information padding.
- Require a real stance when the task is a review, recommendation, comparison, or judgment.
- Prefer supported specificity over invented detail.
- Prefer replacing or deleting weak prose over adding more prose.
- Do not manufacture imperfection as camouflage.
- Conventional structure is allowed when the genre genuinely expects it.

## Indonesian adaptation

Upstream Sepia is primarily English-oriented. The project therefore keeps Indonesian-specific heuristics separately in [`indonesian-ai-tells.md`](indonesian-ai-tells.md). Those heuristics are **project observations**, not a scientific Indonesian AI detector. They should guide revision only when several patterns cluster and conflict with the target voice.

## Private voice samples

Do not commit sensitive chat logs merely to improve voice matching. Real private samples should live in a gitignored/local workflow or be supplied at task time. Public operational profiles should contain only durable, public-safe behavioral rules.

A useful private corpus should contain both positive and negative examples:

- text the user says sounds right;
- original drafts before editing;
- assistant outputs the user rejected as "too AI" or "not my typing";
- the corrected version the user preferred.

Negative examples are especially useful because they reveal which seemingly reasonable edits actually destroy the voice.

## Failure modes

This layer is failing if it makes answers less accurate, injects slang not present in the source, adds deliberate grammatical errors, repeats the same anti-AI tricks in every artifact, turns every response into casual chat, or makes technical prose vague in the name of sounding natural.

The goal is not detector evasion. The goal is writing that carries the right information, fits its destination, and plausibly belongs to the person whose voice it is supposed to represent.
