"use client";

import { useState } from "react";

/**
 * A slow marquee of the real, everyday reasons training stalls — stencil caps,
 * like the lettering on a gym wall. Two identical runs; the track slides by one.
 * The first run is the accessible list; the duplicate is hidden from assistive tech.
 * A real Pause/Play toggle (not just hover) so touch and keyboard users can stop it
 * (WCAG 2.2.2); keyboard focus inside the ticker also pauses it.
 */
const CAUSES = [
  "Sets stop miles from failure",
  "Same weight since spring",
  "Protein only at dinner",
  "Five hours of sleep",
  "A new programme every month",
  "Cardio eating your recovery",
  "No deload in a year",
  "Work stress, every day",
  "Cutting while trying to grow",
  "Half reps on heavy days",
  "Weekend drinking",
  "Legs trained last, if at all",
];

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {CAUSES.map((c) => (
        <li key={c} className="flex items-center">
          <span className="font-stencil uppercase text-[1.45rem] sm:text-[1.9rem] leading-none tracking-[0.04em] text-ink whitespace-nowrap px-5 sm:px-7">
            {c}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 text-signal">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export function StallTicker() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-labelledby="stall-title" className="slab overflow-hidden">
      <div className="knurl h-2 w-full" aria-hidden="true" />
      <div className="flex items-center justify-between gap-3 pl-5 pr-2 sm:pl-7 sm:pr-4 pt-2">
        <h2 id="stall-title" className="eyebrow">
          How training actually stalls
        </h2>
        <button
          type="button"
          className="btn btn-quiet btn-sm !p-0 w-11 h-11 shrink-0"
          aria-pressed={paused}
          aria-label="Pause ticker"
          onClick={() => setPaused((p) => !p)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
            {paused ? (
              <path d="M4 2.5v11l9.5-5.5z" />
            ) : (
              <>
                <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
                <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
              </>
            )}
          </svg>
        </button>
      </div>
      <div className="marquee overflow-hidden pb-4 pt-2 sm:pb-5 sm:pt-3" data-paused={paused ? "true" : "false"}>
        <div className="marquee-track">
          <Run />
          <Run hidden />
        </div>
      </div>
      <div className="knurl h-2 w-full" aria-hidden="true" />
    </section>
  );
}
