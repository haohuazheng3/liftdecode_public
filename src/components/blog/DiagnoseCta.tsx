import Link from "next/link";

/** Bottom-of-article slab: the one thing we want a reader to do next. */
export function DiagnoseCta({ categorySlug }: { categorySlug?: string }) {
  const lead =
    categorySlug === "nutrition"
      ? "Reading about food is useful. Knowing whether food is actually your bottleneck is better."
      : categorySlug === "recovery"
        ? "Reading about recovery is useful. Knowing whether recovery is actually your bottleneck is better."
        : "General advice is a starting point. Your stall has a specific cause, and it is probably not the one you suspect.";
  return (
    <section className="slab p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />
      <div className="eyebrow mb-3">Find your bottleneck</div>
      <h2 className="display text-3xl sm:text-5xl max-w-2xl">
        Stop guessing why you&rsquo;re <em>stuck</em>.
      </h2>
      <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">
        {lead} Answer quick, honest questions on how you train, eat, sleep and recover, and get a ranked diagnosis of what is holding you back, what is not, and a four-week plan to fix it.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href="/diagnose" className="btn btn-primary btn-lg">
          Start the diagnosis
        </Link>
        <Link href="/how-it-works" className="btn btn-ghost btn-lg">
          How it works
        </Link>
      </div>
      <p className="mt-4 text-xs text-ink-3">Mostly one tap per question. Your answers stay on this device until you decide.</p>
    </section>
  );
}
