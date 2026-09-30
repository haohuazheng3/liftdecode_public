/**
 * Derived answers (v3): numbers the intake collects, turned into the bands the rules read.
 * Computed inside the engine before scoring; never shown as questions. A derived id can be
 * used in conditions and in because-lines exactly like a question id.
 */
import type { DerivedQuestion } from "./types";

type A = Record<string, string | string[] | undefined>;

const num = (a: A, id: string): number | undefined => {
  const v = a[id];
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};
const str = (a: A, id: string): string | undefined => (typeof a[id] === "string" ? (a[id] as string) : undefined);

/** midpoint hours of a "hours a week" band */
const HOURS_MID: Record<string, number> = { u1: 0.5, "1_2": 1.5, "2_3": 2.5, "3_4": 3.5, "4plus": 4.5 };
const SESSIONS_N: Record<string, number> = { "0": 0, "1": 1, "2": 2, "3": 3, "4plus": 4 };
const PROTEIN_MID: Record<string, number> = { u100: 80, "100_140": 120, "140_180": 160, "180_220": 200, o220: 240 };
const CARBS_MID: Record<string, number> = { u150: 110, "150_250": 200, "250_350": 300, "350_450": 400, o450: 480 };
const SLEEP_MID: Record<string, number> = { u5: 4.5, "5_6": 5.5, "6_7": 6.5, "7_8": 7.5, "8_9": 8.5, o9: 9.5 };

export const GROUPS = ["chest", "back", "arms", "legs"] as const;
export type MuscleGroup = (typeof GROUPS)[number];

export function groupHours(a: A, g: MuscleGroup): number | undefined {
  const v = str(a, `${g}_hours`);
  return v ? HOURS_MID[v] : undefined;
}
export function groupSessions(a: A, g: MuscleGroup): number | undefined {
  const v = str(a, `${g}_sessions`);
  return v ? SESSIONS_N[v] : undefined;
}
export function weeklyHours(a: A): number | undefined {
  let total = 0;
  for (const g of GROUPS) {
    const h = groupHours(a, g);
    if (h === undefined) return undefined;
    total += h;
  }
  return total;
}
export function bmi(a: A): number | undefined {
  const h = num(a, "height_cm");
  const w = num(a, "weight_kg");
  if (!h || !w) return undefined;
  const m = h / 100;
  return w / (m * m);
}
export function proteinPerKg(a: A): number | undefined {
  const w = num(a, "weight_kg");
  const p = str(a, "protein_g");
  if (!w || !p || !(p in PROTEIN_MID)) return undefined;
  return PROTEIN_MID[p] / w;
}
export function carbsPerKg(a: A): number | undefined {
  const w = num(a, "weight_kg");
  const c = str(a, "carbs_g");
  if (!w || !c || !(c in CARBS_MID)) return undefined;
  return CARBS_MID[c] / w;
}
export function sleepHours(a: A): number | undefined {
  const v = str(a, "sleep_hours");
  return v ? SLEEP_MID[v] : undefined;
}

/** the muscle group that carries a lagging area / a stuck lift */
const AREA_GROUP: Record<string, MuscleGroup> = {
  chest: "chest",
  back: "back",
  shoulders: "arms",
  arms: "arms",
  legs: "legs",
  glutes: "legs",
};
const LIFT_GROUP: Record<string, MuscleGroup> = { squat: "legs", deadlift: "legs", bench: "chest", press: "arms" };

/** none / low / ok / high from a group's sessions and hours */
function dose(a: A, g: MuscleGroup): string | undefined {
  const s = groupSessions(a, g);
  const h = groupHours(a, g);
  if (s === undefined || h === undefined) return undefined;
  if (s === 0 || h < 1) return "none";
  if (s === 1 || h < 2) return "low";
  if (s >= 3 && h >= 3.5) return "high";
  return "ok";
}

export const DERIVED: DerivedQuestion[] = [
  {
    id: "bmi_band",
    audience: "both",
    prompt: "Body mass index",
    from: ["height_cm", "weight_kg"],
    options: [
      { value: "under", label: "under 18.5" },
      { value: "normal", label: "18.5–25" },
      { value: "over", label: "25–30" },
      { value: "obese", label: "over 30" },
    ],
    compute: (a) => {
      const b = bmi(a);
      if (b === undefined) return undefined;
      return b < 18.5 ? "under" : b < 25 ? "normal" : b < 30 ? "over" : "obese";
    },
  },
  {
    id: "age_band",
    audience: "both",
    prompt: "Age",
    from: ["age"],
    options: [
      { value: "under_25", label: "under 25" },
      { value: "25_34", label: "25–34" },
      { value: "35_44", label: "35–44" },
      { value: "45_plus", label: "45 or over" },
    ],
    compute: (a) => {
      const n = num(a, "age");
      if (n === undefined) return undefined;
      return n < 25 ? "under_25" : n < 35 ? "25_34" : n < 45 ? "35_44" : "45_plus";
    },
  },
  {
    id: "weekly_hours",
    audience: "both",
    prompt: "Lifting hours a week",
    from: ["chest_hours", "back_hours", "arms_hours", "legs_hours"],
    options: [
      { value: "low", label: "under 3 hours" },
      { value: "moderate", label: "3–7 hours" },
      { value: "high", label: "7–10 hours" },
      { value: "very_high", label: "10 hours or more" },
    ],
    compute: (a) => {
      const h = weeklyHours(a);
      if (h === undefined) return undefined;
      return h < 3 ? "low" : h < 7 ? "moderate" : h < 10 ? "high" : "very_high";
    },
  },
  {
    id: "legs_share",
    audience: "both",
    prompt: "Legs' share of your week",
    from: ["chest_hours", "back_hours", "arms_hours", "legs_hours"],
    options: [
      { value: "low", label: "under a fifth" },
      { value: "ok", label: "a fair share" },
    ],
    compute: (a) => {
      const total = weeklyHours(a);
      const legs = groupHours(a, "legs");
      if (total === undefined || legs === undefined || total === 0) return undefined;
      return legs / total < 0.2 ? "low" : "ok";
    },
  },
  {
    id: "arms_share",
    audience: "both",
    prompt: "Arms' share of your week",
    from: ["chest_hours", "back_hours", "arms_hours", "legs_hours"],
    options: [
      { value: "heavy", label: "over a third" },
      { value: "ok", label: "a fair share" },
    ],
    compute: (a) => {
      const total = weeklyHours(a);
      const arms = groupHours(a, "arms");
      if (total === undefined || arms === undefined || total === 0) return undefined;
      return arms / total > 0.34 ? "heavy" : "ok";
    },
  },
  {
    id: "lagging_dose",
    audience: "physique",
    prompt: "Weekly dose of your slowest area",
    from: ["lagging_area", "chest_sessions", "chest_hours", "back_sessions", "back_hours", "arms_sessions", "arms_hours", "legs_sessions", "legs_hours"],
    options: [
      { value: "none", label: "none" },
      { value: "low", label: "one session or under two hours" },
      { value: "ok", label: "two or three sessions" },
      { value: "high", label: "three or more sessions, over three hours" },
      { value: "na", label: "no single area" },
    ],
    compute: (a) => {
      const area = str(a, "lagging_area");
      if (!area) return undefined;
      const g = AREA_GROUP[area];
      if (!g) return "na";
      return dose(a, g);
    },
  },
  {
    id: "lift_muscle_dose",
    audience: "strength",
    prompt: "Weekly dose of the muscles behind your stuck lift",
    from: ["main_lift", "chest_sessions", "chest_hours", "back_sessions", "back_hours", "arms_sessions", "arms_hours", "legs_sessions", "legs_hours"],
    options: [
      { value: "none", label: "none" },
      { value: "low", label: "one session or under two hours" },
      { value: "ok", label: "two or three sessions" },
      { value: "high", label: "three or more sessions, over three hours" },
    ],
    compute: (a) => {
      const lift = str(a, "main_lift");
      const g = lift ? LIFT_GROUP[lift] : undefined;
      return g ? dose(a, g) : undefined;
    },
  },
  {
    id: "protein_band",
    audience: "both",
    prompt: "Protein per kilo of bodyweight",
    from: ["protein_g", "weight_kg"],
    options: [
      { value: "unknown", label: "not tracked" },
      { value: "low", label: "under 1.2 g/kg" },
      { value: "mid", label: "1.2–1.6 g/kg" },
      { value: "high", label: "1.6 g/kg or more" },
    ],
    compute: (a) => {
      if (str(a, "protein_g") === "unknown") return "unknown";
      const p = proteinPerKg(a);
      if (p === undefined) return undefined;
      return p < 1.2 ? "low" : p < 1.6 ? "mid" : "high";
    },
  },
  {
    id: "carbs_band",
    audience: "both",
    prompt: "Carbs per kilo of bodyweight",
    from: ["carbs_g", "weight_kg"],
    options: [
      { value: "unknown", label: "not tracked" },
      { value: "low", label: "under 2 g/kg" },
      { value: "mid", label: "2–4 g/kg" },
      { value: "high", label: "over 4 g/kg" },
    ],
    compute: (a) => {
      if (str(a, "carbs_g") === "unknown") return "unknown";
      const c = carbsPerKg(a);
      if (c === undefined) return undefined;
      return c < 2 ? "low" : c <= 4 ? "mid" : "high";
    },
  },
  {
    id: "sleep_band",
    audience: "both",
    prompt: "Sleep a night",
    from: ["sleep_hours"],
    options: [
      { value: "short", label: "under 6 hours" },
      { value: "borderline", label: "6–7 hours" },
      { value: "ok", label: "7–9 hours" },
      { value: "long", label: "over 9 hours" },
    ],
    compute: (a) => {
      const v = str(a, "sleep_hours");
      if (!v) return undefined;
      return v === "u5" || v === "5_6" ? "short" : v === "6_7" ? "borderline" : v === "o9" ? "long" : "ok";
    },
  },
  {
    id: "signs_count",
    audience: "both",
    prompt: "Signs in training",
    from: ["training_signs"],
    options: [
      { value: "none", label: "none" },
      { value: "one", label: "one" },
      { value: "several", label: "several" },
    ],
    compute: (a) => {
      const v = a.training_signs;
      if (!Array.isArray(v)) return undefined;
      const signs = v.filter((x) => x !== "none");
      return signs.length === 0 ? "none" : signs.length === 1 ? "one" : "several";
    },
  },
];

/** Every derived value that can be computed from the given answers. */
export function computeDerived(a: A): Record<string, string> {
  const out: Record<string, string> = {};
  for (const d of DERIVED) {
    const v = d.compute(a);
    if (v !== undefined) out[d.id] = v;
  }
  return out;
}
