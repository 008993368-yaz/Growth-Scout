---
name: growth-scout
description: >-
  Agent-agnostic skill that recommends what feature a product should build
  next by combining codebase analysis, product context, competitor gaps,
  market signals, growth scoring, and implementation feasibility. Use when the
  user asks what to build next, wants growth opportunities, competitor gap
  analysis, a growth roadmap, market scouting, feature prioritization, or
  turning an opportunity into a PRD or GitHub issues. Works in any coding agent.
---

# Growth Scout

**Tagline:** Scout opportunities before you write code.

Growth Scout is the AI growth strategist that lives inside your codebase and tells your coding agent what to build next.

## Agent-agnostic skill

This file is the **canonical** instruction set. It does not depend on Cursor, Claude, Copilot, or any specific tool.

| Entry | Purpose |
|-------|---------|
| [SKILL.md](SKILL.md) | Full workflow (this file) |
| [AGENTS.md](AGENTS.md) | Short entry for agents that auto-read project instructions |
| [integrations/README.md](integrations/README.md) | Optional setup for Cursor, Claude Code, Codex, Copilot, OpenCode, Aider |

**Minimum usage:** copy SKILL.md plus supporting folders into a product repo and ask the agent to follow it.


## When to activate

Use this skill when the user asks things like:

- "What should I build next?"
- "What feature should we add?"
- "Find product growth opportunities"
- "Analyze competitors and suggest gaps"
- "What is missing from this product?"
- "Create a growth roadmap"
- "Turn this opportunity into a PRD"
- "Prioritize features based on market demand and codebase fit"
- "Scout the market before we build"

## Core question

> What should we build next that has the highest chance of helping this product grow?

## Behavior rules (non-negotiable)

1. **Evidence-first** — Label every claim as **known**, **inferred**, or **unknown**.
2. **No invented market data** — Do not claim demand, competitor behavior, or trends without evidence.
3. **Tool limits** — If browsing/search tools are unavailable, state that external analysis is limited and rely on repo context plus user-provided material.
4. **No trend-chasing** — Do not recommend features only because they are fashionable.
5. **No blind copying** — Competitor features may be table-stakes, differentiation, or noise. Classify before recommending.
6. **MVP bias** — Prefer small experiments that validate growth hypotheses quickly.
7. **Codebase fit** — Prefer recommendations the current architecture can support.
8. **Context gaps** — Flag when the product lacks enough context to recommend confidently.
9. **Stale evidence** — Flag old or missing sources; recommend refresh or validation.
10. **Always include** — A success metric for each recommendation and a **Why not build this** section for top picks.

## Output modes

Pick the mode that matches the request. Use templates from `templates/`:

| Mode | Template | When to use |
|------|----------|-------------|
| Product Scan | `templates/product-map-template.md` | First pass on an unfamiliar repo |
| Competitor Gap Report | `templates/competitor-matrix-template.md` | User names competitors or asks for gaps |
| Market Signal Report | `templates/evidence-ledger-template.md` | User wants demand/trend validation |
| Growth Opportunity Report | `templates/opportunity-report-template.md` | Default for "what to build next" |
| Prioritized Roadmap | `templates/opportunity-report-template.md` | Multi-quarter sequencing |
| Growth PRD | `templates/growth-prd-template.md` | User picks a feature to spec |
| GitHub Issue Breakdown | `templates/github-issues-template.md` | User wants execution tasks |
| Validation Plan | `references/validation-experiments.md` | Weak evidence or high-risk bets |

See realistic outputs in `examples/`.

---

## Workflow

Track progress with this checklist:

```
Growth Scout Progress:
- [ ] Phase 1: Understand the product
- [ ] Phase 2: Map current capabilities
- [ ] Phase 3: Scout external signals
- [ ] Phase 4: Identify opportunities
- [ ] Phase 5: Score opportunities
- [ ] Phase 6: Recommend next features
- [ ] Phase 7: Execution artifacts (if requested)
```

### Phase 1: Understand the product

Read available context in this order:

1. README, docs, changelog, issues/PRs
2. Package manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.)
3. Routes, pages, API endpoints, CLI commands
4. Database schema, migrations, models
5. Tests (what behavior is enforced)
6. Config, env examples, deployment files
7. Auth, billing, analytics, integrations

Extract and record:

| Field | Status (known/inferred/unknown) |
|-------|----------------------------------|
| Product category | |
| Target user | |
| Core workflow | |
| Current features | |
| Monetization model | |
| Maturity stage (idea/MVP/growth/mature) | |
| Constraints (team, stack, compliance) | |

**Output:** Product map using `templates/product-map-template.md`.

Deep guidance: `references/codebase-product-mapping.md`.

### Phase 2: Map current capabilities

Build a feature inventory:

- **Shipped** — In UI, API, or docs as available today
- **Partial** — Stubbed routes, feature flags, TODO comments, unused schema
- **Missing table-stakes** — Expected for this category but absent
- **Technical foundations** — Auth, payments, notifications, jobs, analytics, i18n, etc.

Note what the codebase already makes cheap to build.

### Phase 3: Scout external signals

Research when tools allow. Sources and strength ratings: `references/market-signal-sources.md`.

If the user names a vertical, consult `references/industry-packs/<vertical>.md` (e.g. `b2b-saas`, `developer-tools`, `consumer-mobile`).

**If live browsing is unavailable:** use only repo context and user-provided links/docs. Mark all external claims as **inferred** or **unknown**. Recommend validation before building.

**Never invent competitor evidence.**

**Work-item demand signals (MCP, ask-first):** When MCP is connected and the user wants issue-tracker demand evidence:

1. Call `preview_work_item_mine` first — show scope summary to the user (metadata/count only).
2. Wait for explicit approval ("Yes, proceed"), a file path (`.growth-scout/work-items.json`), or skip.
3. Only then call `mine_work_item_signals` with `preview_id` + `confirmed: true`.
4. Never auto-detect provider from git remote without user confirmation.
5. If user declines → use manual evidence only; cap **Demand Strength** per rubric.
6. Never mine during bootstrap install (`install-growth-scout.mjs`).

See [`integrations/mcp.md`](integrations/mcp.md) for the full ask-first flow.

For competitor research, organize findings into:

| Bucket | Meaning |
|--------|---------|
| Table-stakes | Users expect it; absence hurts conversion/retention |
| Differentiation | Meaningful gap you could own |
| Competitor weaknesses | Pain points users complain about elsewhere |
| Copy-dangerous | Looks good on a matrix but wrong for your positioning |
| Ignore/noise | Hype, enterprise-only, or irrelevant to your ICP |

Method: `references/competitor-analysis.md`.

Maintain an evidence ledger: `templates/evidence-ledger-template.md`.

### Phase 4: Identify opportunities

Generate candidate features across growth levers. Taxonomy: `references/growth-taxonomy.md`.

| Lever | Example opportunity types |
|-------|---------------------------|
| Acquisition | SEO pages, integrations marketplace, free tier hook |
| Activation | Onboarding checklist, templates, time-to-value shortcuts |
| Retention | Notifications, saved state, habit loops |
| Revenue | Usage limits, seat billing, premium tiers |
| Referral | Invite credits, shared workspaces |
| Expansion | Team features, API, admin controls |
| Trust | SSO, audit logs, status page, export |
| Differentiation | Unique workflow, vertical focus |
| Table-stakes | Missing baseline capability |
| Operational efficiency | Admin tools, support deflection |

Aim for 8–15 raw ideas before scoring. Merge duplicates.

### Phase 5: Score opportunities

Use the Growth Opportunity Score model. Full rubric: `references/opportunity-scoring.md`. Recommendation bands (Build now, Validate first, Park, Ignore): see the **Recommendation thresholds** table in that file.

```
Growth Opportunity Score =
  Demand Strength
+ Competitor Gap
+ Strategic Fit
+ Growth Leverage
+ Revenue/Retention Impact
+ Codebase Feasibility
+ Time-to-Learn Advantage
- Implementation Complexity
- Product Risk
- Maintenance Burden
```

Score each factor **1–5** unless the user specifies otherwise.

| Factor | Definition |
|--------|------------|
| Demand Strength | Evidence users want this |
| Competitor Gap | Competitors lack it, do it poorly, or users expect it |
| Strategic Fit | Matches positioning and ICP |
| Growth Leverage | Improves acquisition, activation, retention, revenue, referral, or expansion |
| Revenue/Retention Impact | Likely business impact |
| Codebase Feasibility | Current architecture supports it |
| Time-to-Learn Advantage | Speed to validate the hypothesis |
| Implementation Complexity | Engineering cost (subtract) |
| Product Risk | UX confusion, scope creep, distraction (subtract) |
| Maintenance Burden | Long-term cost (subtract) |

When evidence is weak, cap **Demand Strength** at 2 and recommend **validate first**.

### Phase 6: Recommend next features

Output **3–7 ranked opportunities**. For each include:

- Feature name
- Growth lever
- Problem
- Target user
- Evidence (with confidence)
- Competitor insight
- Why now
- MVP scope
- Codebase fit
- Estimated effort (S/M/L)
- Risks
- Success metric
- Suggested validation
- **Recommendation:** Build now | Validate first | Park | Ignore

**Required sections in the report:**

1. Executive summary (top pick + runner-up)
2. Ranked opportunities table with scores
3. Score breakdown for top 3
4. Evidence summary (known vs inferred vs unknown)
5. **Why not build this** for top 2–3 recommendations
6. Validation plan for anything not "Build now"

Template: `templates/opportunity-report-template.md`.

### Large repository mode

Use this **multi-turn** sequence when the codebase is too large to read in one pass (monorepos, >~50k LOC, or context limits). Do not attempt all phases in a single turn.

| Turn | Scope | Output |
|------|-------|--------|
| **1** | Phases 1–2 only | Product Scan + capability map (`templates/product-map-template.md`). No scoring yet. |
| **2** | Phase 3 + Phase 4 (light) | External signals summary + opportunity **longlist** (8–15 titles with one-line problem statements). No full GOS tables. |
| **3** | Phase 5–6 (top 5) | Full GOS scoring and ranking for **top 5** longlist items only. |
| **4** | Phase 7 on demand | Deep dive on **#1** only; PRD / GitHub issues **only if the user requests**. |

Between turns, carry forward the product map and longlist as context. Flag **unknown** where the repo was not re-read. Recommend running `node scripts/repo-inventory.mjs` on the product repo when Phase 1 needs a fast skeleton (tooling ships with the Growth Scout package).

### Phase 7: Turn selected opportunity into execution artifacts

When the user selects a feature, produce as requested:

| Artifact | Template / reference |
|----------|---------------------|
| Growth PRD | `templates/growth-prd-template.md` |
| GitHub issue breakdown | `templates/github-issues-template.md` |
| Technical implementation plan | Inline in PRD or separate section referencing repo patterns |
| Test plan | Acceptance criteria + regression areas |
| Launch checklist | Rollout plan section in PRD |
| Metrics plan | Success metrics + event names if analytics exist |
| Validation experiment | `references/validation-experiments.md` |

Example PRD: `examples/example-growth-prd.md`.

---

## Quick reference

| Topic | File |
|-------|------|
| Growth levers | `references/growth-taxonomy.md` |
| Scoring rubric | `references/opportunity-scoring.md` |
| Competitor method | `references/competitor-analysis.md` |
| Signal sources | `references/market-signal-sources.md` |
| Industry packs | `references/industry-packs/` (`b2b-saas`, `developer-tools`, `consumer-mobile`) |
| Codebase mapping | `references/codebase-product-mapping.md` |
| Validation options | `references/validation-experiments.md` |
| Optional MCP scout | `integrations/mcp.md` — competitor + work-item tools (`mcp/growth-scout-mcp/`) |
| Product scan example | `examples/example-product-scan.md` |
| Opportunity report example | `examples/example-opportunity-report.md` |

## Minimum viable run (time-boxed)

If the user wants a fast answer:

1. Skim README + routes + package file (5 min equivalent)
2. List top 5 existing features + 3 obvious gaps
3. Score 3–5 ideas with explicit unknowns
4. Recommend one **Build now** and one **Validate first**

Still include success metrics and evidence labels.
