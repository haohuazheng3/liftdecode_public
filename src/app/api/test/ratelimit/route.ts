import { NextResponse } from "next/server";
import { captureFromUnknown } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "GET /api/test/ratelimit";

/** Launch-checklist probe: the 6th call within a minute from one IP must return 429. */
export async function GET(req: Request) {
  try {
    const ip = clientIp(req.headers);
    const rl = await rateLimit(`test:${ip}`, 5, 60);
    const body = { ok: rl.ok, remaining: rl.remaining, resetAt: rl.resetAt.toISOString() };
    return NextResponse.json(body, {
      status: rl.ok ? 200 : 429,
      headers: {
        "cache-control": "no-store",
        "x-robots-tag": "noindex",
        "retry-after": String(Math.max(1, Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000))),
      },
    });
  } catch (e) {
    await captureFromUnknown(e, ROUTE);
    return NextResponse.json({ ok: false, error: "Rate limiter unavailable" }, { status: 500 });
  }
}
