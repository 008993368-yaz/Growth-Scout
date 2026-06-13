# Growth Scout MCP

Optional **stdio MCP server** for Phase 3 external scouting: **competitor research** and **work-item demand signals**. Works with any MCP-capable agent (Cursor, Claude Desktop, Claude Code, Windsurf, Zed, etc.).

Given a product category and 3–6 competitor names, it discovers URLs, fetches public pages, and returns a **draft competitor matrix** plus evidence ledger rows.

For demand signals, it mines issue tracker data (GitHub or file export) with **ask-first** consent gates — preview scope, get user approval, then fetch.

The MCP returns drafts only. Your agent must review outputs, classify gaps/themes, and score opportunities per [`SKILL.md`](../SKILL.md).

**Connect from your agent:** [`integrations/mcp.md`](../integrations/mcp.md) — build steps, usage rules, and per-client config examples.

## Prerequisites

- Node.js 20+
- For full auto-scout (`scout_competitors` without explicit URLs): a search API key
  - [Brave Search API](https://brave.com/search/api/) → `BRAVE_SEARCH_API_KEY`
  - Or [Serper](https://serper.dev/) → `SERPER_API_KEY` and `GROWTH_SCOUT_SEARCH_PROVIDER=serper`
- For GitHub work-item mining: read-only `GITHUB_TOKEN` (or use the file provider)

## Install and build

```bash
cd mcp/growth-scout-mcp
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

### Competitor scouting

#### `scout_competitors` (primary)

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

#### `fetch_page`

Fetch one public URL → extracted text with `known` / `inferred` / `unknown` metadata.

#### `competitor_snapshot`

Fetch common paths for one domain: `/`, `/pricing`, `/features`, `/changelog`, `/docs`.

#### `search_competitor_pages`

Search for candidate pages. Results are **inferred** suggestions — verify with `fetch_page` before scoring.

### Work-item demand signals (ask-first)

#### `preview_work_item_mine` (always call first)

Show scope summary and estimated item count. **No issue bodies** in preview. Returns `preview_id` for consent-gated mining.

| Input | Required | Description |
|-------|----------|-------------|
| `provider` | yes | `github` \| `file` (v1); `gitlab` \| `linear` → `not_implemented` |
| `repo` | github | `owner/repo` |
| `file_path` | file | JSON path (default: `.growth-scout/work-items.json`) |
| `labels` | no | Filter by labels |
| `state` | no | `open` \| `closed` \| `all` (default `open`) |
| `limit` | no | Default 25, max 100 |
| `since` | no | ISO date filter |
| `include_body` | no | Default `false` in preview |

#### `mine_work_item_signals` (hard gate)

Fetch normalized demand signals after explicit user approval.

| Input | Required | Description |
|-------|----------|-------------|
| `preview_id` | yes | From recent preview |
| `confirmed` | yes | Must be `true` |
| `user_consent_note` | no | Optional user quote |

**Rejection codes:** `user_confirmation_required`, `preview_expired_or_invalid`.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `BRAVE_SEARCH_API_KEY` | — | Brave Search API key |
| `SERPER_API_KEY` | — | Serper API key (alternative) |
| `GROWTH_SCOUT_SEARCH_PROVIDER` | `brave` | `brave` or `serper` |
| `GITHUB_TOKEN` | — | Read-only token for GitHub Issues API |
| `GROWTH_SCOUT_WORK_ITEM_PROVIDER` | — | Default provider if not passed in tool args |
| `GROWTH_SCOUT_PRODUCT_ROOT` | `cwd` | Product repo root for file provider path validation |

### GitHub token scopes

Use a **read-only** personal access token or fine-grained token with:

- **Classic:** `public_repo` (public repos) or `repo` (private repos)
- **Fine-grained:** Issues → Read-only on target repository

Never commit tokens. Set via MCP client env config only.

## Safety and limits

- Only `http`/`https` for page fetch; blocks private IPs and localhost (SSRF guard)
- 10s timeout, 1.5 MB response cap per page
- Max 6 competitors, 3 concurrent fetches
- Work-item mining requires preview + `confirmed: true` — no single-shot mine
- Default `limit: 25`, `include_body: false`
- File provider rejects paths outside product repo root (no `../` traversal)
- Preview store is in-memory with ~15 min TTL; no persistence of issue content
- Does not bypass login, paywalls, or CAPTCHAs
- Does not score GOS or invent market demand
- Failed fetches → partial result + `research_limit`; never invent demand

## Output alignment

Draft matrix follows [`templates/competitor-matrix-template.md`](../templates/competitor-matrix-template.md).
Evidence rows follow [`templates/evidence-ledger-template.md`](../templates/evidence-ledger-template.md).
File export format: [`templates/work-items-export-template.json`](../templates/work-items-export-template.json).

Method reference: [`references/competitor-analysis.md`](../references/competitor-analysis.md).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `missing_search_api_key` | Set `BRAVE_SEARCH_API_KEY` or pass `competitor_urls` |
| `missing_github_token` | Set `GITHUB_TOKEN` or use file provider |
| `user_confirmation_required` | Run preview first; get user approval; pass `confirmed: true` |
| `preview_expired_or_invalid` | Re-run `preview_work_item_mine` (TTL ~15 min) |
| `not_implemented` (gitlab/linear) | Export to `.growth-scout/work-items.json` and use file provider |
| HTTP 403 on fetch | Site blocks bots; ask user for a link or paste |
| Wrong competitor URL | Review `url_candidates` in output; override with `competitor_urls` |
| Many Unknown cells | Normal for partial fetch failures; validate before scoring |

## License

MIT — same as Growth Scout.
