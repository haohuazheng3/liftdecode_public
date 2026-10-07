"use client";

import { useEffect } from "react";
import { track } from "@/components/Analytics";
import { bulkPlan, maintenanceCalories, mifflinStJeor, type ActivityLevel, type Experience, type Sex } from "@/lib/tools/formulas";
import { toKg } from "@/lib/tools/units";
import {
  ACTIVITY_OPTIONS,
  AGE_RANGE,
  BODYWEIGHT_RANGE,
  BigStat,
  CalcShell,
  Caution,
  ChoiceList,
  DataTable,
  DiagnoseLink,
  EXPERIENCE_OPTIONS,
  FieldGrid,
  HeightField,
  Note,
  NumberField,
  ResultHint,
  ResultPanel,
  SEX_OPTIONS,
  Segmented,
  Sources,
  UNIT_SYSTEMS,
  UnitToggle,
  checkHeight,
  checkRange,
  convertHeightFields,
  convertWeightFields,
  fmt,
  fmtKcal,
  oneOf,
  useStoredState,
  weightUnitOf,
  type UnitSystem,
} from "./shared";

const DEFAULTS = {
  units: "us",
  sex: "male",
  age: "",
  ft: "5",
  inch: "10",
  cm: "178",
  weight: "",
  activity: "sedentary",
  experience: "intermediate",
};

/**
 * Iraki et al. 2019 (off-season bodybuilders): protein 1.6–2.2 g/kg, fat 0.5–1.5 g/kg, the rest from
 * carbohydrate (at least 3–5 g/kg for most). Defaults sit mid-range: protein 1.8 g/kg, fat 0.9 g/kg.
 */
const PROTEIN_G_PER_KG = 1.8;
const FAT_G_PER_KG = 0.9;
const MIN_CARB_G_PER_KG = 3;

export function MacroCalculator() {
  const [s, set] = useStoredState("ld_tool_macros_v1", DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = oneOf(s.sex, ["male", "female"] as const, "male") as Sex;
  const activity = oneOf(s.activity, ["sedentary", "active", "vigorous"] as const, "sedentary") as ActivityLevel;
  const experience = oneOf(s.experience, ["beginner", "intermediate", "advanced"] as const, "intermediate") as Experience;
  const age = checkRange(s.age, ...AGE_RANGE, true);
  const height = checkHeight(system, s);
  const weight = checkRange(s.weight, ...BODYWEIGHT_RANGE[unit]);
  const kg = weight.value !== null ? toKg(weight.value, unit) : null;
  const bmr = kg !== null && height.value !== null && age.value !== null ? mifflinStJeor(sex, kg, height.value, age.value) : null;
  const maintenance = bmr !== null && bmr > 0 ? maintenanceCalories(bmr, activity) : null;
  const plan = maintenance !== null && kg !== null ? bulkPlan(maintenance, kg, experience) : null;

  const macros =
    plan && kg !== null
      ? (() => {
          const protein = kg * PROTEIN_G_PER_KG;
          const fat = kg * FAT_G_PER_KG;
          const carbs = Math.max(0, (plan.targetKcal - protein * 4 - fat * 9) / 4);
          return { protein, fat, carbs, carbsPerKg: carbs / kg };
        })()
      : null;

  const ready = macros !== null;
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => track("tool_result", { tool: "macro-calculator", experience }), 1500);
    return () => window.clearTimeout(t);
  }, [ready, experience]);

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["weight"], to), ...convertHeightFields(system, to, prev), units: to }));
  };

  return (
    <CalcShell label="Macro calculator for muscle gain" eyebrow="About you" toggle={<UnitToggle value={system} onChange={switchUnits} withHeight />}>
      <FieldGrid>
        <Segmented label="Sex" value={sex} options={SEX_OPTIONS} onChange={(v) => set({ sex: v })} />
        <NumberField label="Age" unit="years" integer value={s.age} onChange={(v) => set({ age: v })} placeholder="28" invalid={age.bad} />
        <HeightField system={system} value={s} onChange={(patch) => set(patch)} invalid={height.bad} />
        <NumberField label="Bodyweight" unit={unit} value={s.weight} onChange={(v) => set({ weight: v })} placeholder={unit === "lb" ? "170" : "77"} invalid={weight.bad} />
      </FieldGrid>
      <div className="mt-4 space-y-4">
        <ChoiceList label="Daily activity outside the gym" value={activity} options={ACTIVITY_OPTIONS} onChange={(v) => set({ activity: v })} />
        <Segmented label="Training experience" value={experience} options={EXPERIENCE_OPTIONS} onChange={(v) => set({ experience: v })} />
      </div>

      <ResultPanel label="Your bulking macros">
        {!plan || !macros || maintenance === null || kg === null ? (
          <ResultHint>Enter your age, height and bodyweight to get daily calories and macros for a lean bulk.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Calories per day"
              value={fmtKcal(plan.targetKcal)}
              unit="kcal"
              sub={<>Maintenance about {fmtKcal(maintenance)} kcal, plus a {fmtKcal(plan.surplusKcal)} kcal surplus for your experience.</>}
            />
            <div className="mt-5">
              <DataTable
                caption="Daily macros"
                head={["Macro", "Grams", "Per kg", "kcal"]}
                rows={[
                  ["Protein", fmt(macros.protein, 0), fmt(PROTEIN_G_PER_KG, 1, true), fmtKcal(macros.protein * 4)],
                  ["Carbs", fmt(macros.carbs, 0), fmt(macros.carbsPerKg, 1, true), fmtKcal(macros.carbs * 4)],
                  ["Fat", fmt(macros.fat, 0), fmt(FAT_G_PER_KG, 1, true), fmtKcal(macros.fat * 9)],
                ]}
              />
            </div>
            {macros.carbsPerKg < MIN_CARB_G_PER_KG && (
              <Caution>
                Carbs land under {MIN_CARB_G_PER_KG} g per kg, the low end the review suggests for hard training. Check your activity
                level, or eat at the top of the calorie range.
              </Caution>
            )}
            <Note>
              Protein 1.8 g/kg and fat 0.9 g/kg sit mid-range of 1.6–2.2 and 0.5–1.5 g/kg; carbs fill the rest. Expect about{" "}
              {fmt(unit === "kg" ? plan.weeklyGainKg : plan.weeklyGainKg / 0.45359237, 2)} {unit} of gain a week; adjust by 100–200 kcal
              if the two-week average runs fast or slow.
            </Note>
            <DiagnoseLink detail={`macros:${experience}`}>Hitting your macros and still not growing? Find out why</DiagnoseLink>
            <Sources
              items={[
                { label: "Iraki et al. 2019, Sports — off-season nutrition for bodybuilders", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/" },
                { label: "Mifflin et al. 1990, Am J Clin Nutr — resting energy equation", href: "https://pubmed.ncbi.nlm.nih.gov/2305711/" },
              ]}
            />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}
