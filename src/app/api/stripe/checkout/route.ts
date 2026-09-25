import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { assessments, users } from "@/lib/db/schema";
import { ensureUser } from "@/lib/users";
import { getAnonTokens } from "@/lib/cookies";
import { activeMembership, canViewReport } from "@/lib/entitlements";
import { CHECKOUT_BRAND, PRICES, stripe } from "@/lib/stripe";
import { APP_URL } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  kind: z.enum(["membership", "report"]),
  assessmentId: z.string().min(8).max(40).optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });

    const rl = await rateLimit(`checkout:${userId}:${clientIp(req.headers)}`, 10, 300);
    if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Please wait a moment." }, { status: 429 });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { kind, assessmentId } = parsed.data;

    const user = await ensureUser(userId);

    // Claim the assessment for this user if it was created anonymously in this browser.
    if (assessmentId) {
      const rows = await db.select().from(assessments).where(eq(assessments.id, assessmentId)).limit(1);
      const a = rows[0];
      if (!a) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
      if (a.userId && a.userId !== userId) return NextResponse.json({ error: "Not your assessment" }, { status: 403 });
      if (!a.userId) {
        const tokens = await getAnonTokens();
        if (!tokens.includes(a.anonToken)) return NextResponse.json({ error: "Not your assessment" }, { status: 403 });
        await db
          .update(assessments)
          .set({ userId, claimedAt: new Date() })
          .where(and(eq(assessments.id, assessmentId), isNull(assessments.userId)));
      }
      const access = await canViewReport(userId, assessmentId);
      if (access.allowed) return NextResponse.json({ url: `${APP_URL}/report/${assessmentId}`, already: true });
      // Never sell a report that found nothing. The result page says so too; this is the server-side guard.
      if (kind === "report" && a.result.findings.length === 0) {
        return NextResponse.json(
          { error: "This diagnosis found no bottleneck, so there is nothing to unlock. Run it again in four weeks." },
          { status: 409 },
        );
      }
    }
    // Never open a second subscription for someone who already has one (the /pricing
    // button and the ?intent=membership auto-trigger carry no assessmentId).
    if (kind === "membership") {
      const member = await activeMembership(userId);
      if (member) return NextResponse.json({ url: `${APP_URL}/account`, already: true });
    }
    if (kind === "report" && !assessmentId) {
      return NextResponse.json({ error: "A report unlock needs an assessment" }, { status: 400 });
    }

    const s = stripe();
    const price = kind === "membership" ? PRICES.membership() : PRICES.report();
    if (!price) return NextResponse.json({ error: "Pricing is not configured" }, { status: 500 });

    // Reuse (or create) the Stripe customer so subscriptions and one-time buys share a history.
    let customerId = user.stripeCustomerId ?? null;
    if (customerId) {
      const c = await s.customers.retrieve(customerId).catch(() => null);
      if (!c || (c as Stripe.DeletedCustomer).deleted) customerId = null;
    }
    if (!customerId) {
      const c = await s.customers.create({ email: user.email, metadata: { userId, site: "liftdecode.com" } });
      customerId = c.id;
      await db.update(users).set({ stripeCustomerId: customerId, updatedAt: new Date() }).where(eq(users.id, userId));
    }

    const metadata = { userId, kind, assessmentId: assessmentId ?? "", site: "liftdecode.com" };
    const cancelUrl = assessmentId ? `${APP_URL}/diagnose/result/${assessmentId}?canceled=1` : `${APP_URL}/pricing?canceled=1`;

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: kind === "membership" ? "subscription" : "payment",
      customer: customerId,
      client_reference_id: userId,
      line_items: [{ price, quantity: 1 }],
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata,
      // Brand shown on the Checkout page — server-side whitelist, never from the client.
      branding_settings: {
        display_name: CHECKOUT_BRAND.displayName,
        button_color: CHECKOUT_BRAND.color,
        font_family: "inter",
        border_style: "rounded",
      },
      ...(kind === "membership"
        ? { subscription_data: { metadata: { userId, site: "liftdecode.com" } } }
        : {
            payment_intent_data: {
              statement_descriptor_suffix: CHECKOUT_BRAND.statementSuffix,
              metadata,
            },
          }),
    };

    const session = await s.checkout.sessions.create(params, {
      idempotencyKey: `ld_${userId}_${kind}_${assessmentId ?? "none"}_${Math.floor(Date.now() / 30000)}`,
    });
    if (!session.url) throw new Error("Stripe did not return a Checkout URL");
    return NextResponse.json({ url: session.url });
  } catch (e) {
    await captureFromUnknown(e, "/api/stripe/checkout");
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
