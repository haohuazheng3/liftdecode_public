import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assessments } from "@/lib/db/schema";
import { ensureUser } from "@/lib/users";
import { newId, newToken } from "@/lib/ids";
import { ANON_COOKIE, ANON_COOKIE_OPTIONS, appendAnonToken } from "@/lib/cookies";
import { isTrack, runDiagnosis, sanitizeAnswers, ENGINE_VERSION } from "@/lib/engine";
import { captureFromUnknown } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  track: z.string(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  durationSeconds: z.number().int().min(0).max(60 * 60 * 6).optional(),
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req.headers);
    const rl = await rateLimit(`submit:${ip}`, 20, 600);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many submissions. Please wait a few minutes." }, { status: 429 });
    }

    const json = await req.json().catch(() => null);
    const parsed = Body.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    const { track, answers: raw, durationSeconds } = parsed.data;
    if (!isTrack(track)) return NextResponse.json({ error: "Unknown track" }, { status: 400 });

    const { answers, missing } = sanitizeAnswers(track, raw);
    // Allow at most 2 unanswered questions (defensive; the UI requires all).
    if (missing.length > 2) {
      return NextResponse.json({ error: "Please answer every question", missing }, { status: 400 });
    }

    const result = runDiagnosis(track, answers);
    const id = newId(16);
    const anonToken = newToken();

    const { userId } = await auth();
    if (userId) await ensureUser(userId);

    await db.insert(assessments).values({
      id,
      userId: userId ?? null,
      anonToken,
      track,
      answers,
      result,
      engineVersion: ENGINE_VERSION,
      durationSeconds: durationSeconds ?? null,
      claimedAt: userId ? new Date() : null,
    });

    const res = NextResponse.json({
      id,
      findings: result.findings.length,
      clearances: result.clearances.length,
      primary: result.primary,
    });
    const existing = req.headers.get("cookie")?.match(/(?:^|;\s*)ld_anon=([^;]+)/)?.[1];
    res.cookies.set(ANON_COOKIE, appendAnonToken(existing, anonToken), ANON_COOKIE_OPTIONS);
    return res;
  } catch (e) {
    await captureFromUnknown(e, "/api/diagnose/submit");
    return NextResponse.json({ error: "Something went wrong saving your answers. Please try again." }, { status: 500 });
  }
}
