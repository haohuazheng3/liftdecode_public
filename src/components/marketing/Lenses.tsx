import Link from "next/link";
import type { FindingCategory } from "@/content/types";
import { CATEGORY_LABEL } from "@/lib/report/labels";
import { SectionHeading } from "./SectionHeading";

const LENS_DESCRIPTION: Record<FindingCategory, string> = {
  measurement: "You are progressing, but the way you check makes it invisible.",
  progression: "Load and reps have not actually gone up in months.",
  effort: "Sets stop too far from failure to force adaptation.",
  volume: "Too few hard sets to grow, or too many to recover from.",
  programming: "Exercise choice, structure or programme hopping undercuts the work.",
  technique: "Range of motion or execution leaks the stimulus you paid for.",
  recovery: "Sleep, stress and missing deloads cap what your sessions can return.",
  nutrition: "Calories or protein point the wrong way for the goal.",
  consistency: "Missed sessions and restarts erase the compounding.",
  expectations: "Your timeline is off, so real progress reads as a stall.",
  lifestyle: "Cardio, steps, alcohol and the rest of the day interfere.",
};

const ORDER: FindingCategory[] = [
  "measurement",
  "progression",
  "effort",
  "volume",
  "programming",
  "technique",
  "recovery",
  "nutrition",
  "consistency",
  "expectations",
  "lifestyle",
];

export function Lenses() {
  return (
    <section>
      <SectionHeading
        eyebrow="What it reads"
        title={
          <>
            Eleven lenses, <em>one</em> verdict.
          </>
        }
        intro="Every answer is cross-referenced against these eleven ways a lifter stalls. The report ranks the ones your answers point to and clears the ones they rule out."
      />
      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ORDER.map((c, i) => (
          <li key={c} className="slab p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-semibold text-ink">{CATEGORY_LABEL[c]}</h3>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">{LENS_DESCRIPTION[c]}</p>
          </li>
        ))}
        <li className="slab-inset p-5 sm:p-6 flex flex-col justify-between gap-4 border-dashed">
          <p className="text-sm text-ink-3 leading-relaxed">
            Most lifters have two or three of these at once. The report tells you which one to fix first and why.
          </p>
          <Link href="/how-it-works" className="btn btn-quiet btn-sm self-start -ml-2">
            How the engine ranks them →
          </Link>
        </li>
      </ol>
    </section>
  );
}
