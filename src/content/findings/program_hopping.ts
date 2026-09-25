import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "program_hopping",
  audience: "both",
  category: "programming",
  title: "You change the plan before it can work",
  verdict:
    "You've changed your program more often than adaptation can show up, so you've never actually found out whether any of them worked.",
  summary:
    "Every plan you've run in the last six months was dropped between week two and week six, just before it would have produced a measurable result. You have a lot of experience starting programs and almost none finishing them, so nothing in your log can say which one would have worked. Until that changes, every new method gets the same verdict: not sure, moved on.",
  mechanism: [
    "Adaptation lags the work that causes it. A new stimulus produces soreness and novelty immediately, then two to four weeks of learning the movement and absorbing fatigue, and only after that does training show up as load you can lift or tissue you can measure. In the studies that track trained lifters week by week, detectable strength and size changes mostly arrive in the six-to-twelve-week window, not the second week. Change the plan at week three and you've paid the fatigue cost of the block and left before collecting the return.",
    "The early weeks also lie. New exercises feel productive because the numbers climb fast, but that is mostly motor learning: your nervous system gets efficient at a movement it hasn't practised, not stronger or bigger. Then the easy gains slow, sessions start to feel like work, and that is the moment most program-hoppers read as \"this stopped working\". In reality the block was entering the phase where the stimulus finally bites. Switching there resets you to the novelty phase, which feels great and builds nothing.",
    "The second cost is that you lose the ability to read your own data. Progress in a trained lifter is small and noisy, a few percent a month at best on a big lift, on top of daily swings of five to ten percent. To see a trend that size you need the same lifts, rep targets and conditions for long enough that the noise averages out. Change the exercises every few weeks and every comparison is apples to oranges: you can be progressing and not know it, or stalled and unable to prove it.",
    "No program at all is the same problem with the label removed. Picking exercises each session makes every workout week one of a new plan: no rep target to beat, no weight from last time to add to, no scheduled sequence of harder weeks. Progressive overload is a rule that fires when a condition is met, and a rule needs a repeated structure to fire inside. The lifters who keep improving past year two rarely have the cleverest program; they ran an ordinary one long enough for the boring parts to compound.",
    "The pattern usually has a fuel source. If your reference point is lifters online, you see a new method every day with a before-and-after attached, and the current plan will always look slower than the one you haven't tried. If your load follows whatever's on the bar or how you feel that day, the same instinct that improvises the set improvises the plan. The programs weren't bad. None of them got a fair trial, and the fix is a fair trial, not a better program.",
  ],
  howItShowsUp: [
    "Four or more new splits, methods or main-lift substitutions in six months, and you can name the reason for each switch but not the result of any of them.",
    "You don't run a set program; you walk in, see what's free, and build the session from what you feel like doing.",
    "Your last three plans all felt great for two or three weeks, got hard, and then a video made the next one look better.",
    "On the strength track, loads follow the day rather than a plan: heavy when you feel good, comfortable when you don't.",
    "You judge your progress against physiques or lifts you see online, so the current plan is always losing to a highlight reel.",
    "The weight on the bar is decided by what's already loaded or the next dumbbell up, not by a rule tied to what you did last time.",
  ],
  fix: [
    {
      title: "Commit one block to a fixed twelve-week structure",
      steps: [
        "Choose a plan you already own and have started before, not a new one. Write the exercises, sets, rep ranges and days on one page, with the date twelve weeks from today at the top.",
        "Fix the main movements for the whole block: one squat pattern, one hinge, one push, one pull, plus two to four accessories per session. Nothing changes before week twelve.",
        "Start volume conservatively: roughly 10–16 hard sets per muscle per week for physique, 6–12 hard sets per main lift per week for strength.",
        "Mute the programming content that usually triggers a switch, and don't read about other methods until the week-twelve review.",
        "No program at all? This step is the whole fix: three or four fixed sessions, same order every week, for twelve weeks.",
      ],
    },
    {
      title: "Give the block a progression rule so it can produce a verdict",
      steps: [
        "Write one rule per main exercise before week one. Physique: 6–10 reps; when every set hits 10 with 1–2 reps in reserve, add 2.5 kg upper or 5 kg lower. Strength: 3 sets of 5 at a fixed weight; when all three hit 5, add 2.5 kg.",
        "Log every working set: weight, reps, reps in reserve. Loads come from the log and the rule, never from what's on the bar or how the warm-ups felt.",
        "Strength track: schedule intensity in advance, for example a heavy day at 80–87% for 3–5 reps, a moderate day at 70–78% for 5–8, and a light technique day at 60–70%, written out for all twelve weeks.",
        "Build one planned lighter week at week 6 or 7: same exercises and loads, sets cut by about half. That replaces the urge to change the plan when things feel heavy.",
        "Decide the failure condition now, not by mood later: the block fails only if the benchmark lift is lower at week twelve than at week two under the same conditions.",
      ],
    },
    {
      title: "Set up the measurement that will tell you whether it worked",
      steps: [
        "Pick one benchmark per goal and test it in weeks 2, 7 and 12 only. Strength: a top set of 3–5 at a fixed RPE. Physique: a top set on your priority muscle, tape at the same site and time of day, and front and side photos in the same light.",
        "Compare only benchmark to benchmark, same conditions, at least five weeks apart. Anything you notice between tests is noise or fatigue.",
        "When the urge to switch arrives, usually weeks 3–5 and again around week 9, write what you'd change and why on a separate page. That is the review list for week twelve, not this week's to-do list.",
        "At week twelve, hold a real review: did the benchmark, the tape and the logged loads move. Change at most one or two things and run another twelve weeks.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: write the twelve-week block on one page, exercises, rep ranges, progression rule and lighter week, and run it exactly as written at around 2–3 reps in reserve.",
    "Week 2: take your benchmark measurements: test sets, tape and photos. Apply the progression rule for the first time on any lift that hits its target; log every set.",
    "Week 3: the block starts to feel like work and something online will look better. Write the temptation on the review page, add weight wherever the rule says to, change nothing.",
    "Week 4: run it unchanged. Most lifts should have added load once or twice by now; if none have, drop starting weights by 5% and keep going rather than swapping exercises.",
  ],
  timeline:
    "Weeks four to six will feel like the point where you usually leave; that dip is the block starting to work, not stopping. Loads should be climbing under the rule by then, and the week-seven benchmark gives your first honest comparison. Past your first year, expect roughly 2–5% on a strength benchmark by week twelve, or for physique a small but visible change in photos and a centimetre or so on the priority site over the full block, not by week four.",
  mistakes: [
    "Buying a new program as the fix, when the problem was never the program. A worse plan run for twelve weeks beats a better one run for three.",
    "Keeping the split but swapping exercises every few weeks for variety. That resets the measurement as thoroughly as changing the whole plan.",
    "Treating a heavy-feeling week as proof the block has stopped working. Fatigue arrives before adaptation; a planned lighter week is the answer, not a new plan.",
    "Running the block but choosing loads by feel or by what's on the bar. Without a written rule the structure is a costume, not a program.",
    "Finishing the twelve weeks and starting something completely different without reviewing the numbers. Skip the review and you've just done a longer hop.",
  ],
  trackNotes: {
    physique:
      "Your benchmark moves slower than a strength lifter's, which makes the itch worse: in twelve weeks a trained lifter builds a few hundred grams to a kilo of muscle, invisible in the mirror week to week and only visible in photos taken eight or more weeks apart. Judge the block on the log and the tape, and keep the movements for your priority muscle absolutely fixed.",
    strength:
      "If your intensity has had no pattern, fixed percentages will feel restrictive at first, especially on days you feel strong and the plan says 75%. Do the plan. Strength is built by repeating prescribed loads and expressed only occasionally, so weeks seven and twelve are the only days allowed to answer \"how strong am I?\". Everything between them is practice.",
  },
  relatedFindings: ["no_forcing_function", "borrowed_yardstick", "testing_instead_of_training"],
};
