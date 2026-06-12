# Industry pack: Consumer mobile

Vertical heuristics for Growth Scout Phase 3 when the product is a **consumer-facing mobile app** (iOS, Android, or cross-platform) with discovery and retention shaped by app stores. **inferred** — common mobile patterns; validate per category and geography.

---

## When to use

Use this pack when users install from an app store, activation is measured in first sessions, and reviews/ratings are visible competitive signal.

Signals that you are in this vertical (**inferred**):

- Primary client is mobile (native or React Native / Flutter)
- Growth levers include store listing, push, and in-app onboarding
- Monetization may be subscription, ads, or IAP

If the user names **consumer-mobile**, **mobile app**, or **B2C app**, consult this file during Phase 3.

---

## Signal sources

Full catalog: [`references/market-signal-sources.md`](../market-signal-sources.md). Prioritize for mobile:

| Source | What it tells you | Typical strength |
|--------|-------------------|------------------|
| App Store / Play Store reviews | UX pain, crashes, missing features | Medium–Strong |
| Your in-app analytics (if user provides) | Activation, retention cohorts | Strong (**known**) |
| Competitor store listings (screenshots, what's new) | Positioning and table-stakes UX | Medium |
| Category charts / featuring | Discovery dynamics | Weak–Medium — **unknown** without store tools |
| Social / TikTok / influencer buzz | Awareness spikes | Noisy — often **inferred** only |
| Support email in app | Recurring friction | Strong (**known**) |

Do not invent download ranks, DAU, or star averages.

---

## App store reviews as demand signals

| Review theme | Opportunity lever | Evidence |
|--------------|-------------------|----------|
| "Crashes on login" | Trust / table-stakes stability | **known** with store link |
| "Wish it synced with…" | Integration / differentiation | **known** |
| "Too many notifications" | Retention / settings | **known** |
| "Subscription too expensive" | Revenue — validate willingness | **inferred** — vocal minority risk |
| One-star bombing (non-product) | Noise | Tag **Ignore/noise** |

Mine **recurring phrases** across recent reviews; cite 3+ independent mentions before treating as Medium strength (**inferred** methodology).

---

## Activation metrics (what to ask for)

If the user shares analytics, map to opportunities (**known** only with data):

| Metric | Healthy scout question | Without data |
|--------|------------------------|--------------|
| Install → sign-up completion | Where is drop-off? | **unknown** |
| Day-1 / Day-7 retention | Habit loop missing? | **unknown** |
| Time to first core action | Onboarding opportunity | **inferred** from funnel best practices |
| Push opt-in rate | Notification strategy | **unknown** |
| Paywall view → subscribe | Monetization friction | **unknown** |

Never fabricate benchmark percentages (e.g. "40% D1 retention").

---

## Common table-stakes gaps

| Gap area | User impact (**inferred**) |
|----------|----------------------------|
| Account recovery / social login | Activation drop |
| Offline or poor-network behavior | Retention in mobile contexts |
| Permission prompts with clear value prop | Review complaints |
| Subscription management (cancel, restore purchases) | Store policy and trust |
| Accessibility (dynamic type, contrast) | Reviews and platform norms |
| Privacy nutrition labels / data disclosure | Trust and store compliance |

---

## Example competitor buckets

### Table-stakes

| Pattern | Example |
|---------|---------|
| Top 5 apps in category all offer cloud backup | **inferred** until store audit |
| Reviews on your app cite missing dark mode while comps have it | **known** with review cites |

### Differentiation

| Pattern | Example |
|---------|---------|
| Niche audience (e.g. parents, hobbyists) underserved by generic leader | **inferred** positioning |
| Faster core loop than bloated incumbent | **inferred** — validate in usability tests |

### Competitor weaknesses

| Pattern | Example |
|---------|---------|
| Recent reviews: aggressive ads, paywall too early | **known** with dates |
| Buggy release notes thread in Play Store | **known** |

### Copy-dangerous

| Pattern | Example |
|---------|---------|
| Cloning gamification / streaks because Duolingo-style apps use them | May not fit your category |
| Matching every social feature of a network-effect incumbent | **inferred** — cold-start risk |
| IAP price parity without unit economics | **unknown** viability |

---

## Evidence labeling reminders

| Label | Use when |
|-------|----------|
| **known** | Store review text, screenshot, analytics export, or user-provided cohort |
| **inferred** | Category patterns from this pack or qualitative review themes |
| **unknown** | Assumed retention benchmarks or competitor downloads |

Store reviews alone rarely justify **Build now** — pair with internal analytics or experiments (`references/validation-experiments.md`).

---

## Related references

- [`references/market-signal-sources.md`](../market-signal-sources.md)
- [`references/competitor-analysis.md`](../competitor-analysis.md)
- [`references/growth-taxonomy.md`](../growth-taxonomy.md) — Activation, Retention, Referral levers
