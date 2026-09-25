"use server";

import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assessments, planProgress } from "@/lib/db/schema";
import { canViewReport } from "@/lib/entitlements";
import { captureFromUnknown } from "@/lib/errors";

export async function togglePlanStep(assessmentId: string, stepKey: string, done: boolean): Promise<{ ok: boolean }> {
  try {
    const { userId } = await auth();
    if (!userId) return { ok: false };
    if (!/^[a-z0-9_]+:[a-z0-9_:]+$/i.test(stepKey) || stepKey.length > 80) return { ok: false };
    const rows = await db
      .select({ userId: assessments.userId })
      .from(assessments)
      .where(eq(assessments.id, assessmentId))
      .limit(1);
    if (!rows[0] || rows[0].userId !== userId) return { ok: false };
    const access = await canViewReport(userId, assessmentId);
    if (!access.allowed) return { ok: false };

    if (done) {
      await db.insert(planProgress).values({ userId, assessmentId, stepKey }).onConflictDoNothing();
    } else {
      await db
        .delete(planProgress)
        .where(and(eq(planProgress.userId, userId), eq(planProgress.assessmentId, assessmentId), eq(planProgress.stepKey, stepKey)));
    }
    return { ok: true };
  } catch (e) {
    await captureFromUnknown(e, "action:togglePlanStep");
    return { ok: false };
  }
}
