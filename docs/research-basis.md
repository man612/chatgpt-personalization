# Research basis

This project treats personalization as a small configuration system rather than a one-time prompt-writing exercise.

## Product behavior

OpenAI documents that custom instructions apply across chats and that long-form custom-instruction fields have a 1,500-character limit. It also documents that a selected personality changes communication style rather than capability, and that personality works alongside saved memory and custom instructions. These layers can reinforce or conflict with one another.

Sources:

- [ChatGPT Custom Instructions](https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt)
- [Customizing Your ChatGPT Personality](https://help.openai.com/en/articles/11899719-customizing-your-chatgpt-personality)
- [Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq)

That product model leads to a practical design rule: stable identity, stable context, response preferences, project context, memory, and task-local requests should not be treated as one undifferentiated prompt.

## Prompt structure

OpenAI's prompt engineering guide separates identity, instructions, examples, and context, while noting that the optimal content and order can vary by model. The same separation is useful for personal settings even though ChatGPT's consumer interface is not the API.

Source:

- [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)

This repository adapts that principle into a smaller profile format. It does not copy API system-message patterns directly into every consumer field.

## Evaluation

OpenAI's evaluation guidance describes evals as tests against style and content criteria, followed by analysis and prompt iteration. A personal profile can use the same basic discipline without an API: define expected behavior, run representative prompts, compare against a baseline, and make the smallest useful change.

Source:

- [Working with evals](https://developers.openai.com/api/docs/guides/evals)

The manual scenarios in this repository are intentionally modest. They test whether personalization behaves consistently; they do not claim to benchmark model intelligence.

## Public repository landscape

Public projects in this area tend to fall into three categories: copy-and-paste instruction packs, elaborate expert-persona systems, and browser tools for switching between saved prompts. Those projects solve real problems, but they leave a gap for a small, auditable profile format with validation and repeatable testing.

Representative examples reviewed during the initial design:

- [ChatGPT Custom Instructions](https://github.com/daveshap/ChatGPT_Custom_Instructions)
- [ChatGPT AutoExpert](https://github.com/spdustin/ChatGPT-AutoExpert)
- [ChatGPT Custom Instruction Switcher](https://github.com/tf318/chatgpt-custom-instruction-switcher)

The purpose of this project is not to replace those approaches. Its scope is narrower: make personal settings easier to separate, review, test, version, and maintain.
