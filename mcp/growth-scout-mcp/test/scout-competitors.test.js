import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setFetchImpl, resetFetchImpl } from "../dist/lib/fetch.js";
import { runScoutPipeline } from "../dist/lib/scout-pipeline.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "..", "src", "fixtures");

describe("scout_competitors", () => {
  const prevBrave = process.env.BRAVE_SEARCH_API_KEY;

  afterEach(() => {
    resetFetchImpl();
    if (prevBrave === undefined) delete process.env.BRAVE_SEARCH_API_KEY;
    else process.env.BRAVE_SEARCH_API_KEY = prevBrave;
  });

  it("fails gracefully without search key when no explicit URLs", async () => {
    delete process.env.BRAVE_SEARCH_API_KEY;
    const result = await runScoutPipeline({
      product_category: "collaborative analytics",
      competitor_names: ["Comp A", "Comp B", "Comp C"],
    });
    assert.equal(result.error, "missing_search_api_key");
    assert.ok(result.research_limits.length > 0);
  });

  it("scouts with explicit competitor_urls", async () => {
    setFetchImpl(async (url) => {
      const pathname = new URL(url).pathname;
      if (pathname === "/" || pathname === "") {
        const html = fs.readFileSync(
          path.join(fixturesDir, "homepage.html"),
          "utf8",
        );
        return new Response(html, {
          status: 200,
          headers: { "content-type": "text/html" },
        });
      }
      if (pathname === "/pricing") {
        const html = fs.readFileSync(
          path.join(fixturesDir, "pricing.html"),
          "utf8",
        );
        return new Response(html, {
          status: 200,
          headers: { "content-type": "text/html" },
        });
      }
      return new Response("Not Found", { status: 404 });
    });

    const result = await runScoutPipeline({
      product_category: "collaborative analytics",
      competitor_names: ["Acme Analytics", "Beta BI"],
      competitor_urls: {
        "Acme Analytics": "https://example.com",
        "Beta BI": "https://example.org",
      },
      your_product_name: "Chartflow",
    });

    assert.equal(result.competitors.length, 2);
    assert.match(result.matrix_markdown, /Acme Analytics/);
    assert.match(result.matrix_markdown, /Beta BI/);
    assert.match(result.matrix_markdown, /Chartflow/);
    assert.ok(result.staleness_disclaimer.includes("2026"));
  });
});
