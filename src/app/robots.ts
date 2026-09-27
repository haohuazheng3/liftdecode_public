import type { MetadataRoute } from "next";
import { PRIVATE_PATHS, SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * AI and answer-engine crawlers are welcome on every public page (AEO is part of the
 * strategy); they are named explicitly so no crawler-specific default can shut them out.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...PRIVATE_PATHS],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: [...PRIVATE_PATHS],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
