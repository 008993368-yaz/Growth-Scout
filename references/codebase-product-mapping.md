# Codebase–Product Mapping

Growth Scout infers **what the product is** and **what it can ship cheaply** from the repository. Treat the codebase as ground truth for capabilities; treat marketing copy as hypotheses until verified in code.

Label findings: **known** (directly in code/docs), **inferred** (reasonable deduction), **unknown** (not found).

---

## Reading order

1. **README + `/docs`** — Stated purpose, setup, architecture
2. **Package manifests** — Stack, scripts, dependencies (`package.json`, `pyproject.toml`, `go.mod`, etc.)
3. **Entry points** — `main.*`, `app/`, `src/index.*`, CLI binaries
4. **Routes / pages** — URL structure ≈ feature surface
5. **API layer** — OpenAPI, tRPC routers, GraphQL schema, REST handlers
6. **Data layer** — Models, migrations, Prisma/Django/SQL files
7. **Auth & billing** — Middleware, Stripe/payment SDK usage, plan enums
8. **Integrations** — OAuth providers, webhooks, third-party SDKs
9. **Analytics** — Event tracking calls, Segment/PostHog/Amplitude wrappers
10. **Tests** — What behavior is enforced as contract
11. **CI / config** — Feature flags, env vars, deployment targets
12. **Issues / changelog** — Recent intent and shipped work

---

## What to extract per artifact

### README & docs

| Look for | Maps to |
|----------|---------|
| Problem statement | Positioning |
| Quick start steps | Core workflow |
| Feature list | Claimed capabilities (verify in code) |
| Roadmap section | Stated priorities (may be stale) |
| License / open core | Monetization hints |

### Package files

| Look for | Maps to |
|----------|---------|
| Framework (Next, Rails, etc.) | Implementation constraints |
| Auth library | Trust / expansion readiness |
| Payment SDK | Revenue infrastructure |
| Email / queue libs | Notification readiness |
| AI SDKs | Differentiation bets |

### Routes & UI screens

| Pattern | Inference |
|---------|-----------|
| `/settings/billing` | Self-serve billing exists or planned |
| `/onboarding/*` | Activation investment |
| `/admin/*` | Internal or enterprise tools |
| Empty route folders | Partial features |

List **shipped screens**, **hidden/flagged**, and **missing expected routes** for the category.

### Database schema & migrations

| Pattern | Inference |
|---------|-----------|
| `organizations`, `memberships` | Team/expansion model |
| `subscriptions`, `plans` | Monetization |
| `invites`, `referrals` | Growth loops |
| Unused tables/columns | Partial implementations |
| Recent migrations | Active investment areas |

### Tests

Tests reveal **what the team considers done**:

- E2E flows = core workflow
- Skipped tests = known debt
- Missing tests on billing/auth = risk area

### API endpoints

Build an endpoint inventory grouped by domain (auth, content, billing, integrations). Compare to UI — gaps indicate API-only or unfinished UI.

### Auth logic

| Found | Enables |
|-------|---------|
| Email/password only | Baseline |
| OAuth | Acquisition + activation |
| SAML/OIDC | Enterprise trust |
| RBAC / roles | Team expansion |

### Billing code

| Found | Enables |
|-------|---------|
| Stripe Checkout | Self-serve revenue |
| Usage metering tables | Usage-based pricing features |
| Plan feature gates | Tier differentiation |
| Nothing | Revenue features need foundation first |

### Analytics events

| Found | Enables |
|-------|---------|
| Funnel events | Data-informed growth work |
| No events | Recommend instrumentation as prerequisite |
| Feature usage events | Retention/expansion analysis |

### Integrations

Existing OAuth apps, webhooks, or import parsers lower **Implementation Complexity** for adjacent features.

---

## Partial feature detection

Search for:

- `TODO`, `FIXME`, `feature flag`, `coming soon`
- Stub components returning placeholder UI
- API routes without UI (or reverse)
- Schema fields unused in application code
- Disabled env vars in `.env.example`

Classify as **partial** — often highest ROI to finish vs build new.

---

## Maturity stage heuristics

| Stage | Codebase signals |
|-------|------------------|
| Idea / prototype | No auth, no tests, manual deploy |
| MVP | Core workflow works; minimal billing |
| Growth | Analytics, billing tiers, team features emerging |
| Mature | Extensive RBAC, compliance, performance work |

Stage affects which growth levers matter most (activation vs expansion vs trust).

---

## Technical foundations checklist

Copy into product map:

```
Technical foundations:
- [ ] Auth (types: ...)
- [ ] Team/org model
- [ ] Billing / plans
- [ ] Notifications (email/push/slack)
- [ ] Background jobs
- [ ] File storage
- [ ] Search
- [ ] API (public/internal)
- [ ] Analytics instrumentation
- [ ] Feature flags
- [ ] i18n
- [ ] Mobile/responsive
```

Check only what evidence supports.

---

## Codebase feasibility scoring inputs

| Signal | Feasibility impact |
|--------|-------------------|
| Pattern already exists in codebase | High (4–5) |
| Library present but unused | Medium-high (3–4) |
| New subsystem, familiar stack | Medium (3) |
| New infra (e.g., real-time, mobile) | Low (1–2) |
| Requires rewrite of core domain | Very low (1) |

Always cite **files or paths** as evidence when recommending feasibility (without exposing secrets).

---

## When context is insufficient

Flag explicitly if missing:

- No README or docs
- Cannot determine ICP
- No routes/UI (library-only repo)
- No issue tracker access user cares about

Recommend: user interview questions, analytics export, or competitor links before high-confidence recommendations.
