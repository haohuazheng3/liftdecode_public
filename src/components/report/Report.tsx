import Link from "next/link";
import type { FindingContent } from "@/content/types";
import { FINDINGS } from "@/content/findings";
import type { Assessment } from "@/lib/assessments";
import type { FindingResult } from "@/lib/engine/types";
import { CATEGORY_LABEL, TRACK_LABEL } from "@/lib/report/labels";
import { PlanChecklist, type PlanWeek } from "./PlanChecklist";
import { PrintButton } from "./ReportTools";
import { FindingBody } from "./FindingBody";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

export function buildPlan(findings: FindingResult[]): PlanWeek[] {
  const top = findings.slice(0, 3).map((f) => FINDINGS[f.id]).filter((x): x is FindingContent => Boolean(x));
  return [1, 2, 3, 4].map((week) => ({
    week,
    items: top.map((f) => ({ key: `${f.id}:w${week}`, text: f.fourWeekPlan[week - 1], source: f.title })),
  }));
}

function ImpactBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
      <div className="h-full rounded-full bg-signal" style={{ width: `${Math.max(8, Math.round(value * 100))}%` }} />
    </div>
  );
}

function FindingSection({
  index,
  result,
  content,
  track,
  primary,
}: {
  index: number;
  result: FindingResult;
  content: FindingContent;
  track: "physique" | "strength";
  primary: boolean;
}) {
  return (
    <section id={content.id} className="slab p-6 sm:p-10 scroll-mt-24">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className={`tag ${primary ? "tag-alert" : ""}`}>{primary ? "Primary bottleneck" : `Bottleneck ${index}`}</span>
        <span className="tag">{CATEGORY_LABEL[content.category]}</span>
        <span className="tag">
          {result.triggers.length} answer{result.triggers.length === 1 ? "" : "s"} point here
        </span>
      </div>
      <h2 className="display text-3xl sm:text-5xl">{content.title}</h2>
      <p className="mt-4 text-lg sm:text-xl text-ink leading-relaxed">{content.verdict}</p>

      <div className="mt-8 slab-inset p-5">
        <div className="eyebrow mb-3">What you told us</div>
        <ul className="space-y-2.5">
          {result.triggers.map((t, i) => (
            <li key={i} className="flex gap-3 text-[0.95rem] text-ink-2 leading-relaxed">
              <span className="text-signal shrink-0" aria-hidden="true">
                ›
              </span>
              <span>{t.because}</span>
            </li>
          ))}
        </ul>
      </div>

      <FindingBody content={content} track={track} showPlan={false} />
    </section>
  );
}

export function Report({
  assessment,
  via,
  doneSteps,
  isOwner,
}: {
  assessment: Assessment;
  via: "membership" | "report" | "admin";
  doneSteps: string[];
  isOwner: boolean;
}) {
  const r = assessment.result;
  const track = assessment.track === "strength" ? "strength" : "physique";
  const ranked = r.findings.filter((f) => FINDINGS[f.id]);
  const primary = ranked[0];
  const primaryContent = primary ? FINDINGS[primary.id] : null;
  const maxScore = primary?.score ?? 1;
  const plan = buildPlan(ranked);
  // A report with ten 1,500-word findings is unreadable. The strongest six get full
  // sections; the rest stay on the page but folded away.
  const FULL_SECTIONS = 6;
  const inFull = ranked.slice(0, FULL_SECTIONS);
  const alsoFlagged = ranked.slice(FULL_SECTIONS);
  // Finding titles are written as standalone sentences, so they are quoted rather than
  // folded into a clause — "compounded by you're testing strength…" is not English.
  const secondaryTitles = ranked
    .slice(1, 3)
    .map((f) => FINDINGS[f.id]?.title)
    .filter((t): t is string => Boolean(t));

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* header */}
      <div className="slab p-6 sm:p-10 animate-rise">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="eyebrow">
            Your diagnosis · {TRACK_LABEL[track]} track · {fmtDate(new Date(assessment.createdAt))}
          </div>
          <div className="flex gap-2 no-print">
            <PrintButton />
            <Link href="/diagnose" className="btn btn-ghost btn-sm">
              New diagnosis
            </Link>
          </div>
        </div>
        <h1 className="display text-4xl sm:text-6xl">
          Why you&rsquo;re <em>stuck</em>.
        </h1>
        <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">
          {primaryContent ? (
            <>
              Your primary bottleneck: <strong className="text-ink">{primaryContent.title}</strong>.{" "}
              {secondaryTitles.length > 0 && (
                <>
                  {secondaryTitles.length === 1 ? "Working against you as well: " : "Two more are working against you: "}
                  {secondaryTitles.map((t, i) => (
                    <span key={t}>
                      {i > 0 && " and "}
                      <strong className="text-ink">{t}</strong>
                    </span>
                  ))}
                  .{" "}
                </>
              )}
              {r.clearances.length > 0 &&
                `${r.clearances.length} thing${r.clearances.length === 1 ? "" : "s"} you may have suspected ${
                  r.clearances.length === 1 ? "is" : "are"
                } not the problem. `}
              Read the findings in order — the first one is where the change starts.
            </>
          ) : (
            <>
              Your answers describe a well-run programme with nothing clearly broken — which is itself useful to know.
              Read the clearances below, then re-run in four weeks.
            </>
          )}
        </p>
      </div>

      {/* ranking */}
      {ranked.length > 0 && (
        <div className="slab p-6 sm:p-8 animate-rise" style={{ animationDelay: "60ms" }}>
          <div className="eyebrow mb-4">Your bottlenecks, ranked by impact</div>
          <ol className="space-y-4">
            {ranked.map((f, i) => {
              const c = FINDINGS[f.id];
              return (
                <li key={f.id}>
                  <a href={`#${f.id}`} className="block group">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex items-baseline gap-3 min-w-0">
                        <span className="font-mono text-xs text-ink-3 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-ink group-hover:text-signal transition-colors truncate">{c.title}</span>
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-ink-3 shrink-0">
                        {CATEGORY_LABEL[c.category]}
                      </span>
                    </div>
                    <div className="mt-2 pl-8">
                      <ImpactBar value={f.score / maxScore} />
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* findings — the top ones in full, the rest expandable so the page stays readable */}
      {inFull.map((f, i) => (
        <FindingSection key={f.id} index={i + 1} result={f} content={FINDINGS[f.id]} track={track} primary={i === 0} />
      ))}

      {alsoFlagged.length > 0 && (
        <section className="slab p-6 sm:p-10">
          <div className="eyebrow mb-3">Also flagged</div>
          <h2 className="display text-3xl sm:text-4xl">
            {alsoFlagged.length} smaller {alsoFlagged.length === 1 ? "leak" : "leaks"}.
          </h2>
          <p className="mt-3 text-ink-2 leading-relaxed max-w-2xl">
            These scored lower than the bottlenecks above, so fix those first. Nothing here is withheld — open any one
            for the full protocol.
          </p>
          <div className="mt-6 space-y-3">
            {alsoFlagged.map((f, i) => {
              const c = FINDINGS[f.id];
              return (
                <details key={f.id} id={f.id} className="slab-inset p-5 scroll-mt-24 group">
                  <summary className="cursor-pointer list-none select-none">
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-[11px] font-mono uppercase tracking-[0.12em] text-ink-3 mb-1">
                          {String(inFull.length + i + 1).padStart(2, "0")} · {CATEGORY_LABEL[c.category]} · from{" "}
                          {f.triggers.length} answer{f.triggers.length === 1 ? "" : "s"}
                        </span>
                        <span className="block font-semibold text-ink">{c.title}</span>
                        <span className="block mt-1 text-sm text-ink-2 leading-relaxed">{c.verdict}</span>
                      </span>
                      <span className="tag shrink-0 group-open:hidden">Open</span>
                      <span className="tag shrink-0 hidden group-open:inline-flex">Close</span>
                    </span>
                  </summary>
                  <div className="mt-5 pt-5 border-t border-line">
                    <div className="slab-inset p-4">
                      <div className="eyebrow mb-2">What you told us</div>
                      <ul className="space-y-2">
                        {f.triggers.map((t, ti) => (
                          <li key={ti} className="flex gap-2.5 text-sm text-ink-2 leading-relaxed">
                            <span className="text-signal shrink-0" aria-hidden="true">
                              ›
                            </span>
                            <span>{t.because}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <FindingBody content={c} track={track} showPlan={false} />
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      )}

      {/* clearances */}
      {r.clearances.length > 0 && (
        <section className="slab p-6 sm:p-10">
          <div className="tag tag-clear mb-4">Not your problem</div>
          <h2 className="display text-3xl sm:text-4xl">Stop fixing these.</h2>
          <p className="mt-3 text-ink-2 leading-relaxed">
            Your answers rule these out. Energy spent here is energy taken from the bottlenecks above.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {r.clearances.map((c) => (
              <li key={c.id} className="slab-inset p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-clear/15 text-clear text-[11px]">✓</span>
                  <span className="font-semibold text-ink">{c.title}</span>
                </div>
                <p className="text-sm text-ink-2 leading-relaxed">{c.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* plan */}
      {plan[0]?.items.length > 0 && (
        <section id="plan" className="slab p-6 sm:p-10 scroll-mt-24">
          <div className="tag tag-signal mb-4">Your 4-week plan</div>
          <h2 className="display text-3xl sm:text-4xl">One month, in order.</h2>
          <p className="mt-3 text-ink-2 leading-relaxed">
            Built from your top {plan[0].items.length} bottleneck{plan[0].items.length === 1 ? "" : "s"}. Do week one before
            you read week two. Tick things off as you go — then re-run the diagnosis at the end of week four to see
            what cleared.
          </p>
          <div className="mt-6">
            <PlanChecklist assessmentId={assessment.id} weeks={plan} done={doneSteps} canCheck={isOwner} />
          </div>
        </section>
      )}

      {/* footer cta */}
      <div className="slab p-6 sm:p-8 no-print">
        {via === "report" ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="eyebrow mb-1">In four weeks</div>
              <p className="text-ink-2 leading-relaxed max-w-lg">
                Members re-run the diagnosis as often as they like, log their numbers in the plateau tracker, and see
                what changed between reports.
              </p>
            </div>
            <Link href="/pricing" className="btn btn-ghost shrink-0">
              See membership
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="eyebrow mb-1">Keep the loop going</div>
              <p className="text-ink-2 leading-relaxed max-w-lg">
                Log this week&rsquo;s lifts and measurements in your tracker, then re-diagnose at the end of week four to
                see which bottlenecks cleared.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/dashboard/tracker" className="btn btn-ghost">
                Open tracker
              </Link>
              <Link href="/diagnose" className="btn btn-primary">
                Re-diagnose
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
