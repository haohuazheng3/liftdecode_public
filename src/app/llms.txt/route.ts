import { SITE_NAME, SITE_TAGLINE, STATIC_ROUTES, absoluteUrl } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/env";

export const dynamic = "force-static";

const PAGE_NOTES: Record<string, string> = {
  "/": "Home. What the diagnostic does and who it is for.",
  "/diagnose": "Start the diagnostic. 24-28 questions, about six minutes, no account needed to answer.",
  "/pricing": "Membership $15/month (all reports, the fix library, plan tracking) or a single report for $5.",
  "/how-it-works": "How answers become findings: the rule-based engine, the two tracks, what a report contains.",
  "/library": "The fix library: every bottleneck the engine can detect, what causes it and how to fix it.",
  "/blog": "Articles on training plateaus, programming, nutrition for lifters and recovery.",
  "/about": "About LiftDecode: who makes it and why.",
  "/faq": "Frequently asked questions about the diagnostic, payment and privacy.",
  "/contact": `Contact: ${CONTACT_EMAIL}.`,
  "/privacy": "Privacy policy.",
  "/terms": "Terms of service.",
  "/refunds": "Refunds and cancellation policy.",
};

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE}. ${SITE_NAME} is a paid diagnostic for lifters whose progress has stalled. It is made and published by the brand LiftDecode (an organization), not by a named individual.`,
    "",
    "## What it does",
    "",
    "A lifter answers 24-28 honest questions about how they train, eat, sleep, recover and measure progress. The first question picks one of two tracks: physique (building muscle or losing fat) or strength (moving more weight). A rule-based engine, not a language model, cross-references the answers into \"findings\" (the bottlenecks most likely holding progress back, ranked, with the answers that triggered each one) and \"clearances\" (things that are not the problem and can stop being worried about). The report explains each finding, gives a concrete fix, and lays out a four-week plan built from the top three findings.",
    "",
    "LiftDecode gives training and lifestyle guidance for healthy adults. It does not diagnose, treat or prevent any medical condition and is not a substitute for a doctor, physiotherapist or registered dietitian.",
    "",
    "## Key pages",
    "",
    ...STATIC_ROUTES.map((r) => `- [${absoluteUrl(r.path)}](${absoluteUrl(r.path)}): ${PAGE_NOTES[r.path] ?? ""}`.trimEnd()),
    "",
    "## Reports are personal",
    "",
    "Each diagnosis produces a report that belongs to the person who answered the questions. Reports live at /diagnose/result/<id> (locked preview) and /report/<id> (full report). They are paywalled, tied to an account, and are not public, not indexable and not available to crawlers or agents. Please do not attempt to fetch them.",
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
