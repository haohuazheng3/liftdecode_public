import { z } from "zod";

/**
 * The shape of the paid analysis. The model fills it through structured outputs (the API only
 * returns JSON that matches it), and the report page renders it section by section. Field
 * descriptions travel with the schema and steer length and content; numeric and length limits
 * are not supported by structured outputs, so counts are checked after parsing (see checkReport).
 *
 * Property order matters: the model writes in this order, and the waiting screen reads which
 * property it has reached to show progress (src/lib/ai/stages.ts).
 */
export const PROMPT_VERSION = "ai-report-v1";

export const FINDING_IDS = [
  "sets_end_too_early",
  "failure_every_set",
  "no_forcing_function",
  "program_hopping",
  "lagging_part_trained_last",
  "never_heavy_enough",
  "testing_instead_of_training",
  "strength_without_muscle",
  "main_lift_underpractised",
  "target_muscle_underdosed",
  "sticking_point_untrained",
  "form_breaks_under_load",
  "rom_shrinking",
  "volume_outruns_recovery",
  "sleep_under_dose",
  "sleep_clock_drifts",
  "life_is_the_limiter",
  "drive_has_faded",
  "training_around_pain",
  "conditioning_caps_volume",
  "deficit_while_expecting_muscle",
  "no_surplus_no_growth",
  "recomp_window_closed",
  "gaining_too_fast",
  "fat_loss_without_deficit",
  "week_cancels_itself",
  "protein_unknown",
  "protein_below_target",
  "underfuelled_sessions",
  "inflammatory_diet",
  "electrolytes_running_low",
  "strength_leaking_bodyweight",
  "cardio_eating_the_budget",
  "alcohol_tax",
  "caffeine_overload",
  "missed_dose",
  "consistency_gap",
  "restart_not_stall",
  "expecting_year_one_speed",
] as const;

export const DIMENSION_IDS = ["dose", "effort", "progression", "execution", "fuel", "minerals", "sleep", "conditioning", "life", "consistency"] as const;

const text = (d: string) => z.string().describe(d);

export const AiReportSchema = z.object({
  headline: text(
    "The diagnosis in one plain sentence, second person, under 110 characters. Name the main problem. No hype, no question.",
  ),
  summary: text(
    "3-4 sentences: what is holding this lifter back, why, and what changes first. Use their own numbers. No hedging filler.",
  ),
  rootCause: z.object({
    title: text("The single cause underneath the others, 3-8 words."),
    explanation: text("3-4 sentences: why this is the root and not a symptom, tied to specific answers."),
  }),
  chain: z
    .array(
      z.object({
        label: text("A node label, 2-6 words."),
        detail: text("One sentence: how this link drives the next one, grounded in their answers."),
      }),
    )
    .describe("4-5 links from the root cause to the stall they feel, in causal order. The last link is the stall itself."),
  firstMove: z.object({
    title: text("If they change only one thing this week: the move, 3-9 words, imperative."),
    why: text("1-2 sentences: why this move first."),
    how: text("2-3 sentences: exactly what to do, with numbers (grams, sets, minutes, days)."),
  }),
  problems: z
    .array(
      z.object({
        findingId: z
          .enum(FINDING_IDS)
          .nullable()
          .describe("The engine finding this explains, or null for a problem drawn from the scorecard."),
        title: text("The problem as a short, plain statement, second person, under 70 characters."),
        severity: z.enum(["high", "medium", "low"]),
        inYourCase: text("3-5 sentences: why this is happening to this lifter specifically. Quote their numbers and connect answers."),
        cost: text("1-2 sentences: what it is costing them in progress, concretely. No invented statistics."),
        fix: z.array(text("One concrete step in their numbers.")).describe("3-5 steps."),
      }),
    )
    .describe("Every actionable engine finding in priority order (at most 7). If there are fewer than 3, add the weakest scorecard dimensions as problems with findingId null."),
  scorecard: z
    .array(
      z.object({
        id: z.enum(DIMENSION_IDS),
        read: text("1-2 sentences: why this score is what it is, from their answers, and the single lever that moves it."),
      }),
    )
    .describe("One entry per scorecard dimension given in the input, same order."),
  doseAudit: z.object({
    verdict: text("2-3 sentences on their weekly training dose as a whole."),
    groups: z
      .array(
        z.object({
          group: z.enum(["chest", "back", "arms", "legs"]),
          read: text("1-2 sentences: what their sessions and time mean in hard sets a week, against what grows muscle."),
          change: text("One sentence: keep, add or cut, with numbers."),
        }),
      )
      .describe("Exactly the four groups: chest, back, arms, legs."),
  }),
  fuelAudit: z.object({
    verdict: text("2-3 sentences: whether their food matches their goal and training."),
    protein: text("2-3 sentences on protein, with their g/kg and the target in grams for their weight."),
    carbs: text("2-3 sentences on carbs: muscle glycogen, blood sugar in the session, their g/kg against their workload."),
    timing: text("1-2 sentences on the gap between their last meal and training."),
    minerals: text("2-3 sentences on sodium and minerals: their sweat, signs, caffeine and diet. Explain the electrolyte link if signs are present."),
    bodyweight: text("1-2 sentences: what their two-month weight trend says against their goal."),
  }),
  recovery: z.object({
    verdict: text("2-3 sentences on recovery overall."),
    sleep: text("2-3 sentences: hours, timing regularity, full nights, waking rested."),
    stress: text("1-2 sentences: stress, alcohol, caffeine and drive as they bear on recovery."),
  }),
  conditioning: z.object({
    verdict: text("2-3 sentences: their aerobic base from set-to-set recovery, cardio count and leg work."),
    science: text(
      "3-4 sentences in plain words: why aerobic fitness matters for muscle growth (recovery between sets, quality reps per session, blood supply to muscle) and where cardio starts to interfere.",
    ),
    prescription: text("2-3 sentences: what to do about it, with sessions, minutes and intensity, or why to leave it as it is."),
  }),
  plan: z
    .array(
      z.object({
        focus: text("The week's theme, 3-8 words."),
        actions: z.array(text("One concrete action for the week, with numbers.")).describe("3-5 actions."),
      }),
    )
    .describe("Exactly 4 entries: weeks 1-4, building on each other."),
  track: z
    .array(
      z.object({
        metric: text("What to measure, 2-6 words."),
        now: text("Their current value from the answers, or 'not tracked'."),
        target: text("The target value."),
        checkIn: text("When and how to check, one short phrase."),
      }),
    )
    .describe("3-5 numbers to track over the four weeks."),
  keep: z.array(text("One thing already working that they should not change, one sentence.")).describe("2-5 items."),
  retest: text("1-2 sentences: when to re-run the diagnostic and what should have moved by then."),
  closing: text("2-3 sentences: a coach's closing note, warm and direct, no clichés."),
});

export type AiReport = z.infer<typeof AiReportSchema>;

/** Counts that structured outputs cannot enforce. Returns the problems found (empty = good). */
export function checkReport(r: AiReport): string[] {
  const out: string[] = [];
  if (r.plan.length !== 4) out.push(`plan has ${r.plan.length} weeks`);
  if (r.problems.length < 1) out.push("no problems");
  if (r.chain.length < 2) out.push("chain too short");
  if (new Set(r.doseAudit.groups.map((g) => g.group)).size < 4) out.push("dose audit misses a group");
  return out;
}
