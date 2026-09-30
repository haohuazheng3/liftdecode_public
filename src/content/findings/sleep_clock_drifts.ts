import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "sleep_clock_drifts",
  audience: "both",
  category: "recovery",
  title: "Your sleep clock moves more than your sleep",
  verdict:
    "Your sleep hours may be adequate, but shifting bed and wake times keep your body from settling into a steady rhythm.",
  summary:
    "You can get seven or eight hours and still wake at 3/10 rested when those hours land at a different time each night. Your body relies on a fairly regular rhythm to line up sleep stages, morning alertness, appetite and training readiness. Late weekends, stress and afternoon caffeine can move the clock while the total hours look acceptable. That mismatch makes recovery less predictable: you may feel ready one day and flat the next, then blame the training plan even though the same session is being run at a different biological time.",
  mechanism: [
    "Eight hours at different times each night do not behave like eight regular hours. Your circadian clock coordinates daily patterns in alertness, body temperature, appetite and hormone signals, including the timing of cortisol and reproductive hormones. Sleep stages also shift across the night, so moving bedtime and wake time can place those stages at less favorable points relative to your internal clock. You may still be in bed for the same duration, yet feel that sleep is lighter or more fragmented. This is why the total hours alone can miss the issue: the body is trying to run a stable daily program while the schedule keeps changing its start time.",
    "The clearest way to understand a large weekend shift is social jet lag. Moving your sleep window by two or more hours can feel like crossing a couple of time zones, then doing it again when Monday arrives. Late nights, drinking and sleeping in make the weekend feel like a reset, but they push the internal clock later and reduce morning light exposure. The first workday then demands an early wake before your body is ready. That shortens sleep even if the previous two nights were long. The repeated swing can leave you carrying a small jet lag into training each week, with alertness and appetite arriving at different times from one session to the next.",
    "The wake time is the strongest practical anchor because morning light helps set the clock for the coming day. A variable bedtime is often a consequence of a variable wake time: sleeping in delays light, shifts the next wave of evening sleepiness later, and makes an early bedtime feel impossible. Trying to force yourself into bed hours before you feel tired rarely solves that. A regular wake time, followed by daylight soon after getting up, makes the next night's sleepy window more predictable over several days. Evening light and late caffeine can push in the opposite direction, so the useful goal is a repeatable pattern, not a perfect bedtime on the first night.",
    "Training readiness and appetite follow this timing too. When sleep and waking drift, the time you feel hungry, focused or physically warm can shift, and the same planned workout may land in a different state each day. Sleep restriction is not required for this to matter: duration can look fine while timing and quality vary. You might have solid sessions after a regular week and then lose bar speed after late weekend nights, despite using the same program. That inconsistency makes progression harder to interpret. A steadier clock gives you a more reliable baseline, so a weak session is more likely to reflect training load, food or stress rather than a moving sleep schedule.",
    "Stress can make the schedule slide because bedtime is the first part of the day that gets traded for unfinished work, screens or social plans. Alcohol can make a late night feel sleepy while fragmenting the rest of the night, and caffeine taken late can postpone sleepiness further. The answer is not to demand an early bedtime regardless of how tired you are. Fix the wake time within a manageable range, get light soon after waking, and use a short repeated wind-down to let bedtime move earlier naturally. Shift workers may not be able to match a standard day schedule; a consistent anchor sleep window is still useful even when the clock hours differ from other people's.",
  ],
  howItShowsUp: [
    "Your bed and wake times move by an hour or two across the week, even when your total sleep seems adequate.",
    "You wake unrested after seven or eight hours and feel noticeably better after the occasional week with a steadier schedule.",
    "Monday feels like a time-zone change after late weekend nights or sleeping several hours later than on workdays.",
    "You are not sleepy at the bedtime you planned, then feel groggy when the alarm forces an early start.",
    "Stress or evening plans keep moving bedtime, while afternoon coffee pushes sleepiness later still.",
    "Your training readiness varies with the clock: a familiar session feels sharp one day and flat at another time.",
  ],
  fix: [
    {
      title: "Anchor the morning first",
      steps: [
        "Choose a wake time you can keep seven days a week, with no more than a 30-minute swing. Pick a realistic time rather than the earliest one you wish you could manage.",
        "Get outdoor light within 10 minutes of waking for 10–20 minutes when possible; on dark mornings, turn on bright indoor lights while you get ready.",
        "Keep weekend wake time within 60 minutes of weekdays. If you had a short night, go to bed earlier the next evening instead of sleeping half the day away.",
        "If you work shifts, protect a repeatable anchor sleep window and use light exposure around the start of your wake period.",
      ],
    },
    {
      title: "Make evenings predictable",
      steps: [
        "Set a 30-minute wind-down with the same three quiet activities each night, such as shower, prepare tomorrow's clothes and read away from bright screens.",
        "Move caffeine earlier and stop it 8 hours before your intended bedtime; if sleep still feels delayed, extend the cutoff to 9 hours.",
        "Keep alcohol away from nights when you need reliable sleep, especially late weekend nights that already shift your schedule.",
        "Do not go to bed hours before you feel sleepy. Keep the wake anchor and let evening sleepiness move earlier over several days.",
      ],
    },
    {
      title: "Protect training while the clock settles",
      steps: [
        "For two weeks, train at roughly the same time of day when your schedule allows, and note the wake time and previous night's duration beside the session.",
        "Avoid max testing after a night that shifted more than two hours from your usual window; use the planned working sets with 1–2 reps in reserve.",
        "If you need a nap, keep it near 20 minutes and finish before 3 p.m. so it does not push bedtime later.",
        "Compare morning freshness and one repeatable training marker weekly rather than judging the clock after a single good night.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: pick a sustainable wake time and keep it within 30 minutes every day. Get light soon after waking and write down bed, wake and caffeine times.",
    "Week 2: keep the morning anchor and add a repeatable 30-minute wind-down. Hold weekends within an hour and move the last caffeine at least 8 hours before bed.",
    "Week 3: keep training times reasonably consistent and compare restedness and session quality with week 1. If bedtime has not moved earlier yet, keep the wake time steady instead of forcing an early night.",
    "Week 4: review the pattern across weekdays and weekends. Keep the smallest routine that holds wake time steady; shift workers should judge consistency against their own anchor window.",
  ],
  timeline:
    "Mornings often begin to feel more predictable after 10–14 days of a steady wake time and morning light. Your bedtime may take longer to move because it follows the clock rather than changing on command. Give the schedule three to four weeks before judging training readiness, especially if weekends were previously shifting by several hours. Compare similar sessions at similar times and note alcohol, caffeine and stress alongside them. If you remain persistently unrefreshed despite a stable schedule and enough time in bed, discuss sleep quality with a doctor rather than continuing to move your bedtime earlier.",
  mistakes: [
    "Sleeping far into the weekend to catch up can move your clock later and make Sunday night harder.",
    "Taking melatonin as a simple bedtime pill without a timing plan can miss the clock-setting role it is sometimes used for; ask a clinician before using it regularly.",
    "Going to bed hours before you feel tired often adds awake time in bed without making the next night more predictable.",
    "Keeping weekday mornings fixed but allowing very late weekend lie-ins recreates the same time-zone shift every week.",
    "Blaming total sleep duration alone overlooks a schedule that changes enough to make those hours poorly timed.",
  ],
  trackNotes: {
    physique:
      "For physique work, look for repeatable pump, appetite and rep quality across sessions rather than expecting one early night to change how you look. A drifting clock can shift hunger and the time you feel ready to train, making food and effort less consistent even when your weekly hours seem adequate. Keep the meal pattern and training plan steady while you anchor wake time. After several weeks, compare similar workouts and how reliably you complete the planned sets; that is a more useful signal than a single unusually good pump.",
    strength:
      "For strength work, place your main lift at a consistent time when possible and compare top sets after similar sleep schedules. A heavy single can feel different when your body clock is still set for a later morning, even if you spent enough hours in bed. Keep the load conservative during the first two weeks and avoid treating a weekend-shifted session as a new strength baseline. Once wake time and morning light have been steady for several weeks, use a familiar working weight to judge whether bar speed and focus have become more reliable.",
  },
  relatedFindings: ["sleep_under_dose", "caffeine_overload", "alcohol_tax"],
};
