import type { FindingContent } from "../types";

// Rewritten for the v2 rules around meal structure, not recall. The id stays "protein_unknown" so
// reports already stored under it keep this section; it is internal and never shown.
export const FINDING: FindingContent = {
  id: "protein_unknown",
  audience: "both",
  category: "nutrition",
  title: "Protein isn't built into your meals",
  verdict: "Few of your meals are built around protein, so whether you get enough is left to luck.",
  summary:
    "Most of your meals start with something other than protein, and the protein that does turn up arrives by accident: some at dinner, less at lunch, almost none when the day gets busy. You do the hard part in the gym and then leave the cheapest, most predictable variable in the whole system to chance. Every week that stays true, the sets you work for build less than they could.",
  mechanism: [
    "The session is only the signal. What turns it into muscle happens over the next day or two, and only if the building blocks are there. The research here is unusually consistent: across trials that compared trained people at different intakes, gains in muscle and strength kept improving as protein rose to a clear daily range (the numbers are in the fix below), then flattened, with little extra benefit beyond it. Under that range the same sets produce less. Not nothing, just reliably less, which is exactly what a slow stall looks like.",
    "Whether you reach that range is decided at the level of the plate, not the day. Almost everyone who trains believes they eat plenty of protein, and when protein is a side dish the day usually lands far lower than it feels: eggs at breakfast, a sandwich at lunch, a decent dinner, and a total most lifters would need to nearly double. When each meal starts with the protein and everything else is built around it, the day adds up without anyone counting. When each meal starts with whatever is convenient, it doesn't.",
    "Protein also doesn't average well across days, which is why 'some days plenty, some days a sandwich' is not the same as 'enough on average'. The muscle-building response to a meal peaks and fades within hours, and the body has no useful way to bank Tuesday's surplus against Thursday's shortfall. Three or four meals with a real portion each deliver more full signals than one big dinner and two light meals with the same total.",
    "The meals that shrink take their protein with them. When a day gets busy or you end up eating less than planned, the part of the meal that disappears is usually the part that needed cooking, and that is usually the protein. On a diet this matters even more: in studies that put people in a deficit at higher versus lower protein, the higher-protein groups kept more muscle and more strength on the same calories.",
    "Without a structure, nothing in your week corrects a low day. Appetite is a poor guide to protein specifically: it is the most filling part of a meal and the easiest to skip when you are busy, tired or eating out. So the default drifts low, the drift is invisible, and training keeps taking the blame for a stall that food is causing.",
  ],
  howItShowsUp: [
    "Breakfast and lunch are mostly carbohydrate with a bit of something on the side; protein turns up properly at dinner.",
    "Some days are steak and eggs, others are coffee, a sandwich and whatever is around after training.",
    "On busy days the first thing to go is the meal that took effort to prepare, and that is usually the one with the protein.",
    "Snacks are bars, fruit or crisps rather than yoghurt, milk or leftovers.",
    "When training stalls you change the program, never the plate, because the food 'seems fine'.",
    "There is no real plan behind what you eat, so nothing notices when a whole day goes by with protein only at dinner.",
  ],
  fix: [
    {
      title: "Build every meal around a protein anchor",
      steps: [
        "Before anything else goes on the plate, pick the protein: a palm-sized piece of meat or fish, eggs with yoghurt, a tub of cottage cheese or Greek yoghurt, tofu or tempeh, or a shake. Everything else is built around it.",
        "Aim for three or four anchored meals a day. For most people each anchor is 30–45 g of protein, which lands the day in the range that supports growth: roughly 1.6–2.2 g per kg of body weight.",
        "Fix breakfast first, because that is where most low days start. Add 25–30 g to whatever you already eat: eggs plus yoghurt, a shake with the coffee, or last night's leftovers.",
      ],
    },
    {
      title: "Protect the meals that shrink",
      steps: [
        "Keep one rescue option you can have in five minutes without cooking, at home and at work: a shake, a tin of fish, cottage cheese or pre-cooked chicken.",
        "When a meal has to be small, keep the protein and cut something else.",
        "Buy the week's anchors in one shop, so the protein is already in the fridge on the day you have no time.",
      ],
    },
    {
      title: "Check it once, then stop needing to",
      steps: [
        "On three ordinary days, name the protein anchor of each meal. Any meal without an answer is the gap to fix first.",
        "If you are deliberately dieting, lean towards the top of the range, around 2.0–2.2 g/kg; that is what protects muscle while the weight comes down.",
        "Once every meal has had an anchor for two weeks running, stop checking. The structure does the counting.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: give every meal a protein anchor, starting with breakfast, and stock one rescue option at home and one at work. Change nothing in training.",
    "Week 2: on three ordinary days, name the anchor of each meal. Any meal without one gets fixed before anything else.",
    "Week 3: when a meal has to shrink, keep the protein and cut something else. Aim for no day with fewer than three anchored meals.",
    "Week 4: compare working-set reps and how you recover between sessions with week 1. Keep the structure; stop checking once every meal has had an anchor for two weeks.",
  ],
  timeline:
    "The first change is felt rather than seen: within one to two weeks, sessions recover a little better and hunger is steadier. Reps at the same weights usually start climbing in weeks three to six, and the difference in the mirror takes eight to twelve weeks. On a diet, the win is what you keep: strength that holds while the weight comes down.",
  mistakes: [
    "Buying a protein powder and changing nothing else. One scoop covers part of one meal; the gap is usually a whole meal's worth or more.",
    "Loading everything into dinner. One huge protein meal and two empty ones works poorly next to three or four decent ones.",
    "Cutting carbohydrate to make room for protein. Protein goes on top of the fuel you train on, not in place of it.",
    "Chasing very high intakes because more must be better. Past the top of the range the evidence shows no extra muscle, and the extra food crowds out the carbohydrate you train on.",
    "Going straight to tracking every macro, drowning by day four and quitting the whole thing. Anchor the meals first; count only if you need to.",
  ],
  trackNotes: {
    physique:
      "Protein sets the ceiling on what each hard set can build, so lean towards the upper half of the range in the fix, especially if you are lean, dieting, or trying to lose fat and build muscle at once. Expect the first sign to be better recovery between sessions, then reps at the same weights that keep climbing over six to eight weeks.",
    strength:
      "A heavy lift survives low protein longer than a physique does, which is why this hides as a plateau instead of a decline. Hold the lower-to-middle part of the range in the fix, eat enough that you aren't slowly shrinking, and expect the first proof to be better recovery between heavy sessions within a few weeks, then a top set that finally moves.",
  },
  relatedFindings: ["no_surplus_no_growth", "fat_loss_without_deficit", "strength_leaking_bodyweight"],
};
