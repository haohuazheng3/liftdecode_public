import Link from "next/link";
import { Barbell } from "./Barbell";

/** What the diagnostic actually reads — shown as the "loading chart" under the bar. */
const READS = ["Training", "Effort", "Food", "Sleep", "Recovery", "Life load"];

export function Hero() {
  return (
    <section className="relative" aria-labelledby="hero-title">
      <div className="slab chalk overflow-hidden animate-rise">
        {/* hazard edge, like the lip of a lifting platform */}
        <div className="hazard h-1.5 w-full opacity-90" aria-hidden="true" />

        <div className="px-5 pt-6 pb-2 sm:px-10 sm:pt-10 lg:px-12 lg:pt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="eyebrow flex items-center gap-2.5">
              <span className="h-[3px] w-6 rounded-full bg-signal" aria-hidden="true" />
              For lifters who stopped progressing
            </div>
            <span className="tag tag-signal hidden sm:inline-flex">Physique · Strength</span>
          </div>

          <h1 id="hero-title" className="mt-6 display display-caps text-[clamp(2.6rem,11.4vw,7.5rem)]">
            <span className="block">You train hard.</span>
            <span className="block">Nothing moves.</span>
            <span className="block">
              Find out <em>why</em>.
            </span>
          </h1>

          <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <p className="text-ink-2 text-base sm:text-lg leading-relaxed max-w-xl">
              A diagnostic that reads how you train, eat, sleep and recover &mdash; then names the one thing holding
              you back and what to change first.
            </p>
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/diagnose" className="btn btn-primary btn-lg w-full sm:w-auto" prefetch>
                  Start the diagnosis
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost btn-lg w-full sm:w-auto">
                  How it works
                </Link>
              </div>
              <p className="mt-3 font-mono text-[11px] tracking-[0.1em] uppercase text-ink-3">
                Free to answer · pay only to unlock
              </p>
            </div>
          </div>
        </div>

        {/* the bar, loaded */}
        <div className="relative mt-4 sm:mt-2 px-2 sm:px-8 lg:px-12">
          <div className="float-idle">
            <Barbell />
          </div>
        </div>

        {/* what goes on the bar: the six things the diagnostic reads */}
        <div className="border-t border-line mt-3">
          <ul
            className="grid grid-cols-3 sm:grid-cols-6 font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.12em] text-ink-3"
            aria-label="What the diagnostic reads"
          >
            {READS.map((r, i) => (
              <li
                key={r}
                className={`flex items-center justify-center gap-2 py-3.5 text-center ${
                  i % 3 !== 0 ? "border-l border-line" : ""
                } ${i >= 3 ? "border-t border-line sm:border-t-0" : ""} ${i === 3 ? "sm:border-l" : ""}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-signal/80" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
