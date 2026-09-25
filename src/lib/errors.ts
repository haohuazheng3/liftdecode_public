import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { errorEvents } from "@/lib/db/schema";

export type ErrorSide = "server" | "client" | "edge";

export interface CaptureInput {
  name: string;
  message: string;
  stack?: string | null;
  route?: string | null;
  side: ErrorSide;
  severity?: "error" | "warning";
  meta?: Record<string, unknown>;
}

function firstFrame(stack: string | null | undefined): string {
  if (!stack) return "";
  const lines = stack.split("\n").map((l) => l.trim());
  const frame = lines.find((l) => l.startsWith("at ") || /\(.+:\d+:\d+\)/.test(l));
  return (frame ?? lines[1] ?? "").replace(/:\d+:\d+\)?$/, "").slice(0, 200);
}

export function fingerprintOf(input: Pick<CaptureInput, "name" | "stack" | "route" | "message">): string {
  const base = `${input.name}|${firstFrame(input.stack) || input.message.slice(0, 120)}|${input.route ?? ""}`;
  return createHash("sha1").update(base).digest("hex").slice(0, 24);
}

/**
 * Record an error into the self-hosted inbox, grouped by fingerprint.
 * Never throws — a failing error reporter must not take the request down —
 * but it does log to stderr so nothing is silently swallowed.
 */
export async function captureError(input: CaptureInput): Promise<void> {
  const fingerprint = fingerprintOf(input);
  try {
    await db
      .insert(errorEvents)
      .values({
        fingerprint,
        name: input.name.slice(0, 200),
        message: input.message.slice(0, 2000),
        stack: input.stack?.slice(0, 8000) ?? null,
        route: input.route?.slice(0, 300) ?? null,
        side: input.side,
        severity: input.severity ?? "error",
        meta: input.meta ?? null,
      })
      .onConflictDoUpdate({
        target: errorEvents.fingerprint,
        set: {
          count: sql`${errorEvents.count} + 1`,
          lastSeenAt: sql`now()`,
          message: input.message.slice(0, 2000),
          stack: input.stack?.slice(0, 8000) ?? null,
          resolvedAt: null,
          meta: input.meta ?? null,
        },
      });
  } catch (e) {
    console.error("[errors] failed to persist error", e, "original:", input.name, input.message);
  }
}

/** Convenience wrapper for route handlers: capture + rethrow-safe response. */
export async function captureFromUnknown(err: unknown, route: string, side: ErrorSide = "server", meta?: Record<string, unknown>) {
  const e = err instanceof Error ? err : new Error(typeof err === "string" ? err : JSON.stringify(err));
  console.error(`[${side}] ${route}:`, e);
  await captureError({ name: e.name, message: e.message, stack: e.stack, route, side, meta });
}
