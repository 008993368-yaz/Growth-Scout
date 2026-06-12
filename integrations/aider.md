# Aider integration (optional)

Aider loads files you specify with `--read` or in `.aider.conf.yml`.

## One-shot

```bash
aider --read SKILL.md --read references/opportunity-scoring.md
```

Then ask: *What should we build next? Use Growth Scout workflow.*

## Persistent config (`.aider.conf.yml`)

```yaml
read:
  - SKILL.md
  - references/growth-taxonomy.md
  - references/opportunity-scoring.md
```

Add more reference files as needed. Templates are loaded on demand when generating reports.

## Tip

For a full opportunity report, also `--read templates/opportunity-report-template.md`.
