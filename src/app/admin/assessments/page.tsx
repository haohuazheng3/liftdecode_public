import type { Metadata } from "next";
import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { assessments } from "@/lib/db/schema";
import { FINDINGS } from "@/content/findings";
import { Empty, PageHead, StatusTag, Table, Td, Th } from "../_components/ui";
import { fmtDate, fmtDuration, fmtInt, shortId } from "../_components/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Assessments · Admin",
  description: "Every completed diagnosis with its primary finding and unlock state.",
  robots: { index: false, follow: false },
};

export default async function AdminAssessmentsPage() {
  const rows = await db
    .select({
      id: assessments.id,
      track: assessments.track,
      userId: assessments.userId,
      durationSeconds: assessments.durationSeconds,
      engineVersion: assessments.engineVersion,
      createdAt: assessments.createdAt,
      claimedAt: assessments.claimedAt,
      unlockedAt: assessments.unlockedAt,
      primary: sql<string | null>`${assessments.result}->>'primary'`,
      findingCount: sql<number>`jsonb_array_length(coalesce(${assessments.result}->'findings', '[]'::jsonb))`.mapWith(Number),
      clearanceCount: sql<number>`jsonb_array_length(coalesce(${assessments.result}->'clearances', '[]'::jsonb))`.mapWith(Number),
    })
    .from(assessments)
    .orderBy(desc(assessments.createdAt))
    .limit(200);

  return (
    <div>
      <PageHead
        eyebrow="Admin · Assessments"
        title={
          <>
            Every <em>diagnosis</em> that finished.
          </>
        }
        sub="Latest 200. Open any report — the report page lets admins through without an entitlement."
      />

      {rows.length === 0 ? (
        <Empty>No assessments yet.</Empty>
      ) : (
        <Table minWidth={900}>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Track</Th>
              <Th>Primary finding</Th>
              <Th className="text-right">Findings</Th>
              <Th className="text-right">Clear</Th>
              <Th>Duration</Th>
              <Th>Owner</Th>
              <Th>Access</Th>
              <Th>Report</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <Td mono>{fmtDate(a.createdAt)}</Td>
                <Td>
                  <span className="tag">{a.track}</span>
                </Td>
                <Td className="max-w-[18rem]">
                  {a.primary ? (
                    <>
                      <div className="text-ink leading-snug">{FINDINGS[a.primary]?.title ?? a.primary}</div>
                      <div className="font-mono text-[11px] text-ink-3">{a.primary}</div>
                    </>
                  ) : (
                    <span className="text-ink-3">none fired</span>
                  )}
                </Td>
                <Td mono className="text-right text-ink">
                  {fmtInt(a.findingCount)}
                </Td>
                <Td mono className="text-right">
                  {fmtInt(a.clearanceCount)}
                </Td>
                <Td mono>{fmtDuration(a.durationSeconds)}</Td>
                <Td mono>
                  {a.userId ? (
                    <span title={a.userId}>{shortId(a.userId, 8)}</span>
                  ) : (
                    <span className="text-ink-3">anonymous</span>
                  )}
                </Td>
                <Td>
                  {a.unlockedAt ? (
                    <>
                      <StatusTag status="unlocked" />
                      <div className="font-mono text-[11px] text-ink-3 mt-1">{fmtDate(a.unlockedAt)}</div>
                    </>
                  ) : (
                    <span className="tag">locked</span>
                  )}
                </Td>
                <Td>
                  <Link
                    href={`/report/${a.id}`}
                    className="inline-flex items-center min-h-11 sm:min-h-0 text-signal underline underline-offset-2 hover:text-signal-2 font-mono text-xs"
                  >
                    {shortId(a.id, 6)}
                  </Link>
                  <div className="font-mono text-[11px] text-ink-3">{a.engineVersion}</div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
