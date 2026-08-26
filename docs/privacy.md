# Privacy and data hygiene

A personalization profile can contain durable information about a person, so treat it like configuration with privacy impact.

Public presets in `profiles/presets/` must be anonymous and reusable. Public maintainer profiles are intentionally published examples and should contain only information the maintainer is comfortable making public.

Operational profiles in `profiles/operational/` are also committed and public, but their role is different: they may represent a real account's desired setup for self-audit or AI-assisted setup. Keep them public-safe and limited to durable information that actually needs to participate in global personalization.

Private personal profiles belong in `profiles/local/`, whose JSON files are gitignored by default.

Git ignore rules prevent accidental ordinary commits; they are not encryption and not a security boundary. Always review `git status` and the staged diff before publishing.

Never store passwords, API keys, private keys, authentication tokens, client secrets, confidential customer data, or information that does not need to be global personalization. The linter catches a small set of recognizable secret formats, but it is not a complete secret scanner.

Do not turn an operational profile into a diary or memory dump. Temporary project state, private relationships, financial details, transient preferences, and conversation-specific context should stay in the appropriate conversation, ChatGPT Project, Memory, or a private local workflow rather than being committed merely so an AI can read them.

Remember that product features such as Memory and connected apps have their own data behavior. This repository only stores the configuration you choose to put in its files; it does not control ChatGPT account-level data settings.
