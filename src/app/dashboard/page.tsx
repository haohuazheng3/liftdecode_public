import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { entitlements, orders, planProgress } from "@/lib/db/schema";
import { FINDINGS } from "@/content/findings";
import { listAssessments } from "@/lib/assessments";
import { activeMembership } from "@/lib/entitlements";
import { ensureUser } from "@/lib/users";
import { loadSeries } from "@/lib/tracker";
import { TRACK_LABEL } from "@/lib/report/labels";
import { UnlockPing } from "@/components/report/ReportTools";
import { MembershipUpsell } from "@/components/dashboard/MembershipUpsell";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function fmt(d: Date | string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d));
}

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const sp = await props.searchParams;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard");
  const user = await ensureUser(userId);

  const [member, list, reportEnts] = await Promise.all([
    activeMembership(userId),
    listAssessments(userId),
    db
      .select({ assessmentId: entitlements.assessmentId })
      .from(entitlements)
      .where(and(eq(entitlements.userId, userId), eq(entitlements.kind, "report"), eq(entitlements.status, "active"))),
  ]);
  const unlockedIds = new Set(reportEnts.map((e) => e.assessmentId).filter((x): x is string => Boolean(x)));
  const isUnlocked = (id: string) => Boolean(member) || unlockedIds.has(id);
  const unlockedList = list.filter((a) => isUnlocked(a.id));

  const progress = unlockedList.length
    ? await db
        .select({ assessmentId: planProgress.assessmentId, n: sql<number>`count(*)::int` })
        .from(planProgress)
        .where(and(eq(planProgress.userId, userId), inArray(planProgress.assessmentId, unlockedList.map((a) => a.id))))
        .groupBy(planProgress.assessmentId)
    : [];
  const progressBy = new Map(progress.map((p) => [p.assessmentId, p.n]));

  const series = member ? await loadSeries(userId) : [];
  const stalled = series.filter((s) => s.stalled);

  const welcome = sp.welcome === "member";
  const lastOrder = welcome
    ? (await db.select().from(orders).where(and(eq(orders.userId, userId), eq(orders.status, "paid"))).orderBy(desc(orders.createdAt)).limit(1))[0]
    : undefined;

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      {welcome && (
        <UnlockPing
          assessmentId=""
          amount={lastOrder?.amountTotal ?? null}
          currency={lastOrder?.currency ?? null}
          item={lastOrder ? "membership" : null}
          orderId={lastOrder?.id ?? null}
        />
      )}
      <div className="mx-auto max-w-5xl space-y-4">
        {/* header */}
        <div className="slab p-6 sm:p-8 animate-rise">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="eyebrow mb-2">{user.email}</div>
              <h1 className="display text-3xl sm:text-5xl">
                {welcome ? (
                  <>
                    You&rsquo;re <em>in</em>.
                  </>
                ) : list.length === 0 ? (
                  <>
                    Nothing diagnosed <em>yet</em>.
                  </>
                ) : (
                  <>
                    Your <em>reports</em>.
                  </>
                )}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {member ? (
                  <span className="tag tag-signal">
                    Member
                    {member.currentPeriodEnd
                      ? ` · ${member.cancelAtPeriodEnd || member.status === "canceled" ? "ends" : "renews"} ${fmt(member.currentPeriodEnd)}`
                      : ""}
                  </span>
                ) : (
                  <span className="tag">No membership</span>
                )}
                {member?.status === "past_due" && <span className="tag tag-alert">Payment issue — update your card</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/account" className="btn btn-ghost">
                Account
              </Link>
              <Link href="/diagnose" className="btn btn-primary">
                {list.length ? "Re-diagnose" : "Start diagnosis"}
              </Link>
            </div>
          </div>
        </div>

        {/* member quick links */}
        {member && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/dashboard/tracker" className="slab slab-hover p-5 block">
              <div className="eyebrow mb-1">Tracker</div>
              <div className="font-semibold">
                {series.length ? `${series.length} metric${series.length === 1 ? "" : "s"} logged` : "Log your first numbers"}
              </div>
              {stalled.length > 0 && (
                <div className="mt-2 tag tag-alert">
                  {stalled.length} stalled
                </div>
              )}
            </Link>
            <Link href="/dashboard/compare" className="slab slab-hover p-5 block">
              <div className="eyebrow mb-1">Compare</div>
              <div className="font-semibold">
                {unlockedList.length >= 2 ? "See what changed between reports" : "Needs two reports"}
              </div>
            </Link>
            <Link href="/library" className="slab slab-hover p-5 block">
              <div className="eyebrow mb-1">Fix library</div>
              <div className="font-semibold">Every protocol, browsable</div>
            </Link>
          </div>
        )}

        {/* reports */}
        {list.length > 0 && (
          <div className="slab p-5 sm:p-6">
            <div className="eyebrow mb-4">Diagnoses</div>
            <ul className="divide-y divide-line">
              {list.map((a) => {
                const unlocked = isUnlocked(a.id);
                const primary = a.result.primary ? FINDINGS[a.result.primary] : null;
                const done = progressBy.get(a.id) ?? 0;
                const totalSteps = Math.min(3, a.result.findings.length) * 4;
                return (
                  <li key={a.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-ink-3">{fmt(a.createdAt)}</span>
                          <span className="tag">{TRACK_LABEL[a.track === "strength" ? "strength" : "physique"]}</span>
                          {unlocked ? <span className="tag tag-clear">Unlocked</span> : <span className="tag">Locked</span>}
                        </div>
                        <div className="font-semibold text-ink truncate">
                          {primary ? primary.title : "No clear bottleneck"}
                        </div>
                        <div className="text-sm text-ink-3">
                          {a.result.findings.length} finding{a.result.findings.length === 1 ? "" : "s"} ·{" "}
                          {a.result.clearances.length} cleared
                          {unlocked && totalSteps > 0 && ` · plan ${done}/${totalSteps}`}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {unlocked ? (
                          <Link href={`/report/${a.id}`} className="btn btn-ghost btn-sm">
                            Open report
                          </Link>
                        ) : (
                          <Link href={`/diagnose/result/${a.id}`} className="btn btn-primary btn-sm">
                            Unlock
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {list.length === 0 && (
          <div className="slab p-6 sm:p-8">
            <div className="eyebrow mb-2">Start here</div>
            <p className="text-ink-2 leading-relaxed max-w-xl">
              Answer 24–28 honest questions about how you train, eat, recover and measure. Takes about ten minutes; your
              answers are saved as you go.
            </p>
            <Link href="/diagnose" className="btn btn-primary mt-5">
              Start the diagnosis
            </Link>
          </div>
        )}

        {!member && (
          <MembershipUpsell
            title="Turn one report into a loop."
            text="Members re-run the diagnosis whenever they like, log their lifts and measurements, compare reports month to month, and read every fix protocol in the library."
          />
        )}
      </div>
    </div>
  );
}
