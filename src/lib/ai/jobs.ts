import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiReports } from "@/lib/db/schema";
import { PROMPT_VERSION } from "./schema";

/**
 * The analysis job, one row per assessment. Whoever wins the insert (or re-arms a failed or dead
 * job) runs it; everyone else just reads its progress. The HTTP driver has no transactions, so the
 * claim is a single INSERT … ON CONFLICT DO UPDATE … WHERE … RETURNING.
 */
export type AiJob = typeof aiReports.$inferSelect;

export const MAX_ATTEMPTS = 3;
/** a running job that has not written progress for this long has died with its function */
const STALE_SECONDS = 180;
/** members get this many analyses per rolling 30 days; single-report buyers always get theirs */
export const MEMBER_ANALYSES_PER_30_DAYS = 8;

export async function getJob(assessmentId: string): Promise<AiJob | null> {
  const rows = await db.select().from(aiReports).where(eq(aiReports.assessmentId, assessmentId)).limit(1);
  return rows[0] ?? null;
}

export function isStale(job: AiJob, now = Date.now()): boolean {
  return job.status === "running" && now - new Date(job.updatedAt).getTime() > STALE_SECONDS * 1000;
}

/** true when this caller now owns the job and must run it */
export async function claimJob(assessmentId: string, userId: string | null): Promise<boolean> {
  const now = new Date();
  const rows = await db
    .insert(aiReports)
    .values({ assessmentId, userId, status: "running", attempts: 1, promptVersion: PROMPT_VERSION, startedAt: now, updatedAt: now })
    .onConflictDoUpdate({
      target: aiReports.assessmentId,
      set: {
        status: "running",
        attempts: sql`${aiReports.attempts} + 1`,
        stage: 0,
        progress: 0,
        error: null,
        promptVersion: PROMPT_VERSION,
        startedAt: now,
        updatedAt: now,
      },
      setWhere: sql`${aiReports.attempts} < ${MAX_ATTEMPTS} and (${aiReports.status} = 'failed' or (${aiReports.status} = 'running' and ${aiReports.updatedAt} < now() - ${sql.raw(`interval '${STALE_SECONDS} seconds'`)}))`,
    })
    .returning({ attempts: aiReports.attempts });
  return rows.length > 0;
}

export async function setProgress(assessmentId: string, stage: number, progress: number): Promise<void> {
  await db
    .update(aiReports)
    .set({ stage, progress, updatedAt: new Date() })
    .where(and(eq(aiReports.assessmentId, assessmentId), eq(aiReports.status, "running")));
}

export async function finishJob(
  assessmentId: string,
  done: Pick<AiJob, "output" | "model" | "inputTokens" | "outputTokens" | "costMicros" | "stage">,
): Promise<void> {
  const now = new Date();
  await db
    .update(aiReports)
    .set({ ...done, status: "done", progress: 100, error: null, finishedAt: now, updatedAt: now })
    .where(eq(aiReports.assessmentId, assessmentId));
}

export async function failJob(assessmentId: string, error: string, usage?: Pick<AiJob, "model" | "inputTokens" | "outputTokens" | "costMicros">): Promise<void> {
  const now = new Date();
  await db
    .update(aiReports)
    .set({ ...(usage ?? {}), status: "failed", error: error.slice(0, 1000), finishedAt: now, updatedAt: now })
    .where(eq(aiReports.assessmentId, assessmentId));
}

/** analyses a member has started in the last 30 days (finished or running) */
export async function recentAnalyses(userId: string): Promise<number> {
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(aiReports)
    .where(and(eq(aiReports.userId, userId), gte(aiReports.createdAt, since), inArray(aiReports.status, ["done", "running"])));
  return rows[0]?.n ?? 0;
}

/** what the waiting screen needs to know about a job (shared by the page and the API route) */
export function jobView(job: AiJob | null) {
  if (!job) return { status: "none" as const, stage: 0, progress: 0, attempts: 0, canRetry: false };
  const stale = isStale(job);
  const status = (stale ? "failed" : job.status) as "running" | "done" | "failed";
  return {
    status,
    stage: job.stage,
    progress: job.progress,
    attempts: job.attempts,
    canRetry: (job.status === "failed" || stale) && job.attempts < MAX_ATTEMPTS,
  };
}
