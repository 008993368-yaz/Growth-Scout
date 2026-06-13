#!/usr/bin/env node
/**
 * Scans a product repository and prints a pre-filled product-map skeleton.
 * Zero dependencies; Node 18+.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_ROOT = path.resolve(__dirname, "..");

const HELP = `repo-inventory.mjs — pre-fill a Growth Scout product map from a repo

Usage:
  node scripts/repo-inventory.mjs [target-dir] [options]

Arguments:
  target-dir          Directory to scan (default: current working directory)

Options:
  --out, -o <file>    Write markdown to file instead of stdout
  --help, -h          Show this help

Example:
  node scripts/repo-inventory.mjs .
  node scripts/repo-inventory.mjs ../my-app --out product-map-draft.md
`;

function parseArgs(argv) {
  const args = { target: process.cwd(), out: null, help: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--out" || arg === "-o") {
      args.out = argv[++i];
      if (!args.out) {
        console.error("Error: --out requires a file path");
        process.exit(1);
      }
    } else if (!arg.startsWith("-")) {
      args.target = arg;
    } else {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    }
  }
  return args;
}

function exists(root, ...parts) {
  return fs.existsSync(path.join(root, ...parts));
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function readPackageJson(root) {
  const raw = readText(path.join(root, "package.json"));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readPyProject(root) {
  const raw = readText(path.join(root, "pyproject.toml"));
  if (!raw) return null;
  const name = raw.match(/^name\s*=\s*"([^"]+)"/m)?.[1];
  const description = raw.match(/^description\s*=\s*"([^"]+)"/m)?.[1];
  return name || description ? { name, description } : null;
}

function readCargo(root) {
  const raw = readText(path.join(root, "Cargo.toml"));
  if (!raw) return null;
  const name = raw.match(/^name\s*=\s*"([^"]+)"/m)?.[1];
  const description = raw.match(/^description\s*=\s*"([^"]+)"/m)?.[1];
  return name || description ? { name, description } : null;
}

function parseReadme(root) {
  const content = readText(path.join(root, "README.md"));
  if (!content) return { title: "", sections: [], blurb: "" };

  const lines = content.split(/\r?\n/);
  const title =
    lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, "").trim() || "";

  const sections = [];
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) sections.push(match[1].trim());
  }

  const blurb = lines
    .slice(lines.findIndex((l) => /^#\s+/.test(l)) + 1)
    .find((l) => {
      const t = l.trim();
      if (!t || t.startsWith("#")) return false;
      if (t.startsWith("![")) return false;
      if (/^\[!.+\]\(.+\)$/.test(t)) return false;
      if (/^<p\s+align=/i.test(t)) return false;
      return true;
    })
    ?.trim();

  return { title, sections, blurb: blurb || "" };
}

function listFiles(dir, options = {}) {
  const { maxDepth = 4, depth = 0, filter } = options;
  const results = [];
  if (!fs.existsSync(dir) || depth > maxDepth) return results;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(full, { ...options, depth: depth + 1 }));
    } else if (!filter || filter(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function routeLabel(filePath, root, prefix) {
  const rel = path.relative(path.join(root, prefix), filePath).replace(/\\/g, "/");
  return rel
    .replace(/\/page\.(tsx?|jsx?)$/, "")
    .replace(/\/index\.(tsx?|jsx?)$/, "")
    .replace(/\.(tsx?|jsx?|vue|svelte)$/, "")
    .replace(/^\/+/, "") || "/";
}

function detectRoutes(root) {
  const routes = [];
  const routeDirs = [
    { dir: "app", label: "app/" },
    { dir: "pages", label: "pages/" },
    { dir: "src/app", label: "src/app/" },
    { dir: "src/pages", label: "src/pages/" },
    { dir: "src/routes", label: "src/routes/" },
  ];

  for (const { dir, label } of routeDirs) {
    const base = path.join(root, dir);
    if (!fs.existsSync(base)) continue;
    const files = listFiles(base, {
      filter: (name) =>
        /^(page|index|route)\.(tsx?|jsx?|ts|js)$/.test(name) ||
        /\.(tsx?|jsx?|vue|svelte)$/.test(name),
    });
    for (const file of files.slice(0, 12)) {
      routes.push({ path: `${label}${routeLabel(file, root, dir)}`, inferred: true });
    }
  }
  return routes;
}

function detectApiEndpoints(root) {
  const endpoints = [];
  const apiDirs = ["api", "src/api", "app/api", "pages/api", "routes"];
  const routeFileRe = /route\.(ts|js)$|\.(ts|js)$/;

  for (const dir of apiDirs) {
    const base = path.join(root, dir);
    if (!fs.existsSync(base)) continue;
    const files = listFiles(base, { filter: (name) => routeFileRe.test(name) });
    for (const file of files.slice(0, 12)) {
      const rel = path.relative(root, file).replace(/\\/g, "/");
      endpoints.push({ path: rel, inferred: true });
    }
  }
  return endpoints;
}

function detectFolderFeatures(root) {
  const features = [];
  const checks = [
    { dir: "integrations", name: "Integrations module" },
    { dir: "jobs", name: "Background jobs" },
    { dir: "workers", name: "Workers" },
    { dir: "templates", name: "Templates" },
    { dir: "examples", name: "Examples" },
    { dir: "references", name: "Reference docs" },
    { dir: "scripts", name: "Scripts / tooling" },
  ];
  for (const { dir, name } of checks) {
    if (exists(root, dir)) {
      features.push({ name, evidence: `${dir}/`, inferred: true });
    }
  }
  return features;
}

function detectKeywordFoundations(root) {
  const keywords = {
    Auth: /\b(auth|oauth|login|session|passport|next-auth|clerk)\b/i,
    Billing: /\b(stripe|billing|subscription|paddle|pricing)\b/i,
    Notifications: /\b(notification|sendgrid|resend|twilio|slack)\b/i,
    Analytics: /\b(analytics|segment|posthog|mixpanel|amplitude)\b/i,
    "Feature flags": /\b(feature.?flag|launchdarkly|unleash|growthbook)\b/i,
    "Background jobs": /\b(bull|sidekiq|celery|agenda|temporal|worker)\b/i,
    API: /\b(openapi|swagger|trpc|graphql|rest\s+api)\b/i,
  };

  const scanRoots = ["package.json", "pyproject.toml", "Cargo.toml", "README.md"];
  const dirsToSample = ["src", "app", "lib", "api"].filter((d) => exists(root, d));
  const sampleFiles = scanRoots
    .map((f) => path.join(root, f))
    .filter((f) => fs.existsSync(f));

  for (const dir of dirsToSample) {
    sampleFiles.push(
      ...listFiles(path.join(root, dir), { maxDepth: 2 }).slice(0, 40)
    );
  }

  let blob = "";
  for (const file of sampleFiles.slice(0, 60)) {
    const text = readText(file);
    if (text) blob += text.slice(0, 8000) + "\n";
  }

  const found = {};
  for (const [label, re] of Object.entries(keywords)) {
    if (re.test(blob)) found[label] = true;
  }
  return found;
}

function inferGrowthStage(root, pkg, routes, api) {
  if (!pkg && routes.length === 0 && api.length === 0) {
    if (exists(root, "SKILL.md") || exists(root, "templates")) {
      return { stage: "MVP", note: "inferred — skill/docs package without app routes" };
    }
    return { stage: "", note: "unknown" };
  }
  if (routes.length > 8 || (pkg?.dependencies && Object.keys(pkg.dependencies).length > 20)) {
    return { stage: "Growth", note: "inferred — many routes or dependencies" };
  }
  return { stage: "MVP", note: "inferred — early surface area" };
}

function buildFeatureRows(readme, routes, api, folderFeatures, pkg) {
  const rows = [];

  for (const section of readme.sections.slice(0, 8)) {
    rows.push({
      feature: section,
      status: "partial",
      evidence: "README.md ## section",
      inferred: true,
    });
  }

  for (const route of routes.slice(0, 8)) {
    rows.push({
      feature: `Route: ${route.path}`,
      status: "shipped",
      evidence: route.path,
      inferred: true,
    });
  }

  for (const endpoint of api.slice(0, 6)) {
    rows.push({
      feature: `API: ${endpoint.path}`,
      status: "shipped",
      evidence: endpoint.path,
      inferred: true,
    });
  }

  for (const item of folderFeatures) {
    rows.push({
      feature: item.name,
      status: "shipped",
      evidence: item.evidence,
      inferred: item.inferred,
    });
  }

  if (pkg?.scripts) {
    for (const [name, cmd] of Object.entries(pkg.scripts).slice(0, 6)) {
      rows.push({
        feature: `npm script: ${name}`,
        status: "shipped",
        evidence: `package.json scripts.${name}`,
        inferred: true,
      });
    }
  }

  return rows;
}

function markdownTable(rows, columns) {
  if (rows.length === 0) {
    return `| ${columns.join(" | ")} |\n|${columns.map(() => "---").join("|")}|\n| | |\n`;
  }
  const header = `| ${columns.join(" | ")} |`;
  const sep = `|${columns.map(() => "---").join("|")}|`;
  const body = rows
    .map((row) => `| ${columns.map((c) => row[c] ?? "").join(" | ")} |`)
    .join("\n");
  return `${header}\n${sep}\n${body}\n`;
}

function generateProductMap(root) {
  const resolved = path.resolve(root);
  const pkg = readPackageJson(resolved);
  const py = readPyProject(resolved);
  const cargo = readCargo(resolved);
  const readme = parseReadme(resolved);
  const routes = detectRoutes(resolved);
  const api = detectApiEndpoints(resolved);
  const folderFeatures = detectFolderFeatures(resolved);
  const foundations = detectKeywordFoundations(resolved);
  const stage = inferGrowthStage(resolved, pkg, routes, api);

  const repoName =
    pkg?.name || py?.name || cargo?.name || readme.title || path.basename(resolved);
  const description =
    pkg?.description || py?.description || cargo?.description || readme.blurb || "";
  const today = new Date().toISOString().slice(0, 10);

  const featureRows = buildFeatureRows(readme, routes, api, folderFeatures, pkg);
  const featureTable = markdownTable(
    featureRows.map((r) => ({
      Feature: r.feature,
      Status: r.status,
      Evidence: `${r.evidence}${r.inferred ? " (**inferred**)" : ""}`,
    })),
    ["Feature", "Status", "Evidence"]
  );

  const foundationLines = [
    "Auth",
    "Team/org model",
    "Billing",
    "Notifications",
    "Background jobs",
    "API",
    "Analytics",
    "Feature flags",
  ].map((label) => {
    const hit = foundations[label] || foundations[label.replace("/org model", "")];
    const suffix = hit ? " (**inferred**)" : "";
    return `- [ ] ${label}${suffix}`;
  });

  const deps =
    pkg?.dependencies && Object.keys(pkg.dependencies).length
      ? Object.keys(pkg.dependencies).slice(0, 12).join(", ")
      : "";

  const scripts =
    pkg?.scripts && Object.keys(pkg.scripts).length
      ? Object.keys(pkg.scripts).join(", ")
      : "";

  return `# Product Map

> Generated by Growth Scout repo-inventory | Date: ${today} | Repo: ${repoName}
> Auto-detected fields are labeled **inferred**; verify before scoring.

## Product summary

| Field | Value | Confidence (known/inferred/unknown) |
|-------|-------|-------------------------------------|
| One-line description | ${description || ""} | ${description ? "inferred" : "unknown"} |
| Category | | unknown |
| Primary job-to-be-done | | unknown |

## Target users

| Persona | Role | Pain | Why they choose us |
|---------|------|------|-------------------|
| | | | |

## Core workflow

1. 
2. 
3. 

**Time to first value (estimate):** 

## Current features

${featureTable}

## Missing features

| Gap | Type (table-stakes/differentiation) | Evidence |
|-----|-------------------------------------|----------|
| | | |

## Monetization model

| Tier | Price | Limits | Evidence |
|------|-------|--------|----------|
| | | | |

## Growth stage

- [ ] Idea / prototype
- [${stage.stage === "MVP" ? "x" : " "}] MVP
- [${stage.stage === "Growth" ? "x" : " "}] Growth
- [${stage.stage === "Mature" ? "x" : " "}] Mature

**Notes:** ${stage.note}

## Technical foundations

${foundationLines.join("\n")}

## Known constraints

- Team:
- Stack: ${deps || ""} ${deps ? "(**inferred** from package.json)" : ""}
- Compliance:
- Timeline:

## Package signals (**inferred**)

${scripts ? `- Scripts: ${scripts}` : "- Scripts: unknown"}
${routes.length ? `- Routes detected: ${routes.length}` : "- Routes: none detected"}
${api.length ? `- API files detected: ${api.length}` : "- API: none detected"}

## Unknowns (need user input or research)

1. Target user / ICP
2. Monetization model
3. Competitive positioning
`;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }

  const target = path.resolve(args.target);
  if (!fs.existsSync(target)) {
    console.error(`Error: target directory does not exist: ${target}`);
    process.exit(1);
  }

  const output = generateProductMap(target);

  if (args.out) {
    const outPath = path.resolve(args.out);
    fs.writeFileSync(outPath, output, "utf8");
    console.error(`Wrote product map draft to ${outPath}`);
  } else {
    process.stdout.write(output);
  }
}

export { generateProductMap };

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main();
}
