# Claude Code integration (optional)

## Option A: AGENTS.md / CLAUDE.md

Add to your product repo root (or merge into existing file):

```markdown
When the user asks what to build next, growth opportunities, competitor gaps, or growth PRDs,
read and follow SKILL.md (Growth Scout) in this repository.
```

This package includes [`AGENTS.md`](../AGENTS.md) for that purpose.

## Option B: Explicit invocation

> Read @SKILL.md and run a Growth Scout product scan on this repo.

## Option C: Submodule or copy

Vendor this repo or copy `SKILL.md` plus supporting folders into your product project.

## Option D: MCP competitor scout (optional)

If your Claude Code setup supports MCP, connect the Growth Scout Competitor MCP using the same stdio server as other clients. See [`integrations/mcp.md`](mcp.md#claude-code).
