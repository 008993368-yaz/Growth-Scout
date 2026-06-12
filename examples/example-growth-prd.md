# Growth PRD: Slack Alert Notifications

> **Product:** Chartflow (fictional) | **Date:** 2026-06-01 | **Status:** Draft

## Growth hypothesis

If we ship Slack notifications for dashboard threshold alerts to team admins, then week-4 retention on Team plans will increase by at least 5%, because alerts meet users in their daily workflow instead of buried email.

**Primary growth lever:** Retention  
**Recommendation:** Build now (MVP)

## Problem

Team-plan users configure email alerts but open rates are low (~22%, fictional). Support tickets request Slack delivery. Alerts feel disconnected from where ops teams collaborate.

## Target user

| Persona | Context | Current workaround |
|---------|---------|-------------------|
| Ops lead | Lives in Slack | Forwards email alerts manually |
| Founder | Checks Slack, not email | Misses threshold breaches |

## User story

As a team admin, I want dashboard alerts posted to a Slack channel so that the team sees metric changes without checking email.

## MVP scope

| In scope | Out of scope (non-goals) |
|----------|--------------------------|
| Connect one Slack workspace per Chartflow org | Multiple Slack workspaces |
| Post alert when threshold crossed | Two-way Slack commands |
| Admin-only connection flow | Per-user DM preferences |
| Opt-in per dashboard alert rule | Full alert rule builder redesign |

## Success metrics

| Metric | Baseline | Target | Window |
|--------|----------|--------|--------|
| Primary: Slack-connected team orgs | 0% | 25% of active team orgs | 30 days post-GA |
| Secondary: W4 retention (Team plan) | 61% (fictional) | +5 pp vs holdout | 8 weeks |

## UX notes

- Entry: Settings, Integrations, Slack
- OAuth, pick default channel, test message
- Each alert rule: toggle Also send to Slack

## Technical notes

| Area | Approach | Touchpoints |
|------|----------|-------------|
| OAuth | Slack app with bot token | integrations/slack/ stub |
| Events | Reuse alert_evaluator job | jobs/alert_evaluator.ts |
| Storage | slack_installations table | extend existing org schema |

## Risks

| Risk | Mitigation |
|------|------------|
| Alert spam | Default to digest for more than 3 alerts per day |
| Token revocation | Graceful degrade to email plus banner |

## Rollout plan

1. Internal dogfood on Chartflow workspace
2. Beta: feature flag slack_alerts_beta for Team plan
3. GA plus changelog plus support macro

## Open questions

1. Bot vs webhook — compliance review needed?
2. Should free tier see locked integration tile for upgrade?
