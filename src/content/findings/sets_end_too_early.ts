import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "sets_end_too_early",
  audience: "both",
  category: "effort",
  title: "Your sets stop before the stimulus starts",
  verdict:
    "You're ending sets four or more reps short of failure, which turns most of your working sets into extended warm-ups.",
  summary:
    "You show up, you do the sets, the log fills in — and the body or the bar refuses to move. The problem isn't the plan; it's that the reps that actually force adaptation are the ones you never reach, because you stop when the set count says stop, not when the muscle does. Until that changes, you're paying full price in time and fatigue for a fraction of the stimulus.",
  mechanism: [
    "Muscle doesn't grow and strength doesn't rise because a set happened; they change because the last few reps of a set were hard enough to recruit the biggest, highest-threshold motor units and make them work slowly under load. In the studies that compared sets stopped four or more reps short of failure with sets taken close to it, the close-to-failure sets produced more growth per set, and the gap widened as sets got easier. Most of the useful stimulus in a set lives in roughly the last zero to three reps before failure. Stop at rep six of a possible twelve and you've done the easy half.",
    "The reason is recruitment. Early in a set the small, fatigue-resistant fibres do the job. As they tire, the nervous system is forced to bring in the larger fibres — the ones with the most room to grow and the most to contribute to a heavy single. If you leave with six reps in the tank, those fibres were barely asked. You still feel the set — the burn, the breathing — which is why it's convincing. But the sensation of work and the recruitment that drives change are not the same thing.",
    "This is where 'no idea' becomes a real answer rather than a shrug. Nobody can estimate reps in reserve accurately without having felt failure recently, and the research on how well lifters guess their RIR is consistent: people who rarely reach failure overestimate how close they are, often by three to five reps, and the error is worst far from failure and on lower-effort sets. If you've never intentionally taken a set to the point where a rep doesn't happen — or it's been months — then 'hard' is calibrated against nothing. Your honest 2–3 is somebody else's 6.",
    "Loading by feel makes it worse, because feel is conservative by design. On a day you feel good you pick the weight that lets the set go smoothly; on a day you feel flat you pick the one that lets you get through. Both choices protect you from the grind, and the grind is the signal. Add a plan that never asks the bar to fail and you get a lift that 'never fails' — not because it's strong, but because it's never been tested. In your first year, that alone can flatten progress.",
    "The uncomfortable arithmetic for the high-volume version: sixteen or more sets a week at six reps in reserve still costs joints, sleep and appetite something. Fatigue accrues by the tonne lifted; stimulus accrues by the hard reps done. Run that ratio for months and you end up beaten up and unchanged, which most people read as 'I need more volume' — and the ratio gets worse.",
  ],
  howItShowsUp: [
    "Your last set of the week ended with 4–5, or 6+, reps you could have done — and you stopped because the set count was complete.",
    "Asked how many reps you had left, your honest answer was that you don't know, and you haven't taken a set to real failure in months, or ever on purpose.",
    "Most weeks already feel easy; a deload wouldn't change much because you never build up anything to deload from.",
    "You decide the weight by memory and how you feel today, and the number that gets picked is reliably one you can handle comfortably.",
    "The bar slows on maybe one rep a month. Your main lift has never actually stalled mid-rep or missed — you back off before it grinds.",
    "You finish sessions fresh enough to repeat them, and soreness is rare even on the muscle you say is lagging.",
    "The log shows the same weights for weeks with clean reps on every set — no missed reps, no ugly ones, and no gains.",
  ],
  fix: [
    {
      title: "Calibrate: find out what your reps in reserve actually mean",
      steps: [
        "This week, on the last set of one safe exercise per session (leg press, machine row, dumbbell press, cable curl — not squats or deadlifts), take the set to the point where the next rep does not go up. Note the rep count.",
        "Before you start that set, write down how many reps you think you'll get. Compare afterwards. The gap between your guess and reality is your personal RIR error; most people who trigger this finding find it's 3–5 reps.",
        "Do this on 4–6 exercises across the week, once each — enough to reset your sense of 'hard' without wrecking recovery.",
        "From now on, 'I think I had 2 left' means the bar visibly slowed on the last rep. If it didn't slow, you had more than 3, whatever it felt like.",
      ],
    },
    {
      title: "Move every working set into the 1–3 RIR window",
      steps: [
        "Use the calibration numbers. If you got 13 reps on a weight you'd been stopping at 8, that weight belongs in a 10–12 rep set, or you add 5–10% and keep the rep target.",
        "Set the rule: the last rep of every working set should be noticeably slower than the first. If all reps look identical on video, the set ended too early — add weight or reps next time.",
        "Take the final set of each exercise to 0–1 RIR on isolation and machine work, 1–2 RIR on compounds. Earlier sets sit at 2–3 RIR. Every set has a job; none is a rehearsal.",
        "Rest 2–3 minutes between hard sets (3–5 on heavy compounds), so the next set is hard because of the load, not the clock.",
      ],
    },
    {
      title: "Replace feel with a rule that forces the bar up",
      steps: [
        "Pick a rep range per exercise (e.g. 6–10 or 8–12) and a rule: when you hit the top of the range on all sets at 1–2 RIR, add the smallest increment next session — 2.5 kg on upper-body lifts, 5 kg on lower.",
        "Log every set with reps and an RIR estimate. Two sessions where nothing moves and every set sits at 3+ RIR means the weight was wrong, not the program.",
        "If you're in your first year, expect the rule to fire almost every week. If it doesn't fire for three weeks on a lift, it's an effort problem before it's anything else.",
        "Trim volume while you fix this: 8–12 genuinely hard sets per muscle per week is plenty for the first month, because hard sets cost far more to recover from than the ones you were doing.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: calibrate. One last-set-to-failure per session on safe exercises, guess written before, real count after. Everything else stays as it is, but rest 2–3 minutes and film the last set of your main lifts.",
    "Week 2: re-load using the calibration. Set rep ranges, set the add-weight rule, drop volume to 8–12 hard sets per muscle. Final sets to 0–2 RIR, earlier sets to 2–3.",
    "Week 3: run the rule. Add load wherever last week's top set hit the top of the range. Log RIR on every set; anything logged at 3+ gets more weight next time.",
    "Week 4: keep progressing, then compare week 1 and week 4 video on the same lift — the last reps should now be visibly slower. Plan a lighter week 5 if warm-ups start feeling heavy; you've earned a deload for the first time.",
  ],
  timeline:
    "Expect the first two weeks to feel harder and a little demoralising: the weights you thought were working sets get revealed as warm-ups. The log starts moving within two to three weeks, because much of the early rise is simply using strength you already had. Visible physique change lags behind — allow six to ten weeks of properly hard sets before you judge photos, and treat month one as the month you learned what effort is.",
  mistakes: [
    "Adding sets instead of effort: another three easy sets is more fatigue with the same missing stimulus.",
    "Taking every set to failure from tomorrow — that trades one uncalibrated pattern for another, and recovery collapses within a fortnight.",
    "Calibrating on squats or deadlifts. Failure there is a technique and safety problem; learn what failure feels like on machines and dumbbells first.",
    "Trusting the burn or the pump as proof of a hard set. Both arrive long before the last rep slows.",
    "Keeping the same weight and 'trying harder'. When the calibration says you had six left, the weight goes up.",
    "Switching programs because this one 'stopped working'. It never started, because the sets never reached the range where programs work.",
  ],
  trackNotes: {
    physique:
      "Growth is driven almost entirely by hard reps, so this finding matters more for you than any exercise-selection tweak. Isolation and machine work can end at 0–1 RIR most sets; the risk is low and the recruitment is what you're paying for. If you're doing 16+ sets on the lagging muscle, halve them this month and make every remaining set count.",
    strength:
      "A main lift that never fails has never been tested, and testing is part of training. Keep compound working sets at 1–3 RIR most of the time, but you need to know where 0 is: use a rep-out on a back-off set (say 75–80% for as many clean reps as possible) every 2–3 weeks to find it. When the log has shown the same weight for three weeks with clean bar speed, the fix is a heavier bar, not a new template.",
  },
  relatedFindings: ["no_forcing_function", "never_heavy_enough", "sticking_point_untrained"],
};
