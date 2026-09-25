import Link from "next/link";
import type { FindingCategory, FindingContent } from "@/content/types";
import { FINDING_LIST } from "@/content/findings";
import { CATEGORY_LABEL } from "@/lib/report/labels";
import { SectionHeading } from "./SectionHeading";

type Excerpt = {
  category: FindingCategory;
  title: string;
  verdict: string;
  summary: string;
  mechanism: string[];
};

/** Shown while the findings library is still being written. Same shape as a real finding. */
const STATIC_EXAMPLE: Excerpt = {
  category: "effort",
  title: "Your sets end too early to grow",
  verdict: "You are stopping most working sets four or more reps before failure, and calling it a hard session.",
  summary:
    "You train often, you track your lifts, and the weights still feel heavy — so it does not feel like an effort problem. But the last reps of a set are the ones that recruit and fatigue the fibres with the most room to grow, and your answers say you rarely reach them.",
  mechanism: [
    "Muscle fibres are recruited in order of size. The large, high-threshold fibres that carry most of your growth potential only join in when the smaller ones can no longer keep the bar moving — which, for moderate loads, means the final two or three reps of a set taken close to failure. Stop at a comfortable six when you had ten in you, and those fibres never received the signal.",
    "This is why a session can feel demanding and still produce nothing. Total work, sweat and soreness are poor proxies for stimulus. What the muscle registers is how many effective reps you accumulated, and a set that ends far from failure contributes almost none of them regardless of how heavy it felt.",
  ],
};

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
  const first = Array.isArray(FINDING_LIST) && FINDING_LIST.length > 0 ? FINDING_LIST[0] : null;
  const ex = first ? toExcerpt(first) : STATIC_EXAMPLE;
  const categoryLabel = CATEGORY_LABEL[ex.category] ?? ex.category;

  return (
    <section>
      <SectionHeading
        eyebrow="What a finding looks like"
        title={
          <>
            Written about <em>your</em> answers, not lifters in general.
          </>
        }
        intro="Every finding in your report reads like this one: a verdict, the reasoning, the physiology, then the fix. Here is a real excerpt from the library."
      />

      <div className="mt-8 slab p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="tag tag-alert">Primary bottleneck</span>
          <span className="tag">{categoryLabel}</span>
          <span className="tag">From 3 of your answers</span>
        </div>
        <h3 className="display text-3xl sm:text-5xl">{ex.title}</h3>
        <p className="mt-4 text-lg sm:text-xl text-ink leading-relaxed">{ex.verdict}</p>
        <p className="mt-4 text-ink-2 leading-relaxed">{ex.summary}</p>

        <div className="mt-6 slab-inset p-4 sm:p-5">
          <div className="eyebrow mb-2">What you told us</div>
          <p className="text-sm text-ink-3 leading-relaxed">
            This panel quotes the exact answers that triggered the finding, in your words. It is why the report
            reads like it was written for you: it was built from what you said.
          </p>
        </div>

        <div className="locked-veil mt-8">
          <div className="locked-content min-h-[220px]">
            <h4 className="text-xl font-semibold mb-3">Why this stalls you</h4>
            <div className="prose-ld">
              {ex.mechanism.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-2 text-center">
            <p className="text-sm text-ink-2 max-w-sm">
              The mechanism, the fix and your 4-week plan are in the unlocked report.
            </p>
            <Link href="/diagnose" className="btn btn-primary" prefetch>
              Get my finding
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
