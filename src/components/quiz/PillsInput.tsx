"use client";

import type { AnswerOption } from "@/content/types";
import { useRovingRadio } from "./useRovingRadio";

/**
 * One row of very short options (counts, gram bands, cups). Same radio semantics as the
 * big choice pills, just compact enough that a whole row fits on a phone. Wraps to a
 * second row only when it has to.
 */
export function PillsInput({
  labelledBy,
  options,
  value,
  onSelect,
}: {
  labelledBy: string;
  options: AnswerOption[];
  value: string | undefined;
  onSelect: (value: string) => void;
}) {
  const checked = options.findIndex((o) => o.value === value);
  const { setRef, onKeyDown, tabIndexFor } = useRovingRadio(options.length, checked);
  // equal-width cells that wrap without stretching the last row: the cell minimum follows the longest label
  const longest = Math.max(...options.map((o) => o.label.length));
  const minRem = longest <= 2 ? 3.25 : longest <= 3 ? 3.6 : longest <= 5 ? 4.25 : 5.25;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minRem}rem, 1fr))` }}
    >
      {options.map((o, i) => {
        const selected = i === checked;
        return (
          <button
            key={o.value}
            ref={setRef(i)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={tabIndexFor(i)}
            onClick={() => onSelect(o.value)}
            data-selected={selected ? "true" : "false"}
            className={[
              "min-h-12 rounded-full border px-2 text-center",
              "font-display font-bold text-[1.05rem] tabular-nums leading-none whitespace-nowrap",
              "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
              "transition-[scale,background-color,border-color,color] duration-100 ease-out active:scale-[0.95]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
              selected
                ? "border-signal bg-signal text-[#14100a] shadow-[0_10px_28px_-10px_var(--color-signal)]"
                : "border-line bg-white/[0.025] text-ink hover:border-line-2 hover:bg-white/[0.06]",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
