import type { Metadata } from "next";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import type { ContactStatus } from "../actions";
import { Empty, FilterPills, PageHead, Table, Td, Th } from "../_components/ui";
import { ContactActions } from "../_components/ContactActions";
import { ago, fmtDate } from "../_components/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact · Admin",
  description: "Messages from the contact form, with replied / spam actions.",
  robots: { index: false, follow: false },
};

const STATUSES: ContactStatus[] = ["new", "replied", "spam"];

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function asStatus(v: string | undefined): ContactStatus | "all" {
  return v === "replied" || v === "spam" || v === "new" ? v : v === "all" ? "all" : "new";
}

export default async function AdminContactPage(props: PageProps<"/admin/contact">) {
  const sp = await props.searchParams;
  const filter = asStatus(one(sp.status));

  const [rows, counts] = await Promise.all([
    db
      .select({
        id: contactMessages.id,
        name: contactMessages.name,
        email: contactMessages.email,
        message: contactMessages.message,
        ip: contactMessages.ip,
        userAgent: contactMessages.userAgent,
        status: contactMessages.status,
        notifiedAt: contactMessages.notifiedAt,
        createdAt: contactMessages.createdAt,
      })
      .from(contactMessages)
      .where(filter === "all" ? undefined : eq(contactMessages.status, filter))
      .orderBy(desc(contactMessages.createdAt))
      .limit(200),
    db.select({ status: contactMessages.status, n: count() }).from(contactMessages).groupBy(contactMessages.status),
  ]);
  const byStatus = new Map(counts.map((c) => [c.status, c.n]));
  const total = counts.reduce((n, c) => n + c.n, 0);

  return (
    <div>
      <PageHead
        eyebrow="Admin · Contact"
        title={
          <>
            People who <em>wrote in</em>.
          </>
        }
        sub="Reply from your own mail client — replying here is not wired up on purpose. Mark it replied when you have."
        aside={
          <FilterPills
            items={[
              ...STATUSES.map((s) => ({
                href: s === "new" ? "/admin/contact" : `/admin/contact?status=${s}`,
                label: s[0].toUpperCase() + s.slice(1),
                active: filter === s,
                count: byStatus.get(s) ?? 0,
              })),
              { href: "/admin/contact?status=all", label: "All", active: filter === "all", count: total },
            ]}
          />
        }
      />

      {rows.length === 0 ? (
        <Empty>{filter === "new" ? "No new messages." : "Nothing here."}</Empty>
      ) : (
        <Table minWidth={820}>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>From</Th>
              <Th>Message</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <Td mono>
                  <div title={fmtDate(m.createdAt)}>{ago(m.createdAt)}</div>
                  <div className="text-[11px] text-ink-3 mt-1">{m.notifiedAt ? "notified" : "not notified"}</div>
                </Td>
                <Td className="max-w-[14rem]">
                  <div className="text-ink break-words">{m.name}</div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-signal underline underline-offset-2 hover:text-signal-2 break-all text-xs"
                  >
                    {m.email}
                  </a>
                  {(m.ip || m.userAgent) && (
                    <div className="font-mono text-[11px] text-ink-3 mt-1 break-all">
                      {m.ip ?? "—"}
                      {m.userAgent ? ` · ${m.userAgent.slice(0, 60)}` : ""}
                    </div>
                  )}
                </Td>
                <Td className="max-w-[30rem]">
                  <div className="whitespace-pre-wrap break-words leading-relaxed text-ink-2">{m.message}</div>
                </Td>
                <Td>
                  <ContactActions id={m.id} status={STATUSES.find((s) => s === m.status) ?? "new"} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
