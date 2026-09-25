import { eq } from "drizzle-orm";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

/**
 * Make sure a row exists for the signed-in Clerk user. Cheap upsert; the
 * Clerk webhook also syncs, but this guarantees correctness when the webhook
 * is late or not configured.
 */
export async function ensureUser(userId: string, emailHint?: string | null) {
  let email = emailHint ?? null;
  if (!email) {
    const cu = await currentUser().catch(() => null);
    email = cu?.primaryEmailAddress?.emailAddress ?? null;
    if (!email && cu?.emailAddresses?.[0]) email = cu.emailAddresses[0].emailAddress;
  }
  if (!email) {
    const c = await clerkClient();
    const u = await c.users.getUser(userId).catch(() => null);
    email = u?.primaryEmailAddress?.emailAddress ?? u?.emailAddresses?.[0]?.emailAddress ?? null;
  }
  if (!email) email = `${userId}@unknown.local`;

  const rows = await db
    .insert(users)
    .values({ id: userId, email: email.toLowerCase(), lastSeenAt: new Date() })
    .onConflictDoUpdate({
      target: users.id,
      set: { email: email.toLowerCase(), lastSeenAt: new Date(), updatedAt: new Date() },
    })
    .returning();
  return rows[0];
}

export async function getUser(userId: string) {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return rows[0] ?? null;
}
