# Changelog

All notable changes to the Growth Scout skill package are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning policy is described in [CONTRIBUTING.md](CONTRIBUTING.md).

Release tags align with `VERSION` (see [CONTRIBUTING.md](CONTRIBUTING.md)). Tag `v0.1.0` points to commit `96d4bc5` (MIT-licensed open-source release; core skill package landed in `704752f` via #1).

## [0.5.0] - 2026-06-13

### Added

- **`scripts/install-growth-scout.mjs`** — bootstrap install: copy skill files into a product repo (`--layout root` or `cursor`), run repo inventory, write `.growth-scout/product-map-draft.md`, and print a first agent prompt.
- **`repo-inventory.mjs`** — exports `generateProductMap` for reuse by the install script (CLI behavior unchanged).
- **README** — Option C bootstrap install and Tooling section for the install script.
- **Integrations** — bootstrap install smoke test in `integrations/VERIFICATION.md`; CONTRIBUTING smoke-test lines.

## [0.4.0] - 2026-06-12

### Added

- **MCP competitor scout** — optional `mcp/growth-scout-competitor/` package with stdio MCP server.
  - `scout_competitors` — end-to-end scout: product category + competitor names → draft matrix markdown + evidence ledger rows.
  - `fetch_page`, `competitor_snapshot`, `search_competitor_pages` — low-level tools for debug and partial reruns.
  - Brave Search (default) and Serper search providers; graceful fallback when API key missing.
- **`mcp/README.md`** — server install, tools, env vars, safety limits (agent-neutral).
- **`integrations/mcp.md`** — connect from any MCP client (Cursor, Claude Desktop, Claude Code, etc.); usage rules for agents.
- **SKILL.md** — quick reference row for optional MCP scout (`integrations/mcp.md`); no agent-specific MCP instructions in canonical workflow.
- **Integrations** — per-agent pointers in `integrations/cursor.md`, `integrations/claude-code.md`; matrix row in `integrations/README.md`; verification in `integrations/VERIFICATION.md`.
- **CI** — `validate-mcp` job runs MCP package tests and build on push/PR.

### Changed

- README roadmap: MCP competitor fetch marked shipped; Tooling section documents optional MCP.
- `scripts/validate-links.mjs` scans `mcp/*.md`.

## [0.3.0] - 2026-06-12

### Added

- **Industry reference packs** in `references/industry-packs/` — starter vertical heuristics for B2B SaaS, developer tools, and consumer mobile (table-stakes, signal sources, competitor buckets, evidence labeling).
- **SKILL.md** — Quick reference row for industry packs; Phase 3 pointer when the user names a vertical.
- **Link validation** — `scripts/validate-links.mjs` scans `references/industry-packs/*.md`.

### Changed

- README roadmap: industry reference packs marked shipped.
- `references/growth-taxonomy.md` cross-links to industry packs.

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

- Optional MCP competitor fetch

## [0.1.0] - 2026-06-11

### Added

- **Canonical workflow** — `SKILL.md` with five-phase growth scouting (product scan → opportunity report → PRD).
- **References** — codebase mapping, competitor analysis, growth taxonomy, market signals, opportunity scoring (GOS), validation experiments.
- **Templates** — product map, opportunity report, growth PRD, competitor matrix, evidence ledger, GitHub issues.
- **Examples** — fictional Chartflow product scan, opportunity report, and growth PRD.
- **Integrations** — per-agent setup notes for Cursor, Claude Code, Codex, GitHub Copilot, OpenCode, and Aider.
- **MIT license** and open-source README (#2).

[0.5.0]: https://github.com/008993368-yaz/Growth-Scout/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/008993368-yaz/Growth-Scout/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/008993368-yaz/Growth-Scout/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/008993368-yaz/Growth-Scout/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/008993368-yaz/Growth-Scout/releases/tag/v0.1.0
