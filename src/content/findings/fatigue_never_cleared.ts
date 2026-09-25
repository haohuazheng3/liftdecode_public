import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "fatigue_never_cleared",
  audience: "both",
  category: "recovery",
  title: "Your fatigue has never been cleared",
  verdict:
    "You've pushed every week without a planned easy one, so accumulated fatigue is sitting on top of whatever fitness you've built and hiding it from you.",
  summary:
    "You never take an easy week on purpose, and your body has started telling you about it: warm-ups that feel like working sets, soreness that never quite leaves, sessions you used to look forward to that now feel flat. You've read those signals as proof you're not progressing and pushed harder in response. The strength and muscle you've built are very likely still there; you just can't see them through the fatigue, and every extra week of pushing makes the picture worse.",
  mechanism: [
    "Every hard session leaves two things behind: a small, lasting gain in fitness and a larger, temporary dose of fatigue. What you can express on a given day is roughly the difference between the two. Fitness accrues slowly and fades slowly; fatigue accrues fast and clears in days if you let it. Train hard week after week without backing off and the fatigue line never drops, so what you see in the gym is fitness minus a debt that keeps growing. This is why athletes taper, and why, in the studies that tracked lifters through a week of reduced load, most got stronger during the easy week without adding any training.",
    "The masking is not just a feeling. Under accumulated fatigue, the nervous system recruits the largest, strongest motor units less readily, muscle glycogen sits chronically half-filled, and connective tissue is taking load faster than it can remodel. That is why warm-up weights feel heavy, joints ache, and soreness never fully clears: your first sets land on a system that has not returned to baseline since the last session. That is not weakness; it is recovery running weeks behind.",
    "The trap is what you do with the signal. A flat session reads as a stall, and the natural response is to push harder: add a set, grind the last rep, refuse the easy day. Each of those adds fatigue faster than fitness, so the next session is flatter still. When people say they have been stuck for months, much of that time is often spent in this loop, doing work that would have produced progress if the fatigue had ever been allowed to leave.",
    "Backing off only when you feel wrecked, or only when travel or illness force it, is not managing fatigue. By the time your joints complain or you dread the gym, you are weeks past the point where a planned easy week would have cost nothing. An unplanned break is a full stop rather than a reduction, so you lose the rhythm along with the fatigue. For strength, this is where a heaviest set drops before the strength does. For physique, hard sets quietly stop being hard in the target muscle as technique softens to protect sore tissue. Either way, the stimulus you are paying for is being taxed before it reaches you.",
  ],
  howItShowsUp: [
    "You cannot remember the last time you deliberately took a lighter week while still training; you push every week, or only ease off once you feel wrecked or life forces a break.",
    "Warm-up weights that used to fly now feel like working sets.",
    "Soreness from one session is still there when the next one starts, and it has been that way for weeks rather than days.",
    "Your joints ache during warm-ups even though nothing is injured, and you dread sessions you used to look forward to.",
    "Sessions feel harder and flatter than they used to at the same weights, and that feeling is your main evidence of being stuck.",
    "On the strength track, your heaviest set this week is lower than four weeks ago, with no change in program or bodyweight.",
    "You have been stuck for two months or more, and the harder you push, the worse the numbers look.",
  ],
  fix: [
    {
      title: "Take a real deload this week, not next month",
      steps: [
        "Keep every scheduled session and every main exercise, but halve the working sets: 4 becomes 2, 3 becomes 2, 2 becomes 1. Do not add exercises to fill the time.",
        "Drop the load to 60–70 percent of what you would normally use for that set and rep range, and stop every set 4 or more reps short of failure. The sets should feel crisp and almost too easy.",
        "Keep rep counts the same so the movement pattern stays practised; a deload is a reduction in stress, not a holiday from the lifts.",
        "Sleep 7–9 hours every night this week and eat at maintenance or slightly above. A deload while under-eating and under-sleeping is only half a deload.",
        "Leave the gym feeling fresher than when you arrived, every session, for 5–7 days. If a session leaves you tired, you did too much.",
      ],
    },
    {
      title: "Put the next deload on the calendar before you need it",
      steps: [
        "Schedule a deload every 4–6 weeks if you train 4 or more days a week with most sets within 0–3 reps of failure; every 6–8 weeks if you train 3 days or leave more in reserve.",
        "Pick one deload style and keep it: half the sets at 60–70 percent load, or the usual sets at 50–60 percent with 4–5 reps in reserve. Switching styles each time means you never learn which one you recover from.",
        "Treat the week after the deload as your test week. Lighter warm-ups and better top sets are the fitness you had been hiding, not new strength built in seven easy days.",
        "If you reach a scheduled deload feeling great, take it anyway at a milder version: 70–75 percent load, two-thirds of the sets. Feeling great is what deloads preserve.",
      ],
    },
    {
      title: "Add a fatigue check so you stop guessing",
      steps: [
        "Write one line at the top of every session: how the first warm-up set of the main lift felt, 1–5, where 1 is 'flew' and 5 is 'felt like a working set'. This is your early-warning system.",
        "Two sessions in a row at 4 or 5, or any session where the previous soreness is still fully present, means you pull the next deload forward a week rather than pushing through.",
        "Between deloads, make the last session of each week genuinely easier: 20 percent fewer working sets or 2 extra reps in reserve on everything.",
        "Track your heaviest set on one main lift per week. If it drops two weeks running on the same program, that is fatigue talking, and the answer is a deload, not a new program.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: Deload. Every session, every main exercise, half the working sets at 60–70 percent load with 4 or more reps in reserve. Sleep 7–9 hours and eat at maintenance or above. Start the 1–5 warm-up score.",
    "Week 2: Return to your normal program at pre-deload loads. Note how warm-ups feel and where top sets land; reps should come back at the same weights.",
    "Week 3: Push normally, adding load or reps by your program's rule. Keep the warm-up score and pencil in the next deload for week 6 or 7 depending on how fast the score climbs.",
    "Week 4: Full training week with the lighter final session in place. Compare your heaviest sets to week 2 and to the month before the deload.",
  ],
  timeline:
    "Most people feel the change inside the deload week: warm-ups lighten by day three or four, and the first week back typically produces the best top sets you have seen in a month or two. That early jump is unmasked fitness, not new adaptation, so do not expect it to keep coming at that rate. The real payoff shows over the next two to three months, when planned deloads let each block turn into strength or size instead of leaking into fatigue. If nothing changes after a proper deload plus four normal weeks, look at sleep, food, or volume that is genuinely too high.",
  mistakes: [
    "Taking a full week off instead of a lighter week. You lose the movement practice and the rhythm, the first week back feels worse, and you conclude that resting made you weaker.",
    "Deloading by swapping in a new program or new exercises. The novelty adds its own soreness and fatigue, and you learn nothing about whether the deload worked.",
    "Reducing the load but keeping every set and adding a few because it felt easy. If you finish the session tired, it was not a deload.",
    "Cutting calories during the deload because you are training less. Under-eating in the easy week slows the recovery you were trying to buy.",
    "Reading flat sessions as a sign you need more volume or intensity and adding a day or a set. That is how the fatigue got here.",
  ],
  trackNotes: {
    physique:
      "For you, the biggest cost of unmanaged fatigue is that hard sets stop being hard in the target muscle: form drifts and other muscles take over to protect sore tissue while the log looks the same. Keep isolation work in during the deload but make it easy, and use the week to reset technique and full range of motion. The pump comes back before the tape measure moves; give the next block six to eight weeks before judging size.",
    strength:
      "You're stronger than your last month shows. A heaviest set that has dropped over four weeks with no change in program or bodyweight is almost always fatigue masking strength, not strength that has gone. Deload at 60–70 percent of your working weights, keep the main lifts in every session, and do not test anything until at least the second week back. If a meet or max attempt is coming, run the deload as a taper: trim sets harder and hold the load a touch higher so bar speed stays familiar.",
  },
  relatedFindings: ["volume_outruns_recovery", "sleep_under_dose", "testing_instead_of_training"],
};
