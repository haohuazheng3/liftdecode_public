import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const SETS = [
  {
    n: "1",
    title: "Answer",
    text: "Quick taps about how you train, eat, sleep and live. Nothing to measure, nothing to type.",
  },
  {
    n: "2",
    title: "Decode",
    text: "Your answers are cross-checked against every common way progress stalls. What they rule out gets cleared.",
  },
  {
    n: "3",
    title: "Fix",
    text: "See your main bottleneck free. Unlock the full ranking, the fix and a 4-week plan, in order.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title">
      <div className="slab chalk overflow-hidden">
        <div className="p-5 sm:p-10">
          <SectionHeading
            id="how-title"
            eyebrow="How it works"
            title={
              <>
                Three sets. <em>No warm-up.</em>
              </>
            }
          />
          <ol className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
            {SETS.map((s) => (
              <li key={s.n} className="slab-inset p-5 sm:p-6 relative overflow-hidden">
                <div className="flex items-end gap-3">
                  <span className="font-stencil text-[4.5rem] sm:text-[5.5rem] leading-[0.8] text-signal" aria-hidden="true">
                    {s.n}
                  </span>
                  <div className="pb-1">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">Set {s.n}</div>
                    <h3 className="display display-caps text-[2rem] sm:text-[2.3rem] leading-none mt-1">{s.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm sm:text-[0.95rem] text-ink-2 leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link href="/diagnose" className="btn btn-primary w-full sm:w-auto" prefetch>
              Start the diagnosis
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/how-it-works" className="btn btn-quiet w-full sm:w-auto">
              Read the full method
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
