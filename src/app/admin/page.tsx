import type { Metadata } from "next";
import Link from "next/link";
import { and, count, countDistinct, desc, eq, gt, gte, inArray, isNull, or, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { assessments, contactMessages, entitlements, errorEvents, inboxMessages, orders, users } from "@/lib/db/schema";
import { FINDINGS } from "@/content/findings";
import { Empty, PageHead, Stat, StatusTag, Table, Td, Th } from "./_components/ui";
import { ago, fmtDate, fmtInt, fmtMoney, shortId } from "./_components/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Overview · Admin",
  description: "Counts, revenue, finding frequency and the latest orders.",
  robots: { index: false, follow: false },
};

/** mirrors the grace window in lib/entitlements so the count matches what users experience */
const GRACE_MS = 3 * 24 * 3600 * 1000;

interface FreqRow {
  id: string;
  n: number | string;
}

export default async function AdminOverviewPage() {
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 864e5);
  const d30 = new Date(now.getTime() - 30 * 864e5);
  const h24 = new Date(now.getTime() - 864e5);
  const graceEdge = new Date(now.getTime() - GRACE_MS);

  const [[u], byTrack, [a7], [o30], [mem], [errs], [msgs], [inbox], primaryRes, overallRes, latestOrders] =
    await Promise.all([
      db.select({ n: count() }).from(users),
      db.select({ track: assessments.track, n: count() }).from(assessments).groupBy(assessments.track),
      db.select({ n: count() }).from(assessments).where(gte(assessments.createdAt, d7)),
      db
        .select({ n: count(), revenue: sum(orders.amountTotal) })
        .from(orders)
        .where(and(eq(orders.status, "paid"), gte(orders.createdAt, d30))),
      db
        .select({ n: countDistinct(entitlements.userId) })
        .from(entitlements)
        .where(
          and(
            eq(entitlements.kind, "membership"),
            or(
              and(
                inArray(entitlements.status, ["active", "past_due"]),
                or(isNull(entitlements.currentPeriodEnd), gt(entitlements.currentPeriodEnd, graceEdge)),
              ),
              and(eq(entitlements.status, "canceled"), gt(entitlements.currentPeriodEnd, now)),
            ),
          ),
        ),
      db.select({ n: count() }).from(errorEvents).where(isNull(errorEvents.resolvedAt)),
      db.select({ n: count() }).from(contactMessages).where(eq(contactMessages.status, "new")),
      db.select({ n: count() }).from(inboxMessages).where(gte(inboxMessages.receivedAt, h24)),
      db.execute(
        sql`select ${assessments.result}->>'primary' as id, count(*)::int as n
            from ${assessments}
            where ${assessments.result}->>'primary' is not null
            group by 1 order by 2 desc limit 60`,
      ),
      db.execute(
        sql`select f->>'id' as id, count(*)::int as n
            from ${assessments}, jsonb_array_elements(coalesce(${assessments.result}->'findings', '[]'::jsonb)) as f
            group by 1 order by 2 desc limit 60`,
      ),
      db
        .select({
          id: orders.id,
          kind: orders.kind,
          status: orders.status,
          amountTotal: orders.amountTotal,
          currency: orders.currency,
          promoCode: orders.promoCode,
          customerEmail: orders.customerEmail,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(10),
    ]);

  const totalAssessments = byTrack.reduce((n, t) => n + t.n, 0);
  const trackLine = byTrack.length
    ? byTrack.map((t) => `${t.track} ${fmtInt(t.n)}`).join(" · ")
    : "no assessments yet";

  // finding frequency: merge primary + overall per id, sort by overall desc
  const freq = new Map<string, { primary: number; overall: number }>();
  for (const r of primaryRes.rows as unknown as FreqRow[]) {
    const cur = freq.get(r.id) ?? { primary: 0, overall: 0 };
    cur.primary = Number(r.n);
    freq.set(r.id, cur);
  }
  for (const r of overallRes.rows as unknown as FreqRow[]) {
    const cur = freq.get(r.id) ?? { primary: 0, overall: 0 };
    cur.overall = Number(r.n);
    freq.set(r.id, cur);
  }
  const freqRows = [...freq.entries()]
    .map(([id, v]) => ({ id, ...v, title: FINDINGS[id]?.title ?? null }))
    .sort((a, b) => b.overall - a.overall || b.primary - a.primary);

  const revenue = Number(o30?.revenue ?? 0);
  const unresolved = errs?.n ?? 0;
  const newMsgs = msgs?.n ?? 0;

  return (
    <div>
      <PageHead
        eyebrow="Admin · Overview"
        title={
          <>
            The <em>numbers</em>, at a glance.
          </>
        }
        sub={`All times UTC. Snapshot taken ${fmtDate(now)}.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Users" value={fmtInt(u?.n)} hint="rows in users" />
        <Stat label="Assessments" value={fmtInt(totalAssessments)} hint={trackLine} />
        <Stat label="Assessments · 7d" value={fmtInt(a7?.n)} hint="completed in the last 7 days" />
        <Stat label="Active members" value={fmtInt(mem?.n)} hint="membership entitlements in good standing" />
        <Stat label="Paid orders · 30d" value={fmtInt(o30?.n)} hint="status = paid" />
        <Stat label="Revenue · 30d" value={fmtMoney(revenue, "usd")} hint="gross, before Stripe fees and refunds" />
        <Stat
          label="Unresolved errors"
          value={fmtInt(unresolved)}
          tone={unresolved > 0 ? "text-alert" : "text-clear"}
          hint={
            <Link href="/admin/errors" className="underline underline-offset-2 hover:text-ink">
              open the error inbox
            </Link>
          }
        />
        <Stat
          label="New contact messages"
          value={fmtInt(newMsgs)}
          tone={newMsgs > 0 ? "text-signal" : "text-ink"}
          hint={
            <Link href="/admin/contact" className="underline underline-offset-2 hover:text-ink">
              read them
            </Link>
          }
        />
        <Stat label="Inbox · 24h" value={fmtInt(inbox?.n)} hint="test-inbox messages received" />
      </div>

      <section className="mt-6 sm:mt-8">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <div className="eyebrow">Finding frequency</div>
            <p className="text-sm text-ink-3 mt-1">
              How often each finding fires as the primary bottleneck and anywhere in a report. Read from stored results,
              so it reflects what people actually saw.
            </p>
          </div>
        </div>
        {freqRows.length === 0 ? (
          <Empty>No findings recorded yet — they appear here after the first completed diagnosis.</Empty>
        ) : (
          <Table minWidth={640}>
            <thead>
              <tr>
                <Th>Finding</Th>
                <Th className="text-right">Primary</Th>
                <Th className="text-right">Overall</Th>
                <Th className="text-right">Share of reports</Th>
              </tr>
            </thead>
            <tbody>
              {freqRows.map((r) => {
                const share = totalAssessments > 0 ? Math.round((r.overall / totalAssessments) * 100) : 0;
                return (
                  <tr key={r.id}>
                    <Td>
                      <div className="text-ink">{r.title ?? r.id}</div>
                      <div className="font-mono text-xs text-ink-3">{r.id}</div>
                    </Td>
                    <Td mono className="text-right text-ink">
                      {fmtInt(r.primary)}
                    </Td>
                    <Td mono className="text-right text-ink">
                      {fmtInt(r.overall)}
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="h-1.5 w-20 rounded-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
                          <span className="block h-full bg-signal rounded-full" style={{ width: `${share}%` }} />
                        </span>
                        <span className="font-mono text-xs tabular-nums">{share}%</span>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </section>

      <section className="mt-6 sm:mt-8">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div className="eyebrow">Latest 10 orders</div>
          <Link href="/admin/orders" className="text-sm text-ink-2 underline underline-offset-2 hover:text-ink">
            All orders
          </Link>
        </div>
        {latestOrders.length === 0 ? (
          <Empty>No orders yet.</Empty>
        ) : (
          <Table minWidth={680}>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Kind</Th>
                <Th>Status</Th>
                <Th className="text-right">Amount</Th>
                <Th>Promo</Th>
                <Th>Customer</Th>
                <Th>Order</Th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((o) => (
                <tr key={o.id}>
                  <Td mono title={fmtDate(o.createdAt)}>
                    {ago(o.createdAt)}
                  </Td>
                  <Td>{o.kind}</Td>
                  <Td>
                    <StatusTag status={o.status} />
                  </Td>
                  <Td mono className="text-right text-ink">
                    {fmtMoney(o.amountTotal, o.currency)}
                  </Td>
                  <Td mono>{o.promoCode ?? "—"}</Td>
                  <Td className="break-all">{o.customerEmail ?? "—"}</Td>
                  <Td mono>{shortId(o.id)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </div>
  );
}
