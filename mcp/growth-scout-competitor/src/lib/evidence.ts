export type Confidence = "known" | "inferred" | "unknown";

export interface FetchResult {
  source_url: string;
  fetched_at: string;
  confidence: Confidence;
  research_limit: string | null;
  title: string;
  excerpt: string;
  text: string;
  status_code: number | null;
  content_type: string | null;
  notes: string[];
  error?: string;
}

export interface FieldValue {
  value: string;
  confidence: Confidence;
  source_url: string;
  excerpt?: string;
}

export interface SearchCandidate {
  url: string;
  title: string;
  snippet: string;
}

export interface SearchResult {
  query: string;
  provider: string;
  fetched_at: string;
  confidence: Confidence;
  candidates: SearchCandidate[];
  research_limit: string | null;
  error?: string;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function truncate(text: string, max = 8000): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n… [truncated]`;
}

export function makeExcerpt(text: string, max = 400): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max)}…`;
}
