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

### Option C: Bootstrap install

From the Growth Scout package root, install skill files and generate a draft product map in one step:

```bash
git clone https://github.com/008993368-yaz/Growth-Scout.git
node Growth-Scout/scripts/install-growth-scout.mjs /path/to/your-product-repo
```

Optional layouts: `--layout root` (default, copies to repo root) or `--layout cursor` (`.cursor/skills/growth-scout/`). Use `--dry-run` to preview or `--force` to overwrite an existing install. The script prints a ready-to-use first agent prompt when done.

## Quick start (any agent)

1. Copy `SKILL.md`, `references/`, `templates/`, `examples/`, and `VERSION` into your product project (or clone this repo).
2. Prompt: **Follow Growth Scout (`SKILL.md`) and recommend what to build next.**
3. Optional per-agent wiring: [`integrations/README.md`](integrations/README.md).

| Entry point | Purpose |
|-------------|---------|
| [`SKILL.md`](SKILL.md) | Canonical workflow (start here) |
| [`AGENTS.md`](AGENTS.md) | Auto-discovery for Codex, Claude Code, and similar tools |

### Example outputs (fictional Chartflow narrative)

| Artifact | File |
|----------|------|
| Product Scan | [`examples/example-product-scan.md`](examples/example-product-scan.md) |
| Opportunity Report | [`examples/example-opportunity-report.md`](examples/example-opportunity-report.md) |
| Growth PRD | [`examples/example-growth-prd.md`](examples/example-growth-prd.md) |

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
mcp/              # Optional MCP server (competitor + work-item signals)
references/
templates/
examples/
.cursor/rules/    # Optional Cursor-only hook
```

## Tooling

Zero-dependency Node scripts (no `npm install` required):

```bash
# Install skill files + first-scan draft into a product repo
node scripts/install-growth-scout.mjs /path/to/product-repo
node scripts/install-growth-scout.mjs /path/to/product-repo --layout cursor
node scripts/install-growth-scout.mjs --help

# Pre-fill a product-map draft from a target repo (stdout or file)
node scripts/repo-inventory.mjs .
node scripts/repo-inventory.mjs /path/to/product --out product-map-draft.md
node scripts/repo-inventory.mjs --help

# Validate markdown links in core docs (also runs in CI)
node scripts/validate-links.mjs
```

**Optional Growth Scout MCP** (any MCP-capable agent): build and connect the stdio server per [`integrations/mcp.md`](integrations/mcp.md). Server package: [`mcp/growth-scout-mcp/`](mcp/growth-scout-mcp/).

```bash
cd mcp/growth-scout-mcp && npm install && npm test
```

Auto-detected inventory fields are labeled **inferred**; unknowns stay blank for the agent or user to fill.

## Versioning

The [`VERSION`](VERSION) file tracks the skill package revision (currently **0.5.0**). Copy it into product repos alongside `SKILL.md` so teams know which Growth Scout revision they pinned. See [`CHANGELOG.md`](CHANGELOG.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## vs generic PM skills

Codebase-aware scoring, evidence labels (known/inferred/unknown), competitor gap buckets, and explicit research limits when browsing is unavailable.

## Safety

Do not invent market demand. Cap scores when evidence is weak. Use [`references/validation-experiments.md`](references/validation-experiments.md) when proof is missing.

## Roadmap

Optional ~~MCP for competitor fetch~~, ~~industry reference packs~~, ~~GitHub release tags aligned with `VERSION`~~.

**Tagline:** Scout opportunities before you write code.

## License

[MIT](LICENSE) — use, modify, and distribute freely with attribution.