"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { after } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { aiReports, contactMessages, errorEvents } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";
import { claimJob } from "@/lib/ai/jobs";
import { runAnalysis } from "@/lib/ai/generate";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type ContactStatus = "new" | "replied" | "spam";

const rowId = z.number().int().positive().max(2_147_483_647);
const contactStatus = z.enum(["new", "replied", "spam"]);

async function isAdmin(): Promise<boolean> {
  const cu = await currentUser();
  return isAdminEmail(cu?.primaryEmailAddress?.emailAddress);
}

/** Resolve (set resolvedAt) or reopen (clear it) one grouped error row. */
export async function setErrorResolved(id: number, resolved: boolean): Promise<ActionResult> {
  try {
    if (!(await isAdmin())) return { ok: false, error: "Not allowed" };
    const input = z.object({ id: rowId, resolved: z.boolean() }).safeParse({ id, resolved });
    if (!input.success) return { ok: false, error: "Bad input" };
    const updated = await db
      .update(errorEvents)
      .set({ resolvedAt: input.data.resolved ? new Date() : null })
      .where(eq(errorEvents.id, input.data.id))
      .returning({ id: errorEvents.id });
    if (updated.length === 0) return { ok: false, error: "Error row no longer exists" };
    return { ok: true };
  } catch (e) {
    await captureFromUnknown(e, "action:admin.setErrorResolved");
    return { ok: false, error: "Could not save — try again" };
  }
}

/** Move a contact message between new / replied / spam. */
export async function setContactStatus(id: number, status: ContactStatus): Promise<ActionResult> {
  try {
    if (!(await isAdmin())) return { ok: false, error: "Not allowed" };
    const input = z.object({ id: rowId, status: contactStatus }).safeParse({ id, status });
    if (!input.success) return { ok: false, error: "Bad input" };
    const updated = await db
      .update(contactMessages)
      .set({ status: input.data.status })
      .where(eq(contactMessages.id, input.data.id))
      .returning({ id: contactMessages.id });
    if (updated.length === 0) return { ok: false, error: "Message no longer exists" };
    return { ok: true };
  } catch (e) {
    await captureFromUnknown(e, "action:admin.setContactStatus");
    return { ok: false, error: "Could not save — try again" };
  }
}

/**
 * Re-run a paid analysis that failed (or never ran): the owner keeps the promise the fallback
 * page makes ("we will complete the written analysis"). Resets the attempt counter, claims the
 * job and writes it after the response, inside the admin page's time budget.
 */
export async function rerunAnalysis(assessmentId: string): Promise<ActionResult> {
  try {
    if (!(await isAdmin())) return { ok: false, error: "Not allowed" };
    const input = z.string().min(8).max(40).safeParse(assessmentId);
    if (!input.success) return { ok: false, error: "Bad input" };
    const rows = await db.select().from(aiReports).where(eq(aiReports.assessmentId, input.data)).limit(1);
    const job = rows[0];
    if (job?.status === "done") return { ok: false, error: "Already done" };
    if (job) await db.update(aiReports).set({ attempts: 0, status: "failed", updatedAt: new Date() }).where(eq(aiReports.assessmentId, input.data));
    const claimed = await claimJob(input.data, job?.userId ?? null);
    if (!claimed) return { ok: false, error: "Could not claim the job (already running?)" };
    after(() => runAnalysis(input.data));
    return { ok: true };
  } catch (e) {
    await captureFromUnknown(e, "action:admin.rerunAnalysis");
    return { ok: false, error: "Could not start — try again" };
  }
}
