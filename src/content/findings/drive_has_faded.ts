import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "drive_has_faded",
  audience: "both",
  category: "recovery",
  title: "The drive didn't leave. It got spent.",
  verdict:
    "Your urge to train has faded because the work and life around it are costing more than you are recovering.",
  summary:
    "Training used to give you something back: a good session, a number moving, a reason to look forward to the next one. Lately the urge is muted, and sessions can feel like another demand on a week already full of them. That can look like a character problem, but drive often fades when sleep, stress or training load stay out of balance. If you keep forcing the same output, the work gets flatter while the cost of showing up keeps rising.",
  mechanism: [
    "Motivation is partly a recovery signal. When training repeatedly asks for more than sleep, food and time away from the gym can repay, your body and attention start protecting effort. That does not mean your muscles have stopped adapting or that you have become lazy; it means the same session is arriving on top of fatigue that never cleared. Short sleep, high life stress and a large weekly training load each make ordinary work feel harder. Together they can make even a familiar warm-up feel like a chore, before any deliberate decision about discipline has entered the picture.",
    "A week with more than 10 lifting hours can be productive, but only when the work fits your capacity to recover. If sessions are long, sets often grind, or every week asks for a new best, fatigue can accumulate faster than performance. The early signs are usually ordinary: less eagerness, slower warm-ups, fewer attempts to beat a previous number and a lower sense that training is paying back. Those signs are useful because they show up before you need to miss sessions. Ignoring them and adding more hard work can turn a temporary dip into months of dragging through sessions.",
    "Sleep and life stress change the price of the same programme. A run of 5–6 hour nights leaves less time for physical and mental recovery, while ongoing stress uses attention and energy you would otherwise bring to training. The result is not always soreness or a dramatic performance drop. More often, you arrive with less patience for hard sets and finish with less left for the next day. If your training loop already feels unreliable, a session can become one more thing you survive instead of a signal you can absorb and build on.",
    "Drive also needs a reason to attach itself to the work. If you rarely try to improve a measurable result, every session can feel interchangeable: effort goes out, but there is no clear evidence that it moved you closer to anything. The answer is not to chase a personal record every day. A narrow target, such as adding one clean rep to a lift over six weeks, gives ordinary sessions a visible direction without demanding a breakthrough each time. A small amount of novelty can restore interest, but constant programme changes remove the repeated practice that makes progress visible.",
    "A short deload often separates a spent system from a goal that no longer fits. When accumulated training fatigue is the main issue, several easier days plus enough sleep can make the next session feel more inviting within one or two weeks. If the urge stays low after four weeks of reduced load and better recovery opportunities, the programme may not connect to a goal you care about, or another part of life may be taking priority. Either way, treating low drive as a verdict on your character misses useful information. The cost is usually quiet: sessions done at partial effort, records never attempted, and programme hopping to feel a spark.",
  ],
  howItShowsUp: [
    "You can get yourself to the gym, but the thought of training has little pull and you count down to the end of the session.",
    "Warm-ups feel like another task, and you often finish without attempting the rep or load increase you had planned.",
    "You have been lifting for many hours each week, yet sessions feel less rewarding and the next one starts before you feel ready.",
    "Short nights or a stressful stretch outside the gym coincide with a noticeable drop in the urge to train.",
    "Your programme has no near-term number to improve, so weeks of similar sessions blur together.",
    "You have switched programmes or exercises to get excited again, but the interest fades after a week or two.",
    "A few easier days make training sound appealing again, which suggests accumulated fatigue was part of the problem.",
  ],
  fix: [
    {
      title: "Give fatigue a real chance to clear",
      steps: [
        "Take 5–7 days at about half your normal working sets. Keep familiar exercises and use loads that leave at least 3 reps in reserve; do not take sets to failure.",
        "For the next two weeks, cap lifting at 3 sessions of 45–60 minutes. Remove optional finishers and duplicate accessory work before cutting the main lifts.",
        "Aim for 7–9 hours in bed and keep wake time within about an hour each day. If your current schedule cannot reach that, protect the longest consistent sleep window you can manage.",
        "At the end of each session, rate energy and willingness to train again from 1–5. Compare the trend across the deload and the first normal week, rather than judging one workout.",
      ],
    },
    {
      title: "Reconnect sessions to one result",
      steps: [
        "Choose one six-week target you can measure, such as adding 1–2 reps at a fixed load on a main lift or adding 2.5 kg while keeping the same reps and form.",
        "Write the target next to the relevant lift in your log. Keep the rest of the programme stable so you can tell whether the target is moving.",
        "Plan one small novelty inside the programme, such as a new accessory variation for 3–4 weeks. Keep the main lift and weekly structure familiar.",
        "Decide what counts as a good session before you start: complete the planned work with the intended effort, even if no record appears that day.",
      ],
    },
    {
      title: "Use a rule for pushing and holding",
      steps: [
        "Keep two quality sessions each week as your minimum. On a high-stress or poorly slept day, do the main work at 2–3 reps in reserve and skip optional sets.",
        "Push load or reps only when all planned reps are controlled and your next session starts reasonably recovered. If performance drops twice in a row, hold the load and remove 2–3 sets that week.",
        "After the first two weeks, add back no more than 2 hard sets per week if your energy and next-session readiness are improving.",
        "If the urge remains low after four weeks, change the six-week target or training schedule to fit what you want to achieve now; do not respond by adding more hours.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: deload for 5–7 days with half the usual sets, no failure work and no more than 3 sessions. Set a regular sleep window and rate energy after each session from 1–5.",
    "Week 2: keep sessions to 45–60 minutes and choose one six-week number to improve. Keep the programme familiar, with one small accessory change if novelty would help.",
    "Week 3: hold volume steady if energy is still low; if sessions feel better and the next one starts recovered, add up to 2 hard sets across the week. Progress only the chosen target.",
    "Week 4: review energy, willingness to train and the target lift. If the loop has improved, continue the same plan for two more weeks; if not, reduce another source of load or choose a goal that matters more to you.",
  ],
  timeline:
    "If accumulated fatigue is the main reason your drive faded, the first change is often a lighter warm-up and more willingness to start within 5–14 days of the deload. Performance may take another couple of weeks to feel steady. A new target gives you a direction, but records still depend on practice and recovery. If your urge has not improved after four weeks with less training stress and a more regular sleep window, look at whether the goal and schedule still fit your life before treating the dip as a motivation failure.",
  mistakes: [
    "Watching motivation content to create a temporary burst, then returning to the same workload that drained your interest.",
    "Replacing the whole programme every time training feels flat, so you keep losing the repetition that makes improvement visible.",
    "Using more caffeine or pre-workout to force intensity when the larger issue is a lack of recovery between sessions.",
    "Pushing through every low-energy session at full volume, even after performance and readiness have dipped more than once.",
    "Assuming you are lazy because you do not feel excited, when a week of reduced work and better sleep may change the picture.",
  ],
  trackNotes: {
    physique:
      "For muscle gain or fat loss, a session only helps when you can repeat useful work and recover from it. Low drive can make you cut sets short or drift through the work, so adding more volume is unlikely to rescue a tired block. Keep the minimum dose at 3 focused sessions, preserve protein and your current calorie direction, and judge physique change across 6–8 consistent weeks rather than one flat week.",
    strength:
      "When you stop wanting to chase records, do not turn every session into a test to prove that your drive is still there. Pick one lift and a six-week target based on clean reps or a small load increase, then keep most work submaximal while fatigue clears. If the urge returns after a deload, build from that point. If it stays low, reconsider whether the current lift, schedule or performance target is one you still want to pursue.",
  },
  relatedFindings: ["volume_outruns_recovery", "sleep_under_dose", "life_is_the_limiter"],
};
