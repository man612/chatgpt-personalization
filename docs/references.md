# Research basis and related projects

Last reviewed: **2026-08-19**.

This file records the sources used to shape the repository. It is not a claim that this project is officially endorsed by OpenAI or that it outperforms other personalization approaches. Product behavior changes quickly, so current OpenAI documentation takes precedence over assumptions encoded here.

## Primary OpenAI product sources

The profile separates product settings, explicit instructions, evolving memory, and project-scoped context because OpenAI documents them as distinct personalization surfaces rather than one interchangeable prompt.

- ChatGPT Custom Instructions: https://help.openai.com/en/articles/8096356-custom-instructions
- Customizing Your ChatGPT Personality: https://help.openai.com/en/articles/11899719-customizing-your-chatgpt-personality
- Characteristics in ChatGPT: https://help.openai.com/en/articles/20001038-characteristics-in-chatgpt
- Memory FAQ: https://help.openai.com/en/articles/8590148-memory-faq
- Projects in ChatGPT: https://help.openai.com/en/articles/10169521-projects-in-chatgpt
- ChatGPT Search: https://help.openai.com/en/articles/9237897-chatgpt-search
- Deep Research in ChatGPT: https://help.openai.com/en/articles/10500283-deep-research
- ChatGPT Release Notes: https://help.openai.com/en/articles/6825453-chatgpt-release-notes

At this review date, Custom Instructions limits are documented as 1,500 characters for Free/Go and 5,000 for Plus/Pro/Business/Enterprise/Education. Because this is a product detail, the repository treats the limit as a validation target rather than permanent schema truth.

OpenAI currently documents that Project Instructions apply only inside their project and override global Custom Instructions. The repository therefore treats project instructions as a separate scope and warns users not to assume that important global explanation or research behavior automatically carries into a project.

OpenAI also distinguishes Search from Deep Research: Search is appropriate for quick current lookups, while Deep Research is intended for multi-step investigation and synthesis across many sources. A profile can define evidence-gathering expectations, but it cannot make those product modes identical.

## Prompt and model-behavior guidance

OpenAI's latest model guidance recommends leaner prompts, stating each instruction once, removing repetition, and validating changes on representative evals. It also notes that newer models can be more concise by default, so task-specific completeness requirements should be explicit when they matter.

- Model guidance: https://developers.openai.com/api/docs/guides/latest-model
- OpenAI Model Spec: https://github.com/openai/model_spec

The repository borrows these design principles without pretending that consumer ChatGPT Custom Instructions are identical to API developer/system messages.

## Research-process references

OpenAI's BrowseComp research is useful evidence for distinguishing “has a search tool” from “performs persistent research.” The benchmark was designed around hard-to-find information that can require many search attempts, and OpenAI reports that strong performance depends on persistence, creative query reformulation, reasoning about retrieved evidence, and synthesis rather than browsing access alone.

- BrowseComp overview: https://openai.com/index/browsecomp/
- BrowseComp paper: https://arxiv.org/abs/2504.12516

BrowseComp is not a direct benchmark for long-form user research, so this project does not copy its scoring. The transferable lesson is narrower: difficult evidence gathering needs persistence and adaptive search, not merely a first-pass lookup.

## Beginner explanation and jargon references

Research on personalized jargon identification supports treating vocabulary familiarity as user- and domain-dependent rather than assuming a generic “beginner” vocabulary. In one dataset, familiarity varied substantially even among computer-science researchers in the same broad subdomain. That supports this repository's distinction between **unknown vocabulary** and **reasoning ability**.

- Personalized Jargon Identification for Enhanced Interdisciplinary Communication: https://arxiv.org/abs/2311.09481
- Explain Less, Understand More: Jargon Detection via Personalized Parameter-Efficient Fine-tuning: https://arxiv.org/abs/2505.16227
- Understanding Jargon: Combining Extraction and Generation for Definition Modeling: https://arxiv.org/abs/2111.07267

These papers do not prove that one particular Custom Instructions phrase is optimal. They motivate the eval target: do not rely on unfamiliar terms before establishing the concepts they depend on, while preserving substantive reasoning.

## Evaluation references

OpenAI's Model Spec Evals separates evaluation prompts/datasets from the harness that executes and grades them, and supports repeated candidate and grader samples. That influenced this project's separation between machine-readable scenarios and optional external eval runners.

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

The current architecture intentionally follows these conclusions: public presets should be anonymous; real personal profiles must be a different category; product controls should not be duplicated into prompt text when a dedicated control exists; changing product limits should be validation inputs; vocabulary familiarity should not be confused with reasoning ability; quick lookup and deep research need separate behavioral tests; and behavioral claims require representative repeated evals rather than subjective prompt length or a single impressive response.

## Limitations

Consumer ChatGPT is not fully reproducible through the public API. Automated API evals can test rendered instruction text, but cannot exactly recreate every combination of ChatGPT Personality, Characteristics, Memory state, project context, connected sources, or product routing. The repository therefore keeps manual ChatGPT evaluation as a first-class workflow.
