# Market Signal Sources

Growth Scout treats market signals as **evidence with strength ratings**, not vibes.

Always record: **claim**, **source**, **date collected**, **strength**, **confidence** (known/inferred/unknown).

---

## Signal strength scale

| Strength | Meaning | How to use in scoring |
|----------|---------|------------------------|
| **Strong** | Direct user/buyer behavior or repeated primary-source evidence | Demand Strength up to 4–5 |
| **Medium** | Multiple aligned weak signals or credible secondary sources | Demand Strength 3–4 |
| **Weak** | Single anecdote, old data, or indirect proxy | Demand Strength 1–2; validate first |
| **Noisy** | Viral thread, competitor marketing, non-ICP complaints | Do not score demand; note as noise |

---

## Internal sources (usually strongest for your product)

| Source | What it tells you | Strength | Collection tips |
|--------|-------------------|----------|-----------------|
| User interviews | Motivations, blockers, willingness to pay | Strong | Tag by workflow stage |
| Support tickets | Recurring pain at scale | Strong | Count theme frequency / quarter |
| Sales calls / win-loss notes | Why deals close or die | Strong | Separate ICP vs bad-fit losses |
| Product analytics | Actual behavior, drop-off points | Strong | Funnel + cohort views |
| Churn surveys | Why users leave | Strong | Link to missing features |
| NPS / CSAT verbatims | Sentiment themes | Medium | Weight by segment |

---

## External sources

| Source | What it tells you | Strength | Noise risk |
|--------|-------------------|----------|------------|
| App store reviews | UX pain, missing features | Medium–Strong | Wrong platform/ICP |
| G2 / Capterra | Category expectations, comparisons | Medium | Incentivized reviews |
| Reddit | Unfiltered frustration, use cases | Medium | Vocal minority |
| Hacker News | Early adopter appetite | Weak–Medium | Not representative |
| Product Hunt | Launch interest | Weak | One-day spike |
| GitHub issues (yours or OSS comps) | Technical friction | Strong (your repo) | Comp issues may differ |
| Competitor changelogs | Strategic direction | Medium | Marketing spin |
| Public roadmaps | Stated bets | Weak–Medium | Aspirational |
| Pricing pages | Packaging expectations | Medium | Promotional |
| Search trends | Category interest over time | Medium | Requires tool access; easy to misread |
| Job postings (competitors) | Where they invest | Weak–Medium | Lagging indicator |
| Forum / Discord communities | Power-user needs | Medium | Community bias |

---

## How to judge conflicting signals

| Situation | Resolution |
|-----------|------------|
| Loud online demand, no internal tickets | **Validate first** — may be wrong ICP |
| Internal tickets, no competitor has feature | **Differentiation** — check strategic fit |
| Competitors all ship X, you lack X | Likely **table-stakes** — confirm with win-loss |
| Trending AI feature, no user asks | **Noisy** — park unless strategic |
| One enterprise request | **Weak** alone — check pattern across accounts |

---

## Tool availability disclaimer

When the agent **cannot** browse, search trends, or fetch live pages:

1. State: *"Market analysis is limited to repository context and materials you provided."*
2. Do not fabricate review quotes, rankings, or trend percentages.
3. Ask the user for links, exports, or screenshots.
4. Cap Demand Strength at **2** for external claims without sources.
5. Recommend specific validation experiments (see `validation-experiments.md`).

---

## Evidence ledger

Log every non-trivial claim in `templates/evidence-ledger-template.md`.

Review staleness:

| Age | Action |
|-----|--------|
| < 90 days | OK for fast-moving SaaS |
| 90–365 days | Note staleness; prefer refresh for competitor/pricing |
| > 12 months | Do not use for Demand Strength above 2 |

---

## Minimum evidence bar by recommendation

| Recommendation | Minimum evidence |
|----------------|------------------|
| Build now | ≥1 strong internal OR ≥2 medium aligned external signals + codebase fit |
| Validate first | Weak/medium mixed OR high product risk |
| Park | Speculative with low strategic fit |
| Ignore | Noise, misfit ICP, or high cost / low leverage |
