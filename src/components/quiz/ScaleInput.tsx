"use client";

import type { CSSProperties } from "react";
import { useRovingRadio } from "./useRovingRadio";

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/** Intensity colour for n: quiet ink at 1, full amber signal at 10 (RPE-style ramp). */
function tone(n: number): string {
  const t = (n - 1) / 9;
  return `color-mix(in oklab, var(--color-signal) ${Math.round(t * 100)}%, var(--color-ink-3))`;
}
/** Fill when selected: never as dim as the text tone, so a picked "1" still reads as picked. */
function fill(n: number): string {
  const t = (n - 1) / 9;
  return `color-mix(in oklab, var(--color-signal) ${Math.round(35 + t * 65)}%, var(--color-ink-2))`;
}

/**
 * A 1–10 intensity pick: two rows of five on phones (each target stays ~60px wide at
 * 390px), one row of ten from `sm` up (~46px at 640px). Reading order stays 1→10. Tapping a number selects it instantly; the
 * numbers below it light up like a loading meter so the choice reads at a glance.
 */
export function ScaleInput({
  labelledBy,
  value,
  low,
  high,
  onSelect,
}: {
  labelledBy: string;
  value: string | undefined;
  low: string;
  high: string;
  onSelect: (value: string) => void;
}) {
  const picked = value ? Number(value) : 0;
  const { setRef, onKeyDown, tabIndexFor } = useRovingRadio(STEPS.length, picked - 1);

  return (
    <div>
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        onKeyDown={onKeyDown}
        className="grid w-full grid-cols-5 gap-2 sm:grid-cols-10"
      >
        {STEPS.map((n, i) => {
          const selected = picked === n;
          const lit = picked > 0 && n < picked;
          const style = {
            "--tone": tone(n),
            "--fill": fill(n),
          } as CSSProperties;
          const label = n === 1 && low ? `1, ${low}` : n === 10 && high ? `10, ${high}` : String(n);
          return (
            <button
              key={n}
              ref={setRef(i)}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              tabIndex={tabIndexFor(i)}
              onClick={() => onSelect(String(n))}
              style={style}
              data-selected={selected ? "true" : "false"}
              className={[
                "relative min-w-11 h-14 sm:h-16 rounded-[12px] sm:rounded-2xl border",
                "grid place-items-center select-none cursor-pointer",
                "font-display font-extrabold text-xl sm:text-2xl tabular-nums leading-none",
                "transition-[scale,translate,background-color,border-color,color,box-shadow] duration-100 ease-out",
                "active:scale-[0.92] [-webkit-tap-highlight-color:transparent]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                selected
                  ? "bg-(color:--fill) border-(color:--fill) text-[#14100a] shadow-[0_10px_28px_-10px_var(--fill)] -translate-y-0.5"
                  : lit
                    ? "bg-white/[0.06] border-(color:--tone)/40 text-(color:--tone)"
                    : "bg-white/[0.025] border-line text-(color:--tone) hover:bg-white/[0.06] hover:border-line-2",
              ].join(" ")}
            >
              <span aria-hidden="true">{n}</span>
              {/* intensity tick: grows with the number, like a rep meter */}
              <span
                aria-hidden="true"
                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[38%] rounded-full"
                style={{
                  height: `${2 + Math.round(((n - 1) / 9) * 3)}px`,
                  background: selected ? "rgba(20,16,10,0.45)" : "var(--tone)",
                  opacity: selected ? 1 : lit ? 0.9 : 0.35,
                }}
              />
            </button>
          );
        })}
      </div>
      <div
        className="mt-3 flex items-start justify-between gap-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-3"
        aria-hidden="true"
      >
        <span className="max-w-[45%] text-left">{low}</span>
        <span className="max-w-[45%] text-right">{high}</span>
      </div>
    </div>
  );
}
