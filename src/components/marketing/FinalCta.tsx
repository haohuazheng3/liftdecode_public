import Link from "next/link";

export function FinalCta() {
  return (
    <section>
      <div className="slab p-6 sm:p-10 lg:p-14 relative overflow-hidden text-center">
        <div
          className="absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(50%_100%_at_50%_100%,rgba(245,181,68,0.16),transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="eyebrow mb-4">Ten minutes from now</div>
          <h2 className="display text-[2.3rem] leading-[1.02] sm:text-6xl">
            Stop guessing. <em>Find the bottleneck.</em>
          </h2>
          <p className="mt-4 text-ink-2 text-base sm:text-lg leading-relaxed">
            Answer 24&ndash;28 honest questions. See your primary bottleneck for free. Unlock the rest only if you
            want it.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row sm:justify-center gap-3">
            <Link href="/diagnose" className="btn btn-primary btn-lg w-full sm:w-auto" prefetch>
              Start the diagnosis
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg w-full sm:w-auto">
              See pricing
            </Link>
          </div>
          <p className="mt-4 font-mono text-[11px] sm:text-xs tracking-[0.08em] uppercase text-ink-3">
            24&ndash;28 questions · about 10 minutes · free to answer
          </p>
        </div>
      </div>
    </section>
  );
}
