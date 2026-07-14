# Mapping profile sections to ChatGPT

The profile format deliberately keeps three stable sections:

- `occupation`: a short description of the user's role;
- `about`: durable context that changes how answers should be explained;
- `response`: language, tone, structure, research, and technical preferences.

These are repository concepts, not a promise that every ChatGPT client will always show three fields with the same labels. Product surfaces, field names, field counts, and limits can change.

## Practical mapping

When the interface exposes matching personalization fields, paste each rendered section into the closest field:

| Rendered section | Typical destination |
| --- | --- |
| Occupation | Occupation, role, or work context |
| More about you | User context or information ChatGPT should know |
| Response preferences | How ChatGPT should respond |

When the interface exposes fewer fields, preserve the meaning rather than the labels. Combine the short occupation text with the beginning of the user-context section, then keep response preferences in the field intended for response style or custom instructions.

When the interface exposes one general instructions field, combine the rendered sections in this order:

```text
Occupation

More about you

Response preferences
```

Review the combined text before saving it. Remove repeated ideas and keep temporary project requirements in the current conversation or project rather than global personalization.

## Related product features

Saved memory, selected personality, project instructions, and the current prompt can all affect a response. This repository does not treat those features as interchangeable:

- use the profile for stable, reviewable preferences;
- use memory for useful context that does not need exact wording;
- use project instructions for rules limited to one workspace;
- use the current prompt for temporary requirements and output details.

The CLI and browser builder use a configurable 1,500-character limit for the two long rendered sections. Treat that as a conservative validation default, not a guarantee that every current or future product surface uses the same limit.

Check current product documentation before relying on a specific field name, layout, or limit.
