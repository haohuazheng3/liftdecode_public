import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "consistency_gap",
  audience: "both",
  category: "consistency",
  title: "Consistent in your head, not on the calendar",
  verdict:
    "You describe your training as steady, yet you miss planned sessions often enough to stall any plan.",
  summary:
    "Early in this diagnostic you called your last few months of training steady. Near the end, you rated how often you miss a planned session well above what steady looks like. Those two answers can't both be true, and the one that decides your progress is the calendar, not the feeling.",
  mechanism: [
    "Consistency isn't a trait; it's a dose. A 4-day programme delivers 16 sessions a month. Miss 4 and you delivered 75% of it; miss 7 and it's just over half. The sessions that get cut short rarely include the hard work planned for the back half. Roughly 10–20 hard sets per muscle per week is the broad range where growth and strength reliably happen; lose a quarter of your sessions and whatever is trained late in the week quietly drops below it.",
    "The missed sessions aren't the whole problem. The bigger one is that they don't register as misses. When you think of yourself as someone who trains steadily, memory files the evidence to match. The session moved to tomorrow and never done becomes 'rescheduled'; the rushed half-session between commitments becomes 'I trained today'. The week feels full while the dose runs thin, and nothing in how it feels tells you otherwise.",
    "This matters more than the raw numbers suggest, because every other fix assumes the programme happened. If you believe you're consistent, a stall must be a programming, effort or food problem, so you change those, and nothing moves, because the variable that actually changed was attendance. As a rule of thumb coaches see over and over, a plain plan done nearly every week beats a clever plan done most weeks. Adherence is the first-order variable, and right now it's invisible to you.",
    "The gaps also carry a physical cost. Strength is partly a skill, and skills compound only when practice is regular; a fortnight with one heavy exposure lets the groove fade. The growth signal from a session lasts a day or two and then settles; a muscle trained once in ten days spends most of that time unstimulated. Neither costs much in a single week, but strung across a few months, the missing sessions add up to a whole block of training that never took place, and it feels exactly like a plateau.",
    "If none of this feels like you, that's the same finding showing up again. Lifters who truly don't miss rarely have to think about it; when gaps have become normal enough not to register, the answer isn't trying harder. It's making the plan small enough that you hit it every week, and making attendance visible so the story is built from the calendar rather than the other way round.",
  ],
  howItShowsUp: [
    "If someone asked whether you're consistent, 'yes' would come out instantly, and you'd mean it.",
    "Sessions get moved rather than skipped, and moved sessions have a way of not happening. In your head they were rescheduled, never missed.",
    "How often a muscle or lift gets trained depends on how the week goes, so the plan on paper and the week you actually live rarely match.",
    "A short session with the first two exercises counts as 'I trained today'; the last hard sets are the part that keeps vanishing.",
    "When life gets loud, training is the first thing to give, and it gives quietly: no decision to skip, just a day that fills up.",
    "Whatever sits in the session most likely to be dropped, a muscle or a lift, is what's lagging most.",
    "You can't easily name a run of four straight weeks recently where every planned session happened in full.",
  ],
  fix: [
    {
      title: "Make attendance something you can see",
      steps: [
        "Tonight, look back over the last 4 weeks and mark each planned session Done, Cut (under 30 minutes or the hard sets skipped) or Missed. That tally is your starting point, not the feeling of being steady.",
        "From now on, mark every planned session Done, Cut or Missed on the day. It isn't Done unless the planned working sets happened.",
        "Every Sunday, count sessions done out of sessions planned. Below 85% in any week, write that number at the top of next week's plan where you'll see it.",
        "Put sessions in your calendar as fixed appointments with a start time. 'Train Thursday' gets moved; 'Thursday 6:30, lower body' gets kept.",
      ],
    },
    {
      title: "Shrink the plan until you stop missing",
      steps: [
        "Cut planned frequency to a number you can hit 4 weeks running. If your look-back showed 4–6 misses out of 16, plan 3 sessions a week; if it showed 7 or more, plan 2. Three sessions done beat five planned.",
        "Inside that smaller plan, train every muscle group or main lift at least twice a week: full-body or upper/lower splits do this in 2–3 sessions, while a 5-day body-part split can't survive missed days.",
        "Keep weekly volume at 10–15 hard sets per muscle group, taken 1–3 reps from failure, spread across the sessions you'll actually do. Each session gets a little longer; the weekly total stays put.",
        "Write a 35-minute emergency version of every session: the main lift or the two most important exercises, 3–4 hard sets each. On days that fall apart, the emergency version counts as Done. Skipping doesn't.",
        "Decide now which session goes first when the week collapses, and make it the least important one. Left to chance, the week always takes the one you need most.",
      ],
    },
    {
      title: "Protect the plan from a stressful week",
      steps: [
        "Anchor sessions to the part of the day stress touches least, usually early morning or straight after work before you get home.",
        "On a high-stress day, run the emergency session instead of deciding whether to train. Removing the decision removes most of the skipping.",
        "Sleep 7–9 hours on the nights before training days where you can; tired and stressed together is when 'I'll go tomorrow' wins.",
        "Keep the smaller plan for 4 weeks at 90%+ before adding anything. A fourth or fifth day is earned by a month where the calendar matches the story.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: mark the last 4 weeks Done / Cut / Missed, pick a frequency you'll keep (2 or 3 days), book the sessions with start times, and write the 35-minute emergency version of each one.",
    "Week 2: run the smaller plan and count it Sunday night. Every muscle or main lift hit twice, hard sets 1–3 reps from failure; any cut or missed session gets written down, not explained away.",
    "Week 3: same plan, aim for 100% again. If week 2 came in under 85%, drop one more session rather than promising to try harder. If it was 100%, add 1–2 hard sets to your weakest lift or muscle.",
    "Week 4: fourth counted week. If attendance held at 90%+ across weeks 2–4, add a session or 2.5–5% on the main lifts for the next block. If not, the plan is still too big; shrink it until it fits your real week.",
  ],
  timeline:
    "The first change you'll notice is honesty: within two weeks you'll see how much of the plan was actually happening, usually less than it felt like. Because you've been under-dosed rather than truly stuck, lifts usually start moving within 3–6 weeks of a full month at 90%+ attendance, and visible physique changes lag by another month or two. Give it 8 steady weeks before you decide anything else is wrong.",
  mistakes: [
    "Adding a fifth training day to make up for the missed ones. More planned sessions with the same attendance means more misses, and a bigger gap to explain away.",
    "Switching programmes again. The programme isn't failing; it isn't being run, and the next one won't be either.",
    "Doubling up the next session to cover a missed one. Two sessions' worth of hard sets in one day gives you one exhausted session and a worse one after it.",
    "Counting a 20-minute 'quick something' as a full session. If the planned hard sets didn't happen, it's a Cut, and Cuts are what this finding is made of.",
    "Promising to be more disciplined. You already believe you are, and that belief is what hides the gaps. A smaller plan with a visible count fixes it; willpower doesn't.",
  ],
  trackNotes: {
    physique:
      "Muscle needs regular exposure more than a perfect split. On a 5-day body-part split with several misses a month, some muscles get trained once every ten days or not at all, and those become your lagging parts. Move to an upper/lower or full-body plan of 3 sessions so every muscle is hit twice a week even in a rough week, and keep protein around 1.6–2.2 g/kg of bodyweight a day so the thin weeks don't cost you tissue.",
    strength:
      "Strength is a skill, and skills fade when practice is sparse. A stuck lift trained once a fortnight loses its groove before it loses force, which is why heavy singles feel heavier than they should. Give each main lift at least two exposures a week, one heavy and one lighter for practice, and protect the heavy one on a bad day. Don't test a max until you've strung 8 steady weeks together; before that, every stall is an attendance result.",
  },
  relatedFindings: ["missed_dose", "week_cancels_itself", "life_is_the_limiter"],
};
