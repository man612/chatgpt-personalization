# References and design basis

This project is intentionally grounded first in primary OpenAI product and developer documentation. Product behavior can change, so review dates matter.

## ChatGPT personalization

The v2 separation between product settings, durable user context, instructions, Memory, project context, and task-local requests is informed by current ChatGPT documentation:

- ChatGPT Custom Instructions: https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt
- Customizing Your ChatGPT Personality: https://help.openai.com/en/articles/11899719-customizing-your-chatgpt-personality
- Characteristics in ChatGPT: https://help.openai.com/en/articles/20001038-characteristics-in-chatgpt
- Memory FAQ: https://help.openai.com/en/articles/8590148-memory-faq
- ChatGPT release notes: https://help.openai.com/en/articles/6825453-chatgpt-release-notes

The repository does not assume that every account exposes the same fields or controls. Characteristics and limits can roll out by plan or change over time.

## Prompt design and evaluation

The project favors observable instructions, limited repetition, and evaluation against realistic scenarios rather than prestige personas or prompt length.

Primary references:

- OpenAI prompt engineering guidance: https://developers.openai.com/api/docs/guides/prompt-engineering
- OpenAI latest-model guidance: https://developers.openai.com/api/docs/guides/latest-model
- OpenAI evals guidance: https://developers.openai.com/api/docs/guides/evals
- OpenAI Model Spec: https://github.com/openai/model_spec
- OpenAI Model Spec eval harness: https://github.com/openai/model_spec_evals
- OpenAI Model Spec dataset: https://github.com/openai/model_spec_dataset

The repository borrows the evaluation mindset, not the claim that its manual scenarios are equivalent to OpenAI's internal or public model evaluations.

## Related public projects

Other public personalization and instruction projects can be useful as design references, but their product assumptions may be stale:

- https://github.com/daveshap/ChatGPT_Custom_Instructions
- https://github.com/spdustin/ChatGPT-AutoExpert
- https://github.com/tf318/chatgpt-custom-instruction-switcher

Their inclusion does not imply endorsement or comparative superiority.

## Review date

The v2 product assumptions were reviewed in August 2026. Re-check official documentation before treating UI labels, limits, plan availability, or model behavior as current.
