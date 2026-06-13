import { createFileProvider } from "./providers/file.js";
import { createGithubProvider } from "./providers/github.js";
import { createGitlabProvider } from "./providers/gitlab.js";
import { createLinearProvider } from "./providers/linear.js";
import type { ProviderResult } from "./providers/interface.js";
import type { WorkItemScope } from "./types.js";

export function getWorkItemProvider(
  providerName: string,
  productRoot?: string,
): ProviderResult {
  const envDefault = process.env.GROWTH_SCOUT_WORK_ITEM_PROVIDER;
  const name = (providerName || envDefault || "").toLowerCase();
  const root =
    productRoot ?? process.env.GROWTH_SCOUT_PRODUCT_ROOT ?? process.cwd();

  switch (name) {
    case "github":
      return { provider: createGithubProvider() };
    case "file":
      return { provider: createFileProvider(root) };
    case "gitlab":
      return { provider: createGitlabProvider() };
    case "linear":
      return { provider: createLinearProvider() };
    default:
      return {
        provider: null,
        error: "unknown_provider",
        research_limit: `Unknown provider "${name}". Use github or file in v1.`,
      };
  }
}

export function validateScope(scope: WorkItemScope): string | null {
  if (scope.provider === "github" && !scope.repo) {
    return "repo is required for github provider";
  }
  if (scope.provider === "file" && scope.repo) {
    // repo optional for file — no error
  }
  if (
    (scope.provider === "gitlab" || scope.provider === "linear") &&
    scope.provider
  ) {
    return null;
  }
  return null;
}

export type { WorkItemScope };
