import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "rom_shrinking",
  audience: "both",
  category: "technique",
  title: "Your range shrank as your weight rose",
  verdict:
    "Some of your past progress was range of motion quietly leaving the lift, and now that there's none left to give, the real wall has arrived.",
  summary:
    "The numbers in your log went up for a while, and you took that as strength or growth. Part of it was; the rest was the bottom of each rep getting shallower, the setup drifting, the last reps getting shorter — the weight climbing while the muscle's job got smaller. That trade runs out, and when it does it looks exactly like a stall, except the number you're stuck at was never fully earned.",
  mechanism: [
    "A lift is not a number; it's a load moved through a specific distance in a specific position. Change the distance and you've changed the exercise, even if the plates and the name stay the same. This is the quietest way to fake progress: a squat that loses two inches of depth as the bar gets heavier, a row that stops pulling the elbow past the torso, a curl that never straightens. On paper it's a PR. In the body it's a smaller job done with a bigger weight.",
    "For physique goals this matters more than most people think. In the studies that compared full-range training with partial-range training, and especially the ones that emphasised the stretched position against the shortened half, the lengthened portion produced as much or more growth per set — often more. Muscle appears to respond most to being loaded while long. Cutting the rep short at the bottom to keep the weight moving removes exactly the part that was doing the most work. You keep the effort and the fatigue; you lose a disproportionate share of the stimulus.",
    "For strength goals the mechanism is specificity: you get strong where you practise. If the bottom of your squat has gradually disappeared, the position that limits a full-depth squat has been untrained for months while the bar says otherwise. When you finally have to hit depth, the lift is weaker than the log claims and it fails where you haven't been. Daily maxing and past-failure reps accelerate this, because both reward whatever gets the bar up, and a shorter rep always gets the bar up.",
    "A setup that changes week to week does the same thing by another route. Stance, grip and bar position each shift the range and the leverage: a wider stance shortens the squat, a wider grip shortens the press. If those vary session to session, the lift you're 'progressing' is a different lift each time. You can't detect a stall in something with no consistent baseline, and you can't fix a weak position you never load the same way twice.",
    "None of this means you were lying to yourself. Range creeps out under load because the nervous system is solving one problem — get this weight up — and a shorter rep is the cheapest solution. It happens rep by rep, below the threshold of noticing, which is why the trigger for this finding was a video and not a feeling. Part of your progress was real and part was borrowed; the stall is the loan coming due.",
  ],
  howItShowsUp: [
    "On video, the last two reps of a set would be visibly shorter than the first two, and this month's top set shallower than the same weight three months ago.",
    "Your stance, grip width or bar position aren't the same from week to week; you set up by feel.",
    "On rows, curls and presses you stop short of the fully stretched position, because going all the way down would mean dropping the weight.",
    "By the last reps there's swing, bounce or a hip hinge helping the bar up, and the bottom of the rep goes first.",
    "You take sets past the point where form holds, or work up to a daily max most sessions, and the rep that 'counts' keeps getting uglier.",
    "When a heavy rep fails, it doesn't fail cleanly — hips shoot, back rounds, elbows flare — in the position you've been skipping.",
  ],
  fix: [
    {
      title: "Re-baseline: find out what you can lift through the full range",
      steps: [
        "This week, film the last working set of every main lift from the side at hip height. Watch it at half speed and compare the deepest point of rep one with the last rep; if they differ, the range is shrinking within the set.",
        "Write a one-line range standard per lift that you can check on video: hip crease below the knee, bar touches the chest and pauses, elbow passes the torso on a row, full elbow extension at the bottom of a curl.",
        "Retest your working weight against that standard. Expect to lose 10–20% on the lifts where the range shrank most. That's the real baseline; the old one was measuring something else.",
        "Fix the setup at the same time: one stance width, one grip width, one bar position per lift, written in the log. They don't change for 8 weeks.",
      ],
    },
    {
      title: "Make the full range the thing that gets progressed",
      steps: [
        "Add a 1-second pause at the bottom or stretched position on every rep of your main lifts for 4 weeks: in the hole, on the chest, at the fully lengthened point on rows and curls. A pause makes a short rep impossible to log as complete.",
        "A rep that misses the standard doesn't count. Log 8 full reps, not 10 with two short ones, and hold the weight next session if range was the reason you fell short.",
        "Progress only when every rep of every set meets the standard at 1–2 reps in reserve, then add 2.5 kg on upper-body lifts or 5 kg on lower-body lifts.",
        "Stop working sets at 1–2 RIR, not past failure. The reps after form breaks are the ones that shorten, and they train the shortened version.",
        "If you've been maxing out most sessions, cap top sets at RPE 8 for 4 weeks and put the work into 3–5 back-off sets at 80–85% of that, all full range with the pause.",
      ],
    },
    {
      title: "Keep it honest after the reset",
      steps: [
        "Film the last set of each main lift once a week, permanently. Thirty seconds of watching is the only reliable check; feel is what let the range leave.",
        "Every 4 weeks, compare this week's video with the one from 4 weeks ago at a similar weight. Same depth, same setup, more load or reps is real progress. More load with less depth means the loan is back.",
        "If a lift keeps losing range at the bottom, treat that position as a weak point and add 2–3 sets a week of a variation that lives there: pause squats, deficit pulls, deep-stretch rows, incline curls.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: film every main lift, write a range standard per lift, lock stance, grip and bar position, and retest working weights against the standard. Accept the drop in load without changing anything else.",
    "Week 2: run the new weights with a 1-second pause at the bottom of every rep, working sets at 1–2 RIR, no maxing out. Log only reps that meet the standard.",
    "Week 3: add 2.5–5 kg on any lift where every rep met the standard last week; hold everything else. Add 2–3 weekly sets of a bottom-position variation on the lift that lost the most range.",
    "Week 4: keep progressing by the same rule, then film the last set of each lift and compare it with week 1 at the same weight. Same range, more load or reps is the first honest PR of this block.",
  ],
  timeline:
    "The first two weeks feel like going backwards, because the log numbers are smaller and the reps harder; that's the range being paid back, not strength lost. Most people see the full-range weights climbing again by week 3–4, and by weeks 6–8 they're back at or past the old numbers with reps that count. On the physique track, growth from finally loading the stretched half lags the strength — give it 8–12 weeks of consistent full-range work before judging the mirror.",
  mistakes: [
    "Keeping the old weight and 'trying harder to hit depth' — the load was chosen for the short rep, and it wins every time the set gets hard.",
    "Adding volume to force progress, which adds more shortened reps and more fatigue for the same missing stimulus.",
    "Treating the stretched position as dangerous and avoiding it entirely, when the fix is to load it deliberately at a weight you control.",
    "Filming once, feeling embarrassed, and never filming again — the range drifts back within a month if nobody is watching.",
    "Chasing a daily max to prove the old number was real. It was real for the rep you were doing; the question is whether it's real for the rep you want.",
  ],
  trackNotes: {
    physique:
      "The half of the rep you skipped is the half that grows the muscle. The fully lengthened position under load is where the evidence points for the biggest response per set, and stopping short to keep the weight moving removes it. Expect to drop isolation loads by 15–25% once you own the stretch, and expect the muscle to feel it in a way it hasn't for months.",
    strength:
      "Your problem is specificity: the test standard is a fixed range and you've been training a shorter one, so the lift fails in a position you don't visit. Pause reps at the sticking point plus a locked setup fix both. If your lift fails by form collapse rather than a clean miss, that collapse is the body finding a shorter path — cap top sets at RPE 8 and spend the block making every rep look like the first one.",
  },
  relatedFindings: ["nobody_has_seen_your_lift", "testing_instead_of_training", "sticking_point_untrained"],
};
