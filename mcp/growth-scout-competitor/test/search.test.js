import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { runSearch } from "../dist/lib/search/provider.js";

describe("search_competitor_pages", () => {
  const prevBrave = process.env.BRAVE_SEARCH_API_KEY;
  const prevSerper = process.env.SERPER_API_KEY;

  afterEach(() => {
    if (prevBrave === undefined) delete process.env.BRAVE_SEARCH_API_KEY;
    else process.env.BRAVE_SEARCH_API_KEY = prevBrave;
    if (prevSerper === undefined) delete process.env.SERPER_API_KEY;
    else process.env.SERPER_API_KEY = prevSerper;
  });

  it("returns graceful research_limit when no API key", async () => {
    delete process.env.BRAVE_SEARCH_API_KEY;
    delete process.env.SERPER_API_KEY;
    const result = await runSearch("Acme analytics pricing", 5);
    assert.equal(result.confidence, "unknown");
    assert.equal(result.candidates.length, 0);
    assert.match(result.research_limit ?? "", /BRAVE_SEARCH_API_KEY|SERPER_API_KEY/);
  });
});
