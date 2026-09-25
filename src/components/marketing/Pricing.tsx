import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const MEMBER_INCLUDES = [
  "This report, fully unlocked",
  "Unlimited re-diagnoses as your training changes",
  "Plateau tracker for lifts and measurements",
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
    <span className="grid place-items-center w-5 h-5 shrink-0 rounded-full bg-clear/15 text-clear" aria-hidden="true">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4l2.6 2.6L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Pricing() {
  return (
    <section id="pricing">
      <SectionHeading
        eyebrow="Two ways in"
        title={
          <>
            Both unlock the <em>full</em> report.
          </>
        }
        intro="Answering is free. Pay only when you want to read the whole thing. Membership is for lifters who want to keep re-checking; the single report is for one clear answer."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
        {/* 1 — membership first */}
        <article className="slab slab-hover p-6 sm:p-8 relative overflow-hidden border-signal/30 flex flex-col">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="tag tag-signal mb-3">Most complete</span>
              <h3 className="text-2xl font-semibold tracking-tight">LiftDecode Membership</h3>
              <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">
                For lifters who want to keep the loop going: diagnose, fix, re-check.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="display text-4xl sm:text-5xl">$15</div>
              <div className="text-xs text-ink-3 mt-1">per month</div>
            </div>
          </div>
          <ul className="relative mt-6 space-y-2.5 flex-1">
            {MEMBER_INCLUDES.map((t) => (
              <li key={t} className="flex gap-3 text-[0.95rem] text-ink-2 leading-relaxed">
                <Check />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="relative mt-7">
            <Link href="/pricing" className="btn btn-primary w-full">
              Become a member
            </Link>
            <p className="mt-2.5 text-[11px] text-ink-3 text-center">Cancel any time from your account. No lock-in.</p>
          </div>
        </article>

        {/* 2 — single report */}
        <article className="slab slab-hover p-6 sm:p-8 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="tag mb-3">One time</span>
              <h3 className="text-2xl font-semibold tracking-tight">Just this report</h3>
              <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">
                One set of answers, one full diagnosis. No subscription.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="display text-4xl sm:text-5xl">$5</div>
              <div className="text-xs text-ink-3 mt-1">one time</div>
            </div>
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
