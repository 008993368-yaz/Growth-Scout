import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setFetchImpl, resetFetchImpl } from "../dist/lib/fetch.js";
import { runCompetitorSnapshot } from "../dist/lib/scout-pipeline.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "..", "src", "fixtures");

describe("competitor_snapshot", () => {
  afterEach(() => resetFetchImpl());

  it("returns partial success when pricing 404s", async () => {
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
        return new Response("Not Found", { status: 404 });
      }
      return new Response("<html><body>Other page</body></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    });

    const result = await runCompetitorSnapshot("https://example.com", [
      "/",
      "/pricing",
      "/features",
    ]);

    assert.equal(result.summary.total, 3);
    assert.ok(result.summary.succeeded >= 1);
    assert.ok(result.summary.failed >= 1);
  });
});
