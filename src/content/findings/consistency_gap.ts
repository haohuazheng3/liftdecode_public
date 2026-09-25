import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "consistency_gap",
  audience: "both",
  category: "consistency",
  title: "Consistent in your head, not on the calendar",
  verdict:
    "You see yourself as someone who doesn't miss, and last month you missed more sessions than any plan can absorb.",
  summary:
    "At the start you described yourself as reliable, the kind of lifter who doesn't miss. Then, when we asked you to count, the last four weeks held four or more sessions that were skipped, cut short or swapped for something quick, or you couldn't count them at all. Those two answers can't both be true, and the one that decides your progress is the count. Until the story and the calendar agree, every other fix gets applied to a programme that isn't being run.",
  mechanism: [
    "Consistency isn't a trait; it's a number. A 4-day programme delivers 16 sessions a month. Miss 4 and you delivered 75% of the dose; miss 7 and it's just over half. The sessions cut to 25 minutes rarely included the hard work planned for the back half. Roughly 10–20 hard sets per muscle per week is the broad range where growth and strength reliably happen; lose a quarter of your sessions and the muscles trained late in the week quietly drop below it.",
    "The problem is not the missed sessions alone. It's that you don't believe they happened. You answered the identity question in chapter 1, before any counting, and you put yourself in the 'never misses' or 'the odd one' group. That answer is honest, and an identity like that filters memory. The session moved to tomorrow and never done doesn't register as a miss; the 'quick pump' between meetings registers as a session. The count says 4, 6 or 8, and the self-image stays at 'reliable'.",
    "Why does this matter more than the raw dose? Because every other diagnosis assumes the programme happened. If you believe you're consistent, a stall must be a programming, effort or nutrition problem, so you change those, and nothing moves, because the variable that actually changed was attendance. In the studies that tracked adherence alongside training outcomes, the lifters who did most of what was planned progressed; how clever the plan was mattered far less than how much of it got done. Adherence is the first-order variable, and right now it's invisible to you.",
    "There is also a physiological cost to the gaps themselves. Progress in strength comes from practising the lifts often enough for the skill to compound; two weeks with one heavy exposure resets some of that. Muscle protein synthesis after a session is elevated for a day or two, then returns to baseline; a muscle trained once in ten days spends most of that time not being stimulated. Neither costs much in a single week, but strung across the 2+ months you've been stalled, the missing sessions add up to a block of training that never took place, and the log shows it as a plateau.",
    "If you told us you genuinely couldn't count the missed sessions, treat that as the same finding in a different form. A lifter who doesn't miss knows it, because there's nothing to forget; not being able to answer means the gaps have become normal enough not to register. The fix isn't to try harder; it's to measure attendance, so the story is built from the calendar rather than the other way round.",
  ],
  howItShowsUp: [
    "Asked how a training partner would describe you, 'never misses' or 'reliable' came to mind instantly, and you meant it.",
    "Asked to count the last four weeks, you landed on 4–6, 7 or more, or you honestly couldn't say.",
    "Sessions get moved rather than skipped, and moved sessions have a way of not happening; in your head they were rescheduled, never missed.",
    "A 25-minute session with the first two exercises counts as 'I trained today'; the last hard sets are the part that keeps vanishing.",
    "The lifts or body parts trained in the session most likely to be dropped are the ones lagging most.",
    "You've been stuck 2 months or more and can't point to four straight weeks in that time when every planned session happened.",
  ],
  fix: [
    {
      title: "Make attendance a number you can see",
      steps: [
        "Tonight, open the calendar and reconstruct the last 4 weeks honestly: for each planned session write Done, Cut (under 30 minutes or the hard sets skipped) or Missed. That number is your baseline; the identity answer is not.",
        "From now on, label every planned session Done, Cut or Missed before you log anything else. It isn't Done unless the planned working sets happened.",
        "Score every Sunday: sessions done out of sessions planned. Below 85% in any week, the number gets written at the top of the next week's page.",
        "Put the sessions in the calendar as fixed appointments with a start time, not a to-do list. 'Train Thursday' gets moved; 'Thursday 6:30, lower' gets kept.",
      ],
    },
    {
      title: "Shrink the plan until you don't miss",
      steps: [
        "Cut the planned frequency to a number you hit 4 weeks running. If you missed 4–6 out of 16, plan 3 sessions a week; if you missed 7 or more, plan 2. Three sessions done beat five planned.",
        "Keep every muscle group or main lift touched at least twice a week inside that smaller plan: full-body or upper/lower splits do this in 2–3 sessions; a 5-day body-part split cannot survive missed days.",
        "Keep hard-set volume at 10–15 per muscle group per week across the sessions you will actually do, sets 1–3 reps from failure. The volume per session goes up; the weekly total doesn't drop.",
        "Write a 35-minute emergency version of every session: the main lift or the two most important exercises, 3–4 hard sets each. On days that fall apart, the emergency version counts as Done. Skipping doesn't.",
        "Decide now which session gets sacrificed when the week goes wrong, and make it the least important one. Left to itself, the week picks the one you need most.",
      ],
    },
    {
      title: "Let the numbers earn the identity back",
      steps: [
        "Keep the smaller plan for 4 weeks at 90%+ adherence before adding anything. A fourth or fifth day is earned by a month of the count matching the story.",
        "Only once you've strung 8 clean weeks together, judge whether you're still stuck. Most people with this finding aren't stalled; they're under-dosed, and the plateau lifts once the dose lands.",
        "Once a month, answer the partner question again and check it against the calendar. The day the two match, you're consistent.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: reconstruct the last 4 weeks in Done / Cut / Missed, pick a frequency you'll keep (2 or 3), put the sessions in the calendar with a start time, and write the 35-minute emergency version of each one.",
    "Week 2: run the smaller plan and score it Sunday night. Every muscle or main lift hit twice; hard sets 1–3 reps from failure; any cut or missed session gets written down, not explained away.",
    "Week 3: same plan, target 100% again. If week 2 was under 85%, drop one more session rather than promising to do better. If it was 100%, add 1–2 hard sets to your weakest lift or muscle.",
    "Week 4: fourth consecutive scored week. If adherence has held at 90%+ across weeks 2–4, add a session or 2.5–5% on the main lifts for the next block. If not, the frequency is still too high; keep shrinking until the number matches the identity.",
  ],
  timeline:
    "The first change is in the log, not the mirror: within two weeks you'll see how much of the plan was actually happening, usually less than you thought. Because you've been under-dosed rather than truly stalled, the lifts typically start moving again within 3–6 weeks of the first full month of 90%+ attendance, and physique changes lag behind by another month or two. Give it 8 clean weeks before you draw any other conclusion about why you were stuck.",
  mistakes: [
    "Adding a fifth training day to make up for the missed ones. More planned sessions with the same attendance means more misses, and you'll read the bigger gap as needing even more.",
    "Changing the programme again. The programme isn't failing; it isn't being run. The next one won't be either until attendance is measured.",
    "Doubling the next session to make up a missed one. Two sessions' worth of hard sets in one day gives you one tired session and a worse one after it.",
    "Counting a 20-minute 'quick something' as a full session. If the planned hard sets didn't happen, it's a Cut, and Cuts are what this finding is made of.",
    "Promising to be more disciplined. You already believe you are; that belief is the problem. A smaller plan with a visible score fixes it; willpower doesn't.",
  ],
  trackNotes: {
    physique:
      "Muscle needs regular exposure more than it needs a perfect split. On a 5-day body-part split with 4+ misses a month, some muscles get trained once every ten days or not at all, and those become your lagging parts. Move to an upper/lower or full-body plan for 3 sessions so every muscle is hit twice a week even in a rough week. Keep protein at 1.6–2.2 g/kg through the thin weeks so the gaps don't cost you tissue.",
    strength:
      "Strength is a skill, and skills decay when practice is sparse. A main lift trained once a fortnight loses groove before it loses force, which is why top sets feel heavier than the number says. Give each main lift at least two exposures a week, one heavy and one lighter for practice, and protect the heavy one on a bad day. Don't test a max until you've logged 8 clean weeks; before that, every 'stall' is an attendance result.",
  },
  relatedFindings: ["missed_dose", "week_cancels_itself", "program_hopping"],
};
