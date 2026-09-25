import type { Metadata } from "next";
import { count, desc, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { errorEvents } from "@/lib/db/schema";
import { Empty, FilterPills, PageHead, Table, Td, Th } from "../_components/ui";
import { ErrorActions } from "../_components/ErrorActions";
import { ago, fmtDate, fmtInt } from "../_components/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Errors · Admin",
  description: "Grouped server, client and edge errors with resolve / reopen.",
  robots: { index: false, follow: false },
};

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function AdminErrorsPage(props: PageProps<"/admin/errors">) {
  const sp = await props.searchParams;
  const filter = one(sp.filter) === "all" ? "all" : "unresolved";

  const [rows, [open], [total]] = await Promise.all([
    db
      .select({
        id: errorEvents.id,
        name: errorEvents.name,
        message: errorEvents.message,
        stack: errorEvents.stack,
        route: errorEvents.route,
        side: errorEvents.side,
        severity: errorEvents.severity,
        count: errorEvents.count,
        meta: errorEvents.meta,
        firstSeenAt: errorEvents.firstSeenAt,
        lastSeenAt: errorEvents.lastSeenAt,
        resolvedAt: errorEvents.resolvedAt,
      })
      .from(errorEvents)
      .where(filter === "unresolved" ? isNull(errorEvents.resolvedAt) : undefined)
      .orderBy(desc(errorEvents.lastSeenAt))
      .limit(200),
    db.select({ n: count() }).from(errorEvents).where(isNull(errorEvents.resolvedAt)),
    db.select({ n: count() }).from(errorEvents),
  ]);

  return (
    <div>
      <PageHead
        eyebrow="Admin · Errors"
        title={
          <>
            What <em>broke</em>, grouped.
          </>
        }
        sub="One row per fingerprint (name + first stack frame + route). A resolved row reopens itself if the same error fires again."
        aside={
          <FilterPills
            items={[
              { href: "/admin/errors", label: "Unresolved", active: filter === "unresolved", count: open?.n ?? 0 },
              { href: "/admin/errors?filter=all", label: "All", active: filter === "all", count: total?.n ?? 0 },
            ]}
          />
        }
      />

      {rows.length === 0 ? (
        <Empty>
          {filter === "unresolved" ? "Nothing unresolved. The site is quiet." : "No errors have ever been recorded."}
        </Empty>
      ) : (
        <Table minWidth={860}>
          <thead>
            <tr>
              <Th>Error</Th>
              <Th>Where</Th>
              <Th className="text-right">Count</Th>
              <Th>First seen</Th>
              <Th>Last seen</Th>
              <Th>State</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <Td className="max-w-[26rem]">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-mono text-xs text-ink">{e.name}</span>
                    {e.severity !== "error" && <span className="tag tag-signal">{e.severity}</span>}
                  </div>
                  <div className="text-ink-2 break-words leading-snug">{e.message}</div>
                  {(e.stack || e.meta) && (
                    <details className="mt-2 group">
                      <summary className="cursor-pointer select-none text-xs text-ink-3 hover:text-ink inline-flex items-center min-h-11 sm:min-h-0 sm:py-1">
                        Stack &amp; meta
                      </summary>
                      {e.stack && (
                        <pre className="slab-inset mt-2 p-3 text-[11px] leading-relaxed font-mono text-ink-2 whitespace-pre-wrap break-all max-h-80 overflow-auto">
                          {e.stack}
                        </pre>
                      )}
                      {e.meta && (
                        <pre className="slab-inset mt-2 p-3 text-[11px] leading-relaxed font-mono text-ink-2 whitespace-pre-wrap break-all max-h-60 overflow-auto">
                          {JSON.stringify(e.meta, null, 2)}
                        </pre>
                      )}
                    </details>
                  )}
                </Td>
                <Td>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="tag">{e.side}</span>
                    <span className="font-mono text-xs text-ink-3 break-all">{e.route ?? "—"}</span>
                  </div>
                </Td>
                <Td mono className="text-right text-ink">
                  {fmtInt(e.count)}
                </Td>
                <Td mono>{fmtDate(e.firstSeenAt)}</Td>
                <Td mono>
                  <span title={fmtDate(e.lastSeenAt)}>{ago(e.lastSeenAt)}</span>
                </Td>
                <Td>
                  <ErrorActions id={e.id} resolved={Boolean(e.resolvedAt)} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
