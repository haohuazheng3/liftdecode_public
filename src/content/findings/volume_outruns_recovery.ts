import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "volume_outruns_recovery",
  audience: "both",
  category: "recovery",
  title: "Big dose, small recovery",
  verdict:
    "You're running a high training dose on a recovery budget that can't absorb it, so the extra work is turning into fatigue instead of progress.",
  summary:
    "Your training week is not the problem on its own, and neither is your sleep or what life is asking of you. The problem is the combination: a dose that needs nine hours and a quiet life to recover from, run on the sleep and stress you actually described. Every week you keep pushing, the fatigue compounds, the sessions feel worse, and the natural response is to push harder still.",
  mechanism: [
    "Training does not build muscle or strength. It creates the demand; recovery does the building. Every hard set is a withdrawal from a budget that sleep, food and a calm nervous system refill overnight. When withdrawals outrun deposits for a few days you feel it as a flat session. When they outrun deposits for weeks, the deficit becomes your result: the work is still being done, but the adaptation it should have produced is being spent on repair instead.",
    "The dose you described is a real dose. Sixteen or more genuinely hard sets on one muscle, sixteen or more heavy sets on one lift, a month of living at 85% and above, or taking most sets to the point where the bar stops: these all sit where the comparison studies place the top of the useful curve, where more work adds fatigue faster than it adds stimulus. Fine for a well-rested lifter in a planned block. A very different thing on the recovery you reported.",
    "Sleep is the largest single deposit. Below roughly seven hours, the studies that restrict sleep in trained people show lower force output the next day and a measurably blunted muscle-building response to the same session. Fewer than four nights of seven hours in the last week means your body has been repairing on less than it needs while you asked it for more. Sustained stress, a physical job or a family crisis draw from the same pool, which is why they need only one more sign, like never deloading or heavy warm-ups, to tip the balance.",
    "What makes this stall so convincing is that fatigue masks fitness. The strength and muscle your last eight weeks built are real, but they sit under an equal or larger layer of fatigue, so the bar does not move. You read that as \"not enough\", add a set or take one more to failure, and deepen the deficit that is hiding your progress. Failure sets make it worse: pushing past the point where the bar slows roughly doubles a set's fatigue cost for a small gain in stimulus.",
    "The fix is not to train less forever. It is to bring the dose down to what your current recovery can actually absorb, clear the fatigue that has built up, and then find out what you have really built. Most people who do this properly get stronger during the easier weeks, and that surprise is the clearest evidence the problem was never a lack of effort.",
  ],
  howItShowsUp: [
    "You count 16 or more hard sets on the muscle you care about, or 16 or more heavy sets on your main lift, and you can still not point to a rep or a kilogram gained in the last month.",
    "You got 7 hours of sleep on fewer than four nights out of the last seven, and that was a fairly normal week.",
    "Warm-up weights feel heavy before the session has even started, or soreness from one session is still there when the next one begins.",
    "Most of your sets end because the bar stopped moving, not because you chose to stop, and you are proud of that.",
    "You have never deliberately taken an easier week. When you do back off, it is because you feel wrecked, or because travel or illness made the choice for you.",
    "Outside the gym, there is sustained stress, something big going on, or a job that has you on your feet all day, and you have been treating that as unrelated to the bar.",
  ],
  fix: [
    {
      title: "Cut the dose to what you can currently absorb",
      steps: [
        "Physique: drop the target muscle from 16+ hard sets a week to 10–12 for the next four weeks. Keep the exercises; remove the last set of each. Strength: drop the main lift and its close variations to 8–10 working sets a week, and cap the top set at 80–85% of your best for sets of 3–5.",
        "Stop at 1–2 reps in reserve on every working set except one per week: the last set of your first exercise can go to 0 RIR. Failure on every set is the single fastest way to spend recovery you do not have.",
        "If you have been maxing out or working up to a near-max most weeks, remove test days entirely for four weeks. Progress is measured on a repeatable working set, not a single-rep attempt.",
        "Keep the sessions and days you already train. This is a dose cut, not a break.",
      ],
    },
    {
      title: "Run the deload you have never taken",
      steps: [
        "Week 1 is a proper deload: half your normal number of working sets, loads at 80–85% of what you would normally use, nothing within 3 reps of failure. It will feel too easy. That is the point.",
        "From week 5 onward, plan a deload every 4–6 weeks while life stays loud, every 6–8 weeks once it quietens. Write the date in the log now so it is not a decision you make when you are already wrecked.",
        "Treat two of these as an automatic mid-block deload trigger: warm-ups heavy two sessions in a row, soreness carrying from one session into the next, or a benchmark set dropping two sessions running with no obvious reason.",
      ],
    },
    {
      title: "Protect the deposits",
      steps: [
        "Set a sleep floor, not a target: 7 hours asleep on at least 5 of the next 7 nights. Fix the bedtime, not the wake time, and move it 30 minutes earlier than it is now.",
        "If you are drinking 8+ drinks a week, hold it to 4 or fewer, and none in the 3 hours before bed. Alcohol taxes exactly the deep sleep that does the repair.",
        "On the days a physical job or a crisis takes the most out of you, train anyway but drop 1 set per exercise. Log sleep hours and a 1–5 stress score next to each session.",
        "Eat at maintenance or slightly above, with protein around 1.6–2.2 g per kg of body weight per day. Recovering from too much training in a deficit is filling a bucket with a hole in it.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: deload. Half your working sets at 80–85% of your normal loads, every set 3+ reps from failure. Fix a bedtime 30 minutes earlier and start logging sleep hours and a stress score next to each session.",
    "Week 2: rebuild at the reduced dose. Physique: 10–12 hard sets on the target muscle at 1–2 RIR. Strength: 8–10 working sets on the lift at 80–85%, no maxes. Hold the sleep floor at 5 of 7 nights.",
    "Week 3: keep the dose fixed and add load or reps on one benchmark working set only if the previous session was clean. Note whether warm-ups still feel heavy; for most people they stopped in week 2.",
    "Week 4: compare the benchmark set with the best set from the week before the deload. If it has moved up, the stall was fatigue and you have your working dose. If not, hold this dose four more weeks and look at sleep and stress before sets.",
  ],
  timeline:
    "Feel improves first, usually within the deload week: warm-ups stop feeling heavy and sessions stop feeling like a tax. The bar follows over the next two to three weeks as the masked adaptation from the last block surfaces, which is why so many lifters hit a working-set best in week 3 or 4 of doing less. Visible physique change lags further, six to eight weeks, and only once dose and recovery stay matched. If life gets louder again, the dose comes down again; that is the rule, not a setback.",
  mistakes: [
    "Adding a set or a day to \"break through\", which deepens the recovery deficit that is causing the stall.",
    "Taking a full week off instead of a deload, then returning to the same dose that outran your recovery in the first place.",
    "Fixing the training but not the sleep, so the reduced dose is absorbed and the next increase stalls again within a month.",
    "Treating a heavy-feeling warm-up as a sign you need to push harder to \"wake up\", rather than as the readiness signal it is.",
    "Cutting calories because progress has stalled, which removes the one deposit you could most easily have increased.",
  ],
  trackNotes: {
    physique:
      "Sixteen-plus hard sets a week on one muscle is a peak-block dose, and the studies that pushed volume that high did it with rested lifters for a few weeks at a time. Bring the target muscle to 10–12 hard sets at 1–2 RIR, keep the rest of the body at maintenance volume (around 6–8 sets), and judge by the working weight on that muscle's main lift over eight weeks. If it climbs while you do less, you were over the top of the curve, not under it.",
    strength:
      "Living at 85%+ or testing a max most weeks measures strength; it does not build it. Spend the next four weeks at 80–85% for sets of 3–5, 8–10 working sets a week including variations, nothing above a clean triple. Plan the next true test for the end of a 6–8 week block after a taper week; a rested max after a taper is the only number that tells you whether the block worked.",
  },
  relatedFindings: ["fatigue_never_cleared", "failure_every_set", "sleep_under_dose"],
};
