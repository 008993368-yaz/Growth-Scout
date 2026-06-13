# Agent instructions

This repository is an **agent-agnostic skill package**. The canonical instructions live in [`SKILL.md`](SKILL.md).

## When to use Growth Scout

Activate when the user asks about:

- What to build next / feature prioritization
- Product growth opportunities or a growth roadmap
- Competitor gaps or market scouting
- Turning an opportunity into a PRD, issues, or validation plan

## What to do

1. Read and follow [`SKILL.md`](SKILL.md) end to end.
2. Use templates in [`templates/`](templates/) for structured output.
3. Consult [`references/`](references/) for scoring, taxonomy, and validation.
4. Label every claim **known**, **inferred**, or **unknown**.
5. If external research tools are unavailable, say so and recommend validation.

## Optional agent setup

Per-agent install paths (Cursor rules, CLAUDE.md snippets, Copilot instructions, etc.): [`integrations/README.md`](integrations/README.md).

Optional MCP competitor scout (any MCP-capable agent): [`integrations/mcp.md`](integrations/mcp.md).

## Examples

See [`examples/`](examples/) for sample Product Scan, Opportunity Report, and Growth PRD outputs.
