import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { assessments } from "@/lib/db/schema";
import { getAnonTokens } from "@/lib/cookies";

export type Assessment = typeof assessments.$inferSelect;

export async function getAssessment(id: string): Promise<Assessment | null> {
  if (!id || id.length > 40) return null;
  const rows = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Does the current visitor own this assessment? Signed-in owner, or an
 * anonymous visitor whose cookie carries the assessment's token. If the
 * visitor is signed in and the assessment is unclaimed but theirs by cookie,
 * claim it now so the ownership survives the sign-in round trip.
 */
export async function resolveOwnership(a: Assessment, userId: string | null): Promise<{ owns: boolean; claimed: boolean }> {
  if (a.userId) return { owns: a.userId === userId, claimed: false };
  const tokens = await getAnonTokens();
  if (!tokens.includes(a.anonToken)) return { owns: false, claimed: false };
  if (userId) {
    await db
      .update(assessments)
      .set({ userId, claimedAt: new Date() })
      .where(and(eq(assessments.id, a.id), isNull(assessments.userId)));
    return { owns: true, claimed: true };
  }
  return { owns: true, claimed: false };
}

export async function listAssessments(userId: string, limit = 50) {
  return db
    .select({
      id: assessments.id,
      track: assessments.track,
      createdAt: assessments.createdAt,
      unlockedAt: assessments.unlockedAt,
      result: assessments.result,
      durationSeconds: assessments.durationSeconds,
    })
    .from(assessments)
    .where(eq(assessments.userId, userId))
    .orderBy(desc(assessments.createdAt))
    .limit(limit);
}
