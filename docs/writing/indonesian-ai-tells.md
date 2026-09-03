# Indonesian AI-writing heuristics

These are **revision heuristics**, not a detector and not a claim that any single phrase proves AI authorship. They exist because upstream Sepia and most Humanizer-style pattern catalogs are English-oriented, while Indonesian ChatGPT output has recurring structural habits that can feel synthetic even after casual vocabulary is added.

Use these rules only when patterns cluster and conflict with the intended author or venue.

## Structural tells worth checking

### Ceremonial lead-ins

Common failure mode: the response spends a sentence announcing that it understands, agrees, will explain, or finds something interesting before delivering the useful text.

Examples of shapes to question:

- `baik, ...`
- `tentu, ...`
- `menariknya, ...`
- `nah, yang perlu dipahami ...`
- `kalau kita lihat lebih dalam ...`

These phrases are not banned. Keep them when the author genuinely uses them or when they serve a conversational purpose. Remove them when they only delay the content.

### Restating the request

A model often paraphrases the user's ask before answering it. In sendable text this is especially artificial because the recipient never asked the prompt that generated the draft.

Cut setup that merely says what the text is about. Start where a person writing the message would naturally start.

### Contrast-template overuse

The pattern `bukan X, tapi Y` is useful, but repeated contrast framing is a strong ChatGPT rhythm in Indonesian prose. The same applies to `bukan cuma X, melainkan juga Y` and repeated `justru` pivots.

If the contrast carries real meaning, keep it. If it exists mainly to make the sentence sound decisive, rewrite it plainly.

### Signposting every turn

Synthetic prose often narrates its own structure with phrases such as `yang paling penting`, `yang menarik di sini`, `kalau ditarik lebih jauh`, `poin utamanya`, `pada akhirnya`, or `jadi intinya` in nearly every paragraph.

A human draft usually lets some relationships remain implicit. Keep signposts only where the reader would otherwise lose the thread.

### Symmetry and neat triplets

Watch for repeated three-part lists, three adjectives, three consequences, or paragraphs with matching size and grammar. A single triplet is normal; a whole answer built from balanced threes feels templated.

Do not break useful lists just to appear human. Break the pattern only when the information itself is not naturally three-part.

### Mini-heading inflation

Short prose can become synthetic when every idea gets a bold mini-heading followed by one similar-length paragraph. If the text would read more naturally as two connected paragraphs, use prose.

Keep headings for real topic changes, long documents, procedures, or material that benefits from scanning.

### Recap endings

Avoid an ending that only repeats the previous paragraph with `jadi`, `intinya`, `kesimpulannya`, or a generic future-looking sentence. Stop when the useful content has ended.

### Fake colloquial coating

Adding `wkwk`, `nah`, `sih`, `dong`, `bro`, shortened words, or typos does not automatically make prose sound human. Casual markers become another template when they are inserted without support from the source voice.

Match the author's actual frequency and placement. A user's real shorthand is evidence; invented slang is decoration.

### Register collision

A sentence can sound especially machine-written when formal abstract phrasing is wrapped in casual particles, for example a highly polished explanation ending in `wkwk` or a corporate sentence containing random shorthand.

Choose one register that fits the audience and let genuine source habits create the exceptions.

### Over-explanation after the point is already clear

Indonesian LLM output often states a point, explains it, gives a second paraphrase, then summarizes the same implication. If the reader already has enough information, delete the rest.

This is particularly important for chat replies, captions, and short public posts where compression is part of the voice.

### Staged profundity and candor

Watch for a theatrical setup that announces honesty or a deeper truth without adding substance. Common shapes include `jujur?`, `kalau mau jujur`, `sebenarnya inti masalahnya`, `yang benar-benar penting`, `pada level paling fundamental`, or similar framing before an ordinary claim.

Do not ban these phrases. Keep them when the writer is actually changing stance, admitting uncertainty, or making a meaningful distinction. Remove the setup when the same point is clearer without it.

### Invisible defenses and discarded alternatives

Iterative drafting can leave sentences that answer context the final reader never saw. Indonesian examples include `ini bukan berarti...`, `bukan berarti saya mengatakan...`, or an option introduced only as `mungkin kelihatannya masuk akal untuk... tapi...` and then never used again.

Remove the residue when it adds no information beyond the final claim. Preserve a real objection when the text names who raised it, when a reader would reasonably consider it, or when answering it changes the argument. Preserve real alternatives when they affect a design or decision trade-off.

### Formulaic sayings and dramatic fragments

A polished one-line saying can sound synthetic when it turns an ordinary claim into a slogan, and several short fragments in a row can manufacture emphasis rather than communicate information.

Replace the form with the specific claim when the line contributes no distinct meaning. Keep deliberate punchlines, aphorisms, or fragments when they are actually part of the writer's voice or the genre.

## Surface checks

After structure and register are right, check for:

- repeated sentence openings;
- too many abstract nouns where a direct verb works;
- consecutive sentences with nearly identical length;
- the same transition word reused across paragraphs;
- excessive parenthetical explanation;
- adjectives that intensify without adding information;
- slogan-like abstractions or stacked dramatic fragments;
- unusually polished punctuation when the source is intentionally compressed;
- random imperfections introduced solely to look less machine-written.

Correct grammar is not a problem by itself. Clean punctuation is not a problem by itself. The goal is congruence with the intended author and venue.

## Yasman-specific guardrails

For informal sendable text where Yasman's own typing is explicitly the target:

- Preserve supported shorthand such as `kek`, `tpi`, `klo`, and `jg` when it already fits the sentence.
- Prefer compact connected prose over a tidy outline unless the content is naturally list-shaped.
- Do not expand a short emotional or practical message into a full explanation of motives.
- Do not over-polish into formal Indonesian.
- Do not inject slang merely because the user asked for "typingku"; imitate observed sentence shape and compression first.
- If a supplied draft already sounds recognizably like the user, edit as little as possible.

These are maintainer-specific observations and should not become defaults for public presets or other users.

## False positives

Do not flag something merely because it contains:

- correct Indonesian;
- a formal tone in a formal document;
- one contrast sentence;
- one three-item list;
- one heading;
- one `jadi`, `nah`, `jujur`, `sebenarnya`, or `justru`;
- a real objection or alternative that matters to the argument;
- concise, polished professional writing.

The signal is the **cluster and mismatch**, not an isolated token.
