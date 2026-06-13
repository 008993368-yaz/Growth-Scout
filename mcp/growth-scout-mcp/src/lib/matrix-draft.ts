import type { FetchResult } from "./evidence.js";
import type { ExtractedFields } from "./extract-fields.js";
import {
  capabilityStatus,
  mergeCapabilities,
} from "./extract-fields.js";

export interface CompetitorDraft {
  name: string;
  base_url: string;
  tier_suggestion: string;
  url_candidates: { url: string; title: string; snippet: string }[];
  snapshots: FetchResult[];
  fields: ExtractedFields;
}

export interface MatrixDraftInput {
  fetched_at: string;
  product_category: string;
  your_product_name: string;
  your_product_url?: string;
  your_snapshots?: FetchResult[];
  your_fields?: ExtractedFields;
  competitors: CompetitorDraft[];
  capability_rows?: string[];
  research_limits: string[];
}

export interface MatrixDraftOutput {
  matrix_markdown: string;
  evidence_ledger_rows: Record<string, string>[];
  unknown_cell_count: number;
}

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

function cellForCompetitor(
  capability: string,
  fields: ExtractedFields,
  snapshots: FetchResult[],
): string {
  if (snapshots.every((s) => s.confidence === "unknown" || !s.text)) {
    return "Unknown";
  }
  return capabilityStatus(fields.feature_mentions, capability);
}

export function buildMatrixDraft(input: MatrixDraftInput): MatrixDraftOutput {
  const {
    fetched_at,
    product_category,
    your_product_name,
    competitors,
    research_limits,
  } = input;

  const allMentions = competitors.map((c) => c.fields.feature_mentions);
  if (input.your_fields) {
    allMentions.unshift(input.your_fields.feature_mentions);
  }
  const capabilities = mergeCapabilities(
    product_category,
    allMentions,
    input.capability_rows,
  );

  const compNames = competitors.map((c) => c.name);
  const headerCols = [your_product_name, ...compNames].join(" | ");
  const headerSep = [your_product_name, ...compNames]
    .map(() => "---")
    .join(" | ");

  let unknownCellCount = 0;
  const matrixRows: string[] = [];

  for (const cap of capabilities) {
    const yourCell = input.your_fields
      ? capabilityStatus(input.your_fields.feature_mentions, cap)
      : "Unknown";
    if (yourCell === "Unknown") unknownCellCount++;

    const compCells = competitors.map((c) => {
      const cell = cellForCompetitor(cap, c.fields, c.snapshots);
      if (cell === "Unknown") unknownCellCount++;
      return cell;
    });

    matrixRows.push(`| ${cap} | ${yourCell} | ${compCells.join(" | ")} | |`);
  }

  const competitorSetRows = competitors
    .map(
      (c) =>
        `| ${c.name} | ${c.tier_suggestion} | Auto-scouted via MCP for ${product_category} |`,
    )
    .join("\n");

  const detailSections = competitors
    .map((c) => {
      const f = c.fields;
      return `### ${c.name}

| Field | Value | Evidence/source | Confidence |
|-------|-------|-----------------|------------|
| Positioning | ${f.positioning.value || "—"} | ${f.positioning.source_url || c.base_url} | ${f.positioning.confidence} |
| Target user | ${f.target_user.value || "—"} | ${f.target_user.source_url || "—"} | ${f.target_user.confidence} |
| Pricing model | ${f.pricing_model.value || "—"} | ${f.pricing_model.source_url || "—"} | ${f.pricing_model.confidence} |
| Key features | ${f.key_features.value || "—"} | ${f.key_features.source_url || "—"} | ${f.key_features.confidence} |
| Missing features | — | — | unknown |
| Weaknesses | — | — | unknown |
| Differentiation opportunities | — | — | unknown |`;
    })
    .join("\n\n");

  const limitsText =
    research_limits.length > 0 ? research_limits.join("; ") : "none";

  const matrixMarkdown = `# Competitor Matrix

> Date: ${formatDate(fetched_at)} | Product: ${your_product_name} | Research limits: ${limitsText}

**Draft only — classify gaps and validate before GOS scoring.**

## Competitor set

| Competitor | Tier (direct/adjacent/aspirational) | Why included |
|------------|---------------------------------------|--------------|
${competitorSetRows}

## Feature matrix

| Capability | ${headerCols} | Gap class |
|------------| ${headerSep} |--------|
${matrixRows.join("\n")}

Legend: Full | Partial | Missing | Unknown

## Per-competitor detail

${detailSections}

## Classified gaps

| Gap | Bucket (table-stakes / differentiation / weakness / copy-dangerous / noise) | Action |
|-----|-----------------------------------------------------------------------------|--------|
| _Agent to classify after review_ | | |

## What we should NOT copy

1. _Agent to complete after strategic fit review_
2. 

## Staleness & limits

- Sources collected: ${formatDate(fetched_at)}; refresh if older than 12 months before scoring.
- Unverified claims: review cells marked Unknown or inferred-only.
${research_limits.map((l) => `- ${l}`).join("\n")}
`;

  const evidenceRows: Record<string, string>[] = [];

  for (const c of competitors) {
    if (c.fields.positioning.value) {
      evidenceRows.push({
        claim: `${c.name} positioning: ${c.fields.positioning.value.slice(0, 120)}`,
        evidence: c.fields.positioning.excerpt ?? c.fields.positioning.value.slice(0, 120),
        source: c.fields.positioning.source_url,
        date_collected: formatDate(fetched_at),
        strength: "medium",
        confidence: c.fields.positioning.confidence,
        notes: "MCP scout_competitors draft",
        staleness_risk: "low",
      });
    }
    if (c.fields.pricing_model.value) {
      evidenceRows.push({
        claim: `${c.name} pricing model: ${c.fields.pricing_model.value}`,
        evidence: c.fields.pricing_model.value,
        source: c.fields.pricing_model.source_url,
        date_collected: formatDate(fetched_at),
        strength: "medium",
        confidence: c.fields.pricing_model.confidence,
        notes: "MCP scout_competitors draft",
        staleness_risk: "medium",
      });
    }
  }

  return {
    matrix_markdown: matrixMarkdown,
    evidence_ledger_rows: evidenceRows,
    unknown_cell_count: unknownCellCount,
  };
}
