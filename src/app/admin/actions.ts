"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { contactMessages, errorEvents } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";

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
