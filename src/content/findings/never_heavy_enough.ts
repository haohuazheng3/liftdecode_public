import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "never_heavy_enough",
  audience: "strength",
  category: "programming",
  title: "You never practise the load you're testing",
  verdict:
    "Heavy weights still feel foreign because you almost never train near them.",
  summary:
    "You want a bigger max, but very little of your training goes near one. Your answers point at some mix of three things: you rarely lift close to your max, your form shifts when the weight gets heavy, and your weights are picked by feel or habit rather than by a plan. Each one keeps you working below the load you're judged on. The muscle you've built is real; the skill of expressing it under a heavy bar is not, which is why the work feels productive and the top number doesn't move. Left alone, this is a lifter who gets fitter every year and tests the same.",
  mechanism: [
    "A one-rep max is not just a readout of how much muscle you have. It is a skill: bracing under a load that compresses you, holding position through a bar speed you've never felt, and recruiting the highest-threshold motor units in the right order at the right moment. Like any skill, it is learned through specific practice. In the research that compared training programmes matched for total work but different in load, the heavier groups gained more on the 1RM even when muscle growth was similar. The difference was not tissue. It was practice at the thing being tested.",
    "Sets of 5–10 at moderate weight train a lot of useful things, but they train them at a bar speed, a bracing demand and a recruitment level that a max never asks for. The first rep of a 10-rep set at 65% is easy; the tenth is hard because you are fatigued, not because the load is heavy. Your body learns to grind through fatigue, which is a different adaptation from producing maximal force fresh. That is why strong-looking lifters who only train moderate rep ranges often stall on the platform while their reps keep climbing.",
    "There is a second, quieter cost. Because your loads rarely approach your limit, you get few chances to see where the lift is weak, and the ones you get are max attempts, when you are least practised and most likely to lose position anyway. Even if you have a sense of where heavy reps die, a sticking point you meet a handful of times a year is hard to read and harder to train, so the whole lift gets more of the same and the ceiling stays where it is.",
    "The neural side is well documented in plain terms: the first weeks of heavy training raise strength faster than muscle can grow, and lifters who are detrained from heavy loads but not from training lose the ability to express their strength before they lose the strength itself. Heavy singles and doubles at 85–92% teach you to be tight, to keep the bar on the right path when it slows, and to trust a load that feels different from anything in a set of 8. None of that transfers from moderate work, however hard it is.",
    "Finally, expectations. It is easy to hope for steady jumps on a max that you rarely rehearse. A max attempt that fails or feels ugly is then read as a stall, when it's really a first attempt at a skill. Once heavy loads are in the week on purpose, a trained lifter can reasonably see a 2.5–5% jump on the lift within a block, most of it from expression rather than new muscle, and then a slower, steadier rate after that.",
  ],
  howItShowsUp: [
    "Most of your sessions stop well short of your max; heavy triples and singles are rare events rather than a regular part of the week.",
    "Your working sets feel productive and your reps creep up, but the heaviest weight you can lift hasn't moved with them.",
    "When the bar does get heavy, your position changes: hips shoot up, the bar drifts or your brace softens in a way it never does at moderate weight.",
    "You pick loads by feel or by what you did last time, and on a normal day that lands on something comfortable rather than something heavy.",
    "A lot of your training time goes to accessories and pump work, which builds useful muscle but never asks you to handle a near-max load.",
    "When you do test a max, the weight feels foreign: the walkout is unstable, the first rep is slower than expected, and you bail from a rep you could probably have finished.",
    "If you test often, the max attempt is the only heavy work you do, so every test is also the first rehearsal.",
  ],
  fix: [
    {
      title: "Put a heavy day in the week, on purpose",
      steps: [
        "Pick the one lift you most want to move. Once a week, on your freshest day, work up to a top single at roughly 85–90% of your best (a weight you could do for 2–3 clean reps), then do 3–4 singles or doubles at 80–85%. Rest 3–5 minutes between sets.",
        "Keep your existing moderate work on a second day, but make it serve the heavy day: 3–4 sets of 4–6 at 70–75%, same lift or a close variation, ending 1–2 reps short of failure.",
        "Get a working estimate before you start. If you have no recent max, take the best clean set of 5 from the last month and multiply it by 1.15; treat that as your estimated max for the first two weeks and set the percentages from it.",
        "Add 2–3 warm-up singles between your last moderate warm-up and the top single (for example 60%, 70%, 80%). The heavy day's job is to make 85% feel normal, and that starts with never jumping to it.",
      ],
    },
    {
      title: "Find the sticking point and aim at it",
      steps: [
        "In week 2 or 3, film the top single from the side. Watch where the bar slows most. That position, not the whole lift, is what has been missing.",
        "Bottom slow: add one 3-second-pause variation (pause squat, pause bench, deficit deadlift) for 3 sets of 3 at 70–75% after the heavy work.",
        "Mid-range slow: add pin presses, block pulls or a 2-second tempo on the way down, 3 sets of 3–5 at 75–80%.",
        "Lockout slow: add board presses, rack pulls from knee height or heavy walkouts and holds at 100–105%, 3 sets, once a week.",
        "If nothing slows visibly at 85–90%, the single was not heavy enough. Add 2.5% next week and film again until you find it.",
      ],
    },
    {
      title: "Progress it like a block, not like your first year",
      steps: [
        "Run the heavy day for 4 weeks at roughly 85%, 87.5%, 90% and then a light week at 75%. Move the top single up by 2.5 kg only when the previous week's single moved fast and clean.",
        "Test a true max at the end of an 8–12 week block, after the light week, not every time you feel good. Expect a 2.5–5% jump on the first block, then a PR per block after that.",
        "Log bar speed as well as weight: a one-word note (fast / steady / slow / grind) beside each heavy single. A single that goes from slow to steady at the same weight is a real week of progress.",
        "Keep your moderate work as it is elsewhere in the week. The point is to add rehearsal, not to become a lifter who only tests.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: add one heavy day for your priority lift. Work up through 60/70/80% singles to a top single at about 85%, then 3 singles at 80%. Keep the rest of the week unchanged and log bar speed.",
    "Week 2: top single at about 87.5% if week 1 was clean, plus 3 doubles at 80–82%. Film the top single from the side and mark where the bar slows.",
    "Week 3: top single at about 90%, 3 singles at 85%. Add one weak-point variation aimed at the position you found on film, 3 sets of 3.",
    "Week 4: light week. Top single at 75% for 2–3 fast reps, weak-point work at half volume, then plan the next block from 87.5% with the first proper max test pencilled in for the end of block two.",
  ],
  timeline:
    "The first change is how heavy feels: within two to three weeks, 85% stops being alarming and the walkout steadies. Expect a 2.5–5% jump on the lift by the end of the first 8–12 week block, most of it from learning to express strength you already have. After that the rate settles to something like a PR every block, which, once the early fast gains are behind you, is what real progress looks like. Nothing about this is fast, but it is the part you have been skipping.",
  mistakes: [
    "Swinging to the other extreme and maxing out every week to \"see where you're at\", which trades never rehearsing for never recovering.",
    "Adding more moderate volume in the hope that being fitter will eventually produce a bigger max; it produces bigger sets of 8.",
    "Testing a max cold after months of sets of 10, missing, and concluding you have plateaued.",
    "Chasing the weak-point variations you've read about before you've loaded the lift enough to know which position is actually weak.",
    "Treating a slow, ugly single as failure and dropping the weight, when a slow single at a new weight is exactly what week one of learning looks like.",
    "Changing programmes because the last one \"stopped working\", when it never asked you to lift heavy in the first place.",
  ],
  relatedFindings: ["sticking_point_untrained", "expecting_year_one_speed", "main_lift_underpractised"],
};
