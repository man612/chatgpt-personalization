# Profiles

Profiles are versioned sources of truth for **three different layers** of ChatGPT personalization:

1. `product` — recommended product-level settings such as Personality, Characteristics, and Memory;
2. `identity` — durable user context that changes how answers should be explained;
3. `instructions` — observable response behavior for explanation, structure, technical work, research, UI/UX, and writing.

Do not put temporary projects, deadlines, credentials, client data, or one-off output requirements in a global profile. Put project-wide rules in the relevant ChatGPT Project or workspace, and put one-off requirements in the current request.

## Included profiles

- `yasman.json` — the maintainer's public, non-secret working profile and the strongest example of the v2 model.
- `tech-generalist.json` — reusable template for hands-on technology and AI-assisted development.
- `knowledge-worker.json` — office work, research, planning, and practical decisions.
- `student.json` — structured learning without assuming expert vocabulary.
- `product-designer.json` — interface critique, flows, and product design.
- `writer-editor.json` — drafting and editing while preserving voice.
- `blank.json` — minimal v2 starting point.

The product settings are recommendations, not a claim that every ChatGPT account exposes the same controls. Characteristics, Memory options, labels, and limits can vary by plan and product rollout.

Run `python tools/profile.py lint profiles/*.json` after changes, then compare behavior with the scenarios in `tests/scenarios.md` rather than assuming a structurally valid profile is behaviorally better.
