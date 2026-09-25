import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "failure_every_set",
  audience: "both",
  category: "effort",
  title: "Every set to failure is burning your progress",
  verdict:
    "You're generating more fatigue than stimulus, and the fatigue is showing up as a stall.",
  summary:
    "You are not under-training. You take basically every set to the wall, often past the point where form holds, and you never plan a week to let that debt clear. The last grinding rep costs far more than it builds, and the bill arrives as heavy warm-ups, soreness that never leaves, and numbers that haven't moved in months. Left alone, this pattern doesn't plateau politely; it drifts backwards while you work harder than everyone around you.",
  mechanism: [
    "Failure is a tool, not a setting. The evidence is fairly consistent that most of the growth stimulus from a set lives in the last few reps before failure, roughly the 0–3 reps-in-reserve zone. But the studies that compared sets stopped a rep or two short with sets taken all the way to failure found the gains were similar, while the failure groups reported more soreness, bigger drops in performance the next session, and slower recovery. In other words, the final rep buys you almost nothing extra and charges you a lot. Do that on every set, every session, and the price compounds.",
    "Fatigue and fitness are two separate accounts. A hard set deposits a small amount of adaptation and a larger amount of fatigue. Adaptation is slow to show and slow to fade; fatigue is fast to build and, if you let it, fast to clear. Progress is what you see when fatigue drops below fitness. If you never let fatigue drop, your logbook is measuring your tiredness, not your strength. That is why the same weights that felt solid three months ago now feel heavy in the warm-up, even though nothing about your muscle has actually shrunk.",
    "Going past failure with form breaking adds a second problem. Once the target muscle can no longer complete the rep, the load shifts to whatever can: the low back on a squat, the front delts and elbows on a bench, momentum on a row. The muscle you were trying to train stops receiving tension and your connective tissue starts absorbing it. Tendons and joints adapt far more slowly than muscle, so this is the kind of debt that shows up as achy warm-ups and lifts you quietly avoid. Meanwhile, the deep fatigue from those reps cuts reps from every set that follows.",
    "Short rest makes the whole thing worse. When you rest 60–90 seconds and 'fail' on set three, most of that failure is the previous set's oxygen debt and acid, not a true limit of the muscle. You get the sensation of a maximal set, and the fatigue of one, while the actual mechanical work done at high tension is smaller than the same set would produce after three minutes. You end up training hard by feel and easy by physics, which is the worst possible trade.",
    "Then there is the deload you never take. Fatigue does not clear on its own if you keep adding to it every week. Lifters who push every session without a planned easier week tend to end up in a shallow, permanent hole: never injured enough to stop, never fresh enough to progress. The first time you clear it properly, the numbers you 'lost' usually come straight back within a couple of weeks. That is not new strength. It was there the whole time, buried under fatigue you kept topping up.",
  ],
  howItShowsUp: [
    "'Basically every set' goes to failure, and a set that stops early feels like a wasted set.",
    "Your last rep often looks nothing like your first: hips shoot up, elbows flare, a spotter touches the bar, then you stop.",
    "Warm-up weights feel heavy, and you sometimes know by the second set that the session isn't going anywhere.",
    "Soreness never fully clears; you're training on top of last session's soreness more weeks than not.",
    "You've never planned an easier week. You back off only when you feel wrecked or a joint complains, then push again the moment it eases.",
    "Rest between sets is 60–90 seconds or less, so each set starts still breathing hard from the last one.",
    "Your logbook shows the same weights or a slow slide over the last 8–12 weeks, despite effort that most people would call extreme.",
  ],
  fix: [
    {
      title: "Reset the fatigue first (this week)",
      steps: [
        "Take a real deload for the next 7 days: keep every exercise, cut working sets by half, drop the load to 60–70% of what you've been using, and finish every set with 4–5 clean reps in reserve.",
        "Keep the sessions, movements and frequency. The goal is to stay in the groove while fatigue clears, not to take a week off and come back detrained.",
        "Sleep is part of the deload: aim for 7–9 hours on at least 5 of the 7 nights. This is the week your body actually gets to use the work you've been doing.",
      ],
    },
    {
      title: "Put failure back on a leash",
      steps: [
        "Default every working set to 1–3 reps in reserve: the bar slows, it's clearly hard, and you stop while the next rep would still have looked like the last one.",
        "Allow true failure on at most the final set of one isolation or machine exercise per session, never on squats, deadlifts, or overhead presses, and never with form breaking.",
        "Adopt a hard rule: the moment a rep changes shape (hips rise, elbows drift, back rounds), the set is over. That rep counts as your failure signal, not as a rep you got.",
        "Rest 2–3 minutes between working sets on compounds, and 3–5 minutes on your heaviest sets. Time it on your phone; 'feels like enough' is almost always 60–90 seconds.",
        "Calibrate once every 3–4 weeks by taking one safe set (a machine or a dumbbell isolation) to genuine failure, so your 1–3 RIR estimate stays honest without paying the fatigue tax every day.",
      ],
    },
    {
      title: "Build progress into the plan instead of the pain",
      steps: [
        "Restart after the deload at roughly 85–90% of your recent working weights, and add 2.5 kg (upper) or 5 kg (lower) per week, or 1 rep per set, while every set still ends at 1–3 RIR.",
        "Schedule the next deload now: every 5–6 weeks, one week at half the sets and about 70% load. Put it in your calendar before you feel you need it.",
        "Cap hard sets at 10–20 per muscle per week (physique) or 10–15 heavy sets per lift per week (strength). If you're above that with every set near failure, cut sets before you cut intensity.",
        "Track two things only: load × reps of your first working set each week, and whether warm-ups felt normal.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: Deload. Same exercises and frequency, half the sets, 60–70% of recent loads, 4–5 reps in reserve on everything, timed 2–3 minute rests. Note how warm-ups feel on day 1 versus day 7.",
    "Week 2: Return at 85–90% of pre-deload working weights with every set ending at 2–3 RIR. Rest 2–3 minutes on compounds, up to 5 on your heaviest sets. Zero sets to failure this week.",
    "Week 3: Add 2.5–5 kg or 1 rep per set. Sets end at 1–3 RIR; one isolation set per session may go to clean failure. Log first-set load × reps and compare to week 2.",
    "Week 4: Progress again by the same step. If two consecutive sessions on the same lift both stall with warm-ups feeling heavy, that is your signal to bring the next deload forward; otherwise book it for week 6.",
  ],
  timeline:
    "Expect warm-ups to feel lighter by the end of the deload week and your old working weights to feel controlled again within 2–3 weeks of returning. Those first 'gains' are fatigue clearing, not new tissue, so don't over-credit them; the real test is whether you can keep adding small amounts in weeks 4–8 without the heaviness returning. Genuine new strength or muscle typically shows over 8–12 weeks, and it keeps showing because you are no longer digging a hole every session.",
  mistakes: [
    "Adding more volume because 'nothing is working', which pours more fatigue onto a stall that fatigue caused.",
    "Taking a full week off instead of a deload, then returning to the same every-set-to-failure pattern and repeating the cycle.",
    "Swapping failure for forced reps, drop sets, and rest-pause on every exercise, which is the same intensity debt under a different name.",
    "Treating 1–3 RIR as 'going easy' and drifting back to 0 RIR within a fortnight because the sets didn't hurt enough to feel legitimate.",
    "Cutting rest even shorter to make the session feel harder, which trades mechanical tension for breathlessness.",
    "Deloading only the lifts that hurt while keeping everything else at failure, so systemic fatigue never actually clears.",
  ],
  trackNotes: {
    physique:
      "For muscle, the stimulus you want is high-tension reps near failure, not the collapse itself. Keep compounds at 2–3 RIR and reserve occasional true failure for the last set of a machine or cable exercise where form can't shift the load elsewhere. If you've been running 20+ sets per muscle to failure, halve the sets first; 12–16 honest sets at 1–3 RIR will likely out-grow 24 that fall apart.",
    strength:
      "Strength is skill under load, and grinding reps rehearse bad positions. On squat, bench, deadlift, and press, stop the moment bar speed visibly drops on a second rep in a row and treat that as your RIR signal. Keep top sets at 1–2 RIR, back-off sets at 3 RIR, and let true maxes be tested at the end of a block after a deload, not discovered accidentally on a Tuesday. Expect your first post-deload session to feel suspiciously light; that is the strength you actually had.",
  },
  relatedFindings: ["fatigue_never_cleared", "rest_too_short", "volume_outruns_recovery"],
};
