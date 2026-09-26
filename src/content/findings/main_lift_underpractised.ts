import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "main_lift_underpractised",
  audience: "strength",
  category: "volume",
  title: "Not enough practice on the lift itself",
  verdict: "You don't train your stuck lift often enough to get better at it.",
  summary:
    "You want a bigger number on one specific lift, but that lift gets trained once a week or on no fixed rhythm, usually inside a training week that is lighter than most lifters run. That is enough to keep a trained lifter where they are, not to move them. Missed sessions thin the practice further, and many lifters find the bench and overhead press respond especially well to more frequent practice. Left alone, this is the kind of plateau that lasts years, because nothing you are doing is wrong: there is just not enough of the one thing that counts.",
  mechanism: [
    "A maximal lift is two things at once: a muscle-and-tendon system that has to be strong enough, and a motor skill that has to be rehearsed enough. Both respond to dose. The muscular side follows the volume-response curve you know from hypertrophy work; the skill side works like any other skill: the nervous system gets better at exactly the positions, bar speeds and loads it practises, and drifts on the ones it does not. Under 5 heavy sets a week gives neither side enough signal. Five to nine keeps the door open, but only if they land often enough to be rehearsal rather than a weekly test.",
    "Frequency matters, though not in the way it is often sold. When studies hold weekly sets equal and only change how many sessions they are split across, frequency on its own makes little measurable difference to strength. Where it earns its place is indirect. First, spreading the work makes a bigger weekly dose tolerable: ten hard sets in one session tend to lose quality by the last few, while five on each of two days stay sharp. Second, every session is a rehearsal of the exact skill. One session a week is 52 practice sessions a year on a lift you want to master; two is 104. When the lift appears only once, every session opens with a re-groove: the first sets go to finding the bar path again, and the heavy sets that follow are fewer and shakier than they need to be.",
    "An irregular rhythm and missed sessions do more damage here than anywhere else. If the lift lives on one day and that day is the one that gets skipped, the gap is not a week but two, and the skill resets a little each time. If the day moves around with the week, some stretches bring two sessions close together and others leave ten days or more between touches. Either way the lift never gets the steady, repeated exposure a motor skill needs to settle in.",
    "How heavy those sessions are is a separate question. If your working sets on the lift rarely get close to your max, that is its own bottleneck and it has its own section of the report (never enough heavy practice); this one is about how often the lift gets rehearsed at all.",
    "This stalls quietly because maintenance looks like health: you are not getting weaker, not hurt, and your accessories are progressing. But below a threshold of regular, specific practice the priority lift simply holds. Doubling the practice is usually only three or four extra sets and one extra day — until it happens, nothing in your programme is asking that number to move.",
  ],
  howItShowsUp: [
    "The lift shows up on one day a week, and some weeks that day is the one that gets skipped or shortened.",
    "Which days the lift lands on depends on the week, so there are stretches of ten days or more without touching it.",
    "Your training week is lighter than most lifters run, so the handful of sets on the lift are most of the practice it gets.",
    "The first heavy set of each session feels unfamiliar: you spend it finding your setup, your depth or your bar path rather than pushing weight.",
    "The lift feels about the same every time you come back to it: not worse, not better, just familiar enough to hold.",
    "A missed session means the lift simply does not happen that week, rather than moving to another day.",
  ],
  fix: [
    {
      title: "Set the weekly dose on the lift itself",
      steps: [
        "Pick one priority lift for the next 8–12 weeks. Not two, not the whole powerlifting total — one.",
        "Target 8–12 working sets a week on that lift at 75% of max or heavier. If you are under 5 now, go to 8 this week, not 12; the jump from 4 to 12 is where lifters get beaten up.",
        "Count only the real lift and its closest variations — pause squat for squat, competition-grip bench for bench, conventional pulls for deadlift. Leg press, Smith machine and dumbbell work do not count.",
        "Keep total weekly volume roughly flat: take 2–4 sets from accessories or a lift you are not prioritising so the extra sets fit without wrecking recovery.",
        "Put the lift on fixed days in your calendar. If a session is missed, move the lift to the next training day rather than dropping it; the weekly dose is the one thing that does not get skipped.",
      ],
    },
    {
      title: "Split it across the week",
      steps: [
        "Move from one day to two on the lift, spaced by at least 2 days (e.g. Monday and Thursday). If you are already at two and stuck, a third, lighter day is worth trying; many lifters find the bench in particular responds to it.",
        "Day 1 is the heavy day: 3–5 sets of 2–5 reps at 80–90%, stopping 1–2 reps short of failure on every set.",
        "Day 2 is the practice day: 4–6 sets of 3–6 reps at 70–80%, same setup, same depth, same bar speed intent, no grinding. This day is about rehearsing positions, not chasing PRs.",
        "If the lift is squat or deadlift and you are worried about fatigue, make Day 2 a close variation like pause squats at 70–75% — still the same bar, stance and depth.",
        "The lift goes first after warm-ups on both days, never at the end of the session.",
      ],
    },
    {
      title: "Make every session a rehearsal",
      steps: [
        "Warm up with the same fixed ladder every session (e.g. bar × 8, then three or four jumps of shrinking reps up to your first working set) so the setup is rehearsed under load before it counts.",
        "Treat every rep, including warm-ups, as competition-style: same stance, same grip, same depth, same brace. The nervous system learns whatever you rehearse most.",
        "Write your setup down as a short checklist (feet, grip, breath, brace, first movement) and run it before every set until it is automatic.",
        "Film your top set once a week from the side and compare bar path against last week. You are looking for the same groove, not a different one.",
        "For how heavy those sets should be, follow the loading guidance in the heavy-practice section if it appears in your report; here the goal is frequency and consistency.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: pick the one lift, fix the two days it lands on, and move to two days a week at 8 working sets — a heavy day (3–4 sets of 3–5 at ~80%) and a practice day (4 sets of 5 at ~72%). Trim accessories to make room.",
    "Week 2: keep both days, add one set to each (10 total), and nudge the heavy day to 82–85% for sets of 3. Film the top set from the side.",
    "Week 3: 10–12 sets across the week; heavy day at 85% for 3 sets of 2–3, practice day at 75% for 5 sets of 4. Bar speed on the practice day should look identical to week 1 with more weight.",
    "Week 4: hold at 10–12 sets, work up to a single at ~90% on the heavy day (no grinding), then back-off sets of 3 at 80%. Compare the single's bar speed to any recent heavy attempt — that is your first real read on whether the number is moving.",
  ],
  timeline:
    "Expect the lift to feel worse for the first one to two weeks: the extra frequency exposes how unpractised the setup was, and soreness will run higher than usual. By weeks 3–4 the setup should feel automatic and the same loads will move faster — watch for that before any number moves. A trained lifter who fixes a genuine practice deficit usually sees a measurable increase in the 6–10 week range, often 2.5–7.5 kg on an upper-body lift and 5–15 kg on a lower-body lift, fastest in the first cycle and slower after.",
  mistakes: [
    "Adding the extra sets as more variations or machines instead of the actual lift, which keeps the dose on the muscles but not on the skill.",
    "Jumping from under 5 sets to 15 or more in one week, then interpreting the resulting joint aches and grinding sets as proof that \"more volume doesn't work for me\".",
    "Adding a second day and using it to work up to a max, so the lift is now tested twice a week and practised zero times.",
    "Keeping the lift once a week but making that day brutal — failure sets, forced reps, drop sets — which adds fatigue without one extra rehearsal of the pattern.",
    "Adding the second day but letting it be the first thing dropped in a busy week, so the lift quietly slides back to once a week.",
    "Rotating the variation every few weeks for \"novelty\", so the lift never gets long enough at any one version for the groove to settle in.",
  ],
  relatedFindings: ["never_heavy_enough", "testing_instead_of_training", "program_hopping"],
};
