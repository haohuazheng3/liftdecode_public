import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "volume_outruns_recovery",
  audience: "both",
  category: "recovery",
  title: "Your week is bigger than your recovery",
  verdict:
    "Your high training load is colliding with recovery signs, so fatigue is hiding the progress the work should produce.",
  summary:
    "Your lifting week runs to 7–10 hours or more, and your recovery signals suggest the work is costing more than you can currently absorb. That can show up as a training loop that no longer feels smooth, waking unrefreshed despite enough time in bed, pain changing your sessions, or less urge to chase a hard set. Those signs do not mean you are lazy or losing your ability. They suggest the size and intensity of the week need to match the recovery you have available now.",
  mechanism: [
    "Training and recovery draw on the same finite week. Hard sets, long sessions and frequent near-max work create a demand; sleep, adequate food, rest days and lower outside stress help you meet it. A 7–10 hour week can suit some lifters, and over 10 hours can be planned for a short block, but hours alone do not prove overload. The concern is the combination of a large measured week and signs that your usual training-to-recovery loop is slipping. When demands stay higher than your current capacity, you may complete the sessions while adapting less from them.",
    "More work has diminishing returns. The first well-chosen sets provide much of a muscle's useful stimulus; later sets still cost time and fatigue, while adding less new growth or practice. The curve depends on the person and program, so there is no universal hourly ceiling. But if you are lifting over 10 hours, spreading work across six sessions without a rest day, or taking many sets close to failure, the total can outrun what you refill between sessions. Long gym time also hides idle minutes, warm-ups and repeated low-quality sets, so measure the hard work as well as the clock.",
    "Recovery signs help interpret that load. A low score for how reliably you arrive, train and recover suggests the week is not repeating cleanly. Waking unrested despite 7–8 hours in bed points to recovery that is not being restored by time alone. Pain that changes exercise choice, a drop in training drive, or warm-ups that feel unusually heavy can also appear when fatigue accumulates. None identifies a single cause by itself: sleep quality, food, stress, technique and ordinary life changes can all matter. Their value is that they tell you to review total demand before adding more work.",
    "Fatigue can mask fitness. A hard session may improve capacity over time while also leaving short-term tiredness; your performance today reflects both. If fatigue keeps building, a load that should move may feel slow, and reps that were there last month may disappear. That can look like a lack of stimulus, prompting another set, another day or another max attempt. The added work then deepens the fatigue and makes it harder to see what your previous training built. A planned reduction gives the accumulated tiredness time to fall while preserving practice on the main movements.",
    "Your recovery budget changes with context. A demanding work stretch, high stress, inconsistent meals, short sleep or frequent alcohol can reduce what you can absorb without changing the program on paper. Age can also affect how quickly you feel ready, but it does not set a fixed ceiling or make hard training unsuitable. Most lifters can make progress with a focused 4–8 hours of lifting a week, though some need less and some tolerate more. The practical test is whether your current dose produces repeatable sessions, stable recovery and upward movement in useful performance measures.",
  ],
  howItShowsUp: [
    "Your measured week reaches 7–10 lifting hours or more, and your recovery loop feels unreliable rather than steady.",
    "You train 6 days a week with no full rest day, so tiredness has few chances to clear before the next session.",
    "Your sessions are long, yet the later exercises often feel slower or less focused than the first work.",
    "You sleep around 7–8 hours but still wake feeling unrested, or your warm-ups feel heavy before the work sets begin.",
    "Pain sometimes changes how you train, especially as the work or load builds across the week.",
    "Your urge to train or chase records has faded, even though you keep showing up and completing the schedule.",
    "Life stress is elevated at the same time that the program asks for more hours, hard sets or near-max efforts.",
  ],
  fix: [
    {
      title: "Lower the demand long enough to clear fatigue",
      steps: [
        "For 5–7 days, keep the main movements and cut working sets by about half. Four sets become two; three become one or two. Do not fill the time with replacement exercises.",
        "Use roughly 60–70% of your usual working loads and finish every set with at least 4 reps in reserve. Reps should look crisp, with no grinders or max attempts.",
        "Keep at least one full rest day with no lifting each week. If you currently train six days, remove or merge a lower-priority session rather than squeezing it elsewhere.",
        "If pain is sharp, worsening, or continues to change your training after the easier week, get it assessed by a qualified clinician before loading that movement again.",
      ],
    },
    {
      title: "Rebuild around focused work",
      steps: [
        "After the easier week, reduce hard sets by 30–40% from your recent baseline for the next 3 weeks. Keep the lifts you care about and remove redundant accessories first.",
        "Limit most sessions to 60–75 minutes and keep at least one complete rest day. Track lifting time separately from warm-ups and long breaks so the weekly number is useful.",
        "Keep the work sets that remain challenging: use a load you can control for the planned reps and finish most sets with 1–3 reps in reserve. Do not turn every set into a test.",
        "Maintain regular meals, include a protein source at each meal, and aim for at least 7 hours of sleep on most nights while you evaluate the training change.",
      ],
    },
    {
      title: "Earn volume back from clear recovery",
      steps: [
        "For each session, note warm-up feel from 1 to 5, pain that changes an exercise, and whether the next session starts recovered. Use the same quick check for 2 weeks.",
        "If performance and recovery are steady for two consecutive weeks, add 1–2 hard sets per priority muscle or lift, not both at once.",
        "Hold each increase for at least 2 weeks. If sleep, drive, pain or performance worsens again, return to the last dose that felt repeatable.",
        "Schedule a lighter week every 4–8 weeks during a demanding block, adjusting earlier when the same recovery signs return across multiple sessions.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: reduce sets by about half, use 60–70% of normal working loads and take one full rest day. Record warm-up feel and any pain that changes the session.",
    "Week 2: rebuild at roughly 60–70% of your recent set count, with sessions capped near 75 minutes and most sets 1–3 reps from failure. Keep sleep and meals as regular as practical.",
    "Week 3: hold the dose steady and compare repeatable working sets with the previous week. Add no work if warm-ups remain heavy or pain is still altering training.",
    "Week 4: if performance and recovery have been steady for two weeks, add 1–2 hard sets to one priority area. Otherwise hold the reduced dose for another block and review sleep, food and life stress.",
  ],
  timeline:
    "Many lifters notice warm-ups and general readiness improve during the first 1–2 weeks after reducing the load, though the pace varies with sleep, stress and how long fatigue has accumulated. A stalled working set may move again in weeks 3–4 as fatigue clears; that first improvement reflects better expression of existing fitness as well as continued training. Give the adjusted week several consistent weeks before judging physique change, which usually takes longer. If recovery signs persist despite a lower dose, investigate the other demands on the week instead of cutting training further by default.",
  mistakes: [
    "Adding another training day because a plateau feels like too little work, while recovery signs are already getting worse.",
    "Taking a week completely off and then returning to the same oversized schedule without learning which dose you can repeat.",
    "Buying recovery supplements while leaving session length, hard sets and rest days unchanged.",
    "Adding cardio to compensate for reduced lifting volume when fatigue is the reason the week needs to shrink.",
    "Cutting food sharply to make the scale move, removing energy and protein while asking the body to recover from the same work.",
  ],
  trackNotes: {
    physique:
      "For physique progress, judge the plan by quality work for each muscle, not by how many hours you spend in the gym. Keep the target muscle's best exercises, but remove roughly a third of its recent hard sets while the broader recovery signs settle. Hold that dose for 4–6 weeks and log reps, load and range. If those improve and soreness no longer carries into the next exposure, you can add 1–2 sets. A smaller week that produces better sets is often a stronger growth stimulus than a long week full of tired work.",
    strength:
      "For strength, preserve regular practice on the stuck lift while taking out repeated grinders and unnecessary near-max work. After the easier week, use submaximal working sets you can repeat with clean positions, usually around 70–85% depending on the lift and rep target. Compare bar speed, reps and technique at the same load instead of testing a max every session. If the lift moves better as the weekly load falls, fatigue was hiding some of your strength. Build back only after several steady weeks, and plan a true test after a focused block rather than during the rebuild.",
  },
  relatedFindings: ["sleep_under_dose", "drive_has_faded", "training_around_pain"],
};
