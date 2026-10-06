"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { STAGES } from "@/lib/ai/stages";
import { PLATE } from "@/components/marketing/Barbell";
import { track } from "@/components/Analytics";

export type JobView = {
  status: "none" | "running" | "done" | "failed" | "capped";
  stage: number;
  progress: number;
  attempts: number;
  canRetry?: boolean;
  error?: string;
};

const POLL_MS = 2000;

/**
 * The wait between payment and the finished analysis (usually three to five minutes). The writer
 * reports which section it has reached; each section loads one pair of bumper plates onto the bar,
 * the percentage follows the real progress (eased, never backwards), and the lifter's own numbers
 * cycle underneath so it is plainly their report being written. When the report is saved the bar
 * lifts and the page swaps to the report.
 */
export function AnalysisWaiting({
  assessmentId,
  initial,
  facts,
  simulate = false,
}: {
  assessmentId: string;
  initial: JobView;
  facts: string[];
  /** dev preview only: fake the job locally instead of calling the API */
  simulate?: boolean;
}) {
  const router = useRouter();
  const [job, setJob] = useState<JobView>(initial);
  const [shown, setShown] = useState(Math.max(1, initial.progress));
  const [lifted, setLifted] = useState(false);
  const [busy, setBusy] = useState(false);
  const started = useRef(false);
  const target = useRef(initial.progress);

  const start = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/report/${assessmentId}/analysis`, { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as JobView;
      if (data.status) setJob(data);
      track("analysis_start", { assessmentId, status: data.status ?? "error" });
    } catch {
      setJob((j) => ({ ...j, status: "failed", error: "Could not reach the server. Check your connection and try again." }));
    } finally {
      setBusy(false);
    }
  }, [assessmentId]);

  // start once on arrival (the job may already be running or done; the server decides)
  useEffect(() => {
    if (simulate || !(initial.status === "none" || (initial.status === "failed" && initial.canRetry && initial.attempts < 2))) return;
    // deferred a tick so the effect itself stays free of state updates (and survives dev double-mount)
    const t = window.setTimeout(() => {
      if (started.current) return;
      started.current = true;
      void start();
    }, 0);
    return () => window.clearTimeout(t);
  }, [initial.status, initial.attempts, initial.canRetry, start, simulate]);

  // dev preview: walk through the stages in about 30 seconds
  useEffect(() => {
    if (!simulate) return;
    const t = window.setInterval(() => {
      setJob((j) => {
        if (j.status === "done") return j;
        const progress = Math.min(100, j.progress + 3 + Math.round(Math.random() * 3));
        const stage = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length));
        return progress >= 100 ? { ...j, status: "done", progress: 100, stage } : { ...j, status: "running", progress, stage };
      });
    }, 900);
    return () => window.clearInterval(t);
  }, [simulate]);

  // a first failure (an overloaded API, a dropped connection) is retried once without asking
  const autoRetried = useRef(false);
  useEffect(() => {
    if (simulate || job.status !== "failed" || !job.canRetry || job.attempts >= 2 || autoRetried.current) return;
    const t = window.setTimeout(() => {
      if (autoRetried.current) return;
      autoRetried.current = true;
      void start();
    }, 1500);
    return () => window.clearTimeout(t);
  }, [job.status, job.canRetry, job.attempts, simulate, start]);

  // poll while it runs
  useEffect(() => {
    if (job.status !== "running" || simulate) return;
    const t = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/report/${assessmentId}/analysis`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as JobView;
        setJob((j) => ({ ...data, stage: Math.max(j.stage, data.stage), progress: Math.max(j.progress, data.progress) }));
      } catch {
        /* a missed poll is retried two seconds later */
      }
    }, POLL_MS);
    return () => window.clearInterval(t);
  }, [job.status, assessmentId, simulate]);

  // ease the shown percentage toward the real one; creep a little between polls so it never sits still
  useEffect(() => {
    target.current = job.status === "done" ? 100 : job.progress;
  }, [job.progress, job.status]);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setShown((s) => {
        const goal = target.current;
        const ceiling = goal >= 100 ? 100 : Math.min(98, goal + 4);
        const next = s < goal ? s + (goal - s) * Math.min(1, dt * 3) + dt * 2 : s < ceiling ? s + dt * 0.35 : s;
        return Math.min(ceiling, next);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // done: lift, then show the report
  useEffect(() => {
    if (job.status === "done") {
      track("analysis_done", { assessmentId });
      const a = window.setTimeout(() => setLifted(true), 450);
      const b = window.setTimeout(() => (simulate ? undefined : router.refresh()), 1700);
      return () => {
        window.clearTimeout(a);
        window.clearTimeout(b);
      };
    }
    if (job.status === "capped") router.refresh();
  }, [job.status, router, assessmentId, simulate]);

  const failed = job.status === "failed";
  const stage = job.status === "done" ? STAGES.length : job.stage;
  const pct = Math.floor(shown);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="slab relative overflow-hidden p-5 sm:p-10 animate-rise" aria-live="polite" aria-busy={!failed && job.status !== "done"}>
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="eyebrow mb-3">{failed ? "Your analysis" : job.status === "done" ? "Done" : "Writing your report"}</div>
          <h1 className="display text-4xl sm:text-6xl text-balance">
            {failed ? (
              <>
                Your analysis hit a <em>snag</em>.
              </>
            ) : job.status === "done" ? (
              <>
                Your report is <em>ready</em>.
              </>
            ) : (
              <>
                Building <em>your</em> analysis.
              </>
            )}
          </h1>
          {!failed && (
            <p className="mt-4 max-w-2xl text-[0.95rem] sm:text-lg leading-relaxed text-ink-2">
              Every answer is being read against every other: your sleep against your training, your fuel against your volume, your
              sweat against the signs you get. It usually takes three to five minutes, and you can leave this page; the report will be
              here when you come back.
            </p>
          )}

          <div className="mt-6 sm:mt-8">
            <LoadingBarbell loaded={Math.min(6, stage)} lifted={lifted} failed={failed} />
          </div>

          {!failed ? (
            <div className="mt-2 grid gap-6 sm:mt-4 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-10">
              <div className="flex items-baseline gap-1" aria-label={`${pct} percent`}>
                <span className="font-[family-name:var(--font-stencil)] text-7xl sm:text-8xl leading-none tabular-nums text-ink">{pct}</span>
                <span className="display text-3xl text-signal">%</span>
              </div>
              <ol className="space-y-2.5">
                {STAGES.map((s, i) => {
                  const done = i < stage;
                  const active = i === stage && job.status !== "done";
                  return (
                    <li key={s.label} className="flex items-center gap-3 text-sm sm:text-[0.95rem]">
                      <span
                        aria-hidden="true"
                        className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                          done ? "border-clear bg-clear text-void" : active ? "border-signal text-signal animate-pulse-soft" : "border-line-2 text-transparent"
                        }`}
                      >
                        {done ? (
                          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8.5l3.2 3L13 4.5" />
                          </svg>
                        ) : (
                          <span className="size-1.5 rounded-full bg-current" />
                        )}
                      </span>
                      <span className={done ? "text-ink-3" : active ? "text-ink" : "text-ink-3"}>{s.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : (
            <div className="mt-6">
              <p role="alert" className="max-w-2xl leading-relaxed text-ink-2">
                {job.error ??
                  (job.canRetry
                    ? "The writer stopped before it finished. Nothing is lost: your answers and findings are saved, and you can start it again."
                    : "It failed more than once, so we stopped retrying and have been alerted. Your findings are below in the meantime, and we will finish your analysis for you.")}
              </p>
              {job.canRetry && (
                <button type="button" className="btn btn-primary mt-5" onClick={() => void start()} disabled={busy} aria-busy={busy}>
                  {busy ? "Starting…" : "Try again"}
                </button>
              )}
            </div>
          )}

          {!failed && facts.length > 0 && <FactsTicker facts={facts} />}
        </div>
      </div>
    </div>
  );
}

function FactsTicker({ facts }: { facts: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((x) => (x + 1) % facts.length), 2600);
    return () => window.clearInterval(t);
  }, [facts.length]);
  return (
    <div className="mt-8 flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-white/[0.02] px-4 py-3">
      <span className="eyebrow shrink-0">Reading</span>
      <span key={i} className="min-w-0 truncate text-sm text-ink-2 animate-rise">
        {facts[i]}
      </span>
    </div>
  );
}

/* ───────────── the bar ───────────── */

type Plate = { x: number; w: number; fill: string; h: number; clamp?: boolean };
// left side, inner collar outward; the right side mirrors it
const PLATES: Plate[] = [
  { x: 140, w: 34, fill: PLATE.red, h: 210 },
  { x: 108, w: 30, fill: PLATE.blue, h: 210 },
  { x: 80, w: 26, fill: PLATE.yellow, h: 210 },
  { x: 58, w: 20, fill: PLATE.green, h: 210 },
  { x: 46, w: 10, fill: PLATE.white, h: 112 },
  { x: 32, w: 12, fill: "url(#lw-steel)", h: 42, clamp: true },
];
const W = 1000;
const CY = 125;

function PlateRect({ p, side }: { p: Plate; side: "l" | "r" }) {
  const x = side === "l" ? p.x : W - p.x - p.w;
  const y = CY - p.h / 2;
  return (
    <g className="lw-plate" style={{ "--from": `${side === "l" ? -110 : 110}px` } as CSSProperties}>
      <rect x={x} y={y} width={p.w} height={p.h} rx={p.clamp ? 3 : 6} fill={p.fill} />
      {!p.clamp && <rect x={x} y={y} width={p.w} height={p.h} rx={6} fill="url(#lw-shade)" />}
      {!p.clamp && p.h > 150 && (
        <>
          <rect x={x + 1} y={y + 12} width={p.w - 2} height={2.5} fill="#000" opacity={0.2} />
          <rect x={x + 1} y={y + p.h - 14.5} width={p.w - 2} height={2.5} fill="#000" opacity={0.2} />
        </>
      )}
    </g>
  );
}

function GhostPlate({ p, side }: { p: Plate; side: "l" | "r" }) {
  const x = side === "l" ? p.x : W - p.x - p.w;
  return (
    <rect
      className="animate-pulse-soft"
      x={x + 0.75}
      y={CY - p.h / 2 + 0.75}
      width={p.w - 1.5}
      height={p.h - 1.5}
      rx={6}
      fill="none"
      stroke="var(--color-signal)"
      strokeOpacity={0.55}
      strokeWidth={1.5}
      strokeDasharray="5 5"
    />
  );
}

function LoadingBarbell({ loaded, lifted, failed }: { loaded: number; lifted: boolean; failed: boolean }) {
  const next = PLATES[loaded];
  const bar = useRef<SVGGElement>(null);
  // a small clank as each pair lands (after its slide-in); skipped when motion is reduced
  useEffect(() => {
    const el = bar.current;
    if (!el || loaded === 0 || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(3px)" }, { transform: "translateY(-1px)" }, { transform: "translateY(0)" }],
      { duration: 320, delay: 470, easing: "ease-out" },
    );
  }, [loaded]);
  return (
    <svg viewBox="0 0 1000 256" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lw-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9e9ee" />
          <stop offset="0.45" stopColor="#a4a4ad" />
          <stop offset="0.55" stopColor="#8a8a93" />
          <stop offset="1" stopColor="#4b4b53" />
        </linearGradient>
        <linearGradient id="lw-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <pattern id="lw-knurl" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 5L5 0M-1 1L1-1M4 6L6 4" stroke="#000" strokeOpacity="0.5" strokeWidth="0.9" />
          <path d="M0 0L5 5M4-1L6 1M-1 4L1 6" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="lw-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="lw-blur" x="-1" y="-1" width="3" height="3">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* platform */}
      <ellipse cx="500" cy="236" rx="470" ry="14" fill="url(#lw-floor)" className={`lw-shadow ${lifted ? "is-lifted" : ""}`} />
      <rect x="0" y="232" width="1000" height="18" rx="9" fill="#17171d" />
      <rect x="250" y="232" width="500" height="18" fill="#221d17" />
      <rect x="0" y="232" width="1000" height="1.5" fill="#fff" opacity="0.07" />

      <g className={`lw-bar ${lifted ? "is-lifted" : ""} ${failed ? "opacity-50" : ""}`}>
        <g ref={bar}>
          <rect x="190" y="120" width="620" height="10" rx="2" fill="url(#lw-steel)" />
          <rect x="250" y="120" width="200" height="10" fill="url(#lw-knurl)" />
          <rect x="550" y="120" width="200" height="10" fill="url(#lw-knurl)" />
          <rect x="490" y="120" width="20" height="10" fill="url(#lw-knurl)" opacity="0.6" />
          <rect x="18" y="113" width="160" height="24" rx="4" fill="url(#lw-steel)" />
          <rect x="822" y="113" width="160" height="24" rx="4" fill="url(#lw-steel)" />
          <rect x="176" y="104" width="14" height="42" rx="3" fill="url(#lw-steel)" />
          <rect x="810" y="104" width="14" height="42" rx="3" fill="url(#lw-steel)" />
          <rect x="14" y="116" width="6" height="18" rx="2" fill="#5b5b63" />
          <rect x="980" y="116" width="6" height="18" rx="2" fill="#5b5b63" />
          {PLATES.slice(0, loaded).map((p, i) => (
            <g key={`p${i}`}>
              <PlateRect p={p} side="l" />
              <PlateRect p={p} side="r" />
            </g>
          ))}
          {next && !failed && (
            <>
              <GhostPlate p={next} side="l" />
              <GhostPlate p={next} side="r" />
            </>
          )}
        </g>
      </g>

      {/* chalk where the newest pair landed */}
      {loaded > 0 && !lifted && (
        <g key={`c${loaded}`} fill="#fff" filter="url(#lw-blur)">
          <circle className="lw-chalk" cx={PLATES[loaded - 1].x + 4} cy="226" r="10" />
          <circle className="lw-chalk" cx={W - PLATES[loaded - 1].x - 4} cy="226" r="10" />
        </g>
      )}
    </svg>
  );
}
