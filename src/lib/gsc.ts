import { createSign } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { searchAnalytics, searchDaily } from "@/lib/db/schema";

/**
 * Google Search Console pull for sc-domain:liftdecode.com.
 * Auth is a service account (JSON, base64 in GOOGLE_SERVICE_ACCOUNT_B64)
 * granted read access to the property; we mint the JWT ourselves so there is
 * no googleapis dependency.
 */

export const GSC_SITE = "sc-domain:liftdecode.com";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
/** Search Console data is final about 3 days after the fact. */
export const GSC_LAG_DAYS = 3;
/** Each run re-pulls this many final days, so late-arriving data and missed runs heal themselves. */
export const GSC_WINDOW_DAYS = 14;
/** The API's maximum page size; larger result sets are paged with startRow. */
const ROW_LIMIT = 25000;
const UPSERT_CHUNK = 500;

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export type GscResult =
  | { skipped: "google service account not configured" }
  | { from: string; to: string; queryRows: number; pageRows: number; siteDays: number };

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (!raw) return null;
  const parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as Partial<ServiceAccount>;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_B64 decoded but client_email / private_key are missing");
  }
  return { client_email: parsed.client_email, private_key: parsed.private_key, token_uri: parsed.token_uri };
}

/** RS256 JWT for the OAuth2 service-account flow. */
export function mintServiceJwt(sa: ServiceAccount, now = new Date()): string {
  const iat = Math.floor(now.getTime() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: sa.token_uri ?? TOKEN_URL,
      iat,
      exp: iat + 3600,
    }),
  );
  const signingInput = `${header}.${claims}`;
  const signature = createSign("RSA-SHA256").update(signingInput).end().sign(sa.private_key, "base64url");
  return `${signingInput}.${signature}`;
}

export async function fetchAccessToken(sa: ServiceAccount): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: mintServiceJwt(sa),
  });
  const res = await fetch(sa.token_uri ?? TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(`google token exchange failed: ${res.status} ${json.error ?? ""} ${json.error_description ?? ""}`.trim());
  }
  return json.access_token;
}

type Dimension = "date" | "query" | "page";

/** One Search Analytics query over a date range, paged until the API runs out of rows. */
export async function querySearchAnalytics(token: string, from: string, to: string, dimensions: Dimension[]): Promise<GscRow[]> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  const all: GscRow[] = [];
  for (let startRow = 0; ; startRow += ROW_LIMIT) {
    const res = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ startDate: from, endDate: to, dimensions, rowLimit: ROW_LIMIT, startRow, dataState: "final" }),
    });
    const json = (await res.json().catch(() => ({}))) as { rows?: GscRow[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`search console query failed: ${res.status} ${json.error?.message ?? ""}`.trim());
    const rows = json.rows ?? [];
    all.push(...rows);
    if (rows.length < ROW_LIMIT) return all;
  }
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** The latest day we should pull right now, honouring the reporting lag. */
export function targetDay(now = new Date()): string {
  return isoDate(new Date(now.getTime() - GSC_LAG_DAYS * 24 * 3600 * 1000));
}

/** The rolling window a scheduled run pulls: GSC_WINDOW_DAYS final days ending at targetDay(). */
export function defaultWindow(now = new Date()): { from: string; to: string } {
  const to = targetDay(now);
  const from = isoDate(new Date(Date.parse(to) - (GSC_WINDOW_DAYS - 1) * 24 * 3600 * 1000));
  return { from, to };
}

/** Query × page rows; keys are [date, query, page]. */
export async function upsertSearchAnalytics(rows: GscRow[]): Promise<number> {
  let written = 0;
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK).map((r) => ({
      day: r.keys[0],
      query: r.keys[1] ?? "",
      page: r.keys[2] ?? "",
      clicks: Math.round(r.clicks),
      impressions: Math.round(r.impressions),
      ctr: r.ctr.toFixed(5),
      position: r.position.toFixed(3),
    }));
    if (chunk.length === 0) continue;
    await db
      .insert(searchAnalytics)
      .values(chunk)
      .onConflictDoUpdate({
        target: [searchAnalytics.day, searchAnalytics.query, searchAnalytics.page],
        set: {
          clicks: sql`excluded.clicks`,
          impressions: sql`excluded.impressions`,
          ctr: sql`excluded.ctr`,
          position: sql`excluded.position`,
          fetchedAt: sql`now()`,
        },
      });
    written += chunk.length;
  }
  return written;
}

/** Day totals; keys are [date, page] for page rows or [date] for the whole site (stored as page ""). */
export async function upsertSearchDaily(rows: GscRow[]): Promise<number> {
  let written = 0;
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK).map((r) => ({
      day: r.keys[0],
      page: r.keys[1] ?? "",
      clicks: Math.round(r.clicks),
      impressions: Math.round(r.impressions),
      ctr: r.ctr.toFixed(5),
      position: r.position.toFixed(3),
    }));
    if (chunk.length === 0) continue;
    await db
      .insert(searchDaily)
      .values(chunk)
      .onConflictDoUpdate({
        target: [searchDaily.day, searchDaily.page],
        set: {
          clicks: sql`excluded.clicks`,
          impressions: sql`excluded.impressions`,
          ctr: sql`excluded.ctr`,
          position: sql`excluded.position`,
          fetchedAt: sql`now()`,
        },
      });
    written += chunk.length;
  }
  return written;
}

/**
 * One pull over a date range (default: the rolling window). Three queries: query × page for the detail
 * table, page totals and site totals for search_daily. Every write is an upsert, so re-pulling a day
 * simply refreshes it.
 */
export async function pullSearchConsole(range = defaultWindow()): Promise<GscResult> {
  const sa = loadServiceAccount();
  if (!sa) {
    console.warn("[gsc] GOOGLE_SERVICE_ACCOUNT_B64 is not set; skipping Search Console pull");
    return { skipped: "google service account not configured" };
  }
  const token = await fetchAccessToken(sa);
  const { from, to } = range;
  const [detail, pages, site] = await Promise.all([
    querySearchAnalytics(token, from, to, ["date", "query", "page"]),
    querySearchAnalytics(token, from, to, ["date", "page"]),
    querySearchAnalytics(token, from, to, ["date"]),
  ]);
  const queryRows = await upsertSearchAnalytics(detail);
  const pageRows = await upsertSearchDaily(pages);
  const siteDays = await upsertSearchDaily(site);
  return { from, to, queryRows, pageRows, siteDays };
}
