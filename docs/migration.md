# Migrating an existing custom-instruction block

A large existing instruction can usually be improved without rewriting it from scratch.

## 1. Extract stable facts

Highlight statements about the user that are likely to remain true for months: role, experience level, recurring work, accessibility needs, preferred units, or durable constraints.

Move the shortest role summary into `occupation`. Move the remaining useful facts into `about`.

Delete facts that are merely interesting but do not change future answers.

## 2. Separate response behavior

Highlight statements that describe how answers should be written or checked. Map language, tone, audience, structure, technical workflow, research expectations, and recurring failure modes into the corresponding `response` fields.

Turn rigid rules into conditional defaults where appropriate.

## 3. Remove task-local context

Delete current project names, deadlines, client requirements, temporary software versions, one-off output formats, and instructions that only matter in a specific conversation.

Store project-wide rules in the relevant project or workspace. Put one-off constraints in the current prompt.

## 4. Remove prompt folklore

Delete inflated expert roles, hidden-chain-of-thought demands, guaranteed-accuracy claims, emotional bribes, and repeated commands that say the same thing in different words.

Replace them with observable behavior and a visible verification step.

## 5. Render and lint

Create a JSON profile using `profiles/blank.json`, then run:

```bash
python tools/profile.py lint path/to/profile.json
python tools/profile.py render path/to/profile.json --out build/profile
```

Review the rendered text rather than pasting it immediately. The linter can find obvious problems, but it cannot decide whether every sentence is useful.

## 6. Test against a baseline

Choose several prompts you use regularly. Compare the new profile with personalization disabled or with the old instruction block.

Keep changes that produce a repeatable benefit. Remove rules whose effect is invisible, inconsistent, or harmful on unrelated tasks.

## 7. Maintain deliberately

Version the source profile. Re-test it after major ChatGPT product or model changes. Avoid continuous expansion; maintenance should include subtraction.
