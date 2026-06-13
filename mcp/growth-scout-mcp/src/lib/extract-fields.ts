import type { FetchResult, FieldValue } from "./evidence.js";
import { makeExcerpt } from "./evidence.js";

const PRICING_PATTERNS = [
  /\b(free tier|freemium|per seat|per user|usage[- ]based|subscription|monthly|annually|enterprise pricing|contact sales)\b/gi,
  /\$\d+(?:\.\d{2})?(?:\s*\/\s*(?:mo|month|user|seat))?/gi,
];

const FEATURE_KEYWORDS = [
  "integration",
  "api",
  "sso",
  "saml",
  "audit log",
  "dashboard",
  "template",
  "collaboration",
  "notification",
  "alert",
  "export",
  "import",
  "webhook",
  "automation",
  "analytics",
  "reporting",
  "mobile app",
  "slack",
  "teams",
  "github",
  "gitlab",
];

export interface ExtractedFields {
  positioning: FieldValue;
  target_user: FieldValue;
  pricing_model: FieldValue;
  key_features: FieldValue;
  feature_mentions: string[];
}

function pickSentence(text: string, pattern: RegExp): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    if (pattern.test(sentence)) {
      return sentence.trim().slice(0, 300);
    }
  }
  return "";
}

function emptyField(confidence: "unknown" | "inferred" = "unknown"): FieldValue {
  return { value: "", confidence, source_url: "" };
}

export function extractFieldsFromSnapshots(
  name: string,
  snapshots: FetchResult[],
): ExtractedFields {
  const successful = snapshots.filter(
    (s) => s.confidence === "known" && s.text.length > 0,
  );
  if (successful.length === 0) {
    return {
      positioning: emptyField(),
      target_user: emptyField(),
      pricing_model: emptyField(),
      key_features: emptyField(),
      feature_mentions: [],
    };
  }

  const homepage =
    successful.find((s) => {
      try {
        const u = new URL(s.source_url);
        return u.pathname === "/" || u.pathname === "";
      } catch {
        return false;
      }
    }) ?? successful[0]!;

  const pricingPage = successful.find((s) =>
    /\/pricing/i.test(s.source_url),
  );

  const featuresPage = successful.find((s) =>
    /\/features/i.test(s.source_url),
  );

  const positioningText =
    homepage.title ||
    pickSentence(homepage.text, /\b(for teams|platform|solution|tool)\b/i) ||
    makeExcerpt(homepage.text, 200);

  const targetUser =
    pickSentence(
      homepage.text,
      /\b(teams?|developers?|enterprises?|startups?|marketers?|analysts?)\b/i,
    ) || "";

  let pricingModel = "";
  let pricingSource = homepage.source_url;
  let pricingConfidence: FieldValue["confidence"] = "inferred";

  const pricingTexts = [pricingPage, homepage].filter(Boolean) as FetchResult[];
  for (const page of pricingTexts) {
    for (const pattern of PRICING_PATTERNS) {
      pattern.lastIndex = 0;
      const match = page.text.match(pattern);
      if (match?.[0]) {
        pricingModel = match[0];
        pricingSource = page.source_url;
        pricingConfidence = page === pricingPage ? "known" : "inferred";
        break;
      }
    }
    if (pricingModel) break;
  }

  const featureSource = featuresPage ?? homepage;
  const featureMentions: string[] = [];
  const lowerText = featureSource.text.toLowerCase();
  for (const keyword of FEATURE_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      featureMentions.push(keyword);
    }
  }

  const keyFeatures =
    featureMentions.length > 0
      ? featureMentions.slice(0, 8).join(", ")
      : pickSentence(featureSource.text, /\bfeatures?\b/i).slice(0, 200);

  return {
    positioning: {
      value: positioningText,
      confidence: homepage.title ? "known" : "inferred",
      source_url: homepage.source_url,
      excerpt: makeExcerpt(homepage.text, 200),
    },
    target_user: {
      value: targetUser,
      confidence: targetUser ? "inferred" : "unknown",
      source_url: homepage.source_url,
    },
    pricing_model: {
      value: pricingModel,
      confidence: pricingModel ? pricingConfidence : "unknown",
      source_url: pricingSource,
    },
    key_features: {
      value: keyFeatures,
      confidence: featureMentions.length > 0 ? "inferred" : "unknown",
      source_url: featureSource.source_url,
    },
    feature_mentions: featureMentions,
  };
}

export function capabilityStatus(
  mentions: string[],
  capability: string,
): "Full" | "Partial" | "Missing" | "Unknown" {
  const normalized = capability.toLowerCase();
  const hit = mentions.some(
    (m) => m.includes(normalized) || normalized.includes(m),
  );
  if (hit) return "Full";
  if (mentions.length === 0) return "Unknown";
  return "Missing";
}

export function defaultCapabilities(category: string): string[] {
  const base = [
    "API access",
    "Integrations",
    "Team collaboration",
    "Export / sharing",
    "SSO / enterprise auth",
  ];
  const lower = category.toLowerCase();
  if (lower.includes("developer") || lower.includes("dev tool")) {
    return [...base, "CI/CD integration", "CLI", "Documentation"];
  }
  if (lower.includes("analytics") || lower.includes("dashboard")) {
    return [...base, "Dashboard templates", "Alerts / notifications", "Reporting"];
  }
  if (lower.includes("mobile") || lower.includes("consumer")) {
    return ["Onboarding", "Push notifications", "In-app purchases", "Social sharing"];
  }
  return base;
}

export function mergeCapabilities(
  category: string,
  allMentions: string[][],
  custom?: string[],
): string[] {
  if (custom?.length) return custom;
  const defaults = defaultCapabilities(category);
  const fromMentions = allMentions.flat().filter(Boolean);
  const merged = new Set<string>([...defaults, ...fromMentions]);
  return Array.from(merged).slice(0, 12);
}

export function suggestTier(name: string, category: string): string {
  return "direct";
}
