import type { WorkItemSignal, ThemeCluster } from "./types.js";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "for", "to", "in", "on", "with", "is", "are",
  "be", "as", "at", "by", "from", "of", "it", "this", "that", "not", "when",
]);

function extractKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function clusterThemes(signals: WorkItemSignal[]): ThemeCluster[] {
  const labelMap = new Map<string, WorkItemSignal[]>();
  const keywordMap = new Map<string, WorkItemSignal[]>();

  for (const signal of signals) {
    if (signal.labels.length > 0) {
      const primary = signal.labels[0].toLowerCase();
      const group = labelMap.get(primary) ?? [];
      group.push(signal);
      labelMap.set(primary, group);
    } else {
      const keywords = extractKeywords(signal.title);
      const key = keywords[0] ?? "other";
      const group = keywordMap.get(key) ?? [];
      group.push(signal);
      keywordMap.set(key, group);
    }
  }

  const clusters: ThemeCluster[] = [];

  for (const [theme, items] of labelMap) {
    clusters.push({
      theme: `label:${theme}`,
      count: items.length,
      item_ids: items.map((i) => i.id),
      sample_titles: items.slice(0, 3).map((i) => i.title),
    });
  }

  for (const [theme, items] of keywordMap) {
    clusters.push({
      theme: `keyword:${theme}`,
      count: items.length,
      item_ids: items.map((i) => i.id),
      sample_titles: items.slice(0, 3).map((i) => i.title),
    });
  }

  return clusters.sort((a, b) => b.count - a.count);
}

export function buildLedgerMarkdown(
  signals: WorkItemSignal[],
  productName = "Product",
): string {
  const today = new Date().toISOString().slice(0, 10);
  const header = `# Evidence Ledger\n\n> Product: ${productName} | Last updated: ${today}\n\n| # | Claim | Evidence | Source | Date collected | Strength | Confidence | Notes | Staleness risk |\n|---|-------|----------|--------|----------------|----------|------------|-------|----------------|\n`;

  const rows = signals.map((s, idx) => {
    const claim = `Demand signal: ${s.title}`;
    const evidence = s.body_excerpt || s.title;
    const strength =
      (s.reactions_or_votes ?? 0) >= 5 || (s.comments_count ?? 0) >= 3
        ? "medium"
        : "weak";
    const notes = s.labels.length ? `Labels: ${s.labels.join(", ")}` : "";
    return `| ${idx + 1} | ${escapeCell(claim)} | ${escapeCell(evidence)} | ${escapeCell(s.url)} | ${today} | ${strength} | known | ${escapeCell(notes)} | medium |`;
  });

  return header + rows.join("\n") + "\n";
}

function escapeCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function buildScopeSummary(scope: {
  provider: string;
  repo?: string;
  file_path?: string;
  labels?: string[];
  state: string;
  limit: number;
  since?: string;
  include_body: boolean;
}): string {
  const parts = [`Provider: ${scope.provider}`];
  if (scope.repo) parts.push(`Repo: ${scope.repo}`);
  if (scope.file_path) parts.push(`File: ${scope.file_path}`);
  parts.push(`State: ${scope.state}`);
  if (scope.labels?.length) parts.push(`Labels: ${scope.labels.join(", ")}`);
  parts.push(`Limit: ${scope.limit}`);
  if (scope.since) parts.push(`Since: ${scope.since}`);
  parts.push(`Include body excerpts: ${scope.include_body}`);
  return parts.join(" · ");
}

export const PREVIEW_FIELDS = [
  "id",
  "title",
  "url",
  "state",
  "labels",
  "reactions_or_votes",
  "comments_count",
  "created_at",
  "updated_at",
  "author",
  "body_excerpt (max 200 chars when include_body enabled)",
];
