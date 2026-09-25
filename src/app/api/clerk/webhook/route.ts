import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { captureError, captureFromUnknown } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "/api/clerk/webhook";

const EmailAddress = z.object({ id: z.string(), email_address: z.string() });

const Event = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
    email_addresses: z.array(EmailAddress).optional(),
    primary_email_address_id: z.string().nullable().optional(),
  }),
});

function primaryEmail(data: z.infer<typeof Event>["data"]): string | null {
  const list = data.email_addresses ?? [];
  const primary = list.find((e) => e.id === data.primary_email_address_id) ?? list[0];
  return primary?.email_address?.toLowerCase() ?? null;
}

/**
 * Clerk → users mirror. Signature-verified with svix; every write is an
 * upsert so redeliveries are harmless. The app also lazily upserts on
 * sign-in, so this webhook is a sync, not a dependency.
 */
export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SIGNING_SECRET is not configured; add it in Vercel env and redeploy" },
      { status: 503 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "missing svix headers" }, { status: 400 });
  }

  const raw = await req.text();
  try {
    new Webhook(secret).verify(raw, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (e) {
    await captureError({
      name: "ClerkSignatureError",
      message: e instanceof Error ? e.message : "bad signature",
      route: ROUTE,
      side: "server",
      severity: "warning",
    });
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: z.infer<typeof Event>;
  try {
    const parsed = Event.safeParse(JSON.parse(raw));
    if (!parsed.success) return NextResponse.json({ error: "unexpected event shape" }, { status: 400 });
    event = parsed.data;
  } catch {
    return NextResponse.json({ error: "body is not JSON" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const email = primaryEmail(event.data) ?? `${event.data.id}@unknown.local`;
        await db
          .insert(users)
          .values({ id: event.data.id, email })
          .onConflictDoUpdate({ target: users.id, set: { email, updatedAt: new Date() } });
        break;
      }
      case "user.deleted": {
        // Keep the row (orders and entitlements hang off it); drop the address.
        await db
          .update(users)
          .set({ email: `deleted+${event.data.id}@deleted.local`, updatedAt: new Date() })
          .where(eq(users.id, event.data.id));
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ ok: true, type: event.type });
  } catch (e) {
    await captureFromUnknown(e, ROUTE, "server", { type: event.type, svixId });
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
