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
