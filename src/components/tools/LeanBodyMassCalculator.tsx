"use client";

import { boerLbm, fatFreeMass, humeLbm, jamesLbm, jamesPeakWeightKg, type Sex } from "@/lib/tools/formulas";
import { kgToLb, toKg } from "@/lib/tools/units";
import {
  BODYWEIGHT_RANGE,
  BigStat,
  CalcShell,
  DataTable,
  DiagnoseLink,
  FieldGrid,
  HeightField,
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
  oneOf,
  useStoredState,
  weightUnitOf,
  type UnitSystem,
} from "./shared";

const KEY = "ld_tool_lbm_v1";
const DEFAULTS = { units: "us", sex: "male", ft: "5", inch: "10", cm: "178", weight: "180", bodyFat: "" };
type State = typeof DEFAULTS;
const sanitize = (s: State): State => ({
  ...s,
  units: oneOf(s.units, UNIT_SYSTEMS, "us"),
  sex: oneOf(s.sex, ["male", "female"] as const, "male"),
});

export function LeanBodyMassCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = s.sex as Sex;

  const height = checkHeight(system, s);
  const weight = checkRange(s.weight, ...BODYWEIGHT_RANGE[unit]);
  const bodyFat = checkRange(s.bodyFat, 3, 60);
  const ready = height.value !== null && weight.value !== null;
  const kg = weight.value !== null ? toKg(weight.value, unit) : 0;
  const cm = height.value ?? 0;

  const rows = ready
    ? [
        { name: "Boer (1984)", lbm: boerLbm(sex, kg, cm) },
        { name: "James (1976)", lbm: jamesLbm(sex, kg, cm) },
        { name: "Hume (1966)", lbm: humeLbm(sex, kg, cm) },
        ...(bodyFat.value !== null ? [{ name: `Your ${bodyFat.value}% body fat`, lbm: fatFreeMass(kg, bodyFat.value) }] : []),
      ].filter((r) => r.lbm > 0 && r.lbm < kg)
    : [];
  const formulaRows = rows.filter((r) => !r.name.startsWith("Your"));
  const lo = formulaRows.length ? Math.min(...formulaRows.map((r) => r.lbm)) : 0;
  const hi = formulaRows.length ? Math.max(...formulaRows.map((r) => r.lbm)) : 0;
  const fromBodyFat = bodyFat.value !== null && ready ? fatFreeMass(kg, bodyFat.value) : null;
  const jamesOff = ready && kg > jamesPeakWeightKg(sex, cm);

  const inUnit = (lbmKg: number) => (unit === "lb" ? kgToLb(lbmKg) : lbmKg);

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
      label="Lean body mass calculator"
      eyebrow="Your measurements"
      toggle={<UnitToggle value={system} onChange={switchUnits} withHeight />}
    >
      <FieldGrid>
        <Segmented label="Sex" value={sex} options={SEX_OPTIONS} onChange={(v) => set({ sex: v })} />
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
          optional
          unit="%"
          value={s.bodyFat}
          onChange={(v) => set({ bodyFat: v })}
          placeholder="18"
          invalid={bodyFat.bad}
          hint={bodyFat.bad ? "Enter a body-fat estimate between 3 and 60%." : "If you know it, we add a direct estimate."}
        />
      </FieldGrid>

      <ResultPanel label="Lean body mass">
        {!ready || !rows.length ? (
          <ResultHint>Enter your height and bodyweight to see your lean body mass by three formulas.</ResultHint>
        ) : (
          <>
            {fromBodyFat !== null ? (
              <BigStat
                label="Lean body mass"
                value={fmt(inUnit(fromBodyFat), 1)}
                unit={unit}
                sub={
                  <>
                    Bodyweight × (1 − {bodyFat.value}% body fat) = {fmt(unit === "lb" ? fromBodyFat : kgToLb(fromBodyFat), 1)}{" "}
                    {unit === "lb" ? "kg" : "lb"}.
                    {formulaRows.length > 0 && (
                      <>
                        {" "}
                        The height-and-weight formulas below put you at {fmt(inUnit(lo), 1, true)}–{fmt(inUnit(hi), 1, true)}{" "}
                        {unit}.
                      </>
                    )}
                  </>
                }
              />
            ) : (
              <BigStat
                label="Lean body mass, estimated"
                value={`${fmt(inUnit(lo), 0)}–${fmt(inUnit(hi), 0)}`}
                unit={unit}
                sub={
                  <>
                    Range across the Boer, James and Hume formulas ({fmt(unit === "lb" ? lo : kgToLb(lo), 1)}–
                    {fmt(unit === "lb" ? hi : kgToLb(hi), 1)} {unit === "lb" ? "kg" : "lb"}). Add a body-fat estimate for a
                    direct figure.
                  </>
                }
              />
            )}

            <SubHeading>By formula</SubHeading>
            <DataTable
              caption="Lean body mass by formula in pounds and kilograms"
              head={["Method", "lb", "kg", "% of weight"]}
              rows={rows.map((r) => [r.name, fmt(kgToLb(r.lbm), 1), fmt(r.lbm, 1), `${fmt((r.lbm / kg) * 100, 0)}%`])}
            />
            {jamesOff && (
              <Note>
                At this height and weight the James formula is past its peak: above about{" "}
                {fmt(unit === "lb" ? kgToLb(jamesPeakWeightKg(sex, cm)) : jamesPeakWeightKg(sex, cm), 0)} {unit} it predicts
                less lean mass the more you weigh, so treat its number as too low.
              </Note>
            )}
            <Note>
              These formulas predict lean mass from height and weight only, so they cannot tell a muscular lifter from an
              untrained person of the same size. Hume&apos;s equations, for example, came from 29 men and 27 women
              measured by total body water.
            </Note>

            <Sources
              items={[
                { label: "Boer 1984 (as given by Caruso et al. 2018)", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6110034/" },
                {
                  label: "James 1976 (male multiplier 128, DICOM CP-1612)",
                  href: "https://dicom.nema.org/medical/dicom/Final/cp1612_ft_120or128forSUVformula.pdf",
                },
                { label: "Hume 1966, J Clin Pathol", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC473290/" },
              ]}
            />
          </>
        )}
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}
