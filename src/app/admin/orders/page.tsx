import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { Empty, PageHead, StatusTag, Table, Td, Th } from "../_components/ui";
import { fmtDate, fmtMoney, shortId } from "../_components/format";
import { requireAdmin } from "../guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Orders · Admin",
  description: "Every Checkout Session that reached the ledger, with Stripe links.",
  robots: { index: false, follow: false },
};

function stripeLink(o: { stripePaymentIntentId: string | null; stripeSubscriptionId: string | null }) {
  if (o.stripePaymentIntentId) {
    return { href: `https://dashboard.stripe.com/payments/${o.stripePaymentIntentId}`, label: "Payment" };
  }
  if (o.stripeSubscriptionId) {
    return { href: `https://dashboard.stripe.com/subscriptions/${o.stripeSubscriptionId}`, label: "Subscription" };
  }
  return null;
}

export default async function AdminOrdersPage() {
  await requireAdmin();
  const rows = await db
    .select({
      id: orders.id,
      kind: orders.kind,
      status: orders.status,
      amountTotal: orders.amountTotal,
      currency: orders.currency,
      promoCode: orders.promoCode,
      customerEmail: orders.customerEmail,
      userEmail: users.email,
      userId: orders.userId,
      assessmentId: orders.assessmentId,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      stripeSubscriptionId: orders.stripeSubscriptionId,
      stripeCheckoutSessionId: orders.stripeCheckoutSessionId,
      createdAt: orders.createdAt,
      refundedAt: orders.refundedAt,
    })
    .from(orders)
    .leftJoin(users, eq(users.id, orders.userId))
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return (
    <div>
      <PageHead
        eyebrow="Admin · Orders"
        title={
          <>
            Every <em>order</em>, newest first.
          </>
        }
        sub="Latest 200. Amounts are gross in the order's currency."
      />

      <div className="slab-inset p-4 mb-4 text-sm text-ink-2 leading-relaxed">
        <span className="eyebrow mr-2">Refunds</span>
        Refund in Stripe, not here. Open the payment, refund it there, and the webhook marks the order refunded and
        revokes the report or membership on its own. Nothing to do in this panel afterwards.
      </div>

      {rows.length === 0 ? (
        <Empty>No orders yet.</Empty>
      ) : (
        <Table minWidth={960}>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Kind</Th>
              <Th>Status</Th>
              <Th className="text-right">Amount</Th>
              <Th>Promo</Th>
              <Th>Customer</Th>
              <Th>Stripe</Th>
              <Th>Report</Th>
              <Th>Order id</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => {
              const link = stripeLink(o);
              return (
                <tr key={o.id}>
                  <Td mono>{fmtDate(o.createdAt)}</Td>
                  <Td>{o.kind}</Td>
                  <Td>
                    <StatusTag status={o.status} />
                    {o.refundedAt && <div className="font-mono text-[11px] text-ink-3 mt-1">{fmtDate(o.refundedAt)}</div>}
                  </Td>
                  <Td mono className="text-right text-ink">
                    {fmtMoney(o.amountTotal, o.currency)}
                  </Td>
                  <Td mono>{o.promoCode ?? "—"}</Td>
                  <Td className="break-all">
                    <div>{o.customerEmail ?? o.userEmail ?? "—"}</div>
                    {o.userId && <div className="font-mono text-[11px] text-ink-3">{shortId(o.userId, 10)}</div>}
                  </Td>
                  <Td>
                    {link ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-signal underline underline-offset-2 hover:text-signal-2 whitespace-nowrap"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <span className="text-ink-4">—</span>
                    )}
                    <div className="font-mono text-[11px] text-ink-3 mt-1" title={o.stripeCheckoutSessionId}>
                      {shortId(o.stripeCheckoutSessionId, 8)}
                    </div>
                  </Td>
                  <Td>
                    {o.assessmentId ? (
                      <Link
                        href={`/report/${o.assessmentId}`}
                        className="text-ink-2 underline underline-offset-2 hover:text-ink font-mono text-xs"
                      >
                        {shortId(o.assessmentId, 6)}
                      </Link>
                    ) : (
                      <span className="text-ink-4">—</span>
                    )}
                  </Td>
                  <Td mono>{shortId(o.id)}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
