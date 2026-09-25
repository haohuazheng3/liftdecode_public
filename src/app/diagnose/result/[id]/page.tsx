import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { FINDINGS } from "@/content/findings";
import { getAssessment, resolveOwnership } from "@/lib/assessments";
import { canViewReport } from "@/lib/entitlements";
import { Paywall } from "@/components/paywall/Paywall";
import { CATEGORY_LABEL } from "@/lib/report/labels";

export const metadata: Metadata = { title: "Your diagnosis is ready", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function minutes(s: number | null | undefined) {
  if (!s) return null;
  return Math.max(1, Math.round(s / 60));
}

/** Questions whose "because" line is the most convincing proof that we read the answers. */
const CALIBRATION_HINTS = ["4wk", "yesterday", "missed", "sleep", "bodyweight", "logbook", "last week", "weeks ago"];

export default async function ResultPage(props: PageProps<"/diagnose/result/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const a = await getAssessment(id);
  if (!a) notFound();

  const { userId } = await auth();
  const { owns } = await resolveOwnership(a, userId);
  if (!owns) notFound();

  if (userId) {
    const access = await canViewReport(userId, id);
    if (access.allowed) redirect(`/report/${id}`);
  }

  const r = a.result;
  const ranked = r.findings.filter((f) => FINDINGS[f.id]);
  const primaryResult = ranked[0];
  const primary = primaryResult ? FINDINGS[primaryResult.id] : null;
  const visibleSecondary = ranked.slice(1, 3);
  const hiddenCount = Math.max(0, ranked.length - 3);
  const mins = minutes(a.durationSeconds);
  const canceled = sp.canceled === "1";
  const returnTo = `/diagnose/result/${id}`;
  const trackLabel = a.track === "strength" ? "Strength track" : "Physique track";

  // One "what you told us" line for the teaser — prefer the one that quotes a hard number/date.
  const teaserBecause =
    primaryResult?.triggers.find((t) => CALIBRATION_HINTS.some((h) => t.because.toLowerCase().includes(h)))?.because ??
    primaryResult?.triggers[0]?.because ??
    null;
  const moreBecause = primaryResult ? Math.max(0, primaryResult.triggers.length - 1) : 0;

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* headline */}
        <div className="slab p-6 sm:p-10 animate-rise">
          <div className="eyebrow mb-3">Diagnosis ready · {trackLabel}</div>
          <h1 className="display text-4xl sm:text-6xl">
            {ranked.length > 0 ? (
              <>
                We found{" "}
                <em>
                  {ranked.length} {ranked.length === 1 ? "thing" : "things"}
                </em>{" "}
                holding you back.
              </>
            ) : (
              <>
                Nothing is clearly <em>broken</em>.
              </>
            )}
          </h1>
          <p className="mt-4 text-ink-2 text-lg max-w-2xl leading-relaxed">
            You answered {r.answeredCount} questions{mins ? ` in about ${mins} minute${mins === 1 ? "" : "s"}` : ""}. We
            cross-referenced them into {ranked.length} bottleneck{ranked.length === 1 ? "" : "s"} and{" "}
            {r.clearances.length} thing{r.clearances.length === 1 ? "" : "s"} you can stop worrying about.
            {ranked.length > 0 && " The one below matters most."}
          </p>
          {canceled && (
            <p className="mt-4 text-sm text-ink-3">
              Checkout was cancelled — your answers are safe here whenever you&rsquo;re ready.
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="space-y-4">
            {/* primary finding (visible teaser) */}
            {primary && primaryResult && (
              <div className="slab p-6 sm:p-8 animate-rise" style={{ animationDelay: "60ms" }}>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="tag tag-alert">Primary bottleneck</span>
                  <span className="tag">{CATEGORY_LABEL[primary.category]}</span>
                  <span className="tag">
                    From {primaryResult.triggers.length} of your answer{primaryResult.triggers.length === 1 ? "" : "s"}
                  </span>
                </div>
                <h2 className="display text-3xl sm:text-4xl">{primary.title}</h2>
                <p className="mt-4 text-ink-2 leading-relaxed">{primary.summary}</p>

                {teaserBecause && (
                  <div className="mt-6 slab-inset p-4">
                    <div className="eyebrow mb-2">What you told us</div>
                    <ul className="space-y-2">
                      <li className="text-sm text-ink-2 flex gap-2">
                        <span className="text-signal" aria-hidden="true">
                          ›
                        </span>
                        {teaserBecause}
                      </li>
                      {moreBecause > 0 && (
                        <li className="text-sm text-ink-3 flex gap-2">
                          <span aria-hidden="true">›</span>+ {moreBecause} more answer{moreBecause === 1 ? "" : "s"} that point
                          the same way, in the full report
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="locked-veil mt-6">
                  <div className="locked-content">
                    <h3 className="text-xl font-semibold mb-3">Why this stalls you</h3>
                    <div className="prose-ld">
                      {primary.mechanism.slice(0, 2).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mt-6 mb-3">The fix</h3>
                    <div className="prose-ld">
                      <ol>
                        {primary.fix[0]?.steps.slice(0, 3).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* clearances — shown in full: proof the report read the answers */}
            {r.clearances.length > 0 && (
              <div className="slab p-6 sm:p-8 animate-rise" style={{ animationDelay: "120ms" }}>
                <div className="tag tag-clear mb-3">Not your problem</div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  {r.clearances.length === 1 ? "One thing" : `${r.clearances.length} things`} you can stop fixing.
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {r.clearances.map((c) => (
                    <li key={c.id} className="slab-inset p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="grid place-items-center w-5 h-5 rounded-full bg-clear/15 text-clear text-[11px]">
                          ✓
                        </span>
                        <span className="font-semibold text-ink">{c.title}</span>
                      </div>
                      <p className="text-sm text-ink-2 leading-relaxed">{c.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* the rest of the report */}
            {(visibleSecondary.length > 0 || hiddenCount > 0 || ranked.length > 0) && (
              <div className="slab p-6 sm:p-8 animate-rise" style={{ animationDelay: "180ms" }}>
                <div className="eyebrow mb-4">Also in your full report</div>
                <ul className="space-y-3">
                  {visibleSecondary.map((f, i) => {
                    const c = FINDINGS[f.id];
                    return (
                      <li key={f.id} className="flex items-center gap-3">
                        <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-white/[0.05] text-xs font-mono text-ink-3">
                          {i + 2}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] text-ink-3 font-mono uppercase tracking-[0.12em]">
                            {CATEGORY_LABEL[c.category]} · from {f.triggers.length} answer{f.triggers.length === 1 ? "" : "s"}
                          </div>
                          <div className="text-ink font-medium">{c.title}</div>
                        </div>
                        <span className="tag">Locked</span>
                      </li>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <li className="flex items-center gap-3">
                      <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-white/[0.05] text-xs font-mono text-ink-3">
                        +{hiddenCount}
                      </span>
                      <div className="min-w-0 flex-1 text-ink-2">
                        {hiddenCount} more bottleneck{hiddenCount === 1 ? "" : "s"}, ranked by impact
                      </div>
                      <span className="tag">Locked</span>
                    </li>
                  )}
                  <li className="flex items-center gap-3">
                    <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-signal/15 text-xs text-signal">
                      4
                    </span>
                    <div className="flex-1 text-ink-2">
                      Your 4-week plan, week by week, built from your top {Math.min(3, ranked.length)} bottleneck
                      {Math.min(3, ranked.length) === 1 ? "" : "s"} — with check-offs
                    </div>
                    <span className="tag">Locked</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-white/[0.05] text-xs font-mono text-ink-3">
                      ≡
                    </span>
                    <div className="flex-1 text-ink-2">
                      For every bottleneck: why it stalls you, how it shows up, the exact fix, what to expect, and the
                      wrong fixes to avoid
                    </div>
                    <span className="tag">Locked</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* paywall — never shown when we found nothing to sell */}
          <div className="lg:sticky lg:top-24 animate-rise" style={{ animationDelay: "240ms" }}>
            {ranked.length === 0 ? (
              <div className="slab p-5 sm:p-6">
                <div className="tag tag-clear mb-3">Nothing to sell you</div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  We didn&rsquo;t find a bottleneck, so there is nothing to charge for.
                </h2>
                <p className="mt-3 text-ink-2 leading-relaxed">
                  Your answers describe a programme that is already doing the things that drive progress. That usually
                  means one of three things: the stall is younger than it feels, the measurement is too coarse to see
                  the change, or something outside training is the limiter.
                </p>
                <p className="mt-3 text-ink-2 leading-relaxed">
                  Log four weeks of honest numbers, then run this again. With real before-and-after data the diagnosis
                  gets much sharper — and if we find something then, that report is worth paying for.
                </p>
                <Link href="/diagnose" className="btn btn-primary w-full mt-5">
                  Run it again in four weeks
                </Link>
              </div>
            ) : (
              <div className="slab p-5 sm:p-6">
                <div className="eyebrow mb-2">Unlock your report</div>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                  Read the full diagnosis and exactly what to change.
                </h2>
                <Paywall assessmentId={id} signedIn={Boolean(userId)} returnTo={returnTo} />
              </div>
            )}
            <p className="mt-3 text-center text-xs text-ink-3">
              Want to redo it?{" "}
              <Link href="/diagnose" className="underline underline-offset-2 hover:text-ink-2">
                Start a new diagnosis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
