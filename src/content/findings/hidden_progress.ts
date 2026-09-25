import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "hidden_progress",
  audience: "both",
  category: "measurement",
  title: "You are progressing; you just can't see it",
  verdict:
    "Your own numbers say you improved in the last 4–8 weeks, so this is a visibility problem before it is a training problem.",
  summary:
    "You told us your lifts went up recently, and in the same breath you told us you're stuck. Both can't be true, and the one backed by a number wins. The real cost isn't the weeks you've spent feeling flat; it's that a lifter who can't see progress eventually changes a program that was working, and that is how a real stall begins.",
  mechanism: [
    "Start with the fact you gave us: your priority lift or your target-muscle lift moved in the last one to two months. For anyone past their first year, that is not noise. Adding 5% load or two reps at the same weight on a compound lift is roughly what a well-run intermediate program produces in that window. A coach reading your log would call the last block a success. The only thing that failed was the instrument you use to judge it, and you are looking at a slow, lagging, noisy gauge and ignoring the fast, leading, precise one.",
    "Muscle arrives slowly and quietly. A realistic rate for someone past the beginner phase is in the region of a few hundred grams a month at best, often less. The scale cannot see that: daily weight swings by one to two kilograms with water, salt, carbohydrate and bowel contents, so a month of genuine growth sits entirely inside a single day's noise. Mirrors are worse, because you look every day and the brain adapts to whatever it sees most. Photos under different light, at different times of day, disagree with each other by more than a month of growth would move them.",
    "Strength, by contrast, is a leading indicator. Load on the bar responds within weeks to both neural improvement and the first millimetres of new tissue, and it is recorded in units that do not drift. That is why coaches anchor progress on the log first and the tape second. When the training-study literature looks at people who gained measurable muscle over eight to twelve weeks, their working loads and reps climbed alongside it; the reverse, a lifter getting steadily stronger on a well-chosen lift with no tissue change over months, is rare unless bodyweight is falling hard.",
    "There is also a timing trap in how you defined the stall. You said it has lasted under eight weeks. That is one training block. Every measure you named needs longer than that to separate signal from noise, and rep progress itself is lumpy: two flat weeks followed by a jump is the normal shape, not a straight line. Calling a plateau at four to eight weeks means you are reading the flat part of a staircase and concluding the stairs have ended.",
    "The reason this matters beyond your mood is what it makes you do next. Lifters who believe they are stalled reach for change: a new program, more volume, a harder cut, a different split. Each of those resets the very adaptations that were quietly accumulating. The most common way an intermediate turns hidden progress into a real stall is by treating it as one.",
  ],
  howItShowsUp: [
    "Your heaviest set this week, or your working weight or reps on the target lift, is up compared with four to eight weeks ago, and you still opened this diagnostic because you feel stuck.",
    "Your evidence for the stall is the mirror, gym lighting, or the number on the scale, not a measurement you took the same way twice.",
    "The stall is less than eight weeks old, which is roughly one training block.",
    "You can remember the last rep PR when asked directly, but it did not register as progress at the time.",
    "You check the scale most mornings and your mood about training tracks that number more than it tracks the log.",
    "You have been browsing new programs or considering a cut, not because anything in your training broke, but because nothing feels different.",
    "Compliments or comparisons from other people move your confidence more than your own data does.",
  ],
  fix: [
    {
      title: "Move the yardstick to the thing that actually moved",
      steps: [
        "Pick two or three indicator lifts and write down today's best working set for each: weight, reps, and how many reps you had left. This is your new baseline, dated.",
        "For the next 8 weeks, progress is defined as any of these: +2.5 kg on a lower-body lift, +1.25–2.5 kg on an upper-body lift, or +1 rep at the same weight on the first working set. Anything else does not count as evidence either way.",
        "Log every working set, not just PRs. Rep progress at the same weight is where most intermediate progress hides, and top-set-only logs miss it.",
        "Compare this week against four weeks ago, never against your all-time best. A stall is a statement about two recent data points.",
      ],
    },
    {
      title: "Put the slow measures on a schedule that can actually detect change",
      steps: [
        "Weigh yourself daily if you like, but only read the 7-day average, and only compare averages two weeks apart. A single reading is noise.",
        "Take photos once every 4 weeks, same time of day, same light, same three poses, same lens distance, no pump. Do not look at them in between.",
        "Tape two sites that matter to your goal, for example upper arm at the same mark and waist at the navel, once every 4 weeks, relaxed, in the morning. Record to the nearest 0.5 cm.",
        "Set a rule in advance: you may only conclude 'stalled' when both the log and the monthly measures show nothing for 12 consecutive weeks.",
      ],
    },
    {
      title: "Protect the block that is working",
      steps: [
        "Do not change your program for the next 8 weeks. Same lifts, same split, same rep ranges. The only variable that moves is the load or the reps.",
        "Do not add volume. If sets are already ending 0–3 reps short of failure and the log is climbing, more sets will add fatigue before they add growth.",
        "Do not start a cut on the strength of the mirror. If your indicator lifts are climbing and you are not gaining weight faster than about 0.25–0.5% of bodyweight a week, the current intake is doing its job.",
        "Keep the sessions you would be tempted to skip because they 'don't feel productive'. Feeling is not one of your measures any more.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: record a dated baseline for two or three indicator lifts, take your first standardised photo set and two tape measurements, and start logging every working set. Change nothing in the program.",
    "Week 2: run the same sessions. Compare each indicator lift against week 1 and note any rep gained at the same weight. Ignore the mirror and the scale; read only the 7-day weight average.",
    "Week 3: aim to add one rep or one small load increment on each indicator lift. Write down the number of weeks since your last recorded improvement; you will find it is shorter than the stall you reported.",
    "Week 4: take the second photo and tape set under identical conditions. Line up week 1 versus week 4 for lifts, tape and weight average, and decide on the numbers, not on feel, whether anything actually needs to change.",
  ],
  timeline:
    "Within two weeks the log will show you progress you were already making, because it was there before you started looking. Tape and photos need at least eight weeks, usually twelve, to show a change you would trust, and even then the shift is small enough that you will only see it side by side with the baseline. Body weight moves last and least. Give it a full 12 weeks unchanged and you will have either clear visual evidence or a genuine, well-documented stall the rest of this report can act on.",
  mistakes: [
    "Switching programs because the last block 'didn't feel like it did anything', when the log says it did exactly what a block is supposed to do.",
    "Adding sets or a second session for the target muscle to force a visible change, and pushing recovery past what the current intake supports.",
    "Starting a cut so the muscle 'shows', which usually costs the very strength progress that was the evidence of growth.",
    "Taking progress photos on a whim, after a pump session, under different light, and concluding nothing changed because the comparison was never fair.",
    "Comparing this week's tired working set with a rested PR from months ago and calling the gap a stall.",
  ],
  trackNotes: {
    physique:
      "Your lift on the target muscle is up at least 5% or 2+ reps over eight weeks. For a muscle you want to grow, that is the earliest and most reliable sign that tissue is being added; the tape will confirm it, but months later. Choose one direct movement for that muscle as your indicator and let its rep progress, not the mirror, tell you whether the block is working. If you are already lean and weight has not moved in eight weeks, the missing ingredient is more likely food than a new exercise.",
    strength:
      "Your heaviest set this week beat four weeks ago. That is the definition of getting stronger; the fact that it did not feel like a PR is irrelevant. Intermediate strength progress is measured in small load jumps and extra reps at the same weight across a block, not in monthly all-time bests. Test at the end of a block, not every session, and rate progress on the working sets in the log: the second working set on an ordinary day tells you more about the trend than a heavy single on a good one.",
  },
  relatedFindings: ["wrong_progress_signal", "bad_comparison", "no_forcing_function"],
};
