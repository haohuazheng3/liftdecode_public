import Link from "next/link";
import { TrackedCta } from "@/components/cta/TrackedCta";

/**
 * First-screen entry points into the diagnosis. Every content page carries one before its first
 * heading: decision pages get the answer plus the next step (ConclusionCard), tool-first pages get
 * the button beside the tool (HeroCta), and every other article gets a short EntryCard.
 */

export function HeroCta({ line = "Stalled despite the work? Find the cause." }: { line?: string }) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <TrackedCta place="hero" className="btn btn-primary">
        Find what&rsquo;s stalling you
      </TrackedCta>
      <p className="text-sm leading-snug text-ink-3">{line}</p>
    </div>
  );
}

/** B-level pages: the verdict first, then the one next step. */
export function ConclusionCard({ answer, title = "The short answer" }: { answer: string; title?: string }) {
  return (
    <section aria-label={title} className="slab relative overflow-hidden p-6 sm:p-8">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />
      <div className="eyebrow mb-3">{title}</div>
      <p className="text-[1.08rem] leading-relaxed text-ink sm:text-lg">{answer}</p>
      <div className="hairline mt-5" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-ink-2">
        Asking because your progress stalled? The program is rarely the whole story. The diagnosis reads how you train, eat, sleep
        and recover, and ranks what is actually holding you back.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <TrackedCta place="verdict" className="btn btn-primary">
          Find your bottleneck
        </TrackedCta>
        <Link href="/pricing" className="btn btn-quiet btn-sm">
          What it costs
        </Link>
      </div>
    </section>
  );
}

const ENTRY_LINE: Record<string, string> = {
  nutrition: "Food is one of several things that stall progress. Find out whether it is yours.",
  recovery: "Recovery is one of the usual suspects. Find out whether it is the one holding you back.",
  form: "Form fixes help, but a stalled lift usually has a cause outside the technique. Find yours.",
  programs: "Stalling on a program is common. The program is rarely the only reason.",
};

/** Every other article: one line and a button, before the first heading. */
export function EntryCard({ category }: { category?: string }) {
  const line = (category && ENTRY_LINE[category]) || "Stuck despite training hard? Your stall has a specific cause.";
  return (
    <aside aria-label="Find your bottleneck" className="slab-inset flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <p className="text-[0.97rem] leading-snug text-ink-2">{line}</p>
      <div className="flex shrink-0 items-center gap-2">
        <TrackedCta place="entry" className="btn btn-primary btn-sm">
          Find your bottleneck
        </TrackedCta>
        <Link href="/pricing" className="btn btn-quiet btn-sm">
          Pricing
        </Link>
      </div>
    </aside>
  );
}
