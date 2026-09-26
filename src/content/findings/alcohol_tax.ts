import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "alcohol_tax",
  audience: "both",
  category: "lifestyle",
  title: "Alcohol is taxing every session",
  verdict:
    "Your drinking cuts into the sleep and recovery each session depends on.",
  summary:
    "Drinking most days, or big weekends, is enough to blunt what your body does with a session for about a day afterwards and to wreck the deep sleep that follows. At your pattern that lands on a large share of your training week, which is why a programme that should be working keeps stalling. Leave it where it is and every change you make to sets, reps or food will be paying a tax before it reaches you.",
  mechanism: [
    "Training does not build anything on its own. It creates the signal; the next 24–48 hours of repair do the building, and that repair is what alcohol interrupts. In the studies that gave trained people a realistic drinking dose after a hard session, the rise in muscle protein synthesis that normally follows training was cut by roughly a quarter to a third, even when protein was eaten alongside it. The session still happened, the soreness still happened, but a meaningful slice of the adaptation did not. At two or three drinking nights a week, that is two or three sessions paid for at a discount.",
    "The second cost is sleep, and it is the one people argue with most. Alcohol makes you fall asleep faster, which feels like help. Then it fragments the second half of the night: lighter sleep, less REM, more waking, an earlier and more tired morning. Sleep studies show this clearly and it scales with the dose; a heavy sitting spoils the night regardless of time in bed. A run of short or broken nights measurably lowers strength output and blunts the muscle-building response the next day. If your nights are short or broken, this is a large part of why.",
    "Then there is the arithmetic. A drink is around 100–200 calories that does nothing useful, and a regular habit adds up to a real surplus. On a physique track that surplus arrives as fat rather than muscle; on a cut it quietly erases the deficit that good weekdays built. The next-day effect compounds it: after a heavy night people eat more, move less and hit protein less reliably, so the drinking night and the day after both go against you. If your weekdays are tight and weekends loose, the two problems are usually the same nights.",
    "The last piece is the sessions that follow. A heavy night leaves you under-slept, mildly dehydrated and with a nervous system not fully back online. Warm-ups feel heavy, top sets that should be repeatable feel like maxes, and you either grind reps or quietly drop the weight. Coaches see the same pattern again and again: post-weekend sessions lag the midweek ones, the lifts trained after a heavy night never get their scheduled progression, and the lifter concludes they have hit a wall. The wall is on the calendar. At one or two drinks well away from training and bed, the evidence is unremarkable; the dose does the damage. Yours is high enough, often enough, to be the limiter, and it is the cheapest fix in this report.",
  ],
  howItShowsUp: [
    "Drinking on most days, or one big night most weekends, as a settled habit rather than an occasional event.",
    "Waking up unrefreshed: you fall asleep fine but wake in the small hours, or get up feeling as if you never went down.",
    "Full nights of sleep are the exception, and the worst nights tend to be the ones you drank.",
    "Sessions that start flat: low energy from the first warm-up set, especially the day after drinking.",
    "Planned sessions that quietly get skipped, most often the morning after a big night.",
    "Post-weekend sessions where the planned progression never quite arrives, while midweek sessions are fine.",
  ],
  fix: [
    {
      title: "Set a weekly ceiling and cap the sitting",
      steps: [
        "Cap the week at 4 drinks, spread over no more than 2 evenings, and cap any single sitting at 2. The heavy night is the pattern that costs most; two small evenings beat one large one.",
        "Count them. Write the number next to the day on your calendar or phone for the next 4 weeks. People who count drink noticeably less than people who estimate.",
        "If a big night is coming, decide in advance which session it will cost and move that session, rather than turning up to a heavy day two hours of sleep short.",
        "If you drink, eat 30–40 g of protein at the meal alongside it. It does not cancel the effect, but it takes the edge off.",
      ],
    },
    {
      title: "Move the drinks away from the sessions that matter",
      steps: [
        "No alcohol in the 24 hours after your hardest sessions of the week. That is when the muscle-building response is highest and when alcohol takes the biggest bite.",
        "Put your two most important sessions on the mornings that follow your most reliably sober evenings; for most people that is Tuesday and Thursday.",
        "Keep the session before a likely drinking night to low-priority work: accessories, arms, easy conditioning. Never schedule a top set or a PR attempt for the day after.",
        "Finish the last drink at least 3 hours before you plan to be asleep, match each drink with a glass of water, and keep lights-out and wake time the same as on a sober night.",
      ],
    },
    {
      title: "Close the weekend gap in the food",
      steps: [
        "Plan Saturday and Sunday meals on Friday, with protein at 1.6–2.2 g per kg of body weight each day and the first meal of each day locked in.",
        "Treat the drinks as part of the day's calories, not an extra. If you are aiming for a surplus, they replace the last snack; if you are cutting, they replace the evening carbs.",
        "Put the day-after breakfast on the calendar: normal food at the normal time, with protein. The skipped, junk-food morning is where a good weekday run goes to die.",
        "Keep training days after a drinking night on the same food plan as a sober day. The goal is that nothing about the weekend changes what Monday looks like.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: count every drink, cap the week at 4 and any sitting at 2, and move your two hardest sessions to the mornings after your soberest evenings. Nothing else in the programme changes.",
    "Week 2: hold the cap and add the 24-hour rule: no alcohol the day after a hard session. Finish any drink 3 hours before lights-out and keep wake time fixed, even after a late night.",
    "Week 3: with nights less disrupted and mornings more rested, run the planned progression on your main lifts as written. Note whether warm-ups feel normal on post-weekend sessions.",
    "Week 4: look back at drinks, how you slept and how the sessions that used to stall went. If the weekend-adjacent sessions now progress, keep the cap; if not, drop to 2 drinks a week for the next block.",
  ],
  timeline:
    "Sleep and how sessions feel change within a week or two; warm-ups feel normal again and the post-weekend session stops being the bad one. Progress on the bar takes longer, because you are only now getting the full return on each session: expect the main lifts to move again inside 3–6 weeks and body composition to show a clear trend after 6–8. If nothing has shifted by week 6 with the cap genuinely held, alcohol was not the main limiter and the other findings in this report come first.",
  mistakes: [
    "Adding training to make up for it: more sets, an extra session, harder conditioning. That spends more from a recovery budget alcohol is already draining, and usually makes the post-weekend sessions worse.",
    "Compensating with sleep-ins and naps. A long lie-in after a heavy night does not restore the deep sleep you lost, and it shifts the next night, so the debt carries into the week.",
    "Cutting food to cancel the calories while keeping the drinks. You lose the protein and the fuel and keep the part that blocks recovery; on a cut that is the fastest way to lose muscle.",
    "Switching to a cleaner drink or mixer and expecting it to matter. The dose of alcohol is what counts, not the label.",
    "Going dry for a fortnight and then returning to the old pattern. Two clean weeks and two heavy weekends is the same average and the same stall.",
  ],
  trackNotes: {
    physique:
      "Your problem is the double hit: the drinks blunt the response to the session and then add a few hundred calories that arrive as fat rather than muscle. Keep the surplus you need for growth at around 200–300 calories a day, and make the drinks come out of that number rather than sit on top of it. If you are cutting, hold the cap harder; the weekend is usually where tight weekdays get undone.",
    strength:
      "The cost for you is sharpest on the session after a drinking night: the top set is where an under-slept nervous system shows itself first. Put your heaviest exposure of the week, squat, deadlift or the lift you care most about, at least 36 hours after your last drink. Treat any session inside that window as technique and volume work at 80–85%, and do not test on it.",
  },
  relatedFindings: ["sleep_under_dose", "week_cancels_itself", "life_is_the_limiter"],
};
