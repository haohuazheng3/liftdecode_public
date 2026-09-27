"use client";

import {
  ACTIVITY_PAL,
  BULK_GUIDE,
  BULK_WEEKLY_GAIN_RANGE_PCT,
  bulkPlan,
  maintenanceCalories,
  mifflinStJeor,
  type ActivityLevel,
  type Experience,
  type Sex,
} from "@/lib/tools/formulas";
import { fromKg, toKg } from "@/lib/tools/units";
import {
  ACTIVITY_OPTIONS,
  AGE_RANGE,
  BODYWEIGHT_RANGE,
  BigStat,
  CalcShell,
  ChoiceList,
  DiagnoseLink,
  EXPERIENCE_OPTIONS,
  FieldGrid,
  HeightField,
  MiniStat,
  MiniStats,
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

const KEY = "ld_tool_bulk_v1";
const DEFAULTS = {
  units: "us",
  sex: "male",
  age: "28",
  ft: "5",
  inch: "10",
  cm: "178",
  weight: "165",
  activity: "sedentary",
  experience: "beginner",
};
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({
  ...s,
  units: oneOf(s.units, UNIT_SYSTEMS, "us"),
  sex: oneOf(s.sex, ["male", "female"] as const, "male"),
  activity: oneOf(s.activity, ["sedentary", "active", "vigorous"] as const, "sedentary"),
  experience: oneOf(s.experience, ["beginner", "intermediate", "advanced"] as const, "beginner"),
});

const EXPERIENCE_LINE: Record<Experience, string> = {
  beginner: "Beginners sit at the top of both ranges: a 20% surplus and about 0.5% of bodyweight a week.",
  intermediate: "Intermediates sit in the middle: a 15% surplus and about 0.375% of bodyweight a week.",
  advanced: "Advanced lifters sit at the bottom: a 10% surplus and about 0.25% of bodyweight a week, or slower if fat climbs.",
};

export function BulkingCalorieCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = s.sex as Sex;
  const activity = s.activity as ActivityLevel;
  const experience = s.experience as Experience;

  const age = checkRange(s.age, ...AGE_RANGE, true);
  const height = checkHeight(system, s);
  const weight = checkRange(s.weight, ...BODYWEIGHT_RANGE[unit]);

  const weightKg = weight.value !== null ? toKg(weight.value, unit) : null;
  const bmr =
    weightKg !== null && height.value !== null && age.value !== null
      ? mifflinStJeor(sex, weightKg, height.value, age.value)
      : null;
  const maintenance = bmr !== null && bmr > 0 ? maintenanceCalories(bmr, activity) : null;
  const plan = maintenance !== null && weightKg !== null ? bulkPlan(maintenance, weightKg, experience) : null;
  const guide = BULK_GUIDE[experience];

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({
      ...convertWeightFields(prev, ["weight"], to),
      ...convertHeightFields(system, to, prev),
      units: to,
    }));
  };

  return (
    <CalcShell
      label="Bulking calorie calculator"
      eyebrow="About you"
      toggle={<UnitToggle value={system} onChange={switchUnits} withHeight />}
    >
      <FieldGrid>
        <Segmented label="Sex" value={sex} options={SEX_OPTIONS} onChange={(v) => set({ sex: v })} />
        <NumberField
          label="Age"
          unit="years"
          integer
          value={s.age}
          onChange={(v) => set({ age: v })}
          placeholder="28"
          invalid={age.bad}
          hint={age.bad ? `Enter an age between ${AGE_RANGE[0]} and ${AGE_RANGE[1]}.` : undefined}
        />
        <HeightField
          system={system}
          value={s}
          onChange={(patch) => set(patch)}
          invalid={height.bad}
          hint={height.bad ? "Enter a height between 4 ft (120 cm) and 7 ft 6 in (230 cm)." : undefined}
        />
        <NumberField
          label="Bodyweight"
          unit={unit}
          value={s.weight}
          onChange={(v) => set({ weight: v })}
          placeholder={unit === "lb" ? "165" : "75"}
          invalid={weight.bad}
          hint={
            weight.bad
              ? `Enter a bodyweight between ${BODYWEIGHT_RANGE[unit][0]} and ${BODYWEIGHT_RANGE[unit][1]} ${unit}.`
              : undefined
          }
        />
      </FieldGrid>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <ChoiceList label="Daily activity outside the gym" value={activity} options={ACTIVITY_OPTIONS} onChange={(v) => set({ activity: v })} />
        <Segmented
          label="Training experience"
          value={experience}
          options={EXPERIENCE_OPTIONS}
          onChange={(v) => set({ experience: v })}
        />
      </div>

      <ResultPanel label="Bulking calories">
        {!plan || bmr === null || maintenance === null ? (
          <ResultHint>Fill in age, height and bodyweight to see your bulking calories and expected rate of gain.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Bulking target"
              value={fmtKcal(plan.targetKcal)}
              unit="kcal / day"
              sub={
                <>
                  Maintenance about {fmtKcal(maintenance)} kcal + a {Math.round(guide.surplus * 100)}% surplus (
                  {fmtKcal(plan.surplusKcal)} kcal). The full 10–20% surplus range is {fmtKcal(plan.rangeKcal[0])}–
                  {fmtKcal(plan.rangeKcal[1])} kcal.
                </>
              }
            />
            <MiniStats>
              <MiniStat
                label="Scale change / month"
                value={`+${fmt(fromKg(plan.monthlyGainKg, unit), 1)}`}
                unit={unit}
                note={`about +${fmt(fromKg(plan.weeklyGainKg, unit), 2)} ${unit} a week`}
              />
              <MiniStat
                label="Typical range / month"
                value={`${fmt(fromKg(plan.monthlyGainRangeKg[0], unit), 1)}–${fmt(fromKg(plan.monthlyGainRangeKg[1], unit), 1)}`}
                unit={unit}
                note={`${BULK_WEEKLY_GAIN_RANGE_PCT[0]}–${BULK_WEEKLY_GAIN_RANGE_PCT[1]}% of bodyweight a week`}
              />
              <MiniStat label="BMR" value={fmtKcal(bmr)} unit="kcal" note={`× ${ACTIVITY_PAL[activity]} activity`} />
            </MiniStats>

            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              {EXPERIENCE_LINE[experience]} These are estimates: weigh yourself often and adjust intake if the scale trend
              runs clearly faster or slower than the monthly figure.
            </p>
            <Note>
              BMR by Mifflin–St Jeor. Activity factor from the FAO/WHO/UNU worked examples (1.53 mostly sitting, 1.76
              moderately active, 2.25 very active). Surplus of 10–20% over maintenance and a gain of 0.25–0.5% of
              bodyweight a week from Iraki et al.; the split by experience is our reading of their advice that newer
              lifters can use larger surpluses and advanced lifters should stay near the low end.
            </Note>

            <Sources
              items={[
                { label: "Mifflin et al. 1990, Am J Clin Nutr", href: "https://doi.org/10.1093/ajcn/51.2.241" },
                { label: "FAO/WHO/UNU Human Energy Requirements, ch. 5", href: "https://www.fao.org/4/y5686e/y5686e07.htm" },
                { label: "Iraki et al. 2019, Sports 7(7):154", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/" },
              ]}
            />
          </>
        )}
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}
