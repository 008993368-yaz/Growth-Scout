import { randomUUID } from "node:crypto";
import type { WorkItemScope } from "./types.js";

const TTL_MS = 15 * 60 * 1000;

interface StoredPreview {
  scope: WorkItemScope;
  expires_at: string;
}

const store = new Map<string, StoredPreview>();

export function createPreview(scope: WorkItemScope): {
  preview_id: string;
  expires_at: string;
} {
  const preview_id = randomUUID();
  const expires_at = new Date(Date.now() + TTL_MS).toISOString();
  store.set(preview_id, { scope, expires_at });
  return { preview_id, expires_at };
}

export function getPreview(
  preview_id: string,
): { scope: WorkItemScope; expires_at: string } | null {
  const entry = store.get(preview_id);
  if (!entry) return null;
  if (Date.now() > Date.parse(entry.expires_at)) {
    store.delete(preview_id);
    return null;
  }
  return entry;
}

export function clearPreviewStore(): void {
  store.clear();
}

export function previewStoreSize(): number {
  return store.size;
}
