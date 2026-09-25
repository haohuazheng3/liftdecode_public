import { cookies } from "next/headers";

/** Cookie that lets an anonymous visitor own the assessments they created. */
export const ANON_COOKIE = "ld_anon";
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export async function getAnonTokens(): Promise<string[]> {
  const jar = await cookies();
  const raw = jar.get(ANON_COOKIE)?.value ?? "";
  return raw.split(".").filter((t) => t.length >= 20).slice(-10);
}

/** Cookie value that includes `token` (keeps the last 10). */
export function appendAnonToken(existing: string | undefined, token: string): string {
  const list = (existing ?? "").split(".").filter((t) => t.length >= 20);
  if (!list.includes(token)) list.push(token);
  return list.slice(-10).join(".");
}

export const ANON_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
