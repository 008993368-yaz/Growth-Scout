import { describe, it, afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  setGithubFetchImpl,
} from "../dist/lib/signals/providers/github.js";
import {
  handlePreviewWorkItemMine,
  handleMineWorkItemSignals,
} from "../dist/tools/handlers.js";
import { clearPreviewStore } from "../dist/lib/signals/preview-store.js";

describe("work-item GitHub provider", () => {
  const prevToken = process.env.GITHUB_TOKEN;

  beforeEach(() => {
    clearPreviewStore();
    process.env.GITHUB_TOKEN = "test-token";
  });

  afterEach(() => {
    clearPreviewStore();
    setGithubFetchImpl(null);
    if (prevToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = prevToken;
  });

  it("previews GitHub issues with metadata only", async () => {
    setGithubFetchImpl(async () =>
      Response.json([
        {
          number: 1,
          title: "Add SSO support",
          html_url: "https://github.com/acme/app/issues/1",
          state: "open",
          labels: [{ name: "enhancement" }],
          reactions: { total_count: 5 },
          comments: 3,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-06-01T00:00:00Z",
          user: { login: "user1" },
        },
      ]),
    );

    const preview = await handlePreviewWorkItemMine({
      provider: "github",
      repo: "acme/app",
      state: "open",
      limit: 25,
    });

    assert.ok(preview.preview_id);
    assert.equal(preview.estimated_items, 1);
    assert.match(preview.scope_summary, /acme\/app/);
  });

  it("mines with normalized schema after confirmation", async () => {
    setGithubFetchImpl(async () =>
      Response.json([
        {
          number: 1,
          title: "Add SSO support",
          html_url: "https://github.com/acme/app/issues/1",
          state: "open",
          labels: [{ name: "enhancement" }],
          reactions: { total_count: 5 },
          comments: 3,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-06-01T00:00:00Z",
          user: { login: "user1" },
          body: "We need SAML and OIDC for enterprise customers.",
        },
      ]),
    );

    const preview = await handlePreviewWorkItemMine({
      provider: "github",
      repo: "acme/app",
      include_body: true,
    });

    const result = await handleMineWorkItemSignals({
      preview_id: preview.preview_id,
      confirmed: true,
      user_consent_note: "Yes, proceed",
    });

    assert.equal(result.signals.length, 1);
    assert.equal(result.signals[0].source.confidence, "known");
    assert.equal(result.signals[0].source.provider, "github");
    assert.equal(result.signals[0].state, "open");
    assert.ok(result.ledger_markdown.includes("Evidence Ledger"));
    assert.ok(result.theme_clusters.length >= 1);
  });

  it("fails gracefully without GITHUB_TOKEN", async () => {
    delete process.env.GITHUB_TOKEN;
    const preview = await handlePreviewWorkItemMine({
      provider: "github",
      repo: "acme/app",
    });
    assert.equal(preview.token_required, true);
    assert.ok(preview.research_limit?.includes("GITHUB_TOKEN"));
  });
});
