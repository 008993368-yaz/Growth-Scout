# Industry pack: B2B SaaS

Vertical heuristics for Growth Scout Phase 3 (external signals) and competitor bucketing. **inferred** — general patterns from common B2B SaaS practice; validate against your ICP and repo context.

---

## When to use

Use this pack when the product is **sold to teams or businesses** (subscription or usage-based), buyers compare vendors, and deals involve procurement, security review, or multi-seat rollout.

Signals that you are in this vertical (**inferred**):

- Pricing is per seat, per workspace, or tiered by usage/limits
- Buyer personas include admin, IT, finance, or team lead — not only individual consumers
- Onboarding spans invite flows, SSO, or org-level settings

If the user names **b2b-saas**, **B2B**, or **team/workplace SaaS**, consult this file during Phase 3.

---

## Signal sources

Start with the strength-rated catalog in [`references/market-signal-sources.md`](../market-signal-sources.md). For B2B SaaS, prioritize:

| Source | Why it matters here | Typical strength |
|--------|---------------------|------------------|
| Win/loss and sales notes | Direct buyer objections | Strong (**known** if you have CRM notes) |
| Support tickets (billing, seats, permissions) | Table-stakes and expansion friction | Strong |
| Churn / exit surveys | Retention and missing capabilities | Strong |
| G2 / Capterra / review sites | Category expectations | Medium |
| Competitor pricing pages | Packaging and enterprise gates | Medium |
| Job postings (competitors) | Where incumbents invest | Weak–Medium |

Do not treat competitor marketing copy as demand proof. Cap external claims at **Demand Strength 2** without primary validation (**known** from `market-signal-sources.md`).

---

## Common table-stakes gaps

Features buyers often expect before shortlisting (**inferred** — confirm per category):

| Gap area | Why it blocks deals or renewals |
|----------|----------------------------------|
| SSO / SAML / OIDC | Security review stall |
| Role-based access (RBAC) | Team rollout without shadow IT |
| Audit logs | Compliance and enterprise procurement |
| Admin console (users, billing, usage) | IT and finance ownership |
| Data export / portability | Churn fear and legal ask |
| SLA or status page | Operational trust |
| Invoice / PO / tax fields | Finance-led buyers |
| Onboarding for multi-seat | Time-to-value for teams |

Missing any of these may be **table-stakes** even if your MVP shipped without them.

---

## Example competitor buckets

Organize findings using Phase 3 buckets in `SKILL.md`. Examples below are **illustrative patterns**, not claims about any vendor.

### Table-stakes

| Pattern | Example signal |
|---------|----------------|
| Incumbents all list SSO on pricing or security pages | **inferred** category norm |
| Reviews mention "can't invite teammates" or "no admin" | **known** if quoted from a cited review |
| Your sales loses on "we need SOC 2" | **known** if from internal win/loss |

### Differentiation

| Pattern | Example signal |
|---------|----------------|
| Vertical workflow (e.g. agency vs generic PM) competitors do not match | **inferred** positioning angle |
| Faster time-to-value for a specific ICP vs bloated suites | **inferred** until validated in interviews |

### Competitor weaknesses

| Pattern | Example signal |
|---------|----------------|
| Recurring review theme: complex pricing, surprise overages | **known** with source URL and date |
| Support complaints about slow enterprise support | **known** with source; **unknown** prevalence |

### Copy-dangerous

| Pattern | Why not to copy blindly |
|---------|-------------------------|
| Enterprise-only modules (data residency, custom contracts) | **inferred** — may not match your stage or ICP |
| "Unlimited" tiers competitors subsidize | **unknown** unit economics for you |
| AI feature parity because competitors launched a copilot | **inferred** — often marketing-led, weak user evidence |

---

## Churn drivers (scoring hints)

Use for Retention / Revenue levers in Phase 4 (**inferred** themes — label evidence per row):

| Driver | What to look for | Evidence label |
|--------|------------------|----------------|
| Seat shrinkage after pilot | Usage or admin metrics flat | **known** if in your analytics |
| Missing integration with stack (CRM, Slack, etc.) | Support tags, churn verbatims | **known** / **inferred** |
| Price vs value at renewal | Win/loss on downgrade | **known** if recorded |
| Champion left company | CRM or CS notes | **known** |
| Bought for one feature; rest unused | Product analytics | **known** |

Do not invent churn rates or percentages.

---

## Pricing signals (packaging, not numbers)

Observe **structure**, not fabricated benchmarks (**inferred** heuristics):

| Signal | What it suggests |
|--------|------------------|
| Free tier with hard seat or usage caps | PLG with expansion revenue |
| "Contact sales" for SSO or audit | Enterprise table-stakes behind sales |
| Annual discount prominently shown | Cash flow and retention focus |
| Per-seat vs per-workspace | Buyer mental model for expansion |

Compare competitors' **gates** (what requires upgrade), not list prices you cannot verify.

---

## Evidence labeling reminders

Every claim in an opportunity report must be tagged:

| Label | Use when |
|-------|----------|
| **known** | Directly observed in repo, user input, or cited primary source with date |
| **inferred** | Reasonable deduction from patterns in this pack or multiple weak signals |
| **unknown** | Suspected but not researched; do not score Demand Strength above 2 |

Record claim, source, date, strength, and confidence in `templates/evidence-ledger-template.md`.

---

## Related references

- [`references/market-signal-sources.md`](../market-signal-sources.md) — full signal catalog
- [`references/competitor-analysis.md`](../competitor-analysis.md) — research workflow and gap classification
- [`references/growth-taxonomy.md`](../growth-taxonomy.md) — growth levers (Trust, Expansion, Revenue)
