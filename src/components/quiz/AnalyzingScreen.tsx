"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/content/types";

const STEPS = [
  "Cross-checking your answers against each other",
  "Scoring every stall pattern we know",
  "Ruling out what is NOT your problem",
  "Ordering your bottlenecks by impact",
  "Writing your report",
];

export function AnalyzingScreen({
  track,
  error,
  onRetry,
}: {
  track: Track | null;
  error: string | null;
  onRetry: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (error) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 520);
    return () => clearInterval(t);
  }, [error]);

  return (
    <div className="slab p-6 sm:p-10 animate-rise" aria-live="polite">
      <div className="eyebrow mb-3">{track === "strength" ? "Strength track" : "Physique track"}</div>
      <h2 className="display text-3xl sm:text-4xl">
        Decoding your <em>training</em>.
      </h2>

      {!error ? (
        <>
          <ul className="mt-7 space-y-3">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s} className="flex items-center gap-3 text-[0.95rem]">
                  <span
                    className={`grid place-items-center w-5 h-5 rounded-full border text-[10px] transition-colors ${
                      done
                        ? "bg-clear border-clear text-void"
                        : active
                          ? "border-signal text-signal animate-pulse-soft"
                          : "border-line-2 text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    {done ? "✓" : "•"}
                  </span>
                  <span className={done ? "text-ink-3 line-through decoration-ink-4" : active ? "text-ink" : "text-ink-3"}>
                    {s}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 space-y-3" aria-hidden="true">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </>
      ) : (
        <div className="mt-6">
          <p role="alert" className="text-alert">
            {error}
          </p>
          <button type="button" className="btn btn-primary mt-4" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
