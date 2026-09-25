import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, stripeEvents } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { captureError, captureFromUnknown } from "@/lib/errors";
import { grantFromCheckoutSession, markPastDue, markRefunded, syncSubscription } from "@/lib/entitlements";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** End of the last paid period = start of the failed invoice's service period. */
function invoicePaidThrough(inv: Stripe.Invoice): Date | null {
  const ts = inv.lines?.data?.[0]?.period?.start ?? inv.period_end;
  return ts ? new Date(ts * 1000) : null;
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "webhook not configured" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    await captureError({
      name: "StripeSignatureError",
      message: e instanceof Error ? e.message : "bad signature",
      route: "/api/stripe/webhook",
      side: "server",
      severity: "warning",
    });
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // Only events that belong to this site (the Stripe account serves several brands).
  const obj = event.data.object as { metadata?: Record<string, string> };
  const site = obj?.metadata?.site;
  if (site && site !== "liftdecode.com") return NextResponse.json({ ignored: "other site" });

  // Idempotency: first writer wins.
  const inserted = await db
    .insert(stripeEvents)
    .values({ id: event.id, type: event.type })
    .onConflictDoNothing()
    .returning({ id: stripeEvents.id });
  if (inserted.length === 0) return NextResponse.json({ duplicate: true });

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.site && session.metadata.site !== "liftdecode.com") break;
        if (!session.metadata?.site) break; // not ours
        await grantFromCheckoutSession(session, "webhook");
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await db.update(orders).set({ status: "failed" }).where(eq(orders.stripeCheckoutSessionId, session.id));
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.metadata?.site && sub.metadata.site !== "liftdecode.com") break;
        if (!sub.metadata?.site) break;
        await syncSubscription(sub, "webhook");
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const subRef = (inv as unknown as { subscription?: string | { id: string } }).subscription
          ?? (inv.parent?.subscription_details?.subscription as string | { id: string } | undefined);
        const subId = typeof subRef === "string" ? subRef : subRef?.id;
        if (!subId) break;
        if (event.type === "invoice.paid") {
          const sub = await stripe().subscriptions.retrieve(subId);
          if (!sub.metadata?.site || sub.metadata.site !== "liftdecode.com") break;
          await syncSubscription(sub, "webhook");
        } else {
          // A failed first charge never granted anything; only renewals demote.
          if (inv.billing_reason === "subscription_create") break;
          // Events can arrive out of order: if a retry has since succeeded, mirror Stripe instead.
          const latest = await stripe().invoices.retrieve(inv.id);
          if (latest.status === "paid") {
            const sub = await stripe().subscriptions.retrieve(subId);
            if (sub.metadata?.site === "liftdecode.com") await syncSubscription(sub, "webhook");
          } else {
            await markPastDue(subId, invoicePaidThrough(latest));
          }
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (pi) await markRefunded(pi);
        break;
      }
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        await captureError({
          name: "StripeDispute",
          message: `Dispute ${dispute.id} for ${dispute.amount} ${dispute.currency}`,
          route: "/api/stripe/webhook",
          side: "server",
          meta: { charge: dispute.charge, reason: dispute.reason },
        });
        break;
      }
      default:
        break;
    }
    await db.update(stripeEvents).set({ processedAt: new Date() }).where(eq(stripeEvents.id, event.id));
    return NextResponse.json({ received: true });
  } catch (e) {
    await captureFromUnknown(e, "/api/stripe/webhook", "server", { eventId: event.id, type: event.type });
    await db
      .update(stripeEvents)
      .set({ error: e instanceof Error ? e.message : String(e) })
      .where(eq(stripeEvents.id, event.id));
    // Let Stripe retry; the idempotency row is released by deleting it.
    await db.delete(stripeEvents).where(eq(stripeEvents.id, event.id));
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
