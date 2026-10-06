import Link from "next/link";
import { QUESTIONS } from "@/content/questions";
import { carbsPerKg, proteinPerKg, weeklyHours } from "@/content/derived";
import type { Track } from "@/content/types";
import type { DiagnosisResult } from "@/lib/engine/types";
import type { Answers } from "@/lib/db/schema";
import { Paywall } from "@/components/paywall/Paywall";
import { buildScorecard, DIMENSION_META, weekLine } from "@/lib/report/scorecard";
import { actionableCount, buildHooks } from "@/lib/report/hooks";
import { UnlockBar } from "@/components/paywall/UnlockBar";

/**
 * The paywall. Nothing of the report is on this page or in its HTML: no mechanism, no fix, no
 * clearance text. What it shows is the lifter's own problems by name, the answers that gave each
 * one away, their scorecard, and what the report will do with their numbers. The analysis itself
 * is written only after payment (see /report/[id]).
 */
export function ResultPaywall({
  id,
  track,
  answers,
  result: r,
  signedIn,
  canceled,
  intent,
}: {
  id: string;
  track: Track;
  answers: Answers;
  result: DiagnosisResult;
  signedIn: boolean;
  canceled: boolean;
  intent?: "report" | "membership";
}) {
  const dims = buildScorecard(answers, track);
  const hooks = buildHooks(r, dims);
  const problems = actionableCount(r);
  const weakest = new Set([...dims].sort((x, y) => x.score - y.score).slice(0, 3).map((d) => d.id));
  const returnTo = `/diagnose/result/${id}`;
  const trackLabel = track === "strength" ? "Strength track" : "Physique track";
  const strip = profileStrip(answers);
  const inside = insideList(answers, problems, r.clearances.length);

  return (
    <div className="px-3 sm:px-5 py-6 pb-28 sm:py-10">
      <UnlockBar problems={problems} />
      <div className="mx-auto max-w-5xl">
        {/* headline */}
        <div className="slab p-6 sm:p-10 animate-rise">
          <div className="eyebrow mb-3">Diagnosis ready · {trackLabel}</div>
          <h1 className="display text-4xl sm:text-6xl text-balance">
            {problems > 0 ? (
              <>
                We found{" "}
                <em>
                  {problems} {problems === 1 ? "problem" : "problems"}
                </em>{" "}
                holding you back.
              </>
            ) : (
              <>
                Your set-up is solid. Here&rsquo;s where it <em>still leaks</em>.
              </>
            )}
          </h1>
          <p className="mt-4 text-ink-2 text-lg max-w-2xl leading-relaxed">
            We read all {r.answeredCount} of your answers against your build and your week.{" "}
            {problems > 0
              ? "Below is what's wrong, ranked, with the answers that gave each one away. Why it's happening and exactly what to change is in your report."
              : "Below are your weakest areas and the answers behind them. What to change, and in what order, is in your report."}
          </p>
          {strip.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Your numbers">
              {strip.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          )}
          {canceled && (
            <p className="mt-4 text-sm text-ink-3">Checkout was cancelled. Your answers are safe here whenever you&rsquo;re ready.</p>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          {/* the problems, by name, with the answers behind them */}
          <section aria-labelledby="problems-title" className="slab p-5 sm:p-8 animate-rise lg:col-start-1 lg:row-start-1" style={{ animationDelay: "60ms" }}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="problems-title" className="display text-2xl sm:text-3xl">
                {problems > 0 ? "Your problems, ranked" : "Where your progress leaks"}
              </h2>
              {problems > hooks.length && <span className="eyebrow shrink-0">Top {hooks.length} of {problems}</span>}
            </div>
            <ol className="mt-5 space-y-3">
              {hooks.map((h, i) => (
                <li key={h.id} className="slab-inset p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="display w-7 shrink-0 text-3xl sm:text-4xl leading-none text-signal tabular-nums" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        {i === 0 && h.kind === "finding" && <span className="tag tag-alert">Biggest bottleneck</span>}
                        {h.dimension && <span className="tag">{DIMENSION_META[h.dimension].label}</span>}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold leading-snug text-ink text-pretty">{h.title}</h3>
                      <div className="mt-3">
                        <div className="eyebrow mb-1.5">From your answers</div>
                        <ul className="space-y-1.5">
                          {h.evidence.map((e) => (
                            <li key={e} className="flex gap-2 text-sm leading-relaxed text-ink-2">
                              <span className="text-signal" aria-hidden="true">
                                ›
                              </span>
                              <span>{e}</span>
                            </li>
                          ))}
                          {h.moreEvidence > 0 && (
                            <li className="flex gap-2 text-sm text-ink-3">
                              <span aria-hidden="true">›</span>
                              <span>
                                {h.moreEvidence === 1 ? "1 more answer points" : `${h.moreEvidence} more answers point`} the same way
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>
                      <p className="mt-4 flex items-center gap-2 text-xs text-ink-3 sm:hidden">
                        <LockIcon />
                        Why, what it costs you and your fix are in your report
                      </p>
                      <ul className="mt-4 hidden gap-1.5 sm:grid sm:grid-cols-3" aria-label="In your report">
                        {["Why it's happening to you", "What it's costing you", "Your fix, in your numbers"].map((t) => (
                          <li key={t} className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-3 py-2 text-xs text-ink-3">
                            <LockIcon />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {problems > hooks.length && (
              <p className="mt-4 text-sm text-ink-3">
                + {problems - hooks.length} more {problems - hooks.length === 1 ? "problem" : "problems"} in your report, ranked by impact.
              </p>
            )}
          </section>

          {/* paywall: second on phones (right after the problems), a sticky column on desktop */}
          <aside
            id="unlock"
            className="animate-rise lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-24"
            style={{ animationDelay: "120ms" }}
          >
            <div className="slab p-5 sm:p-6">
              <div className="eyebrow mb-2">Unlock your analysis</div>
              <h2 className="text-2xl font-semibold tracking-tight">See why, and exactly what to change.</h2>
              <p className="mt-2 mb-4 text-sm leading-relaxed text-ink-3">
                Your report is written the moment you unlock: LiftDecode&rsquo;s engine and an AI coach read all{" "}
                {r.answeredCount} answers together. It takes a few minutes.
              </p>
              <Paywall assessmentId={id} signedIn={signedIn} returnTo={returnTo} intent={canceled ? undefined : intent} />
            </div>
            <p className="mt-3 text-center text-xs text-ink-3">
              Want to redo it?{" "}
              <Link href="/diagnose" className="underline underline-offset-2 hover:text-ink-2">
                Start a new diagnosis
              </Link>
            </p>
          </aside>

          {/* scorecard: scores only */}
          <section aria-labelledby="scorecard-title" className="slab p-5 sm:p-8 animate-rise lg:col-start-1 lg:row-start-2" style={{ animationDelay: "180ms" }}>
            <h2 id="scorecard-title" className="display text-2xl sm:text-3xl">
              Your scorecard
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-3">
              Ten parts of your set-up, each scored 0–100 from your answers. Your three weakest are marked. What drives each
              score, and how to move it, is in your report.
            </p>
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {dims.map((d) => {
                const weak = weakest.has(d.id);
                const tone = d.score < 50 ? "bg-alert" : d.score < 70 ? "bg-signal" : "bg-clear";
                return (
                  <li key={d.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={`text-sm ${weak ? "font-semibold text-ink" : "text-ink-2"}`}>
                        {d.label}
                        {weak && <span className="ml-2 align-middle text-[10px] font-mono uppercase tracking-[0.14em] text-signal">weak</span>}
                      </span>
                      <span className="font-mono text-sm tabular-nums text-ink">{d.score}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]" role="presentation">
                      <div className={`h-full rounded-full ${tone}`} style={{ width: `${d.score}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* what the report will do with their numbers */}
          <section aria-labelledby="inside-title" className="slab p-5 sm:p-8 animate-rise lg:col-start-1 lg:row-start-3" style={{ animationDelay: "240ms" }}>
            <h2 id="inside-title" className="display text-2xl sm:text-3xl">
              Inside your report
            </h2>
            <ul className="mt-5 space-y-3">
              {inside.map((x) => (
                <li key={x.title} className="flex gap-3">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-signal/15 text-signal" aria-hidden="true">
                    <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8.5l3.2 3L13 4.5" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-ink">{x.title}</div>
                    {x.detail && <div className="text-sm leading-relaxed text-ink-3">{x.detail}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-ink-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
      <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" />
    </svg>
  );
}

const optionLabel = (answers: Answers, qid: string): string | undefined => {
  const v = answers[qid];
  if (typeof v !== "string") return undefined;
  return QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.value === v)?.label;
};

/** the few numbers that prove the page is about this lifter */
function profileStrip(answers: Answers): string[] {
  const out: string[] = [];
  const h = Number(answers.height_cm);
  const w = Number(answers.weight_kg);
  if (Number.isFinite(h) && h > 0) out.push(`${Math.round(h)} cm`);
  if (Number.isFinite(w) && w > 0) out.push(`${w} kg`);
  const sessions = optionLabel(answers, "sessions_week");
  if (sessions) out.push(`${sessions} sessions a week`);
  const hours = weeklyHours(answers);
  if (hours !== undefined) out.push(`≈ ${hours.toFixed(1)} h lifting`);
  const protein = optionLabel(answers, "protein_g");
  if (protein && answers.protein_g !== "unknown") out.push(`${protein} g protein`);
  const sleep = optionLabel(answers, "sleep_hours");
  if (sleep) out.push(`${sleep} h sleep`);
  return out;
}

function insideList(answers: Answers, problems: number, clearances: number): { title: string; detail?: string }[] {
  const w = Number(answers.weight_kg);
  const p = proteinPerKg(answers);
  const c = carbsPerKg(answers);
  const protein = optionLabel(answers, "protein_g");
  const carbs = optionLabel(answers, "carbs_g");
  const fuel = [
    protein ? (answers.protein_g === "unknown" ? "protein (untracked)" : `${protein} g protein${p ? ` (≈ ${p.toFixed(1)} g/kg)` : ""}`) : null,
    carbs ? (answers.carbs_g === "unknown" ? "carbs (untracked)" : `${carbs} g carbs${c ? ` (≈ ${c.toFixed(1)} g/kg)` : ""}`) : null,
  ]
    .filter(Boolean)
    .join(" and ");
  const week = weekLine(answers);
  return [
    {
      title: problems > 0 ? `All ${problems} ${problems === 1 ? "problem" : "problems"}, explained for your case` : "Your weakest areas, explained for your case",
      detail: "why each one is happening to you, what it costs, and the fix in your numbers",
    },
    { title: "The chain behind your stall", detail: "how your problems feed each other, and which one to pull first" },
    { title: "Your training-dose audit", detail: week ? `${week}, checked against what grows muscle` : "every muscle group checked against what grows muscle" },
    {
      title: "Your fuel audit",
      detail: `${fuel || "protein and carbs"}${Number.isFinite(w) && w > 0 ? ` at ${w} kg` : ""}, meal timing, minerals and the scale`,
    },
    { title: "Recovery and conditioning", detail: "sleep, stress, set-to-set recovery, and what cardio does for growth" },
    { title: "A 4-week plan built around your week", detail: "weekly targets with check-offs, and the numbers to retest" },
    ...(clearances > 0
      ? [{ title: `${clearances} ${clearances === 1 ? "thing" : "things"} you can stop worrying about`, detail: "so you stop fixing what isn't broken" }]
      : []),
  ];
}
