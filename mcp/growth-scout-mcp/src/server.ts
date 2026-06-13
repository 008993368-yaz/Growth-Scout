import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  competitorSnapshotSchema,
  fetchPageSchema,
  handleCompetitorSnapshot,
  handleFetchPage,
  handleMineWorkItemSignals,
  handlePreviewWorkItemMine,
  handleScoutCompetitors,
  handleSearchCompetitorPages,
  mineWorkItemSignalsSchema,
  previewWorkItemMineSchema,
  scoutCompetitorsSchema,
  searchSchema,
} from "./tools/handlers.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "growth-scout-mcp",
    version: "0.6.0",
  });

  server.registerTool(
    "scout_competitors",
    {
      description:
        "End-to-end competitor scout: given product category and 3-6 competitor names, discovers URLs, fetches public pages, and returns a draft competitor matrix plus evidence ledger rows. Output is a draft only — agent must review and classify gaps before scoring.",
      inputSchema: scoutCompetitorsSchema,
    },
    async (args) => {
      const result = await handleScoutCompetitors(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "fetch_page",
    {
      description:
        "Fetch a single public URL and return extracted text with evidence metadata (known/inferred/unknown).",
      inputSchema: fetchPageSchema,
    },
    async (args) => {
      const result = await handleFetchPage(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "competitor_snapshot",
    {
      description:
        "Fetch common competitor paths (/, /pricing, /features, /changelog, /docs) for one domain.",
      inputSchema: competitorSnapshotSchema,
    },
    async (args) => {
      const result = await handleCompetitorSnapshot(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "search_competitor_pages",
    {
      description:
        "Search for candidate competitor pages. Returns inferred suggestions only — verify with fetch_page before scoring.",
      inputSchema: searchSchema,
    },
    async (args) => {
      const result = await handleSearchCompetitorPages(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "preview_work_item_mine",
    {
      description:
        "Always call first before mining work-item demand signals. Shows scope summary and estimated item count without fetching issue bodies. Returns preview_id for use with mine_work_item_signals. Ask-first by design — never mine without user approval.",
      inputSchema: previewWorkItemMineSchema,
    },
    async (args) => {
      const result = await handlePreviewWorkItemMine(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "mine_work_item_signals",
    {
      description:
        "Fetch work-item demand signals after user approval. Requires preview_id from preview_work_item_mine and confirmed: true. Returns normalized signals, theme clusters, and evidence ledger markdown. No single-shot mine — preview + confirmation required.",
      inputSchema: mineWorkItemSignalsSchema,
    },
    async (args) => {
      const result = await handleMineWorkItemSignals(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  return server;
}
