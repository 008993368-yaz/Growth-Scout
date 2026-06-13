import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  fetchPage,
  setFetchImpl,
  resetFetchImpl,
} from "../dist/lib/fetch.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "..", "src", "fixtures");

function mockFetch(routes) {
  setFetchImpl(async (url) => {
    const pathname = new URL(url).pathname;
    const key = pathname === "/" ? "/" : pathname;
    const file = routes[key];
    if (!file) {
      return new Response("Not Found", { status: 404 });
    }
    const html = fs.readFileSync(path.join(fixturesDir, file), "utf8");
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html" },
    });
  });
}

describe("fetchPage", () => {
  afterEach(() => resetFetchImpl());

  it("extracts title and text from HTML", async () => {
    mockFetch({ "/": "homepage.html" });
    const result = await fetchPage("https://example.com/");
    assert.equal(result.confidence, "known");
    assert.match(result.title, /Acme Analytics/i);
    assert.match(result.text, /Slack integration/i);
    assert.equal(result.status_code, 200);
  });

  it("returns unknown on 403", async () => {
    setFetchImpl(async () => new Response("Forbidden", { status: 403 }));
    const result = await fetchPage("https://example.com/page");
    assert.equal(result.confidence, "unknown");
    assert.match(result.research_limit ?? "", /403/);
  });

  it("blocks localhost URLs", async () => {
    const result = await fetchPage("http://localhost/secret");
    assert.equal(result.confidence, "unknown");
    assert.match(result.error ?? result.research_limit ?? "", /Blocked/i);
  });
});
