"use client";

import {
  BENCH_MILESTONES,
  CAUTION_ABOVE_REPS,
  MAX_REPS,
  MIN_REPS,
  TRAINING_REPS,
  epleyLoadForReps,
  headlineOneRepMax,
  milestoneProgress,
  oneRepMaxEstimates,
  strengthRatio,
} from "@/lib/tools/formulas";
import { LOAD_STEP, roundToStep } from "@/lib/tools/units";
import { kgToLb, standing } from "@/lib/tools/standards";
import {
  BODYWEIGHT_RANGE,
  BigStat,
  CalcShell,
  Caution,
  DataTable,
  DiagnoseLink,
  FieldGrid,
  MiniStat,
  MiniStats,
  Note,
  NumberField,
  ProgressBar,
  ResultHint,
  ResultPanel,
  SEX_OPTIONS,
  Segmented,
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

const KEY = "ld_tool_bench_v1";
const DEFAULTS = { units: "us", weight: "185", reps: "5", bodyweight: "", sex: "male" };
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({
  ...s,
  units: oneOf(s.units, UNIT_SYSTEMS, "us"),
  sex: oneOf(s.sex, ["male", "female"] as const, "male"),
});

const MAX_BENCH = { lb: 1000, kg: 450 } as const;

export function BenchPressCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);

  const weight = checkRange(s.weight, 1, MAX_BENCH[unit]);
  const reps = checkRange(s.reps, MIN_REPS, MAX_REPS, true);
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const oneRm = weight.value !== null && reps.value !== null ? headlineOneRepMax(weight.value, reps.value) : null;
  const est = weight.value !== null && reps.value !== null ? oneRepMaxEstimates(weight.value, reps.value) : null;
  const ratio = oneRm !== null && bw.value !== null ? strengthRatio(oneRm, bw.value) : null;
  const sex = s.sex === "female" ? "female" : "male";
  const toLb = (v: number) => (unit === "kg" ? kgToLb(v) : v);
  const level = oneRm !== null && bw.value !== null ? standing("bench", sex, toLb(bw.value), toLb(oneRm)) : null;
  const milestones = BENCH_MILESTONES[unit];
  const next = oneRm !== null ? milestones.find((m) => oneRm < m) : undefined;

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["weight", "bodyweight"], to), units: to }));
  };

  return (
    <CalcShell
      label="Bench press calculator"
      eyebrow="Your bench set"
      toggle={<UnitToggle value={system} onChange={switchUnits} />}
    >
      <FieldGrid>
        <NumberField
          label="Bench weight"
          unit={unit}
          value={s.weight}
          onChange={(weight) => set({ weight })}
          placeholder={unit === "lb" ? "185" : "85"}
          invalid={weight.bad}
          hint={weight.bad ? `Enter a weight between 1 and ${MAX_BENCH[unit]} ${unit}.` : "Bar included."}
        />
        <Stepper
          label="Reps completed"
          value={s.reps}
          onChange={(reps) => set({ reps })}
          min={MIN_REPS}
          max={MAX_REPS}
          invalid={reps.bad}
          hint={reps.bad ? `Use a set of ${MIN_REPS}–${MAX_REPS} reps.` : "Full range, no bounce."}
        />
        <NumberField
          label="Your bodyweight"
          optional
          unit={unit}
          value={s.bodyweight}
          onChange={(bodyweight) => set({ bodyweight })}
          placeholder={unit === "lb" ? "180" : "82"}
          invalid={bw.bad}
          hint={
            bw.bad
              ? `Enter a bodyweight between ${BODYWEIGHT_RANGE[unit][0]} and ${BODYWEIGHT_RANGE[unit][1]} ${unit}.`
              : "Adds your ratio and your level."
          }
        />
        <Segmented label="Sex" value={sex} options={SEX_OPTIONS} onChange={(v) => set({ sex: v })} />
      </FieldGrid>
      {reps.value !== null && reps.value > CAUTION_ABOVE_REPS && (
        <Caution>
          Above {CAUTION_ABOVE_REPS} reps the estimate drifts further from a tested max. A heavier set of 3–
          {CAUTION_ABOVE_REPS} reps is more trustworthy.
        </Caution>
      )}

      <ResultPanel label="Estimated bench press max">
        {oneRm === null || !est ? (
          <ResultHint>
            Enter the weight and reps of one hard bench set ({MIN_REPS}–{MAX_REPS} reps) to see your estimated max.
          </ResultHint>
        ) : (
          <>
            <BigStat
              label="Estimated bench 1RM"
              value={fmt(oneRm, 1)}
              unit={unit}
              sub={
                reps.value === 1 ? (
                  <>A single is already a one-rep max.</>
                ) : (
                  <>
                    Average of Epley ({fmt(est.epley, 1)}) and Brzycki ({fmt(est.brzycki, 1)}).
                  </>
                )
              }
            />

            <MiniStats>
              <MiniStat
                label="Bench ÷ bodyweight"
                value={ratio !== null ? `${fmt(ratio, 2, true)}×` : "–"}
                note={ratio !== null ? undefined : "Add bodyweight"}
              />
              <MiniStat
                label="Level"
                value={level ? level.level : "–"}
                note={level ? `Beats ~${level.share}% of logged lifters` : "Add bodyweight"}
              />
              <MiniStat
                label="Next milestone"
                value={next !== undefined ? fmt(next, 0) : "All"}
                unit={next !== undefined ? unit : undefined}
                note={next !== undefined ? `${fmt(next - oneRm, 1)} ${unit} to go` : "Every milestone passed"}
              />
            </MiniStats>

            <SubHeading>Plate milestones</SubHeading>
            <ul className="space-y-3.5">
              {milestones.map((m) => {
                const p = milestoneProgress(oneRm, m);
                return (
                  <li key={m}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-semibold text-ink tabular-nums">
                        {m} {unit}
                      </span>
                      <span className={`tabular-nums ${p >= 1 ? "text-clear" : "text-ink-3"}`}>
                        {p >= 1 ? "Reached" : `${Math.floor(p * 100)}% · ${fmt(m - oneRm, 1)} ${unit} to go`}
                      </span>
                    </div>
                    <ProgressBar value={p} label={`Progress toward a ${m} ${unit} bench`} />
                  </li>
                );
              })}
            </ul>
            <Note>
              {unit === "lb"
                ? "135, 225 and 315 are one, two and three 45 lb plates a side on a 45 lb bar; 185 is a plate and a 25."
                : "60, 100 and 140 kg are one, two and three 20 kg plates a side on a 20 kg bar; 80 kg is a 20 and a 10."}
            </Note>

            <SubHeading>Training weights</SubHeading>
            <DataTable
              caption="Bench press training weights by rep target"
              head={["Reps", `Load (${unit})`]}
              rows={TRAINING_REPS.map((r) => [r, fmt(roundToStep(epleyLoadForReps(oneRm, r), LOAD_STEP[unit]), 1)])}
            />
            <Note>
              A max-effort set for each rep count, from the Epley formula solved for the load: 1RM ÷ (1 + reps ÷ 30),
              rounded to {LOAD_STEP[unit]} {unit}. These are all-out efforts, not work-set targets.
            </Note>

            <Sources
              items={[
                { label: "One-repetition maximum formulas (Wikipedia)", href: "https://en.wikipedia.org/wiki/One-repetition_maximum" },
                { label: "Strength Level bench press standards (self-reported, by bodyweight)", href: "https://strengthlevel.com/strength-standards/bench-press/lb" },
                {
                  label: "Mayhew et al. 2008, J Strength Cond Res — bench press 1RM prediction accuracy",
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
