import dns from "node:dns/promises";
import net from "node:net";
import {
  type FetchResult,
  makeExcerpt,
  nowIso,
  truncate,
} from "./evidence.js";
import { htmlToText, extractTitle } from "./extract.js";

const TIMEOUT_MS = 10_000;
const MAX_BYTES = 1_500_000;
const USER_AGENT =
  "GrowthScoutMCP/0.6.0 (+https://github.com/008993368-yaz/Growth-Scout)";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 0) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    if (normalized === "::1") return true;
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    if (normalized.startsWith("fe80")) return true;
  }
  return false;
}

export async function assertSafeUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Unsupported protocol: ${parsed.protocol}`);
  }
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new Error(`Blocked hostname: ${hostname}`);
  }
  if (net.isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error(`Blocked private IP: ${hostname}`);
  }
  const addresses = await dns.lookup(hostname, { all: true });
  for (const addr of addresses) {
    if (isPrivateIp(addr.address)) {
      throw new Error(`Blocked private IP for ${hostname}: ${addr.address}`);
    }
  }
  return parsed;
}

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

let fetchImpl: FetchFn = globalThis.fetch.bind(globalThis);

export function setFetchImpl(fn: FetchFn): void {
  fetchImpl = fn;
}

export function resetFetchImpl(): void {
  fetchImpl = globalThis.fetch.bind(globalThis);
}

export async function fetchPage(
  rawUrl: string,
  purpose?: string,
): Promise<FetchResult> {
  const fetchedAt = nowIso();
  try {
    const url = await assertSafeUrl(rawUrl);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetchImpl(url.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
      });
    } finally {
      clearTimeout(timer);
    }

    const contentType = response.headers.get("content-type");
    const statusCode = response.status;

    if (
      statusCode === 403 ||
      statusCode === 404 ||
      statusCode === 429 ||
      statusCode >= 500
    ) {
      return {
        source_url: url.toString(),
        fetched_at: fetchedAt,
        confidence: "unknown",
        research_limit:
          statusCode === 404
            ? `HTTP 404; path not found.`
            : `HTTP ${statusCode}; site may block automated fetch. Ask user for a link or paste.`,
        title: "",
        excerpt: "",
        text: "",
        status_code: statusCode,
        content_type: contentType,
        notes: purpose ? [`purpose: ${purpose}`] : [],
        error: `HTTP ${statusCode}`,
      };
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      return {
        source_url: url.toString(),
        fetched_at: fetchedAt,
        confidence: "unknown",
        research_limit: "Response exceeded size cap (1.5 MB).",
        title: "",
        excerpt: "",
        text: "",
        status_code: statusCode,
        content_type: contentType,
        notes: [],
        error: "Response too large",
      };
    }

    const rawBody = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    const isHtml =
      !contentType ||
      contentType.includes("html") ||
      contentType.includes("xml") ||
      rawBody.trimStart().startsWith("<");

    const text = isHtml ? htmlToText(rawBody) : rawBody;
    const title = isHtml ? extractTitle(rawBody) : "";
    const truncated = truncate(text);

    return {
      source_url: url.toString(),
      fetched_at: fetchedAt,
      confidence: "known",
      research_limit: null,
      title,
      excerpt: makeExcerpt(truncated),
      text: truncated,
      status_code: statusCode,
      content_type: contentType,
      notes: purpose ? [`purpose: ${purpose}`] : [],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      source_url: rawUrl,
      fetched_at: fetchedAt,
      confidence: "unknown",
      research_limit: message.includes("abort")
        ? "Fetch timed out after 10s."
        : `Fetch failed: ${message}`,
      title: "",
      excerpt: "",
      text: "",
      status_code: null,
      content_type: null,
      notes: purpose ? [`purpose: ${purpose}`] : [],
      error: message,
    };
  }
}

export const DEFAULT_SNAPSHOT_PATHS = [
  "/",
  "/pricing",
  "/features",
  "/changelog",
  "/docs",
];

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]!);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    worker(),
  );
  await Promise.all(workers);
  return results;
}
