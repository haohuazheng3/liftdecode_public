"use client";

import { useEffect } from "react";
import { track } from "@/components/Analytics";
import { PROTEIN_PER_MEAL, WEEKS_PER_MONTH } from "@/lib/tools/formulas";
import { kgToLb, lbToKg } from "@/lib/tools/standards";
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

const MORTON = {
  label: "Morton et al. 2018, Br J Sports Med — protein and resistance-training gains (meta-analysis)",
  href: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
};
const IRAKI = {
  label: "Iraki et al. 2019, Sports — off-season nutrition for bodybuilders",
  href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/",
};
const SCHOENFELD_ARAGON = {
  label: "Schoenfeld & Aragon 2018, JISSN — protein per meal",
  href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5828430/",
};
const MOORE = {
  label: "Moore et al. 2015, J Gerontol A — protein per meal in older vs younger men",
  href: "https://pubmed.ncbi.nlm.nih.gov/25056502/",
};
const MCDONALD = {
  label: "McDonald's muscle-gain model (Body Recomposition)",
  href: "https://bodyrecomposition.com/muscle-gain/genetic-muscular-potential",
};

function useResult(tool: string, key: string | null) {
  useEffect(() => {
    if (!key) return;
    const t = window.setTimeout(() => track("tool_result", { tool, result: key }), 1200);
    return () => window.clearTimeout(t);
  }, [tool, key]);
}

/* ------------------------------------------------------------------ */
/* Protein: am I eating enough?                                         */
/* ------------------------------------------------------------------ */

const PROTEIN_DEFAULTS = { units: "us", bodyweight: "", grams: "" };
type ProteinBand = "low" | "close" | "target" | "high";
const BAND_COPY: Record<ProteinBand, { title: string; body: string }> = {
  low: {
    title: "Below the useful range",
    body: "Under about 1.2 g per kg, protein is a real candidate for slow gains. Raising it is the cheapest fix in lifting.",
  },
  close: {
    title: "Close, not quite there",
    body: "Gains in the research level off around 1.6 g per kg. You are within reach: one more protein-rich meal usually closes the gap.",
  },
  target: {
    title: "Protein is covered",
    body: "You are in the 1.6–2.2 g per kg range where extra protein stops adding muscle. If you are still not growing, protein is not your bottleneck.",
  },
  high: {
    title: "More than you need",
    body: "Above about 2.2 g per kg the extra protein does not buy more muscle. It is not harmful for healthy adults, but it is not your lever.",
  },
};

export function ProteinCheck() {
  const [s, set] = useStoredState("ld_check_protein_v1", PROTEIN_DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const g = checkRange(s.grams, 10, 600, true);
  const kg = bw.value !== null ? (unit === "kg" ? bw.value : lbToKg(bw.value)) : null;
  const perKg = kg !== null && g.value !== null ? g.value / kg : null;
  const band: ProteinBand | null = perKg === null ? null : perKg < 1.2 ? "low" : perKg < 1.6 ? "close" : perKg <= 2.2 ? "target" : "high";
  useResult("protein-check", band);

  return (
    <CalcShell
      label="Protein check"
      eyebrow="Am I eating enough protein?"
      toggle={<UnitToggle value={system} onChange={(to) => to !== system && set((p) => ({ ...convertWeightFields(p, ["bodyweight"], to), units: to }))} />}
    >
      <FieldGrid>
        <NumberField
          label="Your bodyweight"
          unit={unit}
          value={s.bodyweight}
          onChange={(bodyweight) => set({ bodyweight })}
          placeholder={unit === "lb" ? "180" : "82"}
          invalid={bw.bad}
        />
        <NumberField
          label="Protein on a normal day"
          unit="g"
          integer
          value={s.grams}
          onChange={(grams) => set({ grams })}
          placeholder="140"
          invalid={g.bad}
          hint="Rough is fine: a palm of meat or fish ≈ 25–30 g, a scoop of whey ≈ 25 g."
        />
      </FieldGrid>
      <ResultPanel label="Protein check result">
        {band === null || perKg === null || kg === null ? (
          <ResultHint>Enter your bodyweight and a typical day&rsquo;s protein to see where you stand.</ResultHint>
        ) : (
          <>
            <BigStat label={BAND_COPY[band].title} value={fmt(perKg, 1, true)} unit="g per kg" sub={BAND_COPY[band].body} />
            <MiniStats>
              <MiniStat label="Target for you" value={`${fmt(kg * 1.6, 0)}–${fmt(kg * 2.2, 0)}`} unit="g/day" note="1.6–2.2 g per kg" />
              <MiniStat label="Per lb" value={fmt(perKg / 2.2046, 2, true)} unit="g per lb" />
              {band === "low" || band === "close" ? (
                <MiniStat label="Gap to 1.6 g/kg" value={fmt(Math.max(0, kg * 1.6 - (g.value ?? 0)), 0)} unit="g/day" />
              ) : null}
            </MiniStats>
            <DiagnoseLink detail={`protein:${band}`}>
              {band === "target" || band === "high" ? "Protein is fine, so what is stalling you? Find out" : "Check what else is holding you back"}
            </DiagnoseLink>
            <Sources items={[MORTON]} />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}

/* ------------------------------------------------------------------ */
/* Surplus: is my bulk too fast or too slow?                             */
/* ------------------------------------------------------------------ */

const SURPLUS_DEFAULTS = { units: "us", bodyweight: "", change: "", stage: "intermediate" };
const STAGES = [
  { value: "beginner", label: "Under 1 year" },
  { value: "intermediate", label: "1–3 years" },
  { value: "advanced", label: "3+ years" },
] as const;
/** Iraki et al. 2019: gain about 0.25–0.5% of bodyweight a week; newer lifters toward the top, advanced toward the bottom. */
const TARGET_PCT: [number, number] = [0.25, 0.5];
const STAGE_AIM: Record<(typeof STAGES)[number]["value"], string> = {
  beginner: "the top of the range (about 0.5% a week)",
  intermediate: "the middle of the range (about 0.35% a week)",
  advanced: "the bottom of the range (about 0.25% a week)",
};

export function SurplusCheck() {
  const [s, set] = useStoredState("ld_check_surplus_v1", SURPLUS_DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const stage = oneOf(s.stage, STAGES.map((x) => x.value), "intermediate");
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const ch = checkRange(s.change.replace(/^\+/, ""), 0, unit === "lb" ? 5 : 2.3);
  const pct = bw.value !== null && ch.value !== null ? (ch.value / bw.value) * 100 : null;
  const [lo, hi] = TARGET_PCT;
  const verdict = pct === null ? null : pct < lo ? "slow" : pct > hi ? "fast" : "right";
  useResult("surplus-check", verdict);

  const copy = {
    slow: {
      title: "Surplus too small",
      body: "You are gaining slower than your training age can use. Add roughly 100–200 kcal a day (a snack, not a feast) and re-weigh for two weeks.",
    },
    right: {
      title: "Surplus sized right",
      body: "Your scale is rising at a pace that mostly becomes muscle. If the mirror and your lifts are not moving, food is not your bottleneck.",
    },
    fast: {
      title: "Surplus too big",
      body: "Above this pace the extra weight is mostly fat. Trim about 200–300 kcal a day; you will not lose muscle gain by slowing down.",
    },
  } as const;

  return (
    <CalcShell
      label="Calorie surplus check"
      eyebrow="Is my surplus the right size?"
      toggle={<UnitToggle value={system} onChange={(to) => to !== system && set((p) => ({ ...convertWeightFields(p, ["bodyweight", "change"], to), units: to }))} />}
    >
      <FieldGrid>
        <NumberField label="Your bodyweight" unit={unit} value={s.bodyweight} onChange={(bodyweight) => set({ bodyweight })} placeholder={unit === "lb" ? "175" : "80"} invalid={bw.bad} />
        <NumberField
          label="Weight gained per week"
          unit={unit}
          value={s.change}
          onChange={(change) => set({ change })}
          placeholder={unit === "lb" ? "0.5" : "0.25"}
          invalid={ch.bad}
          hint="Average of the last 2–4 weeks of morning weigh-ins."
        />
      </FieldGrid>
      <div className="mt-4">
        <Segmented label="How long you have trained seriously" value={stage} onChange={(v) => set({ stage: v })} options={STAGES} />
      </div>
      <ResultPanel label="Surplus check result">
        {verdict === null || pct === null ? (
          <ResultHint>Enter your bodyweight and how much you gain in a typical week.</ResultHint>
        ) : (
          <>
            <BigStat label={copy[verdict].title} value={fmt(pct, 2, true)} unit="% / week" sub={copy[verdict].body} />
            <MiniStats>
              <MiniStat
                label="Your target"
                value={`${fmt(((bw.value ?? 0) * lo) / 100, 2)}–${fmt(((bw.value ?? 0) * hi) / 100, 2)}`}
                unit={`${unit}/wk`}
                note={`${lo}–${hi}% of bodyweight`}
              />
              <MiniStat label="Per month" value={fmt((ch.value ?? 0) * WEEKS_PER_MONTH, 1)} unit={unit} />
            </MiniStats>
            <Note>At your training age, aim for {STAGE_AIM[stage]}. Weigh in on waking, after the bathroom, and judge the weekly average.</Note>
            <DiagnoseLink detail={`surplus:${verdict}`}>
              {verdict === "right" ? "Eating right and still stuck? Find out why" : "Find out what else is slowing your gains"}
            </DiagnoseLink>
            <Sources items={[IRAKI]} />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}

/* ------------------------------------------------------------------ */
/* Muscle gain rate: is my rate normal?                                  */
/* ------------------------------------------------------------------ */

const GAIN_DEFAULTS = { units: "us", sex: "male", bodyweight: "", years: "1", gain: "" };
const YEARS = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "4+ years" },
] as const;
/** Aragon/Helms model: % of bodyweight of muscle per month, by training year. Year 4+ extrapolated from McDonald (2–3 lb a year). */
const GAIN_PCT: Record<(typeof YEARS)[number]["value"], [number, number]> = {
  "1": [1, 1.5],
  "2": [0.5, 1],
  "3": [0.25, 0.5],
  "4": [0.1, 0.15],
};

export function GainRateCheck() {
  const [s, set] = useStoredState("ld_check_gainrate_v1", GAIN_DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const sex = oneOf(s.sex, ["male", "female"] as const, "male");
  const years = oneOf(s.years, YEARS.map((y) => y.value), "1");
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const gain = checkRange(s.gain, 0, unit === "lb" ? 20 : 9);
  // Women build roughly half the absolute muscle men do at the same training age (McDonald); scale the band.
  const scale = sex === "female" ? 0.5 : 1;
  const range = bw.value !== null ? GAIN_PCT[years].map((p) => ((bw.value as number) * p * scale) / 100) : null;
  const verdict =
    range === null || gain.value === null ? null : gain.value < range[0] * 0.5 ? "slow" : gain.value > range[1] * 2 ? "fat" : gain.value > range[1] ? "above" : "normal";
  useResult("gain-rate-check", verdict);

  const copy = {
    slow: { title: "Slower than it should be", body: "At your training age you should be adding more than this. That points to a fixable bottleneck: food, effort, volume or recovery." },
    normal: { title: "A normal rate", body: "This is what muscle gain looks like at your stage. It feels slow because it is slow; consistency, not a new program, keeps it going." },
    above: { title: "A bit above the muscle range", body: "Some of that monthly gain is likely fat or water. Fine at the start of a bulk; if it continues, trim the surplus a little." },
    fat: { title: "Mostly not muscle", body: "No one builds muscle this fast naturally. Most of this gain is fat and water: shrink the surplus and judge progress by lifts and tape, not the scale." },
  } as const;

  return (
    <CalcShell
      label="Muscle gain rate check"
      eyebrow="Is my rate of gain normal?"
      toggle={<UnitToggle value={system} onChange={(to) => to !== system && set((p) => ({ ...convertWeightFields(p, ["bodyweight", "gain"], to), units: to }))} />}
    >
      <FieldGrid>
        <Segmented label="Sex" value={sex} onChange={(v) => set({ sex: v })} options={SEX_OPTIONS} />
        <NumberField label="Your bodyweight" unit={unit} value={s.bodyweight} onChange={(bodyweight) => set({ bodyweight })} placeholder={unit === "lb" ? "170" : "77"} invalid={bw.bad} />
      </FieldGrid>
      <div className="mt-4 space-y-4">
        <Segmented label="Year of proper training" value={years} onChange={(v) => set({ years: v })} options={YEARS} />
        <NumberField
          label="Weight gained last month"
          unit={unit}
          value={s.gain}
          onChange={(g) => set({ gain: g })}
          placeholder={unit === "lb" ? "2" : "0.9"}
          invalid={gain.bad}
          hint="Scale change over the last 4 weeks (0 if flat). Cutting or recomping? The scale cannot show muscle then."
        />
      </div>
      <ResultPanel label="Gain rate result">
        {verdict === null || range === null ? (
          <ResultHint>Enter your bodyweight, training year and last month&rsquo;s gain.</ResultHint>
        ) : (
          <>
            <BigStat
              label={copy[verdict].title}
              value={`${fmt(range[0], 1)}–${fmt(range[1], 1)}`}
              unit={`${unit} muscle / month`}
              sub={copy[verdict].body}
            />
            <MiniStats>
              <MiniStat label="Your scale change" value={fmt(gain.value ?? 0, 1)} unit={`${unit}/mo`} />
              <MiniStat label="Per year at this pace" value={`${fmt(range[0] * 12, 0)}–${fmt(range[1] * 12, 0)}`} unit={unit} note="Muscle, best case" />
            </MiniStats>
            <Note>
              Ranges use the Aragon/Helms model (1–1.5%, 0.5–1% and 0.25–0.5% of bodyweight a month in years 1–3), halved for women
              and extended past year 3 with McDonald&rsquo;s 2–3 lb a year. They describe good training and eating, not a guarantee.
            </Note>
            <DiagnoseLink detail={`gainrate:${verdict}`}>
              {verdict === "slow" ? "Find out what is slowing you down" : "Want to know what to fix first? Find out"}
            </DiagnoseLink>
            <Sources items={[MCDONALD, IRAKI]} />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}

/* ------------------------------------------------------------------ */
/* Protein per meal                                                      */
/* ------------------------------------------------------------------ */

const MEAL_DEFAULTS = { units: "us", bodyweight: "", meals: "4", older: "no" };

export function ProteinPerMeal() {
  const [s, set] = useStoredState("ld_check_permeal_v1", MEAL_DEFAULTS);
  const system = oneOf(s.units, UNIT_SYSTEMS, "us") as UnitSystem;
  const unit = weightUnitOf(system);
  const bw = checkRange(s.bodyweight, ...BODYWEIGHT_RANGE[unit]);
  const meals = checkRange(s.meals, 2, 7, true);
  const older = s.older === "yes";
  const kg = bw.value !== null ? (unit === "kg" ? bw.value : lbToKg(bw.value)) : null;
  const low = kg !== null ? kg * PROTEIN_PER_MEAL.low : null;
  const high = kg !== null ? kg * PROTEIN_PER_MEAL.high : null;
  const daily = low !== null && meals.value !== null ? [low * meals.value, (high ?? 0) * meals.value] : null;
  useResult("protein-per-meal", kg !== null ? `${meals.value}:${older}` : null);

  return (
    <CalcShell
      label="Protein per meal calculator"
      eyebrow="Protein per meal"
      toggle={<UnitToggle value={system} onChange={(to) => to !== system && set((p) => ({ ...convertWeightFields(p, ["bodyweight"], to), units: to }))} />}
    >
      <FieldGrid>
        <NumberField label="Your bodyweight" unit={unit} value={s.bodyweight} onChange={(bodyweight) => set({ bodyweight })} placeholder={unit === "lb" ? "180" : "82"} invalid={bw.bad} />
        <Stepper label="Meals with protein per day" value={s.meals} onChange={(m) => set({ meals: m })} min={2} max={7} invalid={meals.bad} />
      </FieldGrid>
      <div className="mt-4">
        <Segmented
          label="Age"
          value={older ? "yes" : "no"}
          onChange={(v) => set({ older: v })}
          options={[
            { value: "no", label: "Under 60" },
            { value: "yes", label: "60 or older" },
          ]}
        />
      </div>
      <ResultPanel label="Protein per meal result">
        {low === null || high === null || daily === null || kg === null ? (
          <ResultHint>Enter your bodyweight to see how much protein each meal should carry.</ResultHint>
        ) : (
          <>
            <BigStat
              label="Protein per meal"
              value={`${fmt(low, 0)}–${fmt(high, 0)}`}
              unit="g"
              sub={<>0.4–0.55 g per kg in each of {meals.value} meals.</>}
            />
            <MiniStats>
              <MiniStat label="That adds up to" value={`${fmt(daily[0], 0)}–${fmt(daily[1], 0)}`} unit="g/day" note={daily[0] / kg >= 1.6 ? "Inside the 1.6–2.2 g/kg range" : "Below 1.6 g/kg: add a meal"} />
              <MiniStat label="Per lb" value={`${fmt(low / kgToLb(kg), 2, true)}`} unit="g/lb/meal" />
            </MiniStats>
            {older && (
              <Caution>
                Older muscles respond less to small doses: aim for the top of the range at every meal rather than spreading less
                across more snacks.
              </Caution>
            )}
            <DataTable
              caption="Protein per meal by meal count"
              head={["Meals", "Per meal", "Per day"]}
              rows={[3, 4, 5].map((m) => [m, `${fmt(low, 0)}–${fmt(high, 0)} g`, `${fmt(low * m, 0)}–${fmt(high * m, 0)} g`])}
              highlightRow={meals.value !== null ? [3, 4, 5].indexOf(meals.value) : undefined}
            />
            <DiagnoseLink detail={`permeal:${meals.value}`}>Protein sorted and still not growing? Find out why</DiagnoseLink>
            <Sources items={older ? [SCHOENFELD_ARAGON, MOORE, MORTON] : [SCHOENFELD_ARAGON, MORTON]} />
          </>
        )}
      </ResultPanel>
    </CalcShell>
  );
}
