"use client";

import { RPE_COLUMNS, RTS_RPE_CHART, e1rmFromRpe, loadFromRpe, rpeToPercent } from "@/lib/tools/formulas";
import { LOAD_STEP, roundToStep } from "@/lib/tools/units";
import {
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

const KEY = "ld_tool_rpe_v1";
const RPE_STRINGS = RPE_COLUMNS.map(String);
const DEFAULTS = { units: "us", weight: "315", reps: "5", rpe: "8", targetReps: "3", targetRpe: "9" };
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({
  ...s,
  units: oneOf(s.units, UNIT_SYSTEMS, "us"),
  rpe: oneOf(s.rpe, RPE_STRINGS, "8"),
  targetRpe: oneOf(s.targetRpe, RPE_STRINGS, "9"),
});

/** Low → high, the way lifters read the scale. */
const RPE_OPTIONS = [...RPE_COLUMNS].reverse().map((r) => ({ value: String(r), label: String(r) }));
const MAX_LOAD = { lb: 2000, kg: 900 } as const;
const MAX_CHART_REPS = RTS_RPE_CHART.length;

export function RpeCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);

  const weight = checkRange(s.weight, 1, MAX_LOAD[unit]);
  const reps = checkRange(s.reps, 1, MAX_CHART_REPS, true);
  const targetReps = checkRange(s.targetReps, 1, MAX_CHART_REPS, true);
  const rpe = Number(s.rpe);
  const targetRpe = Number(s.targetRpe);

  const pct = reps.value !== null ? rpeToPercent(reps.value, rpe) : null;
  const e1rm = weight.value !== null && reps.value !== null ? e1rmFromRpe(weight.value, reps.value, rpe) : null;
  const targetPct = targetReps.value !== null ? rpeToPercent(targetReps.value, targetRpe) : null;
  const targetLoad = e1rm !== null && targetReps.value !== null ? loadFromRpe(e1rm, targetReps.value, targetRpe) : null;

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["weight"], to), units: to }));
  };

  return (
    <CalcShell
      label="RPE calculator"
      eyebrow="Your top set"
      toggle={<UnitToggle value={system} onChange={switchUnits} />}
    >
      <FieldGrid>
        <NumberField
          label="Weight"
          unit={unit}
          value={s.weight}
          onChange={(weight) => set({ weight })}
          placeholder={unit === "lb" ? "315" : "140"}
          invalid={weight.bad}
          hint={weight.bad ? `Enter a weight between 1 and ${MAX_LOAD[unit]} ${unit}.` : undefined}
        />
        <Stepper
          label="Reps"
          value={s.reps}
          onChange={(reps) => set({ reps })}
          min={1}
          max={MAX_CHART_REPS}
          invalid={reps.bad}
          hint={reps.bad ? `The chart covers 1–${MAX_CHART_REPS} reps.` : undefined}
        />
      </FieldGrid>
      <div className="mt-4">
        <Segmented label="RPE of that set" value={s.rpe} options={RPE_OPTIONS} onChange={(v) => set({ rpe: v })} columns={4} />
        <p className="mt-1.5 text-xs text-ink-3">10 = nothing left · 9 = one more rep in the tank · 8 = two more.</p>
      </div>

      <div className="hairline my-6" aria-hidden="true" />
      <div className="eyebrow mb-4">Your next set</div>
      <FieldGrid>
        <Stepper
          label="Target reps"
          value={s.targetReps}
          onChange={(v) => set({ targetReps: v })}
          min={1}
          max={MAX_CHART_REPS}
          invalid={targetReps.bad}
          hint={targetReps.bad ? `The chart covers 1–${MAX_CHART_REPS} reps.` : undefined}
        />
        <Segmented
          label="Target RPE"
          value={s.targetRpe}
          options={RPE_OPTIONS}
          onChange={(v) => set({ targetRpe: v })}
          columns={4}
        />
      </FieldGrid>

      <ResultPanel label="RPE results">
        {e1rm === null || pct === null ? (
          <ResultHint>Enter the weight, reps (1–{MAX_CHART_REPS}) and RPE of your top set to estimate your max.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Estimated 1RM"
              value={fmt(e1rm, 1)}
              unit={unit}
              sub={
                <>
                  {fmt(weight.value ?? 0, 1)} {unit} × {reps.value} @ RPE {s.rpe} is {fmt(pct, 1, true)}% of max on the RTS chart.
                </>
              }
            />
            <MiniStats>
              <MiniStat
                label={`Target: ${targetReps.value ?? "–"} @ ${s.targetRpe}`}
                value={targetLoad !== null ? fmt(roundToStep(targetLoad, LOAD_STEP[unit]), 1) : "–"}
                unit={targetLoad !== null ? unit : undefined}
                note={
                  targetLoad !== null && targetPct !== null
                    ? `${fmt(targetPct, 1, true)}% · exact ${fmt(targetLoad, 1)}`
                    : "Pick 1–12 target reps"
                }
              />
              <MiniStat label="Reps in reserve" value={fmt(10 - targetRpe, 1)} note="at the target RPE" />
            </MiniStats>
            <Note>
              Target load rounded to the nearest {LOAD_STEP[unit]} {unit}. The chart is a starting point: its author, Mike
              Tuchscherer, recommends customizing it to your own lifts.
            </Note>

            <SubHeading>RTS chart: % of 1RM</SubHeading>
            <RpeChart
              reps={reps.value}
              rpe={rpe}
              targetReps={targetReps.value}
              targetRpe={targetRpe}
            />
            <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3" aria-hidden="true">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-signal" /> Your set
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-clear/60" /> Your target
              </span>
              <span>Scroll the chart sideways on a phone.</span>
            </p>

            <Sources
              items={[
                {
                  label: "Tuchscherer, “Customizing Your RPE Chart”, Reactive Training Systems (2016)",
                  href: "https://store.reactivetrainingsystems.com/blogs/advanced-concepts/customizing-your-rpe-chart",
                },
              ]}
              lead="Chart"
            />
          </>
        )}
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}

/** The full 12 × 8 chart; scrolls sideways inside its own box so the page never does. */
function RpeChart({
  reps,
  rpe,
  targetReps,
  targetRpe,
}: {
  reps: number | null;
  rpe: number;
  targetReps: number | null;
  targetRpe: number;
}) {
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-line" tabIndex={0} aria-label="RPE chart, scrolls sideways">
      <table className="w-full min-w-[34rem] border-collapse text-[0.85rem] tabular-nums">
        <caption className="sr-only">Percent of one-rep max by reps and RPE (Reactive Training Systems chart)</caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 border-b border-r border-line bg-[#0e0e12] px-2.5 py-2 text-left font-mono text-[0.66rem] font-normal uppercase tracking-[0.1em] text-ink-3"
            >
              Reps \ RPE
            </th>
            {RPE_COLUMNS.map((r) => (
              <th
                key={r}
                scope="col"
                className={`border-b border-line px-2 py-2 text-right font-mono text-[0.72rem] font-normal ${
                  r === rpe || r === targetRpe ? "text-signal" : "text-ink-3"
                }`}
              >
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RTS_RPE_CHART.map((row, i) => {
            const r = i + 1;
            return (
              <tr key={r}>
                <th
                  scope="row"
                  className={`sticky left-0 z-10 border-r border-line bg-[#0e0e12] px-2.5 py-1.5 text-left font-mono text-[0.78rem] font-normal ${
                    r === reps || r === targetReps ? "text-signal" : "text-ink-2"
                  }`}
                >
                  {r}
                </th>
                {row.map((v, c) => {
                  const col = RPE_COLUMNS[c];
                  const isSet = r === reps && col === rpe;
                  const isTarget = r === targetReps && col === targetRpe;
                  return (
                    <td
                      key={col}
                      className={`px-2 py-1.5 text-right ${
                        isSet
                          ? "bg-signal font-semibold text-[#14100a]"
                          : isTarget
                            ? "bg-clear/20 font-semibold text-clear"
                            : "text-ink-2"
                      }`}
                    >
                      {v.toFixed(1)}
                      {isSet && <span className="sr-only"> (your set)</span>}
                      {isTarget && <span className="sr-only"> (target set)</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
