import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { inboxMessages } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "/api/inbox";

const Query = z.object({
  to: z.string().trim().min(1).max(320).optional(),
  since: z.iso.datetime({ offset: true }).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

const NO_CACHE = { "cache-control": "no-store, max-age=0", "x-robots-tag": "noindex, nofollow" };

function bearerOk(req: Request, secret: string | undefined): boolean {
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const presented = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!presented) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Read the test inbox: newest first, headers included so an end-to-end test
 * can assert on DKIM / SPF / DMARC results. Admins (signed in) or the ingest
 * secret (automation) may read it.
 */
export async function GET(req: Request) {
  try {
    let authorized = bearerOk(req, process.env.INBOX_INGEST_SECRET);
    if (!authorized) {
      const rl = await rateLimit(`inbox-read:${clientIp(req.headers)}`, 30, 60);
      if (!rl.ok) return NextResponse.json({ error: "too many requests" }, { status: 429, headers: NO_CACHE });
      const user = await currentUser().catch(() => null);
      const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null;
      authorized = isAdminEmail(email);
    }
    if (!authorized) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_CACHE });

    const url = new URL(req.url);
    const parsed = Query.safeParse({
      to: url.searchParams.get("to") ?? undefined,
      since: url.searchParams.get("since") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid query", issues: parsed.error.issues.slice(0, 5) }, { status: 400, headers: NO_CACHE });
    }
    const { to, since, limit } = parsed.data;

    const conditions = [];
    if (to) conditions.push(eq(inboxMessages.toAddr, to.toLowerCase()));
    if (since) conditions.push(gte(inboxMessages.receivedAt, new Date(since)));

    const rows = await db
      .select()
      .from(inboxMessages)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(inboxMessages.receivedAt), desc(inboxMessages.id))
      .limit(limit);

    const messages = rows.map((r) => ({
      id: r.id,
      to: r.toAddr,
      from: r.fromAddr,
      subject: r.subject,
      text: r.textBody,
      html: r.htmlBody,
      headers: r.headers ?? {},
      size: r.rawSize,
      receivedAt: r.receivedAt.toISOString(),
    }));

    return NextResponse.json({ count: messages.length, messages }, { headers: NO_CACHE });
  } catch (e) {
    await captureFromUnknown(e, ROUTE);
    return NextResponse.json({ error: "could not read inbox" }, { status: 500, headers: NO_CACHE });
  }
}
