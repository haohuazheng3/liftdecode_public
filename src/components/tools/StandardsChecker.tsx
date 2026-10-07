"use client";

import { useEffect } from "react";
import { CAUTION_ABOVE_REPS, MAX_REPS, MIN_REPS, headlineOneRepMax, type Sex } from "@/lib/tools/formulas";
import {
  LEVELS,
  LEVEL_TRAINING,
  STANDARDS,
  kgToLb,
  lbToKg,
  standing,
  type LiftId,
  type Standing,
} from "@/lib/tools/standards";
import { track } from "@/components/Analytics";
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

/* ------------------------------------------------------------------ */
/* Shared bits                                                          */
/* ------------------------------------------------------------------ */

type WeightLift = Exclude<LiftId, "pullups" | "total">;
const SEXES = ["male", "female"] as const;
const MAX_LOAD = { lb: 1500, kg: 680 } as const;
const MAX_PULLUPS = 60;

const LIFT_LABEL: Record<LiftId, string> = {
  bench: "Bench press",
  squat: "Squat",
  deadlift: "Deadlift",
  legpress: "Leg press",
  dbbench: "Dumbbell bench",
  pullups: "Pull-ups",
  total: "Total",
};

const SL_FAQ = { label: "Strength Level: what the levels mean", href: "https://strengthlevel.com/faq" };

function sourceFor(lift: LiftId) {
  return { label: `Strength Level ${STANDARDS[lift].name.toLowerCase()} standards (self-reported, by bodyweight)`, href: STANDARDS[lift].source };
}

/** Display a value stored in lb in the chosen unit. */
const show = (lb: number, unit: "lb" | "kg", decimals = 0) => fmt(unit === "kg" ? lbToKg(lb) : lb, decimals);
const toLb = (v: number, unit: "lb" | "kg") => (unit === "kg" ? kgToLb(v) : v);

const SHORT = ["Beg.", "Nov.", "Int.", "Adv.", "Elite"] as const;

/** Five threshold ticks and a marker for the lift — the standing at a glance. */
function LevelBar({ s, value, unit, measure }: { s: Standing; value: number; unit: "lb" | "kg"; measure: "lb" | "reps" }) {
  const top = Math.max(s.thresholds[4] * 1.12, value * 1.04, 1);
  const pos = (v: number) => `${Math.min(100, Math.max(0, (v / top) * 100))}%`;
  const label = (v: number) => (measure === "reps" ? fmt(v, 0) : show(v, unit));
  return (
    <div className="mt-5" aria-hidden="true">
      <div className="relative h-3 rounded-full bg-white/[0.06]">
        <div className="absolute inset-y-0 left-0 rounded-full bg-signal/70" style={{ width: pos(value) }} />
        {s.thresholds.map((t, i) => (
          <span key={LEVELS[i]} className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-ink-3" style={{ left: pos(t) }} />
        ))}
      </div>
      <div className="relative mt-2 h-9 text-[0.68rem] leading-tight text-ink-3">
        {s.thresholds.map((t, i) => (
          <span
            key={LEVELS[i]}
            className={`absolute -translate-x-1/2 text-center tabular-nums ${i === s.index ? "text-ink" : ""} ${i % 2 ? "top-4" : "top-0"}`}
            style={{ left: pos(t) }}
          >
            {SHORT[i]}
            <span className="block font-mono">{label(t)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ctaLine(s: Standing): string {
  if (s.index >= 3) return "Strong and still stuck? Find out what is holding the number";
  if (s.index >= 1) return `Stuck at ${s.level.toLowerCase()} for months? Find out why`;
  return "Training hard but the number won't move? Find out why";
}

/** One analytics event per distinct result (level + lift), never on every keystroke. */
function useResultEvent(tool: string, key: string | null, props: Record<string, unknown>) {
  useEffect(() => {
    if (!key) return;
    const t = window.setTimeout(() => track("tool_result", { tool, ...props }), 1200);
    return () => window.clearTimeout(t);
    // props are derived from key; re-sending only when the key changes is the point
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, key]);
}

/* ------------------------------------------------------------------ */
/* Single lift                                                          */
/* ------------------------------------------------------------------ */

type SingleState = { units: string; sex: string; lift: string; bodyweight: string; weight: string; reps: string };
const singleDefaults = new Map<string, SingleState>();
function singleDefaultsFor(id: string, lift: LiftId, sex: Sex): SingleState {
  let d = singleDefaults.get(id);
  if (!d) {
    d = { units: "us", sex, lift, bodyweight: "", weight: "", reps: lift === "pullups" ? "" : "1" };
    singleDefaults.set(id, d);
  }
  return d;
}

export interface StandardsCheckerProps {
  /** storage key and analytics id, unique per page */
  id: string;
  eyebrow: string;
  /** one lift, or several with a picker (first is the default) */
  lifts: readonly Exclude<LiftId, "total">[];
  defaultSex?: Sex;
  /** a load worth benchmarking, e.g. 225 or 315 lb on the bench page */
  milestoneLb?: number;
}

export function StandardsChecker({ id, eyebrow, lifts, defaultSex = "male", milestoneLb }: StandardsCheckerProps) {
  const defaults = singleDefaultsFor(id, lifts[0], defaultSex);
  const [s, set] = useStoredState(`ld_std_${id}_v1`, defaults);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = oneOf(s.sex, SEXES, defaultSex);
  const lift = oneOf(s.lift, lifts, lifts[0]);
  const table = STANDARDS[lift];
  const isReps = table.measure === "reps";

  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const weight = checkRange(s.weight, 1, MAX_LOAD[unit]);
  const reps = checkRange(s.reps, isReps ? 0 : MIN_REPS, isReps ? MAX_PULLUPS : MAX_REPS, true);

  const oneRm = !isReps && weight.value !== null && reps.value !== null ? headlineOneRepMax(weight.value, reps.value) : null;
  const value = isReps ? reps.value : oneRm !== null ? toLb(oneRm, unit) : null;
  const bwLb = bw.value !== null ? toLb(bw.value, unit) : null;
  const st = value !== null && bwLb !== null ? standing(lift, sex, bwLb, value) : null;
  const ms = milestoneLb !== undefined && bwLb !== null && !isReps ? standing(lift, sex, bwLb, milestoneLb) : null;

  useResultEvent(id, st ? `${lift}:${st.level}` : null, { lift, level: st?.level, share: st?.share });

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["weight", "bodyweight"], to), units: to }));
  };

  return (
    <CalcShell label={`${LIFT_LABEL[lift]} strength check`} eyebrow={eyebrow} toggle={<UnitToggle value={system} onChange={switchUnits} />}>
      <div className="space-y-4">
        {lifts.length > 1 && (
          <Segmented
            label="Lift"
            value={lift}
            onChange={(v) => set({ lift: v, reps: v === "pullups" ? "" : s.reps || "1" })}
            options={lifts.map((l) => ({ value: l, label: LIFT_LABEL[l] }))}
          />
        )}
        <FieldGrid>
          <Segmented label="Sex" value={sex} onChange={(v) => set({ sex: v })} options={SEX_OPTIONS} />
          <NumberField
            label="Your bodyweight"
            unit={unit}
            value={s.bodyweight}
            onChange={(bodyweight) => set({ bodyweight })}
            placeholder={unit === "lb" ? "180" : "82"}
            invalid={bw.bad}
            hint={bw.bad ? `Enter ${BODYWEIGHT_RANGE[unit][0]}–${BODYWEIGHT_RANGE[unit][1]} ${unit}.` : "Standards scale with bodyweight."}
          />
          {isReps ? (
            <Stepper
              label="Strict pull-ups in one set"
              value={s.reps}
              onChange={(r) => set({ reps: r })}
              min={0}
              max={MAX_PULLUPS}
              invalid={reps.bad}
              hint="Dead hang to chin over the bar, no kipping."
            />
          ) : (
            <>
              <NumberField
                label={lift === "dbbench" ? "One dumbbell" : `${LIFT_LABEL[lift]} weight`}
                unit={unit}
                value={s.weight}
                onChange={(w) => set({ weight: w })}
                placeholder={unit === "lb" ? (lift === "dbbench" ? "70" : "225") : lift === "dbbench" ? "32" : "100"}
                invalid={weight.bad}
                hint={
                  weight.bad
                    ? `Enter a weight up to ${MAX_LOAD[unit]} ${unit}.`
                    : lift === "dbbench"
                      ? "The weight of one dumbbell, not the pair."
                      : lift === "legpress"
                        ? "Plates on a 45° sled, as you would log it."
                        : "Bar included."
                }
              />
              <Stepper
                label="Reps in that set"
                value={s.reps}
                onChange={(r) => set({ reps: r })}
                min={MIN_REPS}
                max={MAX_REPS}
                invalid={reps.bad}
                hint="1 if it was a true max."
              />
            </>
          )}
        </FieldGrid>
      </div>
      {!isReps && reps.value !== null && reps.value > CAUTION_ABOVE_REPS && (
        <Caution>Above {CAUTION_ABOVE_REPS} reps the estimated max drifts; a set of 3–8 gives a truer level.</Caution>
      )}

      <ResultPanel label="Your strength level">
        {st === null || value === null || bwLb === null ? (
          <ResultHint>
            Enter your bodyweight and {isReps ? "your best set of strict pull-ups" : "one hard set"} to see your level.
          </ResultHint>
        ) : (
          <>
            <BigStat
              label={`Your ${LIFT_LABEL[lift].toLowerCase()} level`}
              value={st.level}
              sub={
                <>
                  Stronger than about <strong className="text-ink">{st.share}%</strong> of {sex === "male" ? "men" : "women"} who log
                  this lift on Strength Level at your bodyweight
                  {st.index >= 0 ? <> — a level that usually takes {LEVEL_TRAINING[st.index]}.</> : "."}
                </>
              }
            />
            <LevelBar s={st} value={value} unit={unit} measure={table.measure} />
            <MiniStats>
              {!isReps && oneRm !== null && (
                <MiniStat
                  label={reps.value === 1 ? "Your max" : "Estimated max"}
                  value={fmt(oneRm, 0)}
                  unit={unit}
                  note={reps.value === 1 ? undefined : "Epley–Brzycki average"}
                />
              )}
              {!isReps && oneRm !== null && bw.value !== null && (
                <MiniStat label="× bodyweight" value={`${fmt(oneRm / bw.value, 2, true)}×`} />
              )}
              <MiniStat
                label="Next level"
                value={st.next ? (isReps ? fmt(Math.ceil(st.next.value), 0) : show(st.next.value, unit)) : "—"}
                unit={st.next ? (isReps ? "reps" : unit) : undefined}
                note={
                  st.next
                    ? `${st.next.level}: ${isReps ? fmt(Math.max(0, Math.ceil(st.next.value - value)), 0) + " more" : show(Math.max(0, st.next.value - value), unit) + " " + unit + " to go"}`
                    : "Top of the table"
                }
              />
            </MiniStats>
            {ms && milestoneLb !== undefined && (
              <Note>
                At your bodyweight, a {show(milestoneLb, unit)} {unit} {LIFT_LABEL[lift].toLowerCase()} is{" "}
                {ms.index >= 0 ? `${ms.level.toLowerCase()}` : "below beginner"} — stronger than about {ms.share}% of logged
                lifters. {value >= milestoneLb ? "You are past it." : `You are ${show(milestoneLb - value, unit)} ${unit} away.`}
              </Note>
            )}
            {st.clamped && (
              <Caution>
                Your bodyweight is outside the table ({show(STANDARDS[lift][sex][0][0], unit)}–
                {show(STANDARDS[lift][sex][STANDARDS[lift][sex].length - 1][0], unit)} {unit}); the nearest row is used.
              </Caution>
            )}
            <DiagnoseLink detail={`${lift}:${st.level}`}>{ctaLine(st)}</DiagnoseLink>
            <Sources items={[sourceFor(lift), SL_FAQ]} />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}

/* ------------------------------------------------------------------ */
/* Several lifts at once: "how strong am I"                              */
/* ------------------------------------------------------------------ */

const PROFILE_LIFTS = ["bench", "squat", "deadlift"] as const satisfies readonly WeightLift[];
type ProfileState = {
  units: string;
  sex: string;
  bodyweight: string;
  bench: string;
  benchReps: string;
  squat: string;
  squatReps: string;
  deadlift: string;
  deadliftReps: string;
  pullups: string;
};
const PROFILE_DEFAULTS: ProfileState = {
  units: "us",
  sex: "male",
  bodyweight: "",
  bench: "",
  benchReps: "1",
  squat: "",
  squatReps: "1",
  deadlift: "",
  deadliftReps: "1",
  pullups: "",
};

export function StrengthProfile({ id, eyebrow }: { id: string; eyebrow: string }) {
  const [s, set] = useStoredState(`ld_profile_${id}_v1`, PROFILE_DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = oneOf(s.sex, SEXES, "male");
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const bwLb = bw.value !== null ? toLb(bw.value, unit) : null;

  const rows = PROFILE_LIFTS.map((lift) => {
    const w = checkRange(s[lift], 1, MAX_LOAD[unit]);
    const r = checkRange(s[`${lift}Reps` as const], MIN_REPS, MAX_REPS, true);
    const max = w.value !== null && r.value !== null ? headlineOneRepMax(w.value, r.value) : null;
    const st = max !== null && bwLb !== null ? standing(lift, sex, bwLb, toLb(max, unit)) : null;
    return { lift, w, r, max, st };
  });
  const pu = checkRange(s.pullups, 0, MAX_PULLUPS, true);
  const puSt = pu.value !== null && s.pullups.trim() !== "" && bwLb !== null ? standing("pullups", sex, bwLb, pu.value) : null;

  const scored = [...rows.map((r) => r.st), puSt].filter((x): x is Standing => x !== null);
  // Overall = the average share across the lifts entered: one number, honest about being a blend.
  const overallShare = scored.length ? Math.round(scored.reduce((a, b) => a + b.share, 0) / scored.length) : null;
  const overallIndex = overallShare === null ? -1 : [5, 20, 50, 80, 95].filter((x) => overallShare >= x).length - 1;
  const weakest = scored.length >= 2 ? [...rows.filter((r) => r.st), ...(puSt ? [{ lift: "pullups" as const, st: puSt }] : [])].sort((a, b) => a.st!.share - b.st!.share)[0] : null;

  useResultEvent(id, overallShare !== null ? `${scored.length}:${overallIndex}` : null, { lifts: scored.length, overall: overallShare });

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["bodyweight", "bench", "squat", "deadlift"], to), units: to }));
  };

  return (
    <CalcShell label="Strength test" eyebrow={eyebrow} toggle={<UnitToggle value={system} onChange={switchUnits} />}>
      <FieldGrid>
        <Segmented label="Sex" value={sex} onChange={(v) => set({ sex: v })} options={SEX_OPTIONS} />
        <NumberField
          label="Your bodyweight"
          unit={unit}
          value={s.bodyweight}
          onChange={(bodyweight) => set({ bodyweight })}
          placeholder={unit === "lb" ? "180" : "82"}
          invalid={bw.bad}
          hint={bw.bad ? `Enter ${BODYWEIGHT_RANGE[unit][0]}–${BODYWEIGHT_RANGE[unit][1]} ${unit}.` : "Fill in any lifts you do; skip the rest."}
        />
      </FieldGrid>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {rows.map(({ lift, w }) => (
          <div key={lift} className="min-w-0 space-y-2">
            <NumberField
              label={LIFT_LABEL[lift]}
              unit={unit}
              value={s[lift]}
              onChange={(v) => set({ [lift]: v } as Partial<ProfileState>)}
              placeholder={unit === "lb" ? { bench: "185", squat: "245", deadlift: "315" }[lift] : { bench: "85", squat: "110", deadlift: "140" }[lift]}
              invalid={w.bad}
              optional
            />
            <Stepper
              label="Reps"
              value={s[`${lift}Reps` as const]}
              onChange={(v) => set({ [`${lift}Reps`]: v } as Partial<ProfileState>)}
              min={MIN_REPS}
              max={MAX_REPS}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 max-w-xs">
        <Stepper label="Strict pull-ups (optional)" value={s.pullups} onChange={(v) => set({ pullups: v })} min={0} max={MAX_PULLUPS} />
      </div>

      <ResultPanel label="Your strength profile">
        {overallShare === null ? (
          <ResultHint>Enter your bodyweight and at least one lift to see where you stand.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Overall"
              value={overallIndex >= 0 ? LEVELS[overallIndex] : "Below beginner"}
              sub={
                <>
                  Averaged across {scored.length} {scored.length === 1 ? "lift" : "lifts"}, you are stronger than about{" "}
                  <strong className="text-ink">{overallShare}%</strong> of {sex === "male" ? "men" : "women"} who log these lifts at
                  your bodyweight.
                </>
              }
            />
            <SubHeading>Lift by lift</SubHeading>
            <DataTable
              caption="Strength level by lift"
              head={["Lift", "Max", "Level", "Beats"]}
              rows={[
                ...rows
                  .filter((r) => r.st && r.max !== null)
                  .map((r) => [LIFT_LABEL[r.lift], `${fmt(r.max!, 0)} ${unit}`, r.st!.level, `~${r.st!.share}%`]),
                ...(puSt ? [[LIFT_LABEL.pullups, `${pu.value} reps`, puSt.level, `~${puSt.share}%`]] : []),
              ]}
            />
            {weakest && weakest.st && (
              <Note>
                Your weakest link is the {LIFT_LABEL[weakest.lift].toLowerCase()} ({weakest.st.level.toLowerCase()}). A lift that
                trails the others by a level is usually under-trained or under-progressed, not a talent ceiling.
              </Note>
            )}
            <DiagnoseLink detail={`profile:${overallShare}`}>Find out what is holding your numbers back</DiagnoseLink>
            <Sources items={[sourceFor("bench"), sourceFor("squat"), sourceFor("deadlift"), SL_FAQ]} />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}

/* ------------------------------------------------------------------ */
/* Powerlifting total: the 1000 lb club                                 */
/* ------------------------------------------------------------------ */

type TotalState = { units: string; sex: string; bodyweight: string; squat: string; bench: string; deadlift: string };
const TOTAL_DEFAULTS: TotalState = { units: "us", sex: "male", bodyweight: "", squat: "", bench: "", deadlift: "" };
const CLUB_LB = 1000;

export function TotalChecker({ id, eyebrow }: { id: string; eyebrow: string }) {
  const [s, set] = useStoredState(`ld_total_${id}_v1`, TOTAL_DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = oneOf(s.sex, SEXES, "male");
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const lifts = (["squat", "bench", "deadlift"] as const).map((l) => ({ l, c: checkRange(s[l], 1, MAX_LOAD[unit]) }));
  const all = lifts.every((x) => x.c.value !== null);
  const total = all ? lifts.reduce((a, x) => a + (x.c.value ?? 0), 0) : null;
  const totalLb = total !== null ? toLb(total, unit) : null;
  const bwLb = bw.value !== null ? toLb(bw.value, unit) : null;
  const st = totalLb !== null && bwLb !== null ? standing("total", sex, bwLb, totalLb) : null;
  const club = bwLb !== null ? standing("total", sex, bwLb, CLUB_LB) : null;

  useResultEvent(id, st ? st.level : null, { level: st?.level, club: totalLb !== null ? totalLb >= CLUB_LB : undefined });

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({ ...convertWeightFields(prev, ["bodyweight", "squat", "bench", "deadlift"], to), units: to }));
  };

  return (
    <CalcShell label="1000 lb club calculator" eyebrow={eyebrow} toggle={<UnitToggle value={system} onChange={switchUnits} />}>
      <FieldGrid>
        <Segmented label="Sex" value={sex} onChange={(v) => set({ sex: v })} options={SEX_OPTIONS} />
        <NumberField
          label="Your bodyweight"
          unit={unit}
          value={s.bodyweight}
          onChange={(bodyweight) => set({ bodyweight })}
          placeholder={unit === "lb" ? "190" : "86"}
          invalid={bw.bad}
          optional
          hint="Adds where your total ranks at your size."
        />
      </FieldGrid>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {lifts.map(({ l, c }) => (
          <NumberField
            key={l}
            label={`${LIFT_LABEL[l]} max`}
            unit={unit}
            value={s[l]}
            onChange={(v) => set({ [l]: v } as Partial<TotalState>)}
            placeholder={unit === "lb" ? { squat: "315", bench: "225", deadlift: "405" }[l] : { squat: "140", bench: "100", deadlift: "180" }[l]}
            invalid={c.bad}
          />
        ))}
      </div>

      <ResultPanel label="Your total">
        {total === null || totalLb === null ? (
          <ResultHint>Enter your best squat, bench and deadlift (one-rep maxes or good estimates) to see your total.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Your total"
              value={fmt(total, 0)}
              unit={unit}
              sub={
                totalLb >= CLUB_LB ? (
                  <>You are in the 1000 lb club{unit === "kg" ? ` (1000 lb is ${fmt(lbToKg(CLUB_LB), 1)} kg)` : ""}.</>
                ) : (
                  <>
                    <strong className="text-ink">{show(CLUB_LB - totalLb, unit)} {unit}</strong> to go to 1,000 lb
                    {unit === "kg" ? ` (${fmt(lbToKg(CLUB_LB), 1)} kg)` : ""}.
                  </>
                )
              }
            />
            {st && totalLb !== null && <LevelBar s={st} value={totalLb} unit={unit} measure="lb" />}
            <MiniStats>
              {st && <MiniStat label="Total level" value={st.level} note={`Beats ~${st.share}% of logged totals`} />}
              {club && <MiniStat label="1,000 lb at your size" value={club.level} note={`Beats ~${club.share}% at your bodyweight`} />}
            </MiniStats>
            {!st && <Note>Add your bodyweight to see what your total and 1,000 lb mean at your size.</Note>}
            <DiagnoseLink detail={st ? `total:${st.level}` : "total"}>Total stuck short of the goal? Find out why</DiagnoseLink>
            <Sources items={[sourceFor("total"), SL_FAQ]} />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}

/** The /tools/how-strong-am-i calculator (tool pages take components without props). */
export function HowStrongAmITool() {
  return <StrengthProfile id="how-strong-am-i" eyebrow="Your lifts" />;
}
