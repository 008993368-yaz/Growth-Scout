import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildMatrixDraft } from "../dist/lib/matrix-draft.js";
import { extractFieldsFromSnapshots } from "../dist/lib/extract-fields.js";

describe("matrix-draft", () => {
  it("builds markdown with competitor names and Unknown cells", () => {
    const snapshots = [
      {
        source_url: "https://comp-a.example/",
        fetched_at: "2026-06-12T00:00:00.000Z",
        confidence: "known",
        research_limit: null,
        title: "Comp A — Analytics",
        excerpt: "Analytics for teams with API and Slack",
        text: "Analytics platform for teams. API access. Slack integration. SSO.",
        status_code: 200,
        content_type: "text/html",
        notes: [],
      },
    ];

    const fields = extractFieldsFromSnapshots("Comp A", snapshots);

    const draft = buildMatrixDraft({
      fetched_at: "2026-06-12T00:00:00.000Z",
      product_category: "collaborative analytics",
      your_product_name: "Us",
      competitors: [
        {
          name: "Comp A",
          base_url: "https://comp-a.example",
          tier_suggestion: "direct",
          url_candidates: [],
          snapshots,
          fields,
        },
        {
          name: "Comp B",
          base_url: "",
          tier_suggestion: "direct",
          url_candidates: [],
          snapshots: [],
          fields: extractFieldsFromSnapshots("Comp B", []),
        },
      ],
      research_limits: ["Comp B fetch failed"],
    });

    assert.match(draft.matrix_markdown, /Comp A/);
    assert.match(draft.matrix_markdown, /Comp B/);
    assert.match(draft.matrix_markdown, /Unknown/);
    assert.match(draft.matrix_markdown, /Draft only/);
    assert.ok(draft.evidence_ledger_rows.length >= 1);
  });
});
