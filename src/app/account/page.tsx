import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { activeMembership } from "@/lib/entitlements";
import { ensureUser } from "@/lib/users";
import { CONTACT_EMAIL } from "@/lib/env";
import { BillingButton } from "./BillingButton";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function fmt(d: Date | string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d));
}
function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/account");
  const user = await ensureUser(userId);
  const [member, history] = await Promise.all([
    activeMembership(userId),
    db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)).limit(50),
  ]);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="slab p-6 sm:p-8 animate-rise">
          <div className="eyebrow mb-2">Account</div>
          <h1 className="display text-3xl sm:text-4xl">{user.email}</h1>
          <p className="mt-2 text-sm text-ink-3">Signed in with a one-time email code. Use the avatar in the header to sign out.</p>
        </div>

        <div className="slab p-6 sm:p-8">
          <div className="eyebrow mb-3">Membership</div>
          {member ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-signal">Active</span>
                {member.status === "past_due" && <span className="tag tag-alert">Payment failed — update your card</span>}
                {(member.cancelAtPeriodEnd || member.status === "canceled") && <span className="tag">Cancels at period end</span>}
              </div>
              <p className="mt-3 text-ink-2 leading-relaxed">
                LiftDecode Membership, $15 per month.
                {member.currentPeriodEnd &&
                  ` ${member.cancelAtPeriodEnd || member.status === "canceled" ? "Access ends" : "Next renewal"} on ${fmt(member.currentPeriodEnd)}.`}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <BillingButton label="Manage or cancel" />
                <Link href="/dashboard" className="btn btn-quiet">
                  Back to dashboard
                </Link>
              </div>
              <p className="mt-3 text-xs text-ink-3">
                Cancelling keeps your access until the end of the paid period. Refund terms are in the{" "}
                <Link href="/refunds" className="underline underline-offset-2">
                  refund policy
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <p className="text-ink-2 leading-relaxed">
                No active membership. Single-report unlocks stay yours regardless.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link href="/pricing?intent=membership" className="btn btn-primary">
                  Become a member — $15/month
                </Link>
                {user.stripeCustomerId && <BillingButton label="Billing history" />}
              </div>
            </>
          )}
        </div>

        <div className="slab p-6 sm:p-8">
          <div className="eyebrow mb-3">Purchases</div>
          {history.length === 0 ? (
            <p className="text-ink-3 text-sm">No purchases yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {history.map((o) => (
                <li key={o.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="text-ink">
                      {o.kind === "membership" ? "Membership" : "Report unlock"}
                      {o.promoCode ? <span className="text-ink-3"> · code {o.promoCode}</span> : null}
                    </div>
                    <div className="text-ink-3 font-mono text-xs">{fmt(o.createdAt)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono">{money(o.amountTotal, o.currency)}</div>
                    <div className={`text-xs ${o.status === "refunded" ? "text-alert" : o.status === "paid" ? "text-clear" : "text-ink-3"}`}>
                      {o.status}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-ink-3">Receipts are emailed by Stripe. Need one re-sent, or your data deleted? Write to {CONTACT_EMAIL}.</p>
        </div>
      </div>
    </div>
  );
}
