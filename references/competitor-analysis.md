# Competitor Analysis

Growth Scout uses competitor research to find **gaps**, not a shopping list to copy.

---

## Goals

1. Identify **table-stakes** the product is missing
2. Find **differentiation** angles competitors under-serve
3. Surface **competitor weaknesses** users complain about
4. Flag **copy-dangerous** features that look good but misfit positioning
5. Discard **noise** — irrelevant enterprise features, hype, wrong ICP

---

## Research workflow

### 1. Select comparables (3–6)

Choose competitors the **target user actually evaluates**:

| Tier | Who | Purpose |
|------|-----|---------|
| Direct | Same category, same ICP | Feature parity and gaps |
| Adjacent | Overlapping workflow | Substitution threats |
| Aspirational | Larger player | Table-stakes reference |
| Legacy | Incumbent being displaced | Weakness mining |

Document **why** each competitor is included. Avoid analyzing every product in the space.

### 2. Collect evidence (per competitor)

| Source | What to extract |
|--------|-----------------|
| Marketing site | Positioning, ICP, headline promise |
| Pricing page | Model, tiers, limits, enterprise gates |
| Docs | Supported workflows, integrations |
| Changelog / blog | Release velocity, strategic bets |
| Public roadmap | Stated direction (may be marketing) |
| Reviews (G2, Capterra, App Store) | Recurring praise and complaints |
| Forums (Reddit, HN) | Unfiltered user sentiment |
| GitHub issues (if OSS) | Real friction points |

Record **source URL or citation**, **date collected**, and **confidence** in the evidence ledger.

**If browsing is unavailable:** ask the user for links, screenshots, or prior research. Mark all competitor claims **inferred** or **unknown**.

### 3. Build comparison views

#### Feature matrix

Rows = capabilities grouped by workflow stage. Columns = competitors + **your product**.

Use status codes: ✅ Full | ⚠️ Partial | ❌ Missing | ❓ Unknown

Template: `templates/competitor-matrix-template.md`

#### Pricing comparison

| Competitor | Model | Entry price | Team tier | Free tier limits | Notes |
|------------|-------|-------------|-----------|------------------|-------|

Compare **value metric** (seats, usage, projects) not just dollar amounts.

#### Positioning comparison

| Competitor | One-line positioning | Target user | Primary wedge |
|------------|---------------------|-------------|---------------|

#### UX / workflow comparison

Describe **steps to first value**, not screenshot aesthetics:

- Signup → setup → first success: how many steps?
- Opinionated vs flexible?
- Where do users get stuck (from reviews)?

### 4. Track releases over time

For each competitor, note last 3–6 notable releases:

| Date | Release | Implication for us |
|------|---------|-------------------|

Stale changelog reading → flag **staleness risk** on gap analysis.

### 5. Mine reviews systematically

Tag quotes into themes:

| Theme | Frequency | Sentiment | Opportunity type |
|-------|-----------|-----------|------------------|
| Onboarding too complex | High | Negative | Activation |
| Missing integration X | Medium | Negative | Table-stakes / Differentiation |
| Great support | High | Positive | Trust (match or exceed) |

Require **3+ independent mentions** before treating a theme as strong demand signal.

---

## Gap classification

After the matrix, classify each gap:

| Class | Action |
|-------|--------|
| **Table-stakes** | Close if blocking deals or activation |
| **Differentiation opportunity** | Prioritize if fits strategic fit + evidence |
| **Competitor weakness** | Exploit if you can deliver opposite experience |
| **Copy-dangerous** | Do not build without strategic fit ≥ 4 |
| **Ignore / noise** | Deprioritize explicitly in report |

### Copy-dangerous examples

- Enterprise-only features for a prosumer product
- Feature that contradicts your "simple" positioning
- Complex customization competitors need because their core UX is weak
- AI feature with no user evidence (trend-chasing)

---

## Warnings

### Do not blindly copy competitors

| Trap | Why it fails |
|------|--------------|
| Feature parity obsession | You become slower second mover with no wedge |
| Premium complexity | Their complexity may be their weakness |
| Roadmap theater | Public roadmaps ≠ validated demand |
| Review outliers | One viral complaint ≠ market need |
| Different ICP | Their killer feature may not matter to your user |

### Separate evidence from speculation

| Label | Meaning |
|-------|---------|
| **Known** | Directly observed in source material |
| **Inferred** | Reasonable deduction from multiple signals |
| **Unknown** | Not researched; do not score highly |

---

## Output checklist

Competitor Gap Report should include:

- [ ] Competitor set with rationale
- [ ] Feature matrix with confidence column
- [ ] Pricing and positioning snapshots
- [ ] Review themes with quote counts
- [ ] Classified gaps (5 buckets)
- [ ] Top 3 opportunities linked to gaps
- [ ] **What we should NOT copy** section
- [ ] Evidence ledger entries with dates
- [ ] Staleness / research limits disclaimer
