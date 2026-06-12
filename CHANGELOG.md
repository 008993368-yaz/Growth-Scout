# Changelog

All notable changes to the Growth Scout skill package are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning policy is described in [CONTRIBUTING.md](CONTRIBUTING.md).

## [0.2.0] - 2026-06-12

### Added

- **Large repository mode** in `SKILL.md` — multi-turn workflow to avoid blowing context on big codebases.
- **`scripts/validate-links.mjs`** — checks relative markdown and backtick `.md` references in core docs; exits non-zero on broken links.
- **`scripts/repo-inventory.mjs`** — zero-dependency CLI that emits a pre-filled product-map skeleton from a target repo.
- **CI** — `.github/workflows/validate.yml` runs link validation on push and pull requests (Node 20).
- **`VERSION`** file for pinning which skill revision a product repo copied.
- **`CONTRIBUTING.md`** — validation, rubric changes, examples, and versioning guidance.
- **README Tooling and Versioning** sections with example output links near Quick start.
- **Second GOS worked example** (`references/opportunity-scoring.md`) in the **Validate first** band (~GOS 19).
- **`integrations/VERIFICATION.md`** — copy-paste test prompts for Cursor, Claude Code, and Codex.

### Changed

- Phase 5 in `SKILL.md` now points to the GOS recommendation threshold table in `references/opportunity-scoring.md`.
- README roadmap updated: repo inventory CLI shipped; MCP competitor fetch remains optional future work.

### Follow-up (not in this release)

- GitHub release tags aligned with `VERSION`
- Optional MCP competitor fetch
- Industry reference packs

[0.2.0]: https://github.com/008993368-yaz/Growth-Scout/compare/v0.1.0...v0.2.0
