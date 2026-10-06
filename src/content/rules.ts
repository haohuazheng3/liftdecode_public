/**
 * LiftDecode rules (v4): 39 findings, 27 clearances.
 *
 * score = sum of matched trigger weights; a finding shows when score ≥ threshold.
 * Every threshold is above the largest single weight, so no finding is named from
 * one answer. Findings whose premise is one fact (you diet, you train to failure,
 * your week is big, you get cramps) carry that fact as a gate: the other triggers
 * can't reach the threshold without it. Corroborations are written as
 * all(factor, symptom) so a tired lifter is never told they drink or run too much,
 * and a big week is never called too much work unless something says recovery is failing.
 *
 * v3 reads measured answers through derived bands (src/content/derived.ts): weekly_hours,
 * lagging_dose, lift_muscle_dose, legs_dose, protein_band, carbs_band, sleep_band, bmi_band,
 * age_band, signs_count. because-lines read naturally whether {answer:x} renders a quoted
 * label, "7/10" or "82 kg"; clearance text uses no {answer:} tokens.
 *
 * v4 (2026-10-06): the food findings read the measured bodyweight trend (weight_trend)
 * instead of the stated eating plan, appetite is a 1–10 scale, cardio is a weekly count,
 * and sweat, pump, set-to-set recovery and the pre-training meal gap feed the fuel,
 * mineral and conditioning findings.
 */
import type { ClearanceRule, Condition, FindingRule } from "./types";

/* ───────────── shared conditions ───────────── */
const r = (q: string, lo: number, hi: number): Condition => ({ q, range: [lo, hi] });
const is = (q: string, ...values: string[]): Condition => ({ q, in: values });
const not = (q: string, ...values: string[]): Condition => ({ q, notIn: values });
const all = (...c: Condition[]): Condition => ({ all: c });
const any = (...c: Condition[]): Condition => ({ any: c });

const PHYSIQUE: Condition = { track: "physique" };
const STRENGTH: Condition = { track: "strength" };

/** the loop (arrive ok → train ok → recover ok) is broken */
const LOOP_BROKEN = r("loop_score", 1, 4);
const LOOP_OK = r("loop_score", 6, 10);
const POOR_WAKE = r("wake_rested", 1, 4);
/** ends up eating less than planned most days */
const UNDER_EATS = r("meal_skip", 7, 10);
const HIGH_HOURS = is("weekly_hours", "high", "very_high");
const VERY_HIGH_HOURS = is("weekly_hours", "very_high");
const LOW_HOURS = is("weekly_hours", "low");
const MANY_SESSIONS = is("sessions_week", "6", "7plus");
const FEW_SESSIONS = is("sessions_week", "1", "2");
const HIGH_STRESS = r("stress", 8, 10);
const STRESSED = r("stress", 6, 10);
const IN_PAIN = r("pain_limits", 6, 10);
/** four or more cardio sessions a week on top of lifting */
const MUCH_CARDIO = is("cardio_sessions", "4", "5plus");
const VERY_MUCH_CARDIO = is("cardio_sessions", "5plus");
const NO_CARDIO = is("cardio_sessions", "0");
/** a symptom that recovery is failing, required before a big week is blamed */
const NOT_RECOVERING = any(LOOP_BROKEN, IN_PAIN, POOR_WAKE);
const PAST_YEAR_ONE = not("training_age", "under_1y");
const TRAINED_3Y = is("training_age", "3_6y", "over_6y");
const TO_FAILURE = is("hard_set_habit", "failure");
/** says "At failure" and the reps agree: the last rep really grinds */
const FAILS = all(TO_FAILURE, r("effort_grind", 5, 10));
/** the measured bodyweight trend over the last two months */
const LOSING = is("weight_trend", "down", "down_fast");
const LOSING_FAST = is("weight_trend", "down_fast");
const NOT_LOSING = is("weight_trend", "same", "up", "up_fast");
const STABLE_WEIGHT = is("weight_trend", "same");
const GAINING = is("weight_trend", "up", "up_fast");
const GAINING_FAST = is("weight_trend", "up_fast");
const TREND_UNKNOWN = is("weight_trend", "unknown");
const DRINKS = is("alcohol", "weekends", "often");
const STEADY = is("training_pattern", "steady");
const ON_OFF = is("training_pattern", "on_off");
const COMEBACK = is("training_pattern", "comeback");
const SPECIFIC_LAG = not("lagging_area", "everything");
const KNOWN_FAIL_POINT = is("fail_point", "bottom", "middle", "top");
const FREQUENCY_VARIES = is("lift_frequency", "varies");
/** does not prioritise a full range of motion */
const SHORT_ROM = r("rom_focus", 1, 4);
const SWITCHES = r("program_switch", 7, 10);
const TESTS_OFTEN = is("max_testing", "monthly", "weekly");
const BIG_APPETITE = r("appetite", 8, 10);
const SMALL_APPETITE = r("appetite", 1, 3);
const WANTS_LESS_FAT = is("physique_aim", "leaner");
const LEAN_AIM = is("physique_aim", "leaner", "both");
const WANTS_MUSCLE = is("physique_aim", "muscle", "both");
const PROTEIN_LOW = is("protein_band", "low");
const PROTEIN_MID = is("protein_band", "mid");
const PROTEIN_UNKNOWN = is("protein_band", "unknown");
const PROTEIN_OK = is("protein_band", "mid", "high");
const CARBS_LOW = is("carbs_band", "low");
const CARBS_UNKNOWN = is("carbs_band", "unknown");
const CARBS_LOW_OR_UNKNOWN = is("carbs_band", "low", "unknown");
const CARBS_HIGH = is("carbs_band", "high");
/** muscles feel flat in training: little pump */
const FLAT = r("pump", 1, 3);
/** trains four or more hours after the last meal, or fasted */
const LONG_GAP = is("pre_meal", "o4", "fasted");
const HEAVY_SWEAT = is("sweat_level", "heavy", "salty");
const SALTY = is("sweat_level", "salty");
/** breathing takes two minutes or more to settle after a hard set of ten */
const SLOW_SET_RECOVERY = is("set_recovery", "2_3", "o3");
const SHORT_SLEEP = is("sleep_band", "short");
const SLEEP_OK = is("sleep_band", "ok", "long");
const IRREGULAR = is("sleep_regular", "all_over");
const OFTEN_OFF = is("sleep_regular", "often_off");
const SHIFTS = is("sleep_regular", "shifts");
const CLOCK_MOVES = is("sleep_regular", "shifts", "often_off", "all_over");
const FOG_OFTEN = is("brain_fog", "often");
const FOG_ANY = is("brain_fog", "sometimes", "often");
const SIGNS_SEVERAL = is("signs_count", "several");
const SIGNS_ANY = is("signs_count", "one", "several");
const NO_SIGNS = is("signs_count", "none");
const COFFEE_HIGH = is("coffee", "3", "4plus");
const COFFEE_VERY_HIGH = is("coffee", "4plus");
const DIRTY_DIET = r("diet_clean", 1, 4);
const CLEAN_DIET = r("diet_clean", 7, 10);
const LOW_DRIVE = r("drive", 1, 4);
const OLDER = is("age_band", "45_plus");
const ECTO = is("body_type", "ecto");
const ENDO = is("body_type", "endo");
const BMI_UNDER = is("bmi_band", "under");
const BMI_OVER = is("bmi_band", "over", "obese");

/** the scale moves the way the goal needs (strength: not losing; physique: trend matches aim, no leak) */
const DIET_ALIGNED = any(
  all(STRENGTH, not("weight_trend", "down", "down_fast")),
  all(
    PHYSIQUE,
    r("appetite", 1, 7),
    r("weekend_eating", 1, 6),
    any(all(WANTS_MUSCLE, is("weight_trend", "up")), all(WANTS_LESS_FAT, is("weight_trend", "down"))),
  ),
);
/**
 * No red flag anywhere else. "Slow is normal" is only honest when recovery,
 * attendance, effort, progression, pain, food and the loop are all in order.
 */
const CLEAN = all(
  is("alcohol", "none", "light"),
  LOOP_OK,
  STEADY,
  r("meal_skip", 1, 6),
  not("sessions_week", "1", "2"),
  r("full_nights", 5, 10),
  r("pain_limits", 1, 7),
  PROTEIN_OK,
  r("beat_last", 5, 10),
  any(not("hard_set_habit", "stop"), r("heavy_practice", 6, 10)),
  DIET_ALIGNED,
);

export const FINDING_RULES: FindingRule[] = [
  /* ═════════════ effort ═════════════ */
  {
    id: "sets_end_too_early",
    audience: "both",
    category: "effort",
    threshold: 6,
    suppressedBy: ["failure_every_set"],
    triggers: [
      { when: is("hard_set_habit", "stop"), weight: 3, because: "Asked how most of your sets end, you said {answer:hard_set_habit}." },
      {
        when: all(PHYSIQUE, r("effort_grind", 1, 4)),
        weight: 3,
        because: "You rated how often your last rep slows to a grind at {answer:effort_grind}.",
      },
      {
        when: all(STRENGTH, r("effort_grind", 1, 4), r("heavy_practice", 1, 5)),
        weight: 3,
        because: "Your last rep rarely grinds ({answer:effort_grind}) and you rarely lift close to your max ({answer:heavy_practice}): nothing in your week is hard.",
      },
      { when: r("effort_grind", 5, 6), weight: 1, because: "Your last rep only sometimes slows to a grind ({answer:effort_grind})." },
      {
        when: all(is("hard_set_habit", "push", "failure"), r("effort_grind", 1, 3)),
        weight: 1,
        because: "Your sets end {answer:hard_set_habit}, yet your last rep rarely slows down ({answer:effort_grind}): the sets feel hard without getting there.",
      },
      { when: r("beat_last", 1, 4), weight: 1, because: "You rarely try to beat what you did last time ({answer:beat_last}), so nothing pulls a set past comfortable." },
      { when: is("load_choice", "usual"), weight: 1, because: "You pick your weights {answer:load_choice}, which keeps every set inside a load you already own." },
    ],
  },
  {
    id: "failure_every_set",
    audience: "both",
    category: "effort",
    threshold: 5,
    suppressedBy: ["sets_end_too_early"],
    triggers: [
      { when: FAILS, weight: 3, because: "Most of your sets end {answer:hard_set_habit}." },
      {
        when: all(FAILS, r("effort_grind", 9, 10)),
        weight: 2,
        because: "You go to failure and rated how often your last rep grinds at {answer:effort_grind}: almost every set is a max effort.",
      },
      { when: all(FAILS, HIGH_HOURS), weight: 1, because: "Every set goes to failure inside a week of {answer:weekly_hours} of lifting." },
      { when: all(FAILS, LOOP_BROKEN), weight: 1, because: "Sets to failure, and you rate how well your training loop runs at {answer:loop_score}." },
      { when: all(FAILS, IN_PAIN), weight: 1, because: "You train to failure while pain changes how you train at {answer:pain_limits}." },
      { when: all(FAILS, TESTS_OFTEN), weight: 1, because: "On top of sets to failure, you test a max {answer:max_testing}." },
    ],
  },

  /* ═════════════ progression & programming ═════════════ */
  {
    id: "no_forcing_function",
    audience: "both",
    category: "progression",
    threshold: 6,
    triggers: [
      { when: is("load_choice", "usual", "feel"), weight: 3, because: "Asked how you pick your weights, you said {answer:load_choice}." },
      { when: r("beat_last", 1, 4), weight: 3, because: "You rated how often you try to beat what you did last time at {answer:beat_last}." },
      { when: r("beat_last", 5, 6), weight: 1, because: "You only sometimes try to beat what you did last time ({answer:beat_last})." },
      {
        when: all(is("load_choice", "plan"), r("beat_last", 1, 3)),
        weight: 3,
        because: "Your program sets your weights, yet you rarely try to beat what you did last time: the rule lives on paper, not under the bar.",
      },
      { when: r("program_switch", 8, 10), weight: 1, because: "You start new programs often ({answer:program_switch}), so no plan lives long enough to push a number up." },
    ],
  },
  {
    id: "program_hopping",
    audience: "both",
    category: "programming",
    threshold: 5,
    triggers: [
      { when: r("program_switch", 8, 10), weight: 3, because: "You rated how often you start a new program at {answer:program_switch}." },
      { when: r("program_switch", 7, 7), weight: 2, because: "You start new programs fairly often ({answer:program_switch})." },
      { when: all(SWITCHES, is("load_choice", "feel")), weight: 1, because: "You pick your weights {answer:load_choice}, and a plan run by feel is easy to abandon." },
      {
        when: all(SWITCHES, FREQUENCY_VARIES),
        weight: 1,
        because: "Asked how often your stuck lift gets trained, you said it depends on the week: that happens when the program underneath keeps changing.",
      },
      {
        when: all(SWITCHES, r("beat_last", 1, 4)),
        weight: 1,
        because: "You rarely try to beat what you did last time ({answer:beat_last}), so a program never gets the chance to prove itself.",
      },
      {
        when: all(SWITCHES, is("training_pattern", "on_off", "comeback")),
        weight: 1,
        because: "You described your last few months as {answer:training_pattern}, and every restart tends to bring a new program.",
      },
    ],
  },
  {
    id: "lagging_part_trained_last",
    audience: "physique",
    category: "programming",
    threshold: 5,
    triggers: [
      {
        when: all(SPECIFIC_LAG, is("lagging_priority", "skipped")),
        weight: 4,
        because: "You named {answer:lagging_area} as slowest to grow; asked when you train it, you said {answer:lagging_priority}.",
      },
      {
        when: all(SPECIFIC_LAG, is("lagging_priority", "last")),
        weight: 3,
        because: "You named {answer:lagging_area} as slowest to grow; asked when you train it, you said {answer:lagging_priority}.",
      },
      {
        when: all(SPECIFIC_LAG, is("lagging_priority", "middle")),
        weight: 1,
        because: "Your slowest area, {answer:lagging_area}, gets trained {answer:lagging_priority}: nobody decided it matters most.",
      },
      {
        when: all(SPECIFIC_LAG, r("feel_target", 1, 3)),
        weight: 2,
        because: "You rated how well you feel the target muscle working at {answer:feel_target}, so even the sets it gets land partly somewhere else.",
      },
      {
        when: all(SPECIFIC_LAG, r("feel_target", 4, 5)),
        weight: 1,
        because: "You only partly feel the target muscle working ({answer:feel_target}), so some of the work lands somewhere else.",
      },
      {
        when: all(SPECIFIC_LAG, is("lagging_dose", "none", "low")),
        weight: 1,
        because: "By your own count, the muscles behind {answer:lagging_area} get {answer:lagging_dose} a week.",
      },
      {
        when: all(is("lagging_priority", "last"), LOOP_BROKEN),
        weight: 1,
        because: "It comes last, and you rate how well your training loop runs at {answer:loop_score}: it gets what's left of very little.",
      },
    ],
  },
  {
    id: "never_heavy_enough",
    audience: "strength",
    category: "programming",
    threshold: 5,
    suppressedBy: ["testing_instead_of_training"],
    triggers: [
      { when: r("heavy_practice", 1, 3), weight: 3, because: "You rated how often you lift close to your max at {answer:heavy_practice}." },
      { when: r("heavy_practice", 4, 5), weight: 1, because: "You only sometimes train close to your max ({answer:heavy_practice})." },
      { when: r("form_breakdown", 6, 10), weight: 2, because: "Your form changes on heavy reps at {answer:form_breakdown}: heavy weights still feel foreign." },
      {
        when: all(r("heavy_practice", 1, 4), TESTS_OFTEN),
        weight: 1,
        because: "You rarely train close to your max yet test it {answer:max_testing}: the heaviest weight you meet is the one you're judged on.",
      },
      {
        when: r("muscle_work", 8, 10),
        weight: 1,
        because: "Much of your training is accessory or bodybuilding work ({answer:muscle_work}), which rarely goes near a max.",
      },
      { when: is("load_choice", "feel", "usual"), weight: 1, because: "Asked how you pick your weights, you said {answer:load_choice}, and that rarely lands on heavy." },
    ],
  },
  {
    id: "testing_instead_of_training",
    audience: "strength",
    category: "programming",
    threshold: 5,
    suppressedBy: ["never_heavy_enough"],
    triggers: [
      { when: TESTS_OFTEN, weight: 3, because: "Asked how often you test a max, you said {answer:max_testing}." },
      { when: r("heavy_practice", 8, 10), weight: 2, because: "You lift close to your max at {answer:heavy_practice}, so almost every session is a test." },
      { when: LOW_HOURS, weight: 1, because: "Your week adds up to {answer:weekly_hours} of lifting: little of it builds, most of it measures." },
      {
        when: all(any(TESTS_OFTEN, r("heavy_practice", 8, 10)), LOOP_BROKEN),
        weight: 1,
        because: "Living that close to your max, you rate how well your training loop runs at {answer:loop_score}.",
      },
      { when: r("form_breakdown", 7, 10), weight: 1, because: "Your form changes a lot on heavy reps ({answer:form_breakdown}), which is what repeated max attempts do." },
    ],
  },
  {
    id: "strength_without_muscle",
    audience: "strength",
    category: "programming",
    threshold: 4,
    triggers: [
      {
        when: all(PAST_YEAR_ONE, r("muscle_work", 1, 3)),
        weight: 3,
        because: "You rated your accessory and bodybuilding work at {answer:muscle_work}, and past the first year that work is what grows the lift.",
      },
      { when: all(PAST_YEAR_ONE, r("muscle_work", 4, 5)), weight: 1, because: "Accessory work is a side dish in your training ({answer:muscle_work})." },
      {
        when: TRAINED_3Y,
        weight: 1,
        because: "With {answer:training_age} behind you, the easy strength that comes from skill is already spent.",
      },
      { when: r("heavy_practice", 8, 10), weight: 1, because: "You lift close to your max at {answer:heavy_practice}, which tests muscle without adding any." },
      { when: LOSING, weight: 1, because: "Your bodyweight has {answer:weight_trend} over the last two months, which gives new muscle nothing to be built from." },
      {
        when: is("lift_muscle_dose", "none", "low"),
        weight: 1,
        because: "The muscles behind your {answer:main_lift} get {answer:lift_muscle_dose} a week by your own count.",
      },
    ],
  },
  {
    id: "main_lift_underpractised",
    audience: "strength",
    category: "volume",
    threshold: 5,
    suppressedBy: ["volume_outruns_recovery"],
    triggers: [
      { when: is("lift_frequency", "once"), weight: 3, because: "You train your stuck lift {answer:lift_frequency}." },
      { when: is("lift_frequency", "varies"), weight: 2, because: "Asked how often you train your stuck lift, you said {answer:lift_frequency}." },
      { when: LOW_HOURS, weight: 2, because: "Your whole week adds up to {answer:weekly_hours} of lifting." },
      {
        when: is("lift_muscle_dose", "none", "low"),
        weight: 2,
        because: "The muscles behind your {answer:main_lift} get {answer:lift_muscle_dose} a week.",
      },
      {
        when: all(is("main_lift", "bench", "press"), is("lift_frequency", "once", "varies")),
        weight: 1,
        because: "Your stuck lift is the {answer:main_lift}, and pressing lifts respond to frequency more than any other.",
      },
      { when: FEW_SESSIONS, weight: 1, because: "You lift {answer:sessions_week} sessions a week, which thins out the practice further." },
    ],
  },
  {
    id: "target_muscle_underdosed",
    audience: "physique",
    category: "volume",
    threshold: 5,
    suppressedBy: ["volume_outruns_recovery"],
    triggers: [
      {
        when: all(SPECIFIC_LAG, is("lagging_dose", "none")),
        weight: 4,
        because: "You named {answer:lagging_area} as slowest to grow, and by your own count it gets {answer:lagging_dose} a week.",
      },
      {
        when: all(SPECIFIC_LAG, is("lagging_dose", "low")),
        weight: 3,
        because: "You named {answer:lagging_area} as slowest to grow, and by your own count it gets {answer:lagging_dose} a week.",
      },
      { when: LOW_HOURS, weight: 2, because: "Your whole week adds up to {answer:weekly_hours} of lifting." },
      { when: is("weekly_hours", "moderate"), weight: 1, because: "Your week adds up to {answer:weekly_hours} of lifting, the low end of what a lagging muscle needs." },
      {
        when: all(is("lagging_area", "legs", "glutes"), is("legs_share", "low")),
        weight: 1,
        because: "Legs get {answer:legs_share} of your lifting hours, and they are the area you named as slowest.",
      },
      { when: FEW_SESSIONS, weight: 1, because: "You lift {answer:sessions_week} sessions a week, so a lagging area gets one shot, if that." },
    ],
  },

  /* ═════════════ technique ═════════════ */
  {
    id: "sticking_point_untrained",
    audience: "strength",
    category: "technique",
    threshold: 4,
    triggers: [
      {
        when: all(KNOWN_FAIL_POINT, r("weak_point_work", 1, 3)),
        weight: 3,
        because: "Your {answer:main_lift} fails {answer:fail_point}, and you rated the work aimed at that spot at {answer:weak_point_work}.",
      },
      {
        when: all(KNOWN_FAIL_POINT, r("weak_point_work", 4, 5)),
        weight: 2,
        because: "Your heavy reps fail {answer:fail_point}, and that spot gets only some targeted work ({answer:weak_point_work}).",
      },
      { when: r("form_breakdown", 7, 10), weight: 1, because: "Your form changes a lot on heavy reps ({answer:form_breakdown}), usually right at the weak position." },
      {
        when: r("muscle_work", 1, 3),
        weight: 1,
        because: "You do little accessory work ({answer:muscle_work}), so the muscles behind that position never get extra help.",
      },
    ],
  },
  {
    id: "form_breaks_under_load",
    audience: "strength",
    category: "technique",
    threshold: 5,
    triggers: [
      { when: r("form_breakdown", 7, 10), weight: 3, because: "You rated how much your form changes on heavy reps at {answer:form_breakdown}." },
      { when: r("form_breakdown", 5, 6), weight: 1, because: "Your form shifts somewhat on heavy reps ({answer:form_breakdown})." },
      {
        when: TO_FAILURE,
        weight: 1,
        because: "Your sets end {answer:hard_set_habit}, and the last reps of a failure set are the ugliest ones you practise.",
      },
      { when: r("pain_limits", 5, 10), weight: 1, because: "Pain changes how you train at {answer:pain_limits}." },
      {
        when: all(r("form_breakdown", 5, 10), r("heavy_practice", 1, 3)),
        weight: 1,
        because: "Your form changes under heavy weight and you rarely lift close to your max ({answer:heavy_practice}), so heavy technique never gets rehearsed.",
      },
      { when: is("fail_point", "unsure"), weight: 1, because: "You're not sure where your heavy reps fail, which usually means nobody has watched them." },
    ],
  },
  {
    id: "rom_shrinking",
    audience: "both",
    category: "technique",
    threshold: 5,
    triggers: [
      { when: r("rom_focus", 1, 3), weight: 4, because: "You rated how much you prioritise a full range of motion at {answer:rom_focus}." },
      { when: r("rom_focus", 4, 5), weight: 2, because: "A full range of motion is only sometimes a priority for you ({answer:rom_focus})." },
      {
        when: all(SHORT_ROM, r("beat_last", 8, 10)),
        weight: 1,
        because: "You try to beat what you did last time at {answer:beat_last}, faster than a full range usually survives.",
      },
      {
        when: all(SHORT_ROM, IN_PAIN),
        weight: 1,
        because: "Pain changes how you train at {answer:pain_limits}, and a range that shrinks is often pain steering the rep.",
      },
      {
        when: all(SHORT_ROM, TO_FAILURE),
        weight: 1,
        because: "Your sets end {answer:hard_set_habit}, and the last reps of a failure set are the ones that get cut short.",
      },
      {
        when: all(SHORT_ROM, r("feel_target", 1, 4)),
        weight: 1,
        because: "You rated how well you feel the target muscle working at {answer:feel_target}, and short reps are the usual reason.",
      },
    ],
  },

  /* ═════════════ volume & recovery ═════════════ */
  {
    id: "volume_outruns_recovery",
    audience: "both",
    category: "recovery",
    threshold: 6,
    suppressedBy: ["target_muscle_underdosed", "main_lift_underpractised"],
    triggers: [
      { when: VERY_HIGH_HOURS, weight: 3, because: "Your week adds up to {answer:weekly_hours} of lifting." },
      { when: is("weekly_hours", "high"), weight: 2, because: "Your week adds up to {answer:weekly_hours} of lifting." },
      { when: all(HIGH_HOURS, MANY_SESSIONS), weight: 1, because: "Those hours are spread over {answer:sessions_week} sessions a week, so no day is a rest day." },
      {
        when: all(HIGH_HOURS, LOOP_BROKEN),
        weight: 2,
        because: "You train a lot yet rate how well your training loop runs at {answer:loop_score}.",
      },
      {
        when: all(HIGH_HOURS, POOR_WAKE, SLEEP_OK),
        weight: 1,
        because: "You sleep {answer:sleep_hours} hours yet rate how rested you wake up at {answer:wake_rested}: the training, not the sleep, is outrunning you.",
      },
      {
        when: all(HIGH_HOURS, IN_PAIN),
        weight: 1,
        because: "Pain changes how you train at {answer:pain_limits}, a common cost of more work than the body can absorb.",
      },
      { when: all(HIGH_HOURS, HIGH_STRESS), weight: 1, because: "Life stress sits at {answer:stress}, drawing on the same recovery as your training." },
      { when: all(HIGH_HOURS, LOW_DRIVE), weight: 1, because: "Your urge to train and chase records sits at {answer:drive}, which is what a body asking for less looks like." },
      {
        when: all(HIGH_HOURS, r("heavy_practice", 8, 10), NOT_RECOVERING),
        weight: 1,
        because: "You lift close to your max at {answer:heavy_practice}, the most expensive work there is to recover from.",
      },
      { when: all(HIGH_HOURS, OLDER, NOT_RECOVERING), weight: 1, because: "At {answer:age}, the same week takes longer to recover from than it did at 25." },
    ],
  },
  {
    id: "sleep_under_dose",
    audience: "both",
    category: "recovery",
    threshold: 4,
    triggers: [
      { when: SHORT_SLEEP, weight: 3, because: "You sleep {answer:sleep_hours} hours a night most nights." },
      { when: is("sleep_band", "borderline"), weight: 1, because: "You sleep {answer:sleep_hours} hours a night, the low edge of what recovery needs." },
      { when: r("full_nights", 1, 3), weight: 2, because: "You rated how often you get a full night's sleep at {answer:full_nights}." },
      { when: r("full_nights", 4, 5), weight: 1, because: "You get a full night's sleep only about half the time ({answer:full_nights})." },
      { when: r("wake_rested", 1, 3), weight: 2, because: "You rated how rested you wake up at {answer:wake_rested}." },
      { when: r("wake_rested", 4, 5), weight: 1, because: "You wake up only half-rested ({answer:wake_rested})." },
      {
        when: all(any(SHORT_SLEEP, r("full_nights", 1, 5), r("wake_rested", 1, 5)), LOOP_BROKEN),
        weight: 1,
        because: "Poor sleep follows you into the gym: you rate how well your training loop runs at {answer:loop_score}.",
      },
    ],
  },
  {
    id: "sleep_clock_drifts",
    audience: "both",
    category: "recovery",
    threshold: 5,
    triggers: [
      { when: IRREGULAR, weight: 4, because: "Asked about your bed and wake times, you said they are {answer:sleep_regular}." },
      { when: OFTEN_OFF, weight: 3, because: "Asked about your bed and wake times, you said they are {answer:sleep_regular}." },
      { when: SHIFTS, weight: 2, because: "Your bed and wake times {answer:sleep_regular}." },
      {
        when: all(CLOCK_MOVES, SLEEP_OK, POOR_WAKE),
        weight: 2,
        because: "You sleep {answer:sleep_hours} hours yet rate how rested you wake up at {answer:wake_rested}: the hours are there, the timing isn't.",
      },
      { when: all(CLOCK_MOVES, r("wake_rested", 5, 6)), weight: 1, because: "You wake up only half-rested ({answer:wake_rested})." },
      { when: all(CLOCK_MOVES, is("alcohol", "weekends")), weight: 1, because: "You described your drinking as {answer:alcohol}, and late weekend nights are where a sleep clock slips." },
      { when: all(CLOCK_MOVES, STRESSED), weight: 1, because: "With stress at {answer:stress}, bedtime is the first thing that moves." },
      { when: all(any(IRREGULAR, OFTEN_OFF), COFFEE_HIGH), weight: 1, because: "You drink {answer:coffee} cups of coffee a day, which pushes the clock later still." },
    ],
  },
  {
    id: "life_is_the_limiter",
    audience: "both",
    category: "recovery",
    threshold: 5,
    triggers: [
      { when: HIGH_STRESS, weight: 3, because: "You rated how stressful life is right now at {answer:stress}." },
      { when: r("stress", 6, 7), weight: 1, because: "Life is fairly stressful right now ({answer:stress})." },
      { when: all(STRESSED, POOR_WAKE), weight: 1, because: "With stress at {answer:stress}, you wake up at {answer:wake_rested} on the rested scale." },
      { when: all(STRESSED, LOOP_BROKEN), weight: 1, because: "Stress follows you into the gym: you rate how well your training loop runs at {answer:loop_score}." },
      {
        when: all(STRESSED, r("full_nights", 1, 4)),
        weight: 1,
        because: "You rarely get a full night's sleep ({answer:full_nights}), which is where stress collects its bill.",
      },
      { when: all(STRESSED, ON_OFF), weight: 1, because: "You described your last few months of training as {answer:training_pattern}; life is taking the sessions." },
      { when: all(STRESSED, LOW_DRIVE), weight: 1, because: "Your urge to train sits at {answer:drive}, and stress is the usual thief." },
    ],
  },
  {
    id: "drive_has_faded",
    audience: "both",
    category: "recovery",
    threshold: 5,
    triggers: [
      { when: r("drive", 1, 3), weight: 3, because: "You rated your urge to train and chase records at {answer:drive}." },
      { when: r("drive", 4, 5), weight: 1, because: "Your urge to train and chase records is lukewarm ({answer:drive})." },
      { when: all(LOW_DRIVE, LOOP_BROKEN), weight: 2, because: "You rate how well your training loop runs at {answer:loop_score}: sessions have stopped feeling like they pay back." },
      { when: all(LOW_DRIVE, HIGH_HOURS), weight: 1, because: "It comes inside a week of {answer:weekly_hours} of lifting, the profile of a body that has been asked for too much." },
      { when: all(LOW_DRIVE, SHORT_SLEEP), weight: 1, because: "You sleep {answer:sleep_hours} hours a night, and drive is the first thing short sleep takes." },
      { when: all(LOW_DRIVE, HIGH_STRESS), weight: 1, because: "Life stress sits at {answer:stress}." },
      { when: all(LOW_DRIVE, r("beat_last", 1, 4)), weight: 1, because: "You rarely try to beat what you did last time ({answer:beat_last}); without a number to chase, the urge has nothing to hold on to." },
      { when: all(LOW_DRIVE, ON_OFF), weight: 1, because: "Your last few months have been {answer:training_pattern}, which is how faded drive looks from the outside." },
    ],
  },
  {
    id: "training_around_pain",
    audience: "both",
    category: "recovery",
    threshold: 4,
    triggers: [
      { when: r("pain_limits", 8, 10), weight: 3, because: "You rated how often pain changes how you train at {answer:pain_limits}." },
      { when: r("pain_limits", 6, 7), weight: 1, because: "Pain changes how you train fairly often ({answer:pain_limits})." },
      {
        when: all(IN_PAIN, TO_FAILURE),
        weight: 1,
        because: "Your sets end {answer:hard_set_habit}, and failure reps are where irritated joints get worse.",
      },
      {
        when: all(IN_PAIN, HIGH_HOURS),
        weight: 1,
        because: "Your week holds {answer:weekly_hours} of lifting, which leaves sore tissue little time to settle.",
      },
      {
        when: all(IN_PAIN, r("form_breakdown", 7, 10)),
        weight: 1,
        because: "Your form changes a lot on heavy reps ({answer:form_breakdown}), which puts load where it hurts.",
      },
      {
        when: all(IN_PAIN, SHORT_ROM),
        weight: 1,
        because: "A full range of motion is not a priority for you ({answer:rom_focus}), and cut-short reps are often pain steering the lift.",
      },
      {
        when: all(IN_PAIN, SWITCHES),
        weight: 1,
        because: "You start new programs often ({answer:program_switch}), which is sometimes a search for one that doesn't hurt.",
      },
    ],
  },

  {
    id: "conditioning_caps_volume",
    audience: "both",
    category: "recovery",
    threshold: 5,
    triggers: [
      {
        when: is("set_recovery", "o3"),
        weight: 3,
        because: "Asked how long your breathing takes to settle after a hard set of ten, you said {answer:set_recovery}.",
      },
      {
        when: is("set_recovery", "2_3"),
        weight: 2,
        because: "Asked how long your breathing takes to settle after a hard set of ten, you said {answer:set_recovery}.",
      },
      {
        when: all(SLOW_SET_RECOVERY, NO_CARDIO),
        weight: 2,
        because: "You do no cardio in a normal week, so nothing trains the engine that recovers you between sets.",
      },
      {
        when: all(SLOW_SET_RECOVERY, is("cardio_sessions", "1")),
        weight: 1,
        because: "You do one cardio session a week, too little to move aerobic fitness.",
      },
      {
        when: all(SLOW_SET_RECOVERY, is("legs_dose", "none", "low")),
        weight: 1,
        because: "Your legs get {answer:legs_dose} a week, and hard leg sessions are the most demanding work for heart and lungs in most programmes.",
      },
      { when: all(SLOW_SET_RECOVERY, OLDER), weight: 1, because: "At {answer:age}, aerobic fitness fades faster when nothing trains it." },
    ],
  },

  /* ═════════════ nutrition ═════════════ */
  {
    id: "deficit_while_expecting_muscle",
    audience: "physique",
    category: "nutrition",
    threshold: 5,
    suppressedBy: ["no_surplus_no_growth", "gaining_too_fast", "fat_loss_without_deficit"],
    triggers: [
      {
        when: all(is("physique_aim", "muscle"), LOSING),
        weight: 4,
        because: "You want {answer:physique_aim} most, yet over the last two months your bodyweight has {answer:weight_trend}.",
      },
      {
        when: all(is("physique_aim", "both"), LOSING, PAST_YEAR_ONE),
        weight: 3,
        because: "You want {answer:physique_aim}, and over the last two months your bodyweight has {answer:weight_trend}.",
      },
      { when: all(WANTS_MUSCLE, LOSING_FAST), weight: 1, because: "Dropping that fast is the pace at which muscle goes with the fat." },
      { when: all(LOSING, UNDER_EATS), weight: 1, because: "On top of the weight loss, you end up eating less than planned at {answer:meal_skip}." },
      { when: all(LOSING, LOOP_BROKEN), weight: 1, because: "Losing weight, you rate how well your training loop runs at {answer:loop_score}." },
      { when: all(LOSING, any(ECTO, BMI_UNDER)), weight: 1, because: "Your frame is {answer:body_type} and you weigh {answer:weight_kg}: there is little to lose." },
      { when: PAST_YEAR_ONE, weight: 1, because: "You've trained for {answer:training_age}, past the stage where muscle grows easily while weight comes off." },
    ],
  },
  {
    id: "no_surplus_no_growth",
    audience: "physique",
    category: "nutrition",
    threshold: 5,
    suppressedBy: ["deficit_while_expecting_muscle", "gaining_too_fast", "recomp_window_closed"],
    triggers: [
      {
        when: all(is("physique_aim", "muscle"), STABLE_WEIGHT),
        weight: 4,
        because: "You want {answer:physique_aim} most, yet over the last two months your bodyweight has {answer:weight_trend}: no surplus, no new tissue.",
      },
      {
        when: all(is("physique_aim", "muscle"), TREND_UNKNOWN),
        weight: 3,
        because: "You want {answer:physique_aim} most and don't weigh yourself, so nobody knows whether a surplus exists.",
      },
      {
        when: all(WANTS_MUSCLE, any(STABLE_WEIGHT, TREND_UNKNOWN), SMALL_APPETITE),
        weight: 2,
        because: "You rated your appetite at {answer:appetite}, and a small appetite quietly caps what you eat.",
      },
      {
        when: all(WANTS_MUSCLE, any(STABLE_WEIGHT, TREND_UNKNOWN), UNDER_EATS),
        weight: 2,
        because: "You end up eating less than planned at {answer:meal_skip}: the surplus exists on paper.",
      },
      { when: all(WANTS_MUSCLE, r("meal_skip", 5, 6)), weight: 1, because: "Some days you end up eating less than planned ({answer:meal_skip})." },
      { when: all(WANTS_MUSCLE, CARBS_LOW), weight: 1, because: "You eat {answer:carbs_g} grams of carbs a day, {answer:carbs_band} at your weight: not a surplus." },
      { when: all(WANTS_MUSCLE, any(ECTO, BMI_UNDER)), weight: 1, because: "Your frame is {answer:body_type} and you weigh {answer:weight_kg}: the build with the least room to grow without extra food." },
      {
        when: PAST_YEAR_ONE,
        weight: 1,
        because: "You've trained for {answer:training_age}, past the stage where muscle grows easily without extra food.",
      },
    ],
  },
  {
    id: "recomp_window_closed",
    audience: "physique",
    category: "nutrition",
    threshold: 5,
    triggers: [
      {
        when: all(is("physique_aim", "both"), STABLE_WEIGHT),
        weight: 3,
        because: "You want {answer:physique_aim}, and over the last two months your bodyweight has {answer:weight_trend}.",
      },
      {
        when: all(is("physique_aim", "both"), TREND_UNKNOWN),
        weight: 3,
        because: "You want {answer:physique_aim} and don't weigh yourself, so neither side of the change is being steered.",
      },
      {
        when: TRAINED_3Y,
        weight: 2,
        because: "You've trained for {answer:training_age}, well past the stage where fat loss and muscle gain happen together.",
      },
      { when: is("training_age", "1_3y"), weight: 1, because: "You've trained for {answer:training_age}, and the recomp window closes fast after year one." },
      {
        when: any(PROTEIN_LOW, PROTEIN_UNKNOWN),
        weight: 1,
        because: "Your protein comes to {answer:protein_band}, and recomposition runs on protein.",
      },
    ],
  },
  {
    id: "gaining_too_fast",
    audience: "physique",
    category: "nutrition",
    threshold: 6,
    suppressedBy: ["deficit_while_expecting_muscle", "no_surplus_no_growth", "fat_loss_without_deficit"],
    triggers: [
      {
        when: all(WANTS_MUSCLE, GAINING_FAST),
        weight: 4,
        because: "Over the last two months your bodyweight has {answer:weight_trend}, faster than new muscle can be built.",
      },
      { when: all(GAINING_FAST, BIG_APPETITE), weight: 2, because: "You rated your appetite at {answer:appetite}: the surplus is easy to overshoot." },
      {
        when: all(GAINING_FAST, r("weekend_eating", 8, 10)),
        weight: 2,
        because: "Your weekends run much looser than your weekdays ({answer:weekend_eating}): the surplus is bigger than the plan.",
      },
      { when: all(GAINING_FAST, r("weekend_eating", 6, 7)), weight: 1, because: "Your weekends run looser than your weekdays ({answer:weekend_eating})." },
      {
        when: all(GAINING_FAST, r("meal_skip", 1, 3)),
        weight: 1,
        because: "You almost never eat less than planned ({answer:meal_skip}), so every planned meal lands, and then some.",
      },
      { when: all(GAINING_FAST, any(ENDO, BMI_OVER)), weight: 1, because: "Your frame is {answer:body_type}, the build that stores a surplus as fat first." },
      { when: all(GAINING_FAST, CARBS_HIGH), weight: 1, because: "You eat {answer:carbs_g} grams of carbs a day, {answer:carbs_band} at your weight." },
      { when: all(GAINING_FAST, DRINKS), weight: 1, because: "You described your drinking as {answer:alcohol}: calories that build nothing." },
    ],
  },
  {
    id: "fat_loss_without_deficit",
    audience: "physique",
    category: "nutrition",
    threshold: 5,
    suppressedBy: ["week_cancels_itself", "deficit_while_expecting_muscle", "gaining_too_fast"],
    triggers: [
      {
        when: all(WANTS_LESS_FAT, NOT_LOSING),
        weight: 4,
        because: "You want {answer:physique_aim} most, yet over the last two months your bodyweight has {answer:weight_trend}: there is no deficit.",
      },
      {
        when: all(WANTS_LESS_FAT, TREND_UNKNOWN),
        weight: 3,
        because: "You want {answer:physique_aim} most and don't weigh yourself, so nobody knows whether a deficit exists.",
      },
      {
        when: all(LEAN_AIM, any(NOT_LOSING, TREND_UNKNOWN), BIG_APPETITE),
        weight: 2,
        because: "You rated your appetite at {answer:appetite}, and eating until satisfied lands at maintenance or above, never below it.",
      },
      {
        when: all(LEAN_AIM, any(NOT_LOSING, TREND_UNKNOWN), r("weekend_eating", 7, 10)),
        weight: 2,
        because: "You rated how much looser your weekend eating gets at {answer:weekend_eating}: two loose days can erase five careful ones.",
      },
      { when: all(WANTS_LESS_FAT, GAINING), weight: 1, because: "Your weight is going up while the goal needs it to come down." },
      {
        when: all(WANTS_LESS_FAT, any(NOT_LOSING, TREND_UNKNOWN), PAST_YEAR_ONE),
        weight: 1,
        because: "You've trained for {answer:training_age}; past the beginner stage, fat rarely comes off without a deliberate deficit.",
      },
      {
        when: all(LEAN_AIM, any(NOT_LOSING, TREND_UNKNOWN), CARBS_HIGH),
        weight: 1,
        because: "You eat {answer:carbs_g} grams of carbs a day, {answer:carbs_band} at your weight, which is hard to fit inside a deficit.",
      },
      { when: all(LEAN_AIM, DRINKS), weight: 1, because: "You described your drinking as {answer:alcohol}, and drinks are the calories nobody plans for." },
      {
        when: all(LEAN_AIM, any(PROTEIN_LOW, PROTEIN_UNKNOWN)),
        weight: 1,
        because: "Your protein comes to {answer:protein_band}, and protein is the food that keeps hunger quiet on a diet.",
      },
    ],
  },
  {
    id: "week_cancels_itself",
    audience: "physique",
    category: "nutrition",
    threshold: 5,
    suppressedBy: ["gaining_too_fast", "fat_loss_without_deficit"],
    triggers: [
      { when: r("weekend_eating", 8, 10), weight: 3, because: "You rated how much looser your weekend eating gets at {answer:weekend_eating}." },
      { when: r("weekend_eating", 6, 7), weight: 1, because: "Your weekends run a little looser than your weekdays ({answer:weekend_eating})." },
      { when: is("alcohol", "weekends"), weight: 2, because: "You described your drinking as {answer:alcohol}." },
      {
        when: all(r("weekend_eating", 6, 10), UNDER_EATS),
        weight: 1,
        because: "You end up eating less than planned at {answer:meal_skip} and loosen up at the weekend: restriction, then rebound.",
      },
      {
        when: all(r("weekend_eating", 6, 10), LEAN_AIM, STABLE_WEIGHT),
        weight: 1,
        because: "You want less fat, yet your weight holds steady: a strict week and a loose weekend average out to maintenance.",
      },
      {
        when: all(r("weekend_eating", 6, 10), HIGH_STRESS),
        weight: 1,
        because: "You rated your stress at {answer:stress}, and the weekend is where stress gets eaten.",
      },
    ],
  },
  {
    id: "protein_unknown",
    audience: "both",
    category: "nutrition",
    threshold: 4,
    triggers: [
      { when: PROTEIN_UNKNOWN, weight: 3, because: "Asked how much protein you eat a day, you said {answer:protein_g}." },
      {
        when: all(PROTEIN_UNKNOWN, is("carbs_g", "unknown")),
        weight: 1,
        because: "Carbs are {answer:carbs_g} too: nothing about your food is being counted.",
      },
      {
        when: all(PROTEIN_UNKNOWN, UNDER_EATS),
        weight: 1,
        because: "You also end up eating less than planned at {answer:meal_skip}, and the meals that shrink take their protein with them.",
      },
      {
        when: all(PROTEIN_UNKNOWN, TREND_UNKNOWN),
        weight: 1,
        because: "You don't weigh yourself either, so nothing about your food is checked against a result.",
      },
      { when: all(PROTEIN_UNKNOWN, r("diet_clean", 1, 5)), weight: 1, because: "You rated how clean your diet is at {answer:diet_clean}, and protein is usually the first thing an unplanned diet skimps on." },
    ],
  },
  {
    id: "protein_below_target",
    audience: "both",
    category: "nutrition",
    threshold: 5,
    triggers: [
      { when: PROTEIN_LOW, weight: 4, because: "You eat {answer:protein_g} grams of protein a day at {answer:weight_kg}: {answer:protein_band}." },
      { when: all(PROTEIN_MID, LOSING), weight: 3, because: "You eat {answer:protein_g} grams of protein a day, {answer:protein_band}, while your bodyweight is coming down, when the need is highest." },
      { when: all(PROTEIN_MID, PHYSIQUE, WANTS_MUSCLE), weight: 2, because: "You eat {answer:protein_g} grams of protein a day, {answer:protein_band}, and you want {answer:physique_aim}." },
      { when: all(any(PROTEIN_LOW, PROTEIN_MID), UNDER_EATS), weight: 1, because: "You also end up eating less than planned at {answer:meal_skip}, so the real number is lower still." },
      { when: all(any(PROTEIN_LOW, PROTEIN_MID), OLDER), weight: 1, because: "At {answer:age}, muscle needs more protein per meal to respond, not less." },
      { when: all(PROTEIN_LOW, TRAINED_3Y), weight: 1, because: "With {answer:training_age} behind you, protein is one of the few levers left that isn't already pulled." },
    ],
  },
  {
    id: "underfuelled_sessions",
    audience: "both",
    category: "nutrition",
    threshold: 5,
    triggers: [
      { when: CARBS_LOW, weight: 3, because: "You eat {answer:carbs_g} grams of carbs a day at {answer:weight_kg}: {answer:carbs_band}." },
      {
        when: all(CARBS_UNKNOWN, FLAT, FOG_ANY),
        weight: 3,
        because: "You don't track carbs, your muscles feel flat in training ({answer:pump}), and you get brain fog or sudden weakness {answer:brain_fog}: the pattern of an empty tank.",
      },
      { when: all(CARBS_LOW, FOG_OFTEN), weight: 2, because: "You get brain fog or sudden weakness {answer:brain_fog}." },
      { when: all(CARBS_LOW, is("brain_fog", "sometimes")), weight: 1, because: "You get brain fog or sudden weakness {answer:brain_fog}." },
      { when: all(CARBS_LOW, FLAT), weight: 2, because: "You rated how full and pumped your muscles get at {answer:pump}, and a muscle short on stored carbs tends to feel flat." },
      {
        when: all(CARBS_LOW_OR_UNKNOWN, LONG_GAP),
        weight: 1,
        because: "You train {answer:pre_meal} hours after your last meal, so the session starts on whatever is left in the tank.",
      },
      {
        when: all(CARBS_LOW_OR_UNKNOWN, is("training_signs", "floaty", "limp")),
        weight: 1,
        because: "Your legs go soft or your muscles turn limp in training, more than once this past month.",
      },
      {
        when: all(CARBS_LOW_OR_UNKNOWN, MUCH_CARDIO),
        weight: 1,
        because: "You do {answer:cardio_sessions} cardio sessions a week, all of it running on the same carb budget.",
      },
      { when: all(CARBS_LOW, HIGH_HOURS), weight: 1, because: "Your week holds {answer:weekly_hours} of lifting, work that runs on glycogen." },
      { when: all(CARBS_LOW, LOSING), weight: 1, because: "Your bodyweight has {answer:weight_trend} over the last two months, which cuts the fuel further." },
      { when: all(CARBS_LOW, LOOP_BROKEN), weight: 1, because: "You rate how well your training loop runs at {answer:loop_score}." },
      { when: all(CARBS_LOW, is("sex", "female"), MUCH_CARDIO), weight: 1, because: "Low fuel on a cardio-heavy week costs female lifters recovery fastest." },
    ],
  },
  {
    id: "inflammatory_diet",
    audience: "both",
    category: "nutrition",
    threshold: 5,
    triggers: [
      { when: r("diet_clean", 1, 3), weight: 3, because: "You rated how clean your diet is at {answer:diet_clean}." },
      { when: r("diet_clean", 4, 5), weight: 2, because: "You rated how clean your diet is at {answer:diet_clean}: about half of it is the greasy, processed kind." },
      { when: all(DIRTY_DIET, POOR_WAKE), weight: 1, because: "You wake up at {answer:wake_rested} on the rested scale." },
      { when: all(DIRTY_DIET, IN_PAIN), weight: 1, because: "Pain changes how you train at {answer:pain_limits}, and irritated joints are where a greasy diet shows first." },
      { when: all(DIRTY_DIET, FOG_ANY), weight: 1, because: "You get brain fog or sudden weakness {answer:brain_fog}." },
      { when: all(DIRTY_DIET, DRINKS), weight: 1, because: "You described your drinking as {answer:alcohol}, which adds to the same load." },
      { when: all(DIRTY_DIET, PHYSIQUE, LEAN_AIM, BMI_OVER), weight: 1, because: "You want {answer:physique_aim} at a body mass index of {answer:bmi_band}, and that kind of eating makes both harder." },
      { when: all(r("diet_clean", 1, 5), LOOP_BROKEN), weight: 1, because: "You rate how well your training loop runs at {answer:loop_score}." },
    ],
  },
  {
    id: "electrolytes_running_low",
    audience: "both",
    category: "nutrition",
    threshold: 6,
    triggers: [
      { when: SIGNS_SEVERAL, weight: 4, because: "More than once this past month, during or after training, you got {answer:training_signs}." },
      { when: is("signs_count", "one"), weight: 2, because: "More than once this past month, during or after training, you got {answer:training_signs}." },
      { when: all(SIGNS_ANY, is("training_signs", "cramps", "twitches")), weight: 1, because: "Cramps and twitches are the most specific of those signs." },
      {
        when: all(SIGNS_ANY, HEAVY_SWEAT),
        weight: 1,
        because: "Asked how you sweat in a session, you said {answer:sweat_level}, and every litre of sweat takes sodium with it.",
      },
      {
        when: all(SIGNS_ANY, SALTY),
        weight: 1,
        because: "The white marks your sweat leaves are salt it carried out of your body.",
      },
      { when: all(SIGNS_ANY, VERY_MUCH_CARDIO), weight: 1, because: "You do {answer:cardio_sessions} cardio sessions a week, so you sweat a lot of the week away." },
      { when: all(SIGNS_ANY, COFFEE_HIGH), weight: 1, because: "You drink {answer:coffee} cups of coffee a day." },
      { when: all(SIGNS_ANY, CARBS_LOW), weight: 1, because: "You eat {answer:carbs_g} grams of carbs a day, and a low-carb week drains minerals with the water it sheds." },
      { when: all(SIGNS_ANY, CLEAN_DIET), weight: 1, because: "You rated how clean your diet is at {answer:diet_clean}: whole-food eating is usually the low-salt kind." },
      { when: all(SIGNS_ANY, LOSING), weight: 1, because: "Your bodyweight has {answer:weight_trend}: less food means less of every mineral in it." },
    ],
  },
  {
    id: "strength_leaking_bodyweight",
    audience: "strength",
    category: "nutrition",
    threshold: 5,
    triggers: [
      { when: LOSING, weight: 3, because: "Over the last two months your bodyweight has {answer:weight_trend} while you ask your lifts to go up." },
      { when: all(LOSING, LOSING_FAST), weight: 1, because: "At that pace, the weight loss takes strength along with the fat." },
      { when: all(LOSING, UNDER_EATS), weight: 2, because: "You rated how often you end up eating less than planned at {answer:meal_skip}." },
      { when: all(LOSING, LOOP_BROKEN), weight: 1, because: "Losing weight, you rate how well your training loop runs at {answer:loop_score}." },
      { when: all(LOSING, CARBS_LOW), weight: 1, because: "You eat {answer:carbs_g} grams of carbs a day, {answer:carbs_band} at your weight, and heavy lifting runs on carbs." },
      { when: all(LOSING, MUCH_CARDIO), weight: 1, because: "You do {answer:cardio_sessions} cardio sessions a week on top of the weight loss." },
    ],
  },

  /* ═════════════ lifestyle ═════════════ */
  {
    id: "cardio_eating_the_budget",
    audience: "both",
    category: "lifestyle",
    threshold: 5,
    triggers: [
      { when: VERY_MUCH_CARDIO, weight: 3, because: "You do {answer:cardio_sessions} cardio sessions a week on top of your lifting." },
      { when: is("cardio_sessions", "4"), weight: 1, because: "You do {answer:cardio_sessions} cardio sessions a week on top of your lifting." },
      {
        when: all(MUCH_CARDIO, LOOP_BROKEN),
        weight: 2,
        because: "Next to all that cardio, you rate how well your training loop runs at {answer:loop_score}.",
      },
      {
        when: all(MUCH_CARDIO, UNDER_EATS),
        weight: 1,
        because: "You end up eating less than planned at {answer:meal_skip}, so the extra work is not being paid for.",
      },
      { when: all(MUCH_CARDIO, CARBS_LOW), weight: 1, because: "You eat {answer:carbs_g} grams of carbs a day, {answer:carbs_band} at your weight, and cardio spends carbs first." },
      {
        when: all(MUCH_CARDIO, POOR_WAKE, SLEEP_OK),
        weight: 1,
        because: "You sleep {answer:sleep_hours} hours yet wake up unrested ({answer:wake_rested}), and the extra work is the likeliest reason.",
      },
      { when: all(MUCH_CARDIO, HIGH_HOURS), weight: 1, because: "It sits on top of {answer:weekly_hours} of lifting a week." },
    ],
  },
  {
    id: "alcohol_tax",
    audience: "both",
    category: "lifestyle",
    threshold: 5,
    triggers: [
      { when: is("alcohol", "often"), weight: 3, because: "You described your drinking as {answer:alcohol}." },
      { when: is("alcohol", "weekends"), weight: 2, because: "You described your drinking as {answer:alcohol}." },
      {
        when: all(DRINKS, POOR_WAKE),
        weight: 1,
        because: "You wake up at {answer:wake_rested} on the rested scale, and alcohol takes the deepest part of the night.",
      },
      {
        when: all(DRINKS, r("full_nights", 1, 4)),
        weight: 1,
        because: "You rarely get a full night's sleep ({answer:full_nights}), and drinking nights are the shortest ones.",
      },
      { when: all(DRINKS, LOOP_BROKEN), weight: 1, because: "You rate how well your training loop runs at {answer:loop_score}, and the night before is a common reason." },
      {
        when: all(DRINKS, any(IRREGULAR, OFTEN_OFF)),
        weight: 1,
        because: "Your bed and wake times are {answer:sleep_regular}; drinking nights are usually the ones that move them.",
      },
    ],
  },
  {
    id: "caffeine_overload",
    audience: "both",
    category: "lifestyle",
    threshold: 4,
    triggers: [
      { when: COFFEE_VERY_HIGH, weight: 3, because: "You drink {answer:coffee} cups of coffee a day." },
      { when: is("coffee", "3"), weight: 2, because: "You drink {answer:coffee} cups of coffee a day." },
      { when: all(COFFEE_HIGH, POOR_WAKE), weight: 1, because: "You wake up at {answer:wake_rested} on the rested scale, which is where the afternoon cups land." },
      { when: all(COFFEE_HIGH, r("full_nights", 1, 5)), weight: 1, because: "You get a full night's sleep {answer:full_nights} of the time." },
      { when: all(COFFEE_HIGH, is("training_signs", "dizzy")), weight: 1, because: "You told us you get dizziness or a racing heart in training." },
      { when: all(COFFEE_HIGH, FOG_ANY), weight: 1, because: "You get brain fog or sudden weakness {answer:brain_fog}, the shape of a stimulant wearing off mid-session." },
      { when: all(COFFEE_HIGH, HIGH_STRESS), weight: 1, because: "Life stress sits at {answer:stress}, and caffeine runs on the same wiring." },
    ],
  },

  /* ═════════════ consistency ═════════════ */
  {
    id: "missed_dose",
    audience: "both",
    category: "consistency",
    threshold: 4,
    suppressedBy: ["restart_not_stall", "consistency_gap"],
    triggers: [
      { when: ON_OFF, weight: 3, because: "You described your last few months of training as {answer:training_pattern}." },
      { when: FEW_SESSIONS, weight: 2, because: "You lift {answer:sessions_week} sessions a week." },
      {
        when: FREQUENCY_VARIES,
        weight: 1,
        because: "Asked how often your stuck lift gets trained, you said it depends on the week, which is what a patchy routine looks like from inside.",
      },
      { when: all(ON_OFF, HIGH_STRESS), weight: 1, because: "You rated your stress at {answer:stress}, and sessions are the first thing stress takes." },
      { when: all(ON_OFF, LOW_DRIVE), weight: 1, because: "Your urge to train sits at {answer:drive}." },
      { when: all(FEW_SESSIONS, LOW_HOURS), weight: 1, because: "Those sessions add up to {answer:weekly_hours} of lifting a week." },
    ],
  },
  {
    id: "consistency_gap",
    audience: "both",
    category: "consistency",
    threshold: 5,
    triggers: [
      {
        when: all(STEADY, LOOP_BROKEN),
        weight: 4,
        because: "Early on you described your last few months as {answer:training_pattern}; later you rated how well your training loop runs at {answer:loop_score}.",
      },
      { when: all(STEADY, r("loop_score", 1, 2)), weight: 1, because: "A loop that low is not steady, however regular the attendance." },
      { when: all(STEADY, LOOP_BROKEN, POOR_WAKE), weight: 1, because: "You wake up at {answer:wake_rested} on the rested scale, so the loop breaks before the session starts." },
      { when: all(STEADY, LOOP_BROKEN, HIGH_STRESS), weight: 1, because: "With stress at {answer:stress}, showing up is the part you can control; recovering is the part stress takes." },
      { when: all(STEADY, LOOP_BROKEN, LOW_DRIVE), weight: 1, because: "Your urge to train sits at {answer:drive}: attendance is running on discipline alone." },
    ],
  },
  {
    id: "restart_not_stall",
    audience: "both",
    category: "consistency",
    threshold: 5,
    suppressedBy: ["missed_dose"],
    triggers: [
      { when: COMEBACK, weight: 4, because: "Asked about your last few months of training, you said {answer:training_pattern}." },
      {
        when: all(COMEBACK, PAST_YEAR_ONE),
        weight: 1,
        because: "With {answer:training_age} behind you, what you built before the break comes back faster than it was built.",
      },
      { when: all(COMEBACK, not("sessions_week", "1", "2")), weight: 1, because: "You're showing up now: {answer:sessions_week} sessions a week." },
      {
        when: all(COMEBACK, SWITCHES),
        weight: 1,
        because: "You start new programs often ({answer:program_switch}), and a comeback is when a new program is most tempting.",
      },
    ],
  },

  /* ═════════════ expectations ═════════════ */
  {
    id: "expecting_year_one_speed",
    audience: "both",
    category: "expectations",
    threshold: 6,
    // "Slow is normal" is the verdict of last resort: any finding that outscores it wins the headline.
    suppressedBy: [
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
    ],
    triggers: [
      { when: all(is("training_age", "over_6y"), CLEAN), weight: 3, because: "You've trained for {answer:training_age}." },
      { when: all(is("training_age", "3_6y"), CLEAN), weight: 2, because: "You've trained for {answer:training_age}." },
      { when: r("effort_grind", 7, 10), weight: 1, because: "Your sets are genuinely hard: your last rep grinds at {answer:effort_grind}." },
      { when: r("beat_last", 7, 10), weight: 1, because: "You rated how often you try to beat what you did last time at {answer:beat_last}." },
      {
        when: all(STEADY, not("sessions_week", "1", "2")),
        weight: 1,
        because: "Your training has been {answer:training_pattern} at {answer:sessions_week} sessions a week.",
      },
      { when: r("full_nights", 7, 10), weight: 1, because: "You rated how often you get a full night's sleep at {answer:full_nights}." },
      { when: r("program_switch", 1, 3), weight: 1, because: "You rarely start a new program ({answer:program_switch})." },
      { when: all(CLEAN, OLDER), weight: 1, because: "At {answer:age}, the same honest work returns a little less each year, and that is not a mistake." },
    ],
  },
];

/* ═════════════ clearances ═════════════ */
export const CLEARANCES: ClearanceRule[] = [
  {
    id: "effort_is_there",
    audience: "both",
    when: all(is("hard_set_habit", "push"), r("effort_grind", 6, 9)),
    title: "Effort isn't your problem",
    text: "Your sets end just short of failure and your last reps genuinely slow down. The stimulus is real, so this report won't ask you to try harder, only to aim it better.",
  },
  {
    id: "progression_in_place",
    audience: "both",
    when: any(all(is("load_choice", "plan"), r("beat_last", 7, 10)), r("beat_last", 8, 10)),
    title: "Something already pushes your weights up",
    text: "You try to beat what you did last time most of the time, or your program does the pushing for you. Progression pressure is there; the stall is coming from somewhere else.",
  },
  {
    id: "protein_covered",
    audience: "both",
    when: all(is("protein_band", "high"), r("meal_skip", 1, 5)),
    title: "Protein is handled",
    text: "At your bodyweight, the protein you eat clears the level muscle needs, and you rarely end up eating less than planned. That habit does the job; nobody needs to sell you more of it.",
  },
  {
    id: "carbs_fuel_training",
    audience: "both",
    when: all(is("carbs_band", "mid", "high"), r("meal_skip", 1, 5), r("pump", 5, 10)),
    title: "Your sessions are fuelled",
    text: "The carbs you eat cover the training you do at your bodyweight, and your muscles fill up when you train. Fuel isn't what's holding the sessions back.",
  },
  {
    id: "sleep_covered",
    audience: "both",
    when: all(is("sleep_band", "ok", "long"), r("full_nights", 8, 10), r("wake_rested", 7, 10)),
    title: "Sleep is doing its job",
    text: "You sleep a full night most nights and wake up rested. Whatever is holding you back, it isn't recovery hours.",
  },
  {
    id: "sleep_clock_steady",
    audience: "both",
    when: all(is("sleep_regular", "same"), is("sleep_band", "ok", "long")),
    title: "Your sleep clock is steady",
    text: "You go to bed and wake at about the same times and get enough hours. A regular clock is worth more than most people think, and you already have one.",
  },
  {
    id: "you_show_up",
    audience: "both",
    when: all(STEADY, not("sessions_week", "1", "2")),
    title: "You show up",
    text: "Your training has been steady at three or more sessions a week. Consistency is the hardest part of training and you already have it.",
  },
  {
    id: "loop_is_healthy",
    audience: "both",
    when: all(LOOP_OK, r("wake_rested", 6, 10)),
    title: "Your training loop runs",
    text: "You arrive in decent shape, train well, recover and start the next session from there. That loop is what most stalled lifters are missing; yours is intact.",
  },
  {
    id: "plan_gets_time",
    audience: "both",
    when: r("program_switch", 1, 3),
    title: "You give a plan time to work",
    text: "You stick with a program instead of starting over. That patience is uncommon, and it means the fix can be a change inside your plan, not a new plan.",
  },
  {
    id: "pain_free",
    audience: "both",
    when: r("pain_limits", 1, 2),
    title: "Pain isn't holding you back",
    text: "Pain almost never changes how you train, so every lift in your program is available to you at full range and full load.",
  },
  {
    id: "full_range_respected",
    audience: "both",
    when: r("rom_focus", 8, 10),
    title: "Your reps stay honest",
    text: "A full range of motion is a priority on every rep, so the numbers you add are real strength, not shorter reps.",
  },
  {
    id: "drive_intact",
    audience: "both",
    when: r("drive", 7, 10),
    title: "The drive is there",
    text: "Your urge to train and chase records is strong. That is not a small thing; it means whatever is stalling you is mechanical, not motivational.",
  },
  {
    id: "alcohol_not_a_factor",
    audience: "both",
    when: is("alcohol", "none", "light"),
    title: "Alcohol isn't a factor",
    text: "You drink little or nothing. There is no recovery tax to pay here.",
  },
  {
    id: "caffeine_in_range",
    audience: "both",
    when: all(is("coffee", "0", "1", "2"), NO_SIGNS),
    title: "Caffeine is in range",
    text: "Two cups or fewer a day and none of the signs that come with too much. Coffee is not what's wearing you down.",
  },
  {
    id: "no_training_signs",
    audience: "both",
    when: all(NO_SIGNS, is("brain_fog", "never")),
    title: "Your body isn't sending warnings",
    text: "No cramps, twitches, dizziness or foggy sessions. The minerals and fuel that keep a session steady are covering the work you do.",
  },
  {
    id: "diet_is_clean",
    audience: "both",
    when: CLEAN_DIET,
    title: "Your food is clean",
    text: "Most of what you eat is whole food you recognise. Whatever the report finds, it won't be a diet that keeps you inflamed.",
  },
  {
    id: "life_leaves_room",
    audience: "both",
    when: all(r("stress", 1, 4), is("cardio_sessions", "0", "1", "2", "3")),
    title: "Life leaves room to recover",
    text: "Your stress is low and you're not stacking a heavy cardio load on top of lifting. Life outside the gym isn't what's draining your recovery.",
  },
  {
    id: "not_overreaching",
    audience: "both",
    when: all(is("weekly_hours", "moderate"), is("sessions_week", "3", "4", "5"), LOOP_OK),
    title: "You're not doing too much",
    text: "Your week holds a normal dose of lifting and your loop runs. You are not piling on more work than you can recover from.",
  },
  {
    id: "balanced_week",
    audience: "both",
    when: all(is("legs_share", "ok"), is("arms_share", "ok"), not("weekly_hours", "low")),
    title: "Your week is balanced",
    text: "Legs get a fair share of your hours and arms don't eat the week. The dose is spread the way a body grows evenly.",
  },
  {
    id: "eating_matches_goal",
    audience: "physique",
    when: all(
      WANTS_MUSCLE,
      is("weight_trend", "up"),
      r("appetite", 4, 7),
      r("weekend_eating", 1, 5),
      r("meal_skip", 1, 5),
      PROTEIN_OK,
      is("alcohol", "none", "light"),
    ),
    title: "Your eating points the right way",
    text: "You want muscle and your weight is climbing slowly, the pace that builds muscle without much fat. Your protein is where it needs to be and no weekend swing undoes it.",
  },
  {
    id: "deficit_is_real",
    audience: "physique",
    when: all(WANTS_LESS_FAT, is("weight_trend", "down"), r("appetite", 1, 7), r("weekend_eating", 1, 5)),
    title: "Your deficit is real",
    text: "You want less fat and your weight is coming down steadily, your appetite isn't fighting you, and your weekends don't undo the week. The diet itself is working.",
  },
  {
    id: "lagging_gets_priority",
    audience: "physique",
    when: all(SPECIFIC_LAG, is("lagging_priority", "first"), r("feel_target", 6, 10)),
    title: "Your slowest area gets your best",
    text: "You train your slowest area first, while you're fresh, and you can feel the target muscle doing the work. If it's still slow, the reason isn't where it sits in your session or how you execute it.",
  },
  {
    id: "lagging_gets_dose",
    audience: "physique",
    when: all(SPECIFIC_LAG, is("lagging_dose", "ok", "high")),
    title: "Your slowest area gets enough work",
    text: "By your own count, the muscles behind your slowest area get two or more sessions a week. The dose is there; the report looks at how it's spent.",
  },
  {
    id: "heavy_is_practised",
    audience: "strength",
    when: all(r("heavy_practice", 6, 7), is("max_testing", "never", "few_months"), r("form_breakdown", 1, 5)),
    title: "You practise heavy without living there",
    text: "You lift close to your max regularly but rarely test it. That's the balance strong lifters run: heavy enough to be familiar, not so often that it's all testing.",
  },
  {
    id: "technique_holds",
    audience: "strength",
    when: all(r("form_breakdown", 1, 3), KNOWN_FAIL_POINT),
    title: "Your technique holds under load",
    text: "Your form barely changes on heavy reps and you know exactly where a heavy rep gets hard. The lift you practise is the lift you test.",
  },
  {
    id: "fuel_is_there",
    audience: "strength",
    when: all(is("weight_trend", "same", "up"), r("meal_skip", 1, 4), PROTEIN_OK),
    title: "Your lifts have fuel",
    text: "Your weight is holding or climbing slowly, you rarely end up eating less than planned, and your protein is where it needs to be. The food side of strength is covered; the stall is coming from somewhere else.",
  },
  {
    id: "engine_keeps_up",
    audience: "both",
    when: all(is("set_recovery", "u1", "1_2"), is("cardio_sessions", "2", "3", "4", "5plus")),
    title: "Your engine keeps up",
    text: "Your breathing settles within two minutes of a hard set and you do regular cardio. Your conditioning recovers you between sets, so it isn't what's capping your work.",
  },
];
