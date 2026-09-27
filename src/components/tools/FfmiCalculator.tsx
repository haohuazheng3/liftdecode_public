"use client";

import { KOURI_NONUSER_LIMIT, ffmi } from "@/lib/tools/formulas";
import { fromKg, toKg } from "@/lib/tools/units";
import {
  BODYWEIGHT_RANGE,
  BigStat,
  CalcShell,
  DiagnoseLink,
  FieldGrid,
  HeightField,
  MiniStat,
  MiniStats,
  Note,
  NumberField,
  ResultHint,
  ResultPanel,
  Sources,
  SubHeading,
  UNIT_SYSTEMS,
  UnitToggle,
  checkHeight,
  checkRange,
  convertHeightFields,
  convertWeightFields,
  fmt,
  oneOf,
  useStoredState,
  weightUnitOf,
  type UnitSystem,
} from "./shared";

const KEY = "ld_tool_ffmi_v1";
const DEFAULTS = { units: "us", ft: "5", inch: "10", cm: "178", weight: "180", bodyFat: "15" };
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({ ...s, units: oneOf(s.units, UNIT_SYSTEMS, "us") });

/** Scale drawn under the result (FFMI points). */
const SCALE_MIN = 15;
const SCALE_MAX = 30;

export function FfmiCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);

  const height = checkHeight(system, s);
  const weight = checkRange(s.weight, ...BODYWEIGHT_RANGE[unit]);
  const bodyFat = checkRange(s.bodyFat, 3, 60);
  const r =
    height.value !== null && weight.value !== null && bodyFat.value !== null
      ? ffmi(toKg(weight.value, unit), height.value, bodyFat.value)
      : null;

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    set((prev) => ({
      ...convertWeightFields(prev, ["weight"], to),
      ...convertHeightFields(system, to, prev),
      units: to,
    }));
  };

  const pos = (v: number) => `${((Math.min(SCALE_MAX, Math.max(SCALE_MIN, v)) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100}%`;

  return (
    <CalcShell
      label="FFMI calculator"
      eyebrow="Your measurements"
      toggle={<UnitToggle value={system} onChange={switchUnits} withHeight />}
    >
      <FieldGrid>
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
          onChange={(weight) => set({ weight })}
          placeholder={unit === "lb" ? "180" : "82"}
          invalid={weight.bad}
          hint={
            weight.bad
              ? `Enter a bodyweight between ${BODYWEIGHT_RANGE[unit][0]} and ${BODYWEIGHT_RANGE[unit][1]} ${unit}.`
              : undefined
          }
        />
        <NumberField
          label="Body fat"
          unit="%"
          value={s.bodyFat}
          onChange={(bodyFat) => set({ bodyFat })}
          placeholder="15"
          invalid={bodyFat.bad}
          hint={bodyFat.bad ? "Enter a body-fat estimate between 3 and 60%." : "Your best estimate; the result moves with it."}
        />
      </FieldGrid>

      <ResultPanel label="Fat-free mass index">
        {!r ? (
          <ResultHint>Enter your height, bodyweight and a body-fat estimate to see your FFMI.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Normalized FFMI"
              value={fmt(r.normalized, 1, true)}
              sub={
                <>
                  Raw FFMI {fmt(r.ffmi, 1, true)}, adjusted to a height of 1.80 m (5 ft 11 in) so tall and short lifters compare
                  fairly.
                </>
              }
            />

            <MiniStats>
              <MiniStat label="Raw FFMI" value={fmt(r.ffmi, 1, true)} note="lean kg ÷ height m²" />
              <MiniStat label="Lean mass" value={fmt(fromKg(r.leanKg, unit), 1)} unit={unit} />
              <MiniStat label="Fat mass" value={fmt(fromKg(r.fatKg, unit), 1)} unit={unit} />
            </MiniStats>

            <SubHeading>Against Kouri et al. (1995)</SubHeading>
            <div className="relative mt-7 mb-2" aria-hidden="true">
              <div className="h-3 w-full rounded-full bg-linear-to-r from-white/[0.05] via-white/[0.1] to-signal/40" />
              <div className="absolute top-[-6px] h-6 w-px bg-ink-3" style={{ left: pos(KOURI_NONUSER_LIMIT) }} />
              <div
                className="absolute top-[-28px] -translate-x-1/2 whitespace-nowrap font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-3"
                style={{ left: pos(KOURI_NONUSER_LIMIT) }}
              >
                25.0
              </div>
              <div
                className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-void bg-signal shadow-[var(--shadow-signal)]"
                style={{ left: pos(r.normalized) }}
              />
              <div className="mt-2 flex justify-between font-mono text-[0.66rem] text-ink-3">
                <span>{SCALE_MIN}</span>
                <span>{SCALE_MAX}</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              {r.normalized <= KOURI_NONUSER_LIMIT ? (
                <>
                  Yours is {fmt(KOURI_NONUSER_LIMIT - r.normalized, 1, true)} below 25.0, the highest normalized FFMI Kouri et
                  al. found among 74 male athletes who had not used steroids.
                </>
              ) : (
                <>
                  Yours is {fmt(r.normalized - KOURI_NONUSER_LIMIT, 1, true)} above 25.0, the highest normalized FFMI Kouri et
                  al. found among 74 male athletes who had not used steroids. A body-fat estimate that is a few points
                  too low pushes FFMI up quickly, so check that number first.
                </>
              )}
            </p>
            <Note>
              Kouri&apos;s sample was men only; it gives no equivalent figure for women. Normalization: FFMI + 6.3 × (1.8 −
              height in m), as published. Some calculators use 6.1; the difference is tiny.
            </Note>

            <Sources
              items={[
                {
                  label: "Kouri, Pope, Katz & Oliva 1995, Clin J Sport Med 5(4):223–228",
                  href: "https://doi.org/10.1097/00042752-199510000-00003",
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
