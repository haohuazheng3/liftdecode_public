"use client";

import type { AnswerOption } from "@/content/types";

/**
 * Pick any of a short list of signs. One option is exclusive ("None of these"): choosing
 * it clears the others, and choosing anything else clears it. The parent shows "Next";
 * a multi never auto-advances.
 */
export function MultiInput({
  labelledBy,
  options,
  value,
  maxSelect,
  onChange,
}: {
  labelledBy: string;
  options: AnswerOption[];
  value: string[];
  maxSelect?: number;
  onChange: (value: string[]) => void;
}) {
  const toggle = (o: AnswerOption) => {
    const has = value.includes(o.value);
    if (o.exclusive) {
      onChange(has ? [] : [o.value]);
      return;
    }
    const without = value.filter((v) => v !== o.value && !options.find((x) => x.value === v)?.exclusive);
    if (has) return onChange(without);
    if (maxSelect && without.length >= maxSelect) return;
    onChange([...without, o.value]);
  };

  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-col gap-2.5">
      {options.map((o) => {
        const selected = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            onClick={() => toggle(o)}
            data-selected={selected ? "true" : "false"}
            className={[
              "group flex w-full min-h-14 items-center gap-3 rounded-full border px-5 py-3 text-left",
              "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
              "transition-[scale,background-color,border-color,color] duration-100 ease-out active:scale-[0.97]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
              selected
                ? "border-signal bg-signal/[0.12] text-ink"
                : "border-line bg-white/[0.025] text-ink hover:border-line-2 hover:bg-white/[0.05]",
              o.exclusive ? "text-ink-2" : "",
            ].join(" ")}
          >
            <span className="flex-1 min-w-0 text-[1.05rem] font-semibold leading-snug">{o.label}</span>
            <span
              aria-hidden="true"
              className={`grid size-6 flex-none place-items-center rounded-[7px] border-[1.5px] transition-colors duration-100 ${
                selected ? "border-signal bg-signal" : "border-ink-4"
              }`}
            >
              {selected && (
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="#14100a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3.2 3L13 4.5" />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
