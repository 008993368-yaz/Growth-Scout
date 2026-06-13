#!/usr/bin/env node
/**
 * Installs Growth Scout into a product repo and runs first-scan inventory.
 * Zero dependencies; Node 18+.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateProductMap } from "./repo-inventory.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_ROOT = path.resolve(__dirname, "..");

const COPY_ENTRIES = [
  "SKILL.md",
  "AGENTS.md",
  "VERSION",
  "references",
  "templates",
  "examples",
];

const FIRST_PROMPT = `Follow Growth Scout (SKILL.md). Run Phase 1–2 using .growth-scout/product-map-draft.md as a starting point.
Then Phase 5–6 minimum viable run: recommend one Build now and one Validate first with success metrics.
Label every claim known/inferred/unknown.`;

const CURSOR_PROMPT_SUFFIX =
  "Invoke via: Use the growth-scout skill: what should we build next?";

const HELP = `install-growth-scout.mjs — install Growth Scout into a product repo

Usage:
  node scripts/install-growth-scout.mjs <target-dir> [options]

Arguments:
  target-dir          Product repo to install into (required)

Options:
  --layout <name>     Install layout: root (default) or cursor
  --dry-run           Print planned copies; do not write files
  --force             Overwrite an existing install
  --help, -h          Show this help

Examples:
  node scripts/install-growth-scout.mjs /path/to/product-repo
  node scripts/install-growth-scout.mjs /path/to/product-repo --layout cursor
  node scripts/install-growth-scout.mjs /path/to/product-repo --dry-run
  node scripts/install-growth-scout.mjs /path/to/product-repo --force
`;

function parseArgs(argv) {
  const args = {
    target: null,
    layout: "root",
    dryRun: false,
    force: false,
    help: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--layout") {
      args.layout = argv[++i];
      if (!args.layout) {
        console.error("Error: --layout requires a value (root or cursor)");
        process.exit(1);
      }
    } else if (!arg.startsWith("-")) {
      if (args.target) {
        console.error(`Error: unexpected argument: ${arg}`);
        process.exit(1);
      }
      args.target = arg;
    } else {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    }
  }

  return args;
}

function readVersion(sourceRoot) {
  const versionPath = path.join(sourceRoot, "VERSION");
  const raw = fs.readFileSync(versionPath, "utf8").trim();
  return raw || "unknown";
}

function skillMarkerPath(targetRoot, layout) {
  if (layout === "cursor") {
    return path.join(targetRoot, ".cursor", "skills", "growth-scout", "SKILL.md");
  }
  return path.join(targetRoot, "SKILL.md");
}

function installDestRoot(targetRoot, layout) {
  if (layout === "cursor") {
    return path.join(targetRoot, ".cursor", "skills", "growth-scout");
  }
  return targetRoot;
}

function validateSource(sourceRoot) {
  const missing = [];
  for (const entry of COPY_ENTRIES) {
    const src = path.join(sourceRoot, entry);
    if (!fs.existsSync(src)) {
      missing.push(entry);
    }
  }
  if (missing.length > 0) {
    console.error(
      `Error: missing source file(s) in ${sourceRoot}: ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

function validateLayout(layout) {
  if (layout !== "root" && layout !== "cursor") {
    console.error(`Error: unknown layout "${layout}" (expected root or cursor)`);
    process.exit(1);
  }
}

function listCopyPlan(sourceRoot, destRoot) {
  const plan = [];
  for (const entry of COPY_ENTRIES) {
    const src = path.join(sourceRoot, entry);
    const dest = path.join(destRoot, entry);
    plan.push({ src, dest, entry });
  }
  return plan;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function copyEntry(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    copyDirectory(src, dest);
  } else {
    copyFile(src, dest);
  }
}

function runInstall(args) {
  const sourceRoot = SCRIPT_ROOT;
  const targetRoot = path.resolve(args.target);
  validateLayout(args.layout);
  validateSource(sourceRoot);

  if (!fs.existsSync(targetRoot)) {
    console.error(`Error: target directory does not exist: ${targetRoot}`);
    process.exit(1);
  }

  const marker = skillMarkerPath(targetRoot, args.layout);
  if (fs.existsSync(marker) && !args.force && !args.dryRun) {
    console.error(`Error: Growth Scout already installed at ${marker}`);
    console.error("Use --dry-run to preview or --force to overwrite.");
    process.exit(1);
  }

  const destRoot = installDestRoot(targetRoot, args.layout);
  const plan = listCopyPlan(sourceRoot, destRoot);
  const draftPath = path.join(targetRoot, ".growth-scout", "product-map-draft.md");
  const version = readVersion(sourceRoot);
  const today = new Date().toISOString().slice(0, 10);

  if (args.dryRun) {
    console.log(`Dry run — layout: ${args.layout}`);
    console.log(`Source: ${sourceRoot}`);
    console.log(`Target: ${targetRoot}`);
    console.log("");
    console.log("Would copy:");
    for (const { src, dest } of plan) {
      console.log(`  ${path.relative(sourceRoot, src)} -> ${dest}`);
    }
    console.log("");
    console.log(`Would write: ${draftPath}`);
    console.log(
      `  (header: Auto-generated by Growth Scout install | Date: ${today} | Growth Scout ${version})`
    );
    return;
  }

  const copied = [];
  for (const { src, dest, entry } of plan) {
    try {
      copyEntry(src, dest);
      copied.push(entry);
    } catch (err) {
      console.error(`Error: failed to copy ${entry}: ${err.message}`);
      process.exit(1);
    }
  }

  const growthScoutDir = path.join(targetRoot, ".growth-scout");
  fs.mkdirSync(growthScoutDir, { recursive: true });

  const productMap = generateProductMap(targetRoot);
  const header = `> Auto-generated by Growth Scout install | Date: ${today} | Growth Scout ${version}\n\n`;
  fs.writeFileSync(draftPath, header + productMap, "utf8");

  console.log("Growth Scout installed");
  console.log(`  Layout: ${args.layout}`);
  console.log(`  Destination: ${destRoot}`);
  console.log(`  Files copied: ${copied.join(", ")}`);
  console.log(`  Draft product map: ${draftPath}`);
  console.log("");
  console.log("First agent prompt (copy-paste):");
  console.log("");
  console.log(FIRST_PROMPT);
  if (args.layout === "cursor") {
    console.log(CURSOR_PROMPT_SUFFIX);
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }

  if (!args.target) {
    console.error("Error: target directory is required");
    console.error("Run with --help for usage.");
    process.exit(1);
  }

  runInstall(args);
}

main();
