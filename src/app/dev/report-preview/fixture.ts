import type { AiReport } from "@/lib/ai/schema";

/** Dev preview only: what a finished analysis looks like for the fixture lifter in page.tsx. */
export const FIXTURE_ANSWERS: Record<string, string | string[]> = {
  goal: "physique",
  sex: "male",
  age: "29",
  height_cm: "178",
  weight_kg: "82",
  body_type: "meso",
  training_age: "1_3y",
  training_pattern: "steady",
  sessions_week: "3",
  chest_sessions: "1",
  chest_time: "u20",
  back_sessions: "2",
  back_time: "40_60",
  arms_sessions: "3",
  arms_time: "40_60",
  legs_sessions: "1",
  legs_time: "u20",
  hard_set_habit: "stop",
  effort_grind: "3",
  set_recovery: "2_3",
  beat_last: "3",
  load_choice: "feel",
  program_switch: "2",
  rom_focus: "8",
  drive: "8",
  pain_limits: "2",
  brain_fog: "never",
  pump: "4",
  sweat_level: "heavy",
  training_signs: ["none"],
  loop_score: "8",
  weight_trend: "unknown",
  protein_g: "unknown",
  carbs_g: "unknown",
  pre_meal: "o4",
  diet_clean: "8",
  meal_skip: "2",
  sleep_hours: "6_7",
  sleep_regular: "shifts",
  full_nights: "5",
  wake_rested: "5",
  alcohol: "light",
  coffee: "1",
  stress: "4",
  cardio_sessions: "0",
  physique_aim: "muscle",
  lagging_area: "chest",
  lagging_priority: "last",
  feel_target: "4",
  appetite: "6",
  weekend_eating: "3",
};

export const FIXTURE_REPORT: AiReport = {
  headline: "Your chest gets a token dose, and your sets stop well before they build anything.",
  summary:
    "You train three times a week and you show up, but the work that grows muscle is missing in three places at once: your chest gets one short slot a week, most of your sets end with plenty left, and nothing pushes the weights up from week to week. Your arms take over half of your lifting time while chest and legs get about 15 minutes each. Fix the dose and the effort first; tracking protein and building a little conditioning come right behind.",
  rootCause: {
    title: "Effort and dose spent in the wrong places",
    explanation:
      "Your week is 4.7 hours of lifting, enough to grow, but 2.5 of those hours go to arms and only about 15 minutes each to chest and legs. On top of that, your sets end with plenty in the tank (your last rep grinds at 3/10), so even the sets you do give a weak signal. Muscle growth tracks the number of hard sets a muscle gets each week [TRAIN-01], and yours are neither hard enough nor aimed at the muscle you most want to grow.",
  },
  chain: [
    { label: "Chest trained last, briefly", detail: "One session a week, under 20 minutes, after everything else: roughly 3-4 sets on a tired body." },
    { label: "Sets stop with reps to spare", detail: "Picking weights by feel and rarely trying to beat last time keeps every set inside what you can already do." },
    { label: "Weak signal, no overload", detail: "Few hard sets plus no progression means the muscle has no reason to adapt." },
    { label: "Arms busy, chest flat", detail: "Your effort goes where it is easiest to spend it, so the slowest area stays slowest." },
    { label: "The stall you feel", detail: "Training feels steady and consistent, yet the mirror and the numbers have not moved." },
  ],
  firstMove: {
    title: "Move chest to the start of two sessions",
    why: "It is your slowest area and it currently gets the least, last. Nothing else on this list moves it as fast.",
    how: "Open two of your three sessions with chest: 4 hard sets of a press, then 3 sets of a fly or dip. End each set 1-2 reps short of failure, and write down the weight and reps so next week can beat them.",
  },
  problems: [
    {
      findingId: "target_muscle_underdosed",
      title: "Your slowest muscle gets the smallest dose",
      severity: "high",
      inYourCase:
        "You named chest as your slowest area, and by your own count it gets one session a week of under 20 minutes. That is roughly 3-4 hard sets a week, at the very bottom of what produces measurable growth. Weekly set volume and growth rise together, with diminishing returns only at much higher doses [TRAIN-01, TRAIN-02], and splitting the same work over two sessions tends to grow more than one [TRAIN-03].",
      cost: "At this dose chest growth is close to a standstill, while arms get more work than they need.",
      fix: [
        "Train chest twice a week, at the start of the session, for 10-12 hard sets a week in total.",
        "Take 2 sets from your arm work for every chest set you add, so sessions stay the same length.",
        "Use one heavy press (6-10 reps) and one lighter movement (10-15 reps) each chest session.",
        "Rest 2-3 minutes between chest sets so each set gets its full reps [TRAIN-10].",
      ],
    },
    {
      findingId: "sets_end_too_early",
      title: "Your sets stop before the stimulus starts",
      severity: "high",
      inYourCase:
        "Most of your sets end with plenty left, and you rate how often your last rep slows to a grind at 3/10. Growth increases as sets end closer to failure [TRAIN-04]; you do not need to hit failure every set, but the last 2-3 reps of a set should be genuinely hard and slow. Right now your sets feel like work without reaching that zone.",
      cost: "A large share of your 4.7 weekly hours produces fatigue without much growth signal.",
      fix: [
        "End every working set 1-3 reps short of failure: the last rep should slow down noticeably.",
        "Once a week per exercise, take the final set to the point where another rep would fail with good form.",
        "If a set of 10 feels easy, add load next time rather than stopping early.",
      ],
    },
    {
      findingId: "no_forcing_function",
      title: "Nothing in your plan forces the weight up",
      severity: "medium",
      inYourCase:
        "You pick weights by feel and rate how often you try to beat last time at 3/10. Without a written target, sessions drift to what feels comfortable that day. A simple rule works: when you can do 1-2 reps more than the target on all sets, add 2-10% load [TRAIN-08].",
      cost: "Without a rule, the same weights repeat for months, and growth needs more than repetition.",
      fix: [
        "Log every working set: exercise, weight, reps.",
        "Pick a rep range per exercise (for example 8-12). When all sets reach the top, add the smallest load jump available.",
        "Before each set, look at last week's number and aim to beat it by one rep or a little load.",
      ],
    },
    {
      findingId: "conditioning_caps_volume",
      title: "Your engine runs out before your muscles do",
      severity: "medium",
      inYourCase:
        "Your breathing takes 2-3 minutes to settle after a hard set of 10, you do no cardio, and your legs get about 15 minutes a week. Between sets, the fuel for the next set is rebuilt by oxygen-using metabolism [CARDIO-02], and in trained men aerobic fitness went with more squat reps when rests were short [CARDIO-05]. With little aerobic base, you either wait long or lose reps.",
      cost: "Fewer quality reps per session, most of all on the leg and compound work you already do least.",
      fix: [
        "Add 2 easy cardio sessions a week of 20-30 minutes on a bike or incline walk, at a pace where you can still talk.",
        "Keep them away from leg sessions by a few hours, or do them after lifting [CARDIO-15].",
        "Add a second leg session with 2-3 sets each of leg press and lunges, building up over 4 weeks.",
      ],
    },
    {
      findingId: "protein_unknown",
      title: "You don't know how much protein you get",
      severity: "medium",
      inYourCase:
        "You answered 'not sure' for protein, carbs and your weight trend, so nothing about your food is checked against a result. At 82 kg, about 1.6 g/kg a day is the point where extra protein stops adding measurable gains for most lifters [PROT-01], which is roughly 130 g a day for you.",
      cost: "If you are short, every hard set you add returns less than it should, and you would not know.",
      fix: [
        "Track protein for 7 days with any app; aim for 130-160 g a day.",
        "Build 4 meals around 30-40 g of protein each [PROT-04].",
        "Weigh yourself 3 mornings a week and average it, so you know which way your weight is moving.",
      ],
    },
  ],
  scorecard: [
    { id: "dose", read: "4.7 hours a week is enough; the split is not. Chest and legs get about 15 minutes each, arms 2.5 hours. Rebalance before you add anything." },
    { id: "effort", read: "Your sets end with plenty left and the last rep rarely grinds. Ending sets 1-3 reps from failure is the single biggest lever here." },
    { id: "progression", read: "Weights by feel and a 3/10 on beating last time. A written log and a rep-range rule move this fast." },
    { id: "execution", read: "Range of motion is a priority and pain is rare, which is good. Feeling chest work at 4/10 is the weak spot, partly because it comes last." },
    { id: "fuel", read: "Untracked protein, carbs and weight, a 4-hour gap before training, and a 4/10 pump. A week of tracking turns guesses into numbers." },
    { id: "minerals", read: "No cramps, twitches or dizziness. You sweat heavily, so salt your pre-training meal and drink to thirst." },
    { id: "sleep", read: "6-7 hours with times that shift and half-rested mornings. A fixed wake time and 30 more minutes in bed would lift this." },
    { id: "conditioning", read: "2-3 minutes to recover from a hard set of 10, no cardio, little leg work. Two easy cardio sessions a week is the lever." },
    { id: "life", read: "Low stress, light drinking, one coffee and strong drive: this is working for you." },
    { id: "consistency", read: "Steady attendance and a loop that runs. Your problem is what happens in the sessions, not getting to them." },
  ],
  doseAudit: {
    verdict:
      "Your week totals about 4.7 hours, which is a reasonable dose for growth. The problem is distribution: more than half goes to arms and shoulders while chest and legs get one short slot each.",
    groups: [
      { group: "chest", read: "1 session × under 20 minutes is roughly 3-4 hard sets a week, at the bottom of the growth range.", change: "Add a second session and build to 10-12 hard sets a week, done first." },
      { group: "back", read: "2 sessions × 40-60 minutes is roughly 20-25 sets a week, a solid dose.", change: "Keep it as it is." },
      { group: "arms", read: "3 sessions × 40-60 minutes is about 2.5 hours, more than any other group, and more than arms need.", change: "Cut to 2 sessions and move the freed time to chest and legs." },
      { group: "legs", read: "1 session × under 20 minutes is a token dose for your largest muscles.", change: "Add a second leg session and build to 8-10 hard sets a week." },
    ],
  },
  fuelAudit: {
    verdict: "Your diet is mostly whole food and you rarely eat less than planned, but protein, carbs and your weight trend are all unknown. You cannot tell if you are fuelling growth.",
    protein: "Untracked. At 82 kg, aim for about 130 g a day, the level where most lifters stop seeing extra gains from more protein [PROT-01, PROT-02].",
    carbs: "Untracked. With a 4-hour gap before training and a 4/10 pump, it is worth checking. For most lifters in a fed state carbs are not the main limiter [CARB-04], so treat this as a second-order check.",
    timing: "You train 4+ hours after your last meal. A meal with carbs and protein about 2 hours before is a cheap experiment that may add reps [CARB-07].",
    minerals: "No warning signs, but you sweat heavily. Salt your pre-training meal and drink to thirst rather than forcing litres of plain water [SWEAT-04].",
    bodyweight: "Not tracked, so the surplus muscle growth needs is a guess. Weigh in 3 mornings a week and aim for a slow climb of about 0.25-0.5% of bodyweight a week [CARB-06].",
  },
  recovery: {
    verdict: "Recovery is adequate but not strong: 6-7 hours, shifting bed times and half-rested mornings.",
    sleep: "Adults are advised to get 7 or more hours [SLEEP-01], and regular timing matters for performance [SLEEP-07]. Fix your wake time within 30 minutes every day, including weekends, and move bedtime 30 minutes earlier.",
    stress: "Stress is low, you drink lightly and have one coffee a day. Nothing here is taking from your recovery.",
  },
  conditioning: {
    verdict: "A 2-3 minute recovery after a hard set of 10, no cardio and minimal leg work point to a weak aerobic base.",
    science:
      "Between sets, the fast fuel for the next set is rebuilt mainly by oxygen-using metabolism, so blood flow and fitness set how much comes back in a normal rest [CARDIO-01, CARDIO-02]. In trained men, higher aerobic fitness went with more squat reps when rests were short [CARDIO-05]. Normal amounts of cardio do not reduce muscle growth [CARDIO-10]; very high amounts of running are where the costs appear [CARDIO-11].",
    prescription: "Two easy sessions a week of 20-30 minutes on a bike or incline walk, at a pace where you can talk, adding 5 minutes a week up to 40. Keep them away from leg days.",
  },
  plan: [
    { focus: "Rebalance the week", actions: ["Train chest first in two sessions: 4 sets of a press and 3 of a fly.", "Cut arms to two sessions.", "Start logging every working set.", "Do two 20-minute easy bike sessions."] },
    { focus: "Make the sets count", actions: ["End every set 1-3 reps from failure.", "Beat last week's number by a rep or a little load on each lift.", "Track protein for 7 days and aim for 130 g.", "Add 2 sets of leg press to your leg session."] },
    { focus: "Add the second leg day", actions: ["Add a second leg session with leg press and lunges.", "Raise cardio to 25-30 minutes.", "Eat a carb-and-protein meal 2 hours before training.", "Fix your wake time within 30 minutes, every day."] },
    { focus: "Check and adjust", actions: ["Compare chest and leg numbers with week 1.", "Retest how long breathing takes to settle after a hard set of 10.", "Check your 3-morning weight average.", "Re-run the diagnosis."] },
  ],
  track: [
    { metric: "Chest hard sets a week", now: "about 3-4", target: "10-12", checkIn: "Count every Sunday" },
    { metric: "Protein a day", now: "not tracked", target: "130-160 g", checkIn: "App, daily for 7 days" },
    { metric: "Breathing settles after 10 reps", now: "2-3 minutes", target: "under 2 minutes", checkIn: "End of week 4" },
    { metric: "Morning bodyweight", now: "not tracked", target: "slow climb, 0.2-0.4 kg a week", checkIn: "3 mornings a week" },
  ],
  keep: [
    "Your steady attendance: three sessions a week, every week.",
    "Full range of motion on every rep.",
    "A clean, mostly whole-food diet.",
    "Light drinking and one coffee a day.",
  ],
  retest:
    "Re-run the diagnosis after week 4. Your effort, progression and dose scores should have moved the most; chest strength should be measurably up.",
  closing:
    "You already do the hard part: you show up, week after week. Point that consistency at the right muscles, take the sets closer to the edge, and write the numbers down. The rest follows.",
};
