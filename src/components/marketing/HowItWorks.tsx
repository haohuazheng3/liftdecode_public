import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    n: "01",
    title: "Answer honestly",
    text: "24–28 questions about how you actually train, eat, sleep and measure progress. Concrete options, no free text. About ten minutes.",
  },
  {
    n: "02",
    title: "We cross-reference",
    text: "Your answers are scored against every way a lifter stalls. Patterns that reinforce each other rank higher; patterns your answers rule out become clearances.",
  },
  {
    n: "03",
    title: "Unlock the report",
    text: "You see your primary bottleneck for free. Unlock to read the full ranking, the mechanism behind each finding, the fix, and a 4-week plan in order.",
  },
];

export function HowItWorks() {
  return (
    <section>
      <div className="slab p-6 sm:p-10">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Ten minutes in. <em>Clarity</em> out.
            </>
          }
        />
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="relative pt-5 border-t border-line">
              <span className="absolute -top-px left-0 h-px w-10 bg-signal" aria-hidden="true" />
              <div className="font-mono text-xs tracking-[0.14em] text-signal mb-2">{s.n}</div>
              <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm sm:text-[0.95rem] text-ink-2 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
          <Link href="/diagnose" className="btn btn-primary w-full sm:w-auto" prefetch>
            Start the diagnosis
          </Link>
          <Link href="/how-it-works" className="btn btn-quiet w-full sm:w-auto">
            Read the full method
          </Link>
        </div>
      </div>
    </section>
  );
}
