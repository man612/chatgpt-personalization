# Security and privacy

ChatGPT Personalization is a small static/browser + local-CLI project. It does not require API keys, account exports, a backend service, or runtime third-party Python packages. That reduces the attack surface, but it does not make published profiles or browser input automatically safe.

## Supported code

Security fixes are applied to the current `main` branch. Older commits, copied profiles, and third-party forks may not receive fixes.

## What to report

Security-relevant reports include, for example:

- browser-builder behavior that could execute or inject untrusted content;
- unsafe import/export or file-handling behavior;
- a way to bypass the intended privacy boundary for `profiles/local/`;
- secret or sensitive-data exposure caused by repository tooling;
- CI or repository automation that could expose credentials or allow unintended writes.

A bad personalization result, inaccurate model answer, or ChatGPT product issue is not a security vulnerability in this repository.

## Reporting a vulnerability

Do **not** publish exploit details, credentials, or sensitive personal data in a public issue.

If GitHub shows a **Report a vulnerability** option for this repository, use that private reporting path. Otherwise, open a minimal issue stating that you need a private security contact, without including the exploit, secret, or sensitive payload.

GitHub private vulnerability reporting is a repository setting and may not always be enabled, so this policy does not assume that the button is present.

## Profile privacy

Do not include secrets or sensitive personal data in public presets, issues, pull requests, screenshots, or test fixtures. Personal JSON profiles belong in `profiles/local/`, which is ignored by Git by default.

The linter detects a small set of common credential-like patterns. It is a guardrail, not a security scanner, and cannot prove that a profile is safe to publish.

## Disclosure and fixes

Please allow reasonable time to reproduce, assess, and fix a confirmed vulnerability before public disclosure. Security fixes should include a regression test when the issue can be reproduced safely.
