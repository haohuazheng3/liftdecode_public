/**
 * Unit helpers for the calculators. Pure, dependency-free.
 *
 * Both conversion factors are exact by definition — NIST Handbook 44 (2026), Appendix C,
 * "General Tables of Units of Measurement": 1 avoirdupois pound = 0.453 592 37 kg and
 * 1 inch = 2.54 cm (exactly). https://www.nist.gov/document/2026-nist-handbook-44-appendix-c
 */

export type WeightUnit = "lb" | "kg";
/** "imperial" = feet + inches, "metric" = centimetres. */
export type HeightUnit = "imperial" | "metric";

/** Exact: 1 lb = 0.45359237 kg (NIST HB44 Appendix C). */
export const KG_PER_LB = 0.45359237;
/** Exact: 1 in = 2.54 cm (NIST HB44 Appendix C). */
export const CM_PER_IN = 2.54;
export const IN_PER_FT = 12;

/** The smallest jump a normal gym can load: a pair of 2.5 lb or 1.25 kg plates. */
export const LOAD_STEP: Record<WeightUnit, number> = { lb: 5, kg: 2.5 };

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

/** Any weight in `unit` → kilograms. */
export function toKg(value: number, unit: WeightUnit): number {
  return unit === "kg" ? value : lbToKg(value);
}

/** Kilograms → `unit`. */
export function fromKg(kg: number, unit: WeightUnit): number {
  return unit === "kg" ? kg : kgToLb(kg);
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  return from === to ? value : fromKg(toKg(value, from), to);
}

export function inToCm(inches: number): number {
  return inches * CM_PER_IN;
}

export function cmToIn(cm: number): number {
  return cm / CM_PER_IN;
}

/** Feet + inches → centimetres. */
export function ftInToCm(feet: number, inches: number): number {
  return inToCm(feet * IN_PER_FT + inches);
}

/** Centimetres → whole feet + inches (inches rounded to `inchDecimals`, carried into feet at 12). */
export function cmToFtIn(cm: number, inchDecimals = 0): { ft: number; in: number } {
  const factor = 10 ** inchDecimals;
  const totalIn = Math.round(cmToIn(cm) * factor) / factor;
  let ft = Math.floor(totalIn / IN_PER_FT);
  let inches = Math.round((totalIn - ft * IN_PER_FT) * factor) / factor;
  if (inches >= IN_PER_FT) {
    ft += 1;
    inches -= IN_PER_FT;
  }
  return { ft, in: inches };
}

/** Round to the nearest multiple of `step` (e.g. 5 lb or 2.5 kg). Halves round up. */
export function roundToStep(value: number, step: number): number {
  if (!(step > 0)) return value;
  // the tiny epsilon keeps 257.5 / 5 = 51.4999999… from rounding the wrong way
  return Math.round(value / step + 1e-9) * step;
}

/** Round down to a multiple of `step`. */
export function floorToStep(value: number, step: number): number {
  if (!(step > 0)) return value;
  return Math.floor(value / step + 1e-9) * step;
}

/** Round to `decimals` places without floating-point noise (e.g. 0.1 + 0.2). */
export function roundTo(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/**
 * Parse what a person typed into a number field. Accepts "225", "102.5", "102,5" and
 * surrounding spaces. Returns null for empty or non-numeric input — never NaN.
 */
export function parseNumber(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().replace(",", ".");
  if (s === "" || s === "." || s === "-") return null;
  if (!/^-?\d*\.?\d*$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Format for display: thousands separators, at most `decimals` places, at least `minDecimals` (default: no trailing zeros). */
export function formatNumber(value: number, decimals = 1, minDecimals = 0): string {
  if (!Number.isFinite(value)) return "–";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: Math.min(minDecimals, decimals),
  });
}

/**
 * Convert a typed weight string between units, keeping empty/invalid input untouched so a
 * half-typed field is never replaced by a surprise number.
 */
export function convertWeightInput(raw: string, from: WeightUnit, to: WeightUnit, decimals = 1): string {
  if (from === to) return raw;
  const n = parseNumber(raw);
  if (n === null) return raw;
  return String(roundTo(convertWeight(n, from, to), decimals));
}
