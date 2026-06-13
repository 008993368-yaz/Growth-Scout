# MCP integration (optional, any agent)

Growth Scout includes an **optional** MCP server for Phase 3 competitor scouting. It works with **any agent or IDE that supports the [Model Context Protocol](https://modelcontextprotocol.io)** over stdio — Cursor, Claude Desktop, Claude Code, Windsurf, Zed, and others.

The skill itself remains agent-agnostic: **`SKILL.md` works without MCP.** MCP only adds automated page fetch and draft matrix output when you connect the server.

Server reference (tools, env vars, safety): [`mcp/README.md`](../mcp/README.md).

---

## Build once (all agents)

```bash
cd path/to/Growth-Scout/mcp/growth-scout-competitor
npm install
npm run build
npm test
```

**Server entry (stdio):**

```text
node /absolute/path/to/Growth-Scout/mcp/growth-scout-competitor/dist/index.js
```

**Optional env** (required for full auto-scout without explicit URLs):

| Variable | Purpose |
|----------|---------|
| `BRAVE_SEARCH_API_KEY` | Brave Search API (default provider) |
| `SERPER_API_KEY` | Serper alternative |
| `GROWTH_SCOUT_SEARCH_PROVIDER` | `brave` (default) or `serper` |

---

## Usage rules (all agents)

When the Growth Scout Competitor MCP is connected:

1. Call **`scout_competitors`** with user-approved competitor names (3–6) and `product_category`.
2. Treat output as a **draft** — review URL resolution before scoring.
3. Classify gaps (table-stakes / differentiation / weakness / copy-dangerous / noise) per [`references/competitor-analysis.md`](../references/competitor-analysis.md).
4. Populate the evidence ledger from MCP `source_url` + `fetched_at`.
5. Never promote search snippets to **known** without a successful `fetch_page`.
6. Cap **Demand Strength** when matrix cells are Unknown or confidence is inferred-only.
7. MCP does **not** replace GOS scoring or validation experiments.

**Example prompt (agent-neutral):**

```
Follow Growth Scout (SKILL.md). Use scout_competitors for category "collaborative analytics"
with competitors: Metabase, Looker, Mode. Review the draft matrix, classify gaps, and recommend what to build next.
```

Without a search API key, pass `competitor_urls` to `scout_competitors` or use `competitor_snapshot` for known domains.

---

## Client configuration

All clients below use the same **command + args + env** pattern. Adjust paths to your install location.

### Cursor

Project file: `.cursor/mcp.json` in your product repo.

```json
{
  "mcpServers": {
    "growth-scout-competitor": {
      "command": "node",
      "args": ["/absolute/path/to/Growth-Scout/mcp/growth-scout-competitor/dist/index.js"],
      "env": {
        "BRAVE_SEARCH_API_KEY": "your-key"
      }
    }
  }
}
```

Restart Cursor after saving. See also [`cursor.md`](cursor.md).

### Claude Desktop

User config (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`  
User config (Windows): `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "growth-scout-competitor": {
      "command": "node",
      "args": ["/absolute/path/to/Growth-Scout/mcp/growth-scout-competitor/dist/index.js"],
      "env": {
        "BRAVE_SEARCH_API_KEY": "your-key"
      }
    }
  }
}
```

Restart Claude Desktop.

### Claude Code

Add the same `mcpServers` block to your Claude Code MCP settings (user or project scope, depending on your setup). Project-level MCP config file names vary by version — use your client's **Add MCP server** UI or docs, with the command and args above.

See also [`claude-code.md`](claude-code.md) for skill wiring.

### Other MCP clients (Windsurf, Zed, etc.)

Use your client's MCP server configuration with:

| Field | Value |
|-------|--------|
| Transport | stdio |
| Command | `node` |
| Args | `["/absolute/path/to/.../dist/index.js"]` |
| Env | `BRAVE_SEARCH_API_KEY` or `SERPER_API_KEY` as needed |

Consult your client's MCP documentation for the config file location.

### Agents without MCP support

If your agent cannot connect MCP servers, Growth Scout still works:

- Use repo context and user-provided competitor links
- Run [`scripts/repo-inventory.mjs`](../scripts/repo-inventory.mjs) for Phase 1
- Mark external claims **inferred** or **unknown** per `SKILL.md`

No MCP is required for Codex, Aider, or Copilot unless those tools add MCP in your environment.

---

## Verification

Copy-paste prompt and expected artifacts: [`VERIFICATION.md`](VERIFICATION.md#mcp-competitor-scout-any-mcp-client).
