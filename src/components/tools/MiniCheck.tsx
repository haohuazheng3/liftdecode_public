"use client";

import { useEffect, useId } from "react";
import { track } from "@/components/Analytics";
import { TrackedCta } from "@/components/cta/TrackedCta";
import { CalcShell, ResultHint, ResultPanel, useStoredState } from "./shared";

/**
 * A short, honest screen that points at the most likely cause and hands over to the real diagnosis.
 * Every option adds points to one or more causes; the highest total (at or above `threshold`) is named.
 * It is a teaser of the full diagnosis, never a substitute: the result says so.
 */
export interface MiniOption {
  label: string;
  add?: Record<string, number>;
}
export interface MiniQuestion {
  id: string;
  prompt: string;
  options: readonly MiniOption[];
}
export interface MiniCause {
  title: string;
  body: string;
  /** a red flag that should send someone to a clinician, not the quiz */
  urgent?: boolean;
}
export interface MiniCheckConfig {
  id: string;
  eyebrow: string;
  questions: readonly MiniQuestion[];
  causes: Record<string, MiniCause>;
  /** shown when no cause reaches the threshold */
  clear: { title: string; body: string };
  threshold?: number;
  cta: string;
}

type Answers = Record<string, string>;
const defaultsById = new Map<string, Answers>();
function defaultsFor(cfg: MiniCheckConfig): Answers {
  let d = defaultsById.get(cfg.id);
  if (!d) {
    d = Object.fromEntries(cfg.questions.map((q) => [q.id, ""]));
    defaultsById.set(cfg.id, d);
  }
  return d;
}

function score(cfg: MiniCheckConfig, answers: Answers) {
  const totals: Record<string, number> = {};
  for (const q of cfg.questions) {
    const i = Number(answers[q.id]);
    const opt = answers[q.id] === "" || !Number.isInteger(i) ? undefined : q.options[i];
    for (const [k, v] of Object.entries(opt?.add ?? {})) totals[k] = (totals[k] ?? 0) + v;
  }
  const ranked = Object.entries(totals)
    .filter(([k]) => cfg.causes[k])
    .sort((a, b) => b[1] - a[1]);
  return ranked;
}

export function MiniCheck({ config }: { config: MiniCheckConfig }) {
  const [answers, set] = useStoredState(`ld_mini_${config.id}_v1`, defaultsFor(config));
  const baseId = useId();
  const done = config.questions.every((q) => answers[q.id] !== "");
  const ranked = done ? score(config, answers) : [];
  const threshold = config.threshold ?? 2;
  const top = ranked[0] && ranked[0][1] >= threshold ? ranked[0] : null;
  const runner = top && ranked[1] && ranked[1][1] >= threshold && ranked[1][1] >= top[1] - 1 ? ranked[1] : null;
  const urgent = ranked.find(([k, v]) => config.causes[k]?.urgent && v >= threshold);
  const shown = urgent ?? top;
  const resultKey = done ? (shown ? shown[0] : "clear") : null;

  useEffect(() => {
    if (!resultKey) return;
    const t = window.setTimeout(() => track("tool_result", { tool: config.id, result: resultKey }), 800);
    return () => window.clearTimeout(t);
  }, [config.id, resultKey]);

  return (
    <CalcShell label={config.eyebrow} eyebrow={config.eyebrow}>
      <div className="space-y-5">
        {config.questions.map((q, qi) => {
          const legendId = `${baseId}-${q.id}`;
          return (
            <fieldset key={q.id} className="min-w-0">
              <legend id={legendId} className="mb-2 text-[0.98rem] font-semibold leading-snug text-ink">
                {q.prompt}
              </legend>
              <div role="radiogroup" aria-labelledby={legendId} className="flex flex-wrap gap-2">
                {q.options.map((o, oi) => {
                  const selected = answers[q.id] === String(oi);
                  return (
                    <button
                      key={o.label}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        if (qi === 0 && Object.values(answers).every((v) => v === "")) track("tool_use", { tool: config.id });
                        set({ [q.id]: String(oi) });
                      }}
                      className={[
                        "min-h-11 rounded-2xl border px-3.5 py-2 text-left text-[0.92rem] font-medium leading-snug",
                        "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
                        "transition-[scale,background-color,color,border-color] duration-100 active:scale-[0.97]",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                        selected
                          ? "border-signal bg-signal text-[#14100a]"
                          : "border-line bg-white/[0.02] text-ink-2 hover:border-line-2 hover:text-ink",
                      ].join(" ")}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <ResultPanel label="Quick check result">
        {!done ? (
          <ResultHint>Tap an answer on each line. Your most likely cause shows up here.</ResultHint>
        ) : (
          <div>
            <div className="eyebrow">{shown ? (urgent ? "Check this first" : "Most likely") : "Nothing stands out"}</div>
            <h3 className="display mt-1.5 text-3xl leading-[1.02] sm:text-4xl">
              {shown ? config.causes[shown[0]].title : config.clear.title}
            </h3>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">
              {shown ? config.causes[shown[0]].body : config.clear.body}
            </p>
            {runner && !urgent && (
              <p className="mt-3 text-sm leading-relaxed text-ink-3">
                Close behind: <span className="text-ink-2">{config.causes[runner[0]].title.toLowerCase()}</span>.
              </p>
            )}
            <div className="hairline mt-5" aria-hidden="true" />
            <p className="mt-4 text-sm leading-relaxed text-ink-3">
              This quick check reads a few signals. The full diagnosis reads how you train, eat, sleep and recover together,
              ranks every bottleneck and tells you what is not your problem.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TrackedCta place="tool" detail={`${config.id}:${resultKey}`} className="btn btn-primary">
                {config.cta}
              </TrackedCta>
              <button
                type="button"
                className="btn btn-quiet btn-sm"
                onClick={() => set(Object.fromEntries(config.questions.map((q) => [q.id, ""])))}
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </ResultPanel>
    </CalcShell>
  );
}
