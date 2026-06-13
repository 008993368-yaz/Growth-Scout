# Integration verification prompts

Copy-paste these into your agent after installing Growth Scout in a **product** repo (or this repo for a meta smoke test). Expected artifacts are labeled **known** from the skill workflow.

---

## Cursor

**Setup:** Copy skill files per [`integrations/cursor.md`](cursor.md) or prompt with `@SKILL.md`.

**Prompt:**

```
Follow Growth Scout (SKILL.md). Run Phase 1–2 only: product scan and capability map.
Use templates/product-map-template.md. Label unknowns.
```

**Expected artifacts:**

- Product map markdown with evidence labels (**known** / **inferred** / **unknown**)
- Feature inventory (shipped / partial / missing table-stakes)
- No invented competitor demand

**Second prompt (optional):**

```
Continue Growth Scout Phase 5–6 for the top 3 opportunities only.
Use references/opportunity-scoring.md thresholds. Include Why not build this for #1.
```

**Expected:** Ranked opportunity table with GOS breakdown; recommendation band from threshold table.

---

## Claude Code

**Setup:** `AGENTS.md` at repo root; see [`integrations/claude-code.md`](claude-code.md).

**Prompt:**

```
Read AGENTS.md and SKILL.md. What should we build next?
Default to templates/opportunity-report-template.md.
```

**Expected artifacts:**

- Growth Opportunity Report structure
- Executive summary + ranked table + validation plan for non–Build now items
- Explicit note if browsing/tools unavailable (**known** limitation)

---

## OpenAI Codex (CLI)

**Setup:** `AGENTS.md` in repo root; see [`integrations/codex.md`](codex.md).

**Prompt:**

```
Follow Growth Scout in SKILL.md. Minimum viable run only.
Recommend one Build now and one Validate first with success metrics.
```

**Expected artifacts:**

- Short ranked list (3–5 ideas)
- Evidence labels on every external claim
- One **Build now** and one **Validate first** with metrics

---

## Large repo mode (any agent)

**Prompt:**

```
Follow Growth Scout Large repository mode in SKILL.md.
Turn 1 only: Product Scan + capability map (Phases 1–2).
```

**Expected:** Stops after Phase 2; does not score full longlist or write a PRD unless asked.

---

## Tooling smoke test (this package repo)

```bash
node scripts/validate-links.mjs
node scripts/repo-inventory.mjs .
```

**Expected:** Link check passes; stdout contains a product map draft with **inferred** labels for detected folders (`templates/`, `references/`, etc.).

---

## Bootstrap install smoke test

Run from the Growth Scout package root against a temporary product repo:

```bash
mkdir -p /tmp/gs-test-app && echo "# Test" > /tmp/gs-test-app/README.md
node scripts/install-growth-scout.mjs /tmp/gs-test-app --layout root
test -f /tmp/gs-test-app/SKILL.md
test -f /tmp/gs-test-app/.growth-scout/product-map-draft.md
node scripts/install-growth-scout.mjs /tmp/gs-test-app   # should fail without --force
node scripts/install-growth-scout.mjs /tmp/gs-test-app --force
```

On Windows, use `$env:TEMP\\gs-test-app` instead of `/tmp/gs-test-app`.

**Expected:** Skill files at repo root; draft map under `.growth-scout/` with an install header line; second install exits 1 until `--force`.

---

## MCP Growth Scout (any MCP client)

**Setup:** Build and configure the stdio server per [`integrations/mcp.md`](mcp.md).

**Competitor scout prompt:**

```
Follow Growth Scout (SKILL.md). With Growth Scout MCP connected,
run scout_competitors for category "collaborative analytics" with competitors:
[Comp A, Comp B, Comp C]. Review the draft matrix, classify gaps, and add evidence ledger rows.
Do not score GOS until gaps are classified.
```

**Expected artifacts:**

- Draft competitor matrix markdown (not a final opportunity report)
- Evidence rows with **known** / **inferred** / **unknown** confidence
- Classified gaps section left for agent completion
- Explicit research limits when fetch or search fails

**Work-item signal prompt (ask-first):**

```
Follow Growth Scout (SKILL.md). With Growth Scout MCP connected,
run preview_work_item_mine for provider file with file_path .growth-scout/work-items.json.
Show me the scope summary and wait for my approval before mining.
```

After user approves:

```
Run mine_work_item_signals with the preview_id and confirmed: true.
Classify theme clusters before scoring Demand Strength.
```

**Expected artifacts:**

- Preview output with `preview_id`, scope summary, estimated item count (no issue bodies)
- After confirmation: normalized signals JSON, theme clusters, evidence ledger markdown
- Rejection if `confirmed` is not `true` or preview expired
