import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "recomp_window_closed",
  audience: "physique",
  category: "nutrition",
  title: "Recomp was a beginner's privilege",
  verdict:
    "You're trying to lose fat and build muscle at the same body weight, years after the point where that reliably works for a trained body.",
  summary:
    "You eat clean, train hard, and expect the scale to hold still while the body underneath it quietly swaps fat for muscle. That deal was real in your first year or two; with your training age it has mostly expired, and what you've got instead is a flat weight, lifts that creep, and a mirror that doesn't move. Every month you keep waiting for the recomp to arrive is a month of maintenance-level training with maintenance-level results.",
  mechanism: [
    "Recomposition is real, but it runs on a resource that shrinks every year you train: the gap between what your muscles can do and what they've been asked to do. A beginner has a huge gap, so almost any stimulus plus adequate protein builds tissue, and the body will happily fund that construction from stored fat. In the studies where untrained or lightly trained people gained muscle and lost fat at the same time, that is what was happening. The effect is largest in year one and fades fast; the research on trained lifters is thinner and far less flattering.",
    "By the time you've trained with intent for three years or more, most of that gap is spent. What's left is slow, expensive growth: a realistic ceiling for a trained natural lifter is somewhere around 0.5–1 kg of muscle in a good year, sometimes less, and it only shows up when the stimulus is strong and the energy is there to build with. At a flat body weight the energy is, by definition, not there. Your body is being asked to pay for new tissue out of a budget that's balanced to the gram.",
    "Here's the part that stings: your lifts creeping up is not evidence that the recomp is working. Trained lifters can add reps and a little load for months on neural efficiency, better technique and slightly more practice, all without adding meaningful tissue. A flat eight-week weight trend paired with slowly rising lifts is the classic signature of a body that has the stimulus but not the material. It will happily get a little more skilled while staying exactly the same size.",
    "\"Eat clean\" makes this worse, not better, because clean is a description of food quality, not of energy balance. Cleaner food tends to be more filling per calorie, so people who switch to it usually land at or just under maintenance without deciding to. That's fine for staying lean. It is not a plan for growing, and it is not a plan for losing fat either; it's a plan for staying where you are, which is exactly what the last four to twelve months have delivered.",
    "The cost isn't just the missing muscle. Sitting at maintenance while wanting growth means the hard sessions never get converted; the fatigue is real, the adaptation is capped. And because the scale never moves, there is no signal telling you that anything is wrong, so the same setup can quietly run for years. The fix is to stop asking one body weight to do two opposite jobs and give it one job at a time.",
  ],
  howItShowsUp: [
    "You picked \"eat clean and hope to lean out and grow at the same time\", and you've been training seriously for three years or more.",
    "Your goal is to add muscle and lose fat at roughly the same body weight, and you've been chasing it for the better part of a year or longer.",
    "Your morning weight, averaged weekly, has been flat within about half a kilo for eight weeks — and it was flat the eight weeks before that.",
    "Your lifts for the muscle you most want to change are up a rep or two, or a few percent, but photos taken the same way look like the same person.",
    "You've never run a dedicated gaining phase because you didn't want to \"get fat\", and you've never run a dedicated cut because you didn't want to \"lose muscle\".",
    "You can name the foods you avoid far more easily than the number of calories or grams of protein you eat on an ordinary day.",
    "Your last clear, measurable change is four months to over a year behind you, and the plan hasn't changed since.",
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
        "Add roughly 200–300 kcal per day above that, mostly from carbohydrate around training. Target a gain of about 0.25–0.5% of body weight per week — for an 80 kg lifter, roughly 0.2–0.4 kg a week, or 1–2 kg over eight weeks.",
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
    "Week 1: change nothing but the measurement. Weigh every morning after the bathroom, log the weekly average, and log protein in grams for seven days. Decide gain or cut by Sunday using the ab-visibility test and write the phase end date in your log.",
    "Week 2: apply the direction. Gaining: add 200–300 kcal a day, mostly carbs around training, protein locked at 1.6–2.2 g/kg. Cutting: drop 300–500 kcal, protein at 2.0–2.2 g/kg. Training stays exactly as is.",
    "Week 3: compare this week's average weight with week 1. Gaining and flat: add 100–150 kcal. Cutting and flat: remove 100–150. Moving in the right direction at the right speed: touch nothing.",
    "Week 4: take photos and tape measurements in the same light and place as week 1, and re-test one benchmark set on the lift for your priority muscle. Check the trend line, not the day. Then keep going; the phase is only a quarter done.",
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
