# Growth Scout

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Scout opportunities before you write code.**

Open-source, agent-agnostic skill package for product growth scouting. Use it in your own repos — copy, fork, or clone.

Growth Scout is a **portable, agent-agnostic skill** (markdown, not an app) that helps coding agents recommend **what feature to build next** with the highest chance of helping a product grow.

Works with **Cursor, Claude Code, Codex, GitHub Copilot, OpenCode, Aider**, and any agent that can read project instructions.

## Core question

> What should we build next that has the highest chance of helping this product grow?

## Install

Growth Scout is a Markdown skill package, so there is no package manager install step. Add the files to the product repo you want an agent to analyze.

### Option A: Copy into a product repo

```bash
git clone https://github.com/008993368-yaz/Growth-Scout.git
cd your-product-repo
cp /path/to/Growth-Scout/SKILL.md .
cp /path/to/Growth-Scout/AGENTS.md .
cp -R /path/to/Growth-Scout/references .
cp -R /path/to/Growth-Scout/templates .
cp -R /path/to/Growth-Scout/examples .
```

Then prompt your agent: **Follow Growth Scout (`SKILL.md`) and recommend what to build next.**

### Option B: Cursor project skill

Copy the package into a Cursor skill folder in your product repo:

```text
.cursor/skills/growth-scout/
  SKILL.md
  references/
  templates/
  examples/
```

Then prompt: **Use the growth-scout skill: what should we build next?**

For Claude Code, Codex, GitHub Copilot, OpenCode, Aider, and other setups, see [`integrations/README.md`](integrations/README.md).

## Quick start (any agent)

1. Copy `SKILL.md`, `references/`, `templates/`, and `examples/` into your product project (or clone this repo).
2. Prompt: **Follow Growth Scout (`SKILL.md`) and recommend what to build next.**
3. Optional per-agent wiring: [`integrations/README.md`](integrations/README.md).

| Entry point | Purpose |
|-------------|---------|
| [`SKILL.md`](SKILL.md) | Canonical workflow (start here) |
| [`AGENTS.md`](AGENTS.md) | Auto-discovery for Codex, Claude Code, and similar tools |

## What it combines

Product context, codebase awareness, competitor gaps, market signals (evidence-rated), growth scoring, feasibility, and PRD templates.

## Example prompts

```
Follow Growth Scout (SKILL.md): what should we build next?
Run a Growth Scout product scan. Label unknowns clearly.
Turn the top opportunity into a PRD and GitHub issues.
```

## Package layout

```
AGENTS.md
SKILL.md
integrations/     # Optional per-agent setup (Cursor is one option)
references/
templates/
examples/
.cursor/rules/    # Optional Cursor-only hook
```

## vs generic PM skills

Codebase-aware scoring, evidence labels (known/inferred/unknown), competitor gap buckets, and explicit research limits when browsing is unavailable.

## Safety

Do not invent market demand. Cap scores when evidence is weak. Use [`references/validation-experiments.md`](references/validation-experiments.md) when proof is missing.

## Roadmap

CLI repo inventory, optional MCP for competitor fetch, industry reference packs.

**Tagline:** Scout opportunities before you write code.

## License

[MIT](LICENSE) — use, modify, and distribute freely with attribution.