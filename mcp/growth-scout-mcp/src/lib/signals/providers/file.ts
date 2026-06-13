import fs from "node:fs";
import path from "node:path";
import { makeExcerpt, nowIso } from "../../evidence.js";
import type { WorkItemScope, WorkItemSignal } from "../types.js";
import type { WorkItemProvider } from "./interface.js";

const DEFAULT_FILE = ".growth-scout/work-items.json";

export function resolveFilePath(
  filePath: string | undefined,
  productRoot: string,
): { absolute: string; error?: string } {
  const relative = filePath ?? DEFAULT_FILE;
  const root = path.resolve(productRoot);

  if (relative.includes("..")) {
    return {
      absolute: "",
      error: "path_traversal_rejected",
    };
  }

  const absolute = path.resolve(root, relative);
  const relativeCheck = path.relative(root, absolute);
  if (relativeCheck.startsWith("..") || path.isAbsolute(relativeCheck)) {
    return {
      absolute: "",
      error: "path_outside_repo_root",
    };
  }

  return { absolute };
}

interface FileWorkItem {
  id: string;
  title: string;
  url: string;
  state: "open" | "closed";
  labels?: string[];
  reactions_or_votes?: number | null;
  comments_count?: number | null;
  created_at: string;
  updated_at: string;
  author?: string | null;
  body?: string | null;
}

interface FileExport {
  items: FileWorkItem[];
}

function filterItems(
  items: FileWorkItem[],
  scope: WorkItemScope,
): FileWorkItem[] {
  let filtered = items;

  if (scope.state !== "all") {
    filtered = filtered.filter((i) => i.state === scope.state);
  }

  if (scope.labels?.length) {
    const labelSet = new Set(scope.labels.map((l) => l.toLowerCase()));
    filtered = filtered.filter((i) =>
      (i.labels ?? []).some((l) => labelSet.has(l.toLowerCase())),
    );
  }

  if (scope.since) {
    const sinceMs = Date.parse(scope.since);
    if (!Number.isNaN(sinceMs)) {
      filtered = filtered.filter(
        (i) => Date.parse(i.updated_at) >= sinceMs,
      );
    }
  }

  return filtered.slice(0, scope.limit);
}

function normalizeFileItem(
  item: FileWorkItem,
  includeBody: boolean,
  fetchedAt: string,
): WorkItemSignal {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    state: item.state,
    labels: item.labels ?? [],
    reactions_or_votes: item.reactions_or_votes ?? null,
    comments_count: item.comments_count ?? null,
    created_at: item.created_at,
    updated_at: item.updated_at,
    author: item.author ?? null,
    body_excerpt:
      includeBody && item.body ? makeExcerpt(item.body, 200) : "",
    source: {
      provider: "file",
      fetched_at: fetchedAt,
      confidence: "known",
    },
  };
}

function readFileItems(
  scope: WorkItemScope,
  productRoot: string,
  includeBody: boolean,
): {
  signals: WorkItemSignal[];
  estimated: number;
  research_limit?: string;
  error?: string;
} {
  const resolved = resolveFilePath(scope.file_path, productRoot);
  if (resolved.error) {
    return {
      signals: [],
      estimated: 0,
      error: resolved.error,
      research_limit:
        resolved.error === "path_traversal_rejected"
          ? "File path must not contain .. segments."
          : "File path must be within the product repo root.",
    };
  }

  if (!fs.existsSync(resolved.absolute)) {
    return {
      signals: [],
      estimated: 0,
      error: "file_not_found",
      research_limit: `Work items file not found: ${scope.file_path ?? DEFAULT_FILE}`,
    };
  }

  try {
    const raw = fs.readFileSync(resolved.absolute, "utf8");
    const data = JSON.parse(raw) as FileExport;
    if (!Array.isArray(data.items)) {
      return {
        signals: [],
        estimated: 0,
        error: "invalid_file_format",
        research_limit: "File must contain an items array. See templates/work-items-export-template.json.",
      };
    }

    const filtered = filterItems(data.items, scope);
    const fetchedAt = nowIso();
    const signals = filtered.map((item) =>
      normalizeFileItem(item, includeBody, fetchedAt),
    );

    return { signals, estimated: signals.length };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      signals: [],
      estimated: 0,
      error: message,
      research_limit: message,
    };
  }
}

export function createFileProvider(productRoot?: string): WorkItemProvider {
  const root = productRoot ?? process.cwd();
  return {
    name: "file",
    async preview(scope) {
      const result = readFileItems(scope, root, false);
      return {
        estimated_items: result.estimated,
        token_required: false,
        research_limit: result.research_limit,
        error: result.error,
      };
    },
    async fetch(scope) {
      const result = readFileItems(scope, root, scope.include_body);
      return {
        signals: result.signals,
        research_limit: result.research_limit,
        error: result.error,
      };
    },
  };
}
