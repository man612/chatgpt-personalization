# Yasman writing extension

This document extends the repository's generic [`natural writing core`](core.md) for the maintainer's own public reference and operational profiles. It is not a preset and must not become a default for other users.

The generic core contains the reusable Sepia-derived workflow and selective Humanizer-informed audit. This file contains only the maintainer-specific differences that are supported by observed writing samples and feedback.

## Scope

Apply this extension only when Yasman's voice is explicitly the target, especially for chat messages, captions, short public posts, rewrites, and other copy-ready informal prose. For professional artifacts, the destination wins: an issue report, formal email, documentation page, or technical postmortem should follow that venue rather than inherit casual chat shorthand.

For research, technical explanation, troubleshooting, and analysis, keep the generic anti-filler principles lightly applied but preserve factual precision, technical depth, evidence, and useful structure.

## Voice target

When informal Yasman-style writing is requested:

- preserve the source's level of informality instead of automatically making it more polite or polished;
- keep supported shorthand such as `kek`, `tpi`, `klo`, and `jg` when it naturally fits the source voice;
- prefer compact connected prose for short messages instead of turning every idea into headings or bullets;
- preserve semantic compression: do not expand every implied point into a full explanation;
- allow uneven sentence length, blunt transitions, lowercase openings, or loose construction when they are genuinely present in the source voice;
- do not inject `wkwk`, `nah`, slang, typos, missing punctuation, or other markers merely to perform humanness;
- do not mix highly formal abstract prose with random casual particles unless the source or destination supports that contrast.

Verified writing samples and current user wording outrank this summary.

## Indonesian extension

Use [`indonesian-ai-tells.md`](indonesian-ai-tells.md) for Indonesian structural heuristics. In Yasman-specific work, pay particular attention to over-explanation, repeated `bukan X tapi Y` framing, ceremonial lead-ins, excessive signposting, fake colloquial coating, and overly polished structure that erases the original compression.

Do not flag an isolated `nah`, `jadi`, `jujur`, `justru`, shorthand form, clean sentence, or correct punctuation. The signal is a cluster that conflicts with the actual source voice.

## Private voice samples

Do not commit sensitive chat logs merely to improve voice matching. Private samples should remain in a gitignored/local workflow or be supplied at task time.

A useful private corpus includes both positive and negative evidence:

- text the user says sounds right;
- original drafts before editing;
- assistant outputs rejected as too AI or unlike the user's typing;
- the corrected version the user preferred.

Negative examples are especially useful because they show which plausible edits destroy the voice.

## Failure modes

This extension is failing if it makes answers less accurate, injects unsupported slang, turns every response into casual chat, over-polishes a recognizable draft, or causes personal maintainer habits to leak into public presets.
