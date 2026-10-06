import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, planProgress } from "@/lib/db/schema";
import { getAssessment, resolveOwnership } from "@/lib/assessments";
import { canViewReport, ensureReportEntitlement } from "@/lib/entitlements";
import { isAdminEmail } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";
import { Report } from "@/components/report/Report";
import { UnlockPing } from "@/components/report/ReportTools";
import { AiReportView } from "@/components/report/AiReportView";
import { AnalysisWaiting } from "@/components/report/AnalysisWaiting";
import { getJob, jobView, MAX_ATTEMPTS, MEMBER_ANALYSES_PER_30_DAYS, recentAnalyses } from "@/lib/ai/jobs";
import { buildScorecard } from "@/lib/report/scorecard";

export const metadata: Metadata = { title: "Your report", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ReportPage(props: PageProps<"/report/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const { userId } = await auth();
  if (!userId) redirect(`/sign-in?redirect_url=${encodeURIComponent(`/report/${id}`)}`);

  const a = await getAssessment(id);
  if (!a) notFound();

  const { owns } = await resolveOwnership(a, userId);
  let via: "membership" | "report" | "admin" | null = null;
  if (owns) {
    const access = await canViewReport(userId, id);
    via = access.via;
  }
  if (!via) {
    const cu = await currentUser();
    if (isAdminEmail(cu?.primaryEmailAddress?.emailAddress)) via = "admin";
  }
  if (!via) {
    if (owns) redirect(`/diagnose/result/${id}`);
    notFound();
  }

  // A member who opens a report keeps it after the membership ends (FAQ + refund policy).
  if (owns && via === "membership") {
    try {
      await ensureReportEntitlement(userId, id, "membership");
    } catch (e) {
      await captureFromUnknown(e, "/report/[id]", "server", { assessmentId: id });
    }
  }

  const [done, lastOrder] = await Promise.all([
    owns
      ? db
          .select({ stepKey: planProgress.stepKey })
          .from(planProgress)
          .where(and(eq(planProgress.userId, userId), eq(planProgress.assessmentId, id)))
      : Promise.resolve([]),
    sp.unlocked === "1"
      ? db
          .select()
          .from(orders)
          .where(and(eq(orders.userId, userId), eq(orders.status, "paid")))
          .orderBy(desc(orders.createdAt))
          .limit(1)
      : Promise.resolve([]),
  ]);

  const o = lastOrder[0];
  const doneSteps = done.map((d) => d.stepKey);

  // The paid analysis: written once, after payment, then served from the database.
  const job = await getJob(id);
  let body: ReactNode;
  if (job?.status === "done" && job.output) {
    body = <AiReportView assessment={a} report={job.output} via={via} doneSteps={doneSteps} isOwner={owns} />;
  } else {
    const view = jobView(job);
    const exhausted = view.status === "failed" && !view.canRetry && view.attempts >= MAX_ATTEMPTS;
    const capped = !job && owns && via === "membership" && (await recentAnalyses(userId)) >= MEMBER_ANALYSES_PER_30_DAYS;
    if (exhausted || capped || (!owns && view.status !== "running")) {
      // The rule-based report stands in: every finding, fix and plan, without the written analysis.
      body = (
        <>
          <div className="mx-auto mb-4 max-w-4xl slab-inset p-4 sm:p-5 text-sm leading-relaxed text-ink-2">
            {capped
              ? `Your membership includes ${MEMBER_ANALYSES_PER_30_DAYS} written analyses every 30 days, and you have used them. Your full diagnosis is below, and your next written analysis unlocks as the oldest one ages out.`
              : exhausted
                ? "Your written analysis did not finish, and we have been alerted. Your full diagnosis is below in the meantime; we will complete the written analysis and it will appear here."
                : "No written analysis has been generated for this report yet."}
          </div>
          <Report assessment={a} via={via} doneSteps={doneSteps} isOwner={owns} />
        </>
      );
    } else {
      const facts = buildScorecard(a.answers, a.track === "strength" ? "strength" : "physique")
        .flatMap((d) => d.items.map((i) => i.fact))
        .slice(0, 16);
      body = <AnalysisWaiting assessmentId={id} initial={view} facts={facts} />;
    }
  }

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      {sp.unlocked === "1" && (
        <UnlockPing
          assessmentId={id}
          amount={o?.amountTotal ?? null}
          currency={o?.currency ?? null}
          item={o ? (o.kind === "membership" ? "membership" : "report") : null}
          orderId={o?.id ?? null}
        />
      )}
      {body}
    </div>
  );
}
