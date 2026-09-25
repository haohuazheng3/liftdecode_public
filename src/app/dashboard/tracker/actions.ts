"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { trackerEntries } from "@/lib/db/schema";
import { activeMembership } from "@/lib/entitlements";
import { captureFromUnknown } from "@/lib/errors";
import { METRICS, deleteEntry, metricInfo, unitsFor } from "@/lib/tracker";
import { ensureUser } from "@/lib/users";

const Entry = z.object({
  metric: z.enum(METRICS.map((m) => m.key) as [string, ...string[]]),
  loggedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.number().positive().max(2000),
  unit: z.string().min(1).max(4),
  note: z.string().max(200).optional(),
});

export async function addTrackerEntry(input: unknown): Promise<{ ok: boolean; id?: number; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Please sign in." };
    if (!(await activeMembership(userId))) return { ok: false, error: "The tracker is a membership feature." };
    const parsed = Entry.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Check the values and try again." };
    const { metric, loggedOn, value, unit, note } = parsed.data;
    const info = metricInfo(metric);
    if (!info || !unitsFor(info.kind).includes(unit)) return { ok: false, error: "Unit does not match the metric." };
    await ensureUser(userId);
    const rows = await db
      .insert(trackerEntries)
      .values({ userId, metric, loggedOn, value: value.toFixed(2), unit, note: note?.trim() || null })
      .onConflictDoUpdate({
        target: [trackerEntries.userId, trackerEntries.metric, trackerEntries.loggedOn],
        set: { value: value.toFixed(2), unit, note: note?.trim() || null },
      })
      .returning({ id: trackerEntries.id });
    return { ok: true, id: rows[0]?.id };
  } catch (e) {
    await captureFromUnknown(e, "action:addTrackerEntry");
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function removeTrackerEntry(id: number): Promise<{ ok: boolean }> {
  try {
    const { userId } = await auth();
    if (!userId || !Number.isInteger(id)) return { ok: false };
    await deleteEntry(userId, id);
    return { ok: true };
  } catch (e) {
    await captureFromUnknown(e, "action:removeTrackerEntry");
    return { ok: false };
  }
}
