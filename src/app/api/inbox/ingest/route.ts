import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { inboxMessages } from "@/lib/db/schema";
import { captureFromUnknown } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "/api/inbox/ingest";
const MAX_BODY = 200_000;

const Body = z.object({
  to: z.string().trim().min(3).max(320),
  from: z.string().trim().min(3).max(320),
  subject: z.string().max(1000).nullable().optional(),
  text: z.string().max(MAX_BODY + 100).nullable().optional(),
  html: z.string().max(MAX_BODY + 100).nullable().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  size: z.number().int().min(0).optional(),
});

function bearerOk(req: Request, secret: string): boolean {
  const header = req.headers.get("authorization") ?? "";
  const presented = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!presented) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by the Cloudflare Email Worker for every message to *@liftdecode.com. */
export async function POST(req: Request) {
  try {
    const secret = process.env.INBOX_INGEST_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "INBOX_INGEST_SECRET is not configured on the app" }, { status: 503 });
    }
    if (!bearerOk(req, secret)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const json = await req.json().catch(() => null);
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid payload", issues: parsed.error.issues.slice(0, 5) }, { status: 400 });
    }
    const m = parsed.data;

    const rows = await db
      .insert(inboxMessages)
      .values({
        toAddr: m.to.toLowerCase(),
        fromAddr: m.from.toLowerCase(),
        subject: m.subject ?? null,
        textBody: m.text ?? null,
        htmlBody: m.html ?? null,
        headers: m.headers ?? null,
        rawSize: m.size ?? null,
      })
      .returning({ id: inboxMessages.id });

    return NextResponse.json({ id: rows[0].id }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    await captureFromUnknown(e, ROUTE);
    return NextResponse.json({ error: "could not store message" }, { status: 500 });
  }
}
