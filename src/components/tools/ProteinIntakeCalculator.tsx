"use client";

import { PROTEIN_GUIDE, proteinPlan, type ProteinGoal } from "@/lib/tools/formulas";
import { fromKg, toKg } from "@/lib/tools/units";
import {
  BODYWEIGHT_RANGE,
  BigStat,
  CalcShell,
  ChoiceList,
  DataTable,
  DiagnoseLink,
  FieldGrid,
  MiniStat,
  MiniStats,
  Note,
  NumberField,
  ResultHint,
  ResultPanel,
  Sources,
  SubHeading,
  UNIT_SYSTEMS,
  UnitToggle,
  checkRange,
  convertWeightFields,
  fmt,
  oneOf,
  useStoredState,
  weightUnitOf,
  type UnitSystem,
} from "./shared";

const KEY = "ld_tool_protein_v1";
const GOALS = ["build", "maintain", "cut"] as const;
const DEFAULTS = { units: "us", weight: "180", goal: "build", bodyFat: "" };
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({
  ...s,
  units: oneOf(s.units, UNIT_SYSTEMS, "us"),
  goal: oneOf(s.goal, GOALS, "build"),
});

const GOAL_OPTIONS = [
  { value: "build", label: "Build muscle", detail: "Lifting to add size or strength" },
  { value: "maintain", label: "Maintain while lifting", detail: "Eating around maintenance" },
  { value: "cut", label: "Lose fat, keep muscle", detail: "In a calorie deficit" },
] as const;

const GOAL_NOTE: Record<ProteinGoal, string> = {
  build:
    "The target, 1.6 g/kg, is where extra protein stopped adding muscle in Morton et al.'s meta-analysis of 49 trials. The top of the range, 2.2 g/kg, is what the same authors suggest for anyone trying to squeeze out every last gram.",
  maintain:
    "The ISSN calls 1.4–2.0 g/kg sufficient for most people who exercise. The target, 1.6 g/kg, sits inside that range and matches Morton et al.",
  cut: "In a deficit the ISSN says higher intakes, 2.3–3.1 g/kg, may be needed to hold on to lean mass. Helms et al. derived that range from lean lifters and scale it up the leaner you are and the harder the deficit.",
};

export function ProteinIntakeCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);
  const goal = s.goal as ProteinGoal;

  const weight = checkRange(s.weight, ...BODYWEIGHT_RANGE[unit]);
  const bodyFat = checkRange(s.bodyFat, 3, 60);
  const plan =
    weight.value !== null ? proteinPlan(toKg(weight.value, unit), goal, goal === "cut" ? bodyFat.value : null) : null;
  const guide = PROTEIN_GUIDE[goal];

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["weight"], to), units: to }));
  };

  return (
    <CalcShell
      label="Protein intake calculator"
      eyebrow="You and your goal"
      toggle={<UnitToggle value={system} onChange={switchUnits} />}
    >
      <FieldGrid>
        <NumberField
          label="Bodyweight"
          unit={unit}
          value={s.weight}
          onChange={(weight) => set({ weight })}
          placeholder={unit === "lb" ? "180" : "82"}
          invalid={weight.bad}
          hint={
            weight.bad
              ? `Enter a bodyweight between ${BODYWEIGHT_RANGE[unit][0]} and ${BODYWEIGHT_RANGE[unit][1]} ${unit}.`
              : undefined
          }
        />
        {goal === "cut" && (
          <NumberField
            label="Body fat"
            optional
            unit="%"
            value={s.bodyFat}
            onChange={(bodyFat) => set({ bodyFat })}
            placeholder="20"
            invalid={bodyFat.bad}
            hint={bodyFat.bad ? "Enter a body-fat estimate between 3 and 60%." : "Bases the fat-loss range on lean mass."}
          />
        )}
      </FieldGrid>
      <div className="mt-4">
        <ChoiceList label="Goal" value={goal} options={GOAL_OPTIONS} onChange={(g) => set({ goal: g })} />
      </div>

      <ResultPanel label="Daily protein">
        {!plan ? (
          <ResultHint>Enter your bodyweight to see your daily protein target and how to split it across meals.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Daily protein target"
              value={fmt(plan.targetG, 0)}
              unit="g / day"
              sub={
                <>
                  Typical range {fmt(plan.lowG, 0)}–{fmt(plan.highG, 0)} g ({guide.low}–{guide.high} g per kg of{" "}
                  {plan.basis === "lean mass" ? "lean mass" : "bodyweight"}).
                </>
              }
            />
            {plan.basis === "lean mass" && (
              <Note>
                Based on {fmt(fromKg(plan.basisKg, unit), 1)} {unit} of lean mass ({s.bodyFat}% body fat).
              </Note>
            )}
            {goal === "cut" && plan.basis === "bodyweight" && (
              <Note>
                Applied to total bodyweight. If you carry a lot of body fat, add your body-fat estimate: the fat-loss
                range was set for lean mass.
              </Note>
            )}

            <MiniStats>
              <MiniStat label="Per kg" value={fmt(guide.target, 1)} unit="g" note={plan.basis === "lean mass" ? "of lean mass" : "of bodyweight"} />
              <MiniStat
                label="Per meal guide"
                value={`${fmt(plan.perMealGuideG.low, 0)}–${fmt(plan.perMealGuideG.high, 0)}`}
                unit="g"
                note="0.4–0.55 g/kg a meal"
              />
            </MiniStats>

            <SubHeading>Split across meals</SubHeading>
            <DataTable
              caption="Daily protein target split across meals"
              head={["Meals a day", "Protein each"]}
              rows={plan.perMeal.map((m) => [m.meals, `${fmt(m.grams, 0)} g`])}
            />
            <Note>
              Schoenfeld and Aragon suggest about 0.4 g/kg per meal over at least four meals, up to 0.55 g/kg.
            </Note>

            <p className="mt-4 text-sm leading-relaxed text-ink-2">{GOAL_NOTE[goal]}</p>

            <Sources
              items={[
                { label: "Morton et al. 2018, Br J Sports Med", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/" },
                {
                  label: "Jäger et al. 2017, ISSN position stand: protein and exercise",
                  href: "https://doi.org/10.1186/s12970-017-0177-8",
                },
                { label: "Helms et al. 2014, Int J Sport Nutr Exerc Metab", href: "https://doi.org/10.1123/ijsnem.2013-0054" },
                { label: "Schoenfeld & Aragon 2018, J Int Soc Sports Nutr", href: "https://doi.org/10.1186/s12970-018-0215-1" },
              ]}
            />
          </>
        )}
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}
