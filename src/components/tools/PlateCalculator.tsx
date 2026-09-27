"use client";

import { BAR_PRESETS, COLLAR_EACH, PLATE_SETS, solvePlates, type PlateLoad } from "@/lib/tools/formulas";
import { LOAD_STEP, convertWeight, parseNumber, roundTo, roundToStep, type WeightUnit } from "@/lib/tools/units";
import {
  BigStat,
  CalcShell,
  DiagnoseLink,
  FieldGrid,
  Note,
  NumberField,
  ResultHint,
  ResultPanel,
  Segmented,
  Sources,
  SubHeading,
  UNIT_SYSTEMS,
  UnitToggle,
  checkRange,
  fmt,
  oneOf,
  useStoredState,
  weightUnitOf,
  type UnitSystem,
} from "./shared";

const KEY = "ld_tool_plates_v1";
const BAR_KEYS = ["45", "35", "20", "15", "custom"] as const;
const DEFAULTS = {
  units: "us",
  target: "225",
  bar: "45",
  customBar: "",
  collars: false,
  collarEach: "",
  platesLb: [...PLATE_SETS.lb] as number[],
  platesKg: [...PLATE_SETS.kg] as number[],
};
type State = typeof DEFAULTS;
const sanitize = (s: State): State => {
  const units = oneOf(s.units, UNIT_SYSTEMS, "us");
  const unit = weightUnitOf(units);
  const allowedBars: readonly string[] = [...BAR_PRESETS[unit].map(String), "custom"];
  return {
    ...s,
    units,
    bar: allowedBars.includes(s.bar) ? oneOf(s.bar, BAR_KEYS, "45") : String(BAR_PRESETS[unit][0]),
    platesLb: s.platesLb.filter((p) => (PLATE_SETS.lb as readonly number[]).includes(p)),
    platesKg: s.platesKg.filter((p) => (PLATE_SETS.kg as readonly number[]).includes(p)),
  };
};

const MAX_TARGET = { lb: 1500, kg: 700 } as const;
/** Swap each bar preset for its counterpart in the other unit. */
const BAR_SWAP: Record<string, string> = { "45": "20", "35": "15", "20": "45", "15": "35", custom: "custom" };

export function PlateCalculator() {
  const [s, set] = useStoredState(KEY, DEFAULTS, sanitize);
  const system = s.units as UnitSystem;
  const unit = weightUnitOf(system);
  const enabled = unit === "lb" ? s.platesLb : s.platesKg;

  const target = checkRange(s.target, 1, MAX_TARGET[unit]);
  const customBar = checkRange(s.customBar, 0, unit === "lb" ? 100 : 45);
  const collarEach = s.collarEach.trim() === "" ? { value: COLLAR_EACH[unit], bad: false } : checkRange(s.collarEach, 0, unit === "lb" ? 30 : 15);
  const bar = s.bar === "custom" ? customBar.value : parseNumber(s.bar);
  /** Both collars together; null when collars are on but their weight is unreadable. */
  const collarsWeight = s.collars ? (collarEach.value !== null ? 2 * collarEach.value : null) : 0;

  const solution =
    target.value !== null && bar !== null && collarsWeight !== null
      ? solvePlates(target.value, bar, collarsWeight, enabled)
      : null;

  const switchUnits = (to: UnitSystem) => {
    if (to === system) return;
    const from = unit;
    const next = weightUnitOf(to);
    const conv = (raw: string, step?: number) => {
      const n = parseNumber(raw);
      if (n === null) return raw;
      const v = convertWeight(n, from, next);
      return String(step ? roundToStep(v, step) : roundTo(v, 1));
    };
    set((prev) => ({
      units: to,
      target: conv(prev.target, LOAD_STEP[next]),
      bar: BAR_SWAP[prev.bar] ?? String(BAR_PRESETS[next][0]),
      customBar: conv(prev.customBar),
      collarEach: conv(prev.collarEach),
    }));
  };

  const togglePlate = (p: number) => {
    set((prev) => {
      const list = unit === "lb" ? prev.platesLb : prev.platesKg;
      const nextList = list.includes(p) ? list.filter((x) => x !== p) : [...list, p];
      return unit === "lb" ? { platesLb: nextList } : { platesKg: nextList };
    });
  };

  const barOptions = [
    ...BAR_PRESETS[unit].map((b) => ({ value: String(b), label: `${b} ${unit}` })),
    { value: "custom", label: "Custom" },
  ];

  return (
    <CalcShell
      label="Plate calculator"
      eyebrow="Load the bar"
      toggle={<UnitToggle value={system} onChange={switchUnits} />}
    >
      <FieldGrid>
        <NumberField
          label="Target weight"
          unit={unit}
          value={s.target}
          onChange={(v) => set({ target: v })}
          placeholder={unit === "lb" ? "225" : "100"}
          invalid={target.bad}
          hint={target.bad ? `Enter a weight between 1 and ${MAX_TARGET[unit]} ${unit}.` : "Bar, collars and plates together."}
        />
        <div className="min-w-0">
          <Segmented label="Bar" value={s.bar} options={barOptions} onChange={(v) => set({ bar: v })} />
          {s.bar === "custom" && (
            <div className="mt-3">
              <NumberField
                label="Bar weight"
                unit={unit}
                value={s.customBar}
                onChange={(v) => set({ customBar: v })}
                placeholder={unit === "lb" ? "55" : "25"}
                invalid={customBar.bad}
                hint={customBar.bad ? "Enter the bar's weight." : "Trap bar, safety squat bar, EZ bar…"}
              />
            </div>
          )}
        </div>
      </FieldGrid>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <div className="mb-1.5 text-sm font-medium text-ink-2">Collars</div>
          <button
            type="button"
            role="switch"
            aria-checked={s.collars}
            onClick={() => set({ collars: !s.collars })}
            className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-line bg-black/25 px-4 text-left transition-colors hover:border-line-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            <span className="text-[0.95rem] font-semibold text-ink">{s.collars ? "Counting collars" : "No collars / spring clips"}</span>
            <span
              aria-hidden="true"
              className={`relative h-7 w-12 flex-none rounded-full transition-colors ${s.collars ? "bg-signal" : "bg-white/[0.1]"}`}
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-ink shadow transition-[left] duration-150 ${s.collars ? "left-6" : "left-1"}`}
              />
            </span>
          </button>
        </div>
        {s.collars && (
          <NumberField
            label="Each collar weighs"
            unit={unit}
            value={s.collarEach}
            onChange={(v) => set({ collarEach: v })}
            placeholder={String(COLLAR_EACH[unit])}
            invalid={collarEach.bad}
            hint={collarEach.bad ? "Enter the weight of one collar." : `Competition collars: 2.5 kg (≈ 5.5 lb) each.`}
          />
        )}
      </div>

      <div className="mt-4">
        <div className="mb-1.5 text-sm font-medium text-ink-2" id="plate-toggles">
          Plates you have <span className="font-normal text-ink-3">(tap to switch off)</span>
        </div>
        <div role="group" aria-labelledby="plate-toggles" className="flex flex-wrap gap-2">
          {PLATE_SETS[unit].map((p) => {
            const on = enabled.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => togglePlate(p)}
                className={[
                  "min-h-12 min-w-14 rounded-2xl border px-3 font-display text-lg font-extrabold tabular-nums",
                  "transition-[scale,background-color,border-color,color] duration-100 active:scale-[0.94]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                  on ? "border-signal/60 bg-signal/[0.12] text-ink" : "border-line bg-white/[0.02] text-ink-3 line-through decoration-ink-4",
                ].join(" ")}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <ResultPanel label="Plates per side">
        {!solution || solution.kind === "invalid" || target.value === null || bar === null ? (
          <ResultHint>Enter a target weight and pick a bar to see the plates for each side.</ResultHint>
        ) : solution.kind === "below-bar" ? (
          <ResultHint>
            {fmt(target.value, 2)} {unit} is lighter than the bar{s.collars ? " and collars" : ""} alone (
            {fmt(solution.base, 2)} {unit}). Pick a lighter bar or a heavier target.
          </ResultHint>
        ) : solution.kind === "exact" ? (
          <>
            <BigStat
              label="Each side"
              value={solution.load.perSide.length ? fmt(solution.load.perSideWeight, 2) : "0"}
              unit={unit}
              sub={
                solution.load.perSide.length ? (
                  <>
                    {fmt(solution.load.total, 2)} {unit} = {fmt(bar, 2)} bar
                    {s.collars && collarsWeight ? ` + ${fmt(collarsWeight, 2)} collars` : ""} + 2 × {fmt(solution.load.perSideWeight, 2)}.
                  </>
                ) : (
                  <>Just the bar{s.collars ? " and collars" : ""}: no plates needed.</>
                )
              }
            />
            {solution.load.perSide.length > 0 && <LoadDetail load={solution.load} unit={unit} collars={s.collars} />}
            {solution.usedFallback && (
              <Note>
                Loading heaviest-first can&apos;t hit this weight with your plates, so this uses a different combination
                with the fewest plates.
              </Note>
            )}
          </>
        ) : (
          <>
            <p className="text-[0.98rem] leading-relaxed text-ink-2">
              <span className="font-semibold text-ink">
                {fmt(target.value, 2)} {unit}
              </span>{" "}
              can&apos;t be loaded exactly with these plates. The closest you can get:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {solution.lower && <Nearest title="Lighter" load={solution.lower} unit={unit} collars={s.collars} />}
              {solution.higher && <Nearest title="Heavier" load={solution.higher} unit={unit} collars={s.collars} />}
            </div>
            {!solution.higher && <Note>Switch on at least one plate to go above the bar.</Note>}
          </>
        )}
        <Note>
          Plates are loaded heaviest first, innermost, the order the IPF rulebook requires. We assume you have as many pairs
          of each plate as you need.
        </Note>
        <Sources
          items={[
            {
              label: "IPF Technical Rulebook 2026 (collars 2.5 kg each; disc order)",
              href: "https://www.powerlifting.sport/fileadmin/ipf/data/rules/technical-rules/english/2026_IPF_Technical_Rulebook__effective_01_March_2026__v3.pdf",
            },
          ]}
          lead="Rules"
        />
        <DiagnoseLink />
      </ResultPanel>
    </CalcShell>
  );
}

function Nearest({ title, load, unit, collars }: { title: string; load: PlateLoad; unit: WeightUnit; collars: boolean }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white/[0.02] p-3.5">
      <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3">{title}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="display text-3xl font-extrabold tabular-nums">{fmt(load.total, 2)}</span>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-ink-3">{unit}</span>
      </div>
      <div className="mt-1 text-sm text-ink-2">
        {load.perSide.length ? <>Each side: {plateList(load)}</> : "Just the bar, no plates."}
      </div>
      {load.perSide.length > 0 && <PlateStack load={load} unit={unit} collars={collars} className="mt-3" />}
    </div>
  );
}

function plateList(load: PlateLoad): string {
  return load.perSide.map((p) => (p.count > 1 ? `${p.plate} × ${p.count}` : `${p.plate}`)).join(", ");
}

function LoadDetail({ load, unit, collars }: { load: PlateLoad; unit: WeightUnit; collars: boolean }) {
  return (
    <>
      <SubHeading>Plates on each side, inside out</SubHeading>
      <ul className="flex flex-wrap gap-2" aria-label="Plates per side">
        {load.perSide.map((p) => (
          <li
            key={p.plate}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line-2 bg-white/[0.04] px-3.5 font-display text-lg font-extrabold tabular-nums"
          >
            {p.plate}
            <span className="font-mono text-xs font-normal text-ink-3">
              {unit} × {p.count}
            </span>
          </li>
        ))}
      </ul>
      <PlateStack load={load} unit={unit} collars={collars} className="mt-5" />
    </>
  );
}

/* ---------- the drawing: one sleeve, heaviest plate innermost ---------- */

/** Competition colours for kg discs (IPF: 25 red, 20 blue, 15 yellow; IWF: 10 green, 5 white). */
const KG_STYLE: Record<number, { h: number; w: number; fill: string }> = {
  25: { h: 96, w: 22, fill: "#D8403A" },
  20: { h: 96, w: 19, fill: "#2E6BD6" },
  15: { h: 88, w: 15, fill: "#E8B931" },
  10: { h: 80, w: 12, fill: "#3FA464" },
  5: { h: 56, w: 9, fill: "#EDEDED" },
  2.5: { h: 44, w: 7, fill: "#D8403A" },
  1.25: { h: 36, w: 5, fill: "#B8B8C0" },
};
/** Iron plates for lb: graphite, sized by weight. */
const LB_STYLE: Record<number, { h: number; w: number; fill: string }> = {
  45: { h: 96, w: 20, fill: "#3B3B45" },
  35: { h: 86, w: 17, fill: "#383842" },
  25: { h: 74, w: 14, fill: "#35353E" },
  10: { h: 56, w: 10, fill: "#32323A" },
  5: { h: 44, w: 8, fill: "#303038" },
  2.5: { h: 36, w: 6, fill: "#2E2E36" },
};

function PlateStack({
  load,
  unit,
  collars,
  className = "",
}: {
  load: PlateLoad;
  unit: WeightUnit;
  collars: boolean;
  className?: string;
}) {
  const style = unit === "kg" ? KG_STYLE : LB_STYLE;
  const plates = load.perSide.flatMap((p) => Array.from({ length: p.count }, () => p.plate));
  const W = 320;
  const H = 110;
  const mid = H / 2;
  const start = 34;
  const room = W - start - 26;
  const gap = 1.5;
  const grow = 1.5;
  const raw = plates.reduce((sum, p) => sum + (style[p]?.w ?? 8) * grow + gap, 0);
  const k = raw > room ? room / raw : 1;
  const rects: { x: number; w: number; h: number; fill: string }[] = [];
  let x = start;
  for (const p of plates) {
    const st = style[p] ?? { h: 40, w: 8, fill: "#444" };
    const w = st.w * grow * k;
    rects.push({ x, w, h: st.h, fill: st.fill });
    x += w + gap * k;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-auto w-full max-w-md ${className}`} aria-hidden="true">
      {/* sleeve */}
      <rect x={10} y={mid - 5} width={W - 14} height={10} rx={3} fill="#9A9AA3" />
      <rect x={10} y={mid - 5} width={W - 14} height={3} rx={1.5} fill="#C9C9D0" opacity={0.5} />
      {/* inner collar of the bar */}
      <rect x={20} y={mid - 20} width={10} height={40} rx={2.5} fill="#6E6E78" />
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={mid - r.h / 2}
          width={r.w}
          height={r.h}
          rx={Math.min(3, r.w / 3)}
          fill={r.fill}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={0.8}
        />
      ))}
      {collars && <rect x={x + 1} y={mid - 13} width={10} height={26} rx={2.5} fill="#B8B8C0" />}
    </svg>
  );
}
