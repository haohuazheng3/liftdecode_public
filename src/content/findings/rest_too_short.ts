import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "rest_too_short",
  audience: "both",
  category: "effort",
  title: "You're resting for cardio and lifting for muscle",
  verdict:
    "Your rest periods are cutting reps from every set after the first, so the volume in your log is bigger than the volume your muscles actually received.",
  summary:
    "You keep the session moving, you leave the gym breathing hard, and the log says you did four sets of eight. But sets two, three and four were decided by your lungs and the acid in your legs, not by the muscle you were trying to train. That gap between recorded volume and effective volume is where months of honest work have quietly gone missing.",
  mechanism: [
    "A working set has one job: to make the target muscle produce high force through its last few reps. That only happens if the muscle arrives at the set with enough fuel to do it. The fast energy system that powers heavy reps refills over minutes, not seconds. In the studies that compared roughly one minute of rest with three or more, the short-rest groups lost reps on every set after the first, and the drop grew as the session went on. The bar weight was identical; the stimulus was not.",
    "Think of your session as two ledgers. The first is what you wrote down: sets, reps, load. The second is effective volume: the sets that actually carried the muscle within a few reps of failure at a meaningful load. With two to three minutes of rest, the two ledgers match closely. With under a minute, they diverge from the second set onward. You either cut reps to survive, drop the load to keep the reps, or grind out ugly reps limited by breathing rather than by the muscle. All three shrink the second ledger while leaving the first untouched.",
    "This is why the pattern feels productive. Short rest produces a burn, a pump and a heart rate that reads like effort. Those are signals of metabolic stress and cardiovascular demand, not of mechanical tension on the muscle fibres, and mechanical tension is the strongest and most reliable driver of growth and strength we know of. The pump is real. It is just not the thing that makes the muscle bigger or the bar move.",
    "If you also stop sets with four or more reps in reserve, the two problems compound. Rest that is too short pulls the ceiling down; stopping early means you never even reach that lowered ceiling. And if you take every set to failure, short rest makes each subsequent failure arrive at a lower rep count, so the fatigue cost stays maximal while the stimulus keeps falling. Either way the muscle receives a fraction of what the log claims.",
    "For strength this is even less forgiving. A heavy set of squats or deadlifts is a skill expressed under load, and the nervous system needs three to five minutes to be ready to express it again. A 60-second rest before a heavy triple is not a strength stimulus; it is a fatigue test that you are guaranteed to lose, and the missed or ugly reps then teach your technique to fail under exactly the conditions you are trying to get strong in.",
  ],
  howItShowsUp: [
    "You keep your rest under 60 seconds on purpose, or you have simply never timed it and it is shorter than you think.",
    "Your first set is your best set by a wide margin, and every set after it loses one or two reps at the same weight.",
    "You feel wrecked and out of breath after a compound lift, but the target muscle is not the thing that quit.",
    "You have been using roughly the same weights for months while your conditioning has quietly improved.",
    "Your last set of the day is a grind that ends with 4 or more reps still available, because you were breathing too hard to find out.",
    "On the strength track, your heavy sets feel heavier as the session goes on even when the plan says the weight should be manageable.",
    "You take every set close to failure and the rep count collapses across the session instead of holding steady.",
  ],
  fix: [
    {
      title: "Time every rest and make it long enough to work",
      steps: [
        "Start a phone timer at the end of every working set this week. No estimating. If you have never timed it, you will be surprised how short 60 seconds is after a genuinely hard set.",
        "Rest 3 minutes between working sets on squats, deadlifts, presses and rows. Rest 4–5 minutes before any set of 5 or fewer reps at a heavy load.",
        "Rest 90 seconds to 2 minutes on isolation work such as curls, lateral raises, leg extensions and cable work. These recover faster because the load and the muscle mass involved are smaller.",
        "Rest until your breathing is normal and you feel you could repeat the previous set's reps. If you finish the timer and you are still puffing, it was not long enough; add 30 seconds next time.",
        "Keep the session length the same by cutting the exercise list, not the rest. Four exercises done properly beat seven done on a stopwatch.",
      ],
    },
    {
      title: "Reset your loads and then earn them back",
      steps: [
        "For the next two sessions, keep the weight where it is and simply see how many reps each set now gets with full rest. Expect sets two and three to come up by 1–3 reps on their own.",
        "If your sets now hold steady at the same reps across all sets, that is proof the rest was the limiter. Add 2.5 kg on upper-body lifts or 5 kg on lower-body lifts the following week.",
        "Take each set to 1–3 reps in reserve, not 4–6 and not zero on everything. With real rest, you can actually get there; the bar slowing down is your cue, not the timer.",
        "Log reps per set, not just total sets. A session of 8, 8, 8 at the same weight is a different session from 8, 6, 5, even though both look like three sets.",
      ],
    },
    {
      title: "Put the conditioning where it belongs",
      steps: [
        "If you like the elevated heart rate, add 15–20 minutes of easy cardio after lifting or on a separate day. Do not buy it with rest periods.",
        "If you only have 45 minutes, superset opposing movements (a press with a row, a curl with a triceps extension) with 60–90 seconds between each, so each muscle still gets 2–3 minutes before it works again.",
        "Keep intense conditioning at least 6 hours away from your heavy lower-body session, and ideally on a different day.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: Time every rest. Keep all loads unchanged, rest 3 minutes on compounds and 90–120 seconds on isolation work, and write down reps per set so you can see the difference from your old sessions.",
    "Week 2: Same loads, same rest. Push each set to 1–3 reps in reserve now that you are recovered enough to reach it. Your later sets should match your first set within a rep.",
    "Week 3: Where reps held steady across all sets, add weight: 2.5 kg on upper-body lifts, 5 kg on lower-body lifts. Keep rest at 3 minutes; on any set of 5 or fewer reps, rest 4–5 minutes.",
    "Week 4: Continue progressing where reps allow. Compare your reps per set at the same weight against Week 1; the recovered volume you are now doing is your new baseline, and progression is measured from here.",
  ],
  timeline:
    "The first change is immediate: in your first properly rested session, sets two onward will get more reps at the same weight. That is not new strength yet; it is recovered volume. Real strength on the bar usually starts showing within 3–6 weeks as the recovered reps convert into load. Visible physique change lags further, because you are only now delivering the effective volume that was missing, so give it 8–12 weeks of consistent effective sets before judging by the mirror.",
  mistakes: [
    "Adding a fifth and sixth set to make up for the lost reps. That makes the recorded volume bigger and the session longer while the effective volume barely moves.",
    "Dropping the weight so every set still hits the target reps on short rest. You have kept the numbers tidy by removing the tension that made the sets worth doing.",
    "Switching to supersets or circuits for everything because the session is now too long. Pairing opposing muscles is fine; running the same muscle back to back with no rest is the original problem in a new outfit.",
    "Treating a big pump or a high heart rate as evidence the session worked. Neither is a growth or strength signal; the reps you got close to failure at a real load are.",
    "Taking every set to absolute failure now that you are rested. Long rest gives you the option to reach failure; it does not make failing every set a good idea.",
  ],
  trackNotes: {
    physique:
      "The pump is seductive, and short rest gives you a lot of it. But in the comparisons that have been run, longer rest with the same sets and reps produced at least as much growth and usually more, because each set carried more tension. If you want the metabolic feel, keep it for the last set of an isolation exercise, and give every compound set the full three minutes. Your target muscle needs effective sets, not sweaty ones.",
    strength:
      "Rest is part of the dose. A heavy single, double or triple needs 4–5 minutes, and your top set should be the one you are most recovered for, not the one you happen to reach after warm-ups on a 60-second clock. Fatigue from short rest also corrupts technique on the very reps you need to be crisp, so expect your bar path and your consistency to improve once the rest is fixed, not only your numbers.",
  },
  relatedFindings: ["sets_end_too_early", "failure_every_set", "target_muscle_underdosed"],
};
