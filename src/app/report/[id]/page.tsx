import type { Metadata } from "next";
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
      <Report assessment={a} via={via} doneSteps={done.map((d) => d.stepKey)} isOwner={owns} />
    </div>
  );
}
