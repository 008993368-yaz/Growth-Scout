# Contributing to Growth Scout

Growth Scout is an agent-agnostic markdown skill package. Contributions should keep it portable (no Cursor-only runtime deps in core scripts).

## Before you open a PR

1. Run link validation:

   ```bash
   node scripts/validate-links.mjs
   ```

2. If you changed `repo-inventory.mjs`, smoke-test on this repo and a small app repo:

   ```bash
   node scripts/repo-inventory.mjs .
   node scripts/repo-inventory.mjs --help
   ```

3. Label claims in examples and rubrics as **known**, **inferred**, or **unknown** — fictional narratives (e.g. Chartflow) stay fictional.

## What to contribute

| Area | Guidance |
|------|----------|
| **Workflow / `SKILL.md`** | Keep phases evidence-first; avoid agent-specific instructions in the canonical file (use `integrations/` instead). |
| **Scoring / templates** | Open an issue or PR describing the rubric change and which example outputs need updating. |
| **Examples** | Add under `examples/` using existing templates; do not present fiction as real customer data. |
| **Scripts** | Node only, zero npm dependencies, agent-agnostic. |
| **MCP** | Optional sub-package under `mcp/`; may use npm deps. Keep core skill zero-dep. |
| **Integrations** | Per-agent wiring lives in `integrations/`; optional Cursor rules stay optional. |

## Link validation

`scripts/validate-links.mjs` scans:

- `SKILL.md`, `AGENTS.md`, `README.md`
- `references/*.md`, `templates/*.md`, `integrations/*.md`, `examples/*.md`, `mcp/*.md`

It validates relative `[text](path)` links and backtick `` `path.md` `` references to local markdown files. External URLs are skipped.

CI runs the same check on every push and pull request (see `.github/workflows/validate.yml`).

## Versioning policy

- **`VERSION`** holds the current skill package version (semver).
- **Patch** (0.2.x): typo fixes, link fixes, clarifications without workflow changes.
- **Minor** (0.x.0): new templates, scripts, reference sections, or workflow additions that remain backward compatible.
- **Major** (x.0.0): breaking changes to scoring bands, required report sections, or canonical phase structure.

When you ship a user-facing bundle:

1. Bump `VERSION`.
2. Add a dated section to `CHANGELOG.md` (include compare links at the bottom).
3. Recommend product repos copy the new `VERSION` file alongside `SKILL.md` so teams know which revision they pinned.
4. Create an **annotated git tag** matching `VERSION` (e.g. `v0.2.0`) on the release commit.
5. Push the tag and publish a **GitHub release** with notes from the `CHANGELOG.md` section (`gh release create`).
6. Run `node scripts/validate-links.mjs` before tagging so compare/release links resolve.

The `VERSION` file is the source of truth for adopters copying the skill; git tags and GitHub releases mirror it for changelog navigation and pinning.

## Proposing rubric or template changes

1. State the problem (e.g. "Validate first band too wide for B2B enterprise").
2. Show a worked example with factor scores and GOS.
3. Update `references/opportunity-scoring.md` and any affected `examples/` outputs.
4. Note migration impact in `CHANGELOG.md`.

## Questions

Open a GitHub issue with context: agent used, repo size, and which phase failed or felt unclear.
