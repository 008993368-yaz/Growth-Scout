# Cursor integration (optional)

Growth Scout works in Cursor without any Cursor-specific files — ask the agent to follow `SKILL.md`.

## Option A: Project skill (recommended)

Copy into your product repo:

```
.cursor/skills/growth-scout/
  SKILL.md
  references/
  templates/
  examples/
```

Invoke: *Use the growth-scout skill: what should we build next?*

## Option B: Reference from repo root

Keep Growth Scout at repo root and prompt: *Follow SKILL.md (Growth Scout).*

## Option C: Cursor rule (optional nudge)

Copy `.cursor/rules/growth-scout.mdc` from this package. It reminds the agent to use Growth Scout on growth prompts — **not a replacement for SKILL.md**.

## Personal skill

Copy the skill folder to `~/.cursor/skills/growth-scout/` for all projects.
