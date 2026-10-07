"use client";

import { useEffect } from "react";
import { track } from "@/components/Analytics";
import {
  CAUTION_ABOVE_REPS,
  MAX_REPS,
  MIN_REPS,
  ONE_RM_FORMULAS,
  TRAINING_REPS,
  epleyLoadForReps,
  headlineOneRepMax,
  oneRepMaxEstimates,
} from "@/lib/tools/formulas";
import { LEVEL_TRAINING, kgToLb, lbToKg, standing } from "@/lib/tools/standards";
import { LOAD_STEP, roundToStep } from "@/lib/tools/units";
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

const LIFTS = [
  { value: "squat", label: "Squat" },
  { value: "deadlift", label: "Deadlift" },
] as const;
const DEFAULTS = { units: "us", lift: "squat", weight: "", reps: "5", sex: "male", bodyweight: "" };
const MAX_LOAD = { lb: 1500, kg: 680 } as const;

/** Squat and deadlift max from one hard set, with the level that max means at your bodyweight. */
export function MaxLiftCalculator() {
  const [s, set] = useStoredState("ld_tool_maxlift_v1", DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const lift = oneOf(s.lift, LIFTS.map((l) => l.value), "squat");
  const sex = oneOf(s.sex, ["male", "female"] as const, "male");
  const weight = checkRange(s.weight, 1, MAX_LOAD[unit]);
  const reps = checkRange(s.reps, MIN_REPS, MAX_REPS, true);
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);

  const est = weight.value !== null && reps.value !== null ? oneRepMaxEstimates(weight.value, reps.value) : null;
  const max = weight.value !== null && reps.value !== null ? headlineOneRepMax(weight.value, reps.value) : null;
  const all = est ? Object.values(est) : [];
  const spread = all.length ? [Math.min(...all), Math.max(...all)] : null;
  const toLb = (v: number) => (unit === "kg" ? kgToLb(v) : v);
  const st = max !== null && bw.value !== null ? standing(lift, sex, toLb(bw.value), toLb(max)) : null;
  const show = (lb: number) => fmt(unit === "kg" ? lbToKg(lb) : lb, 0);

  const resultKey = max !== null ? `${lift}:${st?.level ?? "no-bw"}` : null;
  useEffect(() => {
    if (!resultKey) return;
    const t = window.setTimeout(() => track("tool_result", { tool: "max-lift", result: resultKey }), 1200);
    return () => window.clearTimeout(t);
  }, [resultKey]);

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["weight", "bodyweight"], to), units: to }));
  };

  return (
    <CalcShell label="Max squat and deadlift calculator" eyebrow="Your hardest set" toggle={<UnitToggle value={system} onChange={switchUnits} />}>
      <div className="space-y-4">
        <Segmented label="Lift" value={lift} onChange={(v) => set({ lift: v })} options={LIFTS} />
        <FieldGrid>
          <NumberField
            label={`${lift === "squat" ? "Squat" : "Deadlift"} weight`}
            unit={unit}
            value={s.weight}
            onChange={(w) => set({ weight: w })}
            placeholder={unit === "lb" ? (lift === "squat" ? "275" : "335") : lift === "squat" ? "125" : "150"}
            invalid={weight.bad}
            hint="Bar included."
          />
          <Stepper label="Reps completed" value={s.reps} onChange={(r) => set({ reps: r })} min={MIN_REPS} max={MAX_REPS} invalid={reps.bad} hint="Clean reps, to depth or lockout." />
          <Segmented label="Sex" value={sex} onChange={(v) => set({ sex: v })} options={SEX_OPTIONS} />
          <NumberField
            label="Your bodyweight"
            optional
            unit={unit}
            value={s.bodyweight}
            onChange={(b) => set({ bodyweight: b })}
            placeholder={unit === "lb" ? "185" : "84"}
            invalid={bw.bad}
            hint="Adds your strength level."
          />
        </FieldGrid>
      </div>
      {reps.value !== null && reps.value > CAUTION_ABOVE_REPS && (
        <Caution>Above {CAUTION_ABOVE_REPS} reps every formula drifts; a set of 3–6 reps gives the truest max.</Caution>
      )}

      <ResultPanel label={`Estimated ${lift} max`}>
        {max === null || !est || !spread ? (
          <ResultHint>Enter the weight and reps of one hard {lift} set to see your estimated max.</ResultHint>
        ) : (
          <>
            <BigStat
              label={`Estimated ${lift} max`}
              value={fmt(max, 0)}
              unit={unit}
              sub={
                reps.value === 1 ? (
                  <>A single is already your max.</>
                ) : (
                  <>
                    Average of Epley and Brzycki. The six common formulas land between {fmt(spread[0], 0)} and {fmt(spread[1], 0)} {unit}.
                  </>
                )
              }
            />
            <MiniStats>
              {st ? (
                <MiniStat label="Your level" value={st.level} note={`Beats ~${st.share}% of logged lifters`} />
              ) : (
                <MiniStat label="Your level" value="—" note="Add bodyweight" />
              )}
              {st?.next && <MiniStat label="Next level" value={show(st.next.value)} unit={unit} note={`${st.next.level}`} />}
              {bw.value !== null && <MiniStat label="× bodyweight" value={`${fmt(max / bw.value, 2, true)}×`} />}
            </MiniStats>
            {st && st.index >= 0 && <Note>{st.level} usually takes {LEVEL_TRAINING[st.index]}.</Note>}
            {lift === "deadlift" && reps.value !== null && reps.value > 1 && (
              <Note>Rep-based estimates tend to undershoot a tested deadlift max: your real single may be a little higher.</Note>
            )}

            <SubHeading>Every formula</SubHeading>
            <DataTable
              caption="One-rep max by formula"
              head={["Formula", `Max (${unit})`]}
              rows={ONE_RM_FORMULAS.map((f) => [f.name, fmt(est[f.id], 0)])}
            />
            <SubHeading>Training weights</SubHeading>
            <DataTable
              caption={`${lift} weights by rep target`}
              head={["Reps", `Load (${unit})`]}
              rows={TRAINING_REPS.map((r) => [r, fmt(roundToStep(epleyLoadForReps(max, r), LOAD_STEP[unit]), 0)])}
            />
            <Note>All-out efforts at each rep count (Epley solved for the load), rounded to {LOAD_STEP[unit]} {unit}. Work sets sit 5–15% lower.</Note>
            <DiagnoseLink detail={`maxlift:${lift}:${st?.level ?? "no-bw"}`}>
              {lift === "squat" ? "Squat stuck for weeks? Find out why" : "Deadlift stuck for weeks? Find out why"}
            </DiagnoseLink>
            <Sources
              items={[
                {
                  label: "LeSuer et al. 1997, J Strength Cond Res — prediction equations for bench, squat and deadlift",
                  href: "https://paulogentil.com/pdf/The%20Accuracy%20of%20Prediction%20Equations%20for%20Estimating%201-RM%20Performance%20in%20the%20Bench%20Press,%20Squat,%20and%20Deadlift.pdf",
                },
                { label: "Strength Level standards (self-reported, by bodyweight)", href: lift === "squat" ? "https://strengthlevel.com/strength-standards/squat/lb" : "https://strengthlevel.com/strength-standards/deadlift/lb" },
              ]}
            />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}
