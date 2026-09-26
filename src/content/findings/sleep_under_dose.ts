import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "sleep_under_dose",
  audience: "both",
  category: "recovery",
  title: "You're sleeping under the growth threshold",
  verdict:
    "Your sleep is too short or too broken to recover from the training you're doing.",
  summary:
    "Full nights are the exception for you, not the rule, and it shows up in how you feel waking up or walking into the gym. Everything you do in training is being run through a body that hasn't finished repairing the previous session, which is why sessions start flat, working weights feel heavier than they should and the mirror hasn't moved. You can keep tweaking the program for another year; it will keep stalling on the same short nights.",
  mechanism: [
    "Training is a request, not a result. The set creates a signal; the tissue is rebuilt afterwards, and a large share of that rebuilding happens while you're asleep. Growth hormone pulses cluster in the deep sleep of the first half of the night, and the muscle-building response to a session runs for one to two days on the assumption that you'll rest properly through them. At five or six hours you don't get a slightly smaller window. You get a cut-down one, with the later cycles that consolidate recovery simply missing.",
    "The evidence is more direct than people expect for something treated as a soft variable. In a two-week dieting study, people held to about five and a half hours in bed lost a far larger share of their weight as lean mass, and a far smaller share as fat, than the same people sleeping eight and a half. Short-term sleep-loss studies, usually one to three short nights, show lower strength output and higher perceived effort at the same load. Seven to nine hours is not a wellness suggestion; it's the range where recovery isn't being quietly taxed.",
    "A second cost arrives before any muscle is lost: your effort ceiling drops. Under-slept lifters rate the same load as harder, reach their working sets with lower bar speed and stop further from failure while believing they went as hard as usual. If most growth comes from sets within roughly 0–3 reps of failure, and short sleep quietly pushes your \"hard\" sets to 4–5 reps short, the training you're doing is worth less than it looks.",
    "There's also an appetite and hormone tax. A short week nudges cortisol up and testosterone down, modestly, and raises hunger for quick carbohydrate while lowering the drive to move, so the same person eats a little more, walks less and recovers worse. Stack a stressful stretch, a crisis, or several drinking nights on top and each fragments sleep further. Alcohol is the sharp one: it puts you to sleep faster, then breaks the deep sleep you most need in the back half of the night.",
    "Finally, the way people judge sleep hides it. \"I average about seven\" usually means two long weekend nights carrying five short ones, and a stall is decided by the run of short nights, not the average. If full nights are the exception for you, this is your limiter, whatever the program says. If they happen about half the time alongside waking unrested, sustained stress or heavy drinking, it's still the first fix. If most nights are long enough but you still wake tired, the problem is quality rather than hours, which is where small changes pay off fastest.",
  ],
  howItShowsUp: [
    "A genuinely full night is something that happens now and then, not most nights, and \"I sleep fine\" really means \"I'm in bed for seven hours.\"",
    "Warm-up weights feel heavy, and the top set you hit three weeks ago is now a grind at the same load.",
    "Some mornings the problem is the hours, some it's the quality: you might wake at 3 or 4 a.m., or at the alarm feeling like you haven't slept.",
    "Deadlines, a new baby, a move or a rough stretch at home has been running for weeks, and sleep is what gave way first.",
    "Several nights a week end with a few drinks, and those are the nights you sleep worst even though you fall asleep fastest.",
    "You walk into sessions already flat, and the energy you bring is closer to empty than charged before the first warm-up set.",
    "You keep changing the program or the split, and each change works for a week or two before the same flatness returns.",
  ],
  fix: [
    {
      title: "Set the floor before you touch anything else",
      steps: [
        "Fix a wake time you'll keep seven days a week, including weekends. Count back 8 hours from it; that's your in-bed time. Everything else in this plan bends around that, not the other way round.",
        "Aim for 7.5 hours of actual sleep, which means about 8 hours in bed. Each morning, note whether you got 7+ hours; at the end of the week, count them out of 7.",
        "For the next two weeks, 5 of 7 nights at 7+ hours is the minimum pass and 6 of 7 is the goal. Below 5, the training changes in the next block don't happen yet.",
        "If you're a parent or shift worker and 8 hours in bed isn't on the table, protect a fixed 6.5-hour core and add a 20–30 minute nap before 3 p.m. on training days.",
      ],
    },
    {
      title: "Stop the three things that break the sleep you do get",
      steps: [
        "Alcohol: zero on training nights and the night before a heavy day. Elsewhere, cap it at 2 drinks, finished 3 hours before bed. If you drink most days, halve it this month.",
        "Caffeine: last dose 8 hours before your in-bed time. If you train in the evening on a pre-workout, switch to a non-stimulant or move the session earlier.",
        "Light: phone out of the bedroom, or face down and silent 45 minutes before bed. Room dark enough that you can't see your hand, cool enough that you want the blanket.",
        "Evening sessions: if training ends within 90 minutes of bed, drop the last 15 minutes of accessory work and finish with a walk.",
      ],
    },
    {
      title: "Cut the training to what you can currently recover from",
      steps: [
        "For 2 weeks while the sleep floor is built, cut hard sets per muscle by about a third (15 a week becomes 10) and keep every set 1–2 reps short of failure.",
        "Keep the main lifts and loads, but take the top set to a weight you can hit with 2 clean reps in reserve. Progress by bar speed for these two weeks, not by adding weight.",
        "Move your most important session to the morning after your best sleep night of the week. If you can only control one night, make it that one.",
        "Once you've logged 2 consecutive weeks at 5+ nights of 7 hours, add sets back at 2 per muscle per week and return to normal progression. The stall often breaks here without anything else changing.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: fix the wake time, set the 8-hour in-bed window, and cut hard sets by a third with every set 1–2 reps short of failure. Log nights of 7+ hours as a count; the goal is 5 of 7.",
    "Week 2: keep the window. Alcohol to zero on training nights and no more than 2 elsewhere; last caffeine 8 hours before bed. Expect warm-ups to feel normal again by the end of the week.",
    "Week 3: if you hit 5+ nights in both weeks, add 2 hard sets per muscle back and let top sets go to 1 rep in reserve. If you didn't, hold week 2 and find the night that keeps failing.",
    "Week 4: return to full volume and normal progression. Retest the lift or rep PR that stalled, on the morning after your best night, and compare it to the session where it stalled, not to how you feel.",
  ],
  timeline:
    "Strength expression comes back first: within 7–10 nights of hitting the floor, warm-ups feel like warm-ups again and bar speed on the top set improves at the same load. Visible muscle takes longer; give it 4–6 weeks of 5+ good nights before judging the mirror. If nothing moves after that with the count honestly at 5–6 of 7, the sleep was real but wasn't the only thing, and the next finding on your list is where to look.",
  mistakes: [
    "Adding volume or a harder program to \"push through\" a stall caused by under-recovery. More work needs more sleep, not less.",
    "Reaching for a pre-workout or a second coffee to fix heavy warm-ups. The stimulant lifts the session and takes it out of the following night.",
    "Counting hours in bed instead of hours asleep, or quoting a weekend-inflated average when the stall is decided by the string of short weeknights.",
    "Using alcohol to get to sleep. It shortens the time to fall asleep and fragments the back half of the night where deep and REM sleep should be.",
    "Cutting calories harder because progress has stalled. In a short-sleep week the same deficit costs more muscle and less fat than it would fully rested.",
  ],
  trackNotes: {
    physique:
      "The muscle-building signal from a session lasts roughly 24–48 hours, and every short night inside that window trims it, so a year of under-sleep is a year of half-credited sessions. Give it four weeks of 5+ good nights before you judge whether anything has changed, not this week. If you're in a deficit, this variable decides whether the weight you lose is fat or muscle; fix it before you cut further.",
    strength:
      "Under-slept, you stop sets earlier than you think and rate the same load as heavier, so recent misses on the top set may not be strength you've lost. Don't reset your training max over two weeks of bad sleep. Once 5+ nights land, retest at the old load on a fresh morning before deciding anything about the program. If it's clean, your sticking point was on the pillow, not the platform.",
  },
  relatedFindings: ["life_is_the_limiter", "alcohol_tax", "volume_outruns_recovery"],
};
