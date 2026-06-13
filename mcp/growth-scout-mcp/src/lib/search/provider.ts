import type { SearchCandidate, SearchResult } from "../evidence.js";
import { nowIso } from "../evidence.js";

export interface SearchProvider {
  name: string;
  search(query: string, limit: number): Promise<SearchCandidate[]>;
}

const AGGREGATOR_DOMAINS = [
  "g2.com",
  "capterra.com",
  "trustpilot.com",
  "wikipedia.org",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "youtube.com",
  "reddit.com",
  "crunchbase.com",
  "softwareadvice.com",
  "getapp.com",
];

export function isAggregatorUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return AGGREGATOR_DOMAINS.some(
      (d) => host === d || host.endsWith(`.${d}`),
    );
  } catch {
    return true;
  }
}

export function scoreCandidate(
  candidate: SearchCandidate,
  competitorName: string,
): number {
  let score = 0;
  const nameLower = competitorName.toLowerCase();
  const titleLower = candidate.title.toLowerCase();
  const urlLower = candidate.url.toLowerCase();

  if (isAggregatorUrl(candidate.url)) score -= 50;

  if (titleLower.includes(nameLower)) score += 20;
  if (urlLower.includes(nameLower.replace(/\s+/g, ""))) score += 15;
  if (urlLower.includes(nameLower.replace(/\s+/g, "-"))) score += 15;
  if (urlLower.includes(nameLower.replace(/\s+/g, "_"))) score += 10;

  try {
    const u = new URL(candidate.url);
    if (u.pathname === "/" || u.pathname === "") score += 10;
    if (u.hostname.endsWith(".com")) score += 5;
  } catch {
    score -= 20;
  }

  return score;
}

export function pickBestUrl(
  candidates: SearchCandidate[],
  competitorName: string,
): { url: string; candidates: SearchCandidate[] } | null {
  if (candidates.length === 0) return null;
  const ranked = [...candidates].sort(
    (a, b) =>
      scoreCandidate(b, competitorName) - scoreCandidate(a, competitorName),
  );
  const best = ranked[0];
  if (!best || scoreCandidate(best, competitorName) < -40) return null;
  return { url: best.url, candidates: ranked.slice(0, 5) };
}

export function normalizeBaseUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}`;
}

export function getSearchProvider(): SearchProvider | null {
  const provider = (
    process.env.GROWTH_SCOUT_SEARCH_PROVIDER ?? "brave"
  ).toLowerCase();

  if (provider === "serper") {
    const key = process.env.SERPER_API_KEY;
    if (!key) return null;
    return createSerperProvider(key);
  }

  const braveKey = process.env.BRAVE_SEARCH_API_KEY;
  if (braveKey) return createBraveProvider(braveKey);

  if (provider === "brave") return null;

  const serperKey = process.env.SERPER_API_KEY;
  if (serperKey) return createSerperProvider(serperKey);

  return null;
}

function createBraveProvider(apiKey: string): SearchProvider {
  return {
    name: "brave",
    async search(query: string, limit: number): Promise<SearchCandidate[]> {
      const url = new URL("https://api.search.brave.com/res/v1/web/search");
      url.searchParams.set("q", query);
      url.searchParams.set("count", String(Math.min(limit, 10)));

      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Brave search failed: HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        web?: { results?: { url: string; title: string; description?: string }[] };
      };

      return (data.web?.results ?? []).map((r) => ({
        url: r.url,
        title: r.title,
        snippet: r.description ?? "",
      }));
    },
  };
}

function createSerperProvider(apiKey: string): SearchProvider {
  return {
    name: "serper",
    async search(query: string, limit: number): Promise<SearchCandidate[]> {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, num: Math.min(limit, 10) }),
      });

      if (!response.ok) {
        throw new Error(`Serper search failed: HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        organic?: { link: string; title: string; snippet?: string }[];
      };

      return (data.organic ?? []).map((r) => ({
        url: r.link,
        title: r.title,
        snippet: r.snippet ?? "",
      }));
    },
  };
}

export async function runSearch(
  query: string,
  limit = 5,
): Promise<SearchResult> {
  const fetchedAt = nowIso();
  const provider = getSearchProvider();

  if (!provider) {
    return {
      query,
      provider: "none",
      fetched_at: fetchedAt,
      confidence: "unknown",
      candidates: [],
      research_limit:
        "No search API key configured. Set BRAVE_SEARCH_API_KEY or SERPER_API_KEY. Supply explicit competitor URLs and use competitor_snapshot instead.",
      error: "missing_search_api_key",
    };
  }

  try {
    const candidates = await provider.search(query, limit);
    return {
      query,
      provider: provider.name,
      fetched_at: fetchedAt,
      confidence: "inferred",
      candidates,
      research_limit:
        "Search results are suggestions only; verify with fetch_page before scoring.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      query,
      provider: provider.name,
      fetched_at: fetchedAt,
      confidence: "unknown",
      candidates: [],
      research_limit: message,
      error: message,
    };
  }
}

export type { SearchProvider as ISearchProvider };
