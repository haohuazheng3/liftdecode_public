"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * A two-tap taste of the quiz: one 1–10 intensity question, one short pick.
 * Pure local state — the tap lights up instantly, then the next card slides in.
 * Nothing is stored or sent anywhere.
 */

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SLEEP = ["Badly", "It varies", "Solid"];
const ADVANCE_MS = 280;

export function IntensityPreview() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [effort, setEffort] = useState<number | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Each step unmounts the button that was just pressed; move focus to the new step's
  // heading so keyboard and screen-reader users keep their place (skip the first render).
  const headingRef = useRef<HTMLParagraphElement>(null);
  // Compare against the last step rather than a "mounted" flag, so StrictMode's double
  // effect run on mount never steals focus on page load.
  const shownStep = useRef(step);

  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function advance(next: 1 | 2) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStep(next), ADVANCE_MS);
  }

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setEffort(null);
    setSleep(null);
    setStep(0);
  }

  return (
    <div className="slab chalk overflow-hidden">
      <div className="knurl h-2 w-full" aria-hidden="true" />
      <div className="p-5 sm:p-8 min-h-[292px] sm:min-h-[260px]">
        {step === 0 && (
          <div key="q1" className="animate-rise">
            <div className="eyebrow mb-3">Try it</div>
            <p
              ref={headingRef}
              tabIndex={-1}
              className="display text-[1.9rem] leading-[1.02] sm:text-[2.4rem] outline-none"
              id="demo-q1"
            >
              How close to failure do your hard sets end?
            </p>
            <div className="mt-5 grid grid-cols-5 sm:grid-cols-10 gap-2" role="group" aria-labelledby="demo-q1">
              {SCALE.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="rpe-btn"
                  aria-pressed={effort === n}
                  onClick={() => {
                    setEffort(n);
                    advance(1);
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-2.5 flex justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
              <span>Plenty left</span>
              <span>Nothing left</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div key="q2" className="animate-rise">
            <div className="eyebrow mb-3">Next</div>
            <p
              ref={headingRef}
              tabIndex={-1}
              className="display text-[1.9rem] leading-[1.02] sm:text-[2.4rem] outline-none"
              id="demo-q2"
            >
              How do you usually sleep?
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2" role="group" aria-labelledby="demo-q2">
              {SLEEP.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="option justify-center text-center font-semibold min-h-[56px] items-center"
                  data-selected={sleep === s}
                  aria-pressed={sleep === s}
                  onClick={() => {
                    setSleep(s);
                    advance(2);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div key="done" className="animate-rise">
            <div className="eyebrow mb-3 text-clear">That&rsquo;s the rhythm</div>
            <p ref={headingRef} tabIndex={-1} className="display display-caps text-[2.4rem] sm:text-[3.2rem] outline-none">
              Tap. Next. <em>Done.</em>
            </p>
            <p className="mt-3 text-ink-2 leading-relaxed max-w-md">
              The real diagnosis feels exactly like this. No numbers to look up, nothing to type.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/diagnose" className="btn btn-primary w-full sm:w-auto" prefetch>
                Start the diagnosis
                <span aria-hidden="true">→</span>
              </Link>
              <button type="button" className="btn btn-quiet w-full sm:w-auto" onClick={reset}>
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
