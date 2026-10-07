import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { defaultWindow, pullSearchConsole } from "@/lib/gsc";
import { captureFromUnknown } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const ROUTE = "/api/cron/gsc";
const NO_CACHE = { "cache-control": "no-store", "x-robots-tag": "noindex" };

/** Optional `?from=&to=` (YYYY-MM-DD) lets an admin backfill a range by hand; `?day=` is a one-day range. */
const Query = z.object({ day: z.iso.date().optional(), from: z.iso.date().optional(), to: z.iso.date().optional() });

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

/** Daily 06:30 UTC — re-pulls the last 14 final days of Search Console data (see src/lib/gsc.ts). */
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503, headers: NO_CACHE });
  }
  if (!cronAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_CACHE });

  const params = new URL(req.url).searchParams;
  const parsed = Query.safeParse({
    day: params.get("day") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "day, from and to must be YYYY-MM-DD" }, { status: 400, headers: NO_CACHE });
  const fallback = defaultWindow();
  const range = parsed.data.day
    ? { from: parsed.data.day, to: parsed.data.day }
    : { from: parsed.data.from ?? fallback.from, to: parsed.data.to ?? fallback.to };
  if (range.from > range.to) return NextResponse.json({ error: "from must not be after to" }, { status: 400, headers: NO_CACHE });

  const started = Date.now();
  try {
    const result = await pullSearchConsole(range);
    return NextResponse.json({ ok: true, ms: Date.now() - started, ...result }, { headers: NO_CACHE });
  } catch (e) {
    await captureFromUnknown(e, ROUTE, "server", range);
    return NextResponse.json(
      { ok: false, ...range, ms: Date.now() - started, error: e instanceof Error ? e.message : "search console pull failed" },
      { status: 500, headers: NO_CACHE },
    );
  }
}
