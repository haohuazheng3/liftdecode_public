import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "recomp_window_closed",
  audience: "physique",
  category: "nutrition",
  title: "Recomp was a beginner's privilege",
  verdict:
    "Losing fat and gaining muscle at the same time worked early on, and at your stage it has stalled both goals.",
  summary:
    "You want to lose fat and build muscle at once, and your eating has no direction beyond staying the same. That deal was real in your first year or two; at your training age it has mostly expired, and what's left is a body asked to do two opposite jobs on a budget that funds neither. Every month you keep waiting for the recomp to arrive is a month of hard training with maintenance-level results.",
  mechanism: [
    "Recomposition is real, but it runs on a resource that shrinks every year you train: the gap between what your muscles can do and what they've been asked to do. A beginner has a huge gap, so almost any stimulus plus adequate protein builds tissue, and the body will happily fund that construction from stored fat. In the studies where untrained or lightly trained people gained muscle and lost fat at the same time, that is what was happening. The effect is largest in year one and fades fast; the research on trained lifters is thinner, and shows it still happens, but slowly and with small gains.",
    "By the time you've trained with intent for three years or more, most of that gap is spent. What's left is slow, expensive growth: a realistic ceiling for a trained natural lifter is somewhere around 0.5–1 kg of muscle in a good year, sometimes less, and it only shows up when the stimulus is strong and the energy is there to build with. At a flat body weight the only building material is stored fat, and for a trained lifter the growth it can fund is small and slow: possible, but usually too slow to see or feel. Your body is being asked to pay for new tissue out of a budget that's balanced to the gram.",
    "Here's the part that stings: your lifts creeping up is not evidence that the recomp is working. Trained lifters can add reps and a little load for months on neural efficiency, better technique and slightly more practice, all without adding meaningful tissue. A steady body weight paired with slowly rising lifts is the classic signature of a body that has the stimulus but not the material. It will happily get a little more skilled while staying exactly the same size.",
    "Eating to stay the same, or eating with no real plan, feels neutral but isn't. Without a direction, intake drifts to wherever appetite and habit put it, which for most lifters is at or just under maintenance, and eating \"clean\" pushes it there faster because cleaner food is more filling per calorie. That's fine for staying lean. It is not a plan for growing, and it is not a plan for losing fat either; it's a plan for staying where you are.",
    "The cost isn't just the missing muscle. Sitting at maintenance while wanting growth means the hard sessions never get converted; the fatigue is real, the adaptation is capped. And because nothing dramatic ever happens, there is no signal telling you that anything is wrong, so the same setup can quietly run for years. The fix is to stop asking one body weight to do two opposite jobs and give it one job at a time.",
  ],
  howItShowsUp: [
    "You want to lose fat and build muscle at the same time, you're eating to stay the same or without a plan, and you've been training seriously for a while.",
    "You're well past your first year of training, and \"both at once\" is still the plan.",
    "Your lifts inch up a rep or two at a time, but you don't look any different for it.",
    "You've never run a dedicated gaining phase because you didn't want to \"get fat\", and you've never run a dedicated cut because you didn't want to \"lose muscle\".",
    "You can name the foods you avoid more easily than say whether protein anchors most of your meals.",
    "Your eating hasn't had a clear direction, gaining or losing, since you stopped being a beginner.",
  ],
  fix: [
    {
      title: "Choose one direction for the next 12–16 weeks",
      steps: [
        "Decide with a number, not a feeling. If you can see your top two abs in flat morning light, you're lean enough to gain: run a surplus. If you can't, and you've got a visible layer to lose, cut first — a lean body responds better to the surplus that follows.",
        "Write the decision and the end date on the first page of your log. The phase ends on a date or at a body-weight target, not when you get nervous about the mirror.",
        "Commit to holding it for at least 12 weeks. Trained bodies change slowly; anything shorter is another round of recomp with extra steps.",
      ],
    },
    {
      title: "If you're gaining: run a small, measured surplus",
      steps: [
        "Establish your baseline first: eat as you do now for one week and average seven morning weigh-ins. That average is your starting number.",
        "Add roughly 200–300 kcal per day above that, mostly from carbohydrate around training. Target a gain of about 0.25–0.5% of body weight per week — for an 80 kg lifter, roughly 0.2–0.4 kg a week, or roughly 1.5–3 kg over eight weeks.",
        "Hold protein at 1.6–2.2 g per kg of body weight per day, split over three or four meals; at 80 kg that's 130–175 g. It's the one number you should be able to state to within 20 g.",
        "Weigh every morning, compare weekly averages only. If two consecutive weekly averages are flat, add another 100–150 kcal. If you're gaining faster than 0.5% a week, trim 100–150.",
        "Keep the training exactly as hard as it is now for the first four weeks; the surplus is the variable you're testing. Then add volume only where lifts respond.",
      ],
    },
    {
      title: "If you're cutting first: make it short and deliberate",
      steps: [
        "Set a deficit of about 300–500 kcal a day, aiming to lose 0.5–0.75% of body weight per week. Faster than 1% a week and strength starts leaking; slower than 0.25% and you're recomping again.",
        "Push protein to the top of the range, 2.0–2.2 g per kg, and keep it there for the whole cut.",
        "Keep every heavy working set in the program; cut assistance volume by a third if recovery slips, not the main lifts. The job of training in a cut is to give the muscle a reason to stay.",
        "Set a stop point before you start: a body-weight target, a date 8–12 weeks out, or the first week your top sets drop two sessions running. Then move to maintenance for two weeks and start the surplus.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: change only the measurement: weigh each morning and log protein in grams for seven days. By Sunday, pick gain or cut with the ab-visibility test and write down the end date.",
    "Week 2: apply the direction. Gaining: add 200–300 kcal a day, mostly carbs around training, protein locked at 1.6–2.2 g/kg. Cutting: drop 300–500 kcal, protein at 2.0–2.2 g/kg. Training stays exactly as is.",
    "Week 3: compare this week's average weight with week 1. Gaining and flat: add 100–150 kcal. Cutting and flat: remove 100–150. Moving in the right direction at the right speed: touch nothing.",
    "Week 4: compare the weekly average with week 1 and re-test one benchmark set on your priority lift. Judge the trend, not the day, and keep going; the phase is only a quarter done.",
  ],
  timeline:
    "The scale responds within two to three weeks; that's the calibration signal, not the result. Strength on a surplus usually picks up noticeably by weeks four to six, as the extra energy shows up in rep quality and the bar starts moving again. Visible tissue change for a trained lifter is a 12–16 week story, and tape measurements will catch it before the mirror does. Expect to finish the phase a little fatter than you'd like or a little smaller than you'd like; that discomfort is what the recomp approach was protecting you from, and it's also what was keeping you the same.",
  mistakes: [
    "Adding a few hundred calories of \"clean\" food, watching the scale for a week, seeing no movement and pulling the food back because it \"didn't work\". Weekly averages, not single readings, and at least three weeks before judging.",
    "Choosing a surplus but capping it out of fear: eating a bit more on training days and less on rest days, so the week nets out at maintenance and the recomp continues under a new name.",
    "Cutting and gaining on alternating fortnights. Every switch resets the adaptation; a 12-week block done once beats six 2-week blocks done in a loop.",
    "Treating the mirror as the phase's stopping rule. Two weeks into a surplus you'll look softer; that's water, glycogen and a full gut, and quitting there is how most gaining phases die.",
    "Piling on more training volume to \"force\" the recomp. The stimulus isn't the missing piece; adding fatigue to a body with no material to build from just deepens the hole.",
    "Waiting for a perfect month to start. The surplus is small enough to run through ordinary life, and the scale will tell you within three weeks whether it's real.",
  ],
  relatedFindings: ["no_surplus_no_growth", "protein_unknown", "expecting_year_one_speed"],
};
