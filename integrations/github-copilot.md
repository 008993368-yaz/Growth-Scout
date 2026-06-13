# GitHub Copilot integration (optional)

## Copilot workspace instructions

In VS Code or GitHub Copilot, add workspace instructions (.github/copilot-instructions.md or Copilot Settings > Instructions):

```markdown
# Growth Scout

For product growth, feature prioritization, competitor gaps, or what to build next questions:
1. Read SKILL.md in this repository
2. Follow the seven-phase Growth Scout workflow
3. Label evidence as known, inferred, or unknown
4. Use templates/ for output structure
```

## Prompt example

> Using Growth Scout (SKILL.md), rank the top 5 growth opportunities for this codebase.

## Optional MCP

If your Copilot environment supports MCP servers, connect the Growth Scout Competitor MCP per [`integrations/mcp.md`](mcp.md). Otherwise use SKILL.md with repo context and user-provided links — no MCP required.
