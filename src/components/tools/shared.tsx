"use client";

import Link from "next/link";
import { useCallback, useId, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import {
  cmToFtIn,
  convertWeightInput,
  formatNumber,
  ftInToCm,
  parseNumber,
  roundTo,
  type WeightUnit,
} from "@/lib/tools/units";

/* ================================================================== */
/* Remembered inputs                                                    */
/* ================================================================== */

/*
 * Each calculator keeps its last inputs in localStorage. The server (and the hydration pass)
 * render the defaults; the browser then swaps in what was saved — useSyncExternalStore does
 * that without a hydration mismatch. Every storage access is wrapped: private windows and
 * blocked storage fall back to memory for the session.
 */

type Stored = Record<string, unknown>;

const memory = new Map<string, Stored>();
const listeners = new Map<string, Set<() => void>>();

/** Keep only saved fields whose type matches the default, so a stale or edited entry can never break a page. */
function mergeSaved<T extends Stored>(defaults: T, saved: unknown): T {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaults;
  const out: Stored = { ...defaults };
  for (const [k, d] of Object.entries(defaults)) {
    const v = (saved as Stored)[k];
    if (Array.isArray(d)) {
      if (Array.isArray(v) && v.every((x) => typeof x === (d.length ? typeof d[0] : typeof x))) out[k] = v;
    } else if (v !== null && v !== undefined && typeof v === typeof d) {
      out[k] = typeof v === "string" ? v.slice(0, 24) : v;
    }
  }
  return out as T;
}

function readSaved(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch (e) {
    console.warn(`[tools] could not read saved inputs (${key})`, e);
    return null;
  }
}

/** Keys whose save already failed once: blocked storage fails on every keystroke, one warning is enough. */
const saveFailed = new Set<string>();

function writeSaved(key: string, value: Stored) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (saveFailed.has(key)) return;
    saveFailed.add(key);
    console.warn(`[tools] could not save inputs (${key}); keeping them in memory for this visit`, e);
  }
}

/**
 * State that survives a reload. `defaults` and `sanitize` must be module-level constants
 * (stable references), otherwise React re-subscribes on every render.
 */
export function useStoredState<T extends Stored>(key: string, defaults: T, sanitize?: (v: T) => T) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const set = listeners.get(key) ?? new Set<() => void>();
      listeners.set(key, set);
      set.add(onChange);
      return () => {
        set.delete(onChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): T => {
    let current = memory.get(key) as T | undefined;
    if (!current) {
      const merged = mergeSaved(defaults, readSaved(key));
      current = sanitize ? sanitize(merged) : merged;
      memory.set(key, current);
    }
    return current;
  }, [key, defaults, sanitize]);

  const getServerSnapshot = useCallback(() => defaults, [defaults]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback(
    (patch: Partial<T> | ((prev: T) => Partial<T>)) => {
      const prev = getSnapshot();
      const next = { ...prev, ...(typeof patch === "function" ? patch(prev) : patch) } as T;
      memory.set(key, next);
      writeSaved(key, next);
      listeners.get(key)?.forEach((l) => l());
    },
    [key, getSnapshot],
  );

  return [state, update] as const;
}

/** Narrow a stored string to one of the allowed values. */
export function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/* ================================================================== */
/* Units                                                                */
/* ================================================================== */

/** "us" = lb + ft/in (the default), "metric" = kg + cm. */
export type UnitSystem = "us" | "metric";
export const UNIT_SYSTEMS = ["us", "metric"] as const;

export function weightUnitOf(system: UnitSystem): WeightUnit {
  return system === "metric" ? "kg" : "lb";
}

/** Convert the typed weight strings in `fields` when the unit system flips. */
export function convertWeightFields<T extends Stored>(state: T, fields: (keyof T)[], to: UnitSystem): Partial<T> {
  const from = weightUnitOf(state.units === "metric" ? "metric" : "us");
  const target = weightUnitOf(to);
  const patch: Stored = {};
  for (const f of fields) {
    const v = state[f];
    if (typeof v === "string") patch[f as string] = convertWeightInput(v, from, target, 1);
  }
  return patch as Partial<T>;
}

/** Height held as three strings (ft, in, cm) so a half-typed value is never rewritten. */
export interface HeightFields {
  ft: string;
  inch: string;
  cm: string;
}

/** Height in cm from whichever fields the current system uses; null when incomplete. */
export function heightCmOf(system: UnitSystem, h: HeightFields): number | null {
  if (system === "metric") return parseNumber(h.cm);
  const ft = parseNumber(h.ft);
  const inch = parseNumber(h.inch) ?? 0;
  if (ft === null) return null;
  return ftInToCm(ft, inch);
}

/** Rewrite the height fields for the other system (only when the current ones parse). */
export function convertHeightFields(from: UnitSystem, to: UnitSystem, h: HeightFields): Partial<HeightFields> {
  if (from === to) return {};
  const cm = heightCmOf(from, h);
  if (cm === null) return {};
  if (to === "metric") return { cm: String(Math.round(cm)) };
  const { ft, in: inch } = cmToFtIn(cm);
  return { ft: String(ft), inch: String(inch) };
}

/* ================================================================== */
/* Formatting                                                           */
/* ================================================================== */

/** Display a number; `fixed` keeps trailing zeros (FFMI 22.0, DOTS 400.00) where the decimals carry meaning. */
export function fmt(value: number, decimals = 1, fixed = false): string {
  return formatNumber(roundTo(value, decimals), decimals, fixed ? decimals : 0);
}

/** Calories to the nearest 10: anything finer is false precision. */
export function fmtKcal(value: number): string {
  return formatNumber(Math.round(value / 10) * 10, 0);
}

/* ================================================================== */
/* Layout                                                               */
/* ================================================================== */

/** The calculator slab: a knurled strip, a title row with the unit toggle, then the fields. */
export function CalcShell({
  label,
  eyebrow,
  toggle,
  children,
}: {
  label: string;
  eyebrow: string;
  toggle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-label={label} className="slab chalk relative overflow-hidden">
      <div className="knurl h-1.5 w-full" aria-hidden="true" />
      <div className="p-4 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="eyebrow">{eyebrow}</div>
          {toggle}
        </div>
        <div className="mt-4 sm:mt-5">{children}</div>
      </div>
    </section>
  );
}

/** Two columns of fields from `sm` up, one column on phones. */
export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

/** Result area: the inset panel, announced politely to screen readers as it changes. */
export function ResultPanel({ children, label = "Result" }: { children: ReactNode; label?: string }) {
  return (
    <div className="slab-inset mt-5 min-w-0 p-4 sm:mt-6 sm:p-6" aria-live="polite" role="region" aria-label={label}>
      {children}
    </div>
  );
}

/** Calm placeholder when inputs are missing or out of range — never NaN. */
export function ResultHint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-1.5 size-2 flex-none rounded-full bg-signal/70 animate-pulse-soft" aria-hidden="true" />
      <p className="text-[0.98rem] leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

export function BigStat({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="eyebrow">{label}</div>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
        <span
          className={`display leading-[0.95] font-black tabular-nums ${
            value.length > 7 ? "text-[2.6rem] sm:text-[3.2rem]" : "text-[3.2rem] sm:text-6xl"
          }`}
        >
          {value}
        </span>
        {unit && <span className="font-mono text-sm uppercase tracking-[0.12em] text-ink-3">{unit}</span>}
      </div>
      {sub && <div className="mt-2 text-sm leading-relaxed text-ink-2">{sub}</div>}
    </div>
  );
}

/** Small labelled number, for the row of secondary results. */
export function MiniStat({ label, value, unit, note }: { label: string; value: string; unit?: string; note?: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white/[0.02] px-3.5 py-3">
      <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="display text-2xl font-extrabold tabular-nums sm:text-[1.7rem]">{value}</span>
        {unit && <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-3">{unit}</span>}
      </div>
      {note && <div className="mt-1 text-xs leading-snug text-ink-3">{note}</div>}
    </div>
  );
}

export function MiniStats({ children }: { children: ReactNode }) {
  return <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">{children}</div>;
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <div className="eyebrow mt-6 mb-2.5">{children}</div>;
}

/** Amber-edged caution line (e.g. "above 10 reps"). */
export function Caution({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 flex gap-2.5 rounded-2xl border border-signal/30 bg-signal/[0.06] px-3.5 py-2.5 text-sm leading-relaxed text-ink-2">
      <span aria-hidden="true" className="mt-0.5 font-mono text-signal">!</span>
      <span>{children}</span>
    </p>
  );
}

/** Plain note under a table or result. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed text-ink-3">{children}</p>;
}

/* ---------- tables ---------- */

export function DataTable({
  caption,
  head,
  rows,
  highlightRow,
  align = [],
}: {
  caption?: string;
  head: ReactNode[];
  rows: ReactNode[][];
  highlightRow?: number;
  /** per-column alignment; numbers default to right */
  align?: ("left" | "right")[];
}) {
  return (
    <table className="w-full border-collapse text-[0.95rem]">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>
          {head.map((h, i) => (
            <th
              key={i}
              scope="col"
              className={`border-b border-line-2 px-2.5 py-2 font-mono text-[0.68rem] font-normal uppercase tracking-[0.12em] text-ink-3 first:pl-0 last:pr-0 ${
                (align[i] ?? (i === 0 ? "left" : "right")) === "right" ? "text-right" : "text-left"
              }`}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} className={ri === highlightRow ? "bg-signal/[0.08]" : undefined}>
            {r.map((c, ci) => {
              const right = (align[ci] ?? (ci === 0 ? "left" : "right")) === "right";
              const Cell = ci === 0 ? "th" : "td";
              return (
                <Cell
                  key={ci}
                  scope={ci === 0 ? "row" : undefined}
                  className={`border-b border-line px-2.5 py-2.5 font-normal tabular-nums first:pl-0 last:pr-0 ${
                    right ? "text-right" : "text-left"
                  } ${ci === 0 ? "text-ink" : "text-ink-2"} ${ri === highlightRow ? "text-ink" : ""}`}
                >
                  {c}
                </Cell>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Progress toward a target, e.g. a bench milestone. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const done = pct >= 100;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${done ? "bg-clear" : "bg-signal"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------- sources + the one next step ---------- */

export interface SourceRef {
  label: string;
  href: string;
}

export function Sources({ items, lead = "Sources" }: { items: SourceRef[]; lead?: string }) {
  return (
    <p className="mt-5 text-xs leading-relaxed text-ink-3">
      <span className="font-mono uppercase tracking-[0.12em]">{lead}: </span>
      {items.map((s, i) => (
        <span key={s.href}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ink-4 underline-offset-2 hover:text-ink-2 hover:decoration-ink-3"
          >
            {s.label}
          </a>
          {i < items.length - 1 ? "; " : "."}
        </span>
      ))}
    </p>
  );
}

/** Ends every result panel: numbers describe a stall, the diagnosis explains it. */
export function DiagnoseLink() {
  return (
    <>
      <div className="hairline mt-6" aria-hidden="true" />
      <Link
        href="/diagnose"
        className="group mt-2 -mb-2 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-signal transition-colors hover:text-signal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        Numbers not moving for weeks? Find out why
        <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </>
  );
}

/* ================================================================== */
/* Inputs                                                               */
/* ================================================================== */

const clean = (raw: string, integer: boolean) =>
  (integer ? raw.replace(/[^\d]/g, "") : raw.replace(/[^\d.,]/g, "")).slice(0, 7);

export function NumberField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
  invalid = false,
  integer = false,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  placeholder?: string;
  hint?: ReactNode;
  invalid?: boolean;
  integer?: boolean;
  optional?: boolean;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-2">
        {label}
        {optional && <span className="font-normal text-ink-3"> (optional)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={integer ? "numeric" : "decimal"}
          autoComplete="off"
          enterKeyHint="done"
          spellCheck={false}
          className={`input text-lg tabular-nums ${unit ? "pr-14" : ""}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(clean(e.target.value, integer))}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={hint ? hintId : undefined}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className={`mt-1.5 text-xs leading-relaxed ${invalid ? "text-alert" : "text-ink-3"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

/** Whole-number field with − / + buttons: one tap per rep, no keyboard needed. */
export function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  hint,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  unit?: string;
  hint?: ReactNode;
  invalid?: boolean;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const n = parseNumber(value);
  const step = (d: number) => {
    const base = n === null ? (d > 0 ? min - 1 : max + 1) : Math.round(n);
    onChange(String(Math.min(max, Math.max(min, base + d))));
  };
  const btn =
    "grid size-12 flex-none place-items-center rounded-2xl border border-line-2 bg-white/[0.04] text-xl text-ink transition-[scale,background-color] duration-100 hover:bg-white/[0.08] active:scale-[0.94] disabled:opacity-40 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => step(-1)}
          disabled={n !== null && n <= min}
          aria-label={`${label}: one less`}
        >
          <span aria-hidden="true">−</span>
        </button>
        <div className="relative min-w-0 flex-1">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="done"
            className={`input text-center text-lg tabular-nums ${unit ? "pr-12" : ""}`}
            value={value}
            onChange={(e) => onChange(clean(e.target.value, true))}
            aria-invalid={invalid ? "true" : undefined}
            aria-describedby={hint ? hintId : undefined}
          />
          {unit && (
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
              {unit}
            </span>
          )}
        </div>
        <button
          type="button"
          className={btn}
          onClick={() => step(1)}
          disabled={n !== null && n >= max}
          aria-label={`${label}: one more`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      {hint && (
        <p id={hintId} className={`mt-1.5 text-xs leading-relaxed ${invalid ? "text-alert" : "text-ink-3"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

/** Arrow keys move the choice inside a radiogroup (WAI-ARIA radio pattern). */
function onRadioKeys<T extends string>(e: KeyboardEvent<HTMLElement>, values: readonly T[], current: T, pick: (v: T) => void) {
  const i = values.indexOf(current);
  let next = -1;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % values.length;
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + values.length) % values.length;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = values.length - 1;
  if (next < 0) return;
  e.preventDefault();
  pick(values[next]);
  const radios = e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]');
  radios[next]?.focus();
}

export interface Option<T extends string> {
  value: T;
  label: string;
  /** Optional second line (ChoiceList only). */
  detail?: string;
}

/** Short options side by side: sex, experience, unit system, RPE. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel = false,
  columns,
}: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (v: T) => void;
  hideLabel?: boolean;
  /** force a grid (e.g. 4) instead of one flexible row */
  columns?: number;
}) {
  const id = useId();
  const values = options.map((o) => o.value);
  return (
    <div className="min-w-0">
      <div id={id} className={hideLabel ? "sr-only" : "mb-1.5 text-sm font-medium text-ink-2"}>
        {label}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={id}
        onKeyDown={(e) => onRadioKeys(e, values, value, onChange)}
        className={`gap-1 rounded-[20px] border border-line bg-black/25 p-1 ${columns ? "grid" : "flex"}`}
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={[
                "min-h-12 min-w-0 flex-1 rounded-2xl px-2.5 text-[0.92rem] font-semibold leading-tight",
                "cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
                "transition-[scale,background-color,color] duration-100 active:scale-[0.96]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                selected ? "bg-signal text-[#14100a] shadow-[0_8px_24px_-12px_var(--color-signal)]" : "text-ink-2 hover:bg-white/[0.05] hover:text-ink",
              ].join(" ")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Longer options stacked as rows (activity level, goal). */
export function ChoiceList<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (v: T) => void;
}) {
  const id = useId();
  const values = options.map((o) => o.value);
  return (
    <div className="min-w-0">
      <div id={id} className="mb-1.5 text-sm font-medium text-ink-2">
        {label}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={id}
        onKeyDown={(e) => onRadioKeys(e, values, value, onChange)}
        className="flex flex-col gap-2"
      >
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(o.value)}
              data-selected={selected ? "true" : "false"}
              className="option min-h-12 items-center py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              <span className="option-dot" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.98rem] font-semibold leading-snug">{o.label}</span>
                {o.detail && <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink-3">{o.detail}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** lb ↔ kg (and ft/in ↔ cm when the calculator asks for height). */
export function UnitToggle({
  value,
  onChange,
  withHeight = false,
}: {
  value: UnitSystem;
  onChange: (v: UnitSystem) => void;
  withHeight?: boolean;
}) {
  return (
    <div className={withHeight ? "w-[10.5rem] sm:w-48" : "w-32 sm:w-40"}>
      <Segmented
        label="Units"
        hideLabel
        value={value}
        onChange={onChange}
        options={[
          { value: "us", label: withHeight ? "lb · ft" : "lb" },
          { value: "metric", label: withHeight ? "kg · cm" : "kg" },
        ]}
      />
    </div>
  );
}

/** Height as ft + in (US) or cm (metric). */
export function HeightField({
  system,
  value,
  onChange,
  hint,
  invalid = false,
}: {
  system: UnitSystem;
  value: HeightFields;
  onChange: (patch: Partial<HeightFields>) => void;
  hint?: ReactNode;
  invalid?: boolean;
}) {
  if (system === "metric") {
    return (
      <NumberField
        label="Height"
        unit="cm"
        value={value.cm}
        onChange={(cm) => onChange({ cm })}
        placeholder="178"
        hint={hint}
        invalid={invalid}
      />
    );
  }
  return (
    <HeightImperial value={value} onChange={onChange} hint={hint} invalid={invalid} />
  );
}

function HeightImperial({
  value,
  onChange,
  hint,
  invalid,
}: {
  value: HeightFields;
  onChange: (patch: Partial<HeightFields>) => void;
  hint?: ReactNode;
  invalid: boolean;
}) {
  const id = useId();
  return (
    <fieldset className="min-w-0" aria-describedby={hint ? `${id}-hint` : undefined}>
      <legend className="mb-1.5 block text-sm font-medium text-ink-2">Height</legend>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <input
            aria-label="Feet"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="next"
            className="input pr-10 text-lg tabular-nums"
            value={value.ft}
            placeholder="5"
            onChange={(e) => onChange({ ft: clean(e.target.value, true) })}
            aria-invalid={invalid ? "true" : undefined}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
            ft
          </span>
        </div>
        <div className="relative">
          <input
            aria-label="Inches"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            enterKeyHint="done"
            className="input pr-10 text-lg tabular-nums"
            value={value.inch}
            placeholder="10"
            onChange={(e) => onChange({ inch: clean(e.target.value, false) })}
            aria-invalid={invalid ? "true" : undefined}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
            in
          </span>
        </div>
      </div>
      {hint && (
        <p id={`${id}-hint`} className={`mt-1.5 text-xs leading-relaxed ${invalid ? "text-alert" : "text-ink-3"}`}>
          {hint}
        </p>
      )}
    </fieldset>
  );
}

/* ================================================================== */
/* Validation helpers                                                   */
/* ================================================================== */

/** A parsed field: its number (null when empty/invalid), and whether to flag it. */
export interface Checked {
  value: number | null;
  /** typed something, but out of range */
  bad: boolean;
}

/** Parse `raw` and keep it only if min ≤ n ≤ max. Empty is not "bad", just missing. */
export function checkRange(raw: string, min: number, max: number, integer = false): Checked {
  const n = parseNumber(raw);
  if (n === null) return { value: null, bad: raw.trim() !== "" };
  const ok = n >= min && n <= max && (!integer || Number.isInteger(n));
  return { value: ok ? n : null, bad: !ok };
}

/** Sensible human ranges, in the unit shown. */
export const BODYWEIGHT_RANGE: Record<WeightUnit, [number, number]> = { lb: [66, 660], kg: [30, 300] };
export const HEIGHT_RANGE_CM: [number, number] = [120, 230];
export const AGE_RANGE: [number, number] = [15, 90];

export function checkHeight(system: UnitSystem, h: HeightFields): Checked {
  const cm = heightCmOf(system, h);
  const typed = system === "metric" ? h.cm.trim() !== "" : h.ft.trim() !== "";
  if (cm === null) return { value: null, bad: typed && (system === "metric" ? true : parseNumber(h.ft) === null) };
  const inchOk = system === "metric" || (parseNumber(h.inch) ?? 0) < 12;
  const ok = cm >= HEIGHT_RANGE_CM[0] && cm <= HEIGHT_RANGE_CM[1] && inchOk;
  return { value: ok ? cm : null, bad: !ok };
}

export const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const ACTIVITY_OPTIONS = [
  {
    value: "sedentary",
    label: "Mostly sitting",
    detail: "Desk job; your lifting is most of your activity",
  },
  {
    value: "active",
    label: "Moderately active",
    detail: "On your feet a lot, or lifting plus about an hour of cardio or sport most days",
  },
  {
    value: "vigorous",
    label: "Very active",
    detail: "Physical job, or hard training every day on top of lifting",
  },
] as const;
