# Agent integrations

Growth Scout is **agent-agnostic**. The skill itself is [`SKILL.md`](../SKILL.md). This folder shows optional ways to wire it into specific tools.

## Universal method (all agents)

Copy into your **product** repository:

```
SKILL.md
references/
templates/
examples/
AGENTS.md          # optional; many agents auto-read this
```

Then prompt:

> Follow Growth Scout in SKILL.md. [Your question]

---

## Integration matrix

| Agent | Recommended setup | Auto-load? |
|-------|-------------------|------------|
| **Any agent** | Point at `SKILL.md` in prompt | Manual |
| **Cursor** | Copy to `.cursor/skills/growth-scout/` or reference from project root | Skill + optional rule |
| **Claude Code** | Add `AGENTS.md` or `@SKILL.md` in project; see [claude-code.md](claude-code.md) | Often reads AGENTS.md |
| **OpenAI Codex** | Add `AGENTS.md` to repo root; see [codex.md](codex.md) | Reads AGENTS.md in CLI |
| **GitHub Copilot** | Copilot instructions file; see [github-copilot.md](github-copilot.md) | Workspace instructions |
| **OpenCode** | Project instructions referencing SKILL.md; see [opencode.md](opencode.md) | Varies |
| **Aider** | `.aider.conf.yml` or `--read SKILL.md`; see [aider.md](aider.md) | On launch flags |

---

## Files in this folder

| File | Purpose |
|------|---------|
| [cursor.md](cursor.md) | Cursor skills + optional rule |
| [claude-code.md](claude-code.md) | CLAUDE.md / slash commands |
| [codex.md](codex.md) | Codex CLI + AGENTS.md |
| [github-copilot.md](github-copilot.md) | Copilot workspace instructions |
| [opencode.md](opencode.md) | OpenCode project config |
| [aider.md](aider.md) | Aider read files / config |

None of these are required. **`SKILL.md` alone is sufficient** if your agent can read it when asked.
