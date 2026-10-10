import Link from "next/link";
import type { ReactNode } from "react";
import { FINDINGS } from "@/content/findings";
import { groupHours, GROUPS } from "@/content/derived";
import { QUESTIONS } from "@/content/questions";
import type { Assessment } from "@/lib/assessments";
import type { AiReport } from "@/lib/ai/schema";
import { evidenceById } from "@/lib/ai/knowledge";
import { buildProfile } from "@/lib/report/profile";
import { buildScorecard, DIMENSION_META, type DimensionId } from "@/lib/report/scorecard";
import { TRACK_LABEL } from "@/lib/report/labels";
import { ProfileCard } from "./ProfileCard";
import { PlanChecklist, type PlanWeek } from "./PlanChecklist";
import { PrintButton } from "./ReportTools";
import { FindingBody } from "./FindingBody";

/**
 * The paid report: the model's analysis (src/lib/ai/schema.ts) laid out section by section,
 * with the rule engine's evidence ("what you told us") and the evergreen finding content folded
 * under each problem. Evidence ids the model cites ([CARDIO-10]) become numbered footnotes that
 * link to the verified sources at the bottom; ids that are not in the evidence base are dropped.
 */

const CITE = /\[((?:[A-Z]+-\d+)(?:\s*,\s*[A-Z]+-\d+)*)\]/g;

function citationOrder(report: AiReport): Map<string, number> {
  const order = new Map<string, number>();
  for (const m of JSON.stringify(report).matchAll(CITE)) {
    for (const id of m[1].split(/\s*,\s*/)) {
      if (evidenceById(id) && !order.has(id)) order.set(id, order.size + 1);
    }
  }
  return order;
}

/** text with its evidence ids turned into footnote links */
function Rich({ text, refs }: { text: string; refs: Map<string, number> }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(CITE)) {
    const start = m.index ?? 0;
    out.push(text.slice(last, start).replace(/\s+$/, ""));
    const nums = m[1]
      .split(/\s*,\s*/)
      .map((id) => refs.get(id))
      .filter((n): n is number => n !== undefined);
    if (nums.length) {
      out.push(
        <sup key={start} className="ml-0.5 whitespace-nowrap text-[0.7em] font-mono">
          {nums.map((n, i) => (
            <span key={n}>
              {i > 0 && ","}
              <a href={`#src-${n}`} className="text-signal no-underline hover:underline" aria-label={`Source ${n}`}>
                {n}
              </a>
            </span>
          ))}
        </sup>,
      );
    }
    last = start + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

const SEVERITY: Record<string, { label: string; cls: string }> = {
  high: { label: "High impact", cls: "tag-alert" },
  medium: { label: "Medium impact", cls: "tag-signal" },
  low: { label: "Lower impact", cls: "" },
};

const optionLabel = (a: Assessment, qid: string) => {
  const v = a.answers[qid];
  return typeof v === "string" ? QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.value === v)?.label : undefined;
};

export function AiReportView({
  assessment,
  report,
  via,
  doneSteps,
  isOwner,
}: {
  assessment: Assessment;
  report: AiReport;
  via: "membership" | "report" | "admin";
  doneSteps: string[];
  isOwner: boolean;
}) {
  const track = assessment.track === "strength" ? "strength" : "physique";
  const refs = citationOrder(report);
  const dims = buildScorecard(assessment.answers, track);
  const dimById = new Map(dims.map((d) => [d.id, d]));
  const profile = buildProfile(assessment.answers);
  const results = new Map(assessment.result.findings.map((f) => [f.id, f]));
  const plan: PlanWeek[] = report.plan.slice(0, 4).map((w, wi) => ({
    week: wi + 1,
    focus: w.focus,
    items: w.actions.map((text, i) => ({ key: `ai:w${wi + 1}:${i}`, text })),
  }));
  const sources = [...refs.entries()].map(([id, n]) => ({ n, e: evidenceById(id)! }));

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* verdict */}
      <header className="slab p-6 sm:p-10 animate-rise">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="eyebrow">
            Your analysis · {TRACK_LABEL[track]} track · {fmtDate(new Date(assessment.createdAt))}
          </div>
          <div className="no-print flex gap-2">
            <PrintButton />
            <Link href="/diagnose" className="btn btn-ghost btn-sm">
              New diagnosis
            </Link>
          </div>
        </div>
        <h1 className="display text-4xl sm:text-6xl text-balance">{report.headline}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-2">
          <Rich refs={refs} text={report.summary} />
        </p>
      </header>

      {/* the one move */}
      <section className="slab relative overflow-hidden p-6 sm:p-8 animate-rise" style={{ animationDelay: "60ms" }}>
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />
        <div className="tag tag-signal mb-3">If you change one thing this week</div>
        <h2 className="display text-3xl sm:text-4xl text-balance">{report.firstMove.title}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="eyebrow mb-1.5">Why first</div>
            <p className="leading-relaxed text-ink-2">
              <Rich refs={refs} text={report.firstMove.why} />
            </p>
          </div>
          <div>
            <div className="eyebrow mb-1.5">How</div>
            <p className="leading-relaxed text-ink">
              <Rich refs={refs} text={report.firstMove.how} />
            </p>
          </div>
        </div>
      </section>

      <ProfileCard stats={profile} />

      {/* root cause and the chain */}
      <section className="slab p-6 sm:p-10">
        <div className="eyebrow mb-3">The chain behind your stall</div>
        <h2 className="display text-3xl sm:text-4xl text-balance">{report.rootCause.title}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-2">
          <Rich refs={refs} text={report.rootCause.explanation} />
        </p>
        <ol className="mt-8">
          {report.chain.map((c, i) => {
            const last = i === report.chain.length - 1;
            return (
              <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {!last && <span className="absolute left-[15px] top-9 bottom-1 w-px bg-gradient-to-b from-signal/60 to-line" aria-hidden="true" />}
                <span
                  className={`relative grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs ${
                    last ? "border-alert bg-alert/15 text-alert" : i === 0 ? "border-signal bg-signal/15 text-signal" : "border-line-2 text-ink-2"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 pt-1">
                  <div className={`font-semibold ${last ? "text-alert" : "text-ink"}`}>{c.label}</div>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">
                    <Rich refs={refs} text={c.detail} />
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* scorecard */}
      <section className="slab p-6 sm:p-10">
        <div className="eyebrow mb-3">Your scorecard</div>
        <h2 className="display text-3xl sm:text-4xl">Ten parts of your set-up.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-3">
          Each score runs 0–100 and comes straight from your answers; the note under it is what moves it.
        </p>
        <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {report.scorecard.map((s) => {
            const d = dimById.get(s.id as DimensionId);
            if (!d) return null;
            const tone = d.score < 50 ? "bg-alert" : d.score < 70 ? "bg-signal" : "bg-clear";
            return (
              <li key={s.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-ink">{DIMENSION_META[d.id].label}</span>
                  <span className="font-mono text-sm tabular-nums text-ink">{d.score}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]" role="presentation">
                  <div className={`h-full rounded-full ${tone}`} style={{ width: `${d.score}%` }} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  <Rich refs={refs} text={s.read} />
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* problems */}
      {report.problems.map((p, i) => {
        const fr = p.findingId ? results.get(p.findingId) : undefined;
        const content = p.findingId ? FINDINGS[p.findingId] : undefined;
        const sev = SEVERITY[p.severity] ?? SEVERITY.medium;
        return (
          <section key={`${p.findingId ?? "x"}-${i}`} id={`problem-${i + 1}`} className="slab p-6 sm:p-10 scroll-mt-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="tag">Problem {i + 1}</span>
              <span className={`tag ${sev.cls}`}>{sev.label}</span>
            </div>
            <h2 className="display text-3xl sm:text-5xl text-balance">{p.title}</h2>
            <div className="mt-6 grid gap-6">
              <div>
                <div className="eyebrow mb-2">In your case</div>
                <p className="text-[1.02rem] leading-relaxed text-ink">
                  <Rich refs={refs} text={p.inYourCase} />
                </p>
              </div>
              <div className="slab-inset p-4 sm:p-5">
                <div className="eyebrow mb-1.5 text-alert">What it&rsquo;s costing you</div>
                <p className="leading-relaxed text-ink-2">
                  <Rich refs={refs} text={p.cost} />
                </p>
              </div>
              <div>
                <div className="eyebrow mb-3">The fix</div>
                <ol className="space-y-3">
                  {p.fix.map((s, si) => (
                    <li key={si} className="flex gap-3 leading-relaxed text-ink-2">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-signal/15 font-mono text-xs text-signal">{si + 1}</span>
                      <span>
                        <Rich refs={refs} text={s} />
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            {fr && fr.triggers.length > 0 && (
              <div className="mt-6 slab-inset p-4 sm:p-5">
                <div className="eyebrow mb-2">What you told us</div>
                <ul className="space-y-2">
                  {fr.triggers.map((t, ti) => (
                    <li key={ti} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                      <span className="shrink-0 text-signal" aria-hidden="true">
                        ›
                      </span>
                      <span>{t.because}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content && (
              <details className="group mt-4 slab-inset p-4 sm:p-5">
                <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-3">
                  <span className="font-semibold text-ink">The science, in depth</span>
                  <span className="tag shrink-0 group-open:hidden">Open</span>
                  <span className="tag hidden shrink-0 group-open:inline-flex">Close</span>
                </summary>
                <FindingBody content={content} track={track} showPlan={false} />
              </details>
            )}
          </section>
        );
      })}

      {/* dose audit */}
      <section className="slab p-6 sm:p-10">
        <div className="eyebrow mb-3">Training dose audit</div>
        <h2 className="display text-3xl sm:text-4xl">Your week, muscle by muscle.</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-2">
          <Rich refs={refs} text={report.doseAudit.verdict} />
        </p>
        <div className="mt-6 grid gap-3">
          {GROUPS.map((g) => {
            const row = report.doseAudit.groups.find((x) => x.group === g);
            if (!row) return null;
            const s = optionLabel(assessment, `${g}_sessions`);
            const t = optionLabel(assessment, `${g}_time`);
            const h = groupHours(assessment.answers, g);
            return (
              <div key={g} className="slab-inset grid gap-3 p-4 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:p-5">
                <div>
                  <div className="font-semibold capitalize text-ink">{g}</div>
                  {s && t && <div className="mt-0.5 font-mono text-xs text-ink-3">{s === "0" ? "No sessions" : `${s}× ${t}`}</div>}
                  {h !== undefined && <div className="font-mono text-xs text-ink-3">≈ {h.toFixed(1)} h a week</div>}
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-ink-2">
                    <Rich refs={refs} text={row.read} />
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">
                    <span className="text-signal">→ </span>
                    <Rich refs={refs} text={row.change} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* fuel audit */}
      <section className="slab p-6 sm:p-10">
        <div className="eyebrow mb-3">Fuel audit</div>
        <h2 className="display text-3xl sm:text-4xl">What your training runs on.</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-2">
          <Rich refs={refs} text={report.fuelAudit.verdict} />
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["Protein", report.fuelAudit.protein],
              ["Carbs", report.fuelAudit.carbs],
              ["Meal timing", report.fuelAudit.timing],
              ["Sweat and minerals", report.fuelAudit.minerals],
              ["The scale", report.fuelAudit.bodyweight],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="slab-inset p-4 sm:p-5 sm:last:col-span-2">
              <div className="eyebrow mb-1.5">{k}</div>
              <p className="text-sm leading-relaxed text-ink-2">
                <Rich refs={refs} text={v} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* recovery + conditioning */}
      <section className="slab p-6 sm:p-10">
        <div className="eyebrow mb-3">Recovery and conditioning</div>
        <h2 className="display text-3xl sm:text-4xl">What happens between sessions, and between sets.</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="slab-inset p-5">
            <div className="font-semibold text-ink">Recovery</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              <Rich refs={refs} text={report.recovery.verdict} />
            </p>
            <div className="eyebrow mt-4 mb-1">Sleep</div>
            <p className="text-sm leading-relaxed text-ink-2">
              <Rich refs={refs} text={report.recovery.sleep} />
            </p>
            <div className="eyebrow mt-4 mb-1">Stress and life</div>
            <p className="text-sm leading-relaxed text-ink-2">
              <Rich refs={refs} text={report.recovery.stress} />
            </p>
          </div>
          <div className="slab-inset p-5">
            <div className="font-semibold text-ink">Conditioning</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              <Rich refs={refs} text={report.conditioning.verdict} />
            </p>
            <div className="eyebrow mt-4 mb-1">Why it matters for muscle</div>
            <p className="text-sm leading-relaxed text-ink-2">
              <Rich refs={refs} text={report.conditioning.science} />
            </p>
            <div className="eyebrow mt-4 mb-1">What to do</div>
            <p className="text-sm leading-relaxed text-ink">
              <Rich refs={refs} text={report.conditioning.prescription} />
            </p>
          </div>
        </div>
      </section>

      {/* plan */}
      {plan.length > 0 && (
        <section id="plan" className="slab p-6 sm:p-10 scroll-mt-4">
          <div className="tag tag-signal mb-4">Your 4-week plan</div>
          <h2 className="display text-3xl sm:text-4xl">One month, in order.</h2>
          <p className="mt-3 leading-relaxed text-ink-2">
            {report.plan
              .slice(0, 4)
              .map((w, i) => `Week ${i + 1}: ${w.focus}`)
              .join(" · ")}
          </p>
          <div className="mt-6">
            <PlanChecklist assessmentId={assessment.id} weeks={plan} done={doneSteps} canCheck={isOwner} />
          </div>
        </section>
      )}

      {/* numbers to track */}
      {report.track.length > 0 && (
        <section className="slab p-6 sm:p-10">
          <div className="eyebrow mb-3">Numbers to track</div>
          <h2 className="display text-3xl sm:text-4xl">How you&rsquo;ll know it&rsquo;s working.</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink-3">
                  <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] font-normal">Measure</th>
                  <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] font-normal">Now</th>
                  <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] font-normal">Target</th>
                  <th className="py-2 font-mono text-[11px] uppercase tracking-[0.12em] font-normal">Check</th>
                </tr>
              </thead>
              <tbody>
                {report.track.map((t, i) => (
                  <tr key={i} className="border-b border-line last:border-b-0 align-top">
                    <td className="py-3 pr-4 font-semibold text-ink">{t.metric}</td>
                    <td className="py-3 pr-4 text-ink-2">{t.now}</td>
                    <td className="py-3 pr-4 text-signal">{t.target}</td>
                    <td className="py-3 text-ink-3">{t.checkIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* keep + ruled out */}
      <section className="slab p-6 sm:p-10">
        <div className="tag tag-clear mb-4">Keep doing</div>
        <h2 className="display text-3xl sm:text-4xl">Don&rsquo;t touch these.</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {report.keep.map((k, i) => (
            <li key={i} className="slab-inset flex gap-3 p-4">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-clear/15 text-[11px] text-clear">✓</span>
              <span className="text-sm leading-relaxed text-ink-2">
                <Rich refs={refs} text={k} />
              </span>
            </li>
          ))}
        </ul>
        {assessment.result.clearances.length > 0 && (
          <details className="group mt-4">
            <summary className="cursor-pointer list-none select-none text-sm text-ink-3 hover:text-ink-2">
              <span className="underline underline-offset-2">
                {assessment.result.clearances.length} thing{assessment.result.clearances.length === 1 ? "" : "s"} your answers rule out
              </span>
            </summary>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {assessment.result.clearances.map((c) => (
                <li key={c.id} className="slab-inset p-4">
                  <div className="mb-1 font-semibold text-ink">{c.title}</div>
                  <p className="text-sm leading-relaxed text-ink-2">{c.text}</p>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {/* retest + closing */}
      <section className="slab p-6 sm:p-10">
        <div className="eyebrow mb-3">In four weeks</div>
        <p className="max-w-3xl text-lg leading-relaxed text-ink">
          <Rich refs={refs} text={report.retest} />
        </p>
        <p className="mt-5 max-w-3xl leading-relaxed text-ink-2">
          <Rich refs={refs} text={report.closing} />
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-ink-3">LiftDecode</p>
      </section>

      {/* sources */}
      {sources.length > 0 && (
        <section className="slab p-6 sm:p-10" aria-labelledby="sources-title">
          <div className="eyebrow mb-3">Sources</div>
          <h2 id="sources-title" className="text-xl font-semibold tracking-tight">
            The research behind the numbers
          </h2>
          <ol className="mt-5 space-y-3">
            {sources.map(({ n, e }) => (
              <li key={e.id} id={`src-${n}`} className="flex gap-3 scroll-mt-4 text-sm leading-relaxed">
                <span className="w-6 shrink-0 font-mono text-ink-3">{n}.</span>
                <span className="min-w-0 text-ink-2">
                  {e.source}.{" "}
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="break-words text-signal underline-offset-2 hover:underline">
                    {new URL(e.url).hostname.replace(/^www\./, "")}
                  </a>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-ink-3">
            This report was written for you by AI from your answers and LiftDecode&rsquo;s diagnostic engine, using only the sources
            above. It is coaching guidance, not medical advice.
          </p>
        </section>
      )}

      {/* footer cta */}
      <div className="slab p-6 sm:p-8 no-print">
        {via === "report" ? (
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="eyebrow mb-1">In four weeks</div>
              <p className="max-w-lg leading-relaxed text-ink-2">
                Members re-run the diagnosis as often as they like, log their numbers in the plateau tracker, and see what changed
                between reports.
              </p>
            </div>
            <Link href="/pricing" className="btn btn-ghost shrink-0">
              See membership
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="eyebrow mb-1">Keep the loop going</div>
              <p className="max-w-lg leading-relaxed text-ink-2">
                Log this week&rsquo;s lifts and measurements in your tracker, then re-diagnose at the end of week four to see what moved.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
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
