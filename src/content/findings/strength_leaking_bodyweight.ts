import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "strength_leaking_bodyweight",
  audience: "strength",
  category: "nutrition",
  title: "Your lifts are stuck because your weight is dropping",
  verdict:
    "You've lost body weight over the last eight weeks, and for a strength lifter that is the most common reason the bar stops before anything in the gym is.",
  summary:
    "Your scale has been drifting down for two months, and you've been reading the stalled bar as a training problem. It isn't. The program is being asked to add strength to a body that is quietly getting smaller, and the best it can do under those conditions is hold the line. Keep chasing the fix in your sets and reps and you'll spend the next block making a good program look like it stopped working.",
  mechanism: [
    "Strength is force, and force comes from muscle. Body weight is a crude but honest proxy for how much of it you carry and how well fed it is. When the eight-week trend is down, some of that loss is water and glycogen, some is fat, and some is the tissue you lift with. You can lose a few kilos and keep the muscle if the deficit is small and protein is high, but that is a narrow lane, and your answers suggest you're not in it.",
    "There is a second effect that arrives before any muscle is lost. Low carbohydrate availability empties muscle glycogen, and glycogen is what a heavy set runs on. The lifter in a deficit is not weaker on paper, but the fourth rep of a five grinds, warm-ups feel heavy and the top set ends one rep short. Coaches of weight-class athletes see this reliably: strength holds for a week or two of cutting, then the working sets sag before the scale has moved much.",
    "A stalled lift in a falling body is not the same problem as a stalled lift in a stable body. When intake is short, the training stimulus still arrives, but the adaptation it should trigger is under-resourced. In the studies that compared people training in a deficit with people training at maintenance or in a small surplus, the deficit groups reliably gained less strength and less muscle, even when protein was matched. More sets, more intensity, a new program: all of it pours stimulus into a hole where the raw materials should be.",
    "The trap is that the loss often looks like discipline. Eating clean-ish to appetite, cycling in and out of diets, or running a planned cut while still expecting PRs all feel responsible. But body weight cannot lie, only be misread. Down 2 kg in eight weeks means a deficit whether you planned one or not, and at a typical training weight that is roughly 2–3% of body mass. A few percent of body weight is a few percent of the lift, and that is exactly the margin you're missing.",
    "Protein makes the difference between losing weight and losing strength. Around 1.6–2.2 g per kilogram per day is the range where muscle is best protected during a deficit, and it needs to be there daily, not on average. If you can't state yesterday's grams, or you can and they fell short, then the loss on the scale has not been covered, and some of it is the tissue you compete with. That is why a lower heaviest set alongside a falling weight is not two problems. It is one.",
  ],
  howItShowsUp: [
    "Your weekly-average morning weight is down between half a kilo and several kilos over two months, and you either planned it, drifted into it, or didn't notice until asked.",
    "This week's heaviest set on your priority lift is lower than the one in the log from four weeks ago, not just the same.",
    "Your food is set up as a deficit, or swings between dieting and not every few weeks, or has no plan at all beyond eating clean-ish to appetite.",
    "You could not say within 20 g how much protein you ate yesterday, or you can, and it came in under 1.6 g per kg.",
    "Warm-ups feel heavier than they should, and the last rep of a working set grinds where it used to move.",
    "You've been treating this as a programming problem: more volume, a new template, a harder top set, and none of it moved the bar.",
    "You feel leaner or lighter, and part of you has been pleased about that, while the lifts have quietly given back a few percent.",
  ],
  fix: [
    {
      title: "Stop the leak this week",
      steps: [
        "Weigh yourself every morning after the bathroom, before food, and write down the weekly average. From today the target is a flat or rising average, and you judge the week on that number, not on how lean you feel.",
        "Add 300–500 kcal a day immediately, mostly from carbohydrate, and put a large part of it around training: 60–100 g of carbohydrate in the 2–3 hours before you lift, and a proper meal within 2 hours after. Rice, potatoes, oats, bread and fruit do this without leaving you stuffed.",
        "If you are on a planned cut, pause it. A four-week hold at maintenance costs you nothing in the long run and gives the lifts back their floor. If you are cycling between dieting and not, the next \"not\" phase starts now and runs at least eight weeks.",
        "If you eat with no plan, the plan for the next four weeks is three meals and one training-window snack, each built around one to two palms of protein and one to two fists of starch. Appetite is not a reliable guide while you're losing weight.",
      ],
    },
    {
      title: "Cover the protein every single day",
      steps: [
        "Set a daily floor of 1.6 g per kg of body weight, and aim for around 2 g per kg while you recover the loss. At 80 kg that is 130 g minimum, ideally 160 g.",
        "Split it into 3–4 feedings of 30–50 g, one of them within two hours after training. Four feedings of 40 g beat two big ones.",
        "Track it for 14 days only, with any app or a notebook, so you learn what 40 g of protein looks like on a plate. After that most lifters can eyeball it within 20 g.",
        "If your protein swings day to day, fix the lowest days first: a pre-made option (Greek yogurt, cottage cheese, tinned fish, a shake) turns a 90 g day into a 150 g day.",
      ],
    },
    {
      title: "Run the lift at its real floor while the weight comes back",
      steps: [
        "For two weeks, drop the top set of your priority lift by 5–7% and keep every rep crisp. You are not deloading; you are training at what your body can currently express, so every set is a clean stimulus, not a grind.",
        "Keep the exercise, rep scheme and weekly frequency exactly as they are. Changing the program now would hide the effect of the food.",
        "Re-test the heaviest set in week 3 or 4, once the weekly average has been flat or rising for two consecutive weeks. Compare it with the set from four weeks ago in the log, not with an old PR.",
        "Once the scale has stabilised, resume progression: add 2.5 kg or one rep to the top set whenever you hit the target with a rep in reserve.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: start daily weigh-ins and a weekly average, add 300–500 kcal a day with carbohydrate around training, set the protein floor at 1.6 g per kg and log it. Drop the priority-lift top set by 5–7%; leave the program alone.",
    "Week 2: check the weekly average. If it is still falling, add another 200–300 kcal. Keep protein at or above the floor every day, keep logging, and keep the top set at the reduced load with clean reps.",
    "Week 3: the weekly average should now be flat or up 0.2–0.5 kg. Bring the top set back to your usual working weight and note how the last rep moves compared with week 1.",
    "Week 4: re-test the heaviest set under normal conditions against the logged set from four weeks ago. If it is back to or above that number, resume adding weight and hold the scale flat to slightly rising. If not, hold the same food two more weeks before touching the program.",
  ],
  timeline:
    "Glycogen and water come back within a week of eating properly, so warm-ups and bar speed usually feel normal in 5–10 days, and that alone can return the rep you were missing. Muscle that has actually been lost takes longer: expect the heaviest set to be fully back in three to six weeks, and new PRs after that, not before. Judge the fix on the week-4 top set against the log, not on one good session in week 1.",
  mistakes: [
    "Adding volume or intensity to force the lift up while the scale keeps dropping. That spends recovery you don't have and tends to turn a stall into a slide.",
    "Switching programs. The template was working; it just stopped being fed. A new program in a deficit will stall in exactly the same way after a few weeks, and you'll have lost the comparison.",
    "\"Eating more\" without weighing yourself, then finding out eight weeks later that appetite rationed the extra food and the weight kept drifting.",
    "Fixing it with protein alone. Protein protects muscle, but it doesn't fill glycogen; a high-protein deficit still produces heavy warm-ups and a grinding top set.",
    "Staying in the cut because it's almost over and testing the lifts anyway. The number you test at the bottom of a cut tells you nothing about your training.",
    "Reading a week-1 bump on the scale as fat gain and cutting back. The first kilo is water and glycogen returning, and that is the part that makes the bar move.",
  ],
  relatedFindings: ["protein_unknown", "fatigue_never_cleared", "bad_comparison"],
};
