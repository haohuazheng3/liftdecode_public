import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/env";

/**
 * Owner-only gate for the admin pages.
 *
 * The layout calls this too, but `notFound()` raised from a layout renders an
 * empty shell with a 200 status instead of a real 404 — no data leaks, but the
 * route still announces itself. Called from a page, `notFound()` produces the
 * proper 404, so every admin page calls this first and the layout keeps its own
 * call as a second line of defence.
 */
export async function requireAdmin(): Promise<void> {
  const cu = await currentUser();
  if (!isAdminEmail(cu?.primaryEmailAddress?.emailAddress)) notFound();
}
