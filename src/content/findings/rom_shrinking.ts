import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "rom_shrinking",
  audience: "both",
  category: "technique",
  title: "Your reps are shorter than you think",
  verdict:
    "Your working range has shortened enough that the load in your log no longer reflects the same lift.",
  summary:
    "The weight can rise while the useful part of each rep quietly gets smaller. You may be stopping above the bottom, bouncing through the stretched position or losing range on the final reps when effort climbs. That can make the log look better even as the muscle or lift gets less practice where it is hardest. If range is not a priority from rep to rep, the stall may be less mysterious than it feels: some of the progress you are trying to build has been traded for shorter repetitions.",
  mechanism: [
    "A repetition is load moved through a range from a repeatable start to a repeatable finish. If the distance or position changes, the number on the bar no longer measures the same task. A squat that stops higher, a press that no longer reaches the same touch point, or a curl that avoids elbow extension can all add weight while reducing the movement being trained. That makes comparisons across weeks unreliable. The load may still be moving, but a growing number cannot tell you whether the target muscle or lift is doing more work unless the range and setup stay consistent.",
    "For muscle growth, the stretched part of a controlled rep deserves particular attention. Research comparing ranges and muscle lengths suggests that training at longer muscle lengths can produce strong growth, and in some comparisons outperforms short-length partials. That does not mean every exercise needs an exaggerated stretch or that every partial is useless. It means cutting off the bottom simply to preserve a heavier load can remove a valuable part of the stimulus. You can keep the effort and fatigue of a hard set while giving the muscle less work in the positions where it is lengthened and often challenged most.",
    "For strength, the relevant range is the one your goal requires. A squat or bench press performed to a shallower standard may let you handle more weight, but it does not provide equal practice in the missing positions. Sticking points often occur where leverage is less favorable; avoiding that part means you have fewer chances to build coordination and force there. Even if your goal is not a competition lift, the same logic applies: a rep standard gives you a stable task to improve. Without it, the log can reward a change in technique rather than a stronger performance at the movement you meant to train.",
    "Range usually shrinks gradually as the load rises or a set approaches failure. A small depth change feels harmless, a bounce gets the bar moving, and the last reps shorten before you consciously decide to use partials. Trying to beat the previous session every time can speed up that drift, as can training through pain that appears near the bottom. The goal is not to force a painful position; it is to notice when discomfort is steering the movement and choose a tolerable variation or load. If pain keeps changing how you train, address that constraint instead of trying to hide it with shorter reps.",
    "A short range can also make it harder to feel the intended muscle working. That feeling is not a perfect measure of growth, but a rushed, abbreviated rep gives you less time and less position-specific feedback to judge. A controlled eccentric of 2–3 seconds and a brief pause at a tolerable stretched point make each repetition easier to compare and harder to shorten without noticing. When you reset the load to match that standard, the first number may drop. That is a more honest baseline, and it lets later load or rep increases mean the same thing again.",
  ],
  howItShowsUp: [
    "You rarely use a clear depth, touch point or end position to decide whether a rep counts.",
    "The first reps look fuller than the final reps, especially when you take a set close to failure.",
    "Your load or rep count has gone up, but the bottom position has become shallower over the same period.",
    "You bounce or use momentum to move through the part of a rep that feels hardest.",
    "The stretched position is where discomfort appears, so you turn around early without changing the exercise or load.",
    "You do not feel the target muscle clearly, and the set often ends before it reaches a controlled stretch.",
  ],
  fix: [
    {
      title: "Set one repeatable range standard per lift",
      steps: [
        "Choose a visible endpoint for each main lift: a consistent squat depth marker, a bar touch point on presses, or a controlled elbow extension and stretch on curls.",
        "Film one working set per lift from a side or three-quarter angle each week. Keep the camera position similar so you can compare the first and last reps.",
        "Write your stance, grip and setup cues in the training log. Keep them fixed for 6–8 weeks unless pain or equipment requires a change.",
      ],
    },
    {
      title: "Choose loads that survive the full rep",
      steps: [
        "For the first week, lower each affected lift by 10–20% and use a 2–3 second lowering phase with a brief pause at the deepest comfortable position.",
        "Stop each working set with 1–3 reps in reserve. If the next rep would miss the range standard, end the set instead of turning it into a shorter partial.",
        "Count only reps that meet the standard. Add a rep first, then raise the load by the smallest available increment when every set reaches the top of its rep range.",
        "If a joint hurts in the stretched position, use a pain-free range or a different variation and reduce load; do not force the position to satisfy the video standard.",
      ],
    },
    {
      title: "Make the new baseline useful for both goals",
      steps: [
        "Keep one weekly video and compare it with the previous week at a similar load. Look for the same setup and endpoint from the first rep to the last.",
        "For physique work, include controlled exercises that load the target muscle at a longer length, such as incline curls or deep-range leg work, when those positions are comfortable.",
        "For strength work, practise the range your lift requires with submaximal sets. Add load only after the required depth or touch point stays consistent across all working reps.",
        "Review the log every 4 weeks. A load increase counts as progress only if range, setup and control stayed the same or improved.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: choose a visible range standard for each main lift, record your setup and film one set. Reduce affected loads by 10–20% so every rep reaches the standard without pain.",
    "Week 2: use a 2–3 second lowering phase, a brief comfortable pause and 1–3 reps in reserve. Log only the repetitions that meet the standard.",
    "Week 3: add reps within the same load and range. Use one lengthened-position accessory for a physique goal or submaximal practice in the required range for a strength goal.",
    "Week 4: film and compare the same lifts. Add the smallest load increment only where all working reps kept the same range; hold or adjust any lift where discomfort or shortening returned.",
  ],
  timeline:
    "The first week can feel like a step back because loads often fall by 10–20% when you restore the range. That drop reflects a more demanding version of the rep, not lost strength. Most lifters can build reps or load again over the next 3–5 weeks if they keep the standard consistent. Changes in muscle size take longer to assess; give full-range work 6–8 weeks before judging the mirror. If pain keeps limiting the range, use a comfortable variation while you address the source rather than forcing a deeper position.",
  mistakes: [
    "Keeping the old load and hoping to force full range once the set becomes difficult, even though the weight was built around shorter reps.",
    "Calling any shortened rep a deliberate partial when the range changes unintentionally from rep to rep.",
    "Adding more sets before restoring the range, which can increase fatigue without giving you more useful work in the missing position.",
    "Forcing a painful stretch instead of reducing load or choosing a comfortable variation that lets you train consistently.",
    "Chasing a pump with fast half reps and then using the higher rep count to claim progress over full controlled repetitions.",
  ],
  trackNotes: {
    physique:
      "For muscle growth, keep a controlled stretch in the movements where it is comfortable and appropriate. Lengthened-position training can be a useful stimulus, but it is not a reason to force extreme range or ignore pain. A lower load with repeatable full reps often gives you a better comparison than a heavier set that cuts off the bottom. Hold that standard for 6–8 weeks and look for more reps, a small load increase and gradual changes in the target muscle.",
    strength:
      "For strength, practise the exact depth, pause or touch point that defines a successful lift for your goal. Shorter reps can maintain general strength, but they do not show that you have improved through the range you need. Keep most work submaximal while you rebuild consistent positions, then progress when every working rep meets the standard. If pain is what makes you cut the range, select a tolerable variation and avoid turning a technique reset into a test of how much discomfort you can accept.",
  },
  relatedFindings: ["sets_end_too_early", "training_around_pain", "lagging_part_trained_last"],
};
