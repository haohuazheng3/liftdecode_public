"use client";

import { useEffect } from "react";
import { track } from "@/components/Analytics";
import { MAX_REPS, MIN_REPS, headlineOneRepMax, percentTable } from "@/lib/tools/formulas";
import { LOAD_STEP } from "@/lib/tools/units";
import {
  BigStat,
  CalcShell,
  DataTable,
  DiagnoseLink,
  FieldGrid,
  Note,
  NumberField,
  ResultHint,
  ResultPanel,
  Segmented,
  Sources,
  Stepper,
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

const MODES = [
  { value: "max", label: "I know my max" },
  { value: "set", label: "From a hard set" },
] as const;
const DEFAULTS = { units: "us", mode: "max", max: "", weight: "", reps: "5" };
const MAX_LOAD = { lb: 1500, kg: 680 } as const;

/** What the reps column means in practice: how a % of max usually feels. */
function zone(p: number): string {
  if (p >= 90) return "Heavy singles to triples";
  if (p >= 80) return "Strength work, 3–6 reps";
  if (p >= 65) return "Hypertrophy work, 6–12 reps";
  return "Warm-ups and technique";
}

export function PercentChart() {
  const [s, set] = useStoredState("ld_tool_pctchart_v1", DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const mode = oneOf(s.mode, MODES.map((m) => m.value), "max");
  const maxIn = checkRange(s.max, 1, MAX_LOAD[unit]);
  const weight = checkRange(s.weight, 1, MAX_LOAD[unit]);
  const reps = checkRange(s.reps, MIN_REPS, MAX_REPS, true);
  const oneRm =
    mode === "max" ? maxIn.value : weight.value !== null && reps.value !== null ? headlineOneRepMax(weight.value, reps.value) : null;
  const rows = oneRm !== null ? percentTable(oneRm, LOAD_STEP[unit]) : null;

  useEffect(() => {
    if (oneRm === null) return;
    const t = window.setTimeout(() => track("tool_result", { tool: "1rm-chart", mode }), 1500);
    return () => window.clearTimeout(t);
  }, [oneRm, mode]);

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["max", "weight"], to), units: to }));
  };

  return (
    <CalcShell label="1RM percentage chart" eyebrow="Your max" toggle={<UnitToggle value={system} onChange={switchUnits} />}>
      <div className="space-y-4">
        <Segmented label="Start from" value={mode} onChange={(v) => set({ mode: v })} options={MODES} />
        {mode === "max" ? (
          <div className="max-w-sm">
            <NumberField
              label="One-rep max"
              unit={unit}
              value={s.max}
              onChange={(m) => set({ max: m })}
              placeholder={unit === "lb" ? "315" : "140"}
              invalid={maxIn.bad}
              hint="A recent tested single, or a good estimate."
            />
          </div>
        ) : (
          <FieldGrid>
            <NumberField label="Weight lifted" unit={unit} value={s.weight} onChange={(w) => set({ weight: w })} placeholder={unit === "lb" ? "275" : "125"} invalid={weight.bad} />
            <Stepper label="Reps completed" value={s.reps} onChange={(r) => set({ reps: r })} min={MIN_REPS} max={MAX_REPS} invalid={reps.bad} />
          </FieldGrid>
        )}
      </div>

      <ResultPanel label="Percentage chart">
        {oneRm === null || rows === null ? (
          <ResultHint>Enter your max (or one hard set) to build your percentage chart.</ResultHint>
        ) : (
          <>
            <BigStat label={mode === "max" ? "Your max" : "Estimated max"} value={fmt(oneRm, 0)} unit={unit} />
            <div className="mt-5">
              <DataTable
                caption="Training weights by percentage of one-rep max"
                head={["% of max", `Load (${unit})`, "≈ reps", "Use"]}
                rows={rows.map((r) => [`${r.percent}%`, fmt(r.weight, 1), r.reps, zone(r.percent)])}
                align={["left", "right", "right", "left"]}
              />
            </div>
            <Note>
              Loads round to the nearest {LOAD_STEP[unit]} {unit}. Reps are the Epley estimate of what that load allows to failure;
              most people get a rep or two fewer on squats and more on machines.
            </Note>
            <DiagnoseLink detail="1rm-chart">Same max for months? Find out what is holding it</DiagnoseLink>
            <Sources
              items={[
                { label: "One-repetition maximum formulas (Wikipedia)", href: "https://en.wikipedia.org/wiki/One-repetition_maximum" },
                { label: "Reynolds et al. 2006, J Strength Cond Res — predicting 1RM from reps", href: "https://www.unm.edu/~rrobergs/478RMStrengthPrediction.pdf" },
              ]}
            />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}
