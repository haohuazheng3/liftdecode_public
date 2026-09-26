"use client";

import type { AnswerOption } from "@/content/types";
import { useRovingRadio } from "./useRovingRadio";

/**
 * 2–4 short options as big pills. Selection shows instantly (local state in the
 * parent); the parent decides whether to auto-advance.
 */
export function ChoiceInput({
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

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="flex flex-col gap-2.5">
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
              "group flex w-full min-h-14 items-center gap-3 rounded-full border px-5 py-3 text-left",
              "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
              "transition-[scale,background-color,border-color,color] duration-100 ease-out active:scale-[0.97]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
              selected
                ? "border-signal bg-signal/[0.12] text-ink"
                : "border-line bg-white/[0.025] text-ink hover:border-line-2 hover:bg-white/[0.05]",
            ].join(" ")}
          >
            <span className="flex-1 min-w-0 text-[1.05rem] font-semibold leading-snug">{o.label}</span>
            <span
              aria-hidden="true"
              className={`grid size-6 flex-none place-items-center rounded-full border-[1.5px] transition-colors duration-100 ${
                selected ? "border-signal bg-signal" : "border-ink-4"
              }`}
            >
              <span className={`size-2 rounded-full ${selected ? "bg-[#14100a]" : "bg-transparent"}`} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** The first question: which kind of stall. Two big cards, a pictogram each. */
export function GoalInput({
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

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="grid grid-cols-2 gap-2.5 sm:gap-3">
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
              "flex min-h-44 sm:min-h-52 flex-col items-center justify-center gap-4 rounded-[22px] border px-3 py-5 text-center",
              "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
              "transition-[scale,background-color,border-color,color] duration-100 ease-out active:scale-[0.96]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
              selected
                ? "border-signal bg-signal/[0.1] text-ink"
                : "border-line bg-white/[0.025] text-ink-2 hover:border-line-2 hover:bg-white/[0.05] hover:text-ink",
            ].join(" ")}
          >
            <GoalPictogram kind={o.value} active={selected} />
            <span className="text-[1.05rem] sm:text-lg font-semibold leading-tight text-ink">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function GoalPictogram({ kind, active }: { kind: string; active: boolean }) {
  const accent = active ? "var(--color-signal)" : "currentColor";
  if (kind === "strength") {
    // a loaded barbell: competition bumper plates, knurled grip
    return (
      <svg viewBox="0 0 96 64" className="h-16 w-24 sm:h-20 sm:w-28" aria-hidden="true">
        <line x1="4" y1="32" x2="92" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        {[40, 43, 46, 49, 52, 55].map((x) => (
          <line key={x} x1={x} y1="29.5" x2={x} y2="34.5" stroke={accent} strokeWidth="1.2" opacity="0.8" />
        ))}
        {/* left side */}
        <rect x="11" y="12" width="7" height="40" rx="2" fill="#D8403A" opacity={active ? 1 : 0.75} />
        <rect x="19" y="17" width="5" height="30" rx="1.5" fill="#2E6BD6" opacity={active ? 1 : 0.75} />
        <rect x="25" y="27" width="3" height="10" rx="1" fill="#EDEDED" opacity={active ? 1 : 0.6} />
        {/* right side */}
        <rect x="78" y="12" width="7" height="40" rx="2" fill="#D8403A" opacity={active ? 1 : 0.75} />
        <rect x="72" y="17" width="5" height="30" rx="1.5" fill="#2E6BD6" opacity={active ? 1 : 0.75} />
        <rect x="68" y="27" width="3" height="10" rx="1" fill="#EDEDED" opacity={active ? 1 : 0.6} />
      </svg>
    );
  }
  // physique: a front double-biceps silhouette
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-16 w-16 sm:h-20 sm:w-20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="32" cy="11" r="5" />
      {/* V-taper torso */}
      <path d="M21 21 H43 L38.5 42 H25.5 Z" fill={active ? "var(--color-signal)" : "none"} fillOpacity={active ? 0.18 : 0} />
      {/* flexed arms */}
      <path d="M21 21 L11 24 Q7 18 11 10" />
      <path d="M43 21 L53 24 Q57 18 53 10" />
      <path d="M13.5 20.5 Q16 16 14 12.5" stroke={accent} strokeWidth="2" />
      <path d="M50.5 20.5 Q48 16 50 12.5" stroke={accent} strokeWidth="2" />
      {/* legs */}
      <path d="M27 42 L25 58" />
      <path d="M37 42 L39 58" />
    </svg>
  );
}
