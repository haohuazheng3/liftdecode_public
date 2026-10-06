import { QUESTIONS } from "@/content/questions";
import { computeDerived, groupHours, GROUPS, proteinPerKg, carbsPerKg, weeklyHours } from "@/content/derived";
import type { Track } from "@/content/types";
import type { Answers } from "@/lib/db/schema";

/**
 * The scorecard: ten dimensions of a lifter's set-up, each scored 0–100 from their own answers
 * with fixed, published weights. It is the same for everyone who gives the same answers, never
 * calls a model, and is shown on the paywall (scores only) and in the report (with the analysis).
 *
 * Each dimension averages a few items. An item turns one answer into 0–1 (1 = the set-up a coach
 * would sign off) and carries a short fact line that quotes the answer, so the lowest items of a
 * weak dimension can be shown as the reason it is weak. Items whose answer is missing (an older
 * assessment, or the other track) are skipped; a dimension with no items is left out.
 */
export type DimensionId =
  | "dose"
  | "effort"
  | "progression"
  | "execution"
  | "fuel"
  | "minerals"
  | "sleep"
  | "conditioning"
  | "life"
  | "consistency";

export interface ScoreItem {
  /** 0–1, 1 = ideal */
  value: number;
  weight: number;
  /** the answer read back, e.g. "Protein: 140–180 g a day (≈ 2.0 g/kg)" */
  fact: string;
}

export interface Dimension {
  id: DimensionId;
  label: string;
  /** what the dimension covers, one short line */
  covers: string;
  /** 0–100 */
  score: number;
  items: ScoreItem[];
}

export const DIMENSION_META: Record<DimensionId, { label: string; covers: string }> = {
  dose: { label: "Training dose", covers: "How much work each muscle gets in a week" },
  effort: { label: "Effort", covers: "How close your sets get to failure" },
  progression: { label: "Progression", covers: "What pushes your numbers up week to week" },
  execution: { label: "Execution", covers: "Range of motion, feel, form and pain" },
  fuel: { label: "Fuel", covers: "Protein, carbs, meal timing and the scale" },
  minerals: { label: "Minerals & sweat", covers: "Sodium and the signs that it runs short" },
  sleep: { label: "Sleep & recovery", covers: "Hours, timing and how rested you wake" },
  conditioning: { label: "Conditioning", covers: "How fast you recover between hard sets" },
  life: { label: "Life load", covers: "Stress, alcohol, caffeine and drive" },
  consistency: { label: "Consistency", covers: "Showing up and the training loop" },
};

const ORDER: DimensionId[] = ["dose", "effort", "progression", "execution", "fuel", "minerals", "sleep", "conditioning", "life", "consistency"];

type A = Record<string, string | string[] | undefined>;

const label = (a: A, qid: string): string | undefined => {
  const v = a[qid];
  if (typeof v !== "string") return undefined;
  return QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.value === v)?.label;
};
const scale = (a: A, qid: string): number | undefined => {
  const v = a[qid];
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 10 ? n : undefined;
};
/** 1 → 0.15 … 10 → 1, for "higher is better" scales */
const up = (n: number) => 0.15 + (0.85 * (n - 1)) / 9;
/** 1 → 1 … 10 → 0.15, for "lower is better" scales */
const down = (n: number) => 1 - (0.85 * (n - 1)) / 9;

function pick(a: A, qid: string, map: Record<string, number>): number | undefined {
  const v = a[qid];
  return typeof v === "string" && v in map ? map[v] : undefined;
}

class Bag {
  items: ScoreItem[] = [];
  add(value: number | undefined, weight: number, fact: string | undefined) {
    if (value === undefined || fact === undefined) return;
    this.items.push({ value: Math.max(0, Math.min(1, value)), weight, fact });
  }
}

const n10 = (n: number) => `${n}/10`;

export function buildScorecard(answers: Answers, track: Track): Dimension[] {
  const a: A = { ...answers, ...computeDerived(answers) };
  const bags = Object.fromEntries(ORDER.map((id) => [id, new Bag()])) as Record<DimensionId, Bag>;
  const physique = track === "physique";

  /* ─── training dose ─── */
  {
    const b = bags.dose;
    const total = weeklyHours(a);
    const band = typeof a.weekly_hours === "string" ? a.weekly_hours : undefined;
    b.add(
      pick(a, "weekly_hours", { low: 0.35, moderate: 1, high: 0.9, very_high: 0.75 }),
      2,
      band && total !== undefined ? `Lifting: about ${total.toFixed(1)} hours a week` : undefined,
    );
    const sessions = label(a, "sessions_week");
    b.add(pick(a, "sessions_week", { "1": 0.3, "2": 0.6, "3": 1, "4": 1, "5": 1, "6": 0.9, "7plus": 0.75 }), 1, sessions ? `${sessions} lifting sessions a week` : undefined);
    const doseMap = { none: 0.1, low: 0.45, ok: 1, high: 0.9 };
    if (physique) {
      const area = label(a, "lagging_area");
      const d = typeof a.lagging_dose === "string" ? a.lagging_dose : undefined;
      if (d && d !== "na" && area) b.add(doseMap[d as keyof typeof doseMap], 2, `Slowest area (${area.toLowerCase()}): ${doseWords(d)} a week`);
    } else {
      const lift = label(a, "main_lift");
      const d = typeof a.lift_muscle_dose === "string" ? a.lift_muscle_dose : undefined;
      if (d && lift) b.add(doseMap[d as keyof typeof doseMap], 2, `Muscles behind the ${lift.toLowerCase()}: ${doseWords(d)} a week`);
    }
    const legs = groupHours(a, "legs");
    b.add(pick(a, "legs_share", { low: 0.45, ok: 1 }), 1, legs !== undefined && total ? `Legs: ${Math.round((legs / total) * 100)}% of your lifting time` : undefined);
    const arms = groupHours(a, "arms");
    b.add(pick(a, "arms_share", { heavy: 0.65, ok: 1 }), 0.5, arms !== undefined && total ? `Arms and shoulders: ${Math.round((arms / total) * 100)}% of your lifting time` : undefined);
  }

  /* ─── effort ─── */
  {
    const b = bags.effort;
    const habit = label(a, "hard_set_habit");
    b.add(pick(a, "hard_set_habit", { stop: 0.3, push: 1, failure: 0.7 }), 2, habit ? `Most sets end: ${habit.toLowerCase()}` : undefined);
    const g = scale(a, "effort_grind");
    if (g !== undefined) b.add(g <= 5 ? 0.2 + 0.16 * (g - 1) : g <= 9 ? 1 : 0.8, 2, `Last rep slows to a grind: ${n10(g)}`);
    if (!physique) {
      const h = scale(a, "heavy_practice");
      if (h !== undefined) b.add(h <= 3 ? 0.4 : h <= 5 ? 0.7 : h <= 7 ? 1 : 0.75, 1.5, `Lifting close to your max: ${n10(h)}`);
    }
  }

  /* ─── progression ─── */
  {
    const b = bags.progression;
    const beat = scale(a, "beat_last");
    if (beat !== undefined) b.add(up(beat), 2, `Trying to beat last time: ${n10(beat)}`);
    const load = label(a, "load_choice");
    b.add(pick(a, "load_choice", { usual: 0.3, feel: 0.6, plan: 1 }), 1.5, load ? `Weights picked: ${load.toLowerCase()}` : undefined);
    const sw = scale(a, "program_switch");
    if (sw !== undefined) b.add(sw <= 3 ? 1 : sw <= 6 ? 0.75 : sw === 7 ? 0.5 : 0.25, 1, `Starting a new program: ${n10(sw)}`);
    if (!physique) {
      const mt = label(a, "max_testing");
      b.add(pick(a, "max_testing", { never: 0.8, few_months: 1, monthly: 0.6, weekly: 0.3 }), 1, mt ? `Max testing: ${mt.toLowerCase()}` : undefined);
    }
  }

  /* ─── execution ─── */
  {
    const b = bags.execution;
    const rom = scale(a, "rom_focus");
    if (rom !== undefined) b.add(up(rom), 1.5, `Full range of motion as a priority: ${n10(rom)}`);
    const pain = scale(a, "pain_limits");
    if (pain !== undefined) b.add(pain <= 2 ? 1 : pain <= 5 ? 0.8 : pain <= 7 ? 0.5 : 0.25, 1.5, `Pain changing how you train: ${n10(pain)}`);
    if (physique) {
      const feel = scale(a, "feel_target");
      if (feel !== undefined) b.add(up(feel), 1.5, `Feeling the target muscle work: ${n10(feel)}`);
      const pr = label(a, "lagging_priority");
      b.add(pick(a, "lagging_priority", { first: 1, middle: 0.7, last: 0.45, skipped: 0.2 }), 1, pr ? `Slowest area trained: ${pr.toLowerCase()}` : undefined);
    } else {
      const form = scale(a, "form_breakdown");
      if (form !== undefined) b.add(down(form), 1.5, `Form change on heavy reps: ${n10(form)}`);
      const wp = scale(a, "weak_point_work");
      if (wp !== undefined) b.add(up(wp), 1, `Work aimed at your weak point: ${n10(wp)}`);
      const fp = label(a, "fail_point");
      b.add(pick(a, "fail_point", { bottom: 1, middle: 1, top: 1, unsure: 0.55 }), 0.5, fp ? `Heavy reps fail: ${fp.toLowerCase()}` : undefined);
    }
  }

  /* ─── fuel ─── */
  {
    const b = bags.fuel;
    const p = proteinPerKg(a);
    const pl = label(a, "protein_g");
    b.add(
      pick(a, "protein_band", { unknown: 0.45, low: 0.3, mid: 0.7, high: 1 }),
      2,
      pl ? (a.protein_g === "unknown" ? "Protein: not tracked" : `Protein: ${pl} g a day${p !== undefined ? ` (≈ ${p.toFixed(1)} g/kg)` : ""}`) : undefined,
    );
    const c = carbsPerKg(a);
    const cl = label(a, "carbs_g");
    b.add(
      pick(a, "carbs_band", { unknown: 0.55, low: 0.35, mid: 1, high: 0.85 }),
      1.5,
      cl ? (a.carbs_g === "unknown" ? "Carbs: not tracked" : `Carbs: ${cl} g a day${c !== undefined ? ` (≈ ${c.toFixed(1)} g/kg)` : ""}`) : undefined,
    );
    const skip = scale(a, "meal_skip");
    if (skip !== undefined) b.add(skip <= 3 ? 1 : skip <= 6 ? 0.7 : skip <= 8 ? 0.4 : 0.2, 1, `Eating less than planned: ${n10(skip)}`);
    const trend = typeof a.weight_trend === "string" ? a.weight_trend : undefined;
    const tl = label(a, "weight_trend");
    if (trend && tl) {
      const aim = typeof a.physique_aim === "string" ? a.physique_aim : undefined;
      const map: Record<string, Record<string, number>> = {
        muscle: { up: 1, same: 0.45, unknown: 0.4, up_fast: 0.5, down: 0.3, down_fast: 0.2 },
        leaner: { down: 1, down_fast: 0.6, same: 0.4, up: 0.25, up_fast: 0.15, unknown: 0.4 },
        both: { up: 0.85, down: 0.85, same: 0.55, unknown: 0.4, up_fast: 0.45, down_fast: 0.4 },
        strength: { up: 1, same: 0.9, up_fast: 0.75, down: 0.45, down_fast: 0.25, unknown: 0.6 },
      };
      const m = physique ? map[aim ?? "muscle"] : map.strength;
      b.add(m?.[trend], 2, `Bodyweight, last 2 months: ${tl.toLowerCase()}`);
    }
    const clean = scale(a, "diet_clean");
    if (clean !== undefined) b.add(up(clean), 1, `Diet cleanliness: ${n10(clean)}`);
    const gap = label(a, "pre_meal");
    b.add(
      pick(a, "pre_meal", { u1: 0.85, "1_2": 1, "2_4": 0.95, o4: 0.6, fasted: 0.5 }),
      1,
      gap ? (a.pre_meal === "fasted" ? "Training fasted" : `Last meal before training: ${gap} hours`) : undefined,
    );
    const pump = scale(a, "pump");
    if (pump !== undefined) b.add(up(pump), 1, `Muscle fullness and pump: ${n10(pump)}`);
    if (physique) {
      const ap = scale(a, "appetite");
      if (ap !== undefined) b.add(ap <= 3 ? 0.5 : ap <= 7 ? 1 : 0.6, 0.5, `Appetite: ${n10(ap)}`);
    }
  }

  /* ─── minerals & sweat ─── */
  {
    const b = bags.minerals;
    const signs = Array.isArray(a.training_signs) ? a.training_signs.filter((x) => x !== "none") : undefined;
    const sweat = typeof a.sweat_level === "string" ? a.sweat_level : undefined;
    if (signs) {
      const base = signs.length === 0 ? 1 : signs.length === 1 ? 0.55 : 0.25;
      const names = signs
        .map((s) => QUESTIONS.find((q) => q.id === "training_signs")?.options.find((o) => o.value === s)?.label.toLowerCase())
        .filter(Boolean)
        .join(", ");
      b.add(base, 2.5, signs.length === 0 ? "No cramps, twitches, dizziness or limp muscles" : `More than once last month: ${names}`);
    }
    const sl = label(a, "sweat_level");
    if (sweat && sl) {
      const withSigns = signs && signs.length > 0;
      const v = { light: 1, moderate: 1, heavy: withSigns ? 0.6 : 0.85, salty: withSigns ? 0.4 : 0.75 }[sweat];
      b.add(v, 1.5, `Sweat in a session: ${sl.toLowerCase()}`);
    }
    const fog = label(a, "brain_fog");
    b.add(pick(a, "brain_fog", { never: 1, sometimes: 0.65, often: 0.35 }), 1, fog ? `Brain fog or sudden weakness: ${fog.toLowerCase()}` : undefined);
    const coffee = label(a, "coffee");
    b.add(pick(a, "coffee", { "0": 1, "1": 1, "2": 0.95, "3": 0.8, "4plus": 0.6 }), 0.5, coffee ? `Coffee: ${coffee === "None" ? "none" : `${coffee} a day`}` : undefined);
  }

  /* ─── sleep & recovery ─── */
  {
    const b = bags.sleep;
    const h = label(a, "sleep_hours");
    b.add(pick(a, "sleep_band", { short: 0.3, borderline: 0.65, ok: 1, long: 0.9 }), 2, h ? `Sleep: ${h} hours a night` : undefined);
    const reg = label(a, "sleep_regular");
    b.add(pick(a, "sleep_regular", { same: 1, shifts: 0.75, often_off: 0.5, all_over: 0.3 }), 1.5, reg ? `Bed and wake times: ${reg.toLowerCase()}` : undefined);
    const full = scale(a, "full_nights");
    if (full !== undefined) b.add(up(full), 1, `Full nights: ${n10(full)}`);
    const rested = scale(a, "wake_rested");
    if (rested !== undefined) b.add(up(rested), 1.5, `Waking rested: ${n10(rested)}`);
  }

  /* ─── conditioning ─── */
  {
    const b = bags.conditioning;
    const rec = label(a, "set_recovery");
    b.add(pick(a, "set_recovery", { u1: 1, "1_2": 0.85, "2_3": 0.5, o3: 0.25 }), 2.5, rec ? `Breathing settles after a hard set of 10: ${rec.toLowerCase()}` : undefined);
    const cardio = label(a, "cardio_sessions");
    b.add(
      pick(a, "cardio_sessions", { "0": 0.35, "1": 0.6, "2": 0.9, "3": 1, "4": 0.95, "5plus": 0.85 }),
      1.5,
      cardio ? `Cardio: ${cardio} session${cardio === "1" ? "" : "s"} a week` : undefined,
    );
    const legs = typeof a.legs_dose === "string" ? a.legs_dose : undefined;
    b.add(pick(a, "legs_dose", { none: 0.3, low: 0.6, ok: 1, high: 1 }), 1, legs ? `Leg work: ${doseWords(legs)} a week` : undefined);
  }

  /* ─── life load ─── */
  {
    const b = bags.life;
    const st = scale(a, "stress");
    if (st !== undefined) b.add(st <= 4 ? 1 : st <= 6 ? 0.75 : st <= 8 ? 0.5 : 0.3, 2, `Life stress: ${n10(st)}`);
    const al = label(a, "alcohol");
    b.add(pick(a, "alcohol", { none: 1, light: 0.9, weekends: 0.55, often: 0.3 }), 1.5, al ? `Alcohol: ${al.toLowerCase()}` : undefined);
    const drive = scale(a, "drive");
    if (drive !== undefined) b.add(up(drive), 1.5, `Urge to train and chase records: ${n10(drive)}`);
    const coffee = label(a, "coffee");
    b.add(pick(a, "coffee", { "0": 1, "1": 1, "2": 0.95, "3": 0.75, "4plus": 0.5 }), 0.5, coffee ? `Coffee: ${coffee === "None" ? "none" : `${coffee} a day`}` : undefined);
  }

  /* ─── consistency ─── */
  {
    const b = bags.consistency;
    const pat = label(a, "training_pattern");
    b.add(pick(a, "training_pattern", { steady: 1, on_off: 0.4, comeback: 0.6 }), 2, pat ? `Last few months: ${pat.toLowerCase()}` : undefined);
    const loop = scale(a, "loop_score");
    if (loop !== undefined) b.add(up(loop), 2, `Training loop: ${n10(loop)}`);
    const sessions = label(a, "sessions_week");
    b.add(pick(a, "sessions_week", { "1": 0.35, "2": 0.65, "3": 1, "4": 1, "5": 1, "6": 1, "7plus": 1 }), 1, sessions ? `${sessions} sessions a week` : undefined);
  }

  const out: Dimension[] = [];
  for (const id of ORDER) {
    const items = bags[id].items;
    if (!items.length) continue;
    const w = items.reduce((s, i) => s + i.weight, 0);
    const v = items.reduce((s, i) => s + i.value * i.weight, 0) / w;
    out.push({ id, ...DIMENSION_META[id], score: Math.max(5, Math.round(v * 100)), items });
  }
  return out;
}

function doseWords(d: string): string {
  return d === "none" ? "next to nothing" : d === "low" ? "a light dose" : d === "ok" ? "a moderate dose" : "a heavy dose";
}

/** The items that pull a dimension down most (value under 0.8), worst first. */
export function weakestItems(d: Dimension, max = 2): ScoreItem[] {
  return [...d.items]
    .filter((i) => i.value < 0.8)
    .sort((x, y) => x.value - y.value || y.weight - x.weight)
    .slice(0, max);
}

/** Which dimension a finding belongs to, for hooks and the report's scorecard notes. */
export const FINDING_DIMENSION: Record<string, DimensionId | null> = {
  sets_end_too_early: "effort",
  failure_every_set: "effort",
  no_forcing_function: "progression",
  program_hopping: "progression",
  testing_instead_of_training: "progression",
  never_heavy_enough: "effort",
  lagging_part_trained_last: "dose",
  strength_without_muscle: "dose",
  main_lift_underpractised: "dose",
  target_muscle_underdosed: "dose",
  sticking_point_untrained: "execution",
  form_breaks_under_load: "execution",
  rom_shrinking: "execution",
  training_around_pain: "execution",
  volume_outruns_recovery: "sleep",
  sleep_under_dose: "sleep",
  sleep_clock_drifts: "sleep",
  conditioning_caps_volume: "conditioning",
  cardio_eating_the_budget: "conditioning",
  life_is_the_limiter: "life",
  drive_has_faded: "life",
  alcohol_tax: "life",
  caffeine_overload: "life",
  deficit_while_expecting_muscle: "fuel",
  no_surplus_no_growth: "fuel",
  recomp_window_closed: "fuel",
  gaining_too_fast: "fuel",
  fat_loss_without_deficit: "fuel",
  week_cancels_itself: "fuel",
  protein_unknown: "fuel",
  protein_below_target: "fuel",
  underfuelled_sessions: "fuel",
  inflammatory_diet: "fuel",
  strength_leaking_bodyweight: "fuel",
  electrolytes_running_low: "minerals",
  missed_dose: "consistency",
  consistency_gap: "consistency",
  restart_not_stall: "consistency",
  expecting_year_one_speed: null,
};

/** for the profile strip on the paywall: "chest 2× 40–60 min" style, per group */
export function weekLine(answers: Answers): string | undefined {
  const parts: string[] = [];
  for (const g of GROUPS) {
    const s = label(answers, `${g}_sessions`);
    const t = label(answers, `${g}_time`);
    if (!s || !t) return undefined;
    parts.push(s === "0" ? `${g} 0×` : `${g} ${s}× ${t}`);
  }
  return parts.join(" · ");
}
