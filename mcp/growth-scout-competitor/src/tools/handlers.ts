import { z } from "zod";
import { fetchPage } from "../lib/fetch.js";
import { runSearch } from "../lib/search/provider.js";
import { runCompetitorSnapshot, runScoutPipeline } from "../lib/scout-pipeline.js";

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
