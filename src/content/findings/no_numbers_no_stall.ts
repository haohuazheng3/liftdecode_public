import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "no_numbers_no_stall",
  audience: "both",
  category: "measurement",
  title: "You can't be stuck without numbers",
  verdict:
    "You don't have the two data points a stall needs, so right now \"stuck\" is a feeling — and feelings are fixable with a logbook and a scale.",
  summary:
    "Your lifts live in your head, or nowhere, and you couldn't say what your main lift did over the last month or two. So nobody — not you, not us — can tell whether you've stalled, slid backwards, or quietly progressed and never noticed. Until that changes, every fix is a guess, judged by the same feeling that told you you were stuck.",
  mechanism: [
    "A stall is a comparison between two points: what you could do then, and what you can do now. Without \"then\" written down there is no comparison, only an impression — and impressions are built from the last session, not the last two months. A flat week after a poor night's sleep feels like a plateau; a slow climb of one rep every second week feels like nothing. The people who call themselves stuck the loudest are often the ones with the least data, because data would have settled it.",
    "Memory is not a neutral store for numbers. It rounds toward what you did most recently and toward round plates. Ask a lifter who doesn't log what they benched six weeks ago and they'll name last Tuesday's number. That's not a character flaw; it's how recall works. So \"same numbers as always\" may be true, or the number you remember may be the number you keep repeating because you remember it. Either way the load never gets a reason to move, and a load that never moves gives the muscle no new job.",
    "Progressive overload isn't a philosophy, it's a bookkeeping habit. Every progression scheme that works — double progression, weekly percentage steps, RPE-capped top sets — depends on knowing what happened last time so this time can be a little more. When the weight is chosen by feel, by what's already on the bar, or by \"the weight I always use,\" the forcing function disappears. You may still train hard. You just won't train harder than you did, which is the only thing that changes tissue or a max once the beginner phase is over.",
    "The body-weight trend is the other missing half. Muscle arrives at roughly 100–250 g a month for someone past year one — invisible on a scale you step on occasionally, and impossible to judge in a mirror that sees you every day. But a weekly average of morning weigh-ins, tracked for 8 weeks, tells you whether you've been eating for the goal you say you have. Without it you can't separate \"my training is wrong\" from \"my food is wrong,\" and you'll change the wrong one.",
    "The cost of staying here isn't that you're failing; it's that you can't succeed on purpose. Even if the next program works, you'll have no way to know, so you'll abandon it at the first flat week and reach for another. From the inside that loop looks exactly like a stall, and it keeps running until two numbers exist: the log and the trend line.",
  ],
  howItShowsUp: [
    "Asked what you lifted three sessions ago, your honest answer is \"roughly\" or \"no idea.\"",
    "You pick the working weight from how warm-ups feel, or from whatever plates are already loaded.",
    "You've used the same weight on your main lifts for months and can't remember when it last changed.",
    "You couldn't say whether your main lift is up, down, or flat versus 4–8 weeks ago — it just hasn't felt like progress.",
    "You weigh yourself now and then, on different days and times, mostly when you're feeling good or bad about it.",
    "Your evidence that you're stuck is the mirror, a random morning on the scale, or how sessions feel — nothing recorded the same way twice.",
    "Your last clear PR is more than a year ago, or you genuinely can't place it.",
  ],
  fix: [
    {
      title: "Start the log this session — every working set, not just the top set",
      steps: [
        "Before your next session, write down each exercise with a target: sets, rep range, and the weight you honestly think you did last time. That's your baseline — a guess today, a record from tomorrow.",
        "Log every working set as you finish it: weight, reps, and a one-word effort note (easy / hard / grinder). Warm-ups don't count. Back-off sets do — that's where the first extra rep shows up.",
        "Use whatever you'll actually open: a notes app, a spreadsheet, a paper book in your gym bag. The tool doesn't matter; the entry after every set does.",
        "Keep the same 4–6 core lifts in the log for at least 8 weeks. Rotate exercises and the numbers can't be compared — you're back to feelings.",
      ],
    },
    {
      title: "Give the load a rule so it has to move",
      steps: [
        "Pick a rep range for each lift: 3 sets of 6–10 on compounds, 3 sets of 8–12 on isolation work. Start at a weight where set one lands near the top of the range and set three near the bottom.",
        "Rule: when you hit the top of the range on every set, add the smallest increment next time — 2.5 kg (5 lb) on upper-body bar lifts, 5 kg (10 lb) on lower, one dumbbell step. Otherwise keep the weight and chase one more rep.",
        "Take every set to within 1–3 reps of failure. The log keeps this honest: if reps climbed three sessions running, the sets were real. If neither reps nor weight moved, that's a stall we can actually work on.",
        "Never compare against an all-time PR. Compare this week's heaviest set with the logged set from four weeks ago. That's the only comparison that counts.",
      ],
    },
    {
      title: "Weigh in daily, read it weekly",
      steps: [
        "Weigh yourself every morning after the bathroom, before food or water, same scale, same spot. Log it next to the training log.",
        "On Sunday, average the 7 readings. That one number is your body weight for the week. Ignore individual readings; they swing 1–2 kg on water and food alone.",
        "After 4 weekly averages, draw the line. Flat within 0.5 kg while trying to add muscle means you're not eating for it. Down 1 kg or more while trying to add strength explains a lot on its own.",
        "Once a month, take 3 photos (front, side, back) in the same light, time of day and underwear. Don't judge them; file them. They're the tape measure for the you of six months from now.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: build the log. Every working set gets weight, reps and an effort note; every morning gets a weigh-in. Don't change the training yet — you're taking the baseline.",
    "Week 2: apply the rule. Set rep ranges for your core lifts, push every set to 1–3 reps short of failure, and add weight only where the log says you earned it.",
    "Week 3: first real comparison. Line up this week's top sets and weekly average body weight against week 1. Write one word per lift: up, same, or down.",
    "Week 4: decide with data. If most lifts moved, keep going and re-check in 4 weeks. If they didn't and body weight is flat or falling, your next fix is food or effort — and now you'll be able to see it work.",
  ],
  timeline:
    "By week 2 you'll have something you've never had: a real number to beat, which changes the session before anything physical changes. By week 4 you'll know whether you were actually stuck. Expect small rep gains in the first month simply from having a target; expect visible body change to lag the log by 8–12 weeks, because muscle arrives at a few hundred grams a month at best. The honest win isn't fast progress — it's that from now on you'll be able to tell.",
  mistakes: [
    "Switching programs to \"shock the body\" before you've logged the current one for 8 weeks. You'll be comparing nothing to nothing again.",
    "Logging only PRs or top sets. The back-off sets are where the first extra rep shows up; a log without them hides the progress you're looking for.",
    "Testing a one-rep max to \"see where you're at.\" A max is a snapshot under fatigue and nerves; a four-week trend of working sets is the measurement.",
    "Weighing once a week, or only when you feel lean. Single readings are noise; the weekly average of daily weigh-ins is the signal.",
    "Buying an app with 40 fields, then abandoning it in a fortnight. Weight, reps, effort, morning body weight. Four columns, every time.",
    "Treating the first flat week in the log as proof it didn't help. Anyone past year one has flat weeks; a stall is 8+ weeks with nothing moving.",
  ],
  trackNotes: {
    physique:
      "For a physique goal, the log is your early warning system: muscle gained in March isn't visible until June, but the extra rep on a cable row or Romanian deadlift shows up within weeks. Pick one lift for the body part you most want to change and treat its rep progress as the primary score, with the weekly body-weight average as the check that you're eating for the goal. The mirror gets a vote once a month, from the photos, not gym lighting.",
    strength:
      "For a strength goal, the two numbers that matter are the heaviest set in the log four weeks ago and the heaviest set this week — same lift, same reps, working sets, not a tested max. Log RPE or reps-in-reserve on top sets so you can tell an easy 100 kg from a grinder; that difference is progress even when the plates don't change. Your body-weight trend says whether a stalled squat is a food problem: losing 2 kg while chasing 10 kg on the bar rarely works.",
  },
  relatedFindings: ["no_forcing_function", "wrong_progress_signal", "program_hopping"],
};
