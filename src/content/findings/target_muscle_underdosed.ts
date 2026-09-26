import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "target_muscle_underdosed",
  audience: "physique",
  category: "volume",
  title: "Your muscles get too small a dose to keep growing",
  verdict:
    "The weekly work each muscle actually receives is a low dose: enough to hold most of what you have, too small to keep an experienced lifter growing.",
  summary:
    "You train, you show up, and the work is real, but by the time it is spread across every muscle in your body, each one receives only a small number of hard sets a week. The core problem is that count: too little hard work per muscle. If that work also lands on one day, or sessions get skipped, it shrinks further. Nothing about that feels like undertraining from inside the week, which is why it hides. Every month it stays this way, you pay close to the full cost of training and collect a fraction of the return.",
  mechanism: [
    "Muscle growth is dose-dependent, and the dose is counted per muscle, per week, in hard sets. Across the studies that compared low, moderate and high weekly set counts, the pattern is consistent: growth rises with the number of weekly hard sets, at least up to 10 or more per muscle. A few sets a week still build something, especially in a beginner, but the gains are small and slow, and for a lifter past the first year they flatten easily into a stall. Holding what you already have takes far less than building more, which is why a low dose can feel like it is working while nothing visibly changes.",
    "The reason this stays hidden is that a training week feels bigger than it is. An hour in the gym, several exercises, sweat and soreness all register as a lot of work. But a muscle gets nothing from sets that land on a different muscle. Divide a modest week across chest, back, shoulders, arms and legs, and each one ends up with a handful of sets. If your chest gets 8 hard sets and your rear delts get 3, both are on the low side of the dose-response curve, the rear delts badly so, even though the session felt full. The total across the body is not the dose. What each muscle receives is, and it is usually lower than it looks from inside the week.",
    "Frequency can compound the problem. When those few sets all land on one day, the later sets are done by a muscle that is already fatigued from the early ones, so the last few sets of the session do less work and cost more recovery. Spreading the same sets over two or three days means each session's sets are done fresh, at heavier loads and cleaner reps, and the muscle gets more separate growth signals across the week. Ten sets once a week and ten sets across three days are not the same stimulus, even though the spreadsheet says they are.",
    "Missed sessions, if they happen, shrink the dose further. A plan that hits each muscle once a week has no slack: skip one session and that muscle goes two weeks without a growth signal. The week on paper and the week your body receives drift apart, and the body only responds to the second one. Relying on compound lifts to cover smaller muscles has the same effect, because the compounds route only a fraction of their work through them.",
    "Put those together and the core is simple: your muscles are receiving a small dose, and if it arrives in one lump or gets skipped, smaller still. They have adapted to that dose and slowed to a crawl. Nothing is wrong with your muscles, your genetics or your effort. The prescription is too low to keep driving growth, and the fix is arithmetic before it is anything else.",
  ],
  howItShowsUp: [
    "Your sessions feel like solid work, yet over months your body has looked much the same.",
    "If you add up the hard sets a muscle gets across the whole week, the number is smaller than the training feels.",
    "When a session gets skipped, the muscles it covered usually just go without until they come round again.",
    "Smaller muscles like shoulders, arms and calves get whatever time is left at the end, or rely on the big lifts to cover them.",
    "Next to the people you train alongside, your week is on the lighter side, and you have assumed effort makes up the difference.",
    "You have a vague sense that you should do more and keep meaning to, but the plan never changes on paper.",
  ],
  fix: [
    {
      title: "Get the count up",
      steps: [
        "Pick the muscles you most want to grow. For each one, write down every exercise this week where it is the main mover, and count only sets taken within about 3 reps of failure. That is your real starting dose; most people find it is 3 to 6.",
        "Set a weekly target of 10 to 12 hard sets per muscle for the next 4 weeks. Jumping from 4 to 20 overnight gets you sore, not bigger.",
        "For each muscle, pick two exercises where it cannot be bypassed: one that loads it in a stretched position, one that lets you get close to failure safely. Two movements, not five.",
        "If the count was hard to make, that is the first fix by itself: name the exercises, assign the sets, and put them in the plan so they exist before the session starts.",
      ],
    },
    {
      title: "Split the dose across the week",
      steps: [
        "Divide the weekly sets over 2 or 3 separate days, with at least 48 hours between them. Something like 4 sets on Monday, 4 on Wednesday, 4 on Friday.",
        "Cap direct work at 6 sets per muscle per session. Past that, each extra set in the same session does less and costs more.",
        "Give each session a different rep range: one day 6 to 10 reps with heavier loads, another day 12 to 20 reps, so the muscle sees both and you can track two progressions.",
        "If you miss sessions, attach each muscle's sets to the sessions you almost never skip, and make sure no muscle depends on a single day that might not happen.",
      ],
    },
    {
      title: "Make every set count toward the dose",
      steps: [
        "Rest 2 to 3 minutes between working sets on the muscles you are building, the same rest you would give a main lift.",
        "Rotate which muscle goes first across the week so no priority muscle is always trained on leftover energy.",
        "If you have been relying on compounds to cover smaller muscles, add 2 direct sets to each of 3 sessions this week and count only those. The compound contribution is a bonus, not part of the dose.",
      ],
    },
    {
      title: "Make it progress like a main lift",
      steps: [
        "Log every working set on the muscles you are building: exercise, load, reps, and how many reps you had left.",
        "Each week, add either one rep per set or 2 to 5 percent load on one exercise per muscle. Sets that repeat identical numbers for 3 weeks are not growing sets.",
        "Take the last set of each exercise to within 1 rep of failure. The earlier sets can stop at 2 to 3 reps short.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: count the hard sets each priority muscle gets now, pick two exercises per muscle where it is the main mover, and schedule 8 to 10 sets for each across 2 days.",
    "Week 2: move to 10 to 12 sets across 2 or 3 days, log load and reps for every set, and take the last set of each exercise to within 1 rep of failure.",
    "Week 3: add a rep or a small load increase on one exercise per muscle; keep the set counts the same and check that no muscle has slipped back to a single day.",
    "Week 4: hold at 12 sets per muscle, and decide from how the sets have progressed whether next block stays at 12 or steps to 14 to 16.",
  ],
  timeline:
    "The first change you notice is a pump and soreness you have not felt for a while, usually within the first two weeks; that is a sign the dose changed, not proof of growth. Real visible change takes 8 to 12 weeks of the corrected dose, and the loads you handle usually climb before the mirror catches up. If the sets keep progressing across 8 weeks and your eating and sleep are in order, the size follows. If the sets are flat after 8 weeks, the dose is not the limiter and something else in this report is.",
  mistakes: [
    "Adding 10 more sets in the same end-of-session slot. That is the same tired dose, only longer, and you will be sore instead of bigger.",
    "Swapping to a new exercise every week hunting for the one that finally works. The muscle needs a repeated, progressing movement, not variety.",
    "Bumping a muscle to 20 or more sets from a starting point of 4. Recovery gets swamped and the quality of every set drops.",
    "Doing the extra sets as light burnout work with 30 seconds rest and calling them hard sets. Sets that stop 6 reps short do not count toward the dose.",
    "Adding the new sets as extra days you cannot keep. A dose you skip every other week is the same low dose with more guilt attached.",
    "Fixing the plan for 2 weeks, feeling nothing, and going back to the old split. Visible change takes 8 weeks minimum.",
  ],
  relatedFindings: ["lagging_part_trained_last", "sets_end_too_early", "missed_dose", "consistency_gap"],
};
