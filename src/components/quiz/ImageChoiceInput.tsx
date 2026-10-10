"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { AnswerOption } from "@/content/types";
import { useRovingRadio } from "./useRovingRadio";

/** Pixel size of the files in public/body-types: all six are fitted onto one 900×1200 canvas, never cropped. */
const PHOTO = { w: 900, h: 1200 };

type Row = { key: string; label?: string };
type Card = { row: Row; o: AnswerOption };

/**
 * Photo cards (the body-type question). Each option carries an annotated reference photo per
 * sex; when the lifter's sex is known the matching photos show, otherwise both rows do. The
 * photos carry their explanation (frame markers, measurement bars, wrist test) inside the
 * image, so cards stack one per row on phones and open in a lightbox for a closer look.
 * Tapping a card answers, like any single choice.
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
  const rows: Row[] =
    sex === "male" || sex === "female" ? [{ key: sex }] : [{ key: "male", label: "Men" }, { key: "female", label: "Women" }];
  const cards: Card[] = rows.flatMap((row) => options.map((o) => ({ row, o })));
  const checked = cards.findIndex((c) => c.o.value === value);
  const { setRef, onKeyDown, tabIndexFor } = useRovingRadio(cards.length, checked);
  const [zoom, setZoom] = useState<Card | null>(null);

  return (
    <>
      <div role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="space-y-4">
        {rows.map((row) => (
          <div key={row.key}>
            {row.label && <div className="eyebrow mb-2">{row.label}</div>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {options.map((o) => {
                const i = cards.findIndex((c) => c.row.key === row.key && c.o.value === o.value);
                const selected = o.value === value;
                const src = o.images?.[row.key];
                return (
                  <div key={`${row.key}-${o.value}`} className="relative">
                    <button
                      ref={setRef(i)}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={`${o.label}: ${o.caption ?? ""}`}
                      tabIndex={tabIndexFor(i)}
                      onClick={() => onSelect(o.value)}
                      data-selected={selected ? "true" : "false"}
                      className={[
                        "group flex w-full flex-col overflow-hidden rounded-[18px] border text-left",
                        "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
                        "transition-[scale,background-color,border-color,box-shadow] duration-100 ease-out active:scale-[0.97]",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                        selected
                          ? "border-signal bg-signal/[0.1] shadow-[0_14px_36px_-16px_var(--color-signal)]"
                          : "border-line bg-white/[0.025] hover:border-line-2 hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <div className="relative w-full bg-black/30" style={{ aspectRatio: `${PHOTO.w} / ${PHOTO.h}` }}>
                        {src && (
                          <Image
                            src={src}
                            alt=""
                            fill
                            loading="eager"
                            sizes="(min-width: 640px) 200px, 92vw"
                            className={`object-cover transition-opacity duration-150 ${selected ? "opacity-100" : "opacity-90 group-hover:opacity-100"}`}
                          />
                        )}
                        {selected && (
                          <span
                            aria-hidden="true"
                            className="absolute left-2 top-2 grid size-6 place-items-center rounded-full bg-signal text-[#14100a]"
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
                    {src && (
                      // A sibling, not a child, of the radio button: buttons cannot nest. 48px hit area, 36px visual,
                      // top-right: the photos keep that corner empty (their first callout sits top-left).
                      <button
                        type="button"
                        aria-label={`Enlarge the ${o.label} photo`}
                        onClick={() => setZoom({ row, o })}
                        className="absolute right-0 top-0 grid size-12 place-items-center rounded-full text-ink transition-transform duration-100 ease-out active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-signal"
                      >
                        <span className="grid size-9 place-items-center rounded-full border border-white/15 bg-black/60 backdrop-blur-sm">
                          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="8.5" cy="8.5" r="5.5" />
                            <path d="M13 13l4 4M8.5 6v5M6 8.5h5" />
                          </svg>
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Lightbox card={zoom} onClose={() => setZoom(null)} />
    </>
  );
}

/** Native <dialog> so Esc, focus trapping and the backdrop come for free. */
function Lightbox({ card, onClose }: { card: Card | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (card && !d.open) d.showModal();
    if (!card && d.open) d.close();
  }, [card]);

  useEffect(() => {
    if (!card) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [card]);

  const src = card?.o.images?.[card.row.key];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={card ? `${card.o.label} reference photo` : undefined}
      className="m-auto max-h-none max-w-none border-0 bg-transparent p-3 text-ink backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {card && src && (
        <div className="slab overflow-hidden" style={{ width: "min(92vw, 34rem)" }}>
          <div className="bg-black/30">
            <Image
              src={src}
              alt={`${card.o.label}: ${card.o.caption ?? ""}`}
              width={PHOTO.w}
              height={PHOTO.h}
              sizes="(min-width: 640px) 544px, 92vw"
              className="mx-auto h-auto w-auto max-h-[72vh] max-w-full"
            />
          </div>
          <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
            <div className="min-w-0">
              <div className="font-semibold text-ink">{card.o.label}</div>
              {card.o.caption && <div className="mt-1 text-sm leading-snug text-ink-3">{card.o.caption}</div>}
            </div>
            <button type="button" onClick={onClose} className="btn btn-quiet btn-sm shrink-0">
              Close
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
