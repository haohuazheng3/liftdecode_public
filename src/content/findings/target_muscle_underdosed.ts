import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "target_muscle_underdosed",
  audience: "physique",
  category: "volume",
  title: "Your target muscle gets a maintenance dose",
  verdict:
    "The muscle you most want to change gets fewer hard sets per week than it needs to grow. You are maintaining it with real precision, and calling that a plateau.",
  summary:
    "You have a muscle you want to see change, and you have been giving it a dose that keeps it exactly where it is: too few hard sets, too few days, usually at the end of a session when the good energy is already spent. The rest of your body is doing fine on that budget, which is why the problem hides. Every month you leave this as it is, the gap between that muscle and everything around it gets a little more obvious in the mirror.",
  mechanism: [
    "Muscle growth is dose-dependent, and the dose is counted per muscle, per week, in hard sets. Across the studies that compared low, moderate and high weekly set counts, the pattern is consistent: more hard sets produce more growth up to a point, and the point at which a trained lifter starts seeing real change sits somewhere around 10 sets a week. Under that, you are in the range that keeps what you have. That is what a maintenance dose does, and it is what you have been running on the one muscle you care about most.",
    "The reason this stays hidden is that your total volume looks respectable. You train hard, and the muscles that get the first lift of every session keep ticking along. But a muscle gets nothing from sets that land on a different muscle. If your chest gets 16 hard sets and your rear delts get 4, your chest grows and your rear delts hold. The average across the body is meaningless. The count on the specific muscle is the only number that matters, and you told us that number is low or that you could not produce it at all.",
    "Frequency compounds the problem. When those few sets all land on one day, the later sets are done by a muscle that is already fatigued from the early ones, so the last few sets of the session do less work and cost more recovery. Spreading the same sets over two or three days means each session's sets are done fresh, at heavier loads and cleaner reps, and the muscle gets more separate growth signals across the week. Ten sets once a week and ten sets across three days are not the same stimulus, even though the spreadsheet says they are.",
    "Then there is where the muscle sits in the session. A lagging part trained after the big lifts gets your worst energy, your lowest bar speed and your shortest attention. The sets still get done, but they are done at a lower quality, further from true failure, with less load than the muscle could handle fresh. Growth comes mostly from the reps within about 0 to 3 of failure, and tired, distracted sets rarely get there. If you told us you do not train it directly at all, the compounds are giving it whatever fraction of the work they happen to route through it, which for most lagging parts is not enough to count.",
    "Put those together and you have a muscle receiving a small dose, delivered in one lump, at the end of the day, or not delivered at all. It has adapted to precisely that and stopped. Nothing is wrong with the muscle, your genetics or your effort. The prescription is under the floor, and the fix is arithmetic before it is anything else.",
  ],
  howItShowsUp: [
    "When you actually count the working sets on the muscle you want most, you get a number under 10, or you cannot get a number at all.",
    "Everything else on your body has kept growing or at least kept up, but this one part has looked the same for months.",
    "The muscle gets all of its direct work on a single day, or on whatever day happens to have room left.",
    "It is trained at the end of a session, after squats, bench or rows have already taken the sharpest energy.",
    "You have assumed compound lifts cover it, and never scheduled a movement where it is the main mover.",
    "You have a vague sense that you should do more for it and keep meaning to, but the plan never changes on paper.",
    "Bringing up this specific part is your stated goal, yet it is the part with the least planned attention in your week.",
  ],
  fix: [
    {
      title: "Get the count to the floor",
      steps: [
        "Write down every exercise this week where the target muscle is the main mover. Count only sets taken within about 3 reps of failure. This is your real starting number; most people find it is 3 to 6.",
        "Set a weekly target of 10 to 12 hard sets for the next 4 weeks. Jumping from 4 to 20 overnight gets you sore, not bigger.",
        "Pick two exercises where the muscle cannot be bypassed: one that loads it in a stretched position, one that lets you get close to failure safely. Two movements, not five.",
        "If you could not count your sets, that is the first fix by itself: name the exercises, assign the sets, and put them in the plan so they exist before the session starts.",
      ],
    },
    {
      title: "Split the dose across the week",
      steps: [
        "Divide the weekly sets over 2 or 3 separate days, with at least 48 hours between them. Something like 4 sets on Monday, 4 on Wednesday, 4 on Friday.",
        "Cap direct work at 6 sets per session for this muscle. Past that, each extra set in the same session does less and costs more.",
        "Give each session a different rep range: one day 6 to 10 reps with heavier loads, another day 12 to 20 reps, so the muscle sees both and you can track two progressions.",
        "If your week is irregular, attach the sets to sessions you never miss rather than to a day that might not happen.",
      ],
    },
    {
      title: "Move it to the front",
      steps: [
        "On at least one of those days, the target muscle goes first, before any compound lift, while you are fresh. Accept that the big lift that day will be slightly weaker. That trade is the point.",
        "Rest 2 to 3 minutes between its working sets, the same rest you would give a main lift.",
        "On the other days, train it second, immediately after one main lift and before any accessory work. Never last.",
        "If you have been relying on compounds to cover it, add 2 direct sets to each of 3 sessions this week and count only those. The compound contribution is a bonus, not part of the dose.",
      ],
    },
    {
      title: "Make it progress like a main lift",
      steps: [
        "Log every working set on this muscle: exercise, load, reps, and how many reps you had left. Treat these entries exactly as you treat your bench numbers.",
        "Each week, add either one rep per set or 2 to 5 percent load on one of its exercises. Sets that repeat identical numbers for 3 weeks are not growing sets.",
        "Take the last set of each exercise to within 1 rep of failure. The earlier sets can stop at 2 to 3 reps short.",
        "Take a progress photo of that part in the same light and pose every 4 weeks, and check the tape measurement at the same point on the limb. That is your scoreboard.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: count your current hard sets on the target muscle, pick two exercises where it is the main mover, and schedule 8 to 10 sets across 2 days with it first in at least one session.",
    "Week 2: move to 10 to 12 sets across 2 or 3 days, log load and reps for every set, and take the last set of each exercise to within 1 rep of failure.",
    "Week 3: add a rep or a small load increase on one exercise; keep the set count the same and confirm the muscle is being trained fresh, not last.",
    "Week 4: hold at 12 sets, take your photo and tape check, and decide from the log whether next block stays at 12 or steps to 14 to 16.",
  ],
  timeline:
    "The first change you notice is a pump and soreness in that muscle you have not felt for a while, usually within the first two weeks; that is a sign the dose changed, not proof of growth. Real visible change in a single muscle group takes 8 to 12 weeks of the corrected dose, and it often shows in the tape and the logbook before it shows in the mirror. If the sets keep progressing across 8 weeks and your bodyweight and protein are in order, the size follows. If the numbers are flat after 8 weeks, the dose is not the limiter and something else in this report is.",
  mistakes: [
    "Adding 10 more sets in the same end-of-session slot. That is the same tired dose, only longer, and you will be sore instead of bigger.",
    "Swapping to a new exercise every week hunting for the one that finally works. The muscle needs a repeated, progressing movement, not variety.",
    "Bumping the muscle's volume to 20 or more sets from a starting point of 4. Recovery gets swamped and the quality of every set drops.",
    "Doing the extra sets as light burnout work with 30 seconds rest and calling them hard sets. Sets that stop 6 reps short do not count toward the dose.",
    "Adding total-body volume across every muscle because 'more volume' sounded like the answer. The other muscles were fine; only this one was starved.",
    "Fixing the plan for 2 weeks, feeling nothing, and going back to the old split. The lag on a single muscle is 8 weeks minimum.",
  ],
  relatedFindings: ["lagging_part_trained_last", "sets_end_too_early", "no_forcing_function"],
};
