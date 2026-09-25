import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "wrong_progress_signal",
  audience: "physique",
  category: "measurement",
  title: "You're grading progress by the wrong signal",
  verdict:
    "You're judging a slow, cumulative change with the scale, the mirror or other people's comments — tools that reset every morning and can't see the 100–250 g of muscle a month you may actually be adding.",
  summary:
    "You decided you're stuck by looking in the mirror, stepping on the scale or listening to someone else — and none of those has a baseline, a memory or the resolution to see muscle arriving at a few hundred grams a month. The real risk isn't the stall; it's that you'll change a program, a diet or both to fix a problem your evidence can't actually confirm, and throw away weeks that were quietly working.",
  mechanism: [
    "Muscle arrives slowly, and after the first year it arrives very slowly. For someone with a couple of years of training behind them, a realistic, well-fed, well-programmed rate of muscle gain is somewhere in the region of 100–250 g a month — and that is the good scenario. Spread across a whole body, that is not a change anyone can see in a mirror week to week, and it is a rounding error next to the swings the scale shows you for reasons that have nothing to do with muscle.",
    "The scale is a poor instrument for this job because it moves 1–2 kg day to day on water, glycogen, salt, gut contents and where you are in your sleep and training week. A monthly gain of 200 g of muscle is roughly a tenth of that daily noise. You could add that amount every month for six months and still see a scale that mostly wobbles. The scale can track body mass trends over months when you average it; it cannot tell you anything about what you built this month.",
    "The mirror is worse, not better, because it has no baseline. You see yourself every day, so you adapt to every small change as it happens; the person who compares you to yourself is the one least equipped to notice a slow drift. Lighting, pump, hydration, time of day and mood all move what you see by more than a month of real growth does. Other people's comments have the same problem with an extra layer of noise: they notice your haircut, your tan, your posture and their own mood on the day.",
    "Meanwhile the earliest, most reliable signal that a muscle is growing is that it gets stronger in the rep ranges you train it. Across the training studies that measured both, gains in muscle size and gains in repetition strength track each other reasonably well over months — not perfectly, but well enough that a lift on the target muscle creeping up by a rep or two, or by five per cent of load, over eight weeks is far stronger evidence of growth than anything the mirror can offer. Your answers say that lift may be moving. Your evidence ignores it.",
    "This matters because a false stall triggers real changes. People who believe they've stopped growing swap programs, cut calories, add volume or add cardio — and each of those interventions can genuinely slow growth that was happening. If your stall is under eight weeks old and your log lives in your head or nowhere, you do not currently have a single measurement that could prove you've stalled, and you're about to act on it anyway.",
  ],
  howItShowsUp: [
    "You said you're stuck, but when asked how long, the honest answer was less than four weeks or somewhere in the 4–8 week range.",
    "The evidence you actually rely on is the mirror under gym lighting, the number on the scale, or something someone said to you.",
    "Your working weight or reps on a lift for the muscle you most want to change has gone up over the last eight weeks — clearly, or at least on good days — and it didn't change your mind.",
    "If we asked what you lifted three sessions ago, the answer would be a rough memory or nothing at all.",
    "You feel bigger some mornings and smaller others, and you treat both as information.",
    "Nothing in your evidence was recorded the same way twice: no photos in the same light and pose, no tape at the same site, no logged sets.",
    "You've had the urge to change something big recently — program, calories, split — without being able to say exactly which number you were trying to move.",
  ],
  fix: [
    {
      title: "Replace the daily verdict with a monthly measurement",
      steps: [
        "Weigh yourself every morning after the bathroom and before food, and only ever look at the 7-day average. A single reading is not data. Write the weekly average in your log on Sundays.",
        "Take four progress photos — front relaxed, side, back, and one of the muscle you care most about — every 4 weeks, same room, same lighting, same time of day, same phone height. Set a calendar reminder so you don't do it only when you feel good.",
        "Tape two sites that matter to your goal (for most people: upper arm flexed at the peak, and chest or thigh at a fixed landmark) once every 4 weeks, same morning as the photos, tape snug but not compressing. Record to the nearest 0.5 cm.",
        "Do not judge anything from these until you have three data points — that is 8 weeks from your first measurement. Before that, you are looking at noise.",
      ],
    },
    {
      title: "Promote the lift to your primary progress signal",
      steps: [
        "Pick one lift per muscle you want to change — the one you've been doing longest and can perform the same way every time. Two or three lifts total, no more.",
        "Log every working set of those lifts: load, reps, and how many reps you had left. Start today, in an app or a notebook, not in your head.",
        "Every 4 weeks, compare this week's best set at a given load with the same lift 4 weeks ago. A rep or two more at the same weight, or about 2.5–5% more load for the same reps, counts as progress for someone past their first year.",
        "Keep rep range, rest period and form the same across the comparison, because a rep gained by shortening range of motion or resting longer isn't a signal.",
        "If the target lift goes up for 8 weeks and photos plus tape are flat, then — and only then — you have a nutrition or expectations problem to look at. If the lift is flat for 8 weeks, that is a real stall and this report's other findings apply.",
      ],
    },
    {
      title: "Freeze the big changes until the evidence exists",
      steps: [
        "For the next 8 weeks, change nothing structural: same program, same weekly calories, same training frequency. The goal is a clean measurement window.",
        "Allow only one type of change during the window — small load or rep increases on the lifts you're tracking.",
        "Write down, today, what you will consider a stall at the end of 8 weeks: for example, \"target lift up less than 1 rep at the same load AND arm tape unchanged AND photos identical.\" Decide the verdict rule before the data comes in.",
        "Stop weighing on days after heavy carbs, alcohol or a poor night's sleep from counting as evidence of anything — they go into the average and nothing else.",
      ],
    },
  ],
  fourWeekPlan: [
    "Take baseline photos and tape this week. Start logging every working set of two or three target-muscle lifts. Weigh daily, record only the weekly average.",
    "Change nothing. Keep the log going and add reps or load only where they come naturally. Write down your 8-week stall rule and put it at the top of the log.",
    "Compare this week's best sets with week 1 for each target lift. If any is up a rep or a load step, note it explicitly as progress. Weekly-average scale: note the direction, not the size.",
    "Second photos and tape, same conditions as week 1. Compare side by side with baseline, not with your memory. Log all three signals — lift, tape, photos — together and decide nothing until week 8.",
  ],
  timeline:
    "The first thing that changes is your confidence, not your body: within two weeks of logging you'll know whether the lift is moving, which is something you genuinely don't know right now. Photos and tape need at least two comparison points — 8 weeks — before a real difference shows through the noise, and for a trained lifter a visible change in photos often takes 3–4 months. If the lift is climbing during that time, the tissue is almost certainly following; the picture lags the numbers by a season, not a week.",
  mistakes: [
    "Switching programs because the mirror looked flat this week — you reset the only progress signal you had and start a new 8-week window without a baseline.",
    "Cutting calories to \"see it better\" while trying to add muscle, which removes the surplus the growth was running on.",
    "Taking photos more often, in different lighting, whenever you feel good, and calling the best one your progress.",
    "Weighing once a week at random times and reading the single number as a trend.",
    "Asking a training partner or a partner whether you look bigger — you're outsourcing a measurement to someone with no baseline either.",
    "Adding sets to the lagging muscle before confirming it's lagging, which raises fatigue and can make the lift you should be watching go backwards.",
  ],
  relatedFindings: ["no_numbers_no_stall", "hidden_progress", "bad_comparison"],
};
