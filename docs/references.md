# Research basis and related projects

Last reviewed: **2026-08-16**.

This file records the sources used to shape the repository. It is not a claim that this project is officially endorsed by OpenAI or that it outperforms other personalization approaches. Product behavior changes quickly, so current OpenAI documentation takes precedence over assumptions encoded here.

## Primary OpenAI product sources

The profile separates product settings, explicit instructions, evolving memory, and project-scoped context because OpenAI documents them as distinct personalization surfaces that can work together rather than as one interchangeable prompt.

- ChatGPT Custom Instructions: https://help.openai.com/en/articles/8096356-custom-instructions
- Customizing Your ChatGPT Personality: https://help.openai.com/en/articles/11899719-customizing-your-chatgpt-personality
- Characteristics in ChatGPT: https://help.openai.com/en/articles/20001038-characteristics-in-chatgpt
- Memory FAQ: https://help.openai.com/en/articles/8590148-memory-faq
- Projects in ChatGPT: https://help.openai.com/en/articles/10169521-projects-in-chatgpt
- ChatGPT Release Notes: https://help.openai.com/en/articles/6825453-chatgpt-release-notes

At this review date, Custom Instructions limits are documented as 1,500 characters for Free/Go and 5,000 for Plus/Pro/Business/Enterprise/Education. Because this is a product detail, the repository treats the limit as a validation target rather than permanent schema truth.

## Prompt and model-behavior guidance

OpenAI's latest model guidance recommends leaner prompts, avoiding repeated instructions, and validating prompt changes on representative evals. The public Model Spec provides a useful reference for instruction hierarchy and default response behavior.

- Model guidance: https://developers.openai.com/api/docs/guides/latest-model
- OpenAI Model Spec: https://github.com/openai/model_spec

The repository borrows these design principles without pretending that consumer ChatGPT Custom Instructions are identical to API developer/system messages.

## Evaluation references

OpenAI's Model Spec Evals separates evaluation prompts/datasets from the harness that executes and grades them, and supports repeated candidate/grader samples. That influenced this project's separation between machine-readable scenarios and optional external eval runners.

- Model Spec Evals: https://github.com/openai/model_spec_evals
- Model Spec source: https://github.com/openai/model_spec

For a broader open-source example of test-driven prompt work, promptfoo provides declarative test cases, multiple providers, graders, repeated evaluation workflows, and CI integration. It is an optional reference only; this repository does not require promptfoo at runtime.

- promptfoo: https://github.com/promptfoo/promptfoo

## Brand clarity

The project uses the ChatGPT name descriptively because it targets ChatGPT personalization, but it is independently maintained and must not imply an official relationship, sponsorship, or endorsement.

- OpenAI Design Guidelines: https://openai.com/brand

The repository therefore avoids OpenAI logos and marks its README and browser builder as independent open-source work.

## Older Custom Instructions projects reviewed

Several public repositories demonstrated that people want reusable Custom Instructions, persona packs, and switching workflows. They were useful landscape references, but many encode product assumptions from 2023–2024 and should not be treated as current ChatGPT documentation.

- daveshap/ChatGPT_Custom_Instructions — archived collection of reusable custom instructions
- spdustin/ChatGPT-AutoExpert — influential expert/persona-oriented instruction framework
- tf318/chatgpt-custom-instruction-switcher — switching workflow for multiple instruction sets

The lesson taken from these projects is not to copy their prompts. It is to preserve reuse, inspectability, and easy switching while avoiding stale product assumptions, prestige-persona claims, and one-size-fits-all defaults.

## Design conclusions from the review

The current architecture intentionally follows five conclusions: public presets should be anonymous; real personal profiles must be a different category; product controls should not be duplicated into prompt text when a dedicated control exists; changing product limits should be validation inputs; and behavioral claims require representative repeated evals rather than subjective prompt length or a single impressive response.

## Limitations

Consumer ChatGPT is not fully reproducible through the public API. Automated API evals can test rendered instruction text, but cannot exactly recreate every combination of ChatGPT Personality, Characteristics, Memory state, project context, connected sources, or product routing. The repository therefore keeps manual ChatGPT evaluation as a first-class workflow.
