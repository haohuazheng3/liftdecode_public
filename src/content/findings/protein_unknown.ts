import type { FindingContent } from "../types";

// Rewritten for the v2 rules around meal structure, not recall. The id stays "protein_unknown" so
// reports already stored under it keep this section; it is internal and never shown.
export const FINDING: FindingContent = {
  id: "protein_unknown",
  audience: "both",
  category: "nutrition",
  title: "You don't know how much protein you get",
  verdict: "Your daily protein is untracked, so you cannot tell whether it is enough to support progress.",
  summary:
    "You do not have a clear daily protein number, which makes a meaningful shortfall easy to miss. Protein could be adequate on some days and low on others, but without a rough count or a reliable structure, there is no way to see the pattern. Your training can be consistent while this basic input remains a guess. If the guess is low most days, your hard sets have fewer building blocks to work with, and progress can stay slower than the effort you put in.",
  mechanism: [
    "The session is only the signal. What turns it into muscle happens over the next day or two, and only if the building blocks are there. The research here is fairly consistent: across trials of people lifting at different intakes, gains in muscle and strength kept improving as protein rose to a daily range (the numbers are in the fix below), then tended to flatten, with little extra benefit beyond it. Under that range the same sets tend to produce less. Not nothing, just less, which is exactly what a slow stall looks like.",
    "Without a daily number, it is easy to confuse a few protein-rich meals with a consistently adequate intake. The protein meta-analyses show a useful pattern across daily totals: for most lifters, gains are supported around 1.6 grams per kilogram of body weight, with a practical range up to roughly 2.2 grams per kilogram. A day with a large dinner can still fall short, while a day with several modest sources may reach the target. Your impression of the portions is not a reliable total; a brief check across ordinary days reveals whether the gap is real and where it appears.",
    "Protein also doesn't average well across days, which is why 'some days plenty, some days a sandwich' is not the same as 'enough on average'. The muscle-building response to a typical meal peaks and fades within hours, and the body has no useful way to bank Tuesday's surplus against Thursday's shortfall. Three or four meals with a real portion each deliver more full signals than one big dinner and two light meals with the same total.",
    "The meals that shrink take their protein with them. When a day gets busy or you end up eating less than planned, the part of the meal that disappears is usually the part that needed cooking, and that is usually the protein. On a diet this matters even more: in studies that put people in a deficit at higher versus lower protein, the higher-protein groups kept more muscle on the same calories.",
    "When the amount is unknown, a low day can pass without any cue to make up the difference later in the week. Appetite is a poor guide to protein specifically: hunger can be satisfied while the day's total is still modest, and busy or irregular eating can make portions hard to remember. A small amount of structure makes the pattern visible before you overhaul the diet. Check three ordinary days, estimate the total from labels or familiar portions, then choose one repeatable change only if the average is below your target. That keeps the fix tied to a measured gap rather than guesswork.",
  ],
  howItShowsUp: [
    "You cannot give a rough daily protein total without checking labels or estimating portions.",
    "Some days seem protein-rich and others less so, but you do not know whether the weekly pattern reaches a useful range.",
    "A large dinner can make the day feel covered, even when breakfast or lunch may have contributed little.",
    "Busy or irregular days make it harder to remember what you ate or estimate the portions afterward.",
    "When training stalls, food feels difficult to assess because there is no simple protein number to compare week to week.",
    "You have no repeatable way to notice when a day falls short or to correct it the next day.",
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
        "If you are deliberately dieting, go to the top of the range or a little above it, around 2.2–2.4 g/kg; higher intakes help protect muscle while the weight comes down.",
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
    "Loading everything into dinner. One huge protein meal and two empty ones works less well than three or four decent ones.",
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
