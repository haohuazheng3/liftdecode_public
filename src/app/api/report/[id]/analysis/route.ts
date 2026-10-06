import { NextResponse, after } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getAssessment, resolveOwnership } from "@/lib/assessments";
import { canViewReport } from "@/lib/entitlements";
import { isAdminEmail } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";
import { rateLimit } from "@/lib/ratelimit";
import { claimJob, getJob, isStale, jobView, MAX_ATTEMPTS, MEMBER_ANALYSES_PER_30_DAYS, recentAnalyses, type AiJob } from "@/lib/ai/jobs";
import { runAnalysis } from "@/lib/ai/generate";

/**
 * The paid analysis job for one report.
 *   GET  → where the job stands (the waiting screen polls this)
 *   POST → start it if it has not started (or re-arm a failed / dead one, up to MAX_ATTEMPTS)
 * Only the paying owner can start it; the generation itself runs after the response, inside this
 * function's time budget.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 800;

type Access = { ok: true; userId: string; owner: boolean; via: "membership" | "report" | "admin" } | { ok: false; status: number };

async function access(id: string): Promise<Access> {
  const { userId } = await auth();
  if (!userId) return { ok: false, status: 401 };
  const a = await getAssessment(id);
  if (!a) return { ok: false, status: 404 };
  const { owns } = await resolveOwnership(a, userId);
  if (owns) {
    const r = await canViewReport(userId, id);
    if (r.allowed && r.via) return { ok: true, userId, owner: true, via: r.via };
    return { ok: false, status: 402 };
  }
  const cu = await currentUser();
  if (isAdminEmail(cu?.primaryEmailAddress?.emailAddress)) return { ok: true, userId, owner: false, via: "admin" };
  return { ok: false, status: 404 };
}

function view(job: AiJob | null, extra?: Record<string, unknown>) {
  return { ...jobView(job), ...extra };
}

export async function GET(_req: Request, ctx: RouteContext<"/api/report/[id]/analysis">) {
  try {
    const { id } = await ctx.params;
    const acc = await access(id);
    if (!acc.ok) return NextResponse.json({ error: "not allowed" }, { status: acc.status });
    return NextResponse.json(view(await getJob(id)), { headers: { "cache-control": "no-store" } });
  } catch (e) {
    await captureFromUnknown(e, "/api/report/[id]/analysis GET");
    return NextResponse.json({ error: "Could not read the analysis status." }, { status: 500 });
  }
}

export async function POST(_req: Request, ctx: RouteContext<"/api/report/[id]/analysis">) {
  try {
    const { id } = await ctx.params;
    const acc = await access(id);
    if (!acc.ok) return NextResponse.json({ error: "not allowed" }, { status: acc.status });
    // Only the paying owner starts a paid model run; an admin can watch one.
    if (!acc.owner) return NextResponse.json(view(await getJob(id)));

    const existing = await getJob(id);
    if (existing && (existing.status === "done" || (existing.status === "running" && !isStale(existing)))) {
      return NextResponse.json(view(existing));
    }
    if (existing && existing.attempts >= MAX_ATTEMPTS) return NextResponse.json(view(existing));

    const rl = await rateLimit(`ai:${acc.userId}`, 6, 3600);
    if (!rl.ok) return NextResponse.json(view(existing, { error: "Too many attempts. Try again in a little while." }), { status: 429 });

    // A member's analyses are capped per 30 days; a report bought on its own always gets one.
    if (acc.via === "membership" && !existing && (await recentAnalyses(acc.userId)) >= MEMBER_ANALYSES_PER_30_DAYS) {
      return NextResponse.json(view(existing, { status: "capped" }));
    }

    const claimed = await claimJob(id, acc.userId);
    if (claimed) after(() => runAnalysis(id));
    return NextResponse.json(view(await getJob(id)));
  } catch (e) {
    await captureFromUnknown(e, "/api/report/[id]/analysis POST");
    return NextResponse.json({ error: "Could not start the analysis." }, { status: 500 });
  }
}
