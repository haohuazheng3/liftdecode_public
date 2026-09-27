"use client";

import {
  ACTIVITY_PAL,
  LEAN_BODY_FAT_BOUND,
  RECOMP_DEFICIT_KCAL,
  RECOMP_PROTEIN,
  fatFreeMass,
  maintenanceCalories,
  mifflinStJeor,
  recompCalories,
  recompOutlook,
  type ActivityLevel,
  type Experience,
  type RecompOutlook,
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
  SubHeading,
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

const KEY = "ld_tool_recomp_v1";
const DEFAULTS = {
  units: "us",
  sex: "male",
  age: "30",
  ft: "5",
  inch: "10",
  cm: "178",
  weight: "185",
  activity: "sedentary",
  experience: "intermediate",
  bodyFat: "22",
};
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({
  ...s,
  units: oneOf(s.units, UNIT_SYSTEMS, "us"),
  sex: oneOf(s.sex, ["male", "female"] as const, "male"),
  activity: oneOf(s.activity, ["sedentary", "active", "vigorous"] as const, "sedentary"),
  experience: oneOf(s.experience, ["beginner", "intermediate", "advanced"] as const, "intermediate"),
});

const OUTLOOK: Record<RecompOutlook, { tag: string; tone: string; text: (sex: Sex) => string }> = {
  best: {
    tag: "Best odds",
    tone: "tag-clear",
    text: () =>
      "New lifters are the group where building muscle while losing fat is least disputed. Train with progressive overload, hit the protein target, and expect the scale to move slowly while your lifts and measurements change.",
  },
  good: {
    tag: "Good odds",
    tone: "tag-clear",
    text: (sex) =>
      `Your body fat is above ${LEAN_BODY_FAT_BOUND[sex]}%, the upper bound researchers used for lean ${sex === "male" ? "men" : "women"} lifters. With more fat to lose, a small deficit plus hard training gives recomposition real room to work.`,
  },
  slow: {
    tag: "Slow but possible",
    tone: "tag-signal",
    text: () =>
      "Trained and fairly lean is the hardest case, but it has been shown: in a 10-week study of lifters with over a year of training, lean mass rose about 1 kg while fat fell 1.4–2.9 kg. Expect changes that show over months, not weeks.",
  },
};

export function BodyRecompCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = s.sex as Sex;
  const activity = s.activity as ActivityLevel;
  const experience = s.experience as Experience;

  const age = checkRange(s.age, ...AGE_RANGE, true);
  const height = checkHeight(system, s);
  const weight = checkRange(s.weight, ...BODYWEIGHT_RANGE[unit]);
  const bodyFat = checkRange(s.bodyFat, 3, 60);

  const weightKg = weight.value !== null ? toKg(weight.value, unit) : null;
  const bmr =
    weightKg !== null && height.value !== null && age.value !== null
      ? mifflinStJeor(sex, weightKg, height.value, age.value)
      : null;
  const maintenance = bmr !== null && bmr > 0 ? maintenanceCalories(bmr, activity) : null;
  const intake = maintenance !== null ? recompCalories(maintenance) : null;
  const leanKg = weightKg !== null && bodyFat.value !== null ? fatFreeMass(weightKg, bodyFat.value) : null;
  const outlook = recompOutlook(experience, sex, bodyFat.value);
  const o = OUTLOOK[outlook];

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
      label="Body recomposition calculator"
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
          placeholder="30"
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
          placeholder={unit === "lb" ? "185" : "84"}
          invalid={weight.bad}
          hint={
            weight.bad
              ? `Enter a bodyweight between ${BODYWEIGHT_RANGE[unit][0]} and ${BODYWEIGHT_RANGE[unit][1]} ${unit}.`
              : undefined
          }
        />
        <NumberField
          label="Body fat estimate"
          unit="%"
          value={s.bodyFat}
          onChange={(v) => set({ bodyFat: v })}
          placeholder="22"
          invalid={bodyFat.bad}
          hint={bodyFat.bad ? "Enter a body-fat estimate between 3 and 60%." : "A rough guess is fine."}
        />
        <Segmented
          label="Training experience"
          value={experience}
          options={EXPERIENCE_OPTIONS}
          onChange={(v) => set({ experience: v })}
        />
      </FieldGrid>
      <div className="mt-4">
        <ChoiceList label="Daily activity outside the gym" value={activity} options={ACTIVITY_OPTIONS} onChange={(v) => set({ activity: v })} />
      </div>

      <ResultPanel label="Recomposition plan">
        {!intake || maintenance === null || weightKg === null || bodyFat.value === null || leanKg === null ? (
          <ResultHint>
            Fill in age, height, bodyweight and a body-fat estimate to see your recomposition calories and protein.
          </ResultHint>
        ) : (
          <>
            <BigStat
              label="Recomp intake"
              value={`${fmtKcal(intake.low)}–${fmtKcal(intake.high)}`}
              unit="kcal / day"
              sub={
                <>
                  From maintenance (about {fmtKcal(maintenance)} kcal) down to {RECOMP_DEFICIT_KCAL} kcal below it. The low
                  end suits you if you have more fat to lose.
                </>
              }
            />
            <MiniStats>
              <MiniStat
                label="Protein target"
                value={fmt(RECOMP_PROTEIN.target * weightKg, 0)}
                unit="g / day"
                note={`${RECOMP_PROTEIN.target} g/kg · range ${fmt(RECOMP_PROTEIN.low * weightKg, 0)}–${fmt(RECOMP_PROTEIN.high * weightKg, 0)} g`}
              />
              <MiniStat label="Lean mass" value={fmt(fromKg(leanKg, unit), 1)} unit={unit} />
              <MiniStat label="Fat mass" value={fmt(fromKg(weightKg - leanKg, unit), 1)} unit={unit} />
            </MiniStats>

            <SubHeading>What to expect</SubHeading>
            <div className="flex flex-col gap-2.5">
              <span className={`tag ${o.tone} self-start`}>{o.tag}</span>
              <p className="text-sm leading-relaxed text-ink-2">{o.text(sex)}</p>
            </div>
            <Note>
              Maintenance = Mifflin–St Jeor BMR × {ACTIVITY_PAL[activity]} (FAO/WHO/UNU activity example). The 250 kcal
              deficit and the maintenance option both produced recomposition in trained lifters eating about 2.5 g/kg of
              protein (Vargas-Molina et al. 2026). The protein target is the upper end of Morton et al.&apos;s range,
              which its authors suggest for maximizing muscle gain; these g/kg figures come from studies of mostly lean
              to average lifters.
            </Note>

            <Sources
              items={[
                {
                  label: "Barakat et al. 2020, Strength Cond J — body recomposition in trained individuals",
                  href: "https://doi.org/10.1519/SSC.0000000000000584",
                },
                { label: "Vargas-Molina et al. 2026, Eur J Appl Physiol", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13380550/" },
                { label: "Morton et al. 2018, Br J Sports Med", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/" },
                { label: "Mifflin et al. 1990, Am J Clin Nutr", href: "https://doi.org/10.1093/ajcn/51.2.241" },
                { label: "FAO/WHO/UNU Human Energy Requirements", href: "https://www.fao.org/4/y5686e/y5686e07.htm" },
              ]}
            />
          </>
        )}
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}
