import Link from "next/link";

/**
 * Abstract "mini report": three ranked findings with impact bars and one
 * locked, blurred row. Built from slabs only — no imagery.
 */
function HeroVisual() {
  const ranked = [
    { n: "01", label: "Sets end too far from failure", cat: "Effort", w: 100 },
    { n: "02", label: "Load never actually goes up", cat: "Progression", w: 72 },
    { n: "03", label: "Protein is short on rest days", cat: "Nutrition", w: 44 },
  ];
  return (
    <div className="relative" aria-hidden="true">
      {/* back slab: the "not your problem" card, peeking out */}
      <div className="absolute right-0 -top-3 sm:-right-4 sm:-top-5 w-[62%] rotate-[3deg] slab p-4 opacity-80">
        <div className="tag tag-clear mb-2">Not your problem</div>
        <div className="h-2.5 w-[80%] rounded-full bg-white/[0.08]" />
        <div className="mt-2 h-2.5 w-[55%] rounded-full bg-white/[0.06]" />
      </div>

      {/* front slab: the ranked report */}
      <div className="relative slab p-5 sm:p-6 mt-8 sm:mt-10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="eyebrow">Your diagnosis · Physique</div>
          <span className="tag tag-alert">3 bottlenecks</span>
        </div>
        <ol className="space-y-3.5">
          {ranked.map((r) => (
            <li key={r.n}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2.5 min-w-0">
                  <span className="font-mono text-[11px] text-ink-3 shrink-0">{r.n}</span>
                  <span className="text-[0.92rem] text-ink truncate">{r.label}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 shrink-0">{r.cat}</span>
              </div>
              <div className="mt-1.5 pl-7">
                <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-signal" style={{ width: `${r.w}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* locked row */}
        <div className="mt-5 slab-inset p-4 relative overflow-hidden">
          <div className="eyebrow mb-2">The fix · week 1</div>
          <div className="blur-[5px] opacity-60 select-none space-y-2">
            <div className="h-2.5 w-[92%] rounded-full bg-white/[0.12]" />
            <div className="h-2.5 w-[76%] rounded-full bg-white/[0.1]" />
            <div className="h-2.5 w-[84%] rounded-full bg-white/[0.08]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3 pointer-events-none">
            <span className="tag">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                <rect x="1" y="5" width="8" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2.8 5V3.4a2.2 2.2 0 0 1 4.4 0V5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Unlock to read
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="slab p-6 sm:p-10 lg:p-12 animate-rise">
          <div className="eyebrow mb-4">For lifters who stopped progressing</div>
          <h1 className="display text-[clamp(2.3rem,10vw,5.6rem)]">
            Your training stopped working. <em>Here&rsquo;s why.</em>
          </h1>
          <p className="mt-5 text-ink-2 text-base sm:text-lg leading-relaxed max-w-xl">
            Answer 24&ndash;28 honest questions about how you train, eat, recover and measure progress. You get a
            report that names your bottleneck, ranks the rest, rules out what isn&rsquo;t the problem and tells you
            what to change first.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link href="/diagnose" className="btn btn-primary btn-lg w-full sm:w-auto" prefetch>
              Start the diagnosis
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost btn-lg w-full sm:w-auto">
              See how it works
            </Link>
          </div>
          <p className="mt-4 font-mono text-[11px] sm:text-xs tracking-[0.08em] uppercase text-ink-3">
            24&ndash;28 questions · about 10 minutes · free to answer
          </p>
          <p className="mt-2 text-sm text-ink-3 leading-relaxed">
            Answering costs nothing. You pay only if you want to unlock the report.
          </p>
        </div>

        <div className="animate-rise px-1 sm:px-0" style={{ animationDelay: "90ms" }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
