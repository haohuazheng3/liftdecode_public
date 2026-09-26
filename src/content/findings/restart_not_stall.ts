import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "restart_not_stall",
  audience: "both",
  category: "consistency",
  title: "You're not stalled, you're restarting",
  verdict:
    "You're back after a break, and the first weeks back feel like a wall because you're rebuilding, not because anything is wrong.",
  summary:
    "You came back after a break, the numbers are nowhere near what you remember, and every session feels like proof that something broke while you were gone. Nothing broke: you're measuring the early part of a rebuild against the lifter you were before the break. The danger isn't the lost strength; it's what you do about a problem that doesn't exist.",
  mechanism: [
    "Time off does real damage, and far less than it feels. Studies that track lifters through detraining find strength falls first and fastest, mostly through the nervous system: the coordination, rate of force and confidence under a bar that made your old weights feel normal fade within weeks. Muscle size follows more slowly and less completely. You walk back in with a body that has kept more of its tissue than its skill, which is why the weights feel wrong before they feel heavy.",
    "The good news is built into the tissue. Muscle fibres that grew under training hold on to the extra nuclei they acquired, and the evidence on retraining consistently shows people regaining lost size and strength several times faster than they first built it. A lifter who needed a year to reach a number often gets most of the way back in one to three months. Your first block back is not year one again; it is a steep recovery curve that starts low, and the starting point is the part you are seeing now.",
    "The wall is not a plateau; it is the first two to four weeks of the curve. Coming back, your tolerance for volume is low, soreness is exaggerated, and your working weights sit 15–30% under your old ones. Because you remember what you used to lift, every set feels like failure. Then your lifts jump, sometimes weekly, for one to three months. Almost everyone who quits after a comeback quits in the flat part just before the jump.",
    "What feels like a stall started when you came back, and it looks exactly like a rebuild: lower than before, or up only in small, uneven steps. A stall is a statement about two data points taken under the same conditions. One of yours came from a lifter training continuously; the other from a lifter only weeks into retraining. Those are two different people. There is no diagnosis to make yet, only a rebuild to run properly.",
    "What does go wrong in a restart is self-inflicted. Returning at the old weights and volume produces soreness that costs the next session, joints that were not ready, and a second break inside the first month. Programme and diet changes made in the first weeks back, to fix a stall that is really a starting point, mean you never see the rebound that was coming anyway. The fix is patience with structure: a start that respects the break, a progression that matches the curve, and a comparison that is fair.",
  ],
  howItShowsUp: [
    "You described your last few months of training as back after a break, and what feels like a stall is the first stretch of the comeback.",
    "You're turning up again, yet the weights make it feel as if the sessions aren't landing, and a fresh program starts to look like the answer.",
    "Your working weights are well below what you remember, and every session you compare today's set with the numbers from before the break.",
    "Soreness lasts days, not hours: the kind you remember from your first months of training, not the mild kind from before the break.",
    "Some weeks the numbers climb, then a rough session sends them back, so it looks like nothing is sticking.",
    "You have already tried to skip the rebuild by loading your old working weight, and the set was uglier and slower than you expected.",
  ],
  fix: [
    {
      title: "Pick your start point from the length of the break",
      steps: [
        "Match the restart to the break. Off under about three weeks: resume at roughly 90% of your last pre-break working weights and 75% of your old weekly sets. Off one to three months: 70–80% of the weights and about two-thirds of the sets. Off longer than three months: 60–70% of the weights and half the sets, roughly 6–10 hard sets per muscle per week, with isolation work about 10% lighter again.",
        "Already back six weeks or more? Skip the reset: go straight to the ramp below if your lifts are still climbing, or to the comparison step if they have flattened. Dropping the weights now would only hand back ground you have already regained.",
        "Whatever your start point, keep every set 2–3 reps short of failure for the first two weeks. You will regain strength from those sets without being so sore that Thursday's session becomes Saturday's.",
        "Keep the exercise list short and familiar: the lifts you knew well before the break. This is not the time to learn new movements or hunt for the perfect programme.",
      ],
    },
    {
      title: "Run the rebuild as a fast, planned ramp",
      steps: [
        "Add load every session on main lifts while it keeps moving: 2.5 kg upper body, 5 kg lower body, or one to two reps at the same weight. During a rebuild, weekly progress is normal, not greedy.",
        "From week 3, add one or two hard sets per muscle per week until you are back at your old volume: around week 6–8 from half volume, sooner after a short break. If soreness or joint ache starts stacking, hold volume there for a week.",
        "Bring the last set of each main lift to within 1–2 reps of failure from week 3; keep the earlier sets at 2–3 in reserve. Save true failure for the end of the block.",
        "Expect the jumps to slow around 85–95% of your old numbers. That is where the rebuild ends and ordinary training begins; only from there does the word stall mean anything.",
      ],
    },
    {
      title: "Use a comparison that can't lie to you",
      steps: [
        "Write your pre-break numbers at the top of a new page, rule a line under them, and do not compare against them again until the ramp has run eight weeks.",
        "Log every working set from today. Your only comparison is this week's benchmark set against the same set two weeks earlier, taken at the same point in the session.",
        "Set the bar for progress in advance: at least 2.5% more load, or one to two extra reps at the same weight, over two weeks. Anything smaller is noise, either way.",
        "Eat like someone rebuilding: 1.6–2.2 g of protein per kg of body weight each day, roughly maintenance calories, and 7–9 hours of sleep. The tissue comes back faster when it has what it needs.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: set working weights and weekly sets at the start point that matches your break length above (or begin at the ramp if you have been back six weeks or more), keep 2–3 reps in reserve on every set, and start a clean log with the old numbers ruled off at the top.",
    "Week 2: add 2.5 kg upper and 5 kg lower on each main lift every session it moves, or one to two reps; keep volume where it is and note soreness and sleep in one line per session.",
    "Week 3: add one or two hard sets per muscle, bring the last set of each main lift to 1–2 reps from failure, and keep adding load; you should be closing in on your old numbers, sooner the shorter the break.",
    "Week 4: run your first fair comparison, this week's benchmark set against week 2's; if it is up by 2.5% or one to two reps, you were never stalled. Keep ramping volume toward your old level over the next four weeks.",
  ],
  timeline:
    "The first change is in your reading of the situation, and that can happen today: a few weeks into a comeback, sitting well under your old numbers, is exactly on schedule. Strength climbs visibly week to week for roughly one to three months, fast at first and slowing as you close in on your old numbers. Size and shape lag strength by several weeks, so the mirror catches up last. When you are within about 10% of your pre-break lifts and flat for two clean four-week windows, a stall becomes a real question.",
  mistakes: [
    "Loading your old working weight in week one to prove nothing was lost, then losing the next three sessions to soreness or a tweaked joint.",
    "Changing programmes a few weeks in because the numbers are below what you remember, and never seeing the rebound that was coming.",
    "Going straight to your old volume because you remember handling it, which stacks soreness on low tolerance and turns a comeback into a second break.",
    "Cutting calories to fix the softness you noticed after the break, at the exact moment your body needs fuel to rebuild the tissue.",
    "Testing a one-rep max to see where you stand: a low number under the worst conditions, and one more depressing comparison.",
  ],
  trackNotes: {
    physique:
      "Lifts that sit below your old numbers, or climb only barely, are the normal shape of a return, not a sign the muscle has gone. Retrained muscle comes back faster than it was first built, but behind strength, so expect the mirror to lag the log by several weeks. Ramp the working weight on the lift for your priority muscle first; when it is within 10% of the old number and still climbing, the shape follows. Keep calories near maintenance and protein high rather than dieting off the softness you noticed on your return.",
    strength:
      "Numbers that sit below your old ones, or climb in uneven steps, are a rebuild reading, not a stall reading. Skill on the bar returns before tissue, so the early weeks feel wrong more than weak; drill your main lifts two or three times a week at moderate loads and let the coordination come back. Add load every session it moves, hold form standards from day one, and do not schedule a max attempt until you have run eight weeks and sit within 5–10% of your old training numbers.",
  },
  relatedFindings: ["consistency_gap", "missed_dose", "program_hopping", "expecting_year_one_speed"],
};
