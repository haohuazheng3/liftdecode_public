import Link from "next/link";
import type { FindingContent } from "@/content/types";
import { FINDING_LIST } from "@/content/findings";
import { CATEGORY_LABEL } from "@/lib/report/labels";
import { SectionHeading } from "./SectionHeading";

type Excerpt = {
  category: string;
  title: string;
  verdict: string;
  summary: string;
  mechanism: string[];
};

/** Used if the findings library is empty or mid-rewrite. Same shape as a real finding. */
const STATIC_EXAMPLE: Excerpt = {
  category: "effort",
  title: "Your sets end too early to grow",
  verdict: "You are stopping most working sets well short of failure, and calling it a hard session.",
  summary:
    "You train often and the weights still feel heavy — so it does not feel like an effort problem. But the last reps of a set are the ones that recruit the fibres with the most room to grow, and your answers say you rarely reach them.",
  mechanism: [
    "Muscle fibres are recruited in order of size. The large, high-threshold fibres that carry most of your growth potential only join in when the smaller ones can no longer keep the bar moving — which, for moderate loads, means the final few reps of a set taken close to failure.",
    "This is why a session can feel demanding and still produce nothing. Sweat and soreness are poor proxies for stimulus. What the muscle registers is how many hard reps you accumulated.",
  ],
};

/** Prefer an effort finding for the showcase; never a measurement one. */
const PREFERRED_IDS = ["sets_end_too_early", "missed_dose", "no_forcing_function"];

function pickFinding(): FindingContent | null {
  const list: FindingContent[] = Array.isArray(FINDING_LIST) ? FINDING_LIST : [];
  const usable = list.filter(
    (f) =>
      f &&
      typeof f.title === "string" &&
      typeof f.verdict === "string" &&
      typeof f.summary === "string" &&
      Array.isArray(f.mechanism) &&
      f.mechanism.length > 0 &&
      (f.category as string) !== "measurement",
  );
  for (const id of PREFERRED_IDS) {
    const hit = usable.find((f) => f.id === id);
    if (hit) return hit;
  }
  return usable.find((f) => (f.category as string) === "effort") ?? usable[0] ?? null;
}

function toExcerpt(f: FindingContent): Excerpt {
  return {
    category: f.category,
    title: f.title,
    verdict: f.verdict,
    summary: f.summary,
    mechanism: f.mechanism.slice(0, 2),
  };
}

export function FindingExcerpt() {
  const found = pickFinding();
  const ex = found ? toExcerpt(found) : STATIC_EXAMPLE;
  const labels = CATEGORY_LABEL as Record<string, string | undefined>;
  const categoryLabel = labels[ex.category] ?? ex.category;

  return (
    <section aria-labelledby="excerpt-title">
      <SectionHeading
        id="excerpt-title"
        eyebrow="What you get"
        title={
          <>
            Written about <em>your</em> answers.
          </>
        }
        intro="Every finding reads like this: a verdict, the reasoning, then the fix. This one is a real excerpt from the library."
      />

      <div className="mt-8 slab overflow-hidden">
        <div className="knurl h-2 w-full" aria-hidden="true" />
        <div className="p-5 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="tag tag-alert">Primary bottleneck</span>
            <span className="tag">{categoryLabel}</span>
          </div>
          <h3 className="display text-[2.1rem] sm:text-5xl lg:text-6xl max-w-4xl">{ex.title}</h3>
          <p className="mt-4 text-lg sm:text-xl text-ink leading-relaxed max-w-3xl">{ex.verdict}</p>
          <p className="mt-4 text-ink-2 leading-relaxed max-w-3xl">{ex.summary}</p>

          <div className="locked-veil mt-8">
            <div className="locked-content min-h-[220px] max-h-[340px] overflow-hidden">
              <h4 className="text-xl font-semibold mb-3">Why this stalls you</h4>
              <div className="prose-ld">
                {ex.mechanism.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-2 text-center">
              <span className="tag">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                  <rect x="1" y="5" width="8" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2.8 5V3.4a2.2 2.2 0 0 1 4.4 0V5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Locked
              </span>
              <p className="text-sm text-ink-2 max-w-sm">The mechanism, the fix and your 4-week plan unlock with the report.</p>
              <Link href="/diagnose" className="btn btn-primary" prefetch>
                Find my bottleneck
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
