#!/usr/bin/env node
/**
 * Validates relative markdown links and backtick .md path references
 * in core Growth Scout documentation files.
 * Zero dependencies; Node 18+.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SCAN_PATTERNS = [
  "SKILL.md",
  "AGENTS.md",
  "README.md",
  "references/*.md",
  "references/industry-packs/*.md",
  "templates/*.md",
  "integrations/*.md",
  "examples/*.md",
];

function expandScanFiles() {
  const files = [];
  for (const pattern of SCAN_PATTERNS) {
    if (pattern.includes("*")) {
      const slash = pattern.indexOf("/");
      const dirName = pattern.slice(0, slash);
      const dirPath = path.join(ROOT, dirName);
      if (!fs.existsSync(dirPath)) continue;
      for (const entry of fs.readdirSync(dirPath)) {
        if (entry.endsWith(".md")) {
          files.push(path.join(dirPath, entry));
        }
      }
    } else {
      const filePath = path.join(ROOT, pattern);
      if (fs.existsSync(filePath)) files.push(filePath);
    }
  }
  return files.sort();
}

function stripLinkTarget(raw) {
  let target = raw.trim();
  const quoted = target.match(/^<([^>]+)>$/);
  if (quoted) target = quoted[1];
  const space = target.search(/\s/);
  if (space !== -1) target = target.slice(0, space);
  return target;
}

function isExternal(target) {
  return /^(https?:|mailto:|tel:|data:)/i.test(target);
}

function extractLinks(content, sourceFile) {
  const links = [];

  const mdLinkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdLinkRe.exec(content)) !== null) {
    const target = stripLinkTarget(match[2]);
    if (!target || target.startsWith("#") || isExternal(target)) continue;
    links.push({ target, sourceFile, kind: "markdown" });
  }

  const backtickRe = /`([^`\n]+\.md)`/g;
  while ((match = backtickRe.exec(content)) !== null) {
    const target = match[1].trim();
    if (!target || isExternal(target)) continue;
    // Only validate bare relative paths, not CLI flags (@SKILL.md, --read foo.md)
    if (!/^[\w./-]+\.md$/i.test(target)) continue;
    links.push({ target, sourceFile, kind: "backtick" });
  }

  return links;
}

function resolveTarget(sourceFile, target) {
  const normalized = target.replace(/\\/g, "/");
  const fromSource = path.normalize(path.join(path.dirname(sourceFile), normalized));
  if (fs.existsSync(fromSource)) return fromSource;

  const fromRoot = path.normalize(path.join(ROOT, normalized));
  if (fs.existsSync(fromRoot)) return fromRoot;

  return null;
}

function main() {
  const files = expandScanFiles();
  const broken = [];
  const seen = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    for (const link of extractLinks(content, file)) {
      const key = `${file}::${link.target}`;
      if (seen.has(key)) continue;
      seen.add(key);

      if (!resolveTarget(file, link.target)) {
        broken.push(link);
      }
    }
  }

  if (broken.length === 0) {
    console.log(`OK: ${files.length} files scanned, all links valid.`);
    process.exit(0);
  }

  console.error(`Broken links (${broken.length}):`);
  for (const item of broken) {
    const rel = path.relative(ROOT, item.sourceFile);
    console.error(`  ${rel} [${item.kind}]: ${item.target}`);
  }
  process.exit(1);
}

main();
