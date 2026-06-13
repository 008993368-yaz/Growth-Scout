import { z } from "zod";
import { fetchPage } from "../lib/fetch.js";
import { runSearch } from "../lib/search/provider.js";
import { runCompetitorSnapshot, runScoutPipeline } from "../lib/scout-pipeline.js";
import {
  buildLedgerMarkdown,
  buildScopeSummary,
  clusterThemes,
  PREVIEW_FIELDS,
} from "../lib/signals/pipeline.js";
import { createPreview, getPreview } from "../lib/signals/preview-store.js";
import { getWorkItemProvider } from "../lib/signals/provider-registry.js";
import type {
  WorkItemMineOutput,
  WorkItemPreviewOutput,
  WorkItemScope,
} from "../lib/signals/types.js";
import { nowIso } from "../lib/evidence.js";

export const fetchPageSchema = {
  url: z.string().url(),
  purpose: z
    .enum(["marketing", "pricing", "docs", "changelog", "other"])
    .optional(),
};

export const competitorSnapshotSchema = {
  base_url: z.string().url(),
  paths: z.array(z.string()).optional(),
};

export const searchSchema = {
  query: z.string().min(1),
  limit: z.number().int().min(1).max(10).optional(),
};

export const scoutCompetitorsSchema = {
  product_category: z.string().min(1),
  competitor_names: z.array(z.string().min(1)).min(1).max(6),
  your_product_name: z.string().optional(),
  your_product_url: z.string().url().optional(),
  capability_rows: z.array(z.string()).optional(),
  competitor_urls: z.record(z.string(), z.string().url()).optional(),
};

export const previewWorkItemMineSchema = {
  provider: z.enum(["github", "file", "gitlab", "linear"]),
  repo: z.string().optional(),
  file_path: z.string().optional(),
  labels: z.array(z.string()).optional(),
  state: z.enum(["open", "closed", "all"]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  since: z.string().optional(),
  include_body: z.boolean().optional(),
};

export const mineWorkItemSignalsSchema = {
  preview_id: z.string().uuid(),
  confirmed: z.boolean(),
  user_consent_note: z.string().optional(),
};

export type FetchPageArgs = {
  url: string;
  purpose?: "marketing" | "pricing" | "docs" | "changelog" | "other";
};

export type CompetitorSnapshotArgs = {
  base_url: string;
  paths?: string[];
};

export type SearchArgs = {
  query: string;
  limit?: number;
};

export type ScoutCompetitorsArgs = {
  product_category: string;
  competitor_names: string[];
  your_product_name?: string;
  your_product_url?: string;
  capability_rows?: string[];
  competitor_urls?: Record<string, string>;
};

export type PreviewWorkItemMineArgs = {
  provider: "github" | "file" | "gitlab" | "linear";
  repo?: string;
  file_path?: string;
  labels?: string[];
  state?: "open" | "closed" | "all";
  limit?: number;
  since?: string;
  include_body?: boolean;
};

export type MineWorkItemSignalsArgs = {
  preview_id: string;
  confirmed: boolean;
  user_consent_note?: string;
};

export async function handleFetchPage(args: FetchPageArgs) {
  return fetchPage(args.url, args.purpose);
}

export async function handleCompetitorSnapshot(args: CompetitorSnapshotArgs) {
  return runCompetitorSnapshot(args.base_url, args.paths);
}

export async function handleSearchCompetitorPages(args: SearchArgs) {
  return runSearch(args.query, args.limit ?? 5);
}

export async function handleScoutCompetitors(args: ScoutCompetitorsArgs) {
  return runScoutPipeline(args);
}

function buildScope(args: PreviewWorkItemMineArgs): WorkItemScope {
  return {
    provider: args.provider,
    repo: args.repo,
    file_path: args.file_path,
    labels: args.labels,
    state: args.state ?? "open",
    limit: args.limit ?? 25,
    since: args.since,
    include_body: args.include_body ?? false,
  };
}

export async function handlePreviewWorkItemMine(
  args: PreviewWorkItemMineArgs,
): Promise<WorkItemPreviewOutput> {
  const scope = buildScope(args);
  const scopeSummary = buildScopeSummary(scope);
  const productRoot = process.env.GROWTH_SCOUT_PRODUCT_ROOT;

  if (scope.provider === "github" && !scope.repo) {
    return {
      preview_id: "",
      scope_summary: scopeSummary,
      estimated_items: 0,
      fields_if_confirmed: PREVIEW_FIELDS,
      token_required: true,
      expires_at: "",
      error: "repo_required",
      research_limit: "repo (owner/repo) is required for github provider.",
    };
  }

  const { provider, research_limit, error } = getWorkItemProvider(
    scope.provider,
    productRoot,
  );

  if (!provider) {
    return {
      preview_id: "",
      scope_summary: scopeSummary,
      estimated_items: 0,
      fields_if_confirmed: PREVIEW_FIELDS,
      token_required: false,
      expires_at: "",
      error: error ?? "unknown_provider",
      research_limit,
    };
  }

  const previewResult = await provider.preview(scope);

  if (previewResult.error === "not_implemented") {
    return {
      preview_id: "",
      scope_summary: scopeSummary,
      estimated_items: 0,
      fields_if_confirmed: PREVIEW_FIELDS,
      token_required: previewResult.token_required,
      expires_at: "",
      error: "not_implemented",
      research_limit: previewResult.research_limit,
    };
  }

  const { preview_id, expires_at } = createPreview(scope);

  return {
    preview_id,
    scope_summary: scopeSummary,
    estimated_items: previewResult.estimated_items,
    fields_if_confirmed: PREVIEW_FIELDS,
    token_required: previewResult.token_required,
    expires_at,
    research_limit: previewResult.research_limit,
    error: previewResult.error,
  };
}

export async function handleMineWorkItemSignals(
  args: MineWorkItemSignalsArgs,
): Promise<WorkItemMineOutput & { rejection_code?: string }> {
  if (args.confirmed !== true) {
    return {
      signals: [],
      theme_clusters: [],
      ledger_markdown: "",
      fetched_at: nowIso(),
      provider: "",
      scope_summary: "",
      rejection_code: "user_confirmation_required",
      error: "user_confirmation_required",
      research_limit:
        "Mining requires explicit user approval. Call preview_work_item_mine first, show scope to the user, then call mine_work_item_signals with confirmed: true.",
    };
  }

  const stored = getPreview(args.preview_id);
  if (!stored) {
    return {
      signals: [],
      theme_clusters: [],
      ledger_markdown: "",
      fetched_at: nowIso(),
      provider: "",
      scope_summary: "",
      rejection_code: "preview_expired_or_invalid",
      error: "preview_expired_or_invalid",
      research_limit:
        "Preview ID is invalid or expired (TTL ~15 min). Run preview_work_item_mine again.",
    };
  }

  const scope = stored.scope;
  const scopeSummary = buildScopeSummary(scope);
  const productRoot = process.env.GROWTH_SCOUT_PRODUCT_ROOT;
  const { provider, research_limit, error } = getWorkItemProvider(
    scope.provider,
    productRoot,
  );

  if (!provider) {
    return {
      signals: [],
      theme_clusters: [],
      ledger_markdown: "",
      fetched_at: nowIso(),
      provider: scope.provider,
      scope_summary: scopeSummary,
      error: error ?? "unknown_provider",
      research_limit,
    };
  }

  const fetchResult = await provider.fetch(scope);
  const signals = fetchResult.signals;
  const theme_clusters = clusterThemes(signals);
  const ledger_markdown = buildLedgerMarkdown(signals);

  return {
    signals,
    theme_clusters,
    ledger_markdown,
    fetched_at: nowIso(),
    provider: scope.provider,
    scope_summary: scopeSummary,
    research_limit: fetchResult.research_limit ?? research_limit,
    error: fetchResult.error,
    user_consent_note: args.user_consent_note,
  };
}
