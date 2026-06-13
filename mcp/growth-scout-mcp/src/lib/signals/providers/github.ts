import { makeExcerpt, nowIso } from "../../evidence.js";
import type { WorkItemScope, WorkItemSignal } from "../types.js";
import type { WorkItemProvider } from "./interface.js";

const GITHUB_API = "https://api.github.com";
const USER_AGENT =
  "GrowthScoutMCP/0.6.0 (+https://github.com/008993368-yaz/Growth-Scout)";

type FetchFn = typeof globalThis.fetch;
let customFetch: FetchFn | null = null;

export function setGithubFetchImpl(fn: FetchFn | null): void {
  customFetch = fn;
}

function getFetch(): FetchFn {
  return customFetch ?? globalThis.fetch;
}

interface GitHubIssue {
  number: number;
  title: string;
  html_url: string;
  state: string;
  labels: { name: string }[];
  reactions?: { total_count: number };
  comments: number;
  created_at: string;
  updated_at: string;
  user?: { login: string } | null;
  body?: string | null;
  pull_request?: unknown;
}

function parseRepo(repo: string): { owner: string; name: string } | null {
  const match = repo.match(/^([^/]+)\/([^/]+)$/);
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}

function buildIssuesUrl(scope: WorkItemScope): string | null {
  const parsed = parseRepo(scope.repo ?? "");
  if (!parsed) return null;
  const url = new URL(
    `${GITHUB_API}/repos/${parsed.owner}/${parsed.name}/issues`,
  );
  if (scope.state !== "all") url.searchParams.set("state", scope.state);
  url.searchParams.set("per_page", String(Math.min(scope.limit, 100)));
  url.searchParams.set("sort", "updated");
  url.searchParams.set("direction", "desc");
  if (scope.labels?.length) {
    url.searchParams.set("labels", scope.labels.join(","));
  }
  if (scope.since) {
    url.searchParams.set("since", scope.since);
  }
  return url.toString();
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeIssue(
  issue: GitHubIssue,
  includeBody: boolean,
  fetchedAt: string,
): WorkItemSignal {
  return {
    id: String(issue.number),
    title: issue.title,
    url: issue.html_url,
    state: issue.state === "closed" ? "closed" : "open",
    labels: issue.labels.map((l) => l.name),
    reactions_or_votes: issue.reactions?.total_count ?? null,
    comments_count: issue.comments ?? null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    author: issue.user?.login ?? null,
    body_excerpt:
      includeBody && issue.body ? makeExcerpt(issue.body, 200) : "",
    source: {
      provider: "github",
      fetched_at: fetchedAt,
      confidence: "known",
    },
  };
}

async function fetchIssues(
  scope: WorkItemScope,
  includeBody: boolean,
): Promise<{
  signals: WorkItemSignal[];
  estimated: number;
  research_limit?: string;
  error?: string;
}> {
  const issuesUrl = buildIssuesUrl(scope);
  if (!issuesUrl) {
    return {
      signals: [],
      estimated: 0,
      error: "invalid_repo_format",
      research_limit: "GitHub repo must be owner/repo format.",
    };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      signals: [],
      estimated: 0,
      error: "missing_github_token",
      research_limit:
        "Set GITHUB_TOKEN (read-only) for GitHub issue fetch, or use the file provider with .growth-scout/work-items.json.",
    };
  }

  const fetchedAt = nowIso();
  const fetchFn = getFetch();

  try {
    const response = await fetchFn(issuesUrl, { headers: authHeaders() });
    if (!response.ok) {
      const message = `GitHub API HTTP ${response.status}`;
      return {
        signals: [],
        estimated: 0,
        error: message,
        research_limit: message,
      };
    }

    const data = (await response.json()) as GitHubIssue[];
    const issues = data.filter((i) => !i.pull_request).slice(0, scope.limit);

    const signals = issues.map((issue) =>
      normalizeIssue(issue, includeBody, fetchedAt),
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

export function createGithubProvider(): WorkItemProvider {
  return {
    name: "github",
    async preview(scope) {
      const result = await fetchIssues(scope, false);
      return {
        estimated_items: result.estimated,
        token_required: !process.env.GITHUB_TOKEN,
        research_limit: result.research_limit,
        error: result.error,
      };
    },
    async fetch(scope) {
      const result = await fetchIssues(scope, scope.include_body);
      return {
        signals: result.signals,
        research_limit: result.research_limit,
        error: result.error,
      };
    },
  };
}
