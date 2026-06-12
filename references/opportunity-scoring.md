# Opportunity Scoring

Growth Scout ranks feature ideas with a transparent scoring model so recommendations are debatable, not mystical.

---

## Formula

```
Growth Opportunity Score (GOS) =
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

Each factor: **1–5** (integers unless noted).

**Theoretical range:** 7 (all 1s, max penalties) to 35 (all 5s, no penalties).  
**Practical range:** Most serious opportunities land between 18 and 28.

---

## Scoring rubric

### Positive factors

| Score | Demand Strength | Competitor Gap | Strategic Fit | Growth Leverage |
|-------|-----------------|----------------|---------------|-----------------|
| 1 | No evidence; pure guess | Everyone has it done well | Conflicts with positioning | Minimal metric impact |
| 2 | Anecdote or weak signal | Parity feature | Tangential to ICP | Minor lever movement |
| 3 | Multiple weak signals align | Some competitors weak/missing | Fits positioning | Clear single-metric hypothesis |
| 4 | Strong qualitative evidence | Clear gap or frequent complaints | Core to value prop | Multi-step funnel impact |
| 5 | Quant + qual (tickets, churn, win/loss) | Obvious market expectation unmet | Defining capability | Primary growth bottleneck |

| Score | Revenue/Retention Impact | Codebase Feasibility | Time-to-Learn Advantage |
|-------|--------------------------|----------------------|-------------------------|
| 1 | No plausible business effect | Requires rewrite | Months to learn |
| 2 | Nice-to-have | Major new subsystem | Several sprints to signal |
| 3 | Moderate ARPU or retention lift | Some new components | 2–4 week experiment possible |
| 4 | Clear upgrade or churn reduction path | Mostly extends existing patterns | 1–2 week fake door or prototype |
| 5 | Directly tied to pricing/retention KPI | Mostly configuration/wiring | Days to validate |

### Negative factors (subtract)

| Score | Implementation Complexity | Product Risk | Maintenance Burden |
|-------|---------------------------|--------------|---------------------|
| 1 | Trivial change | Negligible UX risk | Set-and-forget |
| 2 | Small feature | Minor confusion possible | Low ongoing cost |
| 3 | Multi-surface feature | Scope/UX creep risk | Regular upkeep |
| 4 | Cross-team, infra-heavy | Could distract core workflow | Dedicated ownership needed |
| 5 | Platform-level rebuild | High chance of harming core UX | Ongoing tax (support, edge cases) |

---

## Evidence caps

When evidence is weak, apply these caps:

| Condition | Rule |
|-----------|------|
| Demand Strength unknown | Cap at **2**; default recommendation **Validate first** |
| No competitor research possible | Cap Competitor Gap at **3** unless table-stakes gap is obvious from product map |
| Codebase not inspected | Cap Codebase Feasibility at **2**; flag in report |
| Stale evidence (>12 months) | Reduce Demand Strength by 1 (min 1); note staleness |

Never inflate scores to justify a preferred idea.

---

## Recommendation thresholds

Use GOS **with** evidence quality — not score alone.

| GOS | Evidence | Typical recommendation |
|-----|----------|------------------------|
| ≥ 26 | Mostly known | **Build now** (MVP) |
| 22–25 | Mixed known/inferred | **Build now** or **Validate first** |
| 18–21 | Weak external evidence | **Validate first** |
| 14–17 | Speculative | **Park** |
| < 14 | Any | **Ignore** unless table-stakes blocker |

Override when:

- **Table-stakes blocker** — Missing capability is losing deals → **Build now** even at moderate GOS
- **High Product Risk** (4–5) — Downgrade to **Validate first** regardless of GOS
- **Strategic misfit** (Strategic Fit ≤ 2) — **Ignore** unless user explicitly wants exploration

---

## Example calculation

**Feature:** Slack notification when a shared report is updated  
**Product:** Fictional analytics SaaS "Chartflow" (team plan growing, retention gap)

| Factor | Score | Notes |
|--------|-------|-------|
| Demand Strength | 4 | 12 support tickets / quarter; inferred from ticket tags (**known**) |
| Competitor Gap | 3 | 2/3 competitors have it; one weak implementation (**inferred** from docs) |
| Strategic Fit | 5 | Core workflow is collaborative reporting (**known**) |
| Growth Leverage | 4 | Primary lever: Retention (**inferred**) |
| Revenue/Retention Impact | 4 | Hypothesis: +5% W4 retention on team plans (**inferred**) |
| Codebase Feasibility | 4 | Webhooks + email infra exist; Slack OAuth stub present (**known**) |
| Time-to-Learn Advantage | 4 | Fake door + beta in ~1 week (**inferred**) |
| Implementation Complexity | 2 | OAuth app + event fanout (**inferred**) |
| Product Risk | 2 | Notification fatigue manageable with defaults (**inferred**) |
| Maintenance Burden | 2 | Standard integration upkeep (**inferred**) |

```
GOS = 4+3+5+4+4+4+4 - 2 - 2 - 2 = 26
```

**Recommendation:** **Build now** (MVP: one notification type, opt-in, team admins only)  
**Success metric:** % of team workspaces with ≥1 Slack connection after 30 days; W4 retention delta on connected vs control.

---

## Reporting format

Include a score table for top opportunities:

| Feature | DS | CG | SF | GL | RR | CF | TTL | IC | PR | MB | **GOS** |
|---------|----|----|----|----|----|----|-----|----|----|-----|---------|
| ... | | | | | | | | | | | |

Legend: DS=Demand Strength, CG=Competitor Gap, SF=Strategic Fit, GL=Growth Leverage, RR=Revenue/Retention Impact, CF=Codebase Feasibility, TTL=Time-to-Learn Advantage, IC=Implementation Complexity, PR=Product Risk, MB=Maintenance Burden.

Always attach evidence notes per row in the narrative section.
