import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "testing_instead_of_training",
  audience: "strength",
  category: "programming",
  title: "You're testing strength instead of building it",
  verdict:
    "Too much of your heavy work is spent measuring your max and too little building it.",
  summary:
    "You test your max monthly or more, or most of your sessions already sit close to it, so the heaviest set of the day has become the point of the day. That is not a plateau in your strength — it is a schedule with no room for the work that would move it. Every time you run the test, the fatigue is paid in full, the adaptation is a small return for a large cost, and the number it keeps returning becomes the ceiling you train under.",
  mechanism: [
    "What you can lift on a given day is the fitness your training has built minus the fatigue it has left behind. The models sports scientists use for this are simple and hold up in practice: every hard session adds to both, but fatigue arrives faster and clears faster than fitness. Space and cycle the hard sessions and fatigue clears between them while fitness accumulates underneath. Let max and near-max attempts crowd the calendar and fatigue is added faster than it can clear, so the number on the bar sits still even while the fitness under it is quietly there.",
    "The second problem is the stimulus itself. A single at 95–100% is the most specific thing you can do to a lift, and it does build some strength — but very little per unit of fatigue: one rep, a few seconds of tension, one rehearsal at a load where technique is at its worst, and far too little volume for the muscle to grow. In the studies that compared lifters training moderate-to-heavy loads for multiple reps against lifters practising at or near maximum, the moderate-heavy group generally gained similar strength with far less volume at maximal loads. The 75–90% zone, for 2–6 reps stopped a rep or two short of failure, gives the muscle enough volume to grow and the skill enough clean repetitions to sharpen. Living above it most of the time buys a small return for a large cost.",
    "Grinding compounds this. When the last set ends at 0–1 reps in reserve, or past failure, the fatigue cost climbs steeply while the extra stimulus is small — the grinding rep costs the most and teaches the worst bar path. A near-max single is by definition a grind. Do that most weeks with no deliberate week where the loads come down, and you never see what the training has built. Fatigue masks fitness; a deload lifts the mask, and if you only back off when your joints complain, you are deloading after the damage rather than before it.",
    "Then there is what the test does to your decisions. If the number matches last week, the natural response is to try harder — more warm-up singles, one more attempt — which is more test and more fatigue. If it is lower, you doubt the plan and change something. Either way the session is judged by a one-rep measurement instead of by whether the work was done. Judging yourself against an old PR makes it worse: a rested, tapered number from months ago is compared with a tired Tuesday, and the gap is read as failure rather than fatigue.",
    "Experience raises the price. The longer you have trained, the smaller the gains available per block and the larger the recovery cost of a true max compared with year one. Beginners can test often because everything works and nothing lingers; a lifter moving heavy loads cannot. The frequent max that once kept climbing now gives you a stiff back and the same number. That is not the lift refusing to move. It is the lift being asked the same question every week and never given the training that would change the answer.",
  ],
  howItShowsUp: [
    "You work up to a max or near-max on your priority lift every month or more often, and that top set is the session — the sets around it are an afterthought.",
    "Most of your work on the lift is heavy singles, doubles and triples; anything lighter feels like a wasted session.",
    "The weight you use is decided by working up to the heaviest you can manage that day, not by a plan that told you the number before you walked in.",
    "Your heavy sets end in a grind, a missed attempt or a spotter's hands on the bar more often than they end with a rep to spare.",
    "Your form on heavy reps drifts — the bar path wanders, the depth or lockout changes — because so many of your reps are at loads where technique is at its worst.",
    "You cannot remember the last time you deliberately took a lighter week; you back off only when a joint complains or you feel wrecked.",
    "Sessions feel harder and flatter than they used to while the number itself stays put, and the natural response is to try another attempt.",
  ],
  fix: [
    {
      title: "Put the test back in its cage",
      steps: [
        "Decide now: the next true max attempt on your priority lift is at the end of week 8, not before. Write the date in your log.",
        "Take your best clean single from the last 8 weeks — not your all-time PR — and call that your training max. Every percentage below comes from it.",
        "Replace the weekly work-up with one indicator: a single at 88–92% of the training max once every 2–3 weeks, stopped the moment bar speed drops. That is a check, not a test.",
        "Delete 'work up to the heaviest I can' from your options. If a set is not written down before the session with a load and reps, it does not happen.",
      ],
    },
    {
      title: "Move the work into the zone that builds",
      steps: [
        "Two sessions a week on the lift, at least 2 days apart. Heavy day: 4–5 sets of 3 at 80–85% of the training max. Volume day: 5–6 sets of 5 at 70–75%.",
        "End every set with 2–3 reps in reserve. The last rep should be slower than the first but never a grind; if it grinds, drop 5% on the next set.",
        "Warm up on a fixed ladder (bar × 8, 50% × 5, 60% × 3, 70% × 2), then start the prescribed sets. No 'see how this feels' singles above the top working set.",
        "Add 2.5 kg (5 lb) on upper-body lifts or 5 kg (10 lb) on lower-body lifts only when every rep at the current load moved cleanly. That is the only rule that adds weight — you should total 20–30 reps a week at 70–85%, against the 5–10 grinding reps before.",
      ],
    },
    {
      title: "Clear fatigue on purpose",
      steps: [
        "Schedule a deload for week 4 and week 8 before you start: same sessions, half the sets, loads at 60–70%. You do not skip it because you feel fine — feeling fine is the point.",
        "Sleep and eat through the deload as if it were training, because it is: the adaptation you have been paying for shows up during it. Use the week-8 deload as the taper: two light sessions, then the max attempt on day seven or eight.",
        "Judge the block by the log, not by daily feel. If every prescribed set was completed at 2–3 RIR and the loads went up twice, the block worked, whatever any single Tuesday felt like.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: set the training max from your best recent clean single, write the week-8 test date in your log, and run the two-day structure — heavy day 4×3 at 80%, volume day 5×5 at 70%. No work-ups, no singles above the prescribed sets.",
    "Week 2: same structure; heavy day 4×3 at 82–85% if week 1 moved cleanly, volume day 5×5 at 72%. Film the top set on the heavy day and check the last rep looks like the first.",
    "Week 3: heavy day 5×3 at 85%, volume day 6×5 at 75%. Take your first indicator single at 90% before the heavy sets — one rep, stop when the bar slows, then straight into the working sets.",
    "Week 4: deload — both sessions at 60–65%, 3×3 and 3×5, stopping at 4+ reps in reserve. Compare the bar speed of your week-3 indicator with your last tested max; that comparison, not the number, is your first read on the block.",
  ],
  timeline:
    "The first two weeks will feel like a step backward: the loads look light, the sessions end before you feel tested, and the itch to work up will be strong. By week 3 the same 80–85% loads should be visibly faster on video and the heavy day should stop feeling like an event. The number itself changes at the week-8 test: the old top load should move faster than it did when you were testing it, and with the fatigue finally cleared a clean PR attempt becomes a realistic goal rather than a grind. The second block usually builds on the first, because you enter it with a training max you trust and without months of unpaid fatigue.",
  mistakes: [
    "Keeping the weekly max attempt but adding back-off sets after it, so the test is now followed by volume you are too fatigued to do well.",
    "Dropping to 60% and 10+ reps because 'heavy is the problem', which trades a test for work that no longer practises the strength you want.",
    "Calling every fast single at 90% a 'technique check' and doing one every session — a test with a nicer name is still a test.",
    "Deloading only when you feel beaten up, hitting a PR in the first week back, and taking that as proof that maxing works rather than of what clearing fatigue does.",
    "Using your all-time PR as the training max, so every percentage is 5–10% heavier than intended and the block turns back into grinding within two weeks.",
    "Switching program at week 3 because the loads feel too easy, before the block can show what the easy loads were building.",
  ],
  relatedFindings: ["never_heavy_enough", "volume_outruns_recovery", "failure_every_set"],
};
