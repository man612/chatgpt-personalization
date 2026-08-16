# Privacy and data hygiene

A personalization profile can contain durable information about a person, so treat it like configuration with privacy impact.

Public presets in `profiles/presets/` must be anonymous and reusable. Public maintainer profiles are intentionally published examples and should contain only information the maintainer is comfortable making public. Private personal profiles belong in `profiles/local/`, whose JSON files are gitignored by default.

Git ignore rules prevent accidental ordinary commits; they are not encryption and not a security boundary. Always review `git status` and the staged diff before publishing.

Never store passwords, API keys, private keys, authentication tokens, client secrets, confidential customer data, or information that does not need to be global personalization. The linter catches a small set of recognizable secret formats, but it is not a complete secret scanner.

Remember that product features such as Memory and connected apps have their own data behavior. This repository only stores the configuration you choose to put in its files; it does not control ChatGPT account-level data settings.
