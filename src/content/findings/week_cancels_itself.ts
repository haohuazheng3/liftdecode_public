import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "week_cancels_itself",
  audience: "physique",
  category: "nutrition",
  title: "Your week averages to a diet you never chose",
  verdict:
    "Your weekends undo your weekdays, so your real intake is neither what you planned nor what your goal needs.",
  summary:
    "Monday to Friday you eat like someone with a plan. Then the weekend arrives — the meals out, the drinks, the 'I'll sort it Monday' — and two days give back everything the other five earned. You experience this as discipline with occasional slips; your body experiences it as maintenance with noise on top. That's why the physique holds where it is, why the weekday effort never seems to add up to anything, and why every Monday feels like starting from the same place — because it is.",
  mechanism: [
    "Muscle and strength are built by an energy balance that points one direction for weeks, not days. The body doesn't reset at midnight on Sunday; it integrates. Five days at a 300 kcal deficit is about 1,500 kcal in the bank. Two loose days — a dinner out, a few drinks, the late order, Sunday brunch — can easily run 1,000 kcal over each. The week nets to roughly zero. You did the hard part for five days and bought a maintenance diet you never picked.",
    "The same arithmetic runs the other way if you're trying to gain. A modest weekday surplus of a couple of hundred calories is small enough that a weekend of skipped meals, a hangover day, or a 'clean up after the blowout' Monday erases it. Realistic muscle gain past year one is a few hundred grams a month at best, and it needs a surplus that's actually there when the body lays tissue down. A surplus that exists on Tuesday and is gone by Saturday isn't a surplus.",
    "Restriction makes the rebound bigger. Weekdays where you end up eating less than you meant to — a skipped lunch, a small dinner because you were busy or trying to be good — don't bank as progress; they bank as hunger, and Saturday collects it. The same pattern stretched out is dieting on and off: three weeks of a real deficit, two weeks of 'normal', three weeks of dieting again. In the research on repeated short diets, people generally lose and regain roughly the same tissue, and the regain tends to come back slightly more as fat and slightly less as muscle than what was lost — especially when protein and training aren't held steady across the swing. You end each cycle where you started, having spent the willpower of someone who should have made progress.",
    "Alcohol on the same nights widens the swing. Eight or more drinks a week, or five in a sitting, isn't just the ethanol calories. It's the food that arrives with it, the protein you skip the next morning because you're not hungry, and the sleep that night — shorter, lighter, and less restorative, in the window when most of the week's repair happens. The same two days that cancel the food also tax the recovery, so the weekday training you did carefully has less to show for it.",
    "Stress feeds the same loop. A hard week at work is held together by structure — set meals, no time to think about food — and the weekend is where the pressure comes off and gets eaten. It feels like a reward, not a pattern. The result is that the weekday you and the weekend you each feel like the real story, and neither is: the body only ever sees the average, and an average that goes nowhere produces exactly what you're seeing — a physique that holds, week after week, however hard the weekdays are.",
  ],
  howItShowsUp: [
    "Weekday eating is tidy and predictable; from Friday night to Sunday it's restaurants, takeaways, drinks and 'I'll sort it Monday'.",
    "You're 'on a diet' Monday to Friday and off it Saturday and Sunday, and it has felt that way for months.",
    "Weekday meals get skipped or shrunk when the day gets busy, and by Saturday you're hungrier than any plan accounts for.",
    "The more stressful the week, the looser the weekend — the food feels earned, not chosen.",
    "Most of your drinking lands on the same two nights the food goes loose, and the Sunday after is a write-off for eating well and training.",
    "You feel like you're always dieting and never getting leaner, or always 'eating big' and never getting bigger.",
    "Every Monday is a fresh start with the same enthusiasm, and every Friday night is the same point where it gives.",
  ],
  fix: [
    {
      title: "Decide the direction and hold it for eight weeks",
      steps: [
        "Pick one: gaining or losing. Not 'recomp', not 'tightening up', not 'seeing how it goes'. That's the only direction for the next 56 days.",
        "Set a daily target that applies to seven days, not five. Losing: a deficit of roughly 300–500 kcal a day, aiming for 0.5–0.75% of body weight a week. Gaining: a surplus of roughly 150–300 kcal a day, aiming for 0.25–0.5 kg a month past year one, up to 1 kg a month before that.",
        "Set the finish date now. Eight weeks in one direction, then decide again. No three-week diets, no 'off weeks' until the eight are done.",
      ],
    },
    {
      title: "Make the weekend fit the same budget",
      steps: [
        "Pre-eat the weekend: before any meal out, have 30–40 g of protein and a big plate of vegetables at home. Arriving already fed usually cuts how much you eat out by a meaningful amount, often a few hundred kcal.",
        "Choose the weekend's one big meal in advance — one, not four. Everything else on Saturday and Sunday is a normal weekday meal.",
        "Cap drinks at a number you set on Thursday and count what comes with them: four drinks is roughly 500–700 kcal before the food that follows. Write that into Saturday's total.",
        "If a day goes over, don't fast or 'punish' Monday. Go back to the normal daily target; a fixed deficit the next day just sets up the next swing.",
      ],
    },
    {
      title: "Weigh, average, and let the trend decide",
      steps: [
        "Weigh every morning after the bathroom, before food, for the full eight weeks — Mondays included. That's the reading you've been avoiding, and the most informative one.",
        "Average each week and compare it to the previous week's average. Ignore single days, especially the Monday after a big weekend; that's mostly water and stored carbohydrate.",
        "Losing and two consecutive averages haven't dropped? Cut 150–200 kcal from the weekend first, not the weekdays. Gaining and two averages haven't climbed? Add 100–150 kcal on the days you tend to skip meals.",
        "Keep protein at 1.6–2.2 g per kg every day, weekends included — roughly 130–175 g at 80 kg. It's the one number that never moves with the day of the week.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: choose the direction, set the seven-day calorie and protein targets, and start weighing every morning. Plan the weekend on Thursday: one big meal, a drinks cap, protein first before anything eaten out.",
    "Week 2: hit the daily target on at least six of seven days. Compare week 2's average weight to week 1's; if the Monday spike is still there but the average has moved the right way, the week is working.",
    "Week 3: this is where the diet usually 'ends'. It doesn't. Adjust intake by 100–200 kcal only if two weekly averages point the wrong way, and take the adjustment from the weekend, not the weekdays.",
    "Week 4: review four weekly averages in a row. A line in one direction means you're halfway through the first eight-week block that has ever counted. Set weeks 5–8 to the same targets and leave them alone.",
  ],
  timeline:
    "The first two weeks will feel like nothing has changed, because the weekly average moves in half-kilo steps and the daily readings still bounce. By week four you should have four averages lined up in one direction — the first evidence the week has stopped cancelling itself. Visible change in the mirror or a clear move in the lifts typically needs the full eight weeks, and if you've been cycling for a year or more, some of what you'll see is simply your body being given one instruction long enough to follow it.",
  mistakes: [
    "Cutting the weekdays harder to 'make room' for the weekend. It widens the swing, raises Saturday's hunger, and makes the blowout bigger.",
    "Skipping Monday weigh-ins so the number stays pleasant. You lose the only signal that tells you whether the week added up.",
    "Fasting on Monday to cancel Sunday. You've moved the yo-yo from weekly to daily and lost a training day's fuel in the process.",
    "Deciding the fix is a 'proper' four-week diet. A short, hard diet followed by a return to normal is the cycle you're already in, with better branding.",
    "Blaming the program and switching it. The training was probably fine; it was being run on a maintenance diet you thought was a cut or a bulk.",
  ],
  trackNotes: {
    physique:
      "Your goal depends entirely on the direction holding: fat loss needs eight weeks of a real deficit to reveal the muscle, and muscle gain needs eight weeks of a real surplus to add any. A physique that won't change on a week that averages to maintenance isn't a plateau, it's the absence of a stimulus. Pick the direction that matches your goal — usually a slow cut if the waist is the problem, a slow gain if the frame is — make the weekend part of it, and run it in full before judging your training.",
  },
  relatedFindings: ["alcohol_tax", "fat_loss_without_deficit", "gaining_too_fast", "deficit_while_expecting_muscle"],
};
