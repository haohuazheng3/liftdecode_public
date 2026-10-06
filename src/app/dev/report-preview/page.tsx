import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QUESTIONS } from "@/content/questions";
import { CLEARANCES, FINDING_RULES } from "@/content/rules";
import { diagnose } from "@/lib/engine/diagnose";
import type { Assessment } from "@/lib/assessments";
import { AiReportView } from "@/components/report/AiReportView";
import { AnalysisWaiting } from "@/components/report/AnalysisWaiting";
import { ResultPaywall } from "@/components/paywall/ResultPaywall";
import { buildScorecard } from "@/lib/report/scorecard";
import { FIXTURE_ANSWERS, FIXTURE_REPORT } from "./fixture";

/**
 * Development-only preview of the paid report and the waiting screen, rendered from a fixture
 * (no database, no model call). 404 in production.
 *   /dev/report-preview            → the finished report
 *   /dev/report-preview?view=wait  → the waiting screen, simulated
 *   /dev/report-preview?view=pay   → the paywall for the same lifter
 */
export const metadata: Metadata = { title: "Report preview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ReportPreview(props: PageProps<"/dev/report-preview">) {
  if (process.env.NODE_ENV === "production") notFound();
  const sp = await props.searchParams;
  const result = diagnose({ track: "physique", answers: FIXTURE_ANSWERS, questions: QUESTIONS, rules: FINDING_RULES, clearances: CLEARANCES });
  const assessment = {
    id: "preview",
    userId: null,
    anonToken: "preview",
    track: "physique",
    answers: FIXTURE_ANSWERS,
    result,
    engineVersion: result.version,
    durationSeconds: 420,
    createdAt: new Date(),
    claimedAt: null,
    unlockedAt: new Date(),
  } satisfies Assessment;

  if (sp.view === "pay") {
    return <ResultPaywall id="preview" track="physique" answers={FIXTURE_ANSWERS} result={result} signedIn={false} canceled={false} />;
  }

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      {sp.view === "wait" ? (
        <AnalysisWaiting
          assessmentId="preview"
          initial={{ status: "running", stage: 0, progress: 2, attempts: 1 }}
          facts={buildScorecard(FIXTURE_ANSWERS, "physique").flatMap((d) => d.items.map((i) => i.fact))}
          simulate
        />
      ) : (
        <AiReportView assessment={assessment} report={FIXTURE_REPORT} via="report" doneSteps={["ai:w1:0"]} isOwner={false} />
      )}
    </div>
  );
}
