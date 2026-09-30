import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "target_muscle_underdosed",
  audience: "physique",
  category: "volume",
  title: "Your slowest muscle gets the smallest dose",
  verdict:
    "Your slowest-growing area gets too little focused weekly training to keep building at a useful pace.",
  summary:
    "Your slowest area gets one brief chance to grow in a week, or none at all, while the rest of your training competes for the same limited hours. A week can feel busy and still leave that muscle with too few hard sets to change. When it is trained only once, a missed day can erase the whole week's stimulus, and piling more work into one session does not solve the problem cleanly. The result is effort across the week without a dependable dose where you want visible change.",
  mechanism: [
    "A muscle needs a repeatable weekly dose of challenging work to grow. For many lifters, roughly 10–20 hard sets per muscle per week is a useful working range, though the right number depends on training history, exercise choice and recovery. A hard set is one that ends within about 1–3 good reps of failure; warm-ups and casual pump work do not carry the same signal. If your slowest area gets no session, or only one short session, it may be receiving just a few productive sets. That can be enough to maintain some muscle, especially when other lifts involve it, but it often leaves little room for continued growth.",
    "Hours in the gym are a poor proxy for a muscle's dose. A 90-minute session can include setup, warm-ups, rest periods and work for several body parts, while the priority muscle receives only a small slice. If your whole week is under 3 hours, the available time itself is tight; if you lift 3–7 hours, your slowest area can still be underdosed when those hours are spread across the whole body. Count direct hard sets for the target area across all sessions. Also decide in advance how much work a compound lift contributes, rather than assuming every press or squat fully trains every muscle involved.",
    "The lagging area often gets the smallest dose for ordinary scheduling reasons. You may train it after the muscles you enjoy more, place it at the end of a long session, or give it one day because soreness makes a second exposure feel inconvenient. Exercises can also shift work away from the target when your setup, range or technique lets another muscle take over. None of this means you lack effort. It means the muscle you most want to improve has the fewest reliable chances to receive challenging, well-aimed work.",
    "Frequency helps mainly by making the weekly work higher quality and easier to repeat. Splitting 10–12 sets across two sessions gives you roughly 5–6 sets each time, often with better focus and less local fatigue than doing all 12 in one sitting. A second session also protects the dose when one day gets missed, and gives you another opportunity to practise the exercises with fresh attention. Frequency itself is not magic: if the same small number of easy sets is merely spread across more days, the weekly stimulus has not meaningfully changed.",
    "More is not automatically better, so build toward a dose you can recover from and progress. Going straight from 3 sets to 20 can leave you too sore to train well, while adding sets to every muscle wastes the limited time you have for the priority. Start with two exercises that suit the area, use consistent range and technique, then add enough direct sets to reach a modest target. Keep the rest of your week steady while you check whether reps, load and execution improve. The useful dose is the one you can repeat for several weeks, not the biggest session you can survive once.",
  ],
  howItShowsUp: [
    "Your slowest-growing area gets one session a week, under two hours total, or no planned session at all.",
    "The full week adds up to under 3 hours of lifting, so the priority area has little room to collect direct work.",
    "You lift 2 days a week, and one of those days has to cover several muscle groups at once.",
    "The target muscle is trained late, after your focus or session time has run low.",
    "You remember the exercises and the effort, but cannot name how many challenging sets that muscle gets in a normal week.",
    "A missed session means the slowest area may go a week or longer without a focused stimulus.",
  ],
  fix: [
    {
      title: "Give the priority area two reliable slots",
      steps: [
        "Put the slowest-growing area first in two sessions each week, with at least 48 hours between them. If you currently lift twice a week, include it in both sessions rather than adding an extra gym day you may not keep.",
        "Choose two stable exercises: one that challenges the muscle in a lengthened position and one that lets you train it safely near failure. Keep both for at least 6 weeks so you can compare the work honestly.",
        "Start with 8–10 direct hard sets for that area per week, split across the two days. If you already do more, write down the current count first and avoid a sudden jump.",
        "Schedule the work before the session begins and keep a shorter version ready: if time is tight, complete the first 3–4 priority sets rather than dropping the area entirely.",
      ],
    },
    {
      title: "Count sets that actually challenge it",
      steps: [
        "For two weeks, record exercise, sets, reps, load and estimated reps in reserve for every movement aimed at the priority muscle.",
        "Count working sets that finish within about 1–3 reps of technical failure; exclude warm-ups and sets where another muscle or poor range ends the set first.",
        "Use a repeatable range: mark depth or touch points, lower the weight under control for 2–3 seconds, and pause briefly where the target is stretched when the exercise allows it.",
        "When you reach 10–12 well-executed weekly sets and recover normally, hold that dose for 4 weeks before deciding whether to add 2 sets.",
      ],
    },
    {
      title: "Make the dose progress without taking over the week",
      steps: [
        "Keep total weekly lifting hours steady for the first month. Reassign 15–25 minutes from low-priority work or trim one accessory instead of adding a long session.",
        "Log a rep range for each exercise, such as 8–12. Add reps with the same clean range until you reach the top, then increase load by the smallest practical amount.",
        "Rest 2–3 minutes on demanding sets and stop most sets with 1–2 good reps left. A rushed set that ends from breathlessness is a poor substitute for targeted work.",
        "If soreness or performance is still worsening at the next exposure, remove 2 sets for a week and rebuild more gradually; do not add work everywhere to force a result.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: write down the priority muscle's current direct hard sets, choose two stable exercises and schedule two exposures. Aim for 8–10 total sets, or maintain your current total if it is already higher.",
    "Week 2: repeat the same two slots and log load, reps, range and reps in reserve. Make the target muscle the first focused work in both sessions.",
    "Week 3: keep set count fixed and add a rep where technique stays consistent. If one session was missed, move its priority work to the next available day rather than abandoning it.",
    "Week 4: compare the recorded sets with week 1 and check whether reps or load improved. Hold the dose if recovery is good; add only 2 weekly sets next block if the current work is repeatable but still not progressing.",
  ],
  timeline:
    "You may notice better focus and more consistent performance within the first 2–3 weeks, but a pump or soreness is not proof of growth. Give a stable dose at least 6–8 weeks before judging visible change, and expect the logbook to move before the mirror does. If you reach 10–12 quality sets across two sessions and the numbers still do not improve after a full block, review effort, exercise execution, food and sleep before adding another large dose.",
  mistakes: [
    "Adding sets to every muscle when only the slowest area lacks reliable weekly work.",
    "Putting all the extra sets into one marathon session, where fatigue can blunt the later work and one missed day still wipes out the dose.",
    "Training the priority muscle every day with no plan for recovery, then reducing effort because it stays sore.",
    "Changing exercises every week, which makes it hard to tell whether the target muscle is receiving more useful work.",
    "Counting every set from a compound lift as a full set for every muscle it involves, even when the target is not close to being challenged.",
  ],
  relatedFindings: ["lagging_part_trained_last", "volume_outruns_recovery", "sets_end_too_early"],
};
