import { NextResponse } from "next/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { errorEvents } from "@/lib/db/schema";
import { envPresence } from "@/lib/env";
import { stripeMode } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const started = Date.now();
  const checks: Record<string, unknown> = {};
  let ok = true;

  // 1. database
  try {
    const r = await db.execute(sql`select 1 as one`);
    checks.database = { ok: Array.isArray(r.rows) ? r.rows.length === 1 : true, ms: Date.now() - started };
  } catch (e) {
    ok = false;
    checks.database = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // 2. env presence (names only)
  const env = envPresence();
  checks.env = { required: env.required, optional: env.optional, missingRequired: env.missingRequired };
  if (env.missingRequired.length > 0) ok = false;

  // 3. stripe mode
  checks.stripe = { mode: stripeMode() };

  // 4. unresolved errors
  try {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(errorEvents)
      .where(and(isNull(errorEvents.resolvedAt), eq(errorEvents.severity, "error")));
    const unresolved = rows[0]?.n ?? 0;
    checks.errors = { unresolved };
    if (unresolved > 0) ok = false;
  } catch (e) {
    checks.errors = { unresolved: null, error: e instanceof Error ? e.message : String(e) };
  }

  // 5. deployment
  checks.deployment = {
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    region: process.env.VERCEL_REGION ?? null,
  };

  const body = { ok, at: new Date().toISOString(), ms: Date.now() - started, checks };
  return NextResponse.json(body, {
    status: ok ? 200 : 503,
    headers: { "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}
