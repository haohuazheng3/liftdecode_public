import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "protein_unknown",
  audience: "both",
  category: "nutrition",
  title: "You can't hit a target you can't state",
  verdict:
    "You don't know yesterday's protein, and people who can't state it are almost never at the dose that supports growth or strength.",
  summary:
    "Asked what you ate yesterday, you reached for a feeling instead of a number, and that is the most reliable tell we have for protein sitting well under what your training is asking for. You do the hard part in the gym and then leave the cheapest, most predictable variable in the system to chance. Every week that stays true, the sets you grind through build less than they should, and if your weight is drifting down, some of what they built is quietly being spent.",
  mechanism: [
    "The session is only the signal. What turns it into tissue happens over the next 24–48 hours, and only if the building blocks are there. The research here is unusually consistent: across the trials that pooled resistance-trained people at different intakes, gains in muscle and strength kept improving up to roughly 1.6 g of protein per kilogram of body weight per day, then flattened, with little extra benefit past about 2.2 g/kg. Under that range the same sets produce less. Not zero, just reliably less, which is exactly what a slow stall looks like.",
    "We asked about yesterday rather than your intention for a reason. Nobody sets out to under-eat protein, and almost everyone who trains believes they eat plenty. But when people who say that log a normal day, the count lands around 0.9–1.2 g/kg far more often than not: eggs at breakfast, a sandwich at lunch, a decent dinner, and a total an 80 kg lifter would need to nearly double. People who can state a number usually built the day around it. People who can't are guessing, and the guess is almost always high.",
    "Protein also does not average well across days, which is why 'some days plenty, some days a sandwich' is not the same as 'enough on average'. The synthesis response to a meal peaks and fades within hours, and the body has no useful way to bank Tuesday's surplus against Thursday's shortfall. A week of 200 g days and 60 g days delivers fewer days of full signal than a week of steady 140 g days on a lower total. Yesterday is a sample; if it was a coffee-and-sandwich day, so were several others this month.",
    "The cost climbs if your body weight is trending down. In a deficit, protein is the main thing deciding whether the loss comes from fat or from muscle. In the studies that put people in a deficit at higher versus lower protein, the higher-protein groups kept more lean mass and more strength on the same calories. Lose weight at 1 g/kg and you can hold your lifts for a while on stubbornness, but the tissue underneath is being drawn down.",
    "With no eating plan, nothing in your week corrects a low day. Appetite is a poor guide to protein specifically: it is the most filling macronutrient and the easiest to skip when you are busy, tired or eating out. So the default drifts low, the drift is invisible because nothing is counted, and training keeps taking the blame for a stall that food is causing. It is the one nutrition variable that costs nothing to measure.",
  ],
  howItShowsUp: [
    "Asked about yesterday, your honest answer is 'no idea', 'a fair amount' or 'depends on the day', not a number.",
    "Most of your protein arrives at dinner; breakfast and lunch are carbs with a bit of something on the side.",
    "Some days are steak and eggs, others are coffee, a sandwich and whatever is around after training.",
    "You have no eating plan as such; you eat 'clean-ish', to appetite, and assume it sorts itself out.",
    "Your morning weight has drifted down over the last two months without you deciding it should.",
    "When training stalls you tweak the program, never the food, because the food 'seems fine'.",
  ],
  fix: [
    {
      title: "Get the number this week, then stop needing it",
      steps: [
        "Set your daily target now: 1.6–2.2 g per kg of body weight. At 70 kg that is 110–155 g; at 80 kg, 130–175 g; at 90 kg, 145–200 g. Write it where you will see it at breakfast.",
        "For 7 days, log every meal in any tracking app, protein only. Ignore calories and everything else; this is a measurement, not a diet.",
        "On day 3, check the running average. If it is under 1.2 g/kg, as it will be for most people who could not state the number, that gap is the size of the lever you have been leaving unpulled.",
      ],
    },
    {
      title: "Anchor four meals to a portion you can see",
      steps: [
        "Split the target across 3–4 meals at roughly 0.4–0.55 g/kg each, about 30–45 g for most people. Two big protein meals and two empty ones do not deliver the same signal as four decent ones.",
        "Learn three portions by heart: a palm-sized piece of chicken, fish or lean meat is about 25–35 g; 200 g of Greek yoghurt or cottage cheese is 18–24 g; one scoop of whey is 20–25 g. Build each meal around one of them before anything else goes on the plate.",
        "Fix breakfast first, because that is where most low days start. Add 25–30 g to whatever you already eat: eggs plus yoghurt, a shake with the coffee, or last night's leftovers. This alone closes a third of the gap for most people.",
        "Keep one rescue meal you can hit in five minutes without cooking: a shake, a tin of fish, cottage cheese, pre-cooked chicken. On the day that would have been a sandwich day, this keeps the count up.",
      ],
    },
    {
      title: "Make low days visible so nothing drifts",
      steps: [
        "Each night, note protein as one of three words: hit, close, low. No app needed once the first week is done. Three 'low' days in a week means the structure slipped, not your willpower.",
        "Weigh yourself 3–4 mornings a week and keep a weekly average. If it is falling and you have not chosen to diet, add 300–500 kcal a day, mostly carbohydrate, and keep protein where it is.",
        "If you are deliberately dieting, hold the top of the range, 2.0–2.2 g/kg, and cap the loss at about 0.5 percent of body weight per week.",
        "Run this for 4 weeks before touching the program. If protein was the problem, sets that used to stall will move without a single training change, and that is your proof.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: Set the target in grams for your body weight, log protein only for all 7 days, and fix breakfast with an extra 25–30 g. Change nothing in training.",
    "Week 2: Stop logging and move to hit/close/low each night. Every meal starts with a palm, a tub or a scoop; the rescue meal is stocked. Start the weekly weight average.",
    "Week 3: Check the weight trend against your intention. If it is falling without a plan, add 300–500 kcal, mostly carbohydrate, and keep protein steady. Aim for no more than one 'low' day.",
    "Week 4: Log again for 3 days as a spot-check; you should land within 15 g of target without trying. Compare working-set reps and top sets to week 1.",
  ],
  timeline:
    "The first change is invisible: in weeks 1–2 the main difference is that body weight stops drifting and sessions recover a little better. In a small surplus, reps at the same weights usually start climbing in weeks 3–6, and the physique difference takes 8–12 weeks to be obvious in photos. If you are dieting, the win is what you keep: strength holding while weight falls shows up as the absence of a decline rather than a gain.",
  mistakes: [
    "Buying a protein powder and changing nothing else. One scoop is 20–25 g; the gap for most people who can't state the number is 50–80 g.",
    "Going straight to full macro tracking, drowning by day four, and quitting the whole thing. Count one number, protein, for one week.",
    "Loading everything into dinner. A 90 g dinner and two near-zero meals looks fine on paper and works poorly in practice.",
    "Cutting carbohydrate to 'make room' for protein. Protein goes on top of the fuel you train on, not in place of it; if you are losing weight you did not plan, you need more food, not a cleaner plate.",
    "Chasing 3 g/kg and up because more must be better. Past about 2.2 g/kg the evidence shows no extra muscle, and the extra food crowds out carbohydrate.",
  ],
  trackNotes: {
    physique:
      "Protein is the ceiling on what each hard set can build, so hold the upper half of the range, 1.8–2.2 g/kg, especially if you are lean or trying to recomp. If your weight has been falling while you hoped to grow, the falling weight is the bigger problem and protein only limits the damage; you will need calories back as well. Judge the fix by working-set reps at the same weight over 6–8 weeks, then by photos, not by the scale.",
    strength:
      "You can hold a heavy lift on low protein longer than a physique trainee can hold a look, which is why this hides as a plateau instead of a decline. The tell is the pattern: numbers stuck for months, body weight drifting down, no idea of intake. Hold 1.6–2.0 g/kg, keep body weight flat or rising slightly while you chase the numbers, and expect the first proof to be better recovery between heavy sessions in 2–3 weeks, then a top set that finally moves.",
  },
  relatedFindings: ["deficit_while_expecting_muscle", "no_surplus_no_growth", "strength_leaking_bodyweight"],
};
