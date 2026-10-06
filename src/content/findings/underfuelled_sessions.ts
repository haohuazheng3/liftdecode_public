import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "underfuelled_sessions",
  audience: "both",
  category: "nutrition",
  title: "Your sessions are running on empty",
  verdict:
    "Your carbohydrate intake is low for the training and activity you are asking it to support.",
  summary:
    "You can be consistent and still arrive at the hard part of a session without enough usable fuel. When carbs stay below roughly 2 grams per kilogram while lifting volume and cardio are high, or the last meal is hours behind you by the time you train, sets that should build on each other can start losing quality: muscles feel flat instead of full, focus fades, legs feel weak, and later work turns into survival. That costs you the reps and load that make the plan productive, while making a training problem look like a motivation problem.",
  mechanism: [
    "Hard sets draw on several energy systems, but repeated work in the roughly 6–20 rep range leans heavily on muscle glycogen: carbohydrate stored in the muscle. A hard session can lower glycogen in the muscles you trained, and meals between sessions help restore it. If intake stays under about 2 grams per kilogram while you lift for 7–10 hours a week and stay highly active outside the gym, there may not be enough carbohydrate to refill the tank before the next demand. The result is not that every set suddenly fails; it is that repeated sets, later exercises, and the next session can become less reliable. Stored glycogen also holds water inside the muscle, which is part of why a well-fed muscle looks and feels full and pumps easily, and a depleted one feels flat.",
    "Brain fog or a sudden drop in strength during training is not proof that your blood sugar is dangerously low, and it does not mean you lack discipline. It can be a sign that the session is asking for more fuel than you have available, especially after a long gap without food or during a demanding week. Between meals your liver keeps blood sugar steady from its own glycogen store, and that store runs down overnight and across long gaps, so a fasted session, or one that comes five hours after lunch, starts with less in reserve. Low carbohydrate availability can also contribute to central fatigue: your brain and nervous system reduce how much hard work feels possible. You may stop a set earlier, lose focus between sets, or feel your legs go soft even though the target muscle has not done enough quality work. If weakness, dizziness, or other symptoms keep happening away from training, see a doctor.",
    "Your total activity matters. Carbohydrate has to cover lifting, cardio, and the movement your day adds, so an intake that feels adequate on a quiet day can come up short across an active week. Losing weight can tighten that margin further because you are eating less overall. The useful concept is energy availability: after exercise, enough energy still needs to remain for ordinary body functions and recovery. When that margin is repeatedly small, sleep, training readiness, and recovery can suffer. If your menstrual cycle changes while dieting or training hard, speak with a doctor; do not treat that change as a normal cost of getting leaner.",
    "The stall compounds through training quality. Glycogen helps support repeated hard efforts, so a low-fuel session can mean fewer clean reps, slower bar speed, and less useful work after the first demanding sets. If those sessions feel bad, the tempting response is to add volume, force every set, or cut more food because bodyweight is not moving fast enough. Each choice can deepen the mismatch: you ask for more output while leaving less fuel for it. A better first test is to improve carbohydrate timing and total intake enough to restore session quality, then judge whether the program itself needs to change.",
    "Low carbohydrate intake does not mean you need to abandon a fat-loss goal or eat without structure. The target depends on body size, total workload, and the size of any calorie deficit; 3–5 grams per kilogram on training days is a practical starting range for an active lifter, not a universal prescription. You can get there with familiar foods such as rice, oats, potatoes, bread, beans, and fruit. Keep protein steady and place more of your available carbohydrate near training. If you are losing weight, use a smaller deficit and accept a slower rate when needed to keep sessions productive.",
  ],
  howItShowsUp: [
    "Your focus and energy drop in the middle of sessions, even when you were ready to train at the start.",
    "Legs feel soft or floaty during hard work, and later exercises lose reps faster than expected.",
    "Your muscles look and feel flat in the gym, and the pump that used to arrive after a few sets never quite comes.",
    "You lift several hours a week and stay active, but most days include little rice, oats, potatoes, bread, or fruit.",
    "You try to diet while keeping training volume and cardio high, then wonder why recovery and performance both flatten.",
    "Warm-ups are acceptable, but repeated sets feel disproportionately hard and bar speed fades as the session goes on.",
    "You respond to flat sessions by adding caffeine or more work instead of checking whether the session has enough fuel behind it.",
  ],
  fix: [
    {
      title: "Put carbohydrate around the work",
      steps: [
        "For two weeks, start near 3 g of carbohydrate per kilogram on training days; if you are already there and sessions remain flat, move toward 4–5 g/kg. At 75 kg, that is about 225–375 g across the day.",
        "Eat about 1 g/kg, or 75 g at 75 kg, 2–3 hours before lifting. Rice, oats, bread, potatoes, or fruit all count; choose portions that sit comfortably.",
        "For sessions longer than 75 minutes, try 30–60 g of carbohydrate during training from a drink, fruit, or another easy option.",
        "Keep your usual protein target steady while you adjust carbs. Add or move carbohydrate first instead of replacing protein with it.",
      ],
    },
    {
      title: "Match the deficit to your week",
      steps: [
        "If you are losing weight, use a modest average deficit, roughly 250–400 calories a day, rather than cutting hard every day while maintaining high activity.",
        "Place more of your carbohydrate on lifting days and around the session; use rest days for a slightly lower intake if that makes the weekly target easier.",
        "Choose rice, potatoes, oats, fruit, beans, and bread as routine sources. You do not need greasy or ultra-processed food to reach a useful carb intake.",
        "If bodyweight is falling faster than about 0.5–0.75% per week and performance is sliding, add 150–250 calories a day and reassess after two weeks.",
      ],
    },
    {
      title: "Measure whether the session has come back",
      steps: [
        "For each of the next 10 sessions, note pre-session food, focus, the reps on your main work sets, and whether weakness or floatiness appeared.",
        "Keep the program and working loads stable for two weeks so you can tell whether better fueling changes performance.",
        "If your sessions have been consistently poor, reduce hard sets by about 20% for one week while keeping the main lifts familiar.",
        "Once focus and reps stabilize for two weeks, resume normal progression. If symptoms persist, or happen outside exercise, get medical advice.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: add carbohydrate to the meal 2–3 hours before each session and aim for about 3 g/kg on training days. Keep protein and the training plan steady; log focus and working-set reps.",
    "Week 2: keep the same target and add 30–60 g during sessions that run longer than 75 minutes. If you are dieting, move some calories from rest days toward training days rather than cutting further.",
    "Week 3: compare the last five sessions with the five before them. If focus and repeated-set quality have improved, keep the intake; if not, add about 0.5 g/kg on training days and review sleep and total workload.",
    "Week 4: hold the approach and judge the trend in performance, recovery, and bodyweight together. If bodyweight is dropping quickly and performance remains down, raise daily intake by 150–250 calories before changing the program.",
  ],
  timeline:
    "Focus and the feeling of repeated sets can improve within several sessions once carbohydrate is available before and during hard work. Recovery between sessions may take 2–3 weeks to feel more dependable, especially if you have been dieting or doing substantial cardio. Give the change at least two consistent weeks before judging it. If your training quality improves but body composition is still not moving the way you want, adjust the weekly calorie balance without returning to a deficit so aggressive that the sessions flatten again.",
  mistakes: [
    "Training fasted before a long or hard session and treating the likely drop in focus as a toughness test.",
    "Switching to very low carbohydrate eating while expecting repeated high-rep sets and high weekly activity to feel unchanged.",
    "Adding more sets or cardio to solve a performance problem that may come from too little fuel for the current workload.",
    "Using caffeine to mask a flat session while leaving the meal before training unchanged.",
    "Assuming every useful carbohydrate source is junk and making a manageable diet harder than it needs to be.",
  ],
  trackNotes: {
    physique:
      "A low-fuel week can make a cut look productive on the scale while your training loses the reps that help retain muscle. Keep protein steady and put a larger share of your carbohydrate before and after lifting. Judge the cut by the combination of weekly bodyweight, waist, and session quality; if weight is falling quickly and your reps keep dropping, a smaller deficit is usually the better trade than more cardio. Rice, potatoes, oats, fruit, and bread can all fit a fat-loss phase.",
    strength:
      "Heavy singles do not use glycogen in the same way as long accessory blocks, but the work that builds your base still needs repeatable fuel. Low carbohydrate availability often shows up as a session that starts acceptably and fades across back-off sets, rows, squats, or higher-rep accessories. Keep your top single submaximal while you test the change, and compare the same work sets across two weeks. If focus or sudden weakness persists outside training, see a doctor rather than trying to out-eat or out-train it.",
  },
  relatedFindings: ["electrolytes_running_low", "cardio_eating_the_budget", "strength_leaking_bodyweight"],
};
