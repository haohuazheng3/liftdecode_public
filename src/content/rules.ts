/**
 * LiftDecode rules — findings (answer patterns → bottlenecks) and clearances
 * ("this is NOT your problem").
 *
 * Scoring (see src/lib/engine/diagnose.ts): a finding's score is the sum of the
 * weights of its matching triggers; it appears when score ≥ threshold. A finding
 * listed in `suppressedBy` is hidden when the named finding is present with a
 * strictly higher score. Clearances fire when `when` matches.
 *
 * Design rules baked into the thresholds:
 *   - No finding fires on a single weight-1 or weight-2 answer. Several fire on a
 *     single weight-4/5 answer because that answer is, on its own, the diagnosis
 *     (e.g. "6+ reps in reserve", "under 60 s rest", "weekends undo the week").
 *   - Interaction findings (volume_outruns_recovery, deficit_while_expecting_muscle,
 *     no_surplus_no_growth, consistency_gap, cardio_eating_the_budget) require both
 *     halves of the interaction; neither half fires them alone.
 *   - Nutrition findings are gated by the stated goal or by the body-weight trend,
 *     so a deliberate cutter is never told "stop dieting", and a strength lifter
 *     is only told to eat when body weight is actually falling.
 *   - Contradictory pairs are resolved with suppressedBy (hidden_progress beats
 *     "nothing forces the weight up"; failure_every_set vs sets_end_too_early is
 *     mutual; the consistency illusion beats the plain missed-dose finding; the
 *     recomp finding outscores "no surplus" by construction whenever both fire).
 *
 * Every `because` line is second person and may quote the answer with
 * {answer:question_id}; the engine renders the selected label(s) in quotes.
 *
 * 36 findings, 12 clearances. Track-gated triggers inside "both" findings use
 * { all: [{ track }, ...] }. The "goal" question is the track selector; it feeds
 * every track-gated trigger through the track it selects, and one trigger
 * directly (rest_too_short).
 */
import type { ClearanceRule, Condition, FindingRule } from "./types";

/* ───────────────────────── reusable conditions ───────────────────────── */

const PHYSIQUE: Condition = { track: "physique" };
const STRENGTH: Condition = { track: "strength" };

/** Body weight falling over the last 8 weeks. */
const WEIGHT_DOWN: Condition = { q: "bodyweight_trend_8wk", in: ["down_over_2kg", "down_slightly"] };

/** Working sets that genuinely approach failure. */
const RIR_HARD: Condition = { q: "rir_last_set", in: ["0_1", "2_3", "past_failure"] };
/** Working sets that end far from failure (or unknown, which usually means far). */
const RIR_FAR: Condition = { q: "rir_last_set", in: ["4_5", "6_plus", "no_idea"] };

/** Fewer than 4 nights of 7+ hours in the last week. */
const SLEEP_SHORT: Condition = { q: "sleep_7h_nights", in: ["0_1", "2_3"] };

/** Life load that spends recovery: sustained stress, a crisis, or a physical job. */
const LIFE_LOAD: Condition = { q: "lifestyle_load", in: ["high_stress", "crisis", "physical_job"] };

/** Protein not known to clear 1.6 g/kg. */
const PROTEIN_NOT_COVERED: Condition = { q: "protein_yesterday", in: ["know_low", "guess", "no_idea", "day_varies"] };

/** Three or more years of structured training. */
const TRAINED_3Y_PLUS: Condition = { q: "training_age", in: ["3_6y", "over_6y"] };

/** Physique goals that want new muscle out of the next six months. */
const WANTS_MUSCLE: Condition = { q: "physique_goal", in: ["gain_muscle", "lagging_part"] };

/**
 * A high training dose, expressed per track: 16+ genuinely hard sets a week on
 * the target muscle (physique), 16+ heavy sets or an all-heavy / test-every-week
 * intensity pattern (strength), or every set to failure (either).
 */
const HIGH_DOSE: Condition = {
  any: [
    { all: [PHYSIQUE, { q: "hard_sets_lagging", in: ["16_22", "over_22"] }, RIR_HARD] },
    {
      all: [
        STRENGTH,
        {
          any: [
            { q: "main_lift_sets", in: ["16_plus"] },
            { q: "intensity_mix", in: ["always_heavy", "max_attempts_weekly"] },
          ],
        },
      ],
    },
    { q: "last_true_failure", in: ["every_set"] },
  ],
};

/* ───────────────────────────── findings ───────────────────────────── */

export const FINDING_RULES: FindingRule[] = [
  /* ============================ measurement ============================ */
  {
    id: "wrong_progress_signal",
    audience: "physique",
    category: "measurement",
    threshold: 6,
    suppressedBy: ["hidden_progress", "no_numbers_no_stall"],
    triggers: [
      {
        when: { q: "stall_evidence", in: ["scale"] },
        weight: 3,
        because:
          "You count the number on the scale as evidence that you're stuck — and daily scale weight can't see the 100–250 g a month that muscle arrives at.",
      },
      {
        when: { q: "stall_evidence", in: ["mirror", "others"] },
        weight: 3,
        because:
          "Your evidence is what you see in the mirror or what other people say — neither has a baseline to compare against, and neither has a memory.",
      },
      {
        when: { q: "stall_duration", in: ["under_4wk", "4_8wk"] },
        weight: 2,
        because:
          "Your \"stall\" is {answer:stall_duration} old, which is inside the noise of every measure you named.",
      },
      {
        when: { q: "lift_progress_8wk", in: ["up_clearly", "up_barely"] },
        weight: 2,
        because:
          "Your lift on the target muscle is moving ({answer:lift_progress_8wk}) — the earliest signal of growth, and the one you're not looking at.",
      },
      {
        when: { q: "progress_record", in: ["memory", "nowhere"] },
        weight: 1,
        because: "Your lifting record lives {answer:progress_record}, so rep progress can't rescue the picture either.",
      },
      {
        when: { q: "stall_evidence", notIn: ["photos_tape", "log"] },
        weight: 1,
        because: "None of your evidence comes from something you recorded the same way twice.",
      },
    ],
  },
  {
    id: "bad_comparison",
    audience: "both",
    category: "measurement",
    threshold: 7,
    suppressedBy: ["hidden_progress", "no_numbers_no_stall"],
    triggers: [
      {
        when: { all: [STRENGTH, { q: "lift_calibration_4wk", in: ["comparing_pr"] }] },
        weight: 5,
        because:
          "You told us you've been measuring against an old PR rather than the last month: {answer:lift_calibration_4wk}. A rested, tested best against a tired working set isn't a stall — it's a bad comparison.",
      },
      {
        when: { q: "stall_duration", in: ["under_4wk"] },
        weight: 4,
        because:
          "Your last clear step forward was {answer:stall_duration} ago — inside normal noise for anyone past their first year.",
      },
      {
        when: { q: "training_age", in: ["1_3y"] },
        weight: 1,
        because: "You're at {answer:training_age}, where four flat weeks happen inside every good month.",
      },
      {
        when: TRAINED_3Y_PLUS,
        weight: 2,
        because: "You're at {answer:training_age}: flat weeks are nothing and flat months are normal.",
      },
      {
        when: { q: "stall_evidence", in: ["feel"] },
        weight: 1,
        because:
          "Part of your evidence is that sessions feel harder, which tracks last night's sleep and this week's fatigue, not your strength.",
      },
      {
        when: { q: "readiness_signals", in: ["warmups_heavy"] },
        weight: 1,
        because: "Your warm-ups feel heavy, which makes every working set feel like a stall before it is one.",
      },
    ],
  },
  {
    id: "no_numbers_no_stall",
    audience: "both",
    category: "measurement",
    threshold: 7,
    triggers: [
      {
        when: { q: "progress_record", in: ["nowhere"] },
        weight: 4,
        because: "Asked where we'd find what you lifted three sessions ago, you said: {answer:progress_record}.",
      },
      {
        when: { q: "progress_record", in: ["memory"] },
        weight: 3,
        because: "Your record is {answer:progress_record} — and memory rounds toward whatever you did last time.",
      },
      {
        when: { q: "progress_record", in: ["top_sets_only"] },
        weight: 1,
        because:
          "You log {answer:progress_record}, which hides the back-off work where most rep progress happens.",
      },
      {
        when: { all: [PHYSIQUE, { q: "lift_progress_8wk", in: ["dont_know"] }] },
        weight: 3,
        because: "You can't say what your target lift did over 8 weeks: {answer:lift_progress_8wk}.",
      },
      {
        when: { all: [STRENGTH, { q: "lift_calibration_4wk", in: ["no_record"] }] },
        weight: 3,
        because: "You don't have your heaviest set from four weeks ago to compare with this week.",
      },
      {
        when: { q: "progression_rule", in: ["memory_feel", "same_always", "plates"] },
        weight: 1,
        because: "You choose your load by {answer:progression_rule}, so no log is being written.",
      },
      {
        when: { q: "bodyweight_trend_8wk", in: ["dont_weigh"] },
        weight: 1,
        because: "You don't weigh yourself regularly, so the body-weight trend is missing too.",
      },
      {
        when: { q: "stall_evidence", notIn: ["log", "photos_tape"] },
        weight: 1,
        because: "None of your evidence comes from something you recorded the same way twice.",
      },
      {
        when: { q: "stall_duration", in: ["over_1y"] },
        weight: 1,
        because: "And you can't point to your last clear step forward.",
      },
    ],
    suppressedBy: ["hidden_progress"],
  },
  {
    id: "hidden_progress",
    audience: "both",
    category: "measurement",
    threshold: 7,
    triggers: [
      {
        when: { all: [STRENGTH, { q: "lift_calibration_4wk", in: ["higher_now"] }] },
        weight: 5,
        because:
          "Your heaviest set this week beat four weeks ago: {answer:lift_calibration_4wk}. That is progress by every definition a coach uses.",
      },
      {
        when: { all: [PHYSIQUE, { q: "lift_progress_8wk", in: ["up_clearly"] }] },
        weight: 5,
        because:
          "Your lift on the muscle you want to change is {answer:lift_progress_8wk} over 8 weeks — the earliest signal of growth, and it's positive.",
      },
      {
        when: { q: "stall_duration", in: ["under_4wk", "4_8wk"] },
        weight: 3,
        because: "And your \"stall\" is {answer:stall_duration} old, inside normal noise.",
      },
      {
        when: { q: "stall_evidence", in: ["mirror", "scale"] },
        weight: 1,
        because: "You're judging by the mirror or the scale, which lag rep progress by months.",
      },
    ],
  },

  /* ============================ progression ============================ */
  {
    id: "no_forcing_function",
    audience: "both",
    category: "progression",
    threshold: 7,
    suppressedBy: ["hidden_progress"],
    triggers: [
      {
        when: { q: "progression_rule", in: ["same_always"] },
        weight: 5,
        because: "You use {answer:progression_rule} — which is a description of a plateau, not a plan.",
      },
      {
        when: { q: "progression_rule", in: ["plates"] },
        weight: 4,
        because: "Your load is {answer:progression_rule} — there is no rule, so overload happens by accident.",
      },
      {
        when: { q: "progression_rule", in: ["memory_feel"] },
        weight: 3,
        because: "You decide by memory and feel, which drifts toward comfortable.",
      },
      {
        when: { q: "progression_rule", in: ["max_out_daily"] },
        weight: 1,
        because: "You work up to a daily max, which is a test, not a progression.",
      },
      {
        when: { q: "program_changes_6mo", in: ["same_for_years"] },
        weight: 1,
        because: "And you've run the same routine for years, so nothing outside the rule forces a change either.",
      },
      {
        when: { q: "stall_evidence", in: ["log"] },
        weight: 1,
        because: "Your log shows the same weights for weeks — that's the rule doing exactly what it does.",
      },
      {
        when: { all: [PHYSIQUE, { q: "lift_progress_8wk", in: ["same", "down"] }] },
        weight: 1,
        because: "Your target lift over 8 weeks: {answer:lift_progress_8wk}.",
      },
      {
        when: { all: [STRENGTH, { q: "lift_calibration_4wk", in: ["same", "lower_now"] }] },
        weight: 1,
        because: "And four weeks later your heaviest set is {answer:lift_calibration_4wk}.",
      },
      {
        when: { q: "program_changes_6mo", in: ["no_program"] },
        weight: 1,
        because: "You don't run a program, so nothing carries a target from one session to the next.",
      },
      {
        when: { q: "progress_record", in: ["memory", "nowhere"] },
        weight: 1,
        because: "You have no written last time, so there is nothing to beat.",
      },
    ],
  },

  /* ============================== effort ============================== */
  {
    id: "sets_end_too_early",
    audience: "both",
    category: "effort",
    threshold: 7,
    suppressedBy: ["failure_every_set"],
    triggers: [
      {
        when: { q: "rir_last_set", in: ["6_plus"] },
        weight: 5,
        because: "On your last set last week you had {answer:rir_last_set} in reserve.",
      },
      {
        when: { q: "rir_last_set", in: ["4_5"] },
        weight: 4,
        because: "You had {answer:rir_last_set} reps left on your last hard set.",
      },
      {
        when: { q: "rir_last_set", in: ["no_idea"] },
        weight: 3,
        because:
          "Asked how many reps you had left, you said {answer:rir_last_set} — and an untested estimate almost always runs easy.",
      },
      {
        when: { q: "last_true_failure", in: ["never_intentionally"] },
        weight: 2,
        because: "You've never deliberately taken a set to failure, so your \"hard\" has no anchor.",
      },
      {
        when: { q: "last_true_failure", in: ["months_ago"] },
        weight: 1,
        because: "It has been months since you felt a rep not go up.",
      },
      {
        when: { q: "deload_practice", in: ["constantly_easy"] },
        weight: 2,
        because: "You told us most weeks are already easy.",
      },
      {
        when: { q: "progression_rule", in: ["memory_feel"] },
        weight: 1,
        because: "You load by feel, and feel tends to pick the weight you can be comfortable with.",
      },
      {
        when: { q: "training_age", in: ["under_1y"] },
        weight: 1,
        because: "You're in your first year, when the bar should still move most weeks — and effort is the first suspect when it doesn't.",
      },
      {
        when: { all: [STRENGTH, { q: "sticking_point", in: ["never_fails"] }] },
        weight: 1,
        because: "Your lift never fails — you stop before it grinds.",
      },
      {
        when: { all: [PHYSIQUE, { q: "hard_sets_lagging", in: ["16_22", "over_22"] }, RIR_FAR] },
        weight: 1,
        because:
          "And you do {answer:hard_sets_lagging} of those sets a week, so the fatigue is real even when the stimulus isn't.",
      },
    ],
  },
  {
    id: "failure_every_set",
    audience: "both",
    category: "effort",
    threshold: 6,
    suppressedBy: ["sets_end_too_early"],
    triggers: [
      {
        when: { q: "last_true_failure", in: ["every_set"] },
        weight: 4,
        because: "You take {answer:last_true_failure} to failure.",
      },
      {
        when: { q: "rir_last_set", in: ["past_failure"] },
        weight: 3,
        because: "You routinely go past the point where form holds: {answer:rir_last_set}.",
      },
      {
        when: { q: "rir_last_set", in: ["0_1"] },
        weight: 1,
        because: "Your last set ended at {answer:rir_last_set}.",
      },
      {
        when: { q: "readiness_signals", in: ["warmups_heavy", "constant_soreness"] },
        weight: 1,
        because: "Your warm-ups feel heavy or your soreness never clears — that's what accumulated fatigue looks like.",
      },
      {
        when: { q: "deload_practice", in: ["never", "when_beat_up"] },
        weight: 1,
        because: "And you never clear the fatigue on purpose: {answer:deload_practice}.",
      },
      {
        when: { q: "rest_between_sets", in: ["under_60", "60_90"] },
        weight: 1,
        because: "You rest {answer:rest_between_sets}, so each \"failure\" is mostly the previous set's fatigue.",
      },
    ],
  },
  {
    id: "rest_too_short",
    audience: "both",
    category: "effort",
    threshold: 7,
    triggers: [
      {
        when: { q: "rest_between_sets", in: ["under_60"] },
        weight: 5,
        because: "You rest {answer:rest_between_sets} — you're resting for cardio and lifting for muscle.",
      },
      {
        when: { q: "rest_between_sets", in: ["60_90"] },
        weight: 3,
        because: "You rest {answer:rest_between_sets}; at that length, compound sets are limited by breathing before the muscle is.",
      },
      {
        when: { q: "rest_between_sets", in: ["never_timed"] },
        weight: 2,
        because: "You've never timed your rest, and untimed rest is almost always short.",
      },
      {
        when: { q: "rir_last_set", in: ["4_5", "6_plus"] },
        weight: 1,
        because: "Your sets also end early ({answer:rir_last_set}), so each one delivers very little.",
      },
      {
        when: { q: "goal", in: ["strength"] },
        weight: 1,
        because: "You're training for strength, where rest is part of the dose: a 60-second squat set is a fatigue test, not a strength stimulus.",
      },
      {
        when: { q: "last_true_failure", in: ["every_set"] },
        weight: 1,
        because: "And you take every set to failure, which makes short rest cost even more.",
      },
    ],
  },

  /* ============================== volume ============================== */
  {
    id: "target_muscle_underdosed",
    audience: "physique",
    category: "volume",
    threshold: 7,
    triggers: [
      {
        when: { q: "hard_sets_lagging", in: ["under_6"] },
        weight: 5,
        because: "The muscle you most want to change gets {answer:hard_sets_lagging} working sets a week from you.",
      },
      {
        when: { q: "hard_sets_lagging", in: ["6_9"] },
        weight: 3,
        because: "You give it {answer:hard_sets_lagging} sets a week, which is below the effective floor for a trained lifter.",
      },
      {
        when: { q: "hard_sets_lagging", in: ["no_idea"] },
        weight: 2,
        because: "You couldn't count its sets, which usually means they aren't planned.",
      },
      {
        when: { q: "lagging_frequency", in: ["1"] },
        weight: 2,
        because: "You train it on {answer:lagging_frequency}, so half those sets land on a muscle that's already tired.",
      },
      {
        when: { q: "lagging_frequency", in: ["irregular"] },
        weight: 1,
        because: "You give it {answer:lagging_frequency}.",
      },
      {
        when: { q: "lagging_priority", in: ["end_of_session", "whenever"] },
        weight: 2,
        because: "And you train it {answer:lagging_priority}, with whatever energy is left.",
      },
      {
        when: { q: "lagging_priority", in: ["not_directly"] },
        weight: 3,
        because: "You don't train it directly: {answer:lagging_priority}.",
      },
      {
        when: { q: "physique_goal", in: ["lagging_part"] },
        weight: 1,
        because: "And bringing it up is your stated goal.",
      },
    ],
    suppressedBy: ["volume_outruns_recovery"],
  },
  {
    id: "main_lift_underpractised",
    audience: "strength",
    category: "volume",
    threshold: 7,
    triggers: [
      {
        when: { q: "main_lift_sets", in: ["under_5"] },
        weight: 5,
        because: "You do {answer:main_lift_sets} sets a week on the lift and its close variations.",
      },
      {
        when: { q: "main_lift_sets", in: ["5_9"] },
        weight: 2,
        because: "You do {answer:main_lift_sets} heavy sets a week — enough to maintain a trained lifter, rarely enough to build one.",
      },
      {
        when: { q: "main_lift_sets", in: ["no_idea"] },
        weight: 2,
        because: "You can't count the sets on your priority lift.",
      },
      {
        when: { q: "main_lift_frequency", in: ["variations_only"] },
        weight: 5,
        because:
          "You barely do the lift itself: {answer:main_lift_frequency}. Variations build muscle, not the exact skill and positions the lift is failing on.",
      },
      {
        when: { q: "main_lift_frequency", in: ["1"] },
        weight: 3,
        because: "And you practise it {answer:main_lift_frequency} a week.",
      },
      {
        when: { q: "main_lift_frequency", in: ["irregular"] },
        weight: 2,
        because: "Your frequency is irregular, so some weeks it's zero.",
      },
      {
        when: { q: "intensity_mix", in: ["high_rep_only"] },
        weight: 1,
        because: "Most of your reps are at loads too light to count as practice.",
      },
    ],
    suppressedBy: ["volume_outruns_recovery"],
  },

  /* ============================ programming ============================ */
  {
    id: "testing_instead_of_training",
    audience: "strength",
    category: "programming",
    threshold: 7,
    triggers: [
      {
        when: { q: "intensity_mix", in: ["max_attempts_weekly"] },
        weight: 5,
        because: "You told us: {answer:intensity_mix}. That's a test week, every week.",
      },
      {
        when: { q: "intensity_mix", in: ["always_heavy"] },
        weight: 4,
        because: "Your loads are {answer:intensity_mix}.",
      },
      {
        when: { q: "progression_rule", in: ["max_out_daily"] },
        weight: 3,
        because: "You work up to the heaviest you can manage most sessions — a test, not a progression.",
      },
      {
        when: { q: "rir_last_set", in: ["0_1", "past_failure"] },
        weight: 1,
        because: "And your sets end at {answer:rir_last_set}.",
      },
      {
        when: { q: "deload_practice", in: ["never", "when_beat_up"] },
        weight: 1,
        because: "And you never clear the fatigue on purpose: {answer:deload_practice}.",
      },
      {
        when: { q: "lift_calibration_4wk", in: ["comparing_pr"] },
        weight: 1,
        because: "You judge yourself against the last test.",
      },
      {
        when: TRAINED_3Y_PLUS,
        weight: 1,
        because: "You're at {answer:training_age}, where tests cost more and move less.",
      },
    ],
  },
  {
    id: "never_heavy_enough",
    audience: "strength",
    category: "programming",
    threshold: 7,
    triggers: [
      {
        when: { q: "intensity_mix", in: ["high_rep_only"] },
        weight: 5,
        because: "You told us: {answer:intensity_mix}.",
      },
      {
        when: { q: "intensity_mix", in: ["always_moderate"] },
        weight: 4,
        because: "You rarely do anything under 5 reps, so a heavy single is something your nervous system hasn't rehearsed.",
      },
      {
        when: { q: "sticking_point", in: ["never_fails"] },
        weight: 2,
        because: "Your lift never fails, because you never load it enough to.",
      },
      {
        when: { q: "weak_point_work", in: ["nothing_to_aim_at"] },
        weight: 1,
        because: "You have no weak position to aim at because the load has never been high enough to find one.",
      },
      {
        when: { q: "expected_strength_rate", in: ["weekly_pr", "monthly_small"] },
        weight: 1,
        because: "And you expect the max to move anyway.",
      },
      {
        when: { q: "deload_practice", in: ["constantly_easy"] },
        weight: 1,
        because: "You told us most weeks are already easy.",
      },
    ],
  },
  {
    id: "program_hopping",
    audience: "both",
    category: "programming",
    threshold: 7,
    triggers: [
      {
        when: { q: "program_changes_6mo", in: ["4_plus"] },
        weight: 5,
        because: "You changed programs {answer:program_changes_6mo} in six months.",
      },
      {
        when: { q: "program_changes_6mo", in: ["2_3"] },
        weight: 3,
        because: "You changed it {answer:program_changes_6mo} in six months, so no block ran long enough to read.",
      },
      {
        when: { q: "program_changes_6mo", in: ["no_program"] },
        weight: 4,
        because: "You don't run a program at all: {answer:program_changes_6mo}.",
      },
      {
        when: { all: [STRENGTH, { q: "intensity_mix", in: ["feel_based"] }] },
        weight: 2,
        because: "Your intensity has no pattern either: {answer:intensity_mix}.",
      },
      {
        when: { q: "compare_to", in: ["lifters_online"] },
        weight: 1,
        because: "And your reference point is online, where the next method is always one scroll away.",
      },
      {
        when: { q: "progression_rule", in: ["plates"] },
        weight: 1,
        because: "Your load follows whatever's on the bar — the same instinct that swaps the plan.",
      },
    ],
  },
  {
    id: "lagging_part_trained_last",
    audience: "physique",
    category: "programming",
    threshold: 4,
    suppressedBy: ["target_muscle_underdosed"],
    triggers: [
      {
        when: { q: "lagging_priority", in: ["end_of_session"] },
        weight: 4,
        because: "Your weakest part is trained {answer:lagging_priority} — it gets your worst energy.",
      },
      {
        when: { q: "lagging_priority", in: ["whenever"] },
        weight: 3,
        because: "You fit it in {answer:lagging_priority}, which means after everything that matters more in the moment.",
      },
      {
        when: { q: "lagging_frequency", in: ["1", "irregular"] },
        weight: 1,
        because: "And you give it {answer:lagging_frequency}.",
      },
    ],
  },

  /* ============================= technique ============================= */
  {
    id: "rom_shrinking",
    audience: "both",
    category: "technique",
    threshold: 6,
    triggers: [
      {
        when: { q: "technique_video", in: ["rom_shrinks_with_load"] },
        weight: 4,
        because: "You said a video would show {answer:technique_video}. Some of your past \"progress\" was range leaving the lift.",
      },
      {
        when: { q: "technique_video", in: ["setup_varies"] },
        weight: 3,
        because: "You said {answer:technique_video}, so the lift you're progressing changes every week.",
      },
      {
        when: { all: [PHYSIQUE, { q: "rep_execution", in: ["partial_top"] }] },
        weight: 4,
        because: "You told us: {answer:rep_execution}. The stretched half of the range is where most of the growth stimulus lives.",
      },
      {
        when: { all: [PHYSIQUE, { q: "rep_execution", in: ["momentum", "heavy_fast"] }] },
        weight: 2,
        because: "You told us {answer:rep_execution} — which usually means the bottom of the range disappears first.",
      },
      {
        when: { all: [PHYSIQUE, { q: "rep_execution", in: ["not_sure"] }] },
        weight: 1,
        because: "You've never watched for it.",
      },
      {
        when: { q: "rir_last_set", in: ["past_failure"] },
        weight: 1,
        because: "You go past the point where form holds, which is exactly where reps shorten.",
      },
      {
        when: { q: "progression_rule", in: ["max_out_daily"] },
        weight: 1,
        because: "You max out most sessions, and daily maxing rewards whatever gets the bar up.",
      },
      {
        when: { all: [STRENGTH, { q: "sticking_point", in: ["form_breaks"] }] },
        weight: 1,
        because: "And when your lift fails, {answer:sticking_point}.",
      },
    ],
  },
  {
    id: "nobody_has_seen_your_lift",
    audience: "both",
    category: "technique",
    threshold: 6,
    suppressedBy: ["rom_shrinking"],
    triggers: [
      {
        when: { q: "technique_video", in: ["never_filmed"] },
        weight: 4,
        because: "You told us {answer:technique_video}. Everything you believe about your technique is a guess made mid-rep.",
      },
      {
        when: TRAINED_3Y_PLUS,
        weight: 1,
        because: "You're {answer:training_age} in, and by now your habits are load-bearing.",
      },
      {
        when: { all: [STRENGTH, { q: "sticking_point", in: ["form_breaks"] }] },
        weight: 1,
        because: "Your lift fails by form collapse, which is exactly what video catches.",
      },
      {
        when: { all: [STRENGTH, { q: "weak_point_work", in: ["dont_know_how"] }] },
        weight: 1,
        because: "You don't know what would fix the position — film would show it in one set.",
      },
      {
        when: { all: [PHYSIQUE, { q: "rep_execution", in: ["not_sure"] }] },
        weight: 1,
        because: "You've never looked at how your reps end.",
      },
    ],
  },
  {
    id: "sticking_point_untrained",
    audience: "strength",
    category: "technique",
    threshold: 5,
    triggers: [
      {
        when: { q: "sticking_point", in: ["off_floor_bottom", "midrange", "lockout"] },
        weight: 3,
        because: "Your lift fails {answer:sticking_point}.",
      },
      {
        when: { q: "sticking_point", in: ["form_breaks"] },
        weight: 3,
        because: "Your lift doesn't fail cleanly — {answer:sticking_point}.",
      },
      {
        when: { q: "weak_point_work", in: ["no_just_the_lift"] },
        weight: 3,
        because: "And nothing in your week is aimed at that position: {answer:weak_point_work}.",
      },
      {
        when: { q: "weak_point_work", in: ["dont_know_how"] },
        weight: 2,
        because: "You wouldn't know what to do for it: {answer:weak_point_work}.",
      },
      {
        when: { q: "technique_video", in: ["never_filmed"] },
        weight: 1,
        because: "You've never filmed it, so you're guessing at why it dies there.",
      },
    ],
  },

  /* ============================== recovery ============================== */
  {
    id: "volume_outruns_recovery",
    audience: "both",
    category: "recovery",
    threshold: 7,
    triggers: [
      {
        when: { all: [HIGH_DOSE, SLEEP_SHORT] },
        weight: 5,
        because:
          "You're running a high training dose on {answer:sleep_7h_nights} of 7+ hours' sleep out of the last seven — the extra work is turning into fatigue instead of progress.",
      },
      {
        when: { all: [HIGH_DOSE, LIFE_LOAD] },
        weight: 4,
        because: "You're running a high training dose on top of what's going on outside the gym: {answer:lifestyle_load}.",
      },
      {
        when: { q: "deload_practice", in: ["never"] },
        weight: 1,
        because: "And you never clear it with a deload.",
      },
      {
        when: { q: "readiness_signals", in: ["warmups_heavy", "constant_soreness"] },
        weight: 1,
        because: "Your body is already saying so: {answer:readiness_signals}.",
      },
      {
        when: { q: "lifestyle_load", in: ["drinks_8_plus"] },
        weight: 1,
        because: "Plus the drinking you described.",
      },
      {
        when: { q: "last_true_failure", in: ["every_set"] },
        weight: 1,
        because: "You take nearly every set to failure, which doubles the fatigue cost of each one.",
      },
    ],
  },
  {
    id: "fatigue_never_cleared",
    audience: "both",
    category: "recovery",
    threshold: 6,
    suppressedBy: ["volume_outruns_recovery", "failure_every_set"],
    triggers: [
      {
        when: { q: "deload_practice", in: ["never"] },
        weight: 4,
        because: "You told us: {answer:deload_practice}.",
      },
      {
        when: { q: "deload_practice", in: ["when_beat_up"] },
        weight: 2,
        because: "You only back off once you're already wrecked — that's damage control, not a deload.",
      },
      {
        when: { q: "deload_practice", in: ["forced_by_life"] },
        weight: 2,
        because: "Your only deloads are the ones life forces.",
      },
      {
        when: { q: "readiness_signals", in: ["warmups_heavy"] },
        weight: 2,
        because: "Your warm-up weights feel heavy — the clearest sign of fatigue hiding fitness.",
      },
      {
        when: { q: "readiness_signals", in: ["constant_soreness", "joints_ache", "dread_sessions"] },
        weight: 1,
        because: "And your body is sending more than one signal: {answer:readiness_signals}.",
      },
      {
        when: { q: "stall_evidence", in: ["feel"] },
        weight: 1,
        because: "Your sessions feel harder and flatter, which is the signature of unmanaged fatigue.",
      },
      {
        when: { all: [STRENGTH, { q: "lift_calibration_4wk", in: ["lower_now"] }] },
        weight: 1,
        because: "Your heaviest set is lower than four weeks ago — the number went down before the strength did.",
      },
      {
        when: { q: "stall_duration", in: ["2_4mo", "4_12mo", "over_1y"] },
        weight: 1,
        because: "And you've been stuck for {answer:stall_duration}.",
      },
    ],
  },
  {
    id: "sleep_under_dose",
    audience: "both",
    category: "recovery",
    threshold: 7,
    triggers: [
      {
        when: { q: "sleep_7h_nights", in: ["0_1"] },
        weight: 5,
        because: "You got 7 hours on {answer:sleep_7h_nights} of the last seven nights.",
      },
      {
        when: { q: "sleep_7h_nights", in: ["2_3"] },
        weight: 3,
        because: "You got 7 hours on only {answer:sleep_7h_nights} of the last seven nights.",
      },
      {
        when: { q: "sleep_7h_nights", in: ["4_5"] },
        weight: 1,
        because: "You got 7 hours on {answer:sleep_7h_nights} of the last seven — the edge, not the floor.",
      },
      {
        when: { q: "readiness_signals", in: ["sleep_broken"] },
        weight: 2,
        because: "And the sleep you do get is broken or unrefreshing.",
      },
      {
        when: { q: "lifestyle_load", in: ["high_stress", "crisis"] },
        weight: 1,
        because: "With what you told us is going on outside the gym, the short nights aren't an accident.",
      },
      {
        when: { q: "lifestyle_load", in: ["drinks_8_plus"] },
        weight: 1,
        because: "You drink several nights a week, which breaks the deep sleep you do get.",
      },
    ],
  },
  {
    id: "life_is_the_limiter",
    audience: "both",
    category: "recovery",
    threshold: 6,
    suppressedBy: ["volume_outruns_recovery"],
    triggers: [
      {
        when: { q: "lifestyle_load", in: ["crisis"] },
        weight: 4,
        because:
          "You told us something big happened in the last two months, and it's spending from the same recovery account your training does.",
      },
      {
        when: { q: "lifestyle_load", in: ["high_stress"] },
        weight: 3,
        because: "Your life has been high-stress for months — sleep or meals slip most weeks — and your plan was written for a calmer life.",
      },
      {
        when: { q: "lifestyle_load", in: ["physical_job"] },
        weight: 1,
        because: "Your job is physical, and it isn't in your training plan.",
      },
      {
        when: SLEEP_SHORT,
        weight: 1,
        because: "You got 7 hours on {answer:sleep_7h_nights} last week.",
      },
      {
        when: { q: "sessions_missed_4wk", in: ["4_6", "7_plus"] },
        weight: 1,
        because: "You missed {answer:sessions_missed_4wk} sessions last month.",
      },
      {
        when: { q: "readiness_signals", in: ["dread_sessions"] },
        weight: 1,
        because: "You dread sessions you used to look forward to.",
      },
      {
        when: { q: "stall_duration", in: ["under_4wk", "4_8wk", "2_4mo"] },
        weight: 1,
        because: "And your stall lines up with the period you describe.",
      },
    ],
  },
  {
    id: "training_around_pain",
    audience: "both",
    category: "recovery",
    threshold: 6,
    triggers: [
      {
        when: { q: "readiness_signals", in: ["pain_limits_lift"] },
        weight: 4,
        because:
          "You told us a nagging pain changes how you lift — it limits the load or range, or you've swapped exercises around it. No program fixes a ceiling that pain is setting.",
      },
      {
        when: { q: "readiness_signals", in: ["joints_ache"] },
        weight: 1,
        because: "Your joints ache during warm-ups.",
      },
      {
        when: { q: "deload_practice", in: ["when_beat_up"] },
        weight: 1,
        because: "And you only back off when your joints complain.",
      },
      {
        when: { all: [STRENGTH, { q: "sticking_point", in: ["form_breaks"] }] },
        weight: 1,
        because: "Your lift fails by form collapse, which is often the body steering around something.",
      },
    ],
  },

  /* ============================== nutrition ============================== */
  {
    id: "deficit_while_expecting_muscle",
    audience: "physique",
    category: "nutrition",
    threshold: 6,
    triggers: [
      {
        when: { all: [{ q: "bodyweight_trend_8wk", in: ["down_over_2kg"] }, WANTS_MUSCLE] },
        weight: 4,
        because:
          "Your weight is {answer:bodyweight_trend_8wk} over 8 weeks and your goal is {answer:physique_goal} — past the first year or two, a falling weight and new muscle don't coexist.",
      },
      {
        when: { all: [{ q: "bodyweight_trend_8wk", in: ["down_slightly"] }, WANTS_MUSCLE] },
        weight: 3,
        because: "Your weight is drifting down ({answer:bodyweight_trend_8wk}) while your goal is {answer:physique_goal}.",
      },
      {
        when: { all: [WEIGHT_DOWN, { q: "physique_goal", in: ["recomp", "lean_stay_lean"] }] },
        weight: 2,
        because: "You want to hold your weight and grow ({answer:physique_goal}), and the scale is going the other way.",
      },
      {
        when: { all: [WEIGHT_DOWN, { q: "eating_setup", in: ["recomp_hope"] }] },
        weight: 2,
        because: "Your food is set up to lean out and grow at the same time, and the scale says it's only doing the first.",
      },
      {
        when: { all: [WEIGHT_DOWN, { q: "eating_setup", in: ["deficit_planned"] }] },
        weight: 1,
        because: "You're in a planned deficit while expecting size.",
      },
      {
        when: TRAINED_3Y_PLUS,
        weight: 1,
        because: "You're at {answer:training_age}, past the point where a deficit can also build muscle.",
      },
      {
        when: { q: "expected_body_change", in: ["noticeable_others", "transformation"] },
        weight: 1,
        because: "And you're expecting {answer:expected_body_change} from it.",
      },
    ],
  },
  {
    id: "no_surplus_no_growth",
    audience: "physique",
    category: "nutrition",
    threshold: 6,
    suppressedBy: ["recomp_window_closed"],
    triggers: [
      {
        when: {
          all: [
            { q: "bodyweight_trend_8wk", in: ["flat"] },
            { q: "physique_goal", in: ["gain_muscle", "lagging_part", "lean_stay_lean"] },
          ],
        },
        weight: 4,
        because:
          "Your weight is {answer:bodyweight_trend_8wk} over 8 weeks and your goal is {answer:physique_goal} — a trained body doesn't add tissue on a flat energy balance.",
      },
      {
        when: {
          all: [
            { q: "bodyweight_trend_8wk", in: ["flat"] },
            {
              any: [
                { q: "eating_setup", in: ["maintenance_planned", "no_plan"] },
                { all: [{ q: "eating_setup", in: ["recomp_hope"] }, { q: "training_age", in: ["under_1y", "1_3y"] }] },
              ],
            },
          ],
        },
        weight: 2,
        because: "Your food is set to: {answer:eating_setup} — which lands at maintenance by default.",
      },
      {
        when: { all: [{ q: "bodyweight_trend_8wk", in: ["flat"] }, { q: "eating_setup", in: ["surplus_planned"] }] },
        weight: 2,
        because: "You call it a surplus, but your scale hasn't moved — so it isn't one.",
      },
      {
        when: { q: "lift_progress_8wk", in: ["up_clearly", "up_barely"] },
        weight: 1,
        because: "Your lifts are up ({answer:lift_progress_8wk}), so the stimulus is there and the material isn't.",
      },
      {
        when: TRAINED_3Y_PLUS,
        weight: 1,
        because: "You're at {answer:training_age}, where growth without a surplus is rare.",
      },
      {
        when: { q: "stall_duration", in: ["4_12mo", "over_1y"] },
        weight: 1,
        because: "And you've been waiting {answer:stall_duration}.",
      },
      {
        when: { q: "stall_evidence", in: ["photos_tape"] },
        weight: 1,
        because: "Your photos or tape, taken the same way each time, agree: the body isn't changing.",
      },
    ],
  },
  {
    id: "recomp_window_closed",
    audience: "physique",
    category: "nutrition",
    threshold: 8,
    triggers: [
      {
        when: { all: [{ q: "eating_setup", in: ["recomp_hope"] }, TRAINED_3Y_PLUS] },
        weight: 5,
        because:
          "You told us: {answer:eating_setup} — with {answer:training_age} of training, years past the point where that reliably works.",
      },
      {
        when: { all: [{ q: "physique_goal", in: ["recomp"] }, TRAINED_3Y_PLUS] },
        weight: 4,
        because: "Your goal is {answer:physique_goal}, and at {answer:training_age} the same body weight mostly means the same body.",
      },
      {
        when: { all: [{ q: "eating_setup", in: ["recomp_hope"] }, { q: "physique_goal", in: ["recomp"] }] },
        weight: 2,
        because: "Both your goal and your food are set to recomp — and you've been at it a while.",
      },
      {
        when: { q: "physique_goal", in: ["gain_muscle", "lagging_part", "lean_stay_lean", "recomp"] },
        weight: 1,
        because: "And you want new muscle out of it: {answer:physique_goal}.",
      },
      {
        when: { q: "bodyweight_trend_8wk", in: ["flat"] },
        weight: 1,
        because: "Your weight has been flat, which is what \"neither\" looks like.",
      },
      {
        when: { q: "lift_progress_8wk", in: ["up_clearly", "up_barely"] },
        weight: 1,
        because: "Your lifts are creeping up while the body waits — the surplus never arrived.",
      },
      {
        when: { q: "stall_duration", in: ["4_12mo", "over_1y"] },
        weight: 1,
        because: "And you've been waiting {answer:stall_duration}.",
      },
    ],
  },
  {
    id: "gaining_too_fast",
    audience: "physique",
    category: "nutrition",
    threshold: 6,
    triggers: [
      {
        when: { q: "bodyweight_trend_8wk", in: ["up_over_2kg"] },
        weight: 4,
        because:
          "Your weight is {answer:bodyweight_trend_8wk} in eight weeks — faster than muscle can be built, so most of the extra is hiding the shape you're training for.",
      },
      {
        when: { q: "eating_setup", in: ["surplus_planned"] },
        weight: 1,
        because: "You call it a small surplus, but one that adds over 2 kg in two months isn't small.",
      },
      {
        when: { q: "eating_setup", in: ["no_plan"] },
        weight: 1,
        because: "You have no plan, so the surplus is whatever your appetite decides.",
      },
      {
        when: PROTEIN_NOT_COVERED,
        weight: 1,
        because: "Your protein is {answer:protein_yesterday}, so a big surplus is mostly other things.",
      },
      {
        when: TRAINED_3Y_PLUS,
        weight: 1,
        because: "You're at {answer:training_age}, where the muscle share of a fast gain is small.",
      },
      {
        when: { q: "physique_goal", in: ["recomp", "lose_fat_keep", "lean_stay_lean"] },
        weight: 1,
        because: "And your goal was {answer:physique_goal}.",
      },
    ],
  },
  {
    id: "protein_unknown",
    audience: "both",
    category: "nutrition",
    threshold: 6,
    triggers: [
      {
        when: { q: "protein_yesterday", in: ["no_idea"] },
        weight: 5,
        because: "Asked about yesterday's protein, you said: {answer:protein_yesterday}.",
      },
      {
        when: { q: "protein_yesterday", in: ["guess"] },
        weight: 4,
        because: "You'd guess \"a fair amount\" — that's the answer we hear right before 0.9 g/kg.",
      },
      {
        when: { q: "protein_yesterday", in: ["day_varies"] },
        weight: 4,
        because: "You eat plenty some days and almost none on others — the average is what your muscle sees.",
      },
      {
        when: { q: "protein_yesterday", in: ["know_low"] },
        weight: 3,
        because: "You know the number, and it's under 1.6 g/kg.",
      },
      {
        when: { q: "eating_setup", in: ["no_plan"] },
        weight: 1,
        because: "Your food is {answer:eating_setup}, so nothing corrects it.",
      },
      {
        when: WEIGHT_DOWN,
        weight: 1,
        because: "Your weight is going down, and in a body that's losing weight, low protein costs muscle, not just gains.",
      },
    ],
  },
  {
    id: "strength_leaking_bodyweight",
    audience: "strength",
    category: "nutrition",
    threshold: 7,
    triggers: [
      {
        when: { q: "bodyweight_trend_8wk", in: ["down_over_2kg"] },
        weight: 5,
        because: "Your weight is {answer:bodyweight_trend_8wk} — for a strength lifter that's the most common reason the bar stops before anything in the gym is.",
      },
      {
        when: { q: "bodyweight_trend_8wk", in: ["down_slightly"] },
        weight: 3,
        because: "Your weight is drifting down: {answer:bodyweight_trend_8wk}.",
      },
      {
        when: { q: "lift_calibration_4wk", in: ["lower_now"] },
        weight: 2,
        because: "And your heaviest set is lower than four weeks ago — the two move together.",
      },
      {
        when: { q: "eating_setup", in: ["deficit_planned", "cycling"] },
        weight: 1,
        because: "Your food is {answer:eating_setup}.",
      },
      {
        when: { q: "eating_setup", in: ["no_plan"] },
        weight: 1,
        because: "You didn't plan the loss: {answer:eating_setup}.",
      },
      {
        when: PROTEIN_NOT_COVERED,
        weight: 1,
        because: "And your protein isn't covering the loss: {answer:protein_yesterday}.",
      },
    ],
  },
  {
    id: "week_cancels_itself",
    audience: "both",
    category: "nutrition",
    threshold: 6,
    triggers: [
      {
        when: { q: "lifestyle_load", in: ["weekend_food_blowout"] },
        weight: 4,
        because: "You told us weekdays are controlled and weekends undo them — five careful days and two loose ones average out to a diet you never chose.",
      },
      {
        when: { q: "eating_setup", in: ["cycling"] },
        weight: 4,
        because: "Your eating is {answer:eating_setup} — it never points one way long enough to build anything.",
      },
      {
        when: { q: "lifestyle_load", in: ["drinks_8_plus"] },
        weight: 1,
        because: "Plus the drinking you described, which usually lands on the same two days.",
      },
      {
        when: { q: "bodyweight_trend_8wk", in: ["flat"] },
        weight: 1,
        because: "And your weight is flat — the signature of a week that cancels itself.",
      },
      {
        when: { q: "bodyweight_trend_8wk", in: ["dont_weigh"] },
        weight: 1,
        because: "You don't weigh yourself regularly, so the cancellation is invisible.",
      },
    ],
  },

  /* ============================= consistency ============================= */
  {
    id: "consistency_gap",
    audience: "both",
    category: "consistency",
    threshold: 6,
    triggers: [
      {
        when: { q: "consistency_self_image", in: ["never_miss", "odd_miss"] },
        weight: 3,
        because: "You'd be described as: {answer:consistency_self_image}.",
      },
      {
        when: { q: "sessions_missed_4wk", in: ["4_6"] },
        weight: 3,
        because: "But you missed or shortened {answer:sessions_missed_4wk} sessions in four weeks.",
      },
      {
        when: { q: "sessions_missed_4wk", in: ["7_plus"] },
        weight: 4,
        because: "But you missed or shortened {answer:sessions_missed_4wk} sessions in four weeks.",
      },
      {
        when: { q: "sessions_missed_4wk", in: ["dont_track"] },
        weight: 2,
        because: "And asked to count, you said {answer:sessions_missed_4wk}.",
      },
      {
        when: { q: "stall_duration", in: ["2_4mo", "4_12mo", "over_1y"] },
        weight: 1,
        because: "You've been stuck {answer:stall_duration}, and that adds up to a lot of training that never happened.",
      },
    ],
  },
  {
    id: "missed_dose",
    audience: "both",
    category: "consistency",
    threshold: 6,
    suppressedBy: ["consistency_gap", "restart_not_stall"],
    triggers: [
      {
        when: { q: "sessions_missed_4wk", in: ["4_6"] },
        weight: 3,
        because: "You skipped or cut short {answer:sessions_missed_4wk} sessions in four weeks — the program on paper and the one that happened are two different programs.",
      },
      {
        when: { q: "sessions_missed_4wk", in: ["7_plus"] },
        weight: 4,
        because: "You skipped or cut short {answer:sessions_missed_4wk} sessions in four weeks — the program isn't failing; it isn't being run.",
      },
      {
        when: { q: "sessions_missed_4wk", in: ["2_3"] },
        weight: 1,
        because: "You skipped or cut short {answer:sessions_missed_4wk} sessions in four weeks — a 15% cut in the dose.",
      },
      {
        when: { q: "sessions_missed_4wk", in: ["dont_track"] },
        weight: 2,
        because: "You said {answer:sessions_missed_4wk}, so adherence can't even be measured.",
      },
      {
        when: { q: "consistency_self_image", in: ["rough_patches"] },
        weight: 1,
        because: "You described yourself as {answer:consistency_self_image} — rough patches are where progress resets.",
      },
      {
        when: { q: "consistency_self_image", in: ["on_off", "honest_low"] },
        weight: 2,
        because: "You described yourself as {answer:consistency_self_image}.",
      },
      {
        when: { q: "lifestyle_load", in: ["crisis"] },
        weight: 1,
        because: "You have something big going on outside the gym.",
      },
    ],
  },
  {
    id: "restart_not_stall",
    audience: "both",
    category: "consistency",
    threshold: 6,
    triggers: [
      {
        when: { q: "consistency_self_image", in: ["just_restarted"] },
        weight: 4,
        because: "You told us: {answer:consistency_self_image}. After a long break the first weeks feel like a wall because you're rebuilding, not because anything is wrong.",
      },
      {
        when: { q: "stall_duration", in: ["under_4wk", "4_8wk"] },
        weight: 1,
        because: "And your \"stall\" is {answer:stall_duration} old.",
      },
      {
        when: { all: [STRENGTH, { q: "lift_calibration_4wk", in: ["lower_now", "higher_now"] }] },
        weight: 1,
        because: "Your four-week comparison ({answer:lift_calibration_4wk}) is what a rebuild looks like.",
      },
      {
        when: { all: [PHYSIQUE, { q: "lift_progress_8wk", in: ["down", "up_barely"] }] },
        weight: 1,
        because: "Your 8-week lift comparison ({answer:lift_progress_8wk}) is what a rebuild looks like.",
      },
    ],
  },

  /* ============================ expectations ============================ */
  {
    id: "expecting_year_one_speed",
    audience: "both",
    category: "expectations",
    threshold: 9,
    triggers: [
      {
        when: { all: [PHYSIQUE, { q: "expected_body_change", in: ["transformation"] }] },
        weight: 5,
        because: "You'd be satisfied by: {answer:expected_body_change}. Your timeline is from a movie.",
      },
      {
        when: { all: [PHYSIQUE, { q: "expected_body_change", in: ["noticeable_others"] }] },
        weight: 3,
        because: "You want people who see you weekly to comment — that's a 3–5 kg change, not a 12-week one.",
      },
      {
        when: { all: [STRENGTH, { q: "expected_strength_rate", in: ["weekly_pr"] }] },
        weight: 5,
        because: "You'd feel unstuck with: {answer:expected_strength_rate}. At your training age that rate no longer exists for anyone.",
      },
      {
        when: { all: [STRENGTH, { q: "expected_strength_rate", in: ["monthly_small"] }] },
        weight: 2,
        because: "You expect {answer:expected_strength_rate}.",
      },
      {
        when: { all: [PHYSIQUE, { q: "training_age", in: ["1_3y"] }] },
        weight: 1,
        because: "You're at {answer:training_age}, where that's the top of the possible range, not the baseline.",
      },
      {
        when: { q: "training_age", in: ["3_6y"] },
        weight: 2,
        because: "You're at {answer:training_age}, where a good quarter adds roughly 1 kg of muscle or 2–3% on a lift.",
      },
      {
        when: { q: "training_age", in: ["over_6y"] },
        weight: 3,
        because: "You're at {answer:training_age}, where a good year adds 1–2 kg of muscle or 5% on a main lift.",
      },
      {
        when: { q: "stall_duration", in: ["under_4wk", "4_8wk"] },
        weight: 2,
        because: "And your \"stall\" is {answer:stall_duration} long.",
      },
      {
        when: { q: "compare_to", in: ["first_year"] },
        weight: 2,
        because: "Your benchmark is your first year: {answer:compare_to}.",
      },
    ],
  },
  {
    id: "borrowed_yardstick",
    audience: "both",
    category: "expectations",
    threshold: 6,
    triggers: [
      {
        when: { q: "compare_to", in: ["lifters_online"] },
        weight: 4,
        because: "You compare against {answer:compare_to} — people whose starting point, chemistry or camera you can't see.",
      },
      {
        when: { q: "compare_to", in: ["gym_peers"] },
        weight: 3,
        because: "You compare against people at your gym who started around when you did.",
      },
      {
        when: { q: "stall_evidence", in: ["others"] },
        weight: 2,
        because: "Other people's comments are part of your evidence.",
      },
      {
        when: { all: [PHYSIQUE, { q: "expected_body_change", in: ["transformation"] }] },
        weight: 1,
        because: "And the 12-week transformation photos are your reference.",
      },
    ],
  },

  /* ============================== lifestyle ============================== */
  {
    id: "alcohol_tax",
    audience: "both",
    category: "lifestyle",
    threshold: 6,
    triggers: [
      {
        when: { q: "lifestyle_load", in: ["drinks_8_plus"] },
        weight: 4,
        because:
          "You told us: eight-plus drinks a week, or a heavy night most weekends. Each one suppresses muscle repair for about a day and wrecks deep sleep that night — that covers most of your week.",
      },
      {
        when: { q: "readiness_signals", in: ["sleep_broken"] },
        weight: 1,
        because: "Your sleep is broken, and broken sleep is the first thing alcohol costs.",
      },
      {
        when: SLEEP_SHORT,
        weight: 1,
        because: "You got 7 hours on {answer:sleep_7h_nights} last week.",
      },
      {
        when: { q: "lifestyle_load", in: ["weekend_food_blowout"] },
        weight: 1,
        because: "Your weekends undo the week's eating on the same nights.",
      },
    ],
  },
  {
    id: "cardio_eating_the_budget",
    audience: "both",
    category: "lifestyle",
    threshold: 6,
    triggers: [
      {
        when: {
          all: [
            { q: "lifestyle_load", in: ["cardio_3h_plus"] },
            { any: [WEIGHT_DOWN, { q: "eating_setup", in: ["deficit_planned"] }] },
          ],
        },
        weight: 4,
        because:
          "You do three-plus hours of cardio a week while your weight is going down — the endurance work is being recovered from first and fed first, and the lifting gets what's left.",
      },
      {
        when: { q: "lifestyle_load", in: ["cardio_3h_plus"] },
        weight: 1,
        because: "You do 3+ hours a week of running, cycling, swimming or sport.",
      },
      {
        when: PROTEIN_NOT_COVERED,
        weight: 1,
        because: "Your protein is {answer:protein_yesterday}, so muscle is the first thing borrowed from.",
      },
      {
        when: { all: [PHYSIQUE, WANTS_MUSCLE] },
        weight: 1,
        because: "And your goal is {answer:physique_goal}.",
      },
    ],
  },
];

/* ─────────────────────────────── clearances ─────────────────────────────── */

export const CLEARANCES: ClearanceRule[] = [
  {
    id: "effort_is_there",
    audience: "both",
    when: {
      all: [
        { q: "rir_last_set", in: ["0_1", "2_3"] },
        { q: "last_true_failure", in: ["this_week", "this_month"] },
      ],
    },
    title: "Effort isn't your problem",
    text: "Your last set ended at {answer:rir_last_set}, and you've felt genuine failure {answer:last_true_failure}. Your effort scale is calibrated and the stimulus is real. The report won't ask you to try harder; it'll ask you to aim it better.",
  },
  {
    id: "protein_covered",
    audience: "both",
    when: { q: "protein_yesterday", in: ["know_high"] },
    title: "Protein is handled",
    text: "You can state yesterday's number and it clears 1.6 g/kg. Protein is off the suspect list — don't let anyone sell you more of it.",
  },
  {
    id: "sleep_covered",
    audience: "both",
    when: {
      all: [
        { q: "sleep_7h_nights", in: ["6_7"] },
        { q: "readiness_signals", notIn: ["sleep_broken"] },
      ],
    },
    title: "Sleep is doing its job",
    text: "Seven-plus hours on {answer:sleep_7h_nights} of the last seven nights, and none of it broken. Whatever is stalling you, it isn't recovery hours.",
  },
  {
    id: "attendance_covered",
    audience: "both",
    when: { q: "sessions_missed_4wk", in: ["0_1"] },
    title: "You show up",
    text: "{answer:sessions_missed_4wk} missed sessions in four weeks means the dose you planned is the dose you got. This is a stall in a consistent lifter, which narrows it a lot.",
  },
  {
    id: "program_stable",
    audience: "both",
    when: {
      any: [
        { q: "program_changes_6mo", in: ["0", "1"] },
        {
          all: [
            { q: "program_changes_6mo", in: ["same_for_years"] },
            { q: "progression_rule", in: ["log_rule", "percent_plan"] },
          ],
        },
      ],
    },
    title: "You've given the plan a chance",
    text: "{answer:program_changes_6mo} — that's long enough for adaptation to show. If it hasn't, the plan itself, not your patience, is what we look at.",
  },
  {
    id: "tracking_covered",
    audience: "both",
    when: {
      all: [
        { q: "progress_record", in: ["every_set_logged"] },
        {
          any: [
            { all: [PHYSIQUE, { q: "lift_progress_8wk", notIn: ["dont_know"] }] },
            { all: [STRENGTH, { q: "lift_calibration_4wk", notIn: ["no_record", "comparing_pr"] }] },
          ],
        },
      ],
    },
    title: "Your data is real",
    text: "Every set is logged, and you answered the four-week question from it. When you say the numbers aren't moving, we believe you — and a stall you can measure is a stall you can fix.",
  },
  {
    id: "technique_watched",
    audience: "both",
    when: { q: "technique_video", in: ["identical", "coach_checks"] },
    title: "Technique drift isn't your problem",
    text: "Your lift looks the same as it did three months ago, or someone qualified is checking it. The quietest fake-progress trap — load up, range down — is ruled out.",
  },
  {
    id: "deload_covered",
    audience: "both",
    when: { q: "deload_practice", in: ["planned_regular"] },
    title: "Fatigue is being managed",
    text: "Planned deloads every 4–8 weeks mean accumulated fatigue isn't hiding your progress. If you're stuck, it's a stimulus problem, not a fatigue one.",
  },
  {
    id: "lifestyle_clear",
    audience: "both",
    when: {
      q: "lifestyle_load",
      notIn: ["high_stress", "crisis", "physical_job", "cardio_3h_plus", "drinks_8_plus", "weekend_food_blowout"],
    },
    title: "Life isn't stealing your recovery",
    text: "No crisis, no months of high stress, no heavy cardio or drinking, no 12-hour shifts, no weekend resets. Your life is leaving the recovery budget intact, so the answer is inside the gym or the kitchen.",
  },
  {
    id: "volume_in_range",
    audience: "physique",
    when: {
      all: [
        { q: "hard_sets_lagging", in: ["10_15", "16_22"] },
        { q: "rir_last_set", in: ["0_1", "2_3"] },
        { q: "lagging_priority", in: ["first_fresh", "own_day"] },
      ],
    },
    title: "Your volume is in the effective range",
    text: "{answer:hard_sets_lagging} hard sets a week on the muscle you care about, ending at {answer:rir_last_set}, trained {answer:lagging_priority}. That's a proper growth dose, delivered fresh — more sets is not the answer here.",
  },
  {
    id: "energy_balance_aligned",
    audience: "physique",
    when: {
      any: [
        {
          all: [WANTS_MUSCLE, { q: "bodyweight_trend_8wk", in: ["up_slightly"] }],
        },
        {
          all: [
            { q: "physique_goal", in: ["lose_fat_keep"] },
            { q: "bodyweight_trend_8wk", in: ["down_slightly"] },
          ],
        },
      ],
    },
    title: "Your weight trend matches your goal",
    text: "Your eight-week trend ({answer:bodyweight_trend_8wk}) is moving the right way for {answer:physique_goal}, at a sensible rate. Nutrition direction isn't what's holding you.",
  },
  {
    id: "lift_practice_covered",
    audience: "strength",
    when: {
      all: [
        { q: "main_lift_frequency", in: ["2", "3", "4_plus"] },
        { q: "main_lift_sets", in: ["10_15", "16_plus"] },
        { q: "intensity_mix", in: ["mixed_planned"] },
      ],
    },
    title: "Your lift is practised properly",
    text: "You perform the lift {answer:main_lift_frequency} a week, {answer:main_lift_sets} heavy sets across it, cycling heavy, moderate and light work. That's the structure that builds strength; the report looks elsewhere for the stall.",
  },
];
