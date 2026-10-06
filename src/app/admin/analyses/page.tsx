import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiReports, users } from "@/lib/db/schema";
import { isStale } from "@/lib/ai/jobs";
import { Empty, PageHead, Stat, StatusTag, Table, Td, Th } from "../_components/ui";
import { fmtDate, fmtInt, shortId } from "../_components/format";
import { RerunAnalysis } from "../_components/RerunAnalysis";
import { requireAdmin } from "../guard";

export const dynamic = "force-dynamic";
// the re-run action writes the analysis after its response, inside this page's time budget
export const maxDuration = 800;
export const metadata: Metadata = {
  title: "Analyses · Admin",
  description: "Paid analyses written by the model: status, tokens, cost and failures.",
  robots: { index: false, follow: false },
};

const usd = (micros: number | null | undefined) => (micros == null ? "—" : `$${(micros / 1e6).toFixed(3)}`);

export default async function AdminAnalysesPage() {
  await requireAdmin();
  const rows = await db
    .select({
      assessmentId: aiReports.assessmentId,
      status: aiReports.status,
      attempts: aiReports.attempts,
      progress: aiReports.progress,
      model: aiReports.model,
      promptVersion: aiReports.promptVersion,
      inputTokens: aiReports.inputTokens,
      outputTokens: aiReports.outputTokens,
      costMicros: aiReports.costMicros,
      error: aiReports.error,
      startedAt: aiReports.startedAt,
      finishedAt: aiReports.finishedAt,
      updatedAt: aiReports.updatedAt,
      createdAt: aiReports.createdAt,
      email: users.email,
    })
    .from(aiReports)
    .leftJoin(users, eq(users.id, aiReports.userId))
    .orderBy(desc(aiReports.createdAt))
    .limit(200);

  const done = rows.filter((r) => r.status === "done");
  const failed = rows.filter((r) => r.status === "failed" || (r.status === "running" && isStale(r as never)));
  const spent = rows.reduce((s, r) => s + (r.costMicros ?? 0), 0);
  const avg = done.length ? done.reduce((s, r) => s + (r.costMicros ?? 0), 0) / done.length : null;
  const avgSeconds = done.length
    ? done.reduce((s, r) => s + (r.finishedAt ? (new Date(r.finishedAt).getTime() - new Date(r.startedAt).getTime()) / 1000 : 0), 0) / done.length
    : null;

  return (
    <div>
      <PageHead
        eyebrow="Admin · Analyses"
        title={
          <>
            Every paid <em>analysis</em>, newest first.
          </>
        }
        sub="Written by Claude Opus 5.5 after payment. Latest 200. Cost includes thinking tokens and any fallback model."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <Stat label="Written" value={fmtInt(done.length)} />
        <Stat label="Failed or stuck" value={fmtInt(failed.length)} />
        <Stat label="Spent (listed)" value={usd(spent)} />
        <Stat label="Average" value={avg == null ? "—" : `${usd(avg)} · ${Math.round(avgSeconds ?? 0)} s`} />
      </div>

      {rows.length === 0 ? (
        <Empty>No analyses yet.</Empty>
      ) : (
        <Table minWidth={1040}>
          <thead>
            <tr>
              <Th>Started</Th>
              <Th>Status</Th>
              <Th>Customer</Th>
              <Th className="text-right">Tokens in / out</Th>
              <Th className="text-right">Cost</Th>
              <Th>Model</Th>
              <Th>Error</Th>
              <Th>Report</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const stuck = r.status === "running" && isStale(r as never);
              return (
                <tr key={r.assessmentId}>
                  <Td mono>{fmtDate(r.startedAt)}</Td>
                  <Td>
                    <StatusTag status={stuck ? "stuck" : r.status} />
                    <div className="mt-1 font-mono text-[11px] text-ink-3">
                      try {r.attempts}
                      {r.status === "running" && !stuck ? ` · ${r.progress}%` : ""}
                    </div>
                  </Td>
                  <Td className="break-all">{r.email ?? "—"}</Td>
                  <Td mono className="text-right">
                    {r.inputTokens == null ? "—" : `${fmtInt(r.inputTokens)} / ${fmtInt(r.outputTokens)}`}
                  </Td>
                  <Td mono className="text-right text-ink">
                    {usd(r.costMicros)}
                  </Td>
                  <Td mono>
                    <div>{r.model ?? "—"}</div>
                    <div className="text-[11px] text-ink-3">{r.promptVersion}</div>
                  </Td>
                  <Td className="max-w-[18rem] text-xs text-ink-3">{r.error ?? "—"}</Td>
                  <Td>
                    <Link href={`/report/${r.assessmentId}`} className="font-mono text-xs text-ink-2 underline underline-offset-2 hover:text-ink">
                      {shortId(r.assessmentId, 6)}
                    </Link>
                  </Td>
                  <Td>{r.status !== "done" && (r.status === "failed" || stuck) ? <RerunAnalysis assessmentId={r.assessmentId} /> : null}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
