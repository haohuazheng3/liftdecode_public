"use client";

import { useState, useSyncExternalStore } from "react";
import type { NumberSpec, UnitSpec } from "@/content/types";

/**
 * A typed number with a unit toggle (cm | ft/in, kg | lb). The stored answer is always the
 * base unit (the first unit in the spec); the field shows the unit the lifter picked, which
 * is remembered per question in localStorage so a US lifter never sees centimetres twice.
 */
const UNITS_KEY = "ld_units";
const listeners = new Set<() => void>();

function readUnits(): Record<string, string> {
  try {
    const raw = localStorage.getItem(UNITS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}
function saveUnit(id: string, unit: string) {
  try {
    const map = readUnits();
    map[id] = unit;
    localStorage.setItem(UNITS_KEY, JSON.stringify(map));
  } catch {
    /* preference only */
  }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
}
// snapshot is the serialised map so an unchanged preference is referentially stable
const getSnapshot = () => {
  try {
    return localStorage.getItem(UNITS_KEY) ?? "";
  } catch {
    return "";
  }
};
const getServerSnapshot = () => "";

function fmt(n: number, decimals: number): string {
  if (!Number.isFinite(n)) return "";
  return String(Number(n.toFixed(decimals)));
}

/** the stored base value shown in a unit, split for compound units (ft + in) */
function display(base: number, unit: UnitSpec): { text: string; second: string } {
  if (!Number.isFinite(base)) return { text: "", second: "" };
  const shown = unit.fromBase(base);
  if (unit.compound) {
    const whole = Math.floor(shown / unit.compound.perUnit);
    return { text: String(whole), second: String(Math.round(shown - whole * unit.compound.perUnit)) };
  }
  return { text: fmt(shown, unit.decimals ?? 0), second: "" };
}

export function NumberInput({
  id,
  label,
  spec,
  value,
  onChange,
  autoFocus,
}: {
  id: string;
  label: string;
  spec: NumberSpec;
  /** stored base-unit value */
  value: string | undefined;
  /** base-unit value, or undefined when the field is empty / invalid */
  onChange: (value: string | undefined) => void;
  autoFocus?: boolean;
}) {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const savedKey = (() => {
    try {
      return prefs ? (JSON.parse(prefs) as Record<string, string>)[id] : undefined;
    } catch {
      return undefined;
    }
  })();
  const unit: UnitSpec = spec.units.find((u) => u.key === savedKey) ?? spec.units[0];

  // What the lifter is typing, valid only for the unit it was typed in; otherwise the field
  // shows the stored value converted into the current unit.
  const [draft, setDraft] = useState<{ unit: string; text: string; second: string } | null>(null);
  const base = value !== undefined ? Number(value) : NaN;
  const shown = draft && draft.unit === unit.key ? draft : display(base, unit);
  const invalid = draft !== null && draft.unit === unit.key && (draft.text !== "" || draft.second !== "") && value === undefined;

  const commit = (text: string, second: string) => {
    setDraft({ unit: unit.key, text, second });
    const a = text.trim() === "" ? NaN : Number(text.replace(",", "."));
    const b = second.trim() === "" ? 0 : Number(second.replace(",", "."));
    if (!Number.isFinite(a) || !Number.isFinite(b)) return onChange(undefined);
    const inUnit = unit.compound ? a * unit.compound.perUnit + b : a;
    const baseValue = unit.toBase(inUnit);
    if (baseValue < spec.min || baseValue > spec.max) return onChange(undefined);
    const rounded = Math.round(baseValue / spec.step) * spec.step;
    onChange(Number.isInteger(rounded) ? String(rounded) : String(Number(rounded.toFixed(2))));
  };

  // the example in the placeholder follows the unit ("e.g. 178" → "e.g. 5" and "10", or "e.g. 181")
  const exampleBase = Number((spec.placeholder ?? "").replace(/[^\d.]/g, ""));
  const example = Number.isFinite(exampleBase) && exampleBase > 0 ? display(exampleBase, unit) : { text: "", second: "" };
  const placeholderFor = (first: boolean) => {
    if (!spec.placeholder) return "";
    const v = first ? example.text : example.second;
    return v ? (first ? `e.g. ${v}` : v) : "";
  };

  const range = unit.compound
    ? `${Math.floor(unit.fromBase(spec.min) / unit.compound.perUnit)}–${Math.ceil(unit.fromBase(spec.max) / unit.compound.perUnit)} ${unit.compound.label}`
    : `${fmt(unit.fromBase(spec.min), 0)}–${fmt(unit.fromBase(spec.max), 0)} ${unit.label}`;

  const field = (val: string, suffix: string, first: boolean) => (
    <label className="relative flex-1 min-w-0">
      <span className="sr-only">
        {label} in {suffix}
      </span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        autoFocus={autoFocus && first}
        value={val}
        placeholder={placeholderFor(first)}
        aria-invalid={invalid || undefined}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d.,]/g, "").slice(0, 6);
          if (first) commit(v, shown.second);
          else commit(shown.text, v);
        }}
        className="input pr-12 font-display text-2xl font-bold tabular-nums"
      />
      <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-3">
        {suffix}
      </span>
    </label>
  );

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 gap-2">
          {unit.compound ? (
            <>
              {field(shown.text, unit.compound.label, true)}
              {field(shown.second, unit.compound.secondLabel, false)}
            </>
          ) : (
            field(shown.text, unit.label, true)
          )}
        </div>
        {spec.units.length > 1 && (
          <div role="group" aria-label={`${label} unit`} className="flex shrink-0 self-start gap-1 rounded-full border border-line p-1">
            {spec.units.map((u) => {
              const on = u.key === unit.key;
              return (
                <button
                  key={u.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setDraft(null);
                    saveUnit(id, u.key);
                  }}
                  className={`min-h-10 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                    on ? "bg-signal text-[#14100a]" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {u.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {invalid && (
        <p className="mt-1.5 text-xs text-alert" role="alert">
          Enter a value between {range}.
        </p>
      )}
    </div>
  );
}
