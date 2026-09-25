import { NextResponse } from "next/server";
import { captureFromUnknown } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deliberate server-side failure, for proving the error inbox and the health
 * alarm actually work end to end. Protected by CRON_SECRET so a stranger
 * cannot fill the inbox with noise.
 *
 * GET /api/test/error  with  Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const presented = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!secret || presented !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    throw new Error("Deliberate test failure from /api/test/error");
  } catch (e) {
    await captureFromUnknown(e, "/api/test/error", "server", { deliberate: true });
    return NextResponse.json(
      { captured: true, note: "An error was written to the inbox. /api/health should now report it." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
