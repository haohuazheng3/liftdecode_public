import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "consistency_gap",
  audience: "both",
  category: "consistency",
  title: "You show up. The loop doesn't.",
  verdict:
    "You attend regularly, but you are not arriving recovered enough to make each session build on the last.",
  summary:
    "You have kept showing up, so from the outside your training looks steady. Inside the week, though, sessions do not reliably start from a decent place, go well, and leave you ready to recover. Attendance is real, but a low training-loop rating points to a different problem: the work is not turning into repeatable progress. Months of honest effort can feel strangely empty when each session starts with fatigue left over from the one before it.",
  mechanism: [
    "Attendance is the input to training; the loop is what turns that input into adaptation. A session creates a demand on muscle, skill and energy. Recovery lets you absorb it, and the next session gives you another useful exposure. When you arrive tired, train poorly, or fail to recover before the next visit, you can still attend on schedule while the process stops compounding. Regularity matters, but it is not enough by itself. The question is whether each session leaves you able to repeat quality work, not simply whether you walked through the gym door again.",
    "The loop can break before, during or after a session. Before training, short or irregular sleep, low food intake, stress or a packed day can leave you starting below your normal baseline. During training, sessions that run too long or push too many sets close to failure can spend more capacity than you have. Afterward, another demanding day, alcohol, missed meals or too little sleep can prevent you from being ready next time. These factors can overlap, so a low loop score is a reason to inspect the whole sequence rather than blame a single exercise or muscle group.",
    "A session that is not recovered from still costs time and energy. Repeating the same dose on top of unfinished fatigue often makes your warm-ups slower, your working sets less controlled and your effort harder to judge. You may then add intensity to compensate, even though the problem is that the previous work has not cleared. Strength practice gets less precise, and muscle-building sets lose quality as fatigue rises. The programme can look complete in a notebook while the repetitions that matter arrive on a body that is still paying for last time.",
    "The word steady usually describes what you can see: you kept your appointments and did not disappear for weeks. Recovery is less visible, especially when you are disciplined enough to train through a poor day. That can hide a loop that runs at 3/10: attendance stays high, but readiness, session quality and recovery remain low. Showing up under those conditions is not wasted character or effort. It is evidence that you have protected the input. Now the dose has to fit the capacity that remains, so the same attendance can produce sessions you can actually absorb.",
    "A one-week audit can locate the link that fails most often. Rate how you feel before training, how well the session went, and how recovered you feel before the next session, each from 1–5. If the first rating is low, the cause may be sleep, food or life stress before the session begins. If the second drops, the workout may be too long or effort may be aimed poorly. If the third falls, the work or the time between sessions needs attention. Fixing the weakest link often restores progress without asking you to become more committed than you already are.",
  ],
  howItShowsUp: [
    "You have trained on schedule for weeks, but you rarely arrive feeling ready to do the work you planned.",
    "Warm-ups feel different from session to session, and working weights depend more on how depleted you feel than on the plan.",
    "You finish sessions drained and still feel under-recovered when the next one comes around.",
    "Sleep, meals or stress before training vary enough that the same programme produces very different sessions.",
    "Workouts regularly stretch beyond an hour, and the final exercises are rushed or done with little control.",
    "You have tried to solve flat sessions by adding a day or making the programme harder, but recovery has not improved.",
  ],
  fix: [
    {
      title: "Audit the whole loop for one week",
      steps: [
        "For the next 7 days, rate readiness before each session, session quality afterward and recovery before the next session from 1–5. Use the same scale each time: 1 is very poor and 5 is very good.",
        "Write one short note beside each rating about sleep, food, stress or session length. Record the fact that changed, not a general label like 'bad day'.",
        "At week's end, find the lowest average of the three ratings: before, during or after. Pick that link as the first one to improve.",
      ],
    },
    {
      title: "Set a dose you can recover from",
      steps: [
        "For 2 weeks, reduce hard sets by about 30% and cap sessions at 60 minutes. Keep the main lifts or priority exercises and remove the least useful accessories first.",
        "Keep most working sets 2–3 reps from failure. Stop a set when your form or rep speed changes sharply instead of adding fatigue to prove the session was hard.",
        "Leave at least 48 hours between demanding sessions for the same muscle or lift. If the next exposure still starts poorly, add another recovery day before raising volume.",
        "Protect two quality sessions each week as the minimum. Treat extra sessions as optional until the loop ratings improve for two consecutive weeks.",
      ],
    },
    {
      title: "Repair the weakest link first",
      steps: [
        "If readiness is the low point, set a consistent sleep window and eat a meal with protein and carbohydrates 1–3 hours before training when practical.",
        "If session quality is the low point, choose the 3–5 exercises that matter most and finish them within 60 minutes before adding anything else.",
        "If recovery is the low point, remove 2–3 hard sets from the session that leaves you most depleted and keep the next exposure at least 48 hours away.",
        "After 2 weeks, compare the three ratings with your first week. Add 1–2 weekly sets only if readiness, training quality and recovery are all stable or improving.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: audit readiness, session quality and next-session recovery on a 1–5 scale. Note sleep, food, stress and session length, then choose the lowest-rated link.",
    "Week 2: reduce hard sets by about 30%, keep sessions under 60 minutes and leave 2–3 reps in reserve on most sets. Protect two quality sessions and use the audit to target the weak link.",
    "Week 3: repeat the same dose. If the lowest loop rating has improved and you are recovering by the next session, add 1–2 hard sets across the week; otherwise hold the dose and improve that link further.",
    "Week 4: compare your ratings with week 1. Keep the schedule if the loop is improving; if it is still low, reduce the part of the plan that leaves you least recovered and review again after two weeks.",
  ],
  timeline:
    "You can usually identify the weakest part of the loop within one week because readiness, session quality and recovery do not fail in the same way. A smaller dose may make warm-ups and the next session feel better within 1–2 weeks. Strength and physique changes need more time: give the adjusted plan at least 4–6 weeks of repeatable sessions before judging its result. If all three loop ratings remain low after you have reduced the work and improved the weakest link, another constraint such as sleep or sustained life stress may still be setting the ceiling.",
  mistakes: [
    "Adding another training day because attendance feels like the only variable you can control.",
    "Switching to a harder programme before you know whether the current dose is being recovered from.",
    "Treating completed appointments as proof that the sessions are high quality and ready to repeat.",
    "Taking every set to failure to make a depleted workout feel productive, then carrying more fatigue into the next one.",
    "Changing sleep, food, volume and exercise selection all at once, so you cannot tell which part repaired the loop.",
  ],
  trackNotes: {
    physique:
      "For physique progress, a muscle needs enough high-quality weekly work and enough recovery to repeat it. If you keep attending but arrive flat, a larger split may spread your best effort too thin. Use the audit to spot whether readiness, session length or recovery is lowest, then keep the lagging muscle in the first half of a session while volume is reduced. Once the loop feels repeatable for two weeks, add work gradually and assess visual change over 6–8 weeks.",
    strength:
      "For strength, the loop includes practice quality as well as muscle recovery. Repeatedly lifting when you are under-recovered can make technique less consistent and make a normal training load feel like a test. Keep two focused exposures to the stuck lift if you can recover from them, with one heavier and one easier practice day. If the loop stays low, reduce accessories and hard sets before removing useful practice; progress the lift only when the next exposure starts from a stable baseline.",
  },
  relatedFindings: ["volume_outruns_recovery", "sleep_under_dose", "drive_has_faded"],
};
