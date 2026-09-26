import Link from "next/link";
import { PlateFace } from "./graphics";
import { PLATE } from "./Barbell";

export function FinalCta() {
  return (
    <section aria-labelledby="final-title">
      <div className="slab chalk overflow-hidden relative">
        <div className="hazard h-2 w-full" aria-hidden="true" />
        {/* a stack of bumper plates leaning in from the edge */}
        <div className="hidden sm:block absolute -right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" aria-hidden="true">
          <PlateFace className="w-80 h-80 rotate-[-12deg]" fill={PLATE.red} label="25" />
        </div>
        <div className="relative p-6 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4 flex items-center gap-2.5">
              <span className="h-[3px] w-6 rounded-full bg-signal" aria-hidden="true" />
              Your next session starts here
            </div>
            <h2 id="final-title" className="display display-caps text-[clamp(2.9rem,12vw,6.5rem)]">
              <span className="block">Stop guessing.</span>
              <span className="block">
                Find the <em>bottleneck</em>.
              </span>
            </h2>
            <p className="mt-5 text-ink-2 text-base sm:text-lg leading-relaxed max-w-lg">
              See your main bottleneck for free. Unlock the rest only if you want it.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/diagnose" className="btn btn-primary btn-lg w-full sm:w-auto" prefetch>
                Start the diagnosis
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/pricing" className="btn btn-ghost btn-lg w-full sm:w-auto">
                See pricing
              </Link>
            </div>
            <p className="mt-4 font-mono text-[11px] tracking-[0.1em] uppercase text-ink-3">
              Free to answer · pay only to unlock
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
