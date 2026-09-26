import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "fat_loss_without_deficit",
  audience: "physique",
  category: "nutrition",
  title: "You want fat loss without a real deficit",
  verdict:
    "You want less fat, but your eating either isn't aimed at a deficit or lets it leak away, so the fat has no reason to leave.",
  summary:
    "You're training for a leaner body, but your food isn't set up to deliver one: either it isn't aimed at a deficit at all, or the deficit you planned leaks out through appetite, weekends and drinks before it can add up. No amount of effort in the gym closes that gap, so month after month you do the work and the mirror barely changes.",
  mechanism: [
    "Fat leaves for one reason: over weeks, you take in less energy than you use, and the body makes up the shortfall from storage. A modest daily deficit of roughly 300–500 kcal adds up to something visible over a couple of months. At maintenance the number is close to zero, however clean the food and however hard the sessions. Lifting matters enormously for what you keep while dieting, but as a fat-burning tool it is small: a hard hour of training uses about what one decent snack gives back.",
    "Eating to stay the same, or without a plan, lands at maintenance almost by default. Appetite is built to defend the weight you already carry: eat until satisfied and, across a month, intake settles within a few percent of what you burn. That is why so many people who eat 'well' look the same year after year. Food quality decides how you feel and perform; the size of the gap between intake and output decides whether fat comes off. And if the plan is to gain weight, fat loss is off the table by design.",
    "A deficit that exists on paper can still disappear in practice. Five careful weekdays at 400 kcal under maintenance bank about 2,000 kcal; two relaxed weekend days at 1,000 over erase all of it. A big appetite does the same thing in smaller pieces: a second helping, a snack at four, a few bites while cooking. Drinks do it without ever registering as food, and they tend to loosen every other decision that evening too.",
    "Protein is what makes a deficit holdable. Meals built around a solid portion of protein keep hunger quieter for the calories than almost anything else, and while you diet they are the main signal, alongside hard training, that tells your body to keep its muscle. A diet light on protein is hungrier, harder to stick to, and costs more muscle for the same fat lost, which is how people end up smaller but softer.",
    "Your training age changes the rules. In the first year, many lifters build muscle and lose some fat at the same time while eating around maintenance, because the training stimulus is so new. After that, the window narrows sharply. Past the beginner stage, fat rarely comes off without a deliberate, sustained deficit, and waiting for maintenance eating plus hard training to do it usually means waiting a very long time.",
  ],
  howItShowsUp: [
    "You want less fat, yet your eating is set to gain, to stay the same, or to nothing in particular.",
    "Your shape has barely changed in months even though the sessions have been consistent and hard.",
    "Hunger is loud, especially late in the day, and dinner or the evening quietly makes up for a careful morning.",
    "Weekdays feel disciplined; the weekend feels like a reward, and Monday starts from the same place as last Monday.",
    "Drinks on a night out never feel like part of the diet, but they are part of the week.",
    "Plenty of meals are built around carbs or convenience, with protein as an afterthought.",
    "You've trained for well over a year and are still hoping hard work alone will lean you out the way it did at the start.",
  ],
  fix: [
    {
      title: "Commit to a real diet block",
      steps: [
        "Pick a start date and run a fixed block of 8–12 weeks with fat loss as the only goal, instead of 'eating better' with no end.",
        "Set your intake about 300–500 kcal a day below maintenance. If you don't know maintenance, take your current normal day and remove one snack and one liquid calorie (juice, sugary coffee, a drink).",
        "Aim to lose roughly 0.5–1% of body weight a week. Weigh in three or four mornings a week and look only at the weekly average; if it hasn't moved in two weeks, take out another 200–300 kcal a day.",
        "Keep every session and keep the heavy work. The diet takes the fat; the training decides whether the muscle stays.",
      ],
    },
    {
      title: "Build meals that make the deficit easy",
      steps: [
        "Hold protein at roughly 1.6–2.2 g per kg of body weight, leaning toward the top of that range while dieting, split across 3–4 meals of about 30–50 g each.",
        "Start every meal with the protein and a large portion of vegetables or fruit, then add carbs and fats to fill the rest of the plate.",
        "Eat at the same 3–4 times every day. Fixed meal times give hunger a schedule instead of letting it graze all evening.",
        "Keep the one or two foods you overeat most out of the house for the whole block; decide once at the shop, not every night.",
      ],
    },
    {
      title: "Close the weekend and drink leaks",
      steps: [
        "Keep the first two meals of Saturday and Sunday identical to a weekday.",
        "Allow one planned meal out per weekend, not two open days. Order a protein-first main and skip either the starter or the dessert.",
        "Limit alcohol to one evening a week, cap it at 2–3 drinks, and eat a protein-heavy dinner before it rather than after.",
        "Sleep 7–9 hours where you can; short nights raise appetite the next day and make every decision above harder.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: set the start date, set a daily target about 300–500 kcal under maintenance, and build every meal around protein at 3–4 fixed times.",
    "Week 2: give the weekend the same shape as the week: the same first two meals, one planned meal out, drinks on one evening at most.",
    "Week 3: check the weekly average weight against week 1. If it hasn't moved, cut another 200–300 kcal a day from snacks, sauces and drinks.",
    "Week 4: keep training heavy, hold protein high, and keep the plan exactly as it is; the goal now is simply repeating a week that works.",
  ],
  timeline:
    "The first one to two weeks are noisy as water and food volume shift. By weeks three and four, a real deficit shows as a steady downward trend, and by weeks six to eight the change is visible in the mirror and in how clothes fit. Your lifts should hold roughly steady throughout; a sharp drop in strength usually means the deficit is too aggressive or protein is too low.",
  mistakes: [
    "Adding more training or cardio instead of fixing the food; appetite usually rises to match the extra work.",
    "Cutting very hard on weekdays and 'saving' the weekend, which makes the rebound bigger than the savings.",
    "Dropping protein along with calories, which makes the diet hungrier and costs muscle.",
    "Switching between gaining, maintaining and dieting every few weeks, so no phase lasts long enough to work.",
    "Staying in 'eat clean' mode indefinitely and expecting food quality alone to change your shape.",
    "Crash-dieting after a stalled month, then losing strength and quitting before week four.",
  ],
  relatedFindings: ["week_cancels_itself", "protein_unknown", "alcohol_tax"],
};
