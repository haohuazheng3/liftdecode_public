import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { reconcile } from "@/lib/reconcile";
import { captureFromUnknown } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const ROUTE = "/api/cron/reconcile";
const NO_CACHE = { "cache-control": "no-store", "x-robots-tag": "noindex" };

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`; a manual curl may send the same. */
function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const presented = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!presented) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Every 6 hours — Stripe ↔ entitlements safety net (see src/lib/reconcile.ts). */
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503, headers: NO_CACHE });
  }
  if (!cronAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_CACHE });

  const started = Date.now();
  try {
    const result = await reconcile();
    return NextResponse.json({ ok: true, ms: Date.now() - started, ...result }, { headers: NO_CACHE });
  } catch (e) {
    await captureFromUnknown(e, ROUTE);
    return NextResponse.json(
      { ok: false, ms: Date.now() - started, error: e instanceof Error ? e.message : "reconcile failed" },
      { status: 500, headers: NO_CACHE },
    );
  }
}
