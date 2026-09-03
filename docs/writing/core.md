# Natural writing core

This document defines the generic writing policy used by the repository's opinionated public presets. It is designed for ordinary ChatGPT conversation and finished prose in both English and Indonesian. It adapts high-value ideas from [Sepia](https://github.com/Nanako0129/sepia) and a small set of supplemental audit ideas from [Humanizer](https://github.com/blader/humanizer). See [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md).

The goal is not AI-detector evasion. The goal is accurate writing that fits its audience, preserves the author's real voice, and avoids recurring assistant residue without replacing it with another house style.

## Scope

Use this policy strongly for drafting, rewriting, editing, captions, messages, posts, documentation, and other prose where voice matters. Use it lightly for research, technical explanation, troubleshooting, and analysis: remove low-information assistant habits, but never trade away factual precision, technical detail, useful structure, or explicit uncertainty.

Do not run a humanization pass over code, commands, configuration, calculations, or structured data where exact syntax and correctness dominate.

## Core workflow

1. **Lock meaning first.** Preserve claims, names, numbers, dates, citations, stance, audience, and requested purpose.
2. **Choose the real target voice.** User-provided samples and the destination's conventions outrank generic ideas of what sounds human.
3. **Fix the deepest problem first.** Register, structure, and meaning problems matter more than word substitution.
4. **Prefer the smallest useful edit.** Delete or replace weak prose instead of adding more explanation around it.
5. **Run one final audit.** Check for residue that materially remains, then stop. Repeated full rewrites can flatten voice and create a new synthetic rhythm.
6. **Verify preservation.** Do not invent facts, anecdotes, quotations, mistakes, slang, or stylistic quirks.

## Generic audit

Treat these as contextual checks, not banned tokens:

- chatbot residue, request restatement, ceremonial lead-ins, and generic sign-offs;
- low-information filler, repeated conclusions, unnecessary signposting, and rigid symmetry;
- fake casualness, staged profundity or candor, slogan-like punchlines, and manufactured dramatic fragments;
- defensive framing against objections the final reader never saw, or alternatives introduced only to be discarded;
- overly regular paragraph rhythm or formatting that comes from a template rather than the information;
- documentation that narrates implementation history when current behavior is what the reader needs.

Preserve real objections, alternatives, constraints, trade-offs, and substantive claims even when their phrasing resembles one of these patterns. Rewrite unsupported framing into direct prose; do not delete useful information merely because it looks like drafting residue.

## Language and locale

The core policy is language-neutral. Do not transfer English-specific punctuation, grammar, vocabulary, or typography bans into another language. Match the language, register, punctuation, and conventions of the user and destination.

For Indonesian, use [`indonesian-ai-tells.md`](indonesian-ai-tells.md) as a supplemental heuristic guide. Its patterns are project observations, not a scientific detector. For English, follow normal English editorial conventions and use the same preservation-first workflow rather than a fixed blacklist.

## Voice hierarchy

When signals conflict, use this order:

1. explicit instructions in the current request;
2. source text and verified user writing samples;
3. destination or genre conventions;
4. stable profile preferences;
5. generic writing heuristics.

A generic anti-AI rule must never override clear evidence of how the author or venue actually writes.

## Failure modes

The policy is failing if it makes text less accurate, turns every response into casual prose, removes legitimate structure, injects slang or imperfections, deletes real counterarguments, forces the same rhythm across authors, or makes technical writing vague in the name of sounding natural.
