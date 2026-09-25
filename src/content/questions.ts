/**
 * LiftDecode question bank — final merge of the three design cuts
 * (science skeleton, coach voice and effort triangulation, diagnostic calibration
 * questions and preview logic).
 *
 * Structure
 *   - 8 sections, shown in the order of SECTIONS.
 *   - QUESTIONS is the display order. The first question is the track selector
 *     ("goal": physique | strength). Every other question is either shared
 *     (audience "both") or track-specific; each track sees 28 questions
 *     (21 shared + 7 of its own).
 *   - Calibration questions (the honest answer is uncomfortable): progress_record,
 *     lift_progress_8wk / lift_calibration_4wk, rir_last_set, last_true_failure,
 *     hard_sets_lagging, sleep_7h_nights, bodyweight_trend_8wk, protein_yesterday,
 *     sessions_missed_4wk.
 *   - consistency_self_image is asked in chapter 1 and sessions_missed_4wk in
 *     chapter 8 on purpose: the identity answer is committed long before the
 *     count, so the gap between them (finding "consistency_gap") is honest.
 *   - Multi questions: stall_evidence (max 3), readiness_signals, lifestyle_load.
 *     For readiness_signals and lifestyle_load the "none" option should be
 *     exclusive in the UI; the rules are written to be robust if it is not.
 *
 * Voice: second person, coach on the gym floor — direct, warm, no hype,
 * no medical claims. Numbers are anchors, not decoration.
 */
import type { Question, Section } from "./types";

export const SECTIONS: Section[] = [
  {
    id: "start",
    title: "Where you're stuck",
    intro:
      "Two kinds of stall, two different sets of causes. Which one you're in, how long you've been at this, and how you'd describe yourself.",
  },
  {
    id: "evidence",
    title: "The logbook test",
    intro: "Numbers, not feelings. Whether the stall is real, and whether anything you keep could have told you.",
  },
  {
    id: "session",
    title: "How hard is hard",
    intro: "What decides the weight, where the set actually ends, and how long you wait before the next one.",
  },
  {
    id: "week",
    title: "Your week on paper",
    intro: "Dose and structure: how many sets, how often, and how many times the plan has changed.",
  },
  {
    id: "technique",
    title: "How the reps look",
    intro: "Range, control, and whether anyone — including you — has actually watched you lift.",
  },
  {
    id: "recovery",
    title: "Recovery reality",
    intro:
      "Sleep, deloads and the signals your body is already sending: the half of training that happens outside the gym.",
  },
  {
    id: "fuel",
    title: "What you actually eat",
    intro: "Not the plan. Yesterday. Body-weight trend, protein, and how food is really managed.",
  },
  {
    id: "count",
    title: "The honest count",
    intro:
      "How many sessions actually happened, who you measure yourself against, and the rate of progress you're waiting for.",
  },
];

export const QUESTIONS: Question[] = [
  // ───────────────────────────── 1. start ─────────────────────────────
  {
    id: "goal",
    audience: "both",
    section: "start",
    type: "single",
    prompt: "What has actually stopped moving?",
    help:
      "Physique stalls and strength stalls have different causes and different fixes. This one answer picks the diagnostic path you'll follow. You can want both; pick the one you'd be angrier about not getting.",
    options: [
      {
        value: "physique",
        label: "My body. I train, but the mirror, the tape and my clothes say nothing is changing.",
        detail: "Photos, clothes, the mirror: same as six months ago.",
      },
      {
        value: "strength",
        label: "My numbers. The weight on the bar on my main lifts has been stuck.",
        detail: "Squat, bench, deadlift, press — or just the working weights you use.",
      },
    ],
  },
  {
    id: "physique_goal",
    audience: "physique",
    section: "start",
    type: "single",
    prompt: "Which of these is closest to what you want your body to do in the next 6 months?",
    help:
      "\"Look better\" hides three different goals with three different energy-balance requirements. We need the one you'd actually accept the cost of.",
    options: [
      { value: "gain_muscle", label: "Add visible muscle overall; I accept some fat coming with it" },
      { value: "recomp", label: "Add muscle and lose fat at the same time, at roughly the same body weight" },
      { value: "lose_fat_keep", label: "Lose fat and keep the muscle I have" },
      { value: "lagging_part", label: "Bring up one or two specific muscle groups" },
      { value: "lean_stay_lean", label: "Stay lean year-round and still grow" },
    ],
  },
  {
    id: "training_age",
    audience: "both",
    section: "start",
    type: "single",
    prompt:
      "How long have you trained with real intent — following a plan and trying to add weight or reps, not just showing up?",
    help:
      "Don't count the on-and-off years or long breaks. The normal rate of progress falls every year you train: what counts as \"stuck\" in year one is normal in year five, so we calibrate everything to this.",
    options: [
      { value: "under_1y", label: "Under a year of structured training" },
      { value: "1_3y", label: "1–3 years" },
      { value: "3_6y", label: "3–6 years" },
      { value: "over_6y", label: "More than 6 years" },
    ],
  },
  {
    id: "consistency_self_image",
    audience: "both",
    section: "start",
    type: "single",
    prompt: "How would a training partner describe your consistency?",
    help: "Say it the way you'd say it to a friend. There's no wrong answer here, only an honest one.",
    options: [
      { value: "never_miss", label: "Never misses. Sessions are non-negotiable." },
      { value: "odd_miss", label: "Reliable — misses the odd one when life gets loud" },
      { value: "rough_patches", label: "Mostly there, with rough patches" },
      { value: "on_off", label: "On and off: good streaks, then gaps" },
      { value: "honest_low", label: "Honestly, showing up is half the battle right now" },
      { value: "just_restarted", label: "Just getting back into it after a break of 3+ months" },
    ],
  },

  // ───────────────────────────── 2. evidence ─────────────────────────────
  {
    id: "stall_duration",
    audience: "both",
    section: "evidence",
    type: "single",
    prompt:
      "How long since your last clear, repeatable improvement — a rep PR, a heavier working set, or a body change you could measure?",
    help:
      "Under four weeks is inside normal noise for anyone past their first year. Past three months, it's a stall and we treat it as one.",
    options: [
      { value: "under_4wk", label: "Less than 4 weeks" },
      { value: "4_8wk", label: "4–8 weeks" },
      { value: "2_4mo", label: "2–4 months" },
      { value: "4_12mo", label: "4–12 months" },
      { value: "over_1y", label: "More than a year, or I can't remember the last one" },
    ],
  },
  {
    id: "stall_evidence",
    audience: "both",
    section: "evidence",
    type: "multi",
    maxSelect: 3,
    prompt: "What is your evidence that you're stuck? Pick what you actually rely on, not what you think you should.",
    help:
      "Roughly half the people who tell us they're stuck are measuring the wrong thing. Where your evidence comes from tells us which half you're in.",
    options: [
      { value: "mirror", label: "The mirror, or how I look under gym lighting" },
      { value: "scale", label: "The number on the scale" },
      { value: "log", label: "My training log: same weights and reps for weeks" },
      { value: "feel", label: "Sessions feel harder or flatter than they used to" },
      { value: "photos_tape", label: "Progress photos or tape measurements taken the same way each time" },
      { value: "others", label: "Someone commented, or I compare with people around me" },
    ],
  },
  {
    id: "progress_record",
    audience: "both",
    section: "evidence",
    type: "single",
    prompt: "Where would we find what you lifted three sessions ago?",
    help:
      "Not \"do you track\". Where is it. If it lives in your head, the next question is going to be hard — and that is part of the diagnosis.",
    options: [
      { value: "every_set_logged", label: "In an app or notebook: every working set, weight and reps, every session" },
      { value: "top_sets_only", label: "I write down top sets or PRs, not the rest" },
      { value: "memory", label: "In my head; I roughly remember" },
      { value: "nowhere", label: "Nowhere; I don't record anything" },
    ],
  },
  {
    id: "lift_progress_8wk",
    audience: "physique",
    section: "evidence",
    type: "single",
    prompt:
      "Pick one lift for the muscle you most want to change. Compared with 8 weeks ago, your working weight — or reps at the same weight — is…",
    help:
      "If your lifts are climbing and the mirror isn't, this is a nutrition or measurement story. If neither moves, it's a training story. This one answer splits your report in two.",
    options: [
      { value: "up_clearly", label: "Up: at least 5% more load, or 2+ more reps at the same weight" },
      { value: "up_barely", label: "Up a rep or two on a good day, nothing steady" },
      { value: "same", label: "Same numbers" },
      { value: "down", label: "Down; I've lost strength" },
      { value: "dont_know", label: "I couldn't say — I don't track it" },
    ],
  },
  {
    id: "lift_calibration_4wk",
    audience: "strength",
    section: "evidence",
    type: "single",
    prompt:
      "Your priority lift: what was the heaviest set you actually did four weeks ago, versus this week? Not your all-time best — the sets in the log.",
    help:
      "A stall is a statement about two data points. Most lifters compare a tired working set today with a rested, tested PR from months ago — that isn't a stall, it's a bad comparison.",
    options: [
      { value: "higher_now", label: "This week's heaviest set was heavier, or for more reps, than four weeks ago" },
      { value: "same", label: "Same weight, same reps, near enough" },
      { value: "lower_now", label: "Lower now" },
      { value: "no_record", label: "I can't say — I don't have both numbers" },
      { value: "comparing_pr", label: "Honestly, I've been comparing against an old PR, not the last month" },
    ],
  },

  // ───────────────────────────── 3. session ─────────────────────────────
  {
    id: "progression_rule",
    audience: "both",
    section: "session",
    type: "single",
    prompt: "When you walk up to a working set, what decides the weight and reps you do?",
    help:
      "Progressive overload only happens if something forces it. \"When I feel strong\" is a rule that fires less often every month you train.",
    options: [
      {
        value: "log_rule",
        label: "I check the log, and a rule says when to add",
        detail: "Hit the top of the rep range, or all sets, then add weight.",
      },
      { value: "percent_plan", label: "A written plan with percentages or RPE that rises week to week" },
      { value: "memory_feel", label: "I remember roughly what I did and decide by how I feel today" },
      { value: "same_always", label: "The same weight I always use for that exercise" },
      { value: "plates", label: "Whatever's on the bar or the next dumbbell up, when I remember to" },
      { value: "max_out_daily", label: "I work up to the heaviest I can manage that day, most sessions" },
    ],
  },
  {
    id: "rir_last_set",
    audience: "both",
    section: "session",
    type: "single",
    prompt:
      "Think of the last working set of your main exercise last week. If you'd been forced to keep going, how many more reps could you have done with form more or less intact?",
    help:
      "The growth and strength stimulus climbs sharply in the last five reps before failure. Most people who believe they train hard are four to six reps out — and they only find out when someone counts.",
    options: [
      { value: "0_1", label: "0–1: the last rep barely moved, or I failed it" },
      { value: "2_3", label: "2–3: the bar slowed, it was hard, but I chose to stop" },
      { value: "4_5", label: "4–5: uncomfortable, but I definitely had more" },
      { value: "6_plus", label: "6 or more: I stopped because the set count was done" },
      { value: "past_failure", label: "Past failure: form breaks, a spotter helps, then I stop" },
      { value: "no_idea", label: "Honestly, I have no idea" },
    ],
  },
  {
    id: "last_true_failure",
    audience: "both",
    section: "session",
    type: "single",
    prompt: "When did you last take a set to genuine failure — the bar stopped, the rep didn't happen?",
    help:
      "You don't need to fail often. You do need to have felt it recently, or your effort scale has nothing to calibrate against.",
    options: [
      { value: "this_week", label: "This week" },
      { value: "this_month", label: "Within the last month" },
      { value: "months_ago", label: "Months ago" },
      { value: "never_intentionally", label: "Never on purpose" },
      { value: "every_set", label: "Basically every set" },
    ],
  },
  {
    id: "rest_between_sets",
    audience: "both",
    section: "session",
    type: "single",
    prompt: "How long do you actually rest between working sets of a compound lift — timed, not felt?",
    help:
      "Under 90 seconds, your next set is limited by breathing and acid, not by the muscle. That quietly removes reps from every set after the first.",
    options: [
      { value: "under_60", label: "Under 60 seconds: I keep moving to keep the heart rate up" },
      { value: "60_90", label: "60–90 seconds" },
      { value: "90_180", label: "1.5–3 minutes" },
      { value: "over_180", label: "3–5+ minutes on heavy sets" },
      { value: "never_timed", label: "I've never timed it" },
    ],
  },
  {
    id: "intensity_mix",
    audience: "strength",
    section: "session",
    type: "single",
    prompt: "Over a typical month, which best describes the loads you use on that lift?",
    help:
      "Strength is skill under load, built by cycling intensities, not by living at one. All-heavy accumulates fatigue faster than fitness; all-moderate never practises the thing you're testing; testing every week measures strength instead of building it.",
    options: [
      { value: "always_heavy", label: "Almost always 85%+ for 1–3 reps; anything lighter feels like a waste" },
      { value: "max_attempts_weekly", label: "I work up to a max or near-max most weeks — I like to see where I am" },
      { value: "always_moderate", label: "Almost always sets of 5–10 at moderate weight; rarely anything under 5 reps" },
      { value: "high_rep_only", label: "Mostly 10+ reps; I train strength like a bodybuilder" },
      { value: "mixed_planned", label: "A planned mix: heavy, moderate and light days or weeks" },
      { value: "feel_based", label: "Whatever I feel like that day; no pattern" },
    ],
  },

  // ───────────────────────────── 4. week ─────────────────────────────
  {
    id: "hard_sets_lagging",
    audience: "physique",
    section: "week",
    type: "single",
    prompt:
      "Take the muscle you most want to change. Count its working sets per week — sets taken within about 3 reps of failure where it's the main mover. Not warm-ups, not sets where it only assists.",
    help:
      "Growth follows a dose–response curve per muscle per week, and the effective floor for a trained lifter is around 10 hard sets. Most stalled lifters are under it for the exact muscle they care about, while over it for the ones they don't.",
    options: [
      { value: "under_6", label: "Under 6" },
      { value: "6_9", label: "6–9" },
      { value: "10_15", label: "10–15" },
      { value: "16_22", label: "16–22" },
      { value: "over_22", label: "More than 22" },
      { value: "no_idea", label: "I couldn't count it" },
    ],
  },
  {
    id: "lagging_frequency",
    audience: "physique",
    section: "week",
    type: "single",
    prompt: "How many separate days per week does that muscle get direct working sets?",
    help:
      "Twelve sets in one session and twelve across three are not the same dose. Past the sixth or seventh set in a session, each extra set does less and costs more.",
    options: [
      { value: "1", label: "1 day" },
      { value: "2", label: "2 days" },
      { value: "3_plus", label: "3 or more days" },
      { value: "irregular", label: "It depends on the week; it gets whatever's left" },
    ],
  },
  {
    id: "lagging_priority",
    audience: "physique",
    section: "week",
    type: "single",
    prompt: "Where does that muscle sit in your week?",
    help:
      "The part you most want to grow usually gets the least fresh energy. That's not a coincidence; it's why it's the weak one.",
    options: [
      { value: "first_fresh", label: "First in its session, when I'm fresh" },
      { value: "own_day", label: "It has its own day, or a dedicated slot more than once a week" },
      { value: "end_of_session", label: "At the end of a session, after the big lifts" },
      { value: "whenever", label: "Wherever it fits, if there's time" },
      { value: "not_directly", label: "I don't train it directly; I assume the compounds cover it" },
    ],
  },
  {
    id: "main_lift_frequency",
    audience: "strength",
    section: "week",
    type: "single",
    prompt:
      "How many days per week do you perform your priority lift — same bar, same pattern, or a close variation like a pause squat for squat?",
    help:
      "Once a week is 52 practice sessions a year on a skill you want to master. Twice is 104. The bench in particular responds to frequency more than to any other variable.",
    options: [
      { value: "1", label: "1 day" },
      { value: "2", label: "2 days" },
      { value: "3", label: "3 days" },
      { value: "4_plus", label: "4 or more" },
      { value: "irregular", label: "It varies; sometimes it gets skipped" },
      { value: "variations_only", label: "Mostly other variations or machines; the actual lift rarely" },
    ],
  },
  {
    id: "main_lift_sets",
    audience: "strength",
    section: "week",
    type: "single",
    prompt:
      "In a normal week, how many working sets do you do on that lift and its close variations at 70% of max or heavier?",
    help:
      "Below roughly 6 hard sets a week on the lift itself, most trained lifters maintain rather than build. We count the lift, not the accessories.",
    options: [
      { value: "under_5", label: "Under 5" },
      { value: "5_9", label: "5–9" },
      { value: "10_15", label: "10–15" },
      { value: "16_plus", label: "16 or more" },
      { value: "no_idea", label: "I couldn't count it" },
    ],
  },
  {
    id: "program_changes_6mo",
    audience: "both",
    section: "week",
    type: "single",
    prompt:
      "In the last 6 months, how many times have you changed your program — a new split, new exercises for a main movement, a new \"method\"?",
    help:
      "Adaptation to a new stimulus takes 6–12 weeks to show up as measurable progress. Change faster than that and you never see whether anything worked. Never change it, and it stops being a demand.",
    options: [
      { value: "0", label: "None: same structure, small tweaks" },
      { value: "1", label: "Once, deliberately" },
      { value: "2_3", label: "2–3 times" },
      { value: "4_plus", label: "4 or more — I'm always tuning it" },
      { value: "no_program", label: "I don't run a program; I pick exercises each session" },
      { value: "same_for_years", label: "None — it's the same routine I've run for years, unchanged" },
    ],
  },

  // ───────────────────────────── 5. technique ─────────────────────────────
  {
    id: "technique_video",
    audience: "both",
    section: "technique",
    type: "single",
    prompt:
      "If you filmed your top set today and put it next to your top set from three months ago, what would you see?",
    help:
      "Load can go up while range quietly goes down. That is the most common fake progress before a hard wall — and how a lift feels is a poor witness.",
    options: [
      { value: "identical", label: "Same setup, same depth or range, same bar path" },
      { value: "rom_shrinks_with_load", label: "The range gets shorter as the weight gets heavier" },
      { value: "setup_varies", label: "Stance, grip or bar position changes week to week" },
      { value: "never_filmed", label: "I've never filmed a set, so I couldn't tell you" },
      { value: "coach_checks", label: "A coach or experienced partner checks it regularly" },
    ],
  },
  {
    id: "rep_execution",
    audience: "physique",
    section: "technique",
    type: "single",
    prompt: "Picture your average set of a row or a curl. Which is closest to what actually happens?",
    help:
      "The stretched half of the range does a disproportionate share of the growing. It's also the half that gets cut first when the weight goes up.",
    options: [
      {
        value: "full_controlled",
        label: "Full range, controlled lowering; I feel the muscle stretched under load at the bottom",
      },
      { value: "partial_top", label: "I stop short of the stretched position to keep the weight moving" },
      { value: "momentum", label: "Some swing or body English creeps in by the last reps" },
      { value: "heavy_fast", label: "I go heavy and let the movement look after itself" },
      { value: "not_sure", label: "I've never looked at it that way" },
    ],
  },
  {
    id: "sticking_point",
    audience: "strength",
    section: "technique",
    type: "single",
    prompt: "When a rep fails or slows badly, where does it happen?",
    help: "Where the bar stops tells us which position is undertrained. A lift that never fails tells us something too.",
    options: [
      { value: "off_floor_bottom", label: "The bottom: off the floor, out of the hole, off the chest" },
      { value: "midrange", label: "Mid-range: it stalls halfway up" },
      { value: "lockout", label: "Lockout, at the top" },
      {
        value: "form_breaks",
        label: "It doesn't fail cleanly — form collapses",
        detail: "Hips shoot, back rounds, elbows flare.",
      },
      { value: "never_fails", label: "It never fails; I stop before it becomes a grind" },
    ],
  },
  {
    id: "weak_point_work",
    audience: "strength",
    section: "technique",
    type: "single",
    prompt: "Is anything in your week aimed specifically at the position where it fails?",
    help:
      "A lift stalls at a position. Training the whole lift harder doesn't fix the position; work aimed at it does.",
    options: [
      { value: "yes_specific", label: "Yes: pauses, pins, deficits, tempo work or a variation chosen for that spot" },
      { value: "no_just_the_lift", label: "No — I just train the lift and expect it to come" },
      { value: "dont_know_how", label: "No — I wouldn't know what to do for it" },
      { value: "nothing_to_aim_at", label: "Nothing to aim at: it doesn't fail, I just don't add weight" },
    ],
  },

  // ───────────────────────────── 6. recovery ─────────────────────────────
  {
    id: "sleep_7h_nights",
    audience: "both",
    section: "recovery",
    type: "single",
    prompt: "Out of the last 7 nights, how many did you get at least 7 hours of actual sleep — asleep, not in bed?",
    help:
      "Not what you usually get. Last week. Below about seven hours, strength expression drops and the muscle-building response to training is measurably blunted. It's the cheapest variable on this list and the most often lied about.",
    options: [
      { value: "0_1", label: "0–1 nights" },
      { value: "2_3", label: "2–3 nights" },
      { value: "4_5", label: "4–5 nights" },
      { value: "6_7", label: "6–7 nights" },
    ],
  },
  {
    id: "deload_practice",
    audience: "both",
    section: "recovery",
    type: "single",
    prompt: "When did you last deliberately take a week easier — less weight or fewer sets — while still training?",
    help: "Fatigue masks fitness. If you've never cleared it, you've never seen what your training has actually built.",
    options: [
      { value: "planned_regular", label: "Planned: every 4–8 weeks" },
      { value: "when_beat_up", label: "Only when I feel wrecked or my joints complain" },
      { value: "forced_by_life", label: "Only when travel, illness or life forces it" },
      { value: "never", label: "Never on purpose; I push every week" },
      { value: "constantly_easy", label: "Honestly, most weeks are already easy" },
    ],
  },
  {
    id: "readiness_signals",
    audience: "both",
    section: "recovery",
    type: "multi",
    prompt: "Which of these describe the last month? Pick all that apply.",
    help:
      "These are the signals a coach reads before they even look at your program. We're not diagnosing anything — we're asking whether your body is already telling you something.",
    options: [
      { value: "warmups_heavy", label: "Warm-up weights feel heavy" },
      { value: "constant_soreness", label: "Soreness never fully clears" },
      { value: "joints_ache", label: "Joints ache during warm-ups" },
      { value: "dread_sessions", label: "I dread sessions I used to look forward to" },
      { value: "sleep_broken", label: "Sleep is broken or unrefreshing" },
      {
        value: "pain_limits_lift",
        label: "A nagging pain changes how I lift",
        detail: "It limits the load or range on a lift, or I've swapped exercises around it.",
      },
      { value: "none", label: "None of these" },
    ],
  },

  // ───────────────────────────── 7. fuel ─────────────────────────────
  {
    id: "bodyweight_trend_8wk",
    audience: "both",
    section: "fuel",
    type: "single",
    prompt: "Over the last 8 weeks, what has your morning body weight done — as a weekly average, not single readings?",
    help:
      "The body-weight trend is the only nutrition metric we trust. It integrates everything you ate and did, and it can't be wrong — only misread.",
    options: [
      { value: "down_over_2kg", label: "Down more than 2 kg (about 4–5 lb)" },
      { value: "down_slightly", label: "Down 0.5–2 kg" },
      { value: "flat", label: "Flat, within about 0.5 kg" },
      { value: "up_slightly", label: "Up 0.5–2 kg" },
      { value: "up_over_2kg", label: "Up more than 2 kg" },
      { value: "dont_weigh", label: "I don't weigh myself regularly" },
    ],
  },
  {
    id: "protein_yesterday",
    audience: "both",
    section: "fuel",
    type: "single",
    prompt: "Without looking anything up: how many grams of protein did you eat yesterday?",
    help:
      "Not what you aim for. Yesterday. We don't need the number — we need to know whether you have it. People who can state it are almost always within range; people who \"eat plenty\" usually aren't.",
    options: [
      {
        value: "know_high",
        label: "I know within about 20 g, and it was at least 1.6 g per kg of body weight",
        detail: "e.g. 130 g or more at 80 kg",
      },
      { value: "know_low", label: "I know within about 20 g, and it was under 1.6 g per kg" },
      { value: "guess", label: "I'd guess \"a fair amount\", but I couldn't put a number on it" },
      { value: "no_idea", label: "No idea" },
      { value: "day_varies", label: "Some days plenty, some days a coffee and a sandwich" },
    ],
  },
  {
    id: "eating_setup",
    audience: "both",
    section: "fuel",
    type: "single",
    prompt: "What is your food actually set up to do right now?",
    help: "We'll hold this against your 8-week weight trend. When the two disagree, the trend is right.",
    options: [
      {
        value: "surplus_planned",
        label: "A small planned surplus",
        detail: "I expect to gain about 1–2 kg over the next 2 months.",
      },
      { value: "deficit_planned", label: "A planned deficit — I expect to lose weight" },
      { value: "maintenance_planned", label: "Deliberate maintenance" },
      {
        value: "recomp_hope",
        label: "Eat clean and hope to lean out and grow at the same time",
        detail: "Most people who pick this have been at it for over a year.",
      },
      { value: "cycling", label: "I swing between dieting and not, every few weeks" },
      { value: "no_plan", label: "No plan: I eat clean-ish, to appetite, and let it sort itself out" },
    ],
  },
  {
    id: "lifestyle_load",
    audience: "both",
    section: "fuel",
    type: "multi",
    prompt: "Which of these have been true over the last two months? Pick all that apply.",
    help:
      "Each one alone is fine. Stacked, they explain more stalls than any programming variable — they all spend from the same recovery budget your training does.",
    options: [
      {
        value: "high_stress",
        label: "Sustained high stress: deadlines, kids, study — sleep or meals slip most weeks",
      },
      { value: "crisis", label: "Something big: a new baby, illness in the family, a move, a breakup" },
      { value: "physical_job", label: "A physically demanding job, or 10+ hours a day on my feet" },
      { value: "cardio_3h_plus", label: "3+ hours a week of running, cycling, swimming or sport" },
      { value: "drinks_8_plus", label: "8+ alcoholic drinks in a typical week, or 5+ in one sitting most weekends" },
      { value: "weekend_food_blowout", label: "Food is controlled on weekdays and loose at weekends" },
      { value: "none", label: "None of these" },
    ],
  },

  // ───────────────────────────── 8. count ─────────────────────────────
  {
    id: "sessions_missed_4wk",
    audience: "both",
    section: "count",
    type: "single",
    prompt:
      "Count honestly. In the last 4 weeks, how many planned sessions did you skip, cut to under 30 minutes, or swap for \"a quick something\"?",
    help:
      "Count them; don't estimate. Four missed out of sixteen is a 25% cut in the dose, and no program survives that. Nobody will see this answer but you.",
    options: [
      { value: "0_1", label: "0–1" },
      { value: "2_3", label: "2–3" },
      { value: "4_6", label: "4–6" },
      { value: "7_plus", label: "7 or more" },
      { value: "dont_track", label: "I genuinely couldn't tell you" },
    ],
  },
  {
    id: "compare_to",
    audience: "both",
    section: "count",
    type: "single",
    prompt: "When you judge your own progress, who or what are you comparing against?",
    help:
      "The yardstick decides whether a real 2% gain feels like progress or failure. Most \"stalls\" past year three are a yardstick problem stacked on a small real one.",
    options: [
      { value: "past_self", label: "Myself 3–6 months ago, with numbers or photos" },
      { value: "lifters_online", label: "Physiques or lifts I see online" },
      { value: "gym_peers", label: "People at my gym who started around when I did" },
      { value: "first_year", label: "How fast I progressed in my first year" },
      { value: "stated_goal", label: "A specific target I wrote down, with a date" },
    ],
  },
  {
    id: "expected_body_change",
    audience: "physique",
    section: "count",
    type: "single",
    prompt: "Given how long you've trained, how much visible change would satisfy you in the next 12 weeks?",
    help:
      "Past year three, 12 weeks of perfect training and eating builds about 0.5–1 kg of muscle. That's visible in side-by-side photos and invisible to the people who see you every day.",
    options: [
      { value: "noticeable_others", label: "Enough that people who see me weekly comment on it" },
      { value: "photo_visible", label: "Clearly visible in side-by-side photos, even if nobody comments" },
      { value: "tape_only", label: "A centimetre or two on the tape and a few kilos on the bar" },
      { value: "transformation", label: "A real transformation — I've seen the 12-week photos online" },
      { value: "not_sure", label: "I've never put a number on it" },
    ],
  },
  {
    id: "expected_strength_rate",
    audience: "strength",
    section: "count",
    type: "single",
    prompt: "What rate of progress on your main lift would make you feel \"unstuck\"?",
    help:
      "After year three, 5–10% a year on a main lift is a good year. A PR every block, not every week, is what progress looks like now.",
    options: [
      { value: "weekly_pr", label: "Adding weight most weeks, like when I started" },
      { value: "monthly_small", label: "2.5–5 kg, or a rep or two, every month" },
      { value: "block_pr", label: "A new PR at the end of each 8–12 week block" },
      { value: "yearly", label: "5–10% over a year would be fine" },
      { value: "not_sure", label: "I've never put a number on it" },
    ],
  },
];
