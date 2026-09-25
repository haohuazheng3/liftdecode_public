import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { pullSearchConsole, targetDay } from "@/lib/gsc";
import { captureFromUnknown } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const ROUTE = "/api/cron/gsc";
const NO_CACHE = { "cache-control": "no-store", "x-robots-tag": "noindex" };

/** Optional `?day=YYYY-MM-DD` lets an admin backfill a specific day by hand. */
const Query = z.object({ day: z.iso.date().optional() });

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

/** Daily 06:30 UTC — Search Console rows for the day three days ago (see src/lib/gsc.ts). */
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503, headers: NO_CACHE });
  }
  if (!cronAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_CACHE });

  const parsed = Query.safeParse({ day: new URL(req.url).searchParams.get("day") ?? undefined });
  if (!parsed.success) return NextResponse.json({ error: "day must be YYYY-MM-DD" }, { status: 400, headers: NO_CACHE });
  const day = parsed.data.day ?? targetDay();

  const started = Date.now();
  try {
    const result = await pullSearchConsole(day);
    return NextResponse.json({ ok: true, ms: Date.now() - started, ...result }, { headers: NO_CACHE });
  } catch (e) {
    await captureFromUnknown(e, ROUTE, "server", { day });
    return NextResponse.json(
      { ok: false, day, ms: Date.now() - started, error: e instanceof Error ? e.message : "search console pull failed" },
      { status: 500, headers: NO_CACHE },
    );
  }
}
