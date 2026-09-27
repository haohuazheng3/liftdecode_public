/**
 * The formulas behind the LiftDecode calculators. Pure and dependency-free: no I/O, no
 * randomness, no dates. Unless a function says it is unit-agnostic, weights are kilograms,
 * heights centimetres, ages years.
 *
 * Every constant here is listed, with the page it was checked against, in the formula spec
 * used by the tool pages. `scripts/tools-check.ts` pins each formula to known values.
 */

import { roundToStep } from "./units";

export type Sex = "male" | "female";
export type Experience = "beginner" | "intermediate" | "advanced";

const finitePositive = (n: number) => Number.isFinite(n) && n > 0;

/* ------------------------------------------------------------------ */
/* One-rep max                                                          */
/* ------------------------------------------------------------------ */

export type OneRmFormulaId = "epley" | "brzycki" | "lombardi" | "oconner" | "mayhew" | "wathen";

/** Rep range the calculators accept; estimates above CAUTION_ABOVE_REPS get a warning. */
export const MIN_REPS = 1;
export const MAX_REPS = 12;
/** Mayhew et al. 2008 (JSCR 22(5):1570–7): accuracy "appears to be enhanced if fewer than 10 RTF are used". */
export const CAUTION_ABOVE_REPS = 10;

/** Epley (1985 "Poundage Chart"): 1RM = w × (1 + r/30). Source: https://en.wikipedia.org/wiki/One-repetition_maximum */
export function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

/**
 * Brzycki (1993, JOPERD 64:88–90): 1RM = w × 36 / (37 − r). Same as Mayhew et al. 2008 Table 2's
 * w / (1.0278 − 0.0278 r). Sources: https://en.wikipedia.org/wiki/One-repetition_maximum,
 * https://www.unm.edu/~rrobergs/478PredictionAccuracy.pdf
 */
export function brzycki(weight: number, reps: number): number {
  return (weight * 36) / (37 - reps);
}

/** Lombardi (1989): 1RM = w × r^0.10. Source: Mayhew et al. 2008 Table 2; Wikipedia "One-repetition maximum". */
export function lombardi(weight: number, reps: number): number {
  return weight * reps ** 0.1;
}

/** O'Conner et al. (1989): 1RM = w × (1 + 0.025 r). Source: Mayhew et al. 2008 Table 2; Wikipedia "One-repetition maximum". */
export function oConner(weight: number, reps: number): number {
  return weight * (1 + 0.025 * reps);
}

/** Mayhew et al. (1992): 1RM = w / (0.522 + 0.419 e^(−0.055 r)). Source: Mayhew et al. 2008 Table 2; Wikipedia. */
export function mayhew(weight: number, reps: number): number {
  return weight / (0.522 + 0.419 * Math.exp(-0.055 * reps));
}

/** Wathen (1994, NSCA "Load assignment"): 1RM = w / (0.488 + 0.538 e^(−0.075 r)). Source: Mayhew et al. 2008 Table 2; Wikipedia. */
export function wathen(weight: number, reps: number): number {
  return weight / (0.488 + 0.538 * Math.exp(-0.075 * reps));
}

export interface OneRmFormula {
  id: OneRmFormulaId;
  name: string;
  equation: string;
  fn: (weight: number, reps: number) => number;
}

/** Display order: the two headline formulas first, then the four comparison formulas. */
export const ONE_RM_FORMULAS: readonly OneRmFormula[] = [
  { id: "epley", name: "Epley", equation: "w × (1 + r ÷ 30)", fn: epley },
  { id: "brzycki", name: "Brzycki", equation: "w × 36 ÷ (37 − r)", fn: brzycki },
  { id: "lombardi", name: "Lombardi", equation: "w × r^0.10", fn: lombardi },
  { id: "oconner", name: "O'Conner", equation: "w × (1 + 0.025 × r)", fn: oConner },
  { id: "mayhew", name: "Mayhew", equation: "w ÷ (0.522 + 0.419 × e^(−0.055 × r))", fn: mayhew },
  { id: "wathen", name: "Wathen", equation: "w ÷ (0.488 + 0.538 × e^(−0.075 × r))", fn: wathen },
];

export function validSet(weight: number, reps: number): boolean {
  return finitePositive(weight) && Number.isInteger(reps) && reps >= MIN_REPS && reps <= MAX_REPS;
}

/**
 * Every formula's estimate for one set. A single rep IS a one-rep max, so at r = 1 every
 * formula returns the weight itself (raw Epley would add 3.3%, Mayhew 8.9%). Null when the
 * set is outside 1–12 reps or the weight is not positive.
 */
export function oneRepMaxEstimates(weight: number, reps: number): Record<OneRmFormulaId, number> | null {
  if (!validSet(weight, reps)) return null;
  const out = {} as Record<OneRmFormulaId, number>;
  for (const f of ONE_RM_FORMULAS) out[f.id] = reps === 1 ? weight : f.fn(weight, reps);
  return out;
}

/** The headline number: the mean of Epley and Brzycki (the weight itself at 1 rep). */
export function headlineOneRepMax(weight: number, reps: number): number | null {
  const e = oneRepMaxEstimates(weight, reps);
  return e ? (e.epley + e.brzycki) / 2 : null;
}

/**
 * Epley solved for the load: the weight you should manage for `reps` given a 1RM,
 * w = 1RM ÷ (1 + r/30). One rep returns the 1RM itself. Unit-agnostic.
 */
export function epleyLoadForReps(oneRm: number, reps: number): number {
  if (reps <= 1) return oneRm;
  return oneRm / (1 + reps / 30);
}

/**
 * Epley solved for reps: roughly how many reps a load at `percent` of 1RM allows,
 * r = 30 × (100/percent − 1), rounded to the nearest whole rep (minimum 1; 100% = 1).
 */
export function epleyRepsAtPercent(percent: number): number {
  if (!(percent > 0)) return 0;
  if (percent >= 100) return 1;
  return Math.max(1, Math.round(30 * (100 / percent - 1)));
}

/** 100% down to 50% in 5% steps. */
export const PERCENT_STEPS: readonly number[] = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

export interface PercentRow {
  percent: number;
  /** Rounded to the nearest loadable increment. */
  weight: number;
  exact: number;
  reps: number;
}

/** "% of 1RM" table: loads rounded to `step` (5 lb / 2.5 kg) and Epley-inverse reps. Unit-agnostic. */
export function percentTable(oneRm: number, step: number): PercentRow[] {
  return PERCENT_STEPS.map((percent) => {
    const exact = (oneRm * percent) / 100;
    return { percent, exact, weight: roundToStep(exact, step), reps: epleyRepsAtPercent(percent) };
  });
}

/* ------------------------------------------------------------------ */
/* Bench press                                                          */
/* ------------------------------------------------------------------ */

/** Plate milestones: 1, 1¼ (lb only: 185), 2 and 3 plates a side on a 20 kg / 45 lb bar. */
export const BENCH_MILESTONES = { lb: [135, 185, 225, 315], kg: [60, 80, 100, 140] } as const;

/** Lift ÷ bodyweight (both in the same unit). */
export function strengthRatio(lift: number, bodyweight: number): number | null {
  if (!finitePositive(lift) || !finitePositive(bodyweight)) return null;
  return lift / bodyweight;
}

/** Share of a milestone reached, clamped to 0–1. */
export function milestoneProgress(oneRm: number, milestone: number): number {
  if (!finitePositive(oneRm) || !finitePositive(milestone)) return 0;
  return Math.min(1, oneRm / milestone);
}

/** Rep targets for the training-weight table (Epley inverse). */
export const TRAINING_REPS: readonly number[] = [1, 2, 3, 5, 8, 10, 12];

/* ------------------------------------------------------------------ */
/* RPE (Reactive Training Systems chart)                                */
/* ------------------------------------------------------------------ */

/** Column order of RTS_RPE_CHART. */
export const RPE_COLUMNS = [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5] as const;
export type Rpe = (typeof RPE_COLUMNS)[number];

/**
 * % of 1RM by reps (rows 1–12) × RPE (columns 10 → 6.5), transcribed from the chart in
 * Mike Tuchscherer, "Customizing Your RPE Chart", Reactive Training Systems (2016):
 * https://store.reactivetrainingsystems.com/blogs/advanced-concepts/customizing-your-rpe-chart
 * One full RPE point equals one rep: chart[r][rpe − 1] = chart[r + 1][rpe] (e.g. 1 @ 9 = 2 @ 10 = 95.5%).
 */
export const RTS_RPE_CHART: readonly (readonly number[])[] = [
  /*  1 */ [100.0, 97.8, 95.5, 93.9, 92.2, 90.7, 89.2, 87.8],
  /*  2 */ [95.5, 93.9, 92.2, 90.7, 89.2, 87.8, 86.3, 85.0],
  /*  3 */ [92.2, 90.7, 89.2, 87.8, 86.3, 85.0, 83.7, 82.4],
  /*  4 */ [89.2, 87.8, 86.3, 85.0, 83.7, 82.4, 81.1, 79.9],
  /*  5 */ [86.3, 85.0, 83.7, 82.4, 81.1, 79.9, 78.6, 77.4],
  /*  6 */ [83.7, 82.4, 81.1, 79.9, 78.6, 77.4, 76.2, 75.1],
  /*  7 */ [81.1, 79.9, 78.6, 77.4, 76.2, 75.1, 73.9, 72.3],
  /*  8 */ [78.6, 77.4, 76.2, 75.1, 73.9, 72.3, 70.7, 69.4],
  /*  9 */ [76.2, 75.1, 73.9, 72.3, 70.7, 69.4, 68.0, 66.7],
  /* 10 */ [73.9, 72.3, 70.7, 69.4, 68.0, 66.7, 65.3, 64.0],
  /* 11 */ [70.7, 69.4, 68.0, 66.7, 65.3, 64.0, 62.6, 61.3],
  /* 12 */ [68.0, 66.7, 65.3, 64.0, 62.6, 61.3, 59.9, 58.6],
];

export function isRpe(v: number): v is Rpe {
  return (RPE_COLUMNS as readonly number[]).includes(v);
}

/** % of 1RM for `reps` at `rpe` per the RTS chart; null outside 1–12 reps / RPE 6.5–10. */
export function rpeToPercent(reps: number, rpe: number): number | null {
  if (!Number.isInteger(reps) || reps < 1 || reps > RTS_RPE_CHART.length) return null;
  const col = (RPE_COLUMNS as readonly number[]).indexOf(rpe);
  if (col < 0) return null;
  return RTS_RPE_CHART[reps - 1][col];
}

/** Estimated 1RM from a set: weight ÷ chart%. Unit-agnostic. */
export function e1rmFromRpe(weight: number, reps: number, rpe: number): number | null {
  const pct = rpeToPercent(reps, rpe);
  if (pct === null || !finitePositive(weight)) return null;
  return weight / (pct / 100);
}

/** Load for a target set: 1RM × chart%. Unit-agnostic. */
export function loadFromRpe(oneRm: number, reps: number, rpe: number): number | null {
  const pct = rpeToPercent(reps, rpe);
  if (pct === null || !finitePositive(oneRm)) return null;
  return (oneRm * pct) / 100;
}

/* ------------------------------------------------------------------ */
/* Protein                                                              */
/* ------------------------------------------------------------------ */

export type ProteinGoal = "build" | "maintain" | "cut";

export interface ProteinGuide {
  /** g per kg per day */
  low: number;
  high: number;
  target: number;
}

/**
 * Daily protein in g/kg/day.
 * - build: 1.6–2.2, target 1.6 — Morton et al. 2018, Br J Sports Med: gains in fat-free
 *   mass plateaued at 1.62 g/kg/day (95% CI 1.03–2.20); "~2.2 g/kg/d for those seeking to maximise".
 *   https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/
 * - maintain: 1.4–2.0, target 1.6 — ISSN position stand (Jäger et al. 2017, JISSN 14:20): "1.4–2.0 g/kg/d is
 *   sufficient for most exercising individuals"; the target is Morton's 1.6, which sits inside that range.
 * - cut: 2.3–3.1, target 2.3 — ISSN 2017 (hypocaloric periods, resistance-trained) and Helms et al. 2014,
 *   IJSNEM 24:127–138 ("2.3–3.1 g/kg of FFM scaled upwards with severity of caloric restriction and leanness").
 *   Applied to lean mass when body fat is known, otherwise to bodyweight.
 */
export const PROTEIN_GUIDE: Record<ProteinGoal, ProteinGuide> = {
  build: { low: 1.6, high: 2.2, target: 1.6 },
  maintain: { low: 1.4, high: 2.0, target: 1.6 },
  cut: { low: 2.3, high: 3.1, target: 2.3 },
};

/**
 * Per-meal guide, Schoenfeld & Aragon 2018 (JISSN 15:10): 0.4 g/kg/meal across ≥ 4 meals
 * (reaching 1.6 g/kg/day), up to 0.55 g/kg/meal (reaching 2.2 g/kg/day).
 */
export const PROTEIN_PER_MEAL = { low: 0.4, high: 0.55 } as const;
export const MEAL_COUNTS: readonly number[] = [3, 4, 5];

export interface ProteinPlan {
  basis: "bodyweight" | "lean mass";
  basisKg: number;
  lowG: number;
  highG: number;
  targetG: number;
  perMeal: { meals: number; grams: number }[];
  /** Schoenfeld & Aragon per-meal band for this bodyweight. */
  perMealGuideG: { low: number; high: number };
}

export function proteinPlan(weightKg: number, goal: ProteinGoal, bodyFatPct?: number | null): ProteinPlan | null {
  if (!finitePositive(weightKg)) return null;
  const g = PROTEIN_GUIDE[goal];
  const useLean = goal === "cut" && typeof bodyFatPct === "number" && bodyFatPct > 0 && bodyFatPct < 100;
  const basisKg = useLean ? fatFreeMass(weightKg, bodyFatPct as number) : weightKg;
  const targetG = g.target * basisKg;
  return {
    basis: useLean ? "lean mass" : "bodyweight",
    basisKg,
    lowG: g.low * basisKg,
    highG: g.high * basisKg,
    targetG,
    perMeal: MEAL_COUNTS.map((meals) => ({ meals, grams: targetG / meals })),
    perMealGuideG: { low: PROTEIN_PER_MEAL.low * weightKg, high: PROTEIN_PER_MEAL.high * weightKg },
  };
}

/* ------------------------------------------------------------------ */
/* Body composition: fat-free mass, FFMI                                */
/* ------------------------------------------------------------------ */

/** Fat-free mass = weight × (1 − body fat %/100). */
export function fatFreeMass(weightKg: number, bodyFatPct: number): number {
  return weightKg * (1 - bodyFatPct / 100);
}

/**
 * Kouri et al. 1995, Clin J Sport Med 5(4):223–8: "a slight correction of 6.3 × (1.80 m − height)
 * to normalize these values to the height of a 1.8-m man". (Many calculators use 6.1; the abstract
 * says 6.3.) https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1097/00042752-199510000-00003&resultType=core&format=json
 */
export const KOURI_HEIGHT_CORRECTION = 6.3;
export const KOURI_REFERENCE_HEIGHT_M = 1.8;
/** Kouri 1995: nonusers' normalized FFMI "extended up to a well-defined limit of 25.0" (74 male nonusers). */
export const KOURI_NONUSER_LIMIT = 25.0;

export interface FfmiResult {
  leanKg: number;
  fatKg: number;
  ffmi: number;
  normalized: number;
}

/** FFMI = fat-free mass (kg) ÷ height (m)²; normalized FFMI = FFMI + 6.3 × (1.8 − height m). */
export function ffmi(weightKg: number, heightCm: number, bodyFatPct: number): FfmiResult | null {
  if (!finitePositive(weightKg) || !finitePositive(heightCm)) return null;
  if (!(bodyFatPct >= 0 && bodyFatPct < 100)) return null;
  const leanKg = fatFreeMass(weightKg, bodyFatPct);
  const m = heightCm / 100;
  const index = leanKg / (m * m);
  return {
    leanKg,
    fatKg: weightKg - leanKg,
    ffmi: index,
    normalized: index + KOURI_HEIGHT_CORRECTION * (KOURI_REFERENCE_HEIGHT_M - m),
  };
}

/* ------------------------------------------------------------------ */
/* Powerlifting scores: DOTS and Wilks                                  */
/* ------------------------------------------------------------------ */

/** a·x⁴ + b·x³ + c·x² + d·x + e */
function poly4(a: number, b: number, c: number, d: number, e: number, x: number): number {
  return (((a * x + b) * x + c) * x + d) * x + e;
}

/** a·x⁵ + b·x⁴ + c·x³ + d·x² + e·x + f */
function poly5(a: number, b: number, c: number, d: number, e: number, f: number, x: number): number {
  return ((((a * x + b) * x + c) * x + d) * x + e) * x + f;
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** Bodyweight range each coefficient is defined for; outside it OpenPowerlifting clamps. */
export const DOTS_BW_RANGE: Record<Sex, readonly [number, number]> = { male: [40, 210], female: [40, 150] };
export const WILKS_BW_RANGE: Record<Sex, readonly [number, number]> = { male: [40, 201.9], female: [26.51, 154.53] };

/**
 * DOTS coefficient = 500 ÷ (A·bw⁴ + B·bw³ + C·bw² + D·bw + E), bodyweight clamped as OpenPowerlifting does.
 * Coefficients: OpenPowerlifting crates/coefficients/src/dots.rs
 * (https://gitlab.com/openpowerlifting/opl-data/-/raw/main/crates/coefficients/src/dots.rs),
 * matching IPF "Evaluation of Wilks, Wilks-2, DOTS, IPF and GOODLIFT formulas" (2020), Appendix 1.
 */
export function dotsCoefficient(sex: Sex, bodyweightKg: number): number {
  if (sex === "male") {
    const x = clamp(bodyweightKg, ...DOTS_BW_RANGE.male);
    return 500 / poly4(-0.000001093, 0.0007391293, -0.1918759221, 24.0900756, -307.75076, x);
  }
  const x = clamp(bodyweightKg, ...DOTS_BW_RANGE.female);
  return 500 / poly4(-0.0000010706, 0.0005158568, -0.1126655495, 13.6175032, -57.96288, x);
}

export function dotsScore(sex: Sex, bodyweightKg: number, totalKg: number): number | null {
  if (!finitePositive(bodyweightKg) || !finitePositive(totalKg)) return null;
  return totalKg * dotsCoefficient(sex, bodyweightKg);
}

/**
 * Original Wilks (Robert Wilks; used by the IPF until the end of 2018 — not the 2020 "Wilks-2"):
 * coefficient = 500 ÷ (a + b·bw + c·bw² + d·bw³ + e·bw⁴ + f·bw⁵), bodyweight clamped as OpenPowerlifting does.
 * Coefficients: OpenPowerlifting crates/coefficients/src/wilks.rs
 * (https://gitlab.com/openpowerlifting/opl-data/-/raw/main/crates/coefficients/src/wilks.rs) and
 * https://en.wikipedia.org/wiki/Wilks_coefficient
 */
export function wilksCoefficient(sex: Sex, bodyweightKg: number): number {
  if (sex === "male") {
    const x = clamp(bodyweightKg, ...WILKS_BW_RANGE.male);
    return 500 / poly5(-1.291e-8, 7.01863e-6, -0.00113732, -0.002388645, 16.2606339, -216.0475144, x);
  }
  const x = clamp(bodyweightKg, ...WILKS_BW_RANGE.female);
  return 500 / poly5(-9.054e-8, 4.731582e-5, -0.00930733913, 0.82112226871, -27.23842536447, 594.31747775582, x);
}

export function wilksScore(sex: Sex, bodyweightKg: number, totalKg: number): number | null {
  if (!finitePositive(bodyweightKg) || !finitePositive(totalKg)) return null;
  return totalKg * wilksCoefficient(sex, bodyweightKg);
}

/* ------------------------------------------------------------------ */
/* Energy: BMR, maintenance, bulking, recomposition                     */
/* ------------------------------------------------------------------ */

/**
 * Mifflin–St Jeor (Am J Clin Nutr 1990;51:241–7), resting energy expenditure in kcal/day:
 * men 10·kg + 6.25·cm − 5·age + 5; women 10·kg + 6.25·cm − 5·age − 161.
 * https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1093/ajcn/51.2.241&resultType=core&format=json
 */
export function mifflinStJeor(sex: Sex, weightKg: number, heightCm: number, ageYears: number): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + (sex === "male" ? 5 : -161);
}

export type ActivityLevel = "sedentary" | "active" | "vigorous";

/**
 * Physical activity level (PAL = total energy expenditure ÷ BMR), FAO/WHO/UNU Human Energy
 * Requirements (2001), ch. 5, Table 5.3 lifestyle bands 1.40–1.69 / 1.70–1.99 / 2.00–2.40; the values
 * used are the report's own worked examples for each band. https://www.fao.org/4/y5686e/y5686e07.htm
 */
export const ACTIVITY_PAL: Record<ActivityLevel, number> = {
  sedentary: 1.53,
  active: 1.76,
  vigorous: 2.25,
};

/** Maintenance calories = BMR × PAL. */
export function maintenanceCalories(bmr: number, activity: ActivityLevel): number {
  return bmr * ACTIVITY_PAL[activity];
}

/** Average weeks in a month (365.25 ÷ 12 ÷ 7 ≈ 4.35). */
export const WEEKS_PER_MONTH = 365.25 / 12 / 7;

/**
 * Iraki et al. 2019, "Nutrition Recommendations for Bodybuilders in the Off-Season: A Narrative
 * Review", Sports 7(7):154: surplus ~10–20% above maintenance, gain ~0.25–0.5% of bodyweight/week;
 * "larger energy surpluses may be more beneficial for novice bodybuilders", advanced "aim for the
 * lower end". https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/
 * Mapping by experience (LiftDecode's reading of that guidance): beginners at the top of both ranges,
 * intermediates in the middle, advanced lifters at the bottom.
 */
export const BULK_SURPLUS_RANGE = [0.1, 0.2] as const;
export const BULK_WEEKLY_GAIN_RANGE_PCT = [0.25, 0.5] as const;
export const BULK_GUIDE: Record<Experience, { surplus: number; weeklyGainPct: number }> = {
  beginner: { surplus: 0.2, weeklyGainPct: 0.5 },
  intermediate: { surplus: 0.15, weeklyGainPct: 0.375 },
  advanced: { surplus: 0.1, weeklyGainPct: 0.25 },
};

export interface BulkPlan {
  targetKcal: number;
  surplusKcal: number;
  rangeKcal: [number, number];
  weeklyGainKg: number;
  monthlyGainKg: number;
  monthlyGainRangeKg: [number, number];
}

export function bulkPlan(maintenanceKcal: number, weightKg: number, experience: Experience): BulkPlan | null {
  if (!finitePositive(maintenanceKcal) || !finitePositive(weightKg)) return null;
  const g = BULK_GUIDE[experience];
  const weeklyGainKg = (weightKg * g.weeklyGainPct) / 100;
  return {
    targetKcal: maintenanceKcal * (1 + g.surplus),
    surplusKcal: maintenanceKcal * g.surplus,
    rangeKcal: [maintenanceKcal * (1 + BULK_SURPLUS_RANGE[0]), maintenanceKcal * (1 + BULK_SURPLUS_RANGE[1])],
    weeklyGainKg,
    monthlyGainKg: weeklyGainKg * WEEKS_PER_MONTH,
    monthlyGainRangeKg: [
      ((weightKg * BULK_WEEKLY_GAIN_RANGE_PCT[0]) / 100) * WEEKS_PER_MONTH,
      ((weightKg * BULK_WEEKLY_GAIN_RANGE_PCT[1]) / 100) * WEEKS_PER_MONTH,
    ],
  };
}

/**
 * Recomposition intake: maintenance down to 250 kcal below it. Vargas-Molina et al. 2026, Eur J Appl
 * Physiol 126(7):4019–30 — resistance-trained adults (> 1 year), 10 weeks, ~2.5 g/kg/day protein: both the
 * maintenance group and the −250 kcal group gained fat-free mass while losing fat.
 * https://pmc.ncbi.nlm.nih.gov/articles/PMC13380550/
 */
export const RECOMP_DEFICIT_KCAL = 250;

export function recompCalories(maintenanceKcal: number): { low: number; high: number } | null {
  if (!finitePositive(maintenanceKcal)) return null;
  return { low: maintenanceKcal - RECOMP_DEFICIT_KCAL, high: maintenanceKcal };
}

/** Recomp protein, g/kg bodyweight/day: Morton et al. 2018 range, target at its "maximise" end (~2.2). */
export const RECOMP_PROTEIN: ProteinGuide = { low: 1.6, high: 2.2, target: 2.2 };

/**
 * Upper body-fat bounds Helms et al. 2014 used for "lower body fat" trained lifters (men ≤ 23%,
 * women ≤ 35%). Above them there is more fat to lose alongside muscle gain.
 */
export const LEAN_BODY_FAT_BOUND: Record<Sex, number> = { male: 23, female: 35 };

export type RecompOutlook = "best" | "good" | "slow";

/**
 * Honest expectation, from Barakat et al. 2020 (Strength Cond J 42(5)): recomposition is widely
 * accepted in "untrained/novice and overweight/obese populations" and is also documented in
 * resistance-trained lifters, where the changes are smaller.
 */
export function recompOutlook(experience: Experience, sex: Sex, bodyFatPct: number | null): RecompOutlook {
  if (experience === "beginner") return "best";
  if (bodyFatPct !== null && bodyFatPct > LEAN_BODY_FAT_BOUND[sex]) return "good";
  return "slow";
}

/* ------------------------------------------------------------------ */
/* Lean body mass                                                       */
/* ------------------------------------------------------------------ */

/**
 * Boer 1984 (Am J Physiol 247:F632–6), kg from kg + cm: men 0.407W + 0.267H − 19.2; women 0.252W + 0.473H − 48.3.
 * As given in https://en.wikipedia.org/wiki/Lean_body_mass and Caruso et al. 2018, BioMed Res Int 8521893
 * (https://pmc.ncbi.nlm.nih.gov/articles/PMC6110034/).
 */
export function boerLbm(sex: Sex, weightKg: number, heightCm: number): number {
  return sex === "male" ? 0.407 * weightKg + 0.267 * heightCm - 19.2 : 0.252 * weightKg + 0.473 * heightCm - 48.3;
}

/**
 * James 1976 (DHSS/MRC "Research on Obesity"): men 1.10W − 128(W/H)²; women 1.07W − 148(W/H)², W kg, H cm.
 * The male multiplier is the originally published 128, not the misquoted 120 — DICOM CP-1612:
 * https://dicom.nema.org/medical/dicom/Final/cp1612_ft_120or128forSUVformula.pdf
 */
export function jamesLbm(sex: Sex, weightKg: number, heightCm: number): number {
  const r = weightKg / heightCm;
  return sex === "male" ? 1.1 * weightKg - 128 * r * r : 1.07 * weightKg - 148 * r * r;
}

/**
 * Weight above which James starts predicting LESS lean mass for more bodyweight (its maximum):
 * d/dW = 0 → W = 1.10·H²/256 (men), 1.07·H²/296 (women).
 */
export function jamesPeakWeightKg(sex: Sex, heightCm: number): number {
  return sex === "male" ? (1.1 * heightCm * heightCm) / 256 : (1.07 * heightCm * heightCm) / 296;
}

/**
 * Hume 1966 (J Clin Pathol 19:389–91, equation 1): men 0.32810W + 0.33929H − 29.5336;
 * women 0.29569W + 0.41813H − 43.2933, W kg, H cm. https://pmc.ncbi.nlm.nih.gov/articles/PMC473290/
 */
export function humeLbm(sex: Sex, weightKg: number, heightCm: number): number {
  return sex === "male"
    ? 0.3281 * weightKg + 0.33929 * heightCm - 29.5336
    : 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
}

/* ------------------------------------------------------------------ */
/* Plate loading                                                        */
/* ------------------------------------------------------------------ */

export const PLATE_SETS = {
  lb: [45, 35, 25, 10, 5, 2.5],
  kg: [25, 20, 15, 10, 5, 2.5, 1.25],
} as const;

export const BAR_PRESETS = { lb: [45, 35], kg: [20, 15] } as const;

/** IPF Technical Rulebook 2026, §2.4: collars "must weigh 2.5 kg each" (≈ 5.5 lb). */
export const COLLAR_EACH = { kg: 2.5, lb: 5.5 } as const;

export interface PlateCount {
  plate: number;
  count: number;
}

export interface PlateLoad {
  /** Bar + collars + both sides. */
  total: number;
  perSideWeight: number;
  /** Heaviest first — the order they go on the sleeve. */
  perSide: PlateCount[];
}

export type PlateSolution =
  | { kind: "invalid" }
  | { kind: "below-bar"; base: number }
  | { kind: "exact"; load: PlateLoad; usedFallback: boolean }
  | { kind: "nearest"; lower: PlateLoad | null; higher: PlateLoad | null };

/** Work in hundredths so 1.25 + 2.5 never drifts into floating-point noise. */
const U = 100;
const toU = (x: number) => Math.round(x * U);
const fromU = (x: number) => x / U;

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function makeLoad(base: number, counts: Map<number, number>, plates: readonly number[]): PlateLoad {
  const perSide: PlateCount[] = [];
  let side = 0;
  for (const p of plates) {
    const c = counts.get(p) ?? 0;
    if (c > 0) {
      perSide.push({ plate: fromU(p), count: c });
      side += p * c;
    }
  }
  return { total: fromU(base + 2 * side), perSideWeight: fromU(side), perSide };
}

/**
 * Plates per side for `target` (unit-agnostic: all arguments in one unit). Greedy from the heaviest
 * plate first; if greedy misses but another combination hits the weight exactly (e.g. 35 + 25 = 60
 * without 5s), a fewest-plates search finds it. When the exact weight cannot be loaded, returns the
 * nearest loadable weights below and above. Unlimited pairs of each enabled plate are assumed.
 */
export function solvePlates(
  target: number,
  bar: number,
  collarsTotal: number,
  availablePlates: readonly number[],
): PlateSolution {
  if (!Number.isFinite(target) || !Number.isFinite(bar) || bar < 0 || !(target > 0) || collarsTotal < 0) {
    return { kind: "invalid" };
  }
  const plates = [...new Set(availablePlates.map(toU).filter((p) => p > 0))].sort((a, b) => b - a);
  const base = toU(bar) + toU(collarsTotal);
  const need = toU(target) - base;
  if (need < 0) return { kind: "below-bar", base: fromU(base) };

  const empty = new Map<number, number>();
  if (need === 0) return { kind: "exact", load: makeLoad(base, empty, plates), usedFallback: false };

  const perSideExact = need % 2 === 0 ? need / 2 : null;

  // 1) greedy, heaviest first
  if (perSideExact !== null && plates.length) {
    let rem = perSideExact;
    const counts = new Map<number, number>();
    for (const p of plates) {
      const n = Math.floor(rem / p);
      if (n > 0) {
        counts.set(p, n);
        rem -= n * p;
      }
    }
    if (rem === 0) return { kind: "exact", load: makeLoad(base, counts, plates), usedFallback: false };
  }

  if (!plates.length) return { kind: "nearest", lower: makeLoad(base, empty, plates), higher: null };

  // 2) fewest-plates search over reachable per-side sums (in units of the plates' gcd)
  const step = plates.reduce(gcd);
  const perSideTarget = need / 2; // may be fractional in hundredths when `need` is odd
  const limit = Math.floor(perSideTarget / step) + Math.ceil(plates[0] / step) + 1;
  const best = new Array<number>(limit + 1).fill(Infinity);
  const via = new Array<number>(limit + 1).fill(0);
  best[0] = 0;
  for (let i = 1; i <= limit; i++) {
    for (const p of plates) {
      const k = p / step;
      if (k <= i && best[i - k] + 1 < best[i]) {
        best[i] = best[i - k] + 1;
        via[i] = p;
      }
    }
  }
  const loadAt = (i: number): PlateLoad => {
    const counts = new Map<number, number>();
    for (let j = i; j > 0; j -= via[j] / step) counts.set(via[j], (counts.get(via[j]) ?? 0) + 1);
    return makeLoad(base, counts, plates);
  };

  if (perSideExact !== null && perSideExact % step === 0 && Number.isFinite(best[perSideExact / step])) {
    return { kind: "exact", load: loadAt(perSideExact / step), usedFallback: true };
  }

  let lower: PlateLoad | null = null;
  let higher: PlateLoad | null = null;
  for (let i = Math.min(limit, Math.floor(perSideTarget / step)); i >= 0; i--) {
    if (Number.isFinite(best[i]) && i * step <= perSideTarget) {
      lower = loadAt(i);
      break;
    }
  }
  for (let i = Math.max(0, Math.floor(perSideTarget / step)); i <= limit; i++) {
    if (Number.isFinite(best[i]) && i * step > perSideTarget) {
      higher = loadAt(i);
      break;
    }
  }
  return { kind: "nearest", lower, higher };
}
