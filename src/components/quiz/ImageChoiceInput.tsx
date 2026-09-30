"use client";

import Image from "next/image";
import type { AnswerOption } from "@/content/types";
import { useRovingRadio } from "./useRovingRadio";

/**
 * Photo cards (the body-type question). Each option carries a photo per sex; when the
 * lifter's sex is known the matching photos show, otherwise both rows do. Tapping a card
 * answers, like any single choice.
 */
export function ImageChoiceInput({
  labelledBy,
  options,
  value,
  sex,
  onSelect,
}: {
  labelledBy: string;
  options: AnswerOption[];
  value: string | undefined;
  sex: string | undefined;
  onSelect: (value: string) => void;
}) {
  const rows: { key: string; label?: string }[] =
    sex === "male" || sex === "female" ? [{ key: sex }] : [{ key: "male", label: "Men" }, { key: "female", label: "Women" }];
  const cards = rows.flatMap((row) => options.map((o) => ({ row, o })));
  const checked = cards.findIndex((c) => c.o.value === value);
  const { setRef, onKeyDown, tabIndexFor } = useRovingRadio(cards.length, checked);

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="space-y-4">
      {rows.map((row) => (
        <div key={row.key}>
          {row.label && <div className="eyebrow mb-2">{row.label}</div>}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {options.map((o) => {
              const i = cards.findIndex((c) => c.row.key === row.key && c.o.value === o.value);
              const selected = o.value === value;
              const src = o.images?.[row.key];
              return (
                <button
                  key={`${row.key}-${o.value}`}
                  ref={setRef(i)}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${o.label}: ${o.caption ?? ""}`}
                  tabIndex={tabIndexFor(i)}
                  onClick={() => onSelect(o.value)}
                  data-selected={selected ? "true" : "false"}
                  className={[
                    "group flex flex-col overflow-hidden rounded-[18px] border text-left",
                    "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
                    "transition-[scale,background-color,border-color,box-shadow] duration-100 ease-out active:scale-[0.97]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                    selected
                      ? "border-signal bg-signal/[0.1] shadow-[0_14px_36px_-16px_var(--color-signal)]"
                      : "border-line bg-white/[0.025] hover:border-line-2 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <div className="relative aspect-[3/4] w-full bg-black/30">
                    {src && (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 200px, 30vw"
                        className={`object-cover transition-opacity duration-150 ${selected ? "opacity-100" : "opacity-90 group-hover:opacity-100"}`}
                      />
                    )}
                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-signal text-[#14100a]"
                      >
                        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="px-2.5 py-2.5 sm:px-3">
                    <div className="text-[0.88rem] sm:text-base font-semibold leading-tight text-ink">{o.label}</div>
                    {o.caption && <div className="mt-1 text-[0.72rem] sm:text-xs leading-snug text-ink-3">{o.caption}</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
