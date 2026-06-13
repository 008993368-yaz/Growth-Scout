import type { WorkItemScope, WorkItemSignal } from "../types.js";

export interface WorkItemProvider {
  name: string;
  preview(scope: WorkItemScope): Promise<{
    estimated_items: number;
    token_required: boolean;
    research_limit?: string;
    error?: string;
  }>;
  fetch(scope: WorkItemScope): Promise<{
    signals: WorkItemSignal[];
    research_limit?: string;
    error?: string;
  }>;
}

export interface ProviderResult {
  provider: WorkItemProvider | null;
  research_limit?: string;
  error?: string;
}
