# Industry pack: Developer tools

Vertical heuristics for Growth Scout Phase 3 when the product targets **software builders** (libraries, CLIs, APIs, dev platforms, infra adjacent). **inferred** — common dev-tool patterns; validate against your stack and audience.

---

## When to use

Use this pack when the primary user writes code, operates CI/CD, or integrates via API/SDK — and evaluation happens through docs, GitHub, and technical proof.

Signals that you are in this vertical (**inferred**):

- Distribution via package registry, CLI, API, or self-hosted install
- Docs site, OpenAPI/spec, or README is part of the product surface
- Competitors are OSS repos, commercial dev products, or cloud primitives

If the user names **developer-tools**, **devtools**, **API product**, or **OSS + paid**, consult this file during Phase 3.

---

## Signal sources

Canonical list: [`references/market-signal-sources.md`](../market-signal-sources.md). For developer tools, weight sources as follows:

| Source | What it tells you | Typical strength |
|--------|-------------------|------------------|
| Your GitHub issues / discussions | Real integration friction | Strong (**known** for your repo) |
| OSS competitor issues & PRs | Unmet needs, breaking changes | Medium (**inferred** fit to your scope) |
| Docs gaps (your site or competitors') | Activation blockers | Medium–Strong |
| Hacker News / Reddit / Discord | Early adopter sentiment | Medium (noisy) |
| Stack Overflow tags / questions | Demand for workflows | Weak–Medium |
| Release notes & changelogs | Strategic bets | Medium |
| npm/PyPI download trends | Adoption proxy | **unknown** without tool access — do not invent counts |

Never cite star counts or download numbers unless **known** from a fetched source with date.

---

## OSS vs paid heuristics

| Model | Scout focus | Common mistake |
|-------|-------------|----------------|
| OSS core + paid cloud/hosting | Gap between self-host pain and managed value | **Copy-dangerous**: rebuilding entire cloud control plane |
| OSS library + commercial support | Enterprise needs (SLA, LTS) | **inferred** demand until win/loss data |
| Closed source API | DX, limits, pricing gates vs alternatives | Treating OSS hobby projects as direct revenue comps |
| Open core | Which features are table-stakes in free tier | **inferred** from competitor tier matrices |

Label whether a competitor is **same buyer** (team lead vs individual) — **unknown** until clarified.

---

## Docs and GitHub issues as demand signals

Treat these as **primary technical evidence** when sourced:

| Signal in issues/docs | Opportunity type | Label |
|----------------------|------------------|-------|
| Repeated "how do I authenticate…" | Activation / docs | **known** with issue links |
| Breaking change migration threads | Trust / versioning | **known** |
| Feature requests with many 👍 on OSS comp | Differentiation candidate | **inferred** — audience may differ |
| Closed issues "won't fix" on competitor | Competitor weakness | **known** with citation |
| Stale docs for latest runtime | Table-stakes maintenance | **known** if verified |

Count themes; do not report percentages without data.

---

## Common table-stakes gaps

| Gap area | Why developers bounce (**inferred**) |
|----------|--------------------------------------|
| Quickstart < 15 minutes to success | Activation |
| Official SDKs for top 2–3 languages | Table-stakes in mature categories |
| CI/CD examples (GitHub Actions, etc.) | Adoption in teams |
| Semantic versioning & migration guides | Trust |
| Rate limits and error docs | API products |
| Local dev / offline story | CLI and data tools |
| Security disclosure process | Team and enterprise adoption |

---

## Example competitor buckets

### Table-stakes

| Pattern | Example |
|---------|---------|
| Every serious competitor documents the same auth flow | **inferred** category norm |
| Your issues: "can't run in Docker" while comps document it | **known** if from your tracker |

### Differentiation

| Pattern | Example |
|---------|---------|
| Narrow wedge (e.g. "Postgres-only" vs generic ORM) | **inferred** positioning |
| Observability or DX angle competitors treat as secondary | **inferred** until user interviews |

### Competitor weaknesses

| Pattern | Example |
|---------|---------|
| GitHub issues: flaky releases, poor Windows support | **known** with links |
| Docs outdated for current major version | **known** if checked |

### Copy-dangerous

| Pattern | Example |
|---------|---------|
| Matching every language SDK because hyperscaler has 12 | **inferred** — scope creep |
| Replicating entire IDE because a competitor shipped one | Strategic misfit |
| "Open source" washing without community governance | Positioning risk |

---

## Evidence labeling reminders

| Label | Use when |
|-------|----------|
| **known** | Issue URL, doc page, changelog entry, or repo file you or the user supplied |
| **inferred** | Pattern from this pack or analogy across tools |
| **unknown** | Suspected demand (e.g. "Rust SDK") without issues or interviews |

External GitHub/HN claims without fetch: mark **unknown** and recommend validation.

---

## Related references

- [`references/market-signal-sources.md`](../market-signal-sources.md)
- [`references/competitor-analysis.md`](../competitor-analysis.md)
- [`references/codebase-product-mapping.md`](../codebase-product-mapping.md) — map CLI, API routes, SDK folders
