import type { Sex } from "./formulas";
import { STANDARDS, type LiftId } from "./standards-data";

export { STANDARDS, type LiftId };

export const LEVELS = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite"] as const;
export type Level = (typeof LEVELS)[number];

/** Strength Level's definitions: each level is stronger than this share of lifters who log the lift. */
export const LEVEL_SHARE = [5, 20, 50, 80, 95] as const;

/** Typical training age behind each level, as Strength Level describes them. */
export const LEVEL_TRAINING = [
  "about a month of practice",
  "around six months of regular training",
  "around two years of regular training",
  "five or more years",
  "five or more years, usually competing",
] as const;

const KG_PER_LB = 0.45359237;
export const lbToKg = (lb: number) => lb * KG_PER_LB;
export const kgToLb = (kg: number) => kg / KG_PER_LB;

/** The table's bodyweight span for this sex, in lb. */
export function bodyweightSpan(lift: LiftId, sex: Sex): [number, number] {
  const rows = STANDARDS[lift][sex];
  return [rows[0][0], rows[rows.length - 1][0]];
}

/**
 * The five thresholds (beginner → elite) at a bodyweight in lb, linearly interpolated between the
 * table's 10 lb rows. Outside the table's span the nearest row is used (`clamped` says so).
 */
export function thresholdsAt(lift: LiftId, sex: Sex, bodyweightLb: number): { values: number[]; clamped: boolean } {
  const rows = STANDARDS[lift][sex];
  const [lo, hi] = bodyweightSpan(lift, sex);
  if (!Number.isFinite(bodyweightLb)) return { values: rows[0].slice(1), clamped: true };
  if (bodyweightLb <= lo) return { values: rows[0].slice(1), clamped: bodyweightLb < lo };
  if (bodyweightLb >= hi) return { values: rows[rows.length - 1].slice(1), clamped: bodyweightLb > hi };
  const i = rows.findIndex((r) => r[0] > bodyweightLb);
  const a = rows[i - 1];
  const b = rows[i];
  const t = (bodyweightLb - a[0]) / (b[0] - a[0]);
  return { values: a.slice(1).map((v, k) => v + (b[k + 1] - v) * t), clamped: false };
}

export interface Standing {
  /** -1 = below beginner, 0..4 = the highest level reached */
  index: number;
  level: Level | "Below beginner";
  /** Approximate share of logged lifters this beats, interpolated between the level shares. */
  share: number;
  /** The next threshold above the lift, if any. */
  next: { level: Level; value: number } | null;
  thresholds: number[];
  clamped: boolean;
}

/**
 * Where a lift (lb, or reps for pull-ups) sits against the table at a bodyweight. The share is a
 * straight-line estimate between the published level shares (0 below beginner tails off to 1%,
 * above elite it creeps toward 99%) — good enough for "about", never shown as a precise percentile.
 */
export function standing(lift: LiftId, sex: Sex, bodyweightLb: number, value: number): Standing {
  const { values, clamped } = thresholdsAt(lift, sex, bodyweightLb);
  let index = -1;
  for (let k = 0; k < values.length; k++) if (value >= values[k] - 1e-9) index = k;
  let share: number;
  if (index === -1) {
    const first = values[0];
    share = first > 0 ? Math.max(1, (value / first) * LEVEL_SHARE[0]) : LEVEL_SHARE[0];
  } else if (index === values.length - 1) {
    const last = values[index];
    const prev = values[index - 1];
    const step = last - prev;
    share = Math.min(99, LEVEL_SHARE[index] + (step > 0 ? ((value - last) / step) * 4 : 0));
  } else {
    const a = values[index];
    const b = values[index + 1];
    const t = b > a ? (value - a) / (b - a) : 0;
    share = LEVEL_SHARE[index] + (LEVEL_SHARE[index + 1] - LEVEL_SHARE[index]) * t;
  }
  const nextIndex = index + 1;
  return {
    index,
    level: index === -1 ? "Below beginner" : LEVELS[index],
    share: Math.round(share),
    next: nextIndex < values.length ? { level: LEVELS[nextIndex], value: values[nextIndex] } : null,
    thresholds: values,
    clamped,
  };
}
