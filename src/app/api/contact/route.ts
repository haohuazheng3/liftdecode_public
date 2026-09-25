import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { captureFromUnknown } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { notifyOwner } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().trim().min(1, "Tell us your name").max(120),
  email: z.email("That email doesn't look right").max(200),
  message: z.string().trim().min(10, "Give us a little more to go on").max(5000, "Please keep it under 5,000 characters"),
  /** honeypot — humans never see or fill this */
  website: z.string().max(200).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req.headers);
    const rl = await rateLimit(`contact:${ip}`, 5, 600);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "You've sent a few messages already — give it ten minutes and try again, or email us directly." },
        { status: 429 },
      );
    }

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ error: first?.message ?? "Please check the form and try again." }, { status: 400 });
    }
    const { name, email, message, website } = parsed.data;

    // Bots fill the hidden field. Tell them it worked; store nothing.
    if (website) {
      console.info("[contact] honeypot tripped from", ip);
      return NextResponse.json({ ok: true });
    }

    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
    const inserted = await db
      .insert(contactMessages)
      .values({ name, email: email.toLowerCase(), message, ip, userAgent })
      .returning({ id: contactMessages.id });
    const row = inserted[0];

    const notified = await notifyOwner({
      subject: `[LiftDecode] Contact #${row.id} from ${name}`,
      text: [`From: ${name} <${email}>`, `IP: ${ip}`, `Message #${row.id}`, "", message].join("\n"),
    });
    if (notified) {
      await db.update(contactMessages).set({ notifiedAt: new Date() }).where(eq(contactMessages.id, row.id));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    await captureFromUnknown(e, "/api/contact");
    return NextResponse.json(
      { error: "We couldn't save your message. Please email contact@liftdecode.com instead." },
      { status: 500 },
    );
  }
}
