/**
 * LiftDecode rules (v2): 31 findings, 17 clearances.
 *
 * score = sum of matched trigger weights; a finding shows when score ≥ threshold.
 * Every threshold is above the largest single weight, so no finding is named from
 * one answer. Findings whose premise is one fact (you diet, you train to failure,
 * your week is big) carry that fact as a gate: the other triggers can't reach the
 * threshold without it. Corroborations are written as all(factor, symptom) so a
 * tired lifter is never told they drink or run too much, and a busy week is never
 * called too much work unless something says recovery is failing.
 * because-lines read naturally whether {answer:x} renders a quoted label or "7/10";
 * clearance text uses no {answer:} tokens.
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
const LOW_ENERGY = r("session_energy", 1, 4);
const POOR_WAKE = r("wake_rested", 1, 4);
/** ends up eating less than planned most days */
const UNDER_EATS = r("meal_skip", 7, 10);
const HIGH_VOLUME = r("volume_feel", 8, 10);
const BIG_WEEK = r("volume_feel", 7, 10);
const LOW_VOLUME = r("volume_feel", 1, 3);
const HIGH_STRESS = r("stress", 8, 10);
const STRESSED = r("stress", 6, 10);
const IN_PAIN = r("pain_limits", 6, 10);
const ACTIVE = r("activity_load", 6, 10);
/** a symptom that recovery is failing, required before a big week is blamed */
const NOT_RECOVERING = any(LOW_ENERGY, IN_PAIN);
const PAST_YEAR_ONE = not("training_age", "under_1y");
const TRAINED_3Y = is("training_age", "3_6y", "over_6y");
const TO_FAILURE = is("hard_set_habit", "failure");
/** says "At failure" and the reps agree: the last rep really grinds */
const FAILS = all(TO_FAILURE, r("effort_grind", 5, 10));
const DIETING = is("eating_phase", "lose");
const NOT_DIETING = not("eating_phase", "lose");
const DRINKS = is("alcohol", "weekends", "often");
const STEADY = is("training_pattern", "steady");
const COMEBACK = is("training_pattern", "comeback");
const SPECIFIC_LAG = not("lagging_area", "everything");
const KNOWN_FAIL_POINT = is("fail_point", "bottom", "middle", "top");
const FREQUENCY_VARIES = any(is("muscle_frequency", "varies"), is("lift_frequency", "varies"));
const SHORTER = is("range_under_load", "shorter");
const SWITCHES = r("program_switch", 7, 10);
const TESTS_OFTEN = is("max_testing", "monthly", "weekly");
const BIG_APPETITE = is("appetite", "big");
const WANTS_LESS_FAT = is("physique_aim", "leaner");
const LEAN_AIM = is("physique_aim", "leaner", "both");
const WANTS_MUSCLE = is("physique_aim", "muscle", "both");

/** food points the way the goal does (strength: not dieting; physique: plan matches aim, no leak) */
const DIET_ALIGNED = any(
  all(STRENGTH, NOT_DIETING),
  all(
    PHYSIQUE,
    not("appetite", "big"),
    r("weekend_eating", 1, 6),
    any(all(WANTS_MUSCLE, is("eating_phase", "gain")), all(WANTS_LESS_FAT, DIETING)),
  ),
);
/**
 * No red flag anywhere else. "Slow is normal" is only honest when recovery,
 * attendance, effort, progression, pain and food are all in order.
 */
const CLEAN = all(
  is("alcohol", "none", "light"),
  r("session_energy", 5, 10),
  r("missed_sessions", 1, 5),
  r("full_nights", 5, 10),
  r("pain_limits", 1, 7),
  r("protein_meals", 4, 10),
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
      { when: r("beat_last", 1, 4), weight: 1, because: "You rarely try to beat your last session ({answer:beat_last}), so nothing pulls a set past comfortable." },
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
      { when: all(FAILS, HIGH_VOLUME), weight: 1, because: "Every set goes to failure, and you train more than most lifters ({answer:volume_feel})." },
      { when: all(FAILS, LOW_ENERGY), weight: 1, because: "Sets to failure, and you rate the energy you bring to sessions at {answer:session_energy}." },
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
      { when: r("beat_last", 1, 4), weight: 3, because: "You rated how often you try to beat your last session at {answer:beat_last}." },
      { when: r("beat_last", 5, 6), weight: 1, because: "You only sometimes try to beat your last session ({answer:beat_last})." },
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
        because: "Asked how often things get trained, you said it depends on the week: that happens when the program underneath keeps changing.",
      },
      {
        when: all(SWITCHES, r("beat_last", 1, 4)),
        weight: 1,
        because: "You rarely try to beat your last session ({answer:beat_last}), so a program never gets the chance to prove itself.",
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
      { when: is("muscle_frequency", "once"), weight: 1, because: "Each muscle gets trained {answer:muscle_frequency}, so a lagging area gets one shot a week." },
      {
        when: all(is("lagging_priority", "last"), LOW_ENERGY),
        weight: 1,
        because: "It comes last, and you rate the energy you bring to sessions at {answer:session_energy}: it gets what's left of very little.",
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
      { when: r("volume_feel", 1, 4), weight: 1, because: "You train less than most lifters ({answer:volume_feel}): little of it builds, most of it measures." },
      {
        when: all(any(TESTS_OFTEN, r("heavy_practice", 8, 10)), LOW_ENERGY),
        weight: 1,
        because: "Living that close to your max, you bring {answer:session_energy} energy to sessions.",
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
      { when: DIETING, weight: 1, because: "You're eating to {answer:eating_phase}, which gives new muscle nothing to be built from." },
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
      { when: r("volume_feel", 1, 4), weight: 2, because: "You rated how much you train next to most lifters at {answer:volume_feel}." },
      {
        when: all(is("main_lift", "bench", "press"), is("lift_frequency", "once", "varies")),
        weight: 1,
        because: "Your stuck lift is the {answer:main_lift}, and pressing lifts respond to frequency more than any other.",
      },
      { when: r("missed_sessions", 7, 10), weight: 1, because: "You miss planned sessions at {answer:missed_sessions}, which thins out the practice further." },
    ],
  },
  {
    id: "target_muscle_underdosed",
    audience: "physique",
    category: "volume",
    threshold: 4,
    suppressedBy: ["volume_outruns_recovery"],
    triggers: [
      { when: LOW_VOLUME, weight: 3, because: "You rated how much you train next to most lifters at {answer:volume_feel}." },
      { when: r("volume_feel", 4, 5), weight: 1, because: "You train a little less than most lifters ({answer:volume_feel})." },
      { when: is("muscle_frequency", "once"), weight: 2, because: "Each muscle gets trained {answer:muscle_frequency}." },
      { when: is("muscle_frequency", "varies"), weight: 1, because: "Asked how often each muscle gets trained, you said {answer:muscle_frequency}." },
      {
        when: r("missed_sessions", 7, 10),
        weight: 1,
        because: "You miss planned sessions at {answer:missed_sessions}, so the dose on paper is bigger than the one you get.",
      },
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
    audience: "physique",
    category: "technique",
    threshold: 5,
    triggers: [
      { when: SHORTER, weight: 4, because: "As the weight goes up, your range of motion {answer:range_under_load}." },
      {
        when: all(SHORTER, r("beat_last", 8, 10)),
        weight: 1,
        because: "You try to beat your last session at {answer:beat_last}, faster than a full range usually survives.",
      },
      {
        when: all(SHORTER, IN_PAIN),
        weight: 1,
        because: "Pain changes how you train at {answer:pain_limits}, and a range that shrinks is often pain steering the rep.",
      },
      {
        when: all(SHORTER, TO_FAILURE),
        weight: 1,
        because: "Your sets end {answer:hard_set_habit}, and the last reps of a failure set are the ones that get cut short.",
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
      { when: HIGH_VOLUME, weight: 3, because: "You rated how much you train next to most lifters at {answer:volume_feel}." },
      {
        when: all(BIG_WEEK, LOW_ENERGY),
        weight: 2,
        because: "You train a lot ({answer:volume_feel}) yet rate the energy you bring to sessions at {answer:session_energy}.",
      },
      {
        when: all(BIG_WEEK, POOR_WAKE, r("full_nights", 6, 10)),
        weight: 1,
        because: "You sleep full nights most of the time ({answer:full_nights}) yet rate how rested you wake up at {answer:wake_rested}: the training, not the sleep, is outrunning you.",
      },
      {
        when: all(BIG_WEEK, IN_PAIN),
        weight: 1,
        because: "Pain changes how you train at {answer:pain_limits}, a common cost of more work than the body can absorb.",
      },
      { when: all(BIG_WEEK, HIGH_STRESS), weight: 1, because: "Life stress sits at {answer:stress}, drawing on the same recovery as your training." },
      {
        when: all(BIG_WEEK, is("muscle_frequency", "three"), NOT_RECOVERING),
        weight: 1,
        because: "Each muscle gets trained {answer:muscle_frequency}, and the signs above say it isn't recovering in between.",
      },
      {
        when: all(BIG_WEEK, is("lift_frequency", "three"), NOT_RECOVERING),
        weight: 1,
        because: "You train your stuck lift {answer:lift_frequency}, and the signs above say it isn't recovering in between.",
      },
      {
        when: all(BIG_WEEK, r("heavy_practice", 8, 10), NOT_RECOVERING),
        weight: 1,
        because: "You lift close to your max at {answer:heavy_practice}, the most expensive work there is to recover from.",
      },
    ],
  },
  {
    id: "sleep_under_dose",
    audience: "both",
    category: "recovery",
    threshold: 4,
    triggers: [
      { when: r("full_nights", 1, 3), weight: 3, because: "You rated how often you get a full night's sleep at {answer:full_nights}." },
      { when: r("full_nights", 4, 5), weight: 1, because: "You get a full night's sleep only about half the time ({answer:full_nights})." },
      { when: r("wake_rested", 1, 3), weight: 2, because: "You rated how rested you wake up at {answer:wake_rested}." },
      { when: r("wake_rested", 4, 5), weight: 1, because: "You wake up only half-rested ({answer:wake_rested})." },
      {
        when: all(any(r("full_nights", 1, 5), r("wake_rested", 1, 5)), LOW_ENERGY),
        weight: 1,
        because: "Poor sleep follows you into the gym: you rate the energy you bring to sessions at {answer:session_energy}.",
      },
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
      { when: all(STRESSED, LOW_ENERGY), weight: 1, because: "Stress follows you into the gym: you bring {answer:session_energy} energy to sessions." },
      {
        when: all(STRESSED, r("full_nights", 1, 4)),
        weight: 1,
        because: "You rarely get a full night's sleep ({answer:full_nights}), which is where stress collects its bill.",
      },
      { when: all(STRESSED, r("missed_sessions", 6, 10)), weight: 1, because: "You miss planned sessions at {answer:missed_sessions}; life is taking them." },
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
        when: all(IN_PAIN, HIGH_VOLUME),
        weight: 1,
        because: "You train more than most lifters ({answer:volume_feel}), which leaves sore tissue little time to settle.",
      },
      {
        when: all(IN_PAIN, r("form_breakdown", 7, 10)),
        weight: 1,
        because: "Your form changes a lot on heavy reps ({answer:form_breakdown}), which puts load where it hurts.",
      },
      {
        when: all(IN_PAIN, SHORTER),
        weight: 1,
        because: "Your range of motion {answer:range_under_load} as the weight climbs, which often means pain is steering the rep.",
      },
      {
        when: all(IN_PAIN, SWITCHES),
        weight: 1,
        because: "You start new programs often ({answer:program_switch}), which is sometimes a search for one that doesn't hurt.",
      },
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
        when: all(is("physique_aim", "muscle"), DIETING),
        weight: 4,
        because: "You want {answer:physique_aim} most, and you're eating to {answer:eating_phase}.",
      },
      {
        when: all(is("physique_aim", "both"), DIETING, PAST_YEAR_ONE),
        weight: 3,
        because: "You want {answer:physique_aim}, and you're eating to {answer:eating_phase}.",
      },
      { when: all(DIETING, UNDER_EATS), weight: 1, because: "On top of the diet, you end up eating less than planned at {answer:meal_skip}." },
      { when: all(DIETING, LOW_ENERGY), weight: 1, because: "Dieting, you bring {answer:session_energy} energy to your sessions." },
      { when: PAST_YEAR_ONE, weight: 1, because: "You've trained for {answer:training_age}, past the stage where muscle grows easily on a diet." },
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
        when: all(is("physique_aim", "muscle"), is("eating_phase", "maintain", "none")),
        weight: 4,
        because: "You want {answer:physique_aim}, and asked what you're eating for, you said {answer:eating_phase}.",
      },
      {
        when: all(WANTS_MUSCLE, is("eating_phase", "gain"), UNDER_EATS),
        weight: 4,
        because: "You're eating to {answer:eating_phase}, yet you end up eating less than planned at {answer:meal_skip}: the surplus exists on paper.",
      },
      {
        when: all(WANTS_MUSCLE, is("eating_phase", "gain"), is("appetite", "small"), r("meal_skip", 1, 6)),
        weight: 4,
        because: "You're eating to {answer:eating_phase}, but asked about your appetite you said {answer:appetite}: the surplus you're eating for rarely happens.",
      },
      { when: UNDER_EATS, weight: 1, because: "You rated how often you end up eating less than planned at {answer:meal_skip}." },
      { when: r("meal_skip", 5, 6), weight: 1, because: "Some days you end up eating less than planned ({answer:meal_skip})." },
      {
        when: all(is("appetite", "small"), not("eating_phase", "gain")),
        weight: 1,
        because: "Asked about your appetite, you said {answer:appetite}, and a small appetite quietly caps what you eat.",
      },
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
        when: all(is("physique_aim", "both"), is("eating_phase", "maintain", "none")),
        weight: 3,
        because: "You want {answer:physique_aim}, and asked what you're eating for, you said {answer:eating_phase}.",
      },
      {
        when: TRAINED_3Y,
        weight: 2,
        because: "You've trained for {answer:training_age}, well past the stage where fat loss and muscle gain happen together.",
      },
      { when: is("training_age", "1_3y"), weight: 1, because: "You've trained for {answer:training_age}, and the recomp window closes fast after year one." },
      {
        when: r("protein_meals", 1, 5),
        weight: 1,
        because: "Only some of your meals are built around protein ({answer:protein_meals}), and recomposition runs on protein.",
      },
    ],
  },
  {
    id: "gaining_too_fast",
    audience: "physique",
    category: "nutrition",
    threshold: 6,
    suppressedBy: ["deficit_while_expecting_muscle", "no_surplus_no_growth"],
    triggers: [
      {
        when: all(WANTS_MUSCLE, is("eating_phase", "gain"), BIG_APPETITE, r("meal_skip", 1, 6)),
        weight: 4,
        because: "You're eating to {answer:eating_phase}, and asked about your appetite you said {answer:appetite}: the surplus is easy to overshoot.",
      },
      {
        when: all(is("eating_phase", "gain"), r("meal_skip", 1, 5)),
        weight: 1,
        because: "You rarely end up eating less than planned ({answer:meal_skip}), so the whole surplus arrives, and then some.",
      },
      {
        when: r("weekend_eating", 8, 10),
        weight: 2,
        because: "Your weekends run much looser than your weekdays ({answer:weekend_eating}): the surplus is bigger than the plan.",
      },
      { when: r("weekend_eating", 6, 7), weight: 1, because: "Your weekends run looser than your weekdays ({answer:weekend_eating})." },
      { when: DRINKS, weight: 1, because: "You described your drinking as {answer:alcohol}: calories that build nothing." },
    ],
  },
  {
    id: "fat_loss_without_deficit",
    audience: "physique",
    category: "nutrition",
    threshold: 5,
    suppressedBy: ["week_cancels_itself", "deficit_while_expecting_muscle"],
    triggers: [
      {
        when: all(WANTS_LESS_FAT, NOT_DIETING),
        weight: 4,
        because: "You want {answer:physique_aim} most; asked what you're eating for, you said {answer:eating_phase}.",
      },
      {
        when: all(LEAN_AIM, DIETING, BIG_APPETITE),
        weight: 3,
        because: "You're eating to {answer:eating_phase}, and on a diet an appetite that's hard to keep in check is where the deficit leaks.",
      },
      {
        when: all(LEAN_AIM, BIG_APPETITE),
        weight: 2,
        because: "Asked about your appetite, you said {answer:appetite}, and eating until satisfied lands at maintenance or above, never below it.",
      },
      {
        when: all(LEAN_AIM, DIETING, r("weekend_eating", 7, 10)),
        weight: 2,
        because: "You rated how much looser your weekend eating gets at {answer:weekend_eating}: two loose days can erase five careful ones.",
      },
      {
        when: all(WANTS_LESS_FAT, is("eating_phase", "gain")),
        weight: 1,
        because: "A plan built to gain weight can't take fat off, whatever the training does.",
      },
      {
        when: all(WANTS_LESS_FAT, is("eating_phase", "none")),
        weight: 1,
        because: "With no plan, appetite decides, and appetite defends the weight you're already at.",
      },
      {
        when: all(WANTS_LESS_FAT, NOT_DIETING, PAST_YEAR_ONE),
        weight: 1,
        because: "You've trained for {answer:training_age}; past the beginner stage, fat rarely comes off without a deliberate deficit.",
      },
      { when: all(LEAN_AIM, DRINKS), weight: 1, because: "You described your drinking as {answer:alcohol}, and drinks are the calories nobody plans for." },
      {
        when: all(LEAN_AIM, r("protein_meals", 1, 4)),
        weight: 1,
        because: "Few of your meals are built around protein ({answer:protein_meals}), the food that keeps hunger quiet on a diet.",
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
        when: all(r("weekend_eating", 6, 10), DIETING),
        weight: 1,
        because: "You're eating to {answer:eating_phase}: a strict week and a loose weekend average out to maintenance.",
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
      { when: r("protein_meals", 1, 3), weight: 3, because: "You rated how often a meal is built around protein at {answer:protein_meals}." },
      { when: r("protein_meals", 4, 5), weight: 2, because: "Only about half your meals are built around protein ({answer:protein_meals})." },
      {
        when: all(r("protein_meals", 1, 6), UNDER_EATS),
        weight: 1,
        because: "You also end up eating less than planned at {answer:meal_skip}, and the meals that shrink take their protein with them.",
      },
      {
        when: is("eating_phase", "none"),
        weight: 1,
        because: "Asked what you're eating for, you said {answer:eating_phase}, and protein is the first thing to go missing without a plan.",
      },
    ],
  },
  {
    id: "strength_leaking_bodyweight",
    audience: "strength",
    category: "nutrition",
    threshold: 5,
    triggers: [
      { when: DIETING, weight: 3, because: "You're eating to {answer:eating_phase} while asking your lifts to go up." },
      { when: UNDER_EATS, weight: 2, because: "You rated how often you end up eating less than planned at {answer:meal_skip}." },
      { when: all(DIETING, LOW_ENERGY), weight: 1, because: "Dieting, you bring {answer:session_energy} energy to your sessions." },
      {
        when: all(DIETING, r("activity_load", 7, 10)),
        weight: 1,
        because: "You do a lot of cardio, sport or physical work ({answer:activity_load}) on top of the diet.",
      },
    ],
  },

  /* ═════════════ lifestyle ═════════════ */
  {
    id: "cardio_eating_the_budget",
    audience: "both",
    category: "lifestyle",
    threshold: 5,
    triggers: [
      { when: r("activity_load", 8, 10), weight: 3, because: "You rated your cardio, sport and physical work at {answer:activity_load}." },
      { when: r("activity_load", 6, 7), weight: 1, because: "You do a fair amount of cardio, sport or physical work ({answer:activity_load})." },
      {
        when: all(ACTIVE, LOW_ENERGY),
        weight: 2,
        because: "Next to all that activity, you bring {answer:session_energy} energy to lifting sessions.",
      },
      {
        when: all(ACTIVE, UNDER_EATS, NOT_DIETING),
        weight: 1,
        because: "You end up eating less than planned at {answer:meal_skip} without meaning to diet, so the extra work is not being paid for.",
      },
      {
        when: all(ACTIVE, POOR_WAKE, r("full_nights", 6, 10)),
        weight: 1,
        because: "You get full nights ({answer:full_nights}) yet wake up unrested ({answer:wake_rested}), and the extra work is the likeliest reason.",
      },
      { when: all(ACTIVE, HIGH_VOLUME), weight: 1, because: "It sits on top of more lifting than most people do ({answer:volume_feel})." },
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
      { when: all(DRINKS, LOW_ENERGY), weight: 1, because: "You bring {answer:session_energy} energy to sessions, and the night before is a common reason." },
      {
        when: all(DRINKS, r("missed_sessions", 6, 10)),
        weight: 1,
        because: "You miss planned sessions at {answer:missed_sessions}; the day after is the usual casualty.",
      },
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
      { when: r("missed_sessions", 8, 10), weight: 3, because: "You rated how often you miss a planned session at {answer:missed_sessions}." },
      { when: r("missed_sessions", 6, 7), weight: 2, because: "You miss planned sessions fairly often ({answer:missed_sessions})." },
      { when: is("training_pattern", "on_off"), weight: 2, because: "You described your last few months of training as {answer:training_pattern}." },
      {
        when: FREQUENCY_VARIES,
        weight: 1,
        because: "Asked how often things get trained, you said it depends on the week, which is what a patchy routine looks like from inside.",
      },
      {
        when: all(is("load_choice", "plan"), r("missed_sessions", 7, 10)),
        weight: 1,
        because: "Asked how you pick your weights, you said {answer:load_choice}; at the end you rated missed sessions at {answer:missed_sessions}. The plan is real; the attendance isn't.",
      },
      { when: HIGH_STRESS, weight: 1, because: "You rated your stress at {answer:stress}, and sessions are the first thing stress takes." },
    ],
  },
  {
    id: "consistency_gap",
    audience: "both",
    category: "consistency",
    threshold: 5,
    triggers: [
      {
        when: all(STEADY, r("missed_sessions", 6, 10)),
        weight: 4,
        because: "Early on you described your last few months as {answer:training_pattern}; at the end you rated how often you miss a planned session at {answer:missed_sessions}.",
      },
      { when: all(STEADY, r("missed_sessions", 8, 10)), weight: 1, because: "Missing that often is not steady, however it feels from the inside." },
      {
        when: all(STEADY, FREQUENCY_VARIES),
        weight: 1,
        because: "You also said how often things get trained depends on the week, and a steady routine doesn't.",
      },
      {
        when: all(STEADY, HIGH_STRESS),
        weight: 1,
        because: "With stress at {answer:stress}, the sessions that vanish are the ones you don't remember losing.",
      },
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
      { when: all(COMEBACK, r("missed_sessions", 1, 4)), weight: 1, because: "You're showing up now: you rated missed sessions at {answer:missed_sessions}." },
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
      "life_is_the_limiter",
      "training_around_pain",
      "deficit_while_expecting_muscle",
      "no_surplus_no_growth",
      "recomp_window_closed",
      "gaining_too_fast",
      "fat_loss_without_deficit",
      "week_cancels_itself",
      "protein_unknown",
      "strength_leaking_bodyweight",
      "cardio_eating_the_budget",
      "alcohol_tax",
      "missed_dose",
      "consistency_gap",
      "restart_not_stall",
    ],
    triggers: [
      { when: all(is("training_age", "over_6y"), CLEAN), weight: 3, because: "You've trained for {answer:training_age}." },
      { when: all(is("training_age", "3_6y"), CLEAN), weight: 2, because: "You've trained for {answer:training_age}." },
      { when: r("effort_grind", 7, 10), weight: 1, because: "Your sets are genuinely hard: your last rep grinds at {answer:effort_grind}." },
      { when: r("beat_last", 7, 10), weight: 1, because: "You rated how often you try to beat your last session at {answer:beat_last}." },
      {
        when: all(STEADY, r("missed_sessions", 1, 3)),
        weight: 1,
        because: "Your training has been {answer:training_pattern} and you rarely miss a session ({answer:missed_sessions}).",
      },
      { when: r("full_nights", 7, 10), weight: 1, because: "You rated how often you get a full night's sleep at {answer:full_nights}." },
      { when: r("program_switch", 1, 3), weight: 1, because: "You rarely start a new program ({answer:program_switch})." },
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
    text: "You try to beat your last session most of the time, or your program does the pushing for you. Progression pressure is there; the stall is coming from somewhere else.",
  },
  {
    id: "protein_covered",
    audience: "both",
    when: all(r("protein_meals", 8, 10), r("meal_skip", 1, 5)),
    title: "Protein is handled",
    text: "Nearly every meal you eat is built around protein, and you rarely end up eating less than planned. That habit does the job; nobody needs to sell you more of it.",
  },
  {
    id: "sleep_covered",
    audience: "both",
    when: all(r("full_nights", 8, 10), r("wake_rested", 7, 10)),
    title: "Sleep is doing its job",
    text: "You sleep a full night most nights and wake up rested. Whatever is holding you back, it isn't recovery hours.",
  },
  {
    id: "you_show_up",
    audience: "both",
    when: all(r("missed_sessions", 1, 3), STEADY),
    title: "You show up",
    text: "Your training has been steady and you rarely miss a session. Consistency is the hardest part of training and you already have it.",
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
    id: "alcohol_not_a_factor",
    audience: "both",
    when: is("alcohol", "none", "light"),
    title: "Alcohol isn't a factor",
    text: "You drink little or nothing. There is no recovery tax to pay here.",
  },
  {
    id: "life_leaves_room",
    audience: "both",
    when: all(r("stress", 1, 4), r("activity_load", 1, 5)),
    title: "Life leaves room to recover",
    text: "Your stress is low and you're not stacking hard physical work on top of lifting. Life outside the gym isn't what's draining your recovery.",
  },
  {
    id: "not_overreaching",
    audience: "both",
    when: all(r("volume_feel", 4, 6), r("session_energy", 6, 10)),
    title: "You're not doing too much",
    text: "You train about as much as most lifters and arrive at sessions with energy. You are not piling on more work than you can recover from.",
  },
  {
    id: "eating_matches_goal",
    audience: "physique",
    when: all(
      WANTS_MUSCLE,
      is("eating_phase", "gain"),
      is("appetite", "normal"),
      r("weekend_eating", 1, 5),
      r("meal_skip", 1, 5),
      r("protein_meals", 6, 10),
      is("alcohol", "none", "light"),
    ),
    title: "Your eating points the right way",
    text: "You want muscle, you're eating to gain, your meals are built around protein, and no weekend swing undoes it. The food side of growth is set up.",
  },
  {
    id: "deficit_is_real",
    audience: "physique",
    when: all(WANTS_LESS_FAT, DIETING, is("appetite", "small", "normal"), r("weekend_eating", 1, 5)),
    title: "Your deficit is real",
    text: "You want less fat, you're eating for it, your appetite isn't fighting you, and your weekends don't undo the week. The diet itself is set up to work.",
  },
  {
    id: "lagging_gets_priority",
    audience: "physique",
    when: all(SPECIFIC_LAG, is("lagging_priority", "first"), r("feel_target", 6, 10)),
    title: "Your slowest area gets your best",
    text: "You train your slowest area first, while you're fresh, and you can feel the target muscle doing the work. If it's still slow, the reason isn't where it sits in your session or how you execute it.",
  },
  {
    id: "range_holds",
    audience: "physique",
    when: is("range_under_load", "full"),
    title: "Your reps stay honest",
    text: "Your range of motion holds as the weight climbs, so the numbers you add are real strength, not shorter reps.",
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
    when: all(is("eating_phase", "gain", "maintain"), r("meal_skip", 1, 4), r("protein_meals", 6, 10)),
    title: "Your lifts have fuel",
    text: "You're not dieting, you rarely end up eating less than planned, and most meals are built around protein. The food side of strength is covered; the stall is coming from somewhere else.",
  },
];
