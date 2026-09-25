import type { Metadata } from "next";
import { count, desc, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { stripeEvents } from "@/lib/db/schema";
import { Empty, PageHead, Stat, StatusTag, Table, Td, Th } from "../_components/ui";
import { ago, fmtDate, fmtInt } from "../_components/format";
import { requireAdmin } from "../guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Stripe events · Admin",
  description: "Webhook idempotency ledger: every Stripe event received, processed or failed.",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  await requireAdmin();
  const [rows, [total], [failed]] = await Promise.all([
    db
      .select({
        id: stripeEvents.id,
        type: stripeEvents.type,
        receivedAt: stripeEvents.receivedAt,
        processedAt: stripeEvents.processedAt,
        error: stripeEvents.error,
      })
      .from(stripeEvents)
      .orderBy(desc(stripeEvents.receivedAt))
      .limit(200),
    db.select({ n: count() }).from(stripeEvents),
    db.select({ n: count() }).from(stripeEvents).where(isNotNull(stripeEvents.error)),
  ]);

  return (
    <div>
      <PageHead
        eyebrow="Admin · Stripe events"
        title={
          <>
            The <em>webhook</em> ledger.
          </>
        }
        sub="One row per Stripe event id. A row with an error was received but not applied — Stripe retries, and the success page grants access independently."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <Stat label="Events" value={fmtInt(total?.n)} hint="all time" />
        <Stat
          label="With error"
          value={fmtInt(failed?.n)}
          tone={(failed?.n ?? 0) > 0 ? "text-alert" : "text-clear"}
          hint="processing threw"
        />
        <Stat label="Shown" value={fmtInt(rows.length)} hint="newest first, max 200" />
      </div>

      {rows.length === 0 ? (
        <Empty>No Stripe events received yet.</Empty>
      ) : (
        <Table minWidth={760}>
          <thead>
            <tr>
              <Th>Received</Th>
              <Th>Type</Th>
              <Th>State</Th>
              <Th>Processed</Th>
              <Th>Event id</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <Td mono>
                  <span title={fmtDate(e.receivedAt)}>{ago(e.receivedAt)}</span>
                </Td>
                <Td className="font-mono text-xs text-ink">{e.type}</Td>
                <Td className="max-w-[24rem]">
                  {e.error ? (
                    <>
                      <StatusTag status="error" />
                      <div className="font-mono text-[11px] text-alert/90 mt-1 break-words leading-snug">{e.error}</div>
                    </>
                  ) : e.processedAt ? (
                    <StatusTag status="processed" />
                  ) : (
                    <StatusTag status="pending" label="received" />
                  )}
                </Td>
                <Td mono>{fmtDate(e.processedAt)}</Td>
                <Td mono>
                  <a
                    href={`https://dashboard.stripe.com/events/${e.id}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-signal underline underline-offset-2 hover:text-signal-2"
                  >
                    {e.id} ↗
                  </a>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
