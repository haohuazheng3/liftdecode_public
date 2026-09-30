import type { FindingContent } from "../types";

export const FINDING: FindingContent = {
  id: "protein_below_target",
  audience: "both",
  category: "nutrition",
  title: "Your protein is below what your bodyweight needs",
  verdict:
    "Your daily protein is low for your bodyweight and the muscle you want to build or keep.",
  summary:
    "Your training can create a strong reason for your body to build and repair muscle, but protein supplies the amino acids used to do that work. At less than about 1.2 grams per kilogram, or around 1.2–1.6 while dieting or trying to gain muscle, the daily total may be too small to support the goal consistently. If you also eat less than planned on many days, the gap is larger than your usual estimate, and progress has less raw material to work with.",
  mechanism: [
    "Resistance training makes muscle more responsive to protein for roughly a day or two, but the session does not build tissue by itself. Muscle protein synthesis rises after training when enough essential amino acids are available, while muscle protein breakdown continues in the background. Across the full day, the balance depends on both the training signal and the material coming in. For most lifters, roughly 1.6–2.2 grams of protein per kilogram per day is a useful range; lower intake can leave that repair and growth response under-supported, particularly when your bodyweight is high relative to your daily protein total.",
    "The protein meta-analyses place the point where extra protein tends to offer diminishing returns near 1.6 g/kg for many people, with a practical upper range around 2.2 g/kg to cover individual variation. That is not a switch that turns growth off below the line. It is a way to set a robust target. If you are eating under about 1.2 g/kg, especially while lifting consistently, you have more room to improve your intake than someone already near the top of the range. The gains come from meeting a useful daily total repeatedly, not from one unusually large shake or dinner.",
    "A calorie deficit raises the value of getting the basics right because your body has less total energy to allocate while you try to keep lean tissue. A target around 2.0–2.4 g/kg can be reasonable for some lifters during a cut, though the exact need depends on leanness, deficit size, and how the calculation is framed. If you are dieting, do not read a moderate protein intake as permission to cut calories further. Keep the deficit manageable, keep lifting, and use enough protein to support muscle retention. If the goal is muscle gain, a calorie surplus still matters; protein alone cannot replace missing energy.",
    "Distribution makes a daily total easier to use and easier to achieve. A meal with roughly 0.3–0.4 g/kg of high-quality protein gives most people a substantial dose, so three or four protein-containing meals can cover the day without forcing a giant dinner. Older lifters may benefit from the higher end per meal because muscle can respond less strongly to a small dose with age. A protein-containing snack before bed is a practical option if dinner is early or the daily total is short, but it is optional. The main lever remains the amount you actually eat across the whole day.",
    "Food tracking estimates are imperfect, and the intake bands cannot tell you the exact number you need. Eating less than planned on several days can make a weekly average meaningfully lower than a typical day suggests. Start by checking five ordinary days, including a weekend day, so you can see whether the gap comes from portions, skipped meals, or a menu that is low in protein by default. Then use repeatable portions and a few convenient foods. Once the habit is reliable, you can stop counting if you prefer; consistency matters more than permanent app use.",
  ],
  howItShowsUp: [
    "Your usual daily protein works out below roughly 1.2 g/kg, or only 1.2–1.6 g/kg while you are dieting or prioritizing muscle gain.",
    "Some meals are built around bread, cereal, snacks, or vegetables, with no clear protein portion to anchor them.",
    "You often finish the day short because a missed meal or an unplanned busy stretch removes one of your few protein servings.",
    "You rely on a shake after training but have little protein at breakfast or lunch.",
    "You have lifted for years and training is reasonably consistent, but an easy nutrition lever is still below a useful range.",
    "You are cutting weight and have reduced food across the board, so protein falls at the same time as calories.",
  ],
  fix: [
    {
      title: "Set a bodyweight-based target",
      steps: [
        "Multiply your bodyweight in kilograms by 1.6–2.0 for a muscle-building or maintenance starting range. At 90 kg, that is about 145–180 g per day.",
        "If you are in a calorie deficit, start around 1.8–2.2 g/kg; at 90 kg, that is about 160–200 g. Use the lower end if a higher number makes the diet difficult to sustain.",
        "For one week, check five normal days in a food log, including a weekend day. Record what you actually eat, not an ideal day you rarely repeat.",
        "After that week, choose one daily target you can hit on at least six days out of seven and use the same target for the next three weeks.",
      ],
    },
    {
      title: "Build three or four protein meals",
      steps: [
        "Aim for about 0.3–0.4 g/kg at each of three or four meals. For a 90 kg lifter, that is roughly 27–36 g per meal, with larger portions if you use only three meals.",
        "Use practical portions: 150 g cooked chicken or fish gives roughly 35–45 g; 250 g Greek yogurt gives about 20–25 g; 200 g firm tofu gives about 25–30 g; check labels for your brands.",
        "Add a protein source to the meal you most often leave low, commonly breakfast or lunch, before adding another supplement.",
        "If dinner is early and you remain short, add 20–30 g from cottage cheese, Greek yogurt, milk, soy, or a shake before bed.",
      ],
    },
    {
      title: "Make the target hold on imperfect days",
      steps: [
        "Keep two convenient options available for busy days, such as a ready-to-drink shake, canned fish, Greek yogurt, eggs, or a portion of cooked chicken.",
        "When you eat less than planned, preserve the protein portion first and let optional snacks or extras be the flexible part of the meal.",
        "If a full target feels like too large a jump, add 25–30 g per day this week, then add another 20–25 g next week until you reach the range.",
        "Review your seven-day average once a week. If you are hitting the target consistently after two weeks, stop daily logging and repeat the same meal structure.",
      ],
    },
  ],
  fourWeekPlan: [
    "Week 1: calculate a target from bodyweight and log five ordinary days. Note which meal most often has no substantial protein serving.",
    "Week 2: add one 25–35 g protein serving to that meal and aim for the lower end of your target on six days. Keep training and calories broadly stable.",
    "Week 3: spread the target across three or four meals. If you are dieting, keep the deficit moderate and use the upper end of the protein range you can sustain.",
    "Week 4: check the weekly average, training performance, and bodyweight trend. Keep the meal structure if it is working; adjust calories separately if your physique goal requires it.",
  ],
  timeline:
    "Hunger management and the confidence that you have covered the basics can change within the first week. Training recovery and the ability to maintain performance during a cut may improve over 2–3 weeks, but protein alone does not guarantee a strength jump. Visible muscle change generally takes 6–8 weeks or longer and also depends on training quality, total calories, and sleep. Use a consistent daily target for at least a month before deciding it made no difference, and judge bodyweight from weekly averages rather than single weigh-ins.",
  mistakes: [
    "Treating a post-workout shake as the whole protein plan while the rest of the day remains low.",
    "Saving almost all of your protein for one oversized evening meal and leaving the other meals unstructured.",
    "Cutting carbohydrate to make room for protein, then losing the training fuel needed to keep sessions productive.",
    "Assuming a high-protein diet harms your kidneys when you have no known kidney condition; if you do have one, ask your clinician what intake is appropriate.",
    "Chasing the highest possible number before you have built the habit of reaching a reasonable daily target.",
  ],
  trackNotes: {
    physique:
      "If you want more muscle, protein supports the response to training, but it cannot create a surplus or replace progressive work. If you are losing fat, a steady protein target helps make the calorie deficit easier to manage and supports lean-mass retention. Use a bodyweight-based range you can hit most days, then keep calories aligned with the goal: a modest surplus to gain or a manageable deficit to lose. The scale trend and waist measurement tell you whether the energy balance is doing its part.",
    strength:
      "Protein is not a direct substitute for practicing your stuck lift, but it supports tissue repair while you repeat the work needed to improve it. Get a predictable serving at three or four meals, including the meal after training when convenient, and avoid an aggressive cut that makes you weaker before the next training block. Track the main lift under similar conditions for several weeks. If the number is improving but recovery remains poor, look at sleep, total calories, and workload as well as protein.",
  },
  relatedFindings: ["protein_unknown", "no_surplus_no_growth", "deficit_while_expecting_muscle"],
};
