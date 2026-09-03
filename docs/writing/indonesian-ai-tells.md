# Indonesian AI-writing heuristics

These are **revision heuristics**, not a detector and not a claim that any single phrase proves AI authorship. They complement the generic [`natural writing core`](core.md) because most upstream Sepia and Humanizer material is English-oriented, while Indonesian ChatGPT output has recurring structural habits of its own.

Use these checks only when patterns cluster and conflict with the intended author or venue.

## Structural checks

### Ceremonial lead-ins

Question openings such as `baik`, `tentu`, `menariknya`, `nah, yang perlu dipahami`, or `kalau kita lihat lebih dalam` when they only announce that an answer is about to begin. Keep them when they serve a real conversational purpose or are part of the author's voice.

### Restating the request

A model often paraphrases the user's request before answering it. In sendable prose this is especially artificial because the recipient never saw the generating prompt. Start where the actual message or artifact would naturally start.

### Contrast-template overuse

`Bukan X, tapi Y`, `bukan cuma X, melainkan juga Y`, and repeated `justru` pivots are useful when the contrast is real. Repeated use as a rhetorical default creates a recognizable synthetic rhythm. Rewrite only the unnecessary instances.

### Signposting every turn

Watch for repeated phrases such as `yang paling penting`, `yang menarik di sini`, `kalau ditarik lebih jauh`, `poin utamanya`, `pada akhirnya`, or `jadi intinya`. Keep signposts when the reader genuinely needs orientation; remove them when the relationship is already clear.

### Symmetry and neat triplets

Repeated three-part lists, three adjectives, or paragraphs with matching size and grammar can feel templated. Do not break a useful list merely to look human. Break symmetry only when the information itself does not naturally have that shape.

### Mini-heading inflation

Short prose can become synthetic when every idea receives a bold mini-heading and a similar-length paragraph. Use connected prose when the material is one continuous explanation; keep headings for real topic changes or scannable reference material.

### Recap endings

Avoid endings that only repeat the preceding paragraph with `jadi`, `intinya`, `kesimpulannya`, or a generic future-looking sentence. Stop when the useful content has ended.

### Fake colloquial coating

Adding `wkwk`, `nah`, `sih`, `dong`, `bro`, shortened words, or typos does not make prose human by itself. Match the author's actual frequency and placement instead of decorating polished prose with random casual markers.

### Register collision

A highly formal abstract sentence with arbitrary slang or casual particles can sound more synthetic than either register alone. Choose the register required by the audience and let genuine source habits create the exceptions.

### Over-explanation after the point is clear

Indonesian LLM output often states a point, explains it, paraphrases it again, then summarizes the implication. If the reader already has what they need, delete the repetition. This matters especially for chat replies, captions, and short public posts.

### Staged profundity and candor

Question framing such as `jujur?`, `kalau mau jujur`, `sebenarnya inti masalahnya`, `yang benar-benar penting`, or `pada level paling fundamental` when it announces depth or honesty without adding substance. Keep it when the writer is genuinely changing stance, admitting uncertainty, or making a meaningful distinction.

### Invisible defenses and discarded alternatives

Iterative drafting can leave `ini bukan berarti...`, `bukan berarti saya mengatakan...`, or an option introduced only to be rejected. Rewrite unsupported defensive framing into the direct substantive claim. Remove an abandoned alternative only when it contributes no constraint or real trade-off. Preserve named objections, realistic alternatives, and material claims.

### Formulaic sayings and dramatic fragments

A polished one-line saying or several short fragments can manufacture emphasis without adding information. Replace the form with the specific claim when that is all it contains. Keep deliberate punchlines, aphorisms, or fragments when the writer or genre actually uses them.

## Surface checks

After structure and register are right, check for:

- repeated sentence openings;
- abstract nouns where a direct verb is clearer;
- consecutive sentences with nearly identical length;
- the same transition word repeated across paragraphs;
- excessive parenthetical explanation;
- adjectives that intensify without adding information;
- slogan-like abstractions or stacked dramatic fragments;
- punctuation that is much more polished or formal than the source voice;
- imperfections introduced solely to look less machine-written.

Correct Indonesian, clean punctuation, and polished professional writing are not problems by themselves.

## False positives

Do not flag something merely because it contains:

- one contrast sentence;
- one three-item list;
- one heading;
- one `jadi`, `nah`, `jujur`, `sebenarnya`, or `justru`;
- a real objection or alternative that matters to the argument;
- formal language in a formal document;
- concise, polished professional writing.

The signal is the **cluster and mismatch**, not an isolated token.
