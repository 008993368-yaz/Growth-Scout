# Growth Scout Competitor MCP

Optional **stdio MCP server** for Phase 3 competitor scouting. Works with any MCP-capable agent (Cursor, Claude Desktop, Claude Code, Windsurf, Zed, etc.).

Given a product category and 3–6 competitor names, it discovers URLs, fetches public pages, and returns a **draft competitor matrix** plus evidence ledger rows.

The MCP returns drafts only. Your agent must review URL resolution, classify gaps, and score opportunities per [`SKILL.md`](../SKILL.md).

**Connect from your agent:** [`integrations/mcp.md`](../integrations/mcp.md) — build steps, usage rules, and per-client config examples.

## Prerequisites

- Node.js 20+
- For full auto-scout (`scout_competitors` without explicit URLs): a search API key
  - [Brave Search API](https://brave.com/search/api/) → `BRAVE_SEARCH_API_KEY`
  - Or [Serper](https://serper.dev/) → `SERPER_API_KEY` and `GROWTH_SCOUT_SEARCH_PROVIDER=serper`

## Install and build

```bash
cd mcp/growth-scout-competitor
npm install
npm run build
npm test
```

**Server entry:**

```bash
node dist/index.js
```

Transport: **stdio** (standard MCP local process).

## Example prompt

Agent-neutral — use in any MCP-connected client:

```
Follow Growth Scout (SKILL.md). Use scout_competitors for category "collaborative analytics"
with competitors: Metabase, Looker, Mode. Review the draft matrix, classify gaps, and recommend what to build next.
```

## Tools

### `scout_competitors` (primary)

End-to-end scout: category + competitor names → draft matrix markdown + JSON.

| Input | Required | Description |
|-------|----------|-------------|
| `product_category` | yes | e.g. `collaborative analytics`, `developer CI` |
| `competitor_names` | yes | 3–6 names (user/agent selects comparables) |
| `your_product_name` | no | Matrix column label (default: `Us`) |
| `your_product_url` | no | Snapshot your product for the matrix |
| `capability_rows` | no | Custom matrix rows |
| `competitor_urls` | no | Map name → URL to skip search resolution |

**Without a search API key:** pass `competitor_urls` or use `competitor_snapshot` directly.

### `fetch_page`

Fetch one public URL → extracted text with `known` / `inferred` / `unknown` metadata.

### `competitor_snapshot`

Fetch common paths for one domain: `/`, `/pricing`, `/features`, `/changelog`, `/docs`.

### `search_competitor_pages`

Search for candidate pages. Results are **inferred** suggestions — verify with `fetch_page` before scoring.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `BRAVE_SEARCH_API_KEY` | — | Brave Search API key |
| `SERPER_API_KEY` | — | Serper API key (alternative) |
| `GROWTH_SCOUT_SEARCH_PROVIDER` | `brave` | `brave` or `serper` |

## Safety and limits

- Only `http`/`https`; blocks private IPs and localhost (SSRF guard)
- 10s timeout, 1.5 MB response cap per page
- Max 6 competitors, 3 concurrent fetches
- Does not bypass login, paywalls, or CAPTCHAs
- Does not scrape G2/Capterra (often blocked)
- Does not score GOS or invent market demand
- Failed fetches → matrix cells marked **Unknown**

## Output alignment

Draft matrix follows [`templates/competitor-matrix-template.md`](../templates/competitor-matrix-template.md).
Evidence rows follow [`templates/evidence-ledger-template.md`](../templates/evidence-ledger-template.md).

Method reference: [`references/competitor-analysis.md`](../references/competitor-analysis.md).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `missing_search_api_key` | Set `BRAVE_SEARCH_API_KEY` or pass `competitor_urls` |
| HTTP 403 on fetch | Site blocks bots; ask user for a link or paste |
| Wrong competitor URL | Review `url_candidates` in output; override with `competitor_urls` |
| Many Unknown cells | Normal for partial fetch failures; validate before scoring |

## License

MIT — same as Growth Scout.
