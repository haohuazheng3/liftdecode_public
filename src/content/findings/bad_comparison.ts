import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "bad_comparison",
  audience: "both",
  category: "measurement",
  title: "You're comparing the wrong two numbers",
  verdict:
    "The number you're calling a stall is today's tired working set against a rested PR, or this week against last week. That isn't a stall. It's a bad comparison.",
  summary:
    "You've decided you're stuck, but the two data points you're using to prove it were taken under different conditions, or barely weeks apart: one is a rested, tested best, the other a working set on an ordinary Tuesday. That comparison reads as a stall even in a month where you got stronger. Left alone, it pushes you into changing a program that was working, and you never find out.",
  mechanism: [
    "A stall is a statement about two measurements, and a measurement is only as good as the conditions it was taken under. A PR is your best output on your best day: rested, psyched, often at the end of a peaking block or a deload. A working set is your output on a normal day, carrying the fatigue of the last three sessions and last night's sleep. Comparing the two is comparing your ceiling with your floor. The gap is not a stall; it is the normal spread every lifter has at every level.",
    "Session-to-session strength wobbles more than most people expect. In the studies and coaching logs that track the same lifters over weeks, daily readiness swings the output of a given set by roughly 5–10% in either direction, pulled by sleep, stress, time of day and what you did two days ago. If your 5-rep set is 100 kg on average, 92 kg and 108 kg are both ordinary days. Pick any two of those days in isolation and you can prove progress, regress or a stall, whichever you expected to see.",
    "The window matters as much as the reference point. Past the first year, strength gains on a big lift arrive at roughly 1–3% a month, and past year three often slower, in steps rather than a smooth line: several flat weeks, then a jump. Under four weeks, real progress is smaller than the daily noise, so it cannot be seen even when it is there. Your training age and your stall duration together say you are looking for a signal smaller than your measurement error.",
    "Feel makes it worse. Sessions that feel harder and warm-ups that feel heavy are readouts of your recovery state, not your strength. Fatigue masks fitness: last week's work sits on top of the adaptation it produced, and until that fatigue clears the adaptation is invisible. A lifter four hard weeks into a good block usually feels worse than one who has been coasting, while being measurably stronger once rested. Feel is real data, but it answers a different question.",
    "The cost of a false stall is that you fix something that isn't broken. Program changes, exercise swaps and diet tweaks all cost time and reset the clock on adaptation. Do that every time a working set undershoots a memory of your best, and you spend the year in the first two weeks of new programs, never long enough on one to see the step that was coming. The answer here is not more effort. It is a fair test.",
  ],
  howItShowsUp: [
    "When you say \"I've been stuck at 140\", the 140 was a single, tested, all-time best, not a number that shows up in your log every week.",
    "Your last clear improvement was less than four weeks ago, but this week's working sets felt like a step backward, so you've written the block off.",
    "You've been training seriously for a year or more and still expect every week to beat the last one the way it did in your first six months.",
    "A big part of your evidence is that sessions feel harder or flatter, and you can't point to two logged sets, taken the same way, that show a drop.",
    "Warm-up weights feel heavy, so you walk into the working sets already convinced today is a bad day, and the set confirms it.",
    "Your lifts get quietly compared to a peak from a different program, body weight or phase: the deload week, the meet, the summer you slept nine hours.",
  ],
  fix: [
    {
      title: "Set up a fair comparison this week",
      steps: [
        "Pick one priority lift and one benchmark set you can repeat: same exercise, rep target, position in the session, rest and warm-up. Write the exact set down. Example: first exercise of the day, 5 reps, after a 3-minute rest.",
        "Log every working set on that lift, weight and reps, in one place, starting today. Not top sets only, and not from memory. The last four weeks of \"same\" that you're reporting is probably two or three actual data points.",
        "Retire the PR as a reference. Write it at the top of the page, then draw a line under it. From now on the only comparison is this benchmark set against the same benchmark set two to four weeks earlier.",
        "Add a one-line readiness note before each session: sleep hours, stress 1–5, soreness 1–5. Don't adjust anything yet; this is the context you'll read the numbers against.",
      ],
    },
    {
      title: "Use a window that can actually show progress",
      steps: [
        "Under three years of training: compare the benchmark set against the same set four weeks ago. Three to six years: use six to eight weeks. Over six years: eight to twelve weeks. A shorter window than that is comparing noise with noise.",
        "Judge the window on best-of, not last-of: the best benchmark set in the first half of the window against the best in the second half. This filters out the bad day without hiding a real decline.",
        "Define progress before you look: at least 2.5% more load, or one to two more reps at the same load, on the benchmark set. Anything smaller than that is inside your daily spread and does not count either way.",
        "Only call a stall when two full windows in a row show no change on the benchmark set, with readiness notes that do not explain it. That is the earliest point at which the word means something.",
      ],
    },
    {
      title: "Separate feel from strength",
      steps: [
        "On a day when warm-ups feel heavy, run the benchmark set as planned anyway and log the number and the feeling separately. After four weeks, count how often a heavy warm-up actually produced a lower set. For most lifters it is less than half the time.",
        "If the readiness notes show three or more bad-sleep nights in a week, expect the benchmark set to be down 3–8% that week and do not count it against the window.",
        "If after four weeks sessions still feel flat and the benchmark set is lower on rested days too, take a planned deload (half your working sets at 80–85% of normal load for one week) and retest in week 6. A drop that survives a deload is a real stall.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: choose the priority lift and define the benchmark set exactly. Log every working set plus a one-line readiness note. Do not change the program.",
    "Week 2: keep logging. Run the benchmark set once this week under the standard conditions, note the number and how it felt, and leave the PR out of the conversation entirely.",
    "Week 3: run the benchmark set again under the same conditions. Compare best-of weeks 1–2 with week 3 only against your defined threshold (2.5% load or 1–2 reps). Check the readiness notes before drawing any conclusion.",
    "Week 4: close the first window. If the benchmark moved, you were never stalled; keep the program and keep the same measurement. If it didn't, and readiness doesn't explain it, start a second window before changing anything.",
  ],
  timeline:
    "The first thing that changes is your reading of the last month, and that changes this week: with the PR out of the comparison, most people find they were already progressing. The numbers need a full window to be trusted, so allow four weeks before any conclusion, six to eight if you are past year three. A real decline across two windows with clean readiness notes is your first honest stall signal, and by then you will have the log to diagnose it.",
  mistakes: [
    "Testing a new one-rep max to \"see where you're at\": a max-out day is more fatigue and one more rested-versus-tired comparison, not a measurement.",
    "Switching programs after two bad sessions, then judging the new program by its first two good ones, which were mostly the deload you didn't plan.",
    "Comparing against a PR set at a heavier body weight, on a different bar or in a different phase, and treating the difference as lost strength.",
    "Skipping the working sets on heavy-feeling days so the log only contains good days, which hides both real progress and real decline.",
    "Adding volume or intensity to \"break through\" a stall that was never established, and manufacturing a real one through accumulated fatigue.",
  ],
  trackNotes: {
    physique:
      "Put the benchmark set on a lift for the muscle you most want to change: a rising working weight there is the earliest signal of growth, usually months ahead of the mirror. Judge it over eight weeks, not four. At least 5% more load or two more reps at the same weight is a real change; one extra rep on a good day is not. Pair it with same-conditions photos and tape at the eight-week checkpoint, never gym-mirror impressions on a heavy day.",
    strength:
      "Comparing against an old PR is the whole finding. The PR is a ceiling reading, the working set is a floor reading, and you have been calling the distance between them a stall. Rebuild the comparison on a repeatable benchmark set over four to eight weeks, and plan a true test day only at the end of a block, after a taper, so the next PR attempt is a fair one. A missed PR mid-block on a tired week is not data.",
  },
  relatedFindings: ["hidden_progress", "no_numbers_no_stall", "testing_instead_of_training"],
};
