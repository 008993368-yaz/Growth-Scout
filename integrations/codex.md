# OpenAI Codex integration (optional)

Codex CLI reads **`AGENTS.md`** at the repository root for project-level guidance.

## Setup

1. Copy Growth Scout files into your product repo (or add as submodule).
2. Ensure [`AGENTS.md`](../AGENTS.md) is at the repo root (or merge its contents into your existing AGENTS.md).
3. Run Codex from the product repo directory.

## Prompt example

```
Follow Growth Scout in SKILL.md. What should we build next?
```

Codex will use AGENTS.md context plus files you reference in the prompt.
