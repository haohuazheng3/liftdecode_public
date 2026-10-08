import type { Metadata } from "next";
import { APP_URL, BRAND } from "@/lib/env";

/** Canonical origin of the site, without a trailing slash. */
export const SITE_URL = APP_URL.replace(/\/+$/, "");

export const SITE_NAME = BRAND;
export const SITE_TAGLINE = "Find out why your training stopped working";

/** The day the site went live — lastmod for pages that are not content-managed. */
export const LAUNCH_DATE = new Date("2026-09-25T00:00:00.000Z");

const TITLE_SUFFIX = ` · ${BRAND}`; // the layout's title template

/**
 * A content page's <title>. The " · LiftDecode" suffix stays only while the whole title fits in 60
 * characters; longer, search results would cut it, and they show the site name on their own anyway.
 */
export function pageTitle(title: string): Metadata["title"] {
  return title.length + TITLE_SUFFIX.length <= 60 ? title : { absolute: title };
}

/** Turn a site-relative path into an absolute URL. Absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}

export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface StaticRoute {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  /** last real content change (YYYY-MM-DD); bump it when the page's copy changes */
  lastModified: string;
}

/** Public, cacheable pages. Personal and transactional routes are deliberately absent. */
export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly", lastModified: "2026-09-26" },
  { path: "/diagnose", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-10-07" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-06" },
  { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-06" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily", lastModified: "2026-10-07" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-09-30" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-10-06" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly", lastModified: "2026-09-25" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-10-06" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-10-06" },
  { path: "/refunds", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-10-06" },
] as const;

/** Path prefixes that must never be indexed or listed. */
export const PRIVATE_PATHS: readonly string[] = [
  "/diagnose/result",
  "/report",
  "/dashboard",
  "/account",
  "/admin",
  "/checkout",
  "/library",
  "/sign-in",
  "/api",
  "/dev",
] as const;

export function isPrivatePath(path: string): boolean {
  return PRIVATE_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * IndexNow key. The matching `public/<key>.txt` must contain exactly this value —
 * if you rotate INDEXNOW_KEY in env, add the new key file too.
 */
export const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "85fd7367881ada89618bc6e044c10fe9";
