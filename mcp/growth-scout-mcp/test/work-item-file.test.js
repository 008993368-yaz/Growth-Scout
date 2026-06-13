import { describe, it, afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  handlePreviewWorkItemMine,
  handleMineWorkItemSignals,
} from "../dist/tools/handlers.js";
import { clearPreviewStore } from "../dist/lib/signals/preview-store.js";
import { resolveFilePath } from "../dist/lib/signals/providers/file.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "templates",
  "work-items-export-template.json",
);

describe("work-item file provider", () => {
  let tmpDir;
  let prevRoot;

  beforeEach(() => {
    clearPreviewStore();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gs-work-items-"));
    fs.mkdirSync(path.join(tmpDir, ".growth-scout"), { recursive: true });
    fs.copyFileSync(
      fixturePath,
      path.join(tmpDir, ".growth-scout", "work-items.json"),
    );
    prevRoot = process.env.GROWTH_SCOUT_PRODUCT_ROOT;
    process.env.GROWTH_SCOUT_PRODUCT_ROOT = tmpDir;
  });

  afterEach(() => {
    clearPreviewStore();
    if (prevRoot === undefined) delete process.env.GROWTH_SCOUT_PRODUCT_ROOT;
    else process.env.GROWTH_SCOUT_PRODUCT_ROOT = prevRoot;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("previews file provider item count", async () => {
    const preview = await handlePreviewWorkItemMine({
      provider: "file",
    });
    assert.ok(preview.preview_id);
    assert.equal(preview.estimated_items, 2);
    assert.equal(preview.token_required, false);
  });

  it("mines file items with identical normalized schema", async () => {
    const preview = await handlePreviewWorkItemMine({
      provider: "file",
      state: "open",
      include_body: true,
    });

    const result = await handleMineWorkItemSignals({
      preview_id: preview.preview_id,
      confirmed: true,
    });

    assert.equal(result.signals.length, 2);
    assert.equal(result.signals[0].source.provider, "file");
    assert.equal(result.signals[0].source.confidence, "known");
    assert.ok(result.signals[0].body_excerpt.length <= 203);
  });

  it("rejects paths outside repo root", () => {
    const outside = path.join(path.dirname(tmpDir), "outside-work-items.json");
    const resolved = resolveFilePath(outside, tmpDir);
    assert.equal(resolved.error, "path_outside_repo_root");
  });

  it("rejects path traversal via ..", () => {
    const resolved = resolveFilePath("../outside.json", tmpDir);
    assert.equal(resolved.error, "path_traversal_rejected");
  });
});
