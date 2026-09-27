"use client";

import { DOTS_BW_RANGE, WILKS_BW_RANGE, dotsScore, wilksScore, type Sex } from "@/lib/tools/formulas";
import { fromKg, toKg } from "@/lib/tools/units";
import {
  BODYWEIGHT_RANGE,
  BigStat,
  CalcShell,
  DiagnoseLink,
  FieldGrid,
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
  checkRange,
  convertWeightFields,
  fmt,
  oneOf,
  useStoredState,
  weightUnitOf,
  type UnitSystem,
} from "./shared";

const KEY = "ld_tool_dots_v1";
const MODES = ["total", "lifts"] as const;
const DEFAULTS = {
  units: "us",
  sex: "male",
  bodyweight: "183",
  mode: "total",
  total: "1200",
  squat: "425",
  bench: "300",
  deadlift: "475",
};
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({
  ...s,
  units: oneOf(s.units, UNIT_SYSTEMS, "us"),
  sex: oneOf(s.sex, ["male", "female"] as const, "male"),
  mode: oneOf(s.mode, MODES, "total"),
});

const MAX_TOTAL = { lb: 3500, kg: 1600 } as const;
const MAX_LIFT = { lb: 1500, kg: 680 } as const;

export function DotsCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = s.sex as Sex;

  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const total = checkRange(s.total, 1, MAX_TOTAL[unit]);
  const squat = checkRange(s.squat, 1, MAX_LIFT[unit]);
  const bench = checkRange(s.bench, 1, MAX_LIFT[unit]);
  const deadlift = checkRange(s.deadlift, 1, MAX_LIFT[unit]);

  const totalInUnit =
    s.mode === "total"
      ? total.value
      : squat.value !== null && bench.value !== null && deadlift.value !== null
        ? squat.value + bench.value + deadlift.value
        : null;

  const bwKg = bw.value !== null ? toKg(bw.value, unit) : null;
  const totalKg = totalInUnit !== null ? toKg(totalInUnit, unit) : null;
  const dots = bwKg !== null && totalKg !== null ? dotsScore(sex, bwKg, totalKg) : null;
  const wilks = bwKg !== null && totalKg !== null ? wilksScore(sex, bwKg, totalKg) : null;

  const outside = (range: readonly [number, number]) => bwKg !== null && (bwKg < range[0] || bwKg > range[1]);
  const dotsClamped = outside(DOTS_BW_RANGE[sex]);
  const wilksClamped = outside(WILKS_BW_RANGE[sex]);

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({
      ...convertWeightFields(prev, ["bodyweight", "total", "squat", "bench", "deadlift"], to),
      units: to,
    }));
  };

  const liftField = (key: "squat" | "bench" | "deadlift", label: string, c: typeof squat) => (
    <NumberField
      label={label}
      unit={unit}
      value={s[key]}
      onChange={(v) => set({ [key]: v } as Partial<State>)}
      invalid={c.bad}
      hint={c.bad ? `Enter a lift between 1 and ${MAX_LIFT[unit]} ${unit}.` : undefined}
    />
  );

  return (
    <CalcShell
      label="DOTS and Wilks calculator"
      eyebrow="Your meet numbers"
      toggle={<UnitToggle value={system} onChange={switchUnits} />}
    >
      <FieldGrid>
        <Segmented label="Sex" value={sex} options={SEX_OPTIONS} onChange={(v) => set({ sex: v })} />
        <NumberField
          label="Bodyweight"
          unit={unit}
          value={s.bodyweight}
          onChange={(bodyweight) => set({ bodyweight })}
          placeholder={unit === "lb" ? "183" : "83"}
          invalid={bw.bad}
          hint={
            bw.bad
              ? `Enter a bodyweight between ${BODYWEIGHT_RANGE[unit][0]} and ${BODYWEIGHT_RANGE[unit][1]} ${unit}.`
              : undefined
          }
        />
      </FieldGrid>
      <div className="mt-4">
        <Segmented
          label="Enter"
          value={s.mode}
          options={[
            { value: "total", label: "My total" },
            { value: "lifts", label: "Each lift" },
          ]}
          onChange={(v) => set({ mode: v })}
        />
      </div>
      <div className="mt-4">
        {s.mode === "total" ? (
          <FieldGrid>
            <NumberField
              label="Total (squat + bench + deadlift)"
              unit={unit}
              value={s.total}
              onChange={(v) => set({ total: v })}
              placeholder={unit === "lb" ? "1200" : "545"}
              invalid={total.bad}
              hint={total.bad ? `Enter a total between 1 and ${MAX_TOTAL[unit]} ${unit}.` : "Best successful attempts."}
            />
          </FieldGrid>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {liftField("squat", "Squat", squat)}
            {liftField("bench", "Bench press", bench)}
            {liftField("deadlift", "Deadlift", deadlift)}
          </div>
        )}
      </div>

      <ResultPanel label="DOTS and Wilks scores">
        {dots === null || wilks === null || totalInUnit === null ? (
          <ResultHint>Enter your bodyweight and your total (or all three lifts) to see your DOTS and Wilks scores.</ResultHint>
        ) : (
          <>
            <BigStat
              label="DOTS"
              value={fmt(dots, 2, true)}
              sub={
                <>
                  Total {fmt(totalInUnit, 1)} {unit}
                  {unit === "lb" ? ` (${fmt(totalKg ?? 0, 1)} kg)` : ` (${fmt(fromKg(totalKg ?? 0, "lb"), 1)} lb)`} at{" "}
                  {fmt(bw.value ?? 0, 1)} {unit} bodyweight. Both scores are computed in kilograms.
                </>
              }
            />
            <MiniStats>
              <MiniStat label="Wilks (original)" value={fmt(wilks, 2, true)} note="Pre-2020 coefficients" />
              <MiniStat label="Bodyweight" value={fmt(bwKg ?? 0, 1)} unit="kg" />
            </MiniStats>
            {(dotsClamped || wilksClamped) && (
              <Note>
                Your bodyweight is outside the range the{" "}
                {dotsClamped && wilksClamped ? "DOTS and Wilks formulas cover" : dotsClamped ? "DOTS formula covers" : "Wilks formula covers"} ({dotsClamped ? `DOTS ${DOTS_BW_RANGE[sex][0]}–${DOTS_BW_RANGE[sex][1]} kg` : ""}
                {dotsClamped && wilksClamped ? "; " : ""}
                {wilksClamped ? `Wilks ${WILKS_BW_RANGE[sex][0]}–${WILKS_BW_RANGE[sex][1]} kg` : ""}), so the score uses the
                nearest edge of that range, as OpenPowerlifting does.
              </Note>
            )}
            <Note>
              DOTS = total × 500 ÷ a 4th-degree polynomial of bodyweight. Wilks here is the original formula used by the
              IPF until the end of 2018, not the 2020 revision. Scores compare lifters of different sizes; they do not
              grade a lifter.
            </Note>

            <Sources
              items={[
                {
                  label: "OpenPowerlifting coefficient code (DOTS, Wilks)",
                  href: "https://gitlab.com/openpowerlifting/opl-data/-/tree/main/crates/coefficients/src",
                },
                {
                  label: "IPF 2020 evaluation of Wilks, Wilks-2, DOTS, IPF and GL formulas",
                  href: "https://www.powerlifting.sport/fileadmin/ipf/data/ipf-formula/Models_Evaluation-I-2020.pdf",
                },
                { label: "Wilks coefficient (Wikipedia)", href: "https://en.wikipedia.org/wiki/Wilks_coefficient" },
              ]}
            />
          </>
        )}
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}
