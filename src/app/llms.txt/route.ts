import { SITE_NAME, SITE_TAGLINE, STATIC_ROUTES, absoluteUrl } from "@/lib/seo";
import { siteIndex, type IndexEntry } from "@/lib/site-index";
import { CONTACT_EMAIL } from "@/lib/env";

export const dynamic = "force-static";

const PAGE_NOTES: Record<string, string> = {
  "/": "Home. What the diagnostic does and who it is for.",
  "/diagnose": "Start the diagnostic. Quick questions about your build, your week and your habits; no account needed to answer.",
  "/pricing": "Membership $15/month (all reports, the fix library, plan tracking) or a single report for $5.",
  "/how-it-works": "How answers become findings: the rule-based engine, the two tracks, the AI-written report and what it contains.",
  "/library": "The fix library: every bottleneck the engine can detect, what causes it and how to fix it.",
  "/blog": "Articles on training plateaus, programming, programs, exercise form, strength standards, nutrition, recovery and building muscle.",
  "/tools": "Free calculators for lifters: 1RM, RPE, bench press, protein, bulking calories, FFMI, lean body mass, recomposition, DOTS/Wilks, plates.",
  "/glossary": "Lifting terms defined: RPE, RIR, AMRAP, hypertrophy, mechanical tension, time under tension and more.",
  "/about": "About LiftDecode: who makes it and why.",
  "/faq": "Frequently asked questions about the diagnostic, payment and privacy.",
  "/contact": `Contact: ${CONTACT_EMAIL}.`,
  "/privacy": "Privacy policy.",
  "/terms": "Terms of service.",
  "/refunds": "Refunds and cancellation policy.",
};

function section(title: string, keep: (e: IndexEntry) => boolean): string[] {
  const entries = siteIndex().filter(keep);
  if (entries.length === 0) return [];
  return [`## ${title}`, "", ...entries.map((e) => `- [${e.title}](${absoluteUrl(e.url)}): ${e.description}`), ""];
}

export function GET() {
  const idx = siteIndex();
  const hasTools = idx.some((e) => e.kind === "tool");
  const hasTerms = idx.some((e) => e.kind === "term");
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE}. ${SITE_NAME} is a paid diagnostic for lifters whose progress has stalled. It is made and published by the brand LiftDecode (an organization), not by a named individual.`,
    "",
    "## What it does",
    "",
    "A lifter answers quick, honest questions about their build (sex, age, height, weight, body type), their week (sessions and time per muscle group), how they train, what they eat (protein and carbs in grams, or \"not sure\"), how they sleep, recover and live — mostly 1-10 scales and short choices, with a few real numbers where the analysis needs them. The first question picks one of two tracks: physique (building muscle or losing fat) or strength (moving more weight). A deterministic, rule-based engine cross-references the answers into \"findings\" (the bottlenecks most likely holding progress back, ranked, each with the answers that triggered it) and \"clearances\" (things that are not the problem); the same answers always produce the same findings.",
    "",
    "Before paying, the lifter sees which problems were found, the answers behind them and a ten-part scorecard. After paying, an AI model (Anthropic's Claude) writes the full report for that lifter from the engine's findings and their answers, citing only an evidence base LiftDecode checked entry by entry: what is wrong and why, the fix in order, and a four-week plan. The rules decide the findings; the model explains them and does not replace them, and no model runs before payment.",
    "",
    "LiftDecode gives training and lifestyle guidance for healthy adults. It does not diagnose, treat or prevent any medical condition and is not a substitute for a doctor, physiotherapist or registered dietitian.",
    "",
    "## Key pages",
    "",
    ...STATIC_ROUTES.map((r) => `- [${absoluteUrl(r.path)}](${absoluteUrl(r.path)}): ${PAGE_NOTES[r.path] ?? ""}`.trimEnd()),
    ...(hasTools ? [`- [${absoluteUrl("/tools")}](${absoluteUrl("/tools")}): ${PAGE_NOTES["/tools"]}`] : []),
    ...(hasTerms ? [`- [${absoluteUrl("/glossary")}](${absoluteUrl("/glossary")}): ${PAGE_NOTES["/glossary"]}`] : []),
    "",
    ...section("Topics", (e) => e.kind === "hub" && e.section === "Blog"),
    ...section("Articles", (e) => e.kind === "article"),
    ...section("Calculators", (e) => e.kind === "tool"),
    ...section("Glossary", (e) => e.kind === "term"),
    "## Reports are personal",
    "",
    "Each diagnosis produces a report that belongs to the person who answered the questions. Reports live at /diagnose/result/<id> (the findings and unlock options) and /report/<id> (the full written report). They are paywalled, tied to an account, and are not public, not indexable and not available to crawlers or agents. Please do not attempt to fetch them.",
    "",
    "## Pricing",
    "",
    "- Membership: $15 per month. Unlimited reports, the full fix library, plan tracking. Cancel any time.",
    "- Single report: $5, one diagnosis, yours to keep.",
    "",
    "## Contact",
    "",
    `Email ${CONTACT_EMAIL}. Sitemap: ${absoluteUrl("/sitemap.xml")}.`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
