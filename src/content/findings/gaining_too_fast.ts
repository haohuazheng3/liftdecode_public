import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "gaining_too_fast",
  audience: "physique",
  category: "nutrition",
  title: "You're gaining, but not much of it is muscle",
  verdict:
    "Your weight is climbing faster than muscle can be built, and the extra is fat that's hiding the shape you're training for.",
  summary:
    "The scale says you're winning: more than 2 kg in eight weeks. The mirror disagrees, and the mirror is right. At your stage, the body can turn only a small slice of that gain into muscle; the rest goes on as fat, softens the lines you're chasing, and gets more expensive to remove the longer it stays. Every month this continues, the eventual cut gets longer and the muscle you actually built gets harder to see.",
  mechanism: [
    "Muscle is built at a rate, not on demand. In the first year of serious training, a lean adult might add somewhere around 0.5–1 kg of muscle a month with everything done right. After three or more years the realistic ceiling drops to a small fraction of that — a few kilograms a year on a good year, often less. There is no amount of food that pushes the rate above what the tissue can lay down. Once the surplus covers what muscle-building needs, every calorie on top has one place to go, and it isn't muscle.",
    "That's why the 8-week trend is the number that matters more than the plan you thought you were following. More than 2 kg in two months is a surplus of roughly 300–500 kcal a day above what you burn, sometimes more. For someone past the beginner window, the muscle share of that gain is likely under a quarter. In the studies that compared a small surplus with a large one in trained lifters, the large surplus added more body weight and more fat, but not meaningfully more muscle. You pay the full fat cost for a gain rate you don't get to use.",
    "A 'small planned surplus' that produces 2 kg or more in 8 weeks is not small. The label was set by intention; the outcome was set by appetite, restaurant portions and the extra snacks that never made it into the count. Most people underestimate intake by a significant margin, and the miss grows when the plan is loose. 'No plan' is the honest version of the same thing: you eat to hunger, hunger goes up when training goes up, and the scale keeps a record of the difference.",
    "Protein makes the ratio worse when it's low or unknown. The surplus that builds muscle needs roughly 1.6–2.2 g of protein per kg of body weight a day; when you can't name yesterday's number, or it varies from plenty to a coffee and a sandwich, the extra calories are mostly carbohydrate and fat. Those raise energy, not building material. So you're gaining on a diet that's high in what fat stores and short on what muscle uses.",
    "The cost lands on your actual goal. If you wanted to recomp, stay lean or lose fat while keeping muscle, you're moving the opposite direction on the axis that matters. Fat gained now has to be lost later, and a longer cut costs training quality, some strength, and often a little of the muscle you built. The shape you're after shows up when the muscle is there and the fat isn't; right now you're adding the second faster than the first.",
  ],
  howItShowsUp: [
    "Your weekly-average morning weight is up more than 2 kg in the last eight weeks, and it wasn't a one-week jump.",
    "Clothes fit tighter at the waist before they fit tighter at the arms or shoulders.",
    "You called it a 'small surplus' or had no plan at all, and you couldn't say what a normal day adds up to.",
    "Asked how much protein you ate yesterday, the honest answer was a guess, a shrug, or 'depends on the day'.",
    "You've trained for three years or more, and this gain is far faster than anything you've seen turn into visible muscle before.",
    "Your goal was to look leaner, recomp or stay lean year-round — and you feel less lean than you did two months ago.",
    "Lifts may have crept up a little, but the mirror and photos look softer, not bigger.",
    "You've started planning a 'quick cut' to undo the last two months, which is a sign the surplus was never doing its job.",
  ],
  fix: [
    {
      title: "Slow the gain to a rate muscle can use",
      steps: [
        "Cut daily intake by 250–300 kcal from wherever it currently sits. If you don't track, remove the two most obvious extras (the second helping, the evening snack, the liquid calories) and hold that for a week.",
        "Set the target: for 3+ years of training, 0.25–0.5 kg of gain per month; for under three years, up to about 1 kg. Weigh every morning, average each week, and compare week to week.",
        "If the weekly average climbs more than 0.25 kg for two weeks in a row, take another 150–200 kcal off. If it's flat for three weeks, add 100–150 kcal back. Adjust by the trend, never by one reading.",
        "If your goal is recomp, staying lean or losing fat while keeping muscle, aim for flat to slightly down (0–0.5 kg loss per month) instead — the surplus was never what that goal needed.",
      ],
    },
    {
      title: "Move the surplus into protein",
      steps: [
        "Set a protein target of 1.6–2.2 g per kg of body weight per day — 130–175 g at 80 kg. Split it over 3–4 meals with 30–50 g in each.",
        "Anchor each meal to a known protein source first (chicken, fish, lean beef, eggs, Greek yoghurt, tofu, whey) and build the rest around it, so the number hits without extra fat and carbs riding along.",
        "Count protein only — not everything — for 14 days. Two weeks is enough to learn what 40 g looks like on a plate; after that you can estimate within about 20 g.",
        "Keep the calories you cut from fat and refined carbohydrate sources, not from protein. The goal is a smaller surplus that's a larger share protein.",
      ],
    },
    {
      title: "Check whether the gain is working at all",
      steps: [
        "Measure your waist at the navel once a week, same morning conditions. If weight is going up and the waist is going up 1 cm or more a month, the gain is mostly fat.",
        "Take photos every 4 weeks in the same light and pose. Compare to eight weeks ago, not last week; if the shoulders and arms don't look fuller while the waist does, the surplus isn't building what you paid for.",
        "Log your top sets on 2–3 key lifts. A surplus that's building muscle should show reps or load creeping up; a fat gain with flat lifts is just extra weight to carry.",
        "Decide a stop point now: if body fat has visibly risen after 8 more weeks, end the surplus and run a 6–10 week slow cut at 0.5% of body weight a week rather than letting it drift.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: start weighing every morning and averaging the week. Cut 250–300 kcal of obvious extras, set the protein target at 1.6–2.2 g/kg and start counting protein only. Take baseline photos and a waist measurement.",
    "Week 2: hold the same intake. Confirm you're hitting protein on at least 5 of 7 days. Compare the week's average weight to week 1: the goal is a climb of under 0.25 kg, not a drop.",
    "Week 3: adjust by trend. Still climbing more than 0.25 kg a week — take another 150–200 kcal off. Flat or slightly down and lifts are holding — you've found the line; stay there.",
    "Week 4: re-measure waist, retake photos, review the top sets. Set the next eight weeks' plan by the numbers: a slow gain if the goal is more muscle, flat or a slight loss if the goal is to look leaner.",
  ],
  timeline:
    "The scale will slow within the first two weeks; expect a small drop of water and food weight as intake tightens, then a flat or slow-climbing trend. Waist and photos need 4–8 weeks to show a clear change. Muscle keeps building at its own pace — a slower gain doesn't build less muscle, it just stops building fat around it — so the visible payoff is a body that looks harder at the same or lower weight over 8–12 weeks.",
  mistakes: [
    "Slamming into a hard cut to fix two months of drift. A 1,000-kcal deficit strips training quality and some muscle; a 250–500 kcal reduction does the job.",
    "Adding cardio while keeping the same intake — it partly offsets the surplus but doesn't fix the ratio, and appetite usually rises to match.",
    "Switching to 'clean' foods without changing the amount. Clean surplus is still surplus.",
    "Cutting protein along with everything else, so the smaller surplus builds even less muscle than the big one did.",
    "Trusting the plan over the trend: keeping the same food because it was 'supposed to be' a small surplus.",
    "Reading the extra weight as muscle because lifts went up a little. Body weight itself makes most lifts easier; that's not the same as new tissue.",
  ],
  relatedFindings: ["protein_unknown", "bad_comparison", "recomp_window_closed"],
};
