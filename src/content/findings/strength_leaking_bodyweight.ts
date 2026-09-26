import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "strength_leaking_bodyweight",
  audience: "strength",
  category: "nutrition",
  title: "You're dieting and asking for strength",
  verdict:
    "You're eating to lose weight while asking your lifts to go up, and your strength is paying for the diet.",
  summary:
    "You're running a diet and a strength block at the same time, and only one of them can be the priority. Right now the diet is winning by default: the food that would fund your training and recovery is the food you're cutting, and if meals also get skipped or shrink, the real deficit is bigger than the planned one. The stalled bar isn't a program failure, it's the bill for a goal you didn't pick on purpose.",
  mechanism: [
    "A diet works by leaving a gap between what you eat and what you burn. Your body fills that gap from storage, and it doesn't only draw on fat. Muscle glycogen runs low, recovery between sessions slows, and the signal to build or even keep contractile tissue gets weaker. None of that shows up as one dramatic bad day. It shows up as a lift that stops moving while everything else about your training looks the same.",
    "A single heavy triple runs mostly on fast, short-term energy that a diet barely touches. What carbohydrate pays for is everything around it: the back-off sets, the accessory work, the later sets of a long session. Trim starch and that volume gets harder to complete, so the total work that drives strength shrinks. The bigger cost to your heavy sets is slower: recovery between sessions is underfunded and the drive to adapt is weaker, so the top set stops climbing, warm-ups feel sticky and the bar slows sooner. You're not weaker in any permanent sense; you're recovering less than you're asking for.",
    "Strength is also a skill that improves through repeated high-quality exposures to heavy loads. Adaptation happens between sessions, and it is resourced by food and sleep. In a deficit, the stimulus still arrives, but the repair is underfunded. More sets and harder top sets pour extra stimulus into a system that can't pay for what it already has. That's why pushing harder during a diet usually turns a plateau into a slide.",
    "Two things make this worse. If meals get skipped or shrink without planning to, the diet on paper is milder than the diet you actually run. And if you also do a lot of cardio, sport or physical work, every one of those hours widens the gap without you choosing to. Two lifters on the same meal plan can be in very different deficits depending on how much they move and how often meals get skipped.",
    "None of this means you can't lose weight as a strength athlete. Weight-class lifters do it constantly. They do it by making the cut slow, keeping protein high and carbohydrate around training, and lowering their expectations for the block: hold strength, don't chase it. The problem isn't that you're dieting. It's that you're dieting while still judging your training as if you weren't.",
  ],
  howItShowsUp: [
    "You're eating to lose weight right now and still expect your main lifts to go up week to week.",
    "Meals get skipped or shrink without planning to, so some days end far lighter than the diet you set out to run.",
    "Light and medium sessions feel fine, but heavy top sets end a rep early or slow down sooner than they used to.",
    "You walk into sessions with less energy than you'd like, and warm-ups feel heavier than they should.",
    "Cardio, sport or a physical job sits on top of the lifting, so the days you move most are the days you're emptiest.",
    "You've responded to the stall with more volume, harder sets or a new template, and none of it has shifted the bar.",
    "Part of you is pleased the diet is working, and part of you is frustrated the lifts aren't, and you haven't decided which matters more this block.",
  ],
  fix: [
    {
      title: "Pick one priority for the next block",
      steps: [
        "Decide now whether the next 8–12 weeks are a strength block or a cut. Write the choice down. You can do the other one after, but running both at once is what has you stuck.",
        "If strength wins, raise intake to maintenance: add roughly 300–500 kcal a day, mostly from starch and fruit, and hold it there for at least 8 weeks before judging the lifts.",
        "If the cut wins, keep it, but change the goal for your training to 'hold every working weight'. A block where your top sets stay put while you lose weight is a successful block, not a stall.",
        "Either way, set an end date. A cut with no finish line tends to drift into months of mediocre training.",
      ],
    },
    {
      title: "If you keep dieting, make it a strength-friendly cut",
      steps: [
        "Slow it down. Aim to lose no more than about 0.5% of body weight a week; for most lifters that is a daily gap of roughly 300–500 kcal, not 800–1,000.",
        "Keep protein at around 2 g per kg of body weight every day, split across 3–4 meals of 30–50 g. At 80 kg that's about 160 g.",
        "Take the calories from fat and from meals away from training, not from the meals around it. Put 60–100 g of carbohydrate in the 2–3 hours before you lift and a real meal within 2 hours after.",
        "Plan 1–2 higher-carbohydrate days a week at roughly maintenance, and place them on your two heaviest sessions.",
        "Cap hard conditioning at 2 sessions a week and keep it away from your heavy lower-body day. Easy walking is fine; it's the hard stuff that competes for recovery.",
      ],
    },
    {
      title: "Stop the unplanned deficit",
      steps: [
        "Pick the meal you skip most often and replace it with something that needs no cooking: Greek yogurt with fruit and oats, a sandwich with 150 g of chicken or tuna, or a shake with a banana and bread.",
        "Eat at fixed times on training days: a meal 2–3 hours before, a meal within 2 hours after, and at least two others. Appetite is a poor guide during a diet, so the clock decides.",
        "Keep two emergency options at work or in your bag, such as milk, a protein bar and a piece of fruit, so a busy day costs you a delay, not a meal.",
        "On days with a lot of cardio, sport or physical work, add one extra meal of 500–700 kcal. That activity is part of your training load and it needs paying for.",
      ],
    },
    {
      title: "Train to the body you have this month",
      steps: [
        "Keep your main lifts, rep ranges and weekly frequency exactly as they are. Changing the program now would hide what the food is doing.",
        "Work your top sets at 1–3 reps in reserve instead of grinding, and stop adding weight on any lift where the last rep slowed down noticeably.",
        "Trim accessory work by about a third, typically 1 set off each accessory, so the recovery you do have goes to the main lifts.",
        "Keep 7–9 hours in bed as a hard floor. Sleep is the one recovery input a diet doesn't take away from you.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: decide between a strength block and a cut, and write down the end date. Set protein at about 2 g per kg a day and move 60–100 g of carbohydrate into the hours before each session.",
    "Week 2: fix the meal you skip most with a no-cook option and eat at fixed times on training days. If you're cutting, slow the deficit to roughly 300–500 kcal a day; if you've chosen strength, bring intake up to maintenance.",
    "Week 3: cap hard conditioning at 2 sessions, add a 500–700 kcal meal on your most active days, and put your higher-carbohydrate days on your heaviest sessions. Keep top sets at 1–3 reps in reserve.",
    "Week 4: judge the block against its own goal. In a strength block, start adding a small jump to any lift that now moves well. In a cut, count every working weight you held as a win and keep the same setup until the end date.",
  ],
  timeline:
    "Carbohydrate in the hours before you lift often makes sessions feel better within a week. If you move to maintenance, expect the lifts to start climbing again within 3–5 weeks. If you stay in a slow cut, the honest target is holding your working weights until the diet ends, with real progress resuming a few weeks after it does.",
  mistakes: [
    "Adding volume or intensity to force the lift up during the diet. That spends recovery you don't have and turns a stall into a slide.",
    "Switching programs. The old one wasn't broken; it was underfed, and a new one will stall the same way within a few weeks.",
    "Cutting carbohydrate first because it feels like the easiest calories to drop. Those are the calories that pay for your training volume and recovery.",
    "Treating skipped meals as a bonus for the diet. An unplanned deficit on top of a planned one is how a sensible cut becomes a crash.",
    "Adding extra cardio to speed the cut up. It widens the gap and competes for the same recovery as your heavy lower-body work.",
    "Testing maxes near the end of a cut and reading the result as a verdict on your training.",
  ],
  relatedFindings: ["cardio_eating_the_budget", "protein_unknown", "volume_outruns_recovery"],
};
