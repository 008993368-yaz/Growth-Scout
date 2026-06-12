# Growth Taxonomy

Growth Scout classifies feature ideas by **growth lever** — the primary mechanism through which a feature is expected to move the business.

Use one **primary** lever per opportunity. Add secondary levers only when they materially change prioritization.

---

## Acquisition

**Definition:** Brings new users or accounts into the product.

**Signals it is the right lever:** Low top-of-funnel volume, high CAC, weak organic discovery, no viral entry point.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Integration marketplace listing | Discovery via partner ecosystems |
| Public template gallery | SEO + shareable entry points |
| Free tool / calculator on marketing site | Lead magnet with product upsell |
| OAuth sign-up with Google/GitHub | Reduces signup friction |
| Referral landing pages | Captures campaign traffic |

**Watch-outs:** Acquisition features without activation support inflate signups but not retained usage.

---

## Activation

**Definition:** Helps new users reach first meaningful value quickly.

**Signals:** High signup-to-active drop-off, long time-to-first-success, empty states after onboarding.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Industry-specific starter templates | Skips blank-slate problem |
| Interactive product tour | Guides first workflow |
| Sample data / demo project | Shows value before setup |
| Progress checklist | Makes next step obvious |
| One-click import from competitor | Reduces migration friction |

---

## Retention

**Definition:** Brings users back and deepens habitual use.

**Signals:** D7/D30 churn, single-session users, stale accounts.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Email/push digests of changes | Re-engagement trigger |
| Saved views and filters | Investment in the product |
| Weekly summary reports | Recurring value delivery |
| Collaboration invites inside workflow | Social lock-in |
| Streaks or usage reminders (non-gamified) | Habit reinforcement |

---

## Revenue

**Definition:** Increases monetization — conversion to paid, expansion revenue, or ARPU.

**Signals:** Free-heavy mix, low upgrade rate, under-monetized power users.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Usage-based limits with upgrade prompts | Natural expansion trigger |
| Team/seat billing | Higher contract value |
| Premium integrations | Clear paid tier differentiation |
| Annual plan discount flow | Improves cash collection |
| Invoice / PO billing for SMB | Unblocks buyers |

---

## Referral

**Definition:** Existing users bring new users.

**Signals:** High NPS but low organic word-of-mouth, collaborative product with single-player signup.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Invite credits or extended trial | Incentivized sharing |
| Shared workspaces with guest access | Invites embedded in workflow |
| Embeddable public outputs | Product-led distribution |
| "Powered by" badge on exports | Passive attribution |

---

## Expansion

**Definition:** Grows account value within existing customers (seats, departments, use cases).

**Signals:** Single-user accounts at companies, requests for admin/API/SSO.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Organization admin console | Enables team rollout |
| Role-based access control | Required for multi-seat |
| Public API | New integration use cases |
| Multiple workspaces per org | Department-level adoption |

---

## Trust

**Definition:** Reduces perceived risk for buyers and security-conscious users.

**Signals:** Enterprise deals stalled on security, support questions about data handling.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| SSO (SAML/OIDC) | Enterprise procurement requirement |
| Audit logs | Compliance and admin visibility |
| Data export / portability | Reduces lock-in fear |
| SOC 2 / security page | Sales enablement |
| Status page integration | Operational transparency |

---

## Differentiation

**Definition:** Creates a defensible reason to choose this product over alternatives.

**Signals:** Commodity positioning, price-only competition, weak unique workflow.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Vertical-specific workflow | Harder to replicate |
| AI-assisted unique capability | Perceived innovation (validate demand) |
| Deep native integration competitors lack | Switching cost + uniqueness |
| Opinionated UX that saves steps | Workflow moat |

**Watch-outs:** Differentiation without demand evidence is a science project. Validate before large builds.

---

## Table-stakes

**Definition:** Baseline capabilities users expect in the category. Absence causes disqualification, not delight.

**Signals:** Lost deals citing missing basics, reviews comparing unfavorably, high support volume on one gap.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Password reset / email verification | Basic auth hygiene |
| Mobile-responsive UI | Expected access pattern |
| CSV import/export | Category norm |
| Search | Expected at scale |
| Basic permissions | Required for teams |

**Prioritization note:** Table-stakes often score high on **Competitor Gap** and **Product Risk** (if missing) but low on **Differentiation**. Build when blocking growth, not for marketing splash.

---

## Operational efficiency

**Definition:** Reduces internal cost, support load, or time-to-ship — indirectly enabling growth.

**Signals:** Support ticket themes, manual ops workflows, slow release cadence caused by tooling gaps.

**Example features:**

| Feature | Why it helps |
|---------|--------------|
| Self-serve billing portal | Deflects billing tickets |
| In-app help center | Deflects support |
| Admin impersonation (with audit) | Faster support resolution |
| Feature flags | Safer rollout |
| Internal analytics dashboard | Faster product decisions |

---

## Classification checklist

For each candidate feature, ask:

1. Who benefits first — new user, active user, buyer, or internal team?
2. Which metric should move — visits, activation rate, retention, MRR, referrals?
3. Is this expected (table-stakes), differentiated, or internal (operational)?
4. If we ship nothing else this quarter, would this still matter?

Record the primary lever in the opportunity report.
