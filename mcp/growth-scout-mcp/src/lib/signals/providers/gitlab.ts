import type { WorkItemScope } from "../types.js";
import type { WorkItemProvider } from "./interface.js";

const RESEARCH_LIMIT =
  "GitLab provider is not implemented in v1. Export issues to .growth-scout/work-items.json and use the file provider, or wait for a future release.";

export function createGitlabProvider(): WorkItemProvider {
  return {
    name: "gitlab",
    async preview(_scope: WorkItemScope) {
      return {
        estimated_items: 0,
        token_required: true,
        research_limit: RESEARCH_LIMIT,
        error: "not_implemented",
      };
    },
    async fetch(_scope: WorkItemScope) {
      return {
        signals: [],
        research_limit: RESEARCH_LIMIT,
        error: "not_implemented",
      };
    },
  };
}
