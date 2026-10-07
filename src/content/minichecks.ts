import type { MiniCheckConfig } from "@/components/tools/MiniCheck";

/**
 * Quick checks that sit on the first screen of the self-diagnosis pages. Each names the most
 * likely cause from a few one-tap answers and hands over to the full diagnosis. Causes mirror the
 * engine's bottleneck families (effort, progression, dose, fuel, recovery, consistency) so the
 * quick answer never contradicts what the full diagnosis will say. Red flags send people to a
 * clinician, not the quiz.
 */

export const NOT_GAINING_MUSCLE: MiniCheckConfig = {
  id: "mini-not-gaining-muscle",
  eyebrow: "Quick check: why aren't you growing?",
  cta: "Get the full diagnosis",
  questions: [
    {
      id: "effort",
      prompt: "How close to failure do your hard sets end?",
      options: [
        { label: "1–2 reps left, or failure" },
        { label: "3–4 reps left", add: { effort: 1 } },
        { label: "I stop when it burns", add: { effort: 3 } },
        { label: "Not sure", add: { effort: 1 } },
      ],
    },
    {
      id: "progress",
      prompt: "Over the last two months, have your weights or reps gone up?",
      options: [
        { label: "Yes, steadily" },
        { label: "A little", add: { progression: 1 } },
        { label: "No, same numbers", add: { progression: 3 } },
      ],
    },
    {
      id: "scale",
      prompt: "Your scale weight over the same two months:",
      options: [
        { label: "Rising slowly" },
        { label: "Flat", add: { fuel: 2 } },
        { label: "Going down", add: { fuel: 3 } },
        { label: "Rising fast" },
      ],
    },
    {
      id: "sets",
      prompt: "Hard sets a week for the muscle you most want to grow:",
      options: [
        { label: "Under 6", add: { dose: 3 } },
        { label: "6–10", add: { dose: 1 } },
        { label: "10–20" },
        { label: "Over 20", add: { recovery: 1 } },
      ],
    },
    {
      id: "sleep",
      prompt: "Sleep on a normal night:",
      options: [
        { label: "Under 6 hours", add: { recovery: 3 } },
        { label: "6–7 hours", add: { recovery: 1 } },
        { label: "7 hours or more" },
      ],
    },
  ],
  causes: {
    effort: {
      title: "Your sets end too early",
      body: "Muscle grows from the last few hard reps of a set. Stopping three or more reps short, or when it burns, leaves most of the stimulus on the bar.",
    },
    progression: {
      title: "Nothing is pushing the numbers up",
      body: "If the weights and reps have not moved in two months, the muscle has no reason to adapt. You need a rule for when to add reps or load.",
    },
    fuel: {
      title: "You are not eating enough to grow",
      body: "A flat or falling scale means there is no energy left over to build tissue. A small, steady surplus is usually the missing piece.",
    },
    dose: {
      title: "Too few hard sets for that muscle",
      body: "Under about six hard sets a week, most trained muscles barely get enough work to grow. Ten or more is a better starting point.",
    },
    recovery: {
      title: "Recovery is short",
      body: "Short sleep blunts the gains from good training. Under six hours a night is enough on its own to stall progress.",
    },
  },
  clear: {
    title: "Nothing obvious here",
    body: "Effort, progression, food, volume and sleep all look reasonable. The cause is usually in the details these questions cannot see.",
  },
};

export const NOT_GAINING_WEIGHT: MiniCheckConfig = {
  id: "mini-not-gaining-weight",
  eyebrow: "Quick check: why won't the scale move?",
  cta: "Get the full diagnosis",
  questions: [
    {
      id: "tracking",
      prompt: "Do you track what you eat?",
      options: [
        { label: "Yes, every day" },
        { label: "Roughly", add: { tracking: 1 } },
        { label: "No", add: { tracking: 2 } },
      ],
    },
    {
      id: "trend",
      prompt: "Your scale over the last 3–4 weeks:",
      options: [
        { label: "Flat", add: { intake: 2 } },
        { label: "Slowly down", add: { intake: 3 } },
        { label: "Up and down, no trend", add: { noise: 2 } },
        { label: "Up slowly" },
      ],
    },
    {
      id: "appetite",
      prompt: "Your appetite:",
      options: [
        { label: "Rarely hungry", add: { appetite: 3 } },
        { label: "Normal" },
        { label: "Always hungry", add: { intake: 1 } },
      ],
    },
    {
      id: "activity",
      prompt: "Cardio, sport or physical work:",
      options: [
        { label: "Little" },
        { label: "A few hours a week", add: { activity: 1 } },
        { label: "Most days, or a physical job", add: { activity: 3 } },
      ],
    },
    {
      id: "meals",
      prompt: "Meals on a normal day:",
      options: [
        { label: "1–2", add: { appetite: 2, intake: 1 } },
        { label: "3", add: { intake: 1 } },
        { label: "4 or more" },
      ],
    },
    {
      id: "flag",
      prompt: "Are you losing weight without trying, with tiredness, thirst or other new symptoms?",
      options: [{ label: "No" }, { label: "Yes", add: { medical: 5 } }],
    },
  ],
  causes: {
    intake: {
      title: "You eat less than you think",
      body: "A flat or falling scale is the only honest calorie count. Add about 300 kcal a day and check the two-week average again.",
    },
    appetite: {
      title: "Appetite is the bottleneck",
      body: "When you are rarely hungry, calories have to come easy: an extra meal, liquid calories and denser food, not bigger plates.",
    },
    activity: {
      title: "Your activity eats the surplus",
      body: "Hours of cardio, sport or physical work can burn more than the extra you eat. Eat for the active days, not the average.",
    },
    tracking: {
      title: "You are guessing the numbers",
      body: "Without tracking, it is easy to eat a big day and a small day and think it averaged out. Two weeks of logging settles it.",
    },
    noise: {
      title: "Water is hiding the trend",
      body: "Daily weight swings by a kilo or more. Weigh every morning and judge the weekly average, not single days.",
    },
    medical: {
      title: "Talk to a doctor first",
      body: "Losing weight you did not plan to lose, with new symptoms, needs a medical check before any diet change. This is not a training problem.",
      urgent: true,
    },
  },
  clear: {
    title: "The basics look covered",
    body: "If the scale still will not move with this picture, the full diagnosis can check training, sleep and recovery alongside food.",
  },
};

export const OVERTRAINING: MiniCheckConfig = {
  id: "mini-overtraining",
  eyebrow: "Quick check: overtrained or under-recovered?",
  cta: "Find what is really draining you",
  questions: [
    {
      id: "performance",
      prompt: "Has your performance dropped for two weeks or more, despite rest days?",
      options: [
        { label: "No" },
        { label: "A little", add: { load: 1 } },
        { label: "Yes, clearly", add: { load: 3 } },
      ],
    },
    {
      id: "change",
      prompt: "Recent change in your training:",
      options: [
        { label: "None" },
        { label: "More sets or days", add: { load: 2 } },
        { label: "A new, harder program", add: { load: 2 } },
      ],
    },
    {
      id: "sleep",
      prompt: "Sleep lately:",
      options: [
        { label: "7+ hours, solid" },
        { label: "6–7 hours", add: { sleep: 1 } },
        { label: "Under 6, or broken", add: { sleep: 3 } },
      ],
    },
    {
      id: "food",
      prompt: "Eating compared with before:",
      options: [{ label: "Same or more" }, { label: "Less, or dieting", add: { fuel: 3 } }],
    },
    {
      id: "stress",
      prompt: "Stress outside the gym:",
      options: [{ label: "Normal" }, { label: "High", add: { stress: 2 } }, { label: "Very high", add: { stress: 3 } }],
    },
    {
      id: "symptoms",
      prompt: "Low mood, frequent colds or a resting heart rate that stays high for weeks?",
      options: [
        { label: "No" },
        { label: "Some of it", add: { load: 1 } },
        { label: "Yes, for weeks", add: { medical: 3 } },
      ],
    },
  ],
  causes: {
    load: {
      title: "Training load outran recovery",
      body: "This is overreaching, not true overtraining: a lighter week, then a smaller step up in sets, usually brings performance back within weeks.",
    },
    sleep: {
      title: "Sleep debt, not overtraining",
      body: "Short sleep makes normal training feel like too much. Fix the hours before you cut the program.",
    },
    fuel: {
      title: "You are under-fuelled",
      body: "Training hard on less food looks exactly like overtraining. Eating back to maintenance is often the whole fix.",
    },
    stress: {
      title: "Life stress is the extra load",
      body: "Work, family and money stress draw on the same recovery as training. Hold volume steady until life calms down.",
    },
    medical: {
      title: "Get checked by a doctor",
      body: "Weeks of low mood, frequent illness or a high resting heart rate overlap with medical causes such as anaemia or thyroid problems. Rule those out first.",
      urgent: true,
    },
  },
  clear: {
    title: "Probably not overtraining",
    body: "Nothing here points to it. True overtraining syndrome is rare; a bad week or two is usually just a bad week or two.",
  },
};

export const BENCH_PLATEAU: MiniCheckConfig = {
  id: "mini-bench-plateau",
  eyebrow: "Quick check: why did your bench stall?",
  cta: "Get the full diagnosis",
  questions: [
    {
      id: "frequency",
      prompt: "How often do you bench (any variation)?",
      options: [
        { label: "Once a week", add: { frequency: 3 } },
        { label: "Twice a week", add: { frequency: 1 } },
        { label: "3+ times" },
      ],
    },
    {
      id: "progression",
      prompt: "How do you add weight?",
      options: [
        { label: "Planned jumps or rep targets" },
        { label: "When it feels easy", add: { progression: 2 } },
        { label: "I don't; same weight", add: { progression: 3 } },
      ],
    },
    {
      id: "sticking",
      prompt: "Where does the bar slow down?",
      options: [
        { label: "Off the chest", add: { technique: 2 } },
        { label: "Halfway or near lockout", add: { triceps: 2 } },
        { label: "Nowhere; I just can't add weight", add: { progression: 1 } },
      ],
    },
    {
      id: "accessories",
      prompt: "Triceps and shoulder work each week:",
      options: [{ label: "None", add: { triceps: 2 } }, { label: "A few sets", add: { triceps: 1 } }, { label: "Plenty" }],
    },
    {
      id: "bodyweight",
      prompt: "Your bodyweight lately:",
      options: [{ label: "Steady or rising" }, { label: "Dropping (cutting)", add: { fuel: 3 } }],
    },
  ],
  causes: {
    frequency: {
      title: "You bench too rarely",
      body: "Once a week is enough to keep a bench, rarely enough to build one past the beginner stage. Two or three sessions is the usual fix.",
    },
    progression: {
      title: "No progression rule",
      body: "Adding weight when it feels easy means you rarely add it. A rep target (say 3 sets of 5–8) with a fixed jump when you hit the top keeps it moving.",
    },
    technique: {
      title: "The bottom of the lift leaks",
      body: "A bar that stalls off the chest usually means a loose setup: shoulder blades, arch and leg drive, and the bar path at the touch.",
    },
    triceps: {
      title: "Triceps are the weak link",
      body: "A bench that slows halfway up or near lockout often points to the triceps. Add close-grip bench or dips: if they climb and the bench follows, that was it.",
    },
    fuel: {
      title: "You are benching on a cut",
      body: "Holding your bench while losing weight is a win. Strength can still creep up in a deficit, but muscle gain mostly waits until you eat at maintenance again.",
    },
  },
  clear: {
    title: "No single cause stands out",
    body: "Frequency, progression, weak points and food look fine. The full diagnosis checks effort, recovery and sleep as well.",
  },
};

export const SORENESS: MiniCheckConfig = {
  id: "mini-soreness",
  eyebrow: "Quick check: is this soreness normal?",
  cta: "Find what slows your recovery",
  questions: [
    {
      id: "trigger",
      prompt: "What came before the soreness?",
      options: [
        { label: "A new exercise or program", add: { novelty: 3 } },
        { label: "Back after a break", add: { novelty: 3 } },
        { label: "More sets or weight than usual", add: { jump: 3 } },
        { label: "Nothing changed", add: { recovery: 1 } },
      ],
    },
    {
      id: "duration",
      prompt: "How long has it lasted?",
      options: [
        { label: "1–3 days" },
        { label: "4–5 days", add: { jump: 1 } },
        { label: "A week or more", add: { recovery: 2 } },
      ],
    },
    {
      id: "sleep",
      prompt: "Sleep lately:",
      options: [{ label: "7+ hours" }, { label: "Under 7 hours", add: { recovery: 2 } }],
    },
    {
      id: "frequency",
      prompt: "How often do you train that muscle?",
      options: [{ label: "Every week" }, { label: "Rarely or irregularly", add: { novelty: 2 } }],
    },
    {
      id: "flag",
      prompt: "Dark or cola-coloured urine, swelling that keeps growing, or pain far beyond a hard workout?",
      options: [{ label: "No" }, { label: "Yes", add: { urgent: 5 } }],
    },
  ],
  causes: {
    novelty: {
      title: "Normal soreness from something new",
      body: "New movements and returns from a break make the most soreness. It peaks one to three days later and shrinks after the second or third session.",
    },
    jump: {
      title: "You added too much at once",
      body: "A big jump in sets or load buys soreness, not extra growth. Add a set or two a week instead of five at once.",
    },
    recovery: {
      title: "Recovery is lagging",
      body: "Soreness that lingers a week or comes without any change points at short sleep, low food or too little time between sessions.",
    },
    urgent: {
      title: "Get medical help today",
      body: "These are warning signs of rhabdomyolysis, a muscle breakdown that can damage the kidneys. Do not train; see a doctor or urgent care now.",
      urgent: true,
    },
  },
  clear: {
    title: "Ordinary soreness",
    body: "Nothing here looks unusual. Light movement, sleep and normal meals help; soreness itself is not a sign the workout worked.",
  },
};
