import { describe, it, afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  handlePreviewWorkItemMine,
  handleMineWorkItemSignals,
} from "../dist/tools/handlers.js";
import { clearPreviewStore } from "../dist/lib/signals/preview-store.js";

describe("work-item consent gates", () => {
  beforeEach(() => {
    clearPreviewStore();
  });

  afterEach(() => {
    clearPreviewStore();
  });

  it("rejects mine without confirmed: true", async () => {
    const result = await handleMineWorkItemSignals({
      preview_id: "00000000-0000-4000-8000-000000000000",
      confirmed: false,
    });
    assert.equal(result.rejection_code, "user_confirmation_required");
    assert.equal(result.error, "user_confirmation_required");
    assert.equal(result.signals.length, 0);
  });

  it("rejects mine with invalid preview_id", async () => {
    const result = await handleMineWorkItemSignals({
      preview_id: "00000000-0000-4000-8000-000000000000",
      confirmed: true,
    });
    assert.equal(result.rejection_code, "preview_expired_or_invalid");
    assert.equal(result.signals.length, 0);
  });

  it("requires preview before mine (no single-shot)", async () => {
    const preview = await handlePreviewWorkItemMine({
      provider: "file",
      file_path: "nonexistent.json",
    });

    const withoutConfirm = await handleMineWorkItemSignals({
      preview_id: preview.preview_id || "fake",
      confirmed: false,
    });
    assert.equal(withoutConfirm.rejection_code, "user_confirmation_required");
  });
});
