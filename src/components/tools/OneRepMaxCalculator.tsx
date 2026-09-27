"use client";

import {
  CAUTION_ABOVE_REPS,
  MAX_REPS,
  MIN_REPS,
  ONE_RM_FORMULAS,
  oneRepMaxEstimates,
  percentTable,
} from "@/lib/tools/formulas";
import { LOAD_STEP } from "@/lib/tools/units";
import {
  BigStat,
  CalcShell,
  Caution,
  DataTable,
  DiagnoseLink,
  FieldGrid,
  Note,
  NumberField,
  ResultHint,
  ResultPanel,
  Sources,
  Stepper,
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

const KEY = "ld_tool_1rm_v1";
const DEFAULTS = { units: "us", weight: "225", reps: "5" };
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({ ...s, units: oneOf(s.units, UNIT_SYSTEMS, "us") });

/** Heaviest plausible single-set load per unit (well above any world record). */
const MAX_LOAD = { lb: 2000, kg: 900 } as const;

export function OneRepMaxCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);

  const weight = checkRange(s.weight, 1, MAX_LOAD[unit]);
  const reps = checkRange(s.reps, MIN_REPS, MAX_REPS, true);
  const est = weight.value !== null && reps.value !== null ? oneRepMaxEstimates(weight.value, reps.value) : null;
  const headline = est ? (est.epley + est.brzycki) / 2 : null;
  const values = est ? ONE_RM_FORMULAS.map((f) => est[f.id]) : [];
  const lo = values.length ? Math.min(...values) : 0;
  const hi = values.length ? Math.max(...values) : 0;

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["weight"], to), units: to }));
  };

  return (
    <CalcShell
      label="One-rep max calculator"
      eyebrow="Your hardest set"
      toggle={<UnitToggle value={system} onChange={switchUnits} />}
    >
      <FieldGrid>
        <NumberField
          label="Weight lifted"
          unit={unit}
          value={s.weight}
          onChange={(weight) => set({ weight })}
          placeholder={unit === "lb" ? "225" : "100"}
          invalid={weight.bad}
          hint={weight.bad ? `Enter a weight between 1 and ${MAX_LOAD[unit]} ${unit}.` : "Bar included."}
        />
        <Stepper
          label="Reps completed"
          value={s.reps}
          onChange={(reps) => set({ reps })}
          min={MIN_REPS}
          max={MAX_REPS}
          invalid={reps.bad}
          hint={reps.bad ? `Use a set of ${MIN_REPS}–${MAX_REPS} reps.` : "Clean reps, taken close to failure."}
        />
      </FieldGrid>
      {reps.value !== null && reps.value > CAUTION_ABOVE_REPS && (
        <Caution>
          Above {CAUTION_ABOVE_REPS} reps every formula drifts further from a tested max. A heavier set of 3–
          {CAUTION_ABOVE_REPS} reps gives a more trustworthy estimate.
        </Caution>
      )}

      <ResultPanel label="Estimated one-rep max">
        {!est || headline === null ? (
          <ResultHint>
            Enter the weight and the reps of one hard set ({MIN_REPS}–{MAX_REPS} reps) to see your estimated max.
          </ResultHint>
        ) : (
          <>
            <BigStat
              label="Estimated 1RM"
              value={fmt(headline, 1)}
              unit={unit}
              sub={
                reps.value === 1 ? (
                  <>A single is already a one-rep max, so every formula returns the weight itself.</>
                ) : (
                  <>
                    The average of Epley ({fmt(est.epley, 1)}) and Brzycki ({fmt(est.brzycki, 1)}). Six formulas
                    range from {fmt(lo, 1)} to {fmt(hi, 1)} {unit}.
                  </>
                )
              }
            />

            <SubHeading>Every formula</SubHeading>
            <DataTable
              caption="One-rep max estimate by formula"
              head={["Formula", "Equation", `1RM (${unit})`]}
              align={["left", "left", "right"]}
              rows={ONE_RM_FORMULAS.map((f) => [
                f.name,
                <span key="eq" className="font-mono text-[0.72rem] text-ink-3 break-words">
                  {f.equation}
                </span>,
                fmt(est[f.id], 1),
              ])}
            />
            <Note>w = weight lifted, r = reps. At 1 rep we return the weight for every formula.</Note>

            <SubHeading>Percent of your 1RM</SubHeading>
            <DataTable
              caption="Training loads by percent of estimated one-rep max"
              head={["% 1RM", `Load (${unit})`, "≈ Reps"]}
              rows={percentTable(headline, LOAD_STEP[unit]).map((r) => [`${r.percent}%`, fmt(r.weight, 1), r.reps])}
            />
            <Note>
              Loads rounded to the nearest {LOAD_STEP[unit]} {unit}. Reps come from the Epley formula solved for reps,
              r = 30 × (100 ÷ % − 1); past about 12 reps they vary a lot from person to person.
            </Note>

            <Sources
              items={[
                { label: "One-repetition maximum formulas (Wikipedia)", href: "https://en.wikipedia.org/wiki/One-repetition_maximum" },
                {
                  label: "Mayhew et al. 2008, J Strength Cond Res — prediction equations are more accurate under 10 reps",
                  href: "https://www.unm.edu/~rrobergs/478PredictionAccuracy.pdf",
                },
              ]}
            />
          </>
        )}
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}
