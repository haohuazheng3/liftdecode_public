import type { Metadata } from "next";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { assessments, entitlements, users } from "@/lib/db/schema";
import { pickActiveMembership } from "@/lib/entitlements";
import { Empty, PageHead, StatusTag, Table, Td, Th } from "../_components/ui";
import { ago, fmtDate, fmtDay, fmtInt, shortId } from "../_components/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Users · Admin",
  description: "Signed-up users with membership state and assessment counts.",
  robots: { index: false, follow: false },
};

interface MembershipRow {
  userId: string;
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/** The report gate's own rule (pickActiveMembership), evaluated on the newest rows per user. */
function membershipLabel(rows: MembershipRow[]): { status: string; label: string; detail?: string } {
  if (rows.length === 0) return { status: "none", label: "None" };
  const e = pickActiveMembership(rows);
  if (!e) return { status: "lapsed", label: "Lapsed", detail: rows[0]?.status };
  if (e.status === "canceled") {
    return { status: "canceled", label: "Canceled", detail: `access until ${fmtDay(e.currentPeriodEnd)}` };
  }
  return {
    status: e.status,
    label: e.status === "active" ? (e.cancelAtPeriodEnd ? "Canceling" : "Member") : "Past due",
    detail: e.currentPeriodEnd ? `until ${fmtDay(e.currentPeriodEnd)}` : undefined,
  };
}

export default async function AdminUsersPage() {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      stripeCustomerId: users.stripeCustomerId,
      createdAt: users.createdAt,
      lastSeenAt: users.lastSeenAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(200);

  const ids = rows.map((r) => r.id);
  const [ents, counts] =
    ids.length === 0
      ? [[], []]
      : await Promise.all([
          db
            .select({
              userId: entitlements.userId,
              status: entitlements.status,
              currentPeriodEnd: entitlements.currentPeriodEnd,
              cancelAtPeriodEnd: entitlements.cancelAtPeriodEnd,
            })
            .from(entitlements)
            .where(and(eq(entitlements.kind, "membership"), inArray(entitlements.userId, ids)))
            .orderBy(desc(entitlements.updatedAt)),
          db
            .select({ userId: assessments.userId, n: count() })
            .from(assessments)
            .where(inArray(assessments.userId, ids))
            .groupBy(assessments.userId),
        ]);

  const entsByUser = new Map<string, MembershipRow[]>();
  for (const e of ents) {
    const list = entsByUser.get(e.userId) ?? [];
    list.push(e);
    entsByUser.set(e.userId, list);
  }
  const countByUser = new Map<string, number>();
  for (const c of counts) if (c.userId) countByUser.set(c.userId, c.n);

  return (
    <div>
      <PageHead
        eyebrow="Admin · Users"
        title={
          <>
            Who <em>signed up</em>.
          </>
        }
        sub="Latest 200. Membership state follows the same rules the report gate uses."
      />

      {rows.length === 0 ? (
        <Empty>No users yet.</Empty>
      ) : (
        <Table minWidth={880}>
          <thead>
            <tr>
              <Th>Email</Th>
              <Th>Created</Th>
              <Th>Last seen</Th>
              <Th>Membership</Th>
              <Th className="text-right">Assessments</Th>
              <Th>Stripe customer</Th>
              <Th>User id</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => {
              const m = membershipLabel(entsByUser.get(u.id) ?? []);
              return (
                <tr key={u.id}>
                  <Td className="break-all text-ink">{u.email}</Td>
                  <Td mono>{fmtDate(u.createdAt)}</Td>
                  <Td mono>
                    <span title={fmtDate(u.lastSeenAt)}>{u.lastSeenAt ? ago(u.lastSeenAt) : "—"}</span>
                  </Td>
                  <Td>
                    <StatusTag status={m.status} label={m.label} />
                    {m.detail && <div className="font-mono text-[11px] text-ink-3 mt-1">{m.detail}</div>}
                  </Td>
                  <Td mono className="text-right text-ink">
                    {fmtInt(countByUser.get(u.id) ?? 0)}
                  </Td>
                  <Td mono>
                    {u.stripeCustomerId ? (
                      <a
                        href={`https://dashboard.stripe.com/customers/${u.stripeCustomerId}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-signal underline underline-offset-2 hover:text-signal-2"
                      >
                        {shortId(u.stripeCustomerId, 8)} ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td mono title={u.id}>
                    {shortId(u.id, 10)}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
