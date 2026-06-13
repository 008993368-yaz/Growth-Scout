import {
  DEFAULT_SNAPSHOT_PATHS,
  fetchPage,
  mapWithConcurrency,
} from "./fetch.js";
import { extractFieldsFromSnapshots, suggestTier } from "./extract-fields.js";
import { buildMatrixDraft, type CompetitorDraft } from "./matrix-draft.js";
import { nowIso } from "./evidence.js";
import {
  getSearchProvider,
  normalizeBaseUrl,
  pickBestUrl,
  runSearch,
} from "./search/provider.js";

export interface ScoutInput {
  product_category: string;
  competitor_names: string[];
  your_product_name?: string;
  your_product_url?: string;
  capability_rows?: string[];
  competitor_urls?: Record<string, string>;
}

export interface ScoutOutput {
  fetched_at: string;
  product_category: string;
  competitors: CompetitorDraft[];
  matrix_markdown: string;
  evidence_ledger_rows: Record<string, string>[];
  research_limits: string[];
  staleness_disclaimer: string;
  error?: string;
}

async function resolveCompetitorUrl(
  name: string,
  category: string,
  explicitUrl?: string,
): Promise<{ base_url: string; candidates: { url: string; title: string; snippet: string }[] }> {
  if (explicitUrl) {
    return { base_url: normalizeBaseUrl(explicitUrl), candidates: [] };
  }

  const provider = getSearchProvider();
  if (!provider) {
    throw new Error(
      `No search API key for resolving "${name}". Set BRAVE_SEARCH_API_KEY or SERPER_API_KEY, or pass competitor_urls.`,
    );
  }

  const queries = [
    `${name} official site`,
    `${name} ${category}`,
    `${name} pricing`,
  ];

  const allCandidates: { url: string; title: string; snippet: string }[] = [];

  for (const query of queries) {
    const result = await runSearch(query, 5);
    allCandidates.push(...result.candidates);
  }

  const picked = pickBestUrl(allCandidates, name);
  if (!picked) {
    throw new Error(
      `Could not resolve official URL for "${name}" from search results.`,
    );
  }

  return {
    base_url: normalizeBaseUrl(picked.url),
    candidates: picked.candidates,
  };
}

async function snapshotCompetitor(baseUrl: string, paths?: string[]) {
  const pathList = paths ?? DEFAULT_SNAPSHOT_PATHS;
  const snapshots = await mapWithConcurrency(pathList, 3, async (p) => {
    const url =
      p === "/"
        ? `${baseUrl}/`
        : `${baseUrl.replace(/\/$/, "")}${p.startsWith("/") ? p : `/${p}`}`;
    return fetchPage(url, p === "/pricing" ? "pricing" : p === "/features" ? "marketing" : "other");
  });
  return snapshots;
}

export async function runScoutPipeline(input: ScoutInput): Promise<ScoutOutput> {
  const fetchedAt = nowIso();
  const researchLimits: string[] = [];
  const names = input.competitor_names.slice(0, 6);

  if (names.length === 0) {
    return {
      fetched_at: fetchedAt,
      product_category: input.product_category,
      competitors: [],
      matrix_markdown: "",
      evidence_ledger_rows: [],
      research_limits: ["No competitor names provided."],
      staleness_disclaimer: "",
      error: "competitor_names required (1-6)",
    };
  }

  const hasSearch = !!getSearchProvider();
  const hasExplicitUrls =
    input.competitor_urls &&
    Object.keys(input.competitor_urls).length > 0;

  if (!hasSearch && !hasExplicitUrls) {
    return {
      fetched_at: fetchedAt,
      product_category: input.product_category,
      competitors: [],
      matrix_markdown: "",
      evidence_ledger_rows: [],
      research_limits: [
        "No search API key configured. Set BRAVE_SEARCH_API_KEY or SERPER_API_KEY.",
        "Alternatively, pass competitor_urls and use competitor_snapshot directly.",
      ],
      staleness_disclaimer: "",
      error: "missing_search_api_key",
    };
  }

  researchLimits.push(
    "Search API used to resolve URLs where explicit URLs not provided; verify domains before scoring.",
  );

  const competitors: CompetitorDraft[] = [];
  let unknownFetchCount = 0;

  for (const name of names) {
    try {
      const explicitUrl = input.competitor_urls?.[name];
      const { base_url, candidates } = await resolveCompetitorUrl(
        name,
        input.product_category,
        explicitUrl,
      );

      const snapshots = await snapshotCompetitor(base_url);
      unknownFetchCount += snapshots.filter(
        (s) => s.confidence === "unknown" || !s.text,
      ).length;

      const fields = extractFieldsFromSnapshots(name, snapshots);

      competitors.push({
        name,
        base_url,
        tier_suggestion: suggestTier(name, input.product_category),
        url_candidates: candidates,
        snapshots,
        fields,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      researchLimits.push(`Failed to scout ${name}: ${message}`);
      competitors.push({
        name,
        base_url: "",
        tier_suggestion: "direct",
        url_candidates: [],
        snapshots: [],
        fields: extractFieldsFromSnapshots(name, []),
      });
    }
  }

  let yourFields;
  let yourSnapshots;
  if (input.your_product_url) {
    yourSnapshots = await snapshotCompetitor(
      normalizeBaseUrl(input.your_product_url),
    );
    yourFields = extractFieldsFromSnapshots(
      input.your_product_name ?? "Us",
      yourSnapshots,
    );
  }

  if (unknownFetchCount > 0) {
    researchLimits.push(
      `${unknownFetchCount} page fetch(es) returned Unknown or empty; matrix cells may be Unknown.`,
    );
  }

  const draft = buildMatrixDraft({
    fetched_at: fetchedAt,
    product_category: input.product_category,
    your_product_name: input.your_product_name ?? "Us",
    your_product_url: input.your_product_url,
    your_snapshots: yourSnapshots,
    your_fields: yourFields,
    competitors,
    capability_rows: input.capability_rows,
    research_limits: researchLimits,
  });

  return {
    fetched_at: fetchedAt,
    product_category: input.product_category,
    competitors,
    matrix_markdown: draft.matrix_markdown,
    evidence_ledger_rows: draft.evidence_ledger_rows,
    research_limits: researchLimits,
    staleness_disclaimer: `Sources collected ${fetchedAt.slice(0, 10)}; refresh if older than 12 months before scoring.`,
  };
}

export async function runCompetitorSnapshot(
  baseUrl: string,
  paths?: string[],
) {
  const normalized = normalizeBaseUrl(baseUrl);
  const snapshots = await snapshotCompetitor(normalized, paths);
  const succeeded = snapshots.filter((s) => s.confidence === "known").length;
  return {
    base_url: normalized,
    fetched_at: nowIso(),
    paths: paths ?? DEFAULT_SNAPSHOT_PATHS,
    snapshots,
    summary: {
      total: snapshots.length,
      succeeded,
      failed: snapshots.length - succeeded,
    },
  };
}
