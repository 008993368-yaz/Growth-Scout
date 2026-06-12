# Validation Experiments

When Growth Scout lacks strong demand evidence, it should recommend **validation first** — not a full build.

Pick experiments by **Time-to-Learn Advantage**, **cost**, and **signal quality**.

---

## Experiment selection matrix

| Experiment | Cost | Time | Signal quality | Best for |
|------------|------|------|----------------|----------|
| Fake-door test | Low | Days | Medium | Feature interest before building |
| Landing page test | Low–Med | Days–Weeks | Medium | Acquisition / positioning |
| Concierge MVP | Med | Weeks | Strong | Workflow uncertainty |
| Prototype interview | Low | Days | Strong | UX / value prop |
| Waitlist | Low | Days | Weak–Medium | Hype vs real intent |
| Usage analytics review | Low | Days | Strong | Existing product behavior |
| Support ticket tagging | Low | Days | Strong | Recurring pain themes |
| Manual workflow | Med | Weeks | Strong | Ops-heavy features |
| A/B test | Med–High | Weeks | Strong | Optimization with traffic |
| Beta rollout | Med–High | Weeks | Strong | Technical + UX validation |

---

## Fake-door test

**What:** UI entry point for a feature that does not exist yet; measures click / signup intent.

**Steps:**

1. Add nav item, button, or settings row: "Connect Slack" (example)
2. On click: explain upcoming feature + capture email or waitlist
3. Measure click-through rate vs baseline

**Success signal:** CTR above predefined threshold (e.g., >8% of active team admins)

**Guardrails:** Be honest; do not charge for undelivered capability.

---

## Landing page test

**What:** Standalone page describing a use case or tier; drive paid ads or email traffic.

**Steps:**

1. Write specific headline for one ICP
2. CTA: start trial / join waitlist
3. Run small targeted campaign ($200–500) or email segment

**Success signal:** Conversion rate vs existing landing page

**Best for:** New segments, integrations, vertical positioning

---

## Concierge MVP

**What:** Deliver outcome manually before automating.

**Example:** "Weekly PDF report" emailed by hand using existing data export.

**Success signal:** Users pay or renew when manual service stops

**Best for:** Unclear automation scope, high-touch workflows

---

## Prototype interview

**What:** Clickable mock (Figma) or scripted demo; 5–8 target users.

**Script:**

1. Context questions (current workflow)
2. Show prototype without leading
3. Willingness-to-pay or priority rank vs alternatives

**Success signal:** ≥5/8 say "would use weekly" or rank in top 2 priorities

---

## Waitlist

**What:** Collect interest pre-build.

**Weak alone** — pair with ICP qualification questions.

**Success signal:** Qualified waitlist conversion, not raw signups

---

## Usage analytics review

**What:** Mine existing product data before new code.

**Checks:**

- Funnel drop-offs (activation)
- Feature adoption breadth (retention)
- Power-user cohort behavior (expansion/revenue)

**Success signal:** Quantified bottleneck tied to hypothesis

---

## Support ticket tagging

**What:** Tag tickets by theme for 2–4 weeks; count frequency.

**Success signal:** Theme appears in ≥5% of tickets or top 3 drivers

---

## Manual workflow

**What:** Ops/success runs process by hand (spreadsheet, admin script).

**Success signal:** Repeat requests + willingness to pay for automation

---

## A/B test

**What:** Ship variant to subset; measure metric.

**Requires:** Traffic, instrumentation, ethical UX

**Best for:** Copy, onboarding order, pricing presentation — not net-new unvalidated features

---

## Beta rollout

**What:** Limited production release behind flag.

**Success signal:** Adoption + retention delta vs holdout

**Best for:** Features with moderate build cost and clear hypothesis

---

## Reporting in Growth Scout

For each **Validate first** recommendation, specify:

| Field | Content |
|-------|---------|
| Hypothesis | If we build X, metric Y moves by Z |
| Experiment type | From list above |
| Audience | Segment and sample size |
| Duration | e.g., 2 weeks |
| Success threshold | Numeric when possible |
| Failure action | Park, pivot, or narrow scope |
| Build trigger | What result upgrades to "Build now" |

---

## Anti-patterns

- Building v1 for 6 weeks with no success threshold
- Counting vanity waitlist signups without ICP filter
- A/B testing without enough traffic
- Fake doors that feel deceptive → damages trust lever
