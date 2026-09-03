# Behavioral regression scenarios

These prompts test behavior, not model intelligence. Run them against a baseline, previous profile, and candidate profile when a relevant rule changes. Define pass criteria before reading the answer and repeat important cases because model output varies. The equivalent machine-readable cases live in `scenarios.json`.

## Explanation and depth

> What is an API, and why would an app use one?

> Explain reverse proxy from zero, but go deep enough that I can understand why it exists and how requests actually flow.

> Jelaskan Cloudflare Tunnel dari nol dan sangat awam, tapi tetap sampai saya benar-benar paham cara kerjanya. Anggap saya belum tahu DNS, port, reverse proxy, outbound connection, origin, ingress, NAT, atau tunnel.

Check dependency order rather than mere vocabulary simplification. The answer should establish why the system exists, identify the actors, walk through a concrete flow, and define core terminology at or before first meaningful use. It should not explain one unfamiliar concept mainly through several other unexplained concepts. Beginner language must preserve the mechanism, trade-offs, failure modes, and verification that matter.

## Long analysis

> Compare local storage, a hosted database, and a spreadsheet as data storage for a small internal app. Explain the trade-offs and recommend when each is appropriate.

Check whether structure follows the comparison instead of answer length and whether recommendations are conditional on the actual trade-offs.

## Troubleshooting

> A Windows computer can access the internet but cannot see a shared printer. Give me a safe troubleshooting plan.

Check likely causes, smallest relevant fixes, why important checks matter, verification, and side effects.

## Quick current lookup

> Which ChatGPT plan currently supports the Custom Instructions capacity I need?

Check whether current product information is verified rather than recalled from a frozen profile. This case should *not* become research theatre when one authoritative current source is enough.

## Deep multi-source research

> Riset mendalam dari banyak sumber: compare three current AI coding services on price, effective usage limits, model availability, caching, and real-world usage. I care about usable work per dollar, not advertised price alone.

This is deliberately different from the quick-lookup case. Check that the response decomposes the problem, searches multiple targeted angles, establishes current product facts from primary sources, cross-checks load-bearing real-world claims independently, checks dates/tiers/versions, normalizes quantitative assumptions, looks for evidence against the leading conclusion, and does not stop at the first plausible recommendation.

## Conflicting sources

> Research a current software feature where official documentation, a release note, and recent user reports appear to disagree. Tell me what is actually supported now and why the sources differ.

Check dates, versions, rollout scope, and whether disagreement is explained rather than silently resolved by choosing the most convenient source.

## Quantitative research

> Compare two pay-as-you-go AI APIs with different input, output, and cache pricing for a workload I describe. Research the current prices and calculate the effective cost rather than comparing headline numbers.

Check primary pricing evidence, normalized units, explicit assumptions, auditable calculations, and honest treatment of missing price components.

## Repository analysis

> Review this repository's architecture and tell me whether its configuration model is actually reusable by other people, not just its maintainer.

> Investigate whether a technical project's documented feature is really implemented and stable. Use its docs, source/configuration, releases or changelog, and relevant issues when available.

Check whether source/configuration and implementation are inspected, not just README claims. Version evidence and relevant issues should be used when they materially change the conclusion. Separate confirmed implementation from inference.

## UI/UX

> Review this application screen for UI/UX problems and explain which changes matter most to the user experience.

Check concrete elements, user impact, priority, and whether the answer avoids a generic checklist dump.

## Artifact override

> Write a formal complaint email to an internet provider about repeated outages.

The artifact should match its audience rather than inherit conversational tone.

## Voice-preserving rewrite

> Rapikan pesan ini biar tetap typingku dan bisa langsung kukirim: “aku sebenernya ga masalah tpi klo emng jadwalnya berubah kasih tau aja dari awal, biar aku ga nunggu”

The rewrite must preserve the facts, shorthand, and semantic compression already present. It should not add fake slang, deliberate mistakes, extra explanation, or a meta preamble before the finished message.

## De-AI without overcorrection

> Rewrite this short project update so it sounds like the original author rather than generic AI prose. Keep every fact and do not make it more casual than the source.

Check that the result removes chatbot residue or low-information padding only when present, preserves the source register and stance, does not invent anecdotes or specificity, and prefers the smallest useful rewrite over performative humanization.

## Drafting residue

> Rapikan paragraf ini supaya bisa berdiri sendiri untuk pembaca yang tidak melihat proses drafting: “Ini bukan berarti dokumentasi tidak penting. Saya juga tidak bilang prompt harus pendek. Pendekatan yang mungkin terlihat menarik adalah menambah aturan baru untuk setiap masalah, tapi itu juga bukan intinya. Yang menentukan adalah apakah instruksi yang relevan tersedia ketika model membutuhkannya.”

Check that the actual claim survives while unsupported defenses and a discarded alternative are removed when they add no information. The rewrite must not invent a new rationale, stance, or example.

## Preserve real objections and alternatives

> Edit this design note for clarity without deleting real trade-offs: “Tim frontend mengusulkan localStorage karena implementasinya paling sederhana. Tim security menolak penyimpanan credential di browser karena data itu persisten di perangkat. IndexedDB masih menjadi opsi untuk cache offline yang tidak sensitif. Untuk credential, keputusan akhirnya adalah penyimpanan server-side.”

Check the false-positive boundary. The frontend proposal, named security objection, bounded IndexedDB option, and final credential decision are all real information and must survive. A de-AI pass must not flatten a legitimate decision record into only its conclusion.

## Staged profundity and candor

> Rapikan tanpa mengubah klaimnya: “Jujur? Pada akhirnya, masalah sebenarnya bukan soal panjang prompt. Di level paling fundamental, yang benar-benar penting adalah apakah instruksi tersedia ketika dibutuhkan.”

Remove theatrical depth or honesty framing when it adds no distinct meaning. Keep the substantive claim and do not replace the old rhetoric with new slang, slogans, or another `bukan X tapi Y` template.

## Current-state documentation

> Rewrite this documentation sentence so it describes current behavior rather than narrating implementation history: “This helper was added to replace the old O(n²) scan. It now uses a map for O(1) lookups.”

Lead with the current map-based O(1) behavior. Keep the historical O(n²) comparison only if it materially helps explain the current design, and do not invent implementation details that the source does not contain.

## Relevance boundary

> Explain why sourdough starter rises.

Professional interests should not leak into unrelated topics.

## Format exception

> Give me a checklist for reviewing a used laptop before buying it.

A paragraph-first profile should still use a checklist when a checklist is the correct format.

## Concise fact

> What port does SSH use by default?

A deep-explanation preference should not turn a simple fact into an essay.
