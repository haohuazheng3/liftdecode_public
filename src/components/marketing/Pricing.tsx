import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { PlateFace } from "./graphics";

const MEMBER_INCLUDES = [
  "This report, fully unlocked",
  "Unlimited re-diagnoses as your training changes",
  "Plateau tracker for your lifts",
  "4-week plan with check-offs",
  "Compare reports to see what cleared",
  "The full fix library",
];

const REPORT_INCLUDES = [
  "This report, fully unlocked",
  "Every finding, ranked, with the fix",
  "Your clearances — what is not the problem",
  "Your 4-week plan, yours to keep",
];

function Check() {
  return (
    <span className="grid place-items-center w-5 h-5 shrink-0 mt-0.5 rounded-full bg-clear/15 text-clear" aria-hidden="true">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4l2.6 2.6L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Price({ amount, unit }: { amount: string; unit: string }) {
  return (
    <div className="text-right shrink-0">
      <div className="display text-[3.4rem] sm:text-[4.2rem] leading-[0.85] font-black">{amount}</div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3 mt-1.5">{unit}</div>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title">
      <SectionHeading
        id="pricing-title"
        eyebrow="Two ways in"
        title={
          <>
            Both unlock the <em>full</em> report.
          </>
        }
        intro="Answering is free. Pay only when you want to read the whole thing."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
        {/* 1 — membership first */}
        <article className="slab slab-hover overflow-hidden relative border-signal/30 flex flex-col">
          <div className="hazard h-2 w-full" aria-hidden="true" />
          <PlateFace outline className="absolute -right-20 -bottom-20 w-72 h-72 text-signal/10 pointer-events-none" />
          <div className="relative p-5 sm:p-8 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="tag tag-signal mb-3">Most complete</span>
                <h3 className="display display-caps text-[2.1rem] sm:text-[2.6rem] leading-none">Membership</h3>
                <p className="mt-2 text-sm text-ink-2 leading-relaxed">Diagnose, fix, re-check. Keep the loop going.</p>
              </div>
              <Price amount="$15" unit="per month" />
            </div>
            <ul className="mt-6 space-y-2.5 flex-1">
              {MEMBER_INCLUDES.map((t) => (
                <li key={t} className="flex gap-3 text-[0.95rem] text-ink-2 leading-relaxed">
                  <Check />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Link href="/pricing" className="btn btn-primary w-full">
                Become a member
              </Link>
              <p className="mt-2.5 text-[11px] text-ink-3 text-center">Cancel any time from your account. No lock-in.</p>
            </div>
          </div>
        </article>

        {/* 2 — single report */}
        <article className="slab slab-hover overflow-hidden flex flex-col">
          <div className="knurl h-2 w-full" aria-hidden="true" />
          <div className="p-5 sm:p-8 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="tag mb-3">One time</span>
                <h3 className="display display-caps text-[2.1rem] sm:text-[2.6rem] leading-none">Just this report</h3>
                <p className="mt-2 text-sm text-ink-2 leading-relaxed">One diagnosis, fully unlocked. No subscription.</p>
              </div>
              <Price amount="$5" unit="one time" />
            </div>
            <ul className="mt-6 space-y-2.5 flex-1">
              {REPORT_INCLUDES.map((t) => (
                <li key={t} className="flex gap-3 text-[0.95rem] text-ink-2 leading-relaxed">
                  <Check />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Link href="/diagnose" className="btn btn-ghost w-full" prefetch>
                Start the diagnosis
              </Link>
              <p className="mt-2.5 text-[11px] text-ink-3 text-center">Answer first. Pay only to unlock.</p>
            </div>
          </div>
        </article>
      </div>

      <p className="mt-5 text-sm text-ink-3 text-center">
        Full comparison, refunds and cancellation on the{" "}
        <Link href="/pricing" className="underline underline-offset-2 hover:text-ink-2">
          pricing page
        </Link>
        .
      </p>
    </section>
  );
}
