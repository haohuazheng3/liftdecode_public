import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "missed_dose",
  audience: "both",
  category: "consistency",
  title: "You've missed too much of the dose",
  verdict:
    "The program on paper and the program that actually happened in the last four weeks are two different programs, and only the second one counts.",
  summary:
    "You already know this one; you told us in the way you'd describe your consistency to a friend, and again when you counted the sessions you skipped, cut short or swapped for a quick something. The plan you're judging isn't the plan you ran: a quarter or more of the dose never arrived. Until that changes, every other variable you adjust is being tested on a program that doesn't exist, and you'll keep concluding that nothing works.",
  mechanism: [
    "Training only works as a dose. A muscle or a lift adapts to a stimulus that arrives often enough, and hard enough, that the body has a reason to keep the adaptation instead of letting it fade. In the studies that compared training frequencies at matched weekly volume, frequency mattered less than whether the volume was actually done, and the research plans were completed. When you miss 4–6 of 16 planned sessions, you're not running a slightly reduced program; you're running roughly 60–75% of it, with the missing sets landing unevenly on whichever muscles or lifts were scheduled on the days life won.",
    "Adaptation also decays. Strength and muscle aren't lost in a week, but the signal that builds them is time-sensitive: the muscle-building response to a session lasts roughly 24–48 hours in trained lifters, and the skill of a heavy lift fades faster than the tissue. A muscle trained on Monday and not again for ten days spends most of that window doing nothing. Studies of reduced training show you can maintain on around a third of the volume if effort stays high. But maintaining is exactly what your log shows. You've been running a maintenance dose and expecting a growth response.",
    "Missed sessions also break progression, the mechanism that actually moves the numbers. Adding a rep, then adding load, only works if the next exposure comes before the last one has worn off. Skip a week's leg day and the next one is a re-test, not a progression: you're finding the weight rather than beating it. Over four weeks with 4–7 misses, most sessions are re-tests, and a re-test looks precisely like a stall in a logbook. The plateau isn't the body refusing to adapt; it's the record of a signal interrupted before it could compound.",
    "The 'quick something' swaps do particular damage because they hide the miss. Twenty-five minutes of whatever was available feels like it preserved the streak, so the week gets logged as done. But the hard sets close to failure, the ones doing most of the work, are the first to go when time is short; what survives is the warm-up and the easy accessories. If you couldn't say how many sessions you missed, that's the same problem one step back: adherence you can't count is adherence you can't fix, and it reads as a mysterious non-response for as long as it stays uncounted.",
    "None of this is a character verdict. If something big is going on outside the gym, the sessions were lost for real reasons, and the plan was written for a calmer month than the one you had. The cost is the same either way, and it compounds: every week the dose falls short, the temptation grows to change the program, the split, the exercises, anything except the one variable that explains most of the picture. Fix the dose first. Everything else can only be evaluated once the program on paper is the one that's happening.",
  ],
  howItShowsUp: [
    "You counted 4 or more sessions in the last four weeks that were skipped, cut to under half an hour, or turned into 'a quick something', or you genuinely couldn't put a number on it.",
    "If a training partner described your consistency, they'd say 'mostly there with rough patches', 'on and off', or 'honestly, showing up is half the battle right now', and you'd agree.",
    "The same body part or lift keeps getting the missed day. Legs, or the deadlift, or whatever sits on Thursday, has been trained far less than the plan says.",
    "Your sessions feel like re-tests: you spend the first two working sets finding the weight you used last time instead of beating it.",
    "Good weeks produce small PRs, then a gap erases them, and the same numbers show up in the log every few weeks like they're new.",
    "Something big has been going on outside the gym in the last two months, and your stall started somewhere in that window.",
  ],
  fix: [
    {
      title: "Shrink the plan until you can hit 90% of it",
      steps: [
        "For the next four weeks, plan 3 sessions a week, or 2 if the last month says 3 is fantasy. Adherence is measured against what's planned, so plan what you'll do.",
        "Cap each session at 45–60 minutes and write down a 'minimum version': 2 exercises, 4–6 hard sets, 25 minutes. If that's all the time you have, you do it and it counts as a full session.",
        "Use full-body or upper/lower sessions so a missed day costs every muscle a little instead of one muscle everything.",
        "Keep weekly hard sets per muscle at 8–12, each set 1–3 reps from failure: the low end of the productive range, and the volume you'll actually complete.",
        "A successful week is: all planned sessions done. Not PRs. Done.",
      ],
    },
    {
      title: "Count attendance like it's a lift",
      steps: [
        "Add one line to the top of each week in your log: planned / completed / minimum-version. Count a cut session as a miss unless it hit the minimum version.",
        "Track a 4-week rolling adherence percentage. Under 80%, the program is not the problem and you don't get to change it. Over 90% for four weeks, you may add a day or a set.",
        "Decide each session's day and time by Sunday evening and put it in the same calendar as the things that keep stealing it.",
        "Pick the day you miss most often and either delete it or move it to the one day you never lose. Don't keep a day on the plan that history says you won't do.",
      ],
    },
    {
      title: "Make the sessions you keep do the work",
      steps: [
        "Start every session with the lift or muscle that's been missed most, while you're fresh, before time can run out.",
        "Take the first working set of the main movement to 1–2 reps from failure and log the reps. That single set is your progression marker; if it goes up week to week, the dose is landing.",
        "Use double progression: same weight until you hit the top of a 6–10 or 8–12 rep range on every set, then add 2.5–5%. After any missed week, repeat the previous weights; the second exposure is where progress returns.",
        "If life is heavy right now, cut accessories first and main lifts last. Two hard sets of the main movement, done, beats a full session that didn't happen.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: cut the plan to 2–3 sessions with a written minimum version, log planned versus completed, and put every session in your calendar on Sunday. Repeat last month's weights; don't chase.",
    "Week 2: hit every planned session, even if two of them are the 25-minute minimum version. Start each one with the most-missed lift or muscle. Record the first-set reps on the main movement.",
    "Week 3: if adherence is 90% or better, add one hard set per muscle or 2.5% to the main lifts. If it isn't, hold the load, drop the day you keep losing, and hit 100% of what's left.",
    "Week 4: same plan; compare first-set reps to week 1. Two clean weeks in a row and the numbers usually move; if they haven't, you now have a real stall to diagnose instead of a dose problem.",
  ],
  timeline:
    "The first two weeks are about the attendance line in your log, not the lifting numbers; expect a session or two of re-tests. By weeks 3–4, once each lift has had consecutive exposures, most people see first-set reps climb and the 'stall' turns out to have been the gap. Measurable change in strength or shape needs 6–12 weeks of 90%+ adherence, so treat the first month as proof the dose is arriving, not the payoff.",
  mistakes: [
    "Changing the program, split or exercise selection, when the plan you were on was never run long enough to be judged.",
    "Planning five days again 'to make up for it', which produces the same misses at a higher rate and a worse self-image.",
    "Counting a 20-minute 'quick something' as a full session, so the log says the week was done and the body says it wasn't.",
    "Doing a punishment session after a gap: extra volume, everything to failure, and then three days too sore to come back.",
    "Waiting for life to calm down before committing, instead of shrinking the plan to what fits the life you actually have this month.",
  ],
  trackNotes: {
    physique:
      "A lagging body part that keeps landing on the missed day will stay lagging no matter what exercise you pick for it. Move the muscle you care about most to the first slot of the session you never miss, keep it at 6–10 hard sets a week, and accept that 8–12 completed sets beat 20 planned ones. The mirror lags adherence by months, so judge this block on the attendance line and first-set reps, not the photo.",
    strength:
      "A heavy lift is a skill as well as a tissue, and skill decays faster than muscle; a squat practised once every ten days is relearned each time, which is why every session feels like a max-finding trip. Put the lift you've been missing first, keep 2–3 working sets at 75–85% every time it appears, and hold the load steady through any missed week. Frequency of exposure moves a stuck top set faster than any change of program.",
  },
  relatedFindings: ["life_is_the_limiter", "week_cancels_itself", "program_hopping"],
};
