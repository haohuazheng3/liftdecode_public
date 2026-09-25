import { APP_URL, BRAND } from "@/lib/env";

/** Canonical origin of the site, without a trailing slash. */
export const SITE_URL = APP_URL.replace(/\/+$/, "");

export const SITE_NAME = BRAND;
export const SITE_TAGLINE = "Find out why your training stopped working";

/** The day the site went live — lastmod for pages that are not content-managed. */
export const LAUNCH_DATE = new Date("2026-09-25T00:00:00.000Z");

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
}

/** Public, cacheable pages. Personal and transactional routes are deliberately absent. */
export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/diagnose", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" },
  { path: "/library", priority: 0.7, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refunds", priority: 0.2, changeFrequency: "yearly" },
] as const;

/** Path prefixes that must never be indexed or listed. */
export const PRIVATE_PATHS: readonly string[] = [
  "/diagnose/result",
  "/report",
  "/dashboard",
  "/account",
  "/admin",
  "/checkout",
  "/sign-in",
  "/api",
] as const;

export function isPrivatePath(path: string): boolean {
  return PRIVATE_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * IndexNow key. The matching `public/<key>.txt` must contain exactly this value —
 * if you rotate INDEXNOW_KEY in env, add the new key file too.
 */
export const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "85fd7367881ada89618bc6e044c10fe9";
