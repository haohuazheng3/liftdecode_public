import type Stripe from "stripe";
import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { assessments, entitlements, orders, users } from "@/lib/db/schema";
import { newId } from "@/lib/ids";
import { stripe } from "@/lib/stripe";
import { captureError } from "@/lib/errors";

export type EntitlementSource = "checkout_verify" | "webhook" | "reconcile" | "admin" | "membership";

const GRACE_MS = 3 * 24 * 3600 * 1000; // 3 days past the last *paid* period end (covers Stripe's retries)

export type Entitlement = typeof entitlements.$inferSelect;

export interface MembershipState {
  status: string;
  currentPeriodEnd: Date | string | null;
}

/**
 * The one rule for "is this membership in good standing", shared by the report
 * gate and the admin pages so they can never drift. `rows` = membership
 * entitlements, newest first.
 *  - active:   until the period end plus the grace window;
 *  - past_due: the row's period end is the end of the last paid period (see
 *              markPastDue / syncSubscription), so access is that plus 3 days,
 *              never the whole unpaid month Stripe has already opened;
 *  - canceled: readable until the paid period runs out;
 *  - anything else (inactive, refunded): nothing.
 */
export function pickActiveMembership<T extends MembershipState>(rows: T[], now = Date.now()): T | null {
  for (const e of rows) {
    const end = e.currentPeriodEnd ? new Date(e.currentPeriodEnd).getTime() : null;
    if (e.status === "active" || e.status === "past_due") {
      if (end === null || end + GRACE_MS > now) return e;
    }
    if (e.status === "canceled" && end !== null && end > now) return e;
  }
  return null;
}

export async function activeMembership(userId: string): Promise<Entitlement | null> {
  const rows = await db
    .select()
    .from(entitlements)
    .where(and(eq(entitlements.userId, userId), eq(entitlements.kind, "membership")))
    .orderBy(desc(entitlements.updatedAt))
    .limit(5);
  return pickActiveMembership(rows);
}

export async function reportEntitlement(userId: string, assessmentId: string): Promise<Entitlement | null> {
  const rows = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.kind, "report"),
        eq(entitlements.assessmentId, assessmentId),
        eq(entitlements.status, "active"),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function canViewReport(
  userId: string,
  assessmentId: string,
): Promise<{ allowed: boolean; via: "membership" | "report" | null }> {
  const [m, r] = await Promise.all([activeMembership(userId), reportEntitlement(userId, assessmentId)]);
  if (m) return { allowed: true, via: "membership" };
  if (r) return { allowed: true, via: "report" };
  return { allowed: false, via: null };
}

/**
 * Members keep the reports they open. The first time a member views a report a
 * report entitlement is written, so it stays readable after the membership
 * lapses — which is what the FAQ and the refund policy promise. Two concurrent
 * first views can both insert; the duplicate row is harmless.
 */
export async function ensureReportEntitlement(
  userId: string,
  assessmentId: string,
  source: EntitlementSource,
): Promise<void> {
  if (await reportEntitlement(userId, assessmentId)) return;
  await db
    .insert(entitlements)
    .values({ id: newId(16), userId, kind: "report", assessmentId, status: "active", source })
    .onConflictDoNothing();
  await db
    .update(assessments)
    .set({ unlockedAt: sql`coalesce(${assessments.unlockedAt}, now())` })
    .where(and(eq(assessments.id, assessmentId), eq(assessments.userId, userId)));
}

/** Period end lives on subscription items in current API versions; fall back to the legacy field. */
export function periodEndOf(sub: Stripe.Subscription): Date | null {
  const item = sub.items?.data?.[0] as (Stripe.SubscriptionItem & { current_period_end?: number }) | undefined;
  const legacy = (sub as unknown as { current_period_end?: number }).current_period_end;
  const ts = item?.current_period_end ?? legacy;
  return ts ? new Date(ts * 1000) : null;
}

/**
 * Stripe status → entitlement status. Only active / past_due / canceled can
 * grant anything (see pickActiveMembership). Everything that was never paid
 * for or has stopped being paid for — incomplete, incomplete_expired, unpaid
 * (retries exhausted), paused — is "inactive".
 */
function mapSubStatus(s: Stripe.Subscription.Status): string {
  switch (s) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
    case "paused":
    default:
      return "inactive";
  }
}

export interface GrantResult {
  ok: boolean;
  kind: "report" | "membership" | null;
  assessmentId: string | null;
  userId: string | null;
  reason?: string;
}

/**
 * Turn a paid Checkout Session into entitlement + order rows. Idempotent:
 * safe to call from the success page, the webhook and the reconcile script.
 */
export async function grantFromCheckoutSession(
  sessionInput: Stripe.Checkout.Session,
  source: EntitlementSource,
): Promise<GrantResult> {
  const s = stripe();
  const session =
    typeof sessionInput.subscription === "string" || sessionInput.mode === "subscription"
      ? await s.checkout.sessions.retrieve(sessionInput.id, { expand: ["subscription", "payment_intent"] })
      : sessionInput;

  const md = session.metadata ?? {};
  const userId = md.userId ?? session.client_reference_id ?? null;
  const kind = md.kind === "membership" || md.kind === "report" ? md.kind : null;
  const assessmentId = md.assessmentId || null;
  if (!userId || !kind) {
    await captureError({
      name: "GrantMissingMetadata",
      message: `session ${session.id} has no userId/kind metadata`,
      route: "lib/entitlements",
      side: "server",
      meta: { source, sessionId: session.id },
    });
    return { ok: false, kind, assessmentId, userId, reason: "missing metadata" };
  }
  if (md.site && md.site !== "liftdecode.com") {
    return { ok: false, kind, assessmentId, userId, reason: "foreign site" };
  }

  const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (!paid) return { ok: false, kind, assessmentId, userId, reason: `payment_status=${session.payment_status}` };

  const customerId = typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null);
  const subscription =
    session.subscription && typeof session.subscription !== "string" ? session.subscription : null;
  const subscriptionId = subscription?.id ?? (typeof session.subscription === "string" ? session.subscription : null);
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null);
  const promo = session.discounts?.[0]?.promotion_code;
  const promoCode = typeof promo === "string" ? promo : (promo?.code ?? null);

  // user must exist (FK); create a bare row if the webhook beat the app
  await db
    .insert(users)
    .values({ id: userId, email: session.customer_details?.email ?? session.customer_email ?? `${userId}@unknown.local` })
    .onConflictDoNothing();
  if (customerId) {
    await db.update(users).set({ stripeCustomerId: customerId, updatedAt: new Date() }).where(eq(users.id, userId));
  }

  // order ledger
  await db
    .insert(orders)
    .values({
      id: newId(16),
      userId,
      kind,
      assessmentId,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      stripeSubscriptionId: subscriptionId,
      stripeInvoiceId: typeof session.invoice === "string" ? session.invoice : (session.invoice?.id ?? null),
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status: "paid",
      promoCode,
      customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
    })
    .onConflictDoUpdate({
      target: orders.stripeCheckoutSessionId,
      set: { status: "paid", stripePaymentIntentId: paymentIntentId, stripeSubscriptionId: subscriptionId },
    });

  if (kind === "report") {
    if (!assessmentId) return { ok: false, kind, assessmentId, userId, reason: "report without assessment" };
    await db
      .insert(entitlements)
      .values({
        id: newId(16),
        userId,
        kind: "report",
        assessmentId,
        stripeCheckoutSessionId: session.id,
        stripeCustomerId: customerId,
        status: "active",
        source,
      })
      .onConflictDoNothing();
    await db
      .update(assessments)
      .set({
        userId,
        claimedAt: sql`coalesce(${assessments.claimedAt}, now())`,
        unlockedAt: sql`coalesce(${assessments.unlockedAt}, now())`,
      })
      .where(and(eq(assessments.id, assessmentId), or(isNull(assessments.userId), eq(assessments.userId, userId))));
    return { ok: true, kind, assessmentId, userId };
  }

  // membership
  const periodEnd = subscription ? periodEndOf(subscription) : null;
  const status = subscription ? mapSubStatus(subscription.status) : "active";
  if (subscriptionId) {
    await db
      .insert(entitlements)
      .values({
        id: newId(16),
        userId,
        kind: "membership",
        stripeCheckoutSessionId: session.id,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        status,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
        source,
      })
      .onConflictDoUpdate({
        target: entitlements.stripeSubscriptionId,
        set: {
          status,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
          updatedAt: new Date(),
        },
      });
  }
  if (assessmentId) {
    await db
      .update(assessments)
      .set({
        userId,
        claimedAt: sql`coalesce(${assessments.claimedAt}, now())`,
        unlockedAt: sql`coalesce(${assessments.unlockedAt}, now())`,
      })
      .where(and(eq(assessments.id, assessmentId), or(isNull(assessments.userId), eq(assessments.userId, userId))));
  }
  return { ok: true, kind, assessmentId, userId };
}

/** Keep the membership row in step with Stripe subscription lifecycle events. */
export async function syncSubscription(sub: Stripe.Subscription, source: EntitlementSource): Promise<void> {
  const status = mapSubStatus(sub.status);
  const periodEnd = periodEndOf(sub);
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const userId = sub.metadata?.userId ?? null;

  const existing = await db.select().from(entitlements).where(eq(entitlements.stripeSubscriptionId, sub.id)).limit(1);
  if (existing[0]) {
    // Stripe moves the period forward the moment a renewal invoice is created, before the
    // charge is attempted. Only a paid-up subscription may advance the period end; for
    // past_due / canceled / inactive the row keeps the end of the last paid period.
    await db
      .update(entitlements)
      .set({
        status,
        currentPeriodEnd: status === "active" ? periodEnd : existing[0].currentPeriodEnd,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        updatedAt: new Date(),
      })
      .where(eq(entitlements.id, existing[0].id));
    return;
  }
  // No row yet: find the user by metadata or by customer id
  let uid = userId;
  if (!uid) {
    const u = await db.select({ id: users.id }).from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);
    uid = u[0]?.id ?? null;
  }
  if (!uid) {
    await captureError({
      name: "SubscriptionWithoutUser",
      message: `subscription ${sub.id} could not be matched to a user`,
      route: "lib/entitlements",
      side: "server",
      severity: "warning",
      meta: { source, customerId },
    });
    return;
  }
  await db
    .insert(entitlements)
    .values({
      id: newId(16),
      userId: uid,
      kind: "membership",
      stripeSubscriptionId: sub.id,
      stripeCustomerId: customerId,
      status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      source,
    })
    .onConflictDoNothing();
}

/** A refunded one-time payment takes the report entitlement away. */
export async function markRefunded(paymentIntentId: string): Promise<void> {
  const rows = await db
    .update(orders)
    .set({ status: "refunded", refundedAt: new Date() })
    .where(eq(orders.stripePaymentIntentId, paymentIntentId))
    .returning();
  for (const o of rows) {
    if (o.kind === "report") {
      await db
        .update(entitlements)
        .set({ status: "refunded", updatedAt: new Date() })
        .where(and(eq(entitlements.stripeCheckoutSessionId, o.stripeCheckoutSessionId), eq(entitlements.kind, "report")));
    }
  }
}

/**
 * A renewal charge failed. Stripe has already opened the next period, so the
 * row's period end is pulled back to `paidThrough` — the start of the failed
 * invoice's service period, i.e. the end of the last period that was paid.
 * Access then lasts GRACE_MS beyond what was paid for, not a free month.
 * Only a membership that was in good standing is demoted: a subscription whose
 * very first charge failed is "inactive" and stays that way.
 */
export async function markPastDue(subscriptionId: string, paidThrough: Date | null): Promise<void> {
  const rows = await db
    .select({ id: entitlements.id, status: entitlements.status, currentPeriodEnd: entitlements.currentPeriodEnd })
    .from(entitlements)
    .where(eq(entitlements.stripeSubscriptionId, subscriptionId))
    .limit(1);
  const row = rows[0];
  if (!row || (row.status !== "active" && row.status !== "past_due")) return;
  const current = row.currentPeriodEnd ? new Date(row.currentPeriodEnd).getTime() : null;
  const periodEnd =
    paidThrough && (current === null || paidThrough.getTime() < current) ? paidThrough : row.currentPeriodEnd;
  await db
    .update(entitlements)
    .set({ status: "past_due", currentPeriodEnd: periodEnd, updatedAt: new Date() })
    .where(eq(entitlements.id, row.id));
}
