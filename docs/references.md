# References and design notes

This file records sources that informed the initial design. It is not a systematic review of every personalization repository, and it should not be read as evidence that this project outperforms other approaches.

## ChatGPT product behavior

The project separates stable identity, user context, response preferences, memory, project context, and task-local requests because these layers have different scopes and can conflict.

Official sources:

- [ChatGPT Custom Instructions](https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt)
- [Customizing Your ChatGPT Personality](https://help.openai.com/en/articles/11899719-customizing-your-chatgpt-personality)
- [Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq)

Product interfaces, labels, limits, plans, and memory behavior can change. Check the current documentation before depending on a UI-specific assumption.

## Prompt structure and evaluation

OpenAI's API guidance separates instructions, examples, and context, while noting that the best structure varies by model and task. The repository borrows the separation principle without treating consumer ChatGPT fields as API system messages.

- [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)
- [Working with evals](https://developers.openai.com/api/docs/guides/evals)

The included scenarios are manual checks for profile behavior. They are not a benchmark of model capability and the repository does not currently publish comparative performance scores.

## Related public projects

The following projects were reviewed as examples of different approaches, including instruction collections, persona systems, and prompt-switching tools:

- [ChatGPT Custom Instructions](https://github.com/daveshap/ChatGPT_Custom_Instructions)
- [ChatGPT AutoExpert](https://github.com/spdustin/ChatGPT-AutoExpert)
- [ChatGPT Custom Instruction Switcher](https://github.com/tf318/chatgpt-custom-instruction-switcher)

Their inclusion is descriptive rather than competitive. Repository status and product assumptions may have changed since they were reviewed. A broader landscape comparison should record its search method, review date, inclusion criteria, and limitations before making market-wide claims.
