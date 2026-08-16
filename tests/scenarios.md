# Behavioral evaluation scenarios

Structural tests can prove that a profile is valid and renders consistently. They cannot prove that ChatGPT actually responds better. Use these scenarios as a small regression suite and compare the same model with personalization disabled, the previous profile, and the candidate profile.

Record the date, ChatGPT surface, selected model, profile revision, run number, and observed failures. Important scenarios should be run more than once because a single output is noisy evidence.

## 1. Beginner explanation without shallowness

> Explain what a reverse proxy is from zero, but go deep enough that I understand why it exists and how traffic actually flows.

Pass when the answer builds the concept before leaning on jargon, preserves the mechanism, and does not become a numbered outline merely because it is long.

## 2. Programming concept in dependency order

> I understand what an app does but I do not really understand state management. Explain why React apps need it, then explain `useState`, shared state, and stores.

Pass when the answer explains the problem before the APIs and does not assume terms such as render, component tree, mutation, or store without explanation when they matter.

## 3. Deep research

> Research the latest workflow for exposing a local web app through Cloudflare Tunnel. Compare it with the older workflow and tell me what actually changed.

Pass when current claims are verified, primary sources are preferred, repository/release evidence is inspected when relevant, evidence is separated from inference, and depth comes from mechanisms and cross-checking rather than bullet count.

## 4. Repository analysis

> Analyze this open-source repository and explain its architecture to me as an intelligent beginner. Do not rely only on the README if the source code changes the picture.

Pass when the actual repository structure or implementation is inspected and architecture terminology is explained in context.

## 5. Troubleshooting

> A Windows computer can access the internet but cannot see a shared printer. Give me a safe troubleshooting plan and explain why each check matters.

Pass when likely causes are prioritized, fixes are minimal, verification is explicit, and risky or disruptive actions are not suggested prematurely.

## 6. UI/UX critique

> Review this dashboard UI. Tell me what is actually wrong, why users would feel it, and what you would change first.

Pass when feedback identifies concrete elements, connects them to user impact, covers relevant hierarchy/spacing/type/interaction/accessibility issues, and avoids a generic checklist.

## 7. Artifact override

> Write a formal complaint email to an internet provider about repeated outages.

Pass when the artifact fits the recipient and requested formality instead of inheriting the assistant's conversational tone.

## 8. Relevance boundary

> Explain why sourdough starter rises.

Pass when a technology profile does not force software, networking, or AI analogies into an unrelated topic unless they genuinely make the explanation clearer.

## 9. Format exception

> Give me a checklist for reviewing a used laptop before buying it.

Pass when a paragraph-first profile still produces a usable checklist because the requested information is naturally a checklist.

## 10. Short factual question

> What port does HTTPS normally use?

Pass when personalization does not inflate a simple answer into an unnecessary tutorial.
