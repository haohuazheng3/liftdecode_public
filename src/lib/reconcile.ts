import type Stripe from "stripe";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { entitlements, orders } from "@/lib/db/schema";
import { grantFromCheckoutSession, syncSubscription } from "@/lib/entitlements";
import { captureError } from "@/lib/errors";
import { stripe } from "@/lib/stripe";

export const SITE = "liftdecode.com";
const LOOKBACK_DAYS = 7;

export interface ReconcileResult {
  checked: number;
  granted: number;
  synced: number;
  /** sessions that are ours and paid but whose grant still failed (see error inbox) */
  failed: number;
}

function isPaid(s: Stripe.Checkout.Session): boolean {
  return s.payment_status === "paid" || s.payment_status === "no_payment_required";
}

/**
 * Safety net behind the success page and the webhook:
 *  1. every paid Checkout Session of the last 7 days that belongs to this
 *     site gets an order + entitlement if the app never recorded one;
 *  2. every membership we believe is active or past due is re-read from
 *     Stripe so status / period end never drift.
 * Everything it calls is idempotent, so running it often is safe.
 */
export async function reconcile(now = new Date()): Promise<ReconcileResult> {
  const s = stripe();
  const since = Math.floor(now.getTime() / 1000) - LOOKBACK_DAYS * 24 * 3600;

  let checked = 0;
  let granted = 0;
  let failed = 0;

  const candidates: Stripe.Checkout.Session[] = [];
  for await (const session of s.checkout.sessions.list({
    created: { gte: since },
    limit: 100,
    expand: ["data.subscription"],
  })) {
    if (session.metadata?.site !== SITE) continue;
    if (!isPaid(session)) continue;
    candidates.push(session);
  }
  checked = candidates.length;

  if (candidates.length > 0) {
    const known = await db
      .select({ sid: orders.stripeCheckoutSessionId })
      .from(orders)
      .where(
        inArray(
          orders.stripeCheckoutSessionId,
          candidates.map((c) => c.id),
        ),
      );
    const knownIds = new Set(known.map((k) => k.sid));
    for (const session of candidates) {
      if (knownIds.has(session.id)) continue;
      const result = await grantFromCheckoutSession(session, "reconcile");
      if (result.ok) granted += 1;
      else {
        failed += 1;
        await captureError({
          name: "ReconcileGrantFailed",
          message: `session ${session.id}: ${result.reason ?? "unknown"}`,
          route: "lib/reconcile",
          side: "server",
          severity: "warning",
          meta: { sessionId: session.id, kind: result.kind, userId: result.userId },
        });
      }
    }
  }

  // Memberships: refresh from Stripe.
  let synced = 0;
  const live = await db
    .select({ subscriptionId: entitlements.stripeSubscriptionId })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.kind, "membership"),
        inArray(entitlements.status, ["active", "past_due"]),
        isNotNull(entitlements.stripeSubscriptionId),
      ),
    );
  for (const row of live) {
    if (!row.subscriptionId) continue;
    const sub = await s.subscriptions.retrieve(row.subscriptionId);
    await syncSubscription(sub, "reconcile");
    synced += 1;
  }

  return { checked, granted, synced, failed };
}
