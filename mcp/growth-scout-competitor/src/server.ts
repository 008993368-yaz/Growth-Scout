import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  competitorSnapshotSchema,
  fetchPageSchema,
  handleCompetitorSnapshot,
  handleFetchPage,
  handleScoutCompetitors,
  handleSearchCompetitorPages,
  scoutCompetitorsSchema,
  searchSchema,
} from "./tools/handlers.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "growth-scout-competitor",
    version: "0.4.0",
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

  return server;
}
