import { NextResponse } from "next/server";
import { z } from "zod";
import { captureError, captureFromUnknown } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "POST /api/errors";
const MAX_BODY_BYTES = 32_000;
const MAX_META_CHARS = 4_000;

const Body = z.object({
  name: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
  stack: z.string().max(8000).optional().nullable(),
  route: z.string().max(300).optional().nullable(),
  digest: z.string().max(200).optional().nullable(),
  meta: z.record(z.string().max(64), z.unknown()).optional().nullable(),
});

/**
 * Client-side error inbox. Accepts fetch() JSON and navigator.sendBeacon (whose
 * content-type may be text/plain or missing), so the body is read as text first.
 */
export async function POST(req: Request) {
  try {
    const ip = clientIp(req.headers);
    const rl = await rateLimit(`errors:${ip}`, 60, 60);
    if (!rl.ok) return NextResponse.json({ error: "Too many reports" }, { status: 429 });

    const text = await req.text().catch(() => "");
    if (!text || text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = Body.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid error report" }, { status: 400 });
    const { name, message, stack, route, digest, meta } = parsed.data;

    // Cap meta by its serialized size so a noisy client cannot bloat the inbox.
    let safeMeta: Record<string, unknown> = {};
    if (meta) {
      const s = JSON.stringify(meta);
      safeMeta = s.length <= MAX_META_CHARS ? meta : { truncated: true, preview: s.slice(0, MAX_META_CHARS) };
    }
    if (digest) safeMeta.digest = digest;
    safeMeta.ua = safeMeta.ua ?? req.headers.get("user-agent")?.slice(0, 300) ?? null;

    await captureError({
      name,
      message,
      stack: stack ?? null,
      route: route ?? null,
      side: "client",
      meta: safeMeta,
    });
    return new Response(null, { status: 204 });
  } catch (e) {
    await captureFromUnknown(e, ROUTE);
    return NextResponse.json({ error: "Could not record the error" }, { status: 500 });
  }
}
