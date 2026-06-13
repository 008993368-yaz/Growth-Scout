export interface WorkItemSignal {
  id: string;
  title: string;
  url: string;
  state: "open" | "closed";
  labels: string[];
  reactions_or_votes: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at: string;
  author: string | null;
  body_excerpt: string;
  source: {
    provider: string;
    fetched_at: string;
    confidence: "known";
  };
}

export interface ThemeCluster {
  theme: string;
  count: number;
  item_ids: string[];
  sample_titles: string[];
}

export interface WorkItemPreviewOutput {
  preview_id: string;
  scope_summary: string;
  estimated_items: number;
  fields_if_confirmed: string[];
  token_required: boolean;
  expires_at: string;
  research_limit?: string;
  error?: string;
}

export interface WorkItemMineOutput {
  signals: WorkItemSignal[];
  theme_clusters: ThemeCluster[];
  ledger_markdown: string;
  fetched_at: string;
  provider: string;
  scope_summary: string;
  research_limit?: string;
  error?: string;
  user_consent_note?: string;
}

export interface WorkItemScope {
  provider: "github" | "file" | "gitlab" | "linear";
  repo?: string;
  file_path?: string;
  labels?: string[];
  state: "open" | "closed" | "all";
  limit: number;
  since?: string;
  include_body: boolean;
}

export type WorkItemRejectionCode =
  | "user_confirmation_required"
  | "preview_expired_or_invalid"
  | "scope_mismatch"
  | "not_implemented";
