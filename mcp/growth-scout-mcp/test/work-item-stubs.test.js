import { describe, it, afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  handlePreviewWorkItemMine,
  handleMineWorkItemSignals,
} from "../dist/tools/handlers.js";
import { clearPreviewStore } from "../dist/lib/signals/preview-store.js";

describe("work-item provider stubs", () => {
  beforeEach(() => {
    clearPreviewStore();
  });

  afterEach(() => {
    clearPreviewStore();
  });

  for (const provider of ["gitlab", "linear"]) {
    it(`${provider} preview returns not_implemented`, async () => {
      const preview = await handlePreviewWorkItemMine({
        provider,
        repo: "acme/app",
      });
      assert.equal(preview.error, "not_implemented");
      assert.equal(preview.preview_id, "");
      assert.ok(preview.research_limit?.includes("not implemented"));
    });
  }

  it("gitlab mine via stored preview still not_implemented if forced", async () => {
    const preview = await handlePreviewWorkItemMine({
      provider: "file",
    });
    if (preview.preview_id) {
      const result = await handleMineWorkItemSignals({
        preview_id: preview.preview_id,
        confirmed: true,
      });
      assert.ok(Array.isArray(result.signals));
    }
  });
});
