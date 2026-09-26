import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "no_forcing_function",
  audience: "both",
  category: "progression",
  title: "Nothing in your plan forces the weight up",
  verdict:
    "Beating last session isn't the goal of your sessions, so nothing in how you train makes the load or reps climb.",
  summary:
    "Whether your weights come from habit, from how you feel today or from a program on paper, beating last session isn't the point of the session. Even where a program exists on paper, nothing under the bar makes the load or the reps climb. In your first months almost anything is a new demand, so that can carry you for a while. Once your body catches up with the weights you're comfortable with, it stops working, and every month after that you're rehearsing your current level with growing precision.",
  mechanism: [
    "Muscle and strength adapt to a demand slightly bigger than the one they already handle. That is the whole mechanism. Early in a lifter's training, the gap between what they could do and what they are doing is so wide that any half-serious session is an overload; the weight goes up because the body is chasing it. That gap closes fast, and once it has, the demand only grows if you deliberately make it grow — and \"deliberately\" means a rule that fires whether or not you feel like it.",
    "Feel is a poor rule because it is biased in one direction. On a rested day you might add weight; on a normal day you repeat; on a tired day you drop. Average that across a month and the load drifts flat or slightly down, because normal and tired days outnumber fresh ones. \"Whatever's on the bar\" drifts the same way — plates already loaded are, by definition, plates someone found comfortable. Memory is worse: you remember the best sessions, forget the ordinary ones, then round down to be safe.",
    "The evidence here is clear in shape even where the exact numbers vary. In the studies that have looked at self-selected loads, lifters left to choose their own weights settle well below what they could handle, and groups following a written target that rises over the block have consistently out-gained groups doing the same exercises at loads picked by feel. The stimulus isn't the exercise; it's the increment. Without a written next step, you're generating fatigue at an intensity your body has already adapted to.",
    "This is also why the same routine run for months or years stops working. The exercises aren't wrong; a routine without a built-in progression rule simply becomes a maintenance dose. The body keeps exactly what it needs to handle the demand and no more. If the demand hasn't changed in a year, neither will the adaptation. Hard effort at the same load produces the same result every week.",
    "The cost compounds. Small increments every few weeks, held for a year, add up to a clearly heavier bar by the end of it. With no rule, the same year of sessions tends to end at roughly the same bar it started with. You're paying full price in time and recovery for training that isn't converted into progress, and the difference is one written sentence about next time.",
  ],
  howItShowsUp: [
    "Ask yourself what you're going to lift next session and the honest answer is \"the same as usual\" — or \"depends how I feel.\"",
    "Some sessions you load the bar with whatever's already on it, or grab the next dumbbell up only when you happen to think of it.",
    "You finish a session without knowing whether you did more than last time, because beating it was never the goal walking in.",
    "You have a program that sets your weights, but you run it on autopilot: the numbers on the page move, the effort to hit them doesn't.",
    "Every few weeks a new program starts, so no single plan runs long enough to push a number up.",
    "You'd call your training consistent, and it is — consistently the same demand, week after week.",
  ],
  fix: [
    {
      title: "Write the rule down before you touch a barbell again",
      steps: [
        "Pick one progression rule per main exercise and write it on the first page of your log: \"3 sets of 6–8. When all 3 sets hit 8 reps with 1–2 reps in reserve, add 2.5 kg (upper body) or 5 kg (lower body) next session.\" That is a rule. \"When I feel strong\" is not.",
        "Where the smallest jump is too big — dumbbell presses, curls, fixed-stack machines — use rep progression: add 1 rep per set each session until you hit the top of the range, then jump weight and drop back to the bottom.",
        "Set rep ranges by exercise, not by feel: 4–6 or 5–8 for heavy compounds (squat, bench, deadlift, press, rows), 8–12 for machine and dumbbell work, 12–20 for isolation.",
        "If you currently work up to a daily max, cap it: one top set at a fixed weight for a target rep count, then 2–3 back-off sets at 85–90% of it. The target reps go up week to week, not the weight you happen to hit.",
      ],
    },
    {
      title: "Give the rule something to act on: a log with last time in it",
      steps: [
        "Before every set, look at last session — weight, reps, reps in reserve — and write down what you'll do today before you do it. That ten-second act is the forcing function.",
        "Log every working set, not just top sets. Phone notes, a spreadsheet, a $2 notebook — it adds under 2 minutes to a session.",
        "Rate every set for reps in reserve (0–4). Your rule needs to know whether \"8 reps\" was 8 easy or 8 grinding; load only goes up when the reps were there with reserve left.",
        "Once a week, take 5 minutes: for each main exercise, did load or reps rise in the last 2 sessions? If not, either the rule fired and you ignored it, or the rule is broken. Fix whichever it is.",
      ],
    },
    {
      title: "Reset your working weights so the rule can fire",
      steps: [
        "For the first two weeks, drop every main lift to 85–90% of what you've been using. It feels like going backwards; it's a runway so the rule adds weight every session for 4–6 weeks before it gets hard.",
        "Add weight every session the rule allows, even a small jump. Buy fractional plates (0.5–1.25 kg) if your gym has none — micro-loading is how upper-body lifts keep moving once 2.5 kg jumps get too big.",
        "When the rule doesn't fire on a lift for 3 consecutive sessions at the same weight, drop 10% and climb again with the same rule. That's a deliberate reset, not a failure.",
        "If you've run the same routine for years, keep the exercises and change only the progression rule for the first 8 weeks. Swapping exercises now would hide the effect of the one change that matters.",
      ],
    },
  ],
  fourWeekPlan: [
    "Write a progression rule for each main lift, drop loads to 85–90% of current, and log every set with weight, reps and reps in reserve. Add weight only when the rule says.",
    "Follow the rule. Loads should rise every session on most lifts; note which stalled and why. Buy fractional plates if any upper-body lift needs less than a 2.5 kg jump.",
    "You should be back at or slightly above your old working weights. Do your first weekly review: every lift that didn't move in 2 sessions gets a specific reason written down.",
    "Keep going. Where the rule stalls, switch that lift to rep progression at the same weight instead of forcing the jump; where it's firing, leave it alone.",
  ],
  timeline:
    "Weeks 1–2 feel lighter than you can handle — that's the runway. By weeks 3–4 you're back at your old weights and adding to them. Strength and size beyond your previous level shows up around weeks 6–10, once the rule has forced overload long enough for your body to answer. If you've trained the same loads for a year or more, expect 4–6 months of steady increases before the rule starts stalling regularly.",
  mistakes: [
    "Changing exercises or the whole program instead of adding a progression rule. A new split without a rule produces the same plateau at a new set of weights.",
    "Adding weight by feel again after a good week and skipping the log. The rule only works if the log decides, not your mood.",
    "Starting at your old max weights on day one instead of building a runway. You'll be back at a stall in two sessions.",
    "Treating a daily max as progression. Testing the ceiling isn't raising it; the ceiling rises from the reps and sets below it.",
    "Setting a rule that's too aggressive — 5 kg on bench every session — then abandoning it when it fails in week 2. The right increment is the one you can sustain for 8 weeks.",
  ],
  trackNotes: {
    physique:
      "Your muscle only knows whether the demand grew. Rep progression is your primary tool: one more rep per set at the same weight is a real overload and the safest way to progress isolation and machine work. Visible change lags the rising numbers by 6–10 weeks, so judge the first two months by whether the rule keeps firing. If your lifts climb for 8 weeks and your body still isn't changing, that becomes a nutrition question.",
    strength:
      "Work up to a heavy single at most once every 3–4 weeks; otherwise the top set sits at a fixed weight for a target rep count, and that count is what climbs. Percentage-based and RPE progressions both work — pick one and hold it for 12 weeks. A stall on one lift after 4 weeks on the rule is a technique or sticking-point question; a stall across every lift is a recovery question.",
  },
  relatedFindings: ["testing_instead_of_training", "program_hopping", "never_heavy_enough"],
};
