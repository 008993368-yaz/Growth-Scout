# Example Product Scan

> **Fictional product:** Chartflow — collaborative analytics for startup ops teams  
> **Mode:** Product Scan | **Date:** 2026-06-01  
> **Note:** Illustrative only; not a real company.

## Product summary

| Field | Value | Confidence |
|-------|-------|------------|
| One-line description | Shared dashboards and alerts for startup KPIs | known |
| Category | B2B SaaS analytics / BI-lite | inferred |
| Primary job-to-be-done | Keep leadership aligned on metrics without exporting spreadsheets | inferred |

## Target users

| Persona | Role | Pain | Why they choose us |
|---------|------|------|-------------------|
| Ops lead | First ops hire at Series A | Builds dashboards in Sheets; brittle | Faster shared views |
| Founder | CEO | Wants weekly metrics email | Simple setup |
| RevOps | Sales ops | Needs pipeline + product metrics together | Single workspace |

## Core workflow

1. Connect data source (Postgres or Stripe)
2. Pick metric template (MRR, activation, pipeline)
3. Share dashboard link with team
4. Set threshold alert (email)

**Time to first value (estimate):** 30–45 minutes if data source ready

## Current features (from fictional codebase)

| Feature | Status | Evidence |
|---------|--------|----------|
| Postgres connector | shipped | integrations/postgres/ |
| Stripe revenue charts | shipped | charts/stripe_mrr.ts |
| Shared dashboard links | shipped | routes/d/[id] |
| Email alerts | shipped | jobs/alert_evaluator.ts |
| Slack notifications | partial | OAuth stub, no event fanout |
| Team roles | partial | Schema exists, UI hidden |
| CSV export | missing | — |
| SSO | missing | — |

## Missing features

| Gap | Type | Evidence |
|-----|------|----------|
| Slack alerts | table-stakes for team plans | 12 support tickets/quarter (known, fictional) |
| Read-only guest access | activation | Competitor parity (inferred) |
| Dashboard templates gallery | activation | Empty state after signup (known from UX review) |

## Monetization model

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 1 dashboard, 1 connector |
| Team | $49/mo | 10 dashboards, 3 seats |
| Growth | $149/mo | Unlimited dashboards, 10 seats |

## Growth stage

**MVP → early growth:** paying teams, weak retention on team tier.

## Technical foundations

- Auth (email + Google OAuth)
- Team/org model (partial UI)
- Billing (Stripe)
- Notifications (email only)
- Background jobs (alert evaluator)
- Slack integration (stub only)
- Analytics (PostHog events)

## Known constraints

- Small eng team (4)
- Next.js + Postgres stack
- No enterprise sales motion yet

## Unknowns

1. Actual W4 retention by plan (need analytics export)
2. Win-loss reasons vs Metabase/Looker (need sales notes)
