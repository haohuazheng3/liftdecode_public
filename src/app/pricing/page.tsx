import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JsonLd } from "@/components/trust/JsonLd";
import { PageHero } from "@/components/trust/PageHero";
import { MembershipButton } from "@/components/trust/MembershipButton";
import { CheckoutNotice } from "@/components/trust/CheckoutNotice";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "LiftDecode membership is $15 a month: unlimited diagnoses, the plateau tracker, report comparison and the fix library. Or unlock a single report for $5. No hidden tiers.",
};

type Cell = true | false | string;

const ROWS: { feature: string; detail: string; membership: Cell; report: Cell }[] = [
  {
    feature: "Full report",
    detail: "Every bottleneck ranked, with mechanism, fix, timeline and mistakes to avoid.",
    membership: true,
    report: true,
  },
  {
    feature: "4-week plan",
    detail: "Week-by-week directives built from your top three findings, with check-offs.",
    membership: true,
    report: true,
  },
  {
    feature: "Re-diagnoses",
    detail: "Run the diagnostic again as your training changes.",
    membership: "Unlimited",
    report: "One report",
  },
  {
    feature: "Plateau tracker",
    detail: "Log lifts and measurements weekly; see whether the plan is actually moving the numbers.",
    membership: true,
    report: false,
  },
  {
    feature: "Report comparison",
    detail: "Put two diagnoses side by side and see which bottlenecks cleared.",
    membership: true,
    report: false,
  },
  {
    feature: "Fix library",
    detail: "Every finding we can detect, with its full protocol — browse the ones you were not flagged for.",
    membership: true,
    report: false,
  },
];

function CellMark({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-clear/15 text-clear text-xs" aria-label="Included">
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-white/[0.04] text-ink-4 text-xs" aria-label="Not included">
        –
      </span>
    );
  }
  return <span className="text-sm text-ink font-medium">{value}</span>;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": "https://liftdecode.com/pricing#membership",
      name: "LiftDecode Membership",
      description:
        "Unlimited training diagnoses, full reports with 4-week plans, the plateau tracker, report comparison and the fix library.",
      brand: { "@type": "Organization", name: "LiftDecode", url: "https://liftdecode.com" },
      url: "https://liftdecode.com/pricing",
      offers: {
        "@type": "Offer",
        price: "15.00",
        priceCurrency: "USD",
        url: "https://liftdecode.com/pricing",
        availability: "https://schema.org/InStock",
        category: "Subscription",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "15.00",
          priceCurrency: "USD",
          billingDuration: 1,
          billingIncrement: 1,
          unitCode: "MON",
        },
        seller: { "@type": "Organization", name: "LiftDecode" },
      },
    },
    {
      "@type": "Product",
      "@id": "https://liftdecode.com/pricing#report",
      name: "LiftDecode Single Report",
      description:
        "One full diagnosis report for one set of answers: ranked bottlenecks, what is not your problem, and a 4-week plan. Yours to keep.",
      brand: { "@type": "Organization", name: "LiftDecode", url: "https://liftdecode.com" },
      url: "https://liftdecode.com/pricing",
      offers: {
        "@type": "Offer",
        price: "5.00",
        priceCurrency: "USD",
        url: "https://liftdecode.com/diagnose",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "LiftDecode" },
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-5xl space-y-4">
        <PageHero
          eyebrow="Pricing"
          title={
            <>
              Two ways to get the <em>answer</em>. No tiers, no upsells inside.
            </>
          }
          lede="The diagnostic itself is free to take and shows you your primary bottleneck before you pay anything. Paying unlocks the full report: every finding, what is not your problem, and the 4-week plan. Membership adds the tools for the months after."
        >
          <Suspense fallback={null}>
            <CheckoutNotice />
          </Suspense>
        </PageHero>

        {/* the two options — membership first */}
        <div className="grid gap-4 md:grid-cols-[1.15fr_1fr] md:items-stretch">
          <div className="slab p-6 sm:p-8 animate-rise border-signal/30 relative overflow-hidden" style={{ animationDelay: "60ms" }}>
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="tag tag-signal mb-3">Most complete</span>
                <h2 className="text-2xl font-semibold tracking-tight">Membership</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="display text-5xl leading-none">$15</div>
                <div className="text-xs text-ink-3 mt-1">per month</div>
              </div>
            </div>
            <p className="mt-4 text-ink-2 leading-relaxed">
              For lifters who want to keep checking their own work. Diagnose as often as your training changes, track
              whether the numbers move, compare reports over time, and read the fix for every bottleneck we can detect —
              not just yours.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Every report, every time — unlimited diagnoses",
                "Plateau tracker for lifts and measurements",
                "Side-by-side report comparison",
                "The full fix library",
                "Reports you open as a member stay readable after it ends",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[0.95rem] text-ink-2">
                  <span className="text-signal shrink-0" aria-hidden="true">
                    ›
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Suspense
              fallback={
                <div className="mt-6">
                  <div className="skeleton h-12 w-full rounded-full" aria-hidden="true" />
                </div>
              }
            >
              <MembershipButton className="mt-6" />
            </Suspense>
            <p className="mt-3 text-xs text-ink-3 text-center leading-relaxed">
              Cancel any time from your account. Access runs to the end of the paid month.
            </p>
          </div>

          <div className="slab p-6 sm:p-8 animate-rise flex flex-col" style={{ animationDelay: "120ms" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="tag mb-3">One-time</span>
                <h2 className="text-2xl font-semibold tracking-tight">Single report</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="display text-5xl leading-none">$5</div>
                <div className="text-xs text-ink-3 mt-1">once, yours to keep</div>
              </div>
            </div>
            <p className="mt-4 text-ink-2 leading-relaxed">
              The full diagnosis for one set of answers. Everything the report contains, nothing held back — it just
              does not come with the ongoing tools.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Every bottleneck, ranked, with the full fix",
                "What is not your problem, and why",
                "Your 4-week plan with check-offs",
                "Readable and printable for as long as your account exists",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[0.95rem] text-ink-2">
                  <span className="text-ink-3 shrink-0" aria-hidden="true">
                    ›
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <Link href="/diagnose" className="btn btn-ghost w-full">
                Start the diagnosis
              </Link>
              <p className="mt-3 text-xs text-ink-3 text-center leading-relaxed">
                A report needs answers first. The unlock is offered once your result is ready.
              </p>
            </div>
          </div>
        </div>

        {/* comparison */}
        <div className="slab p-5 sm:p-8 animate-rise" style={{ animationDelay: "180ms" }}>
          <div className="eyebrow mb-4">What each includes</div>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[340px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left">
                  <th scope="col" className="pb-3 pr-3 text-xs font-mono uppercase tracking-[0.12em] text-ink-3 font-normal">
                    Feature
                  </th>
                  <th scope="col" className="pb-3 px-2 text-xs font-mono uppercase tracking-[0.12em] text-signal font-normal text-center w-[92px]">
                    Member
                  </th>
                  <th scope="col" className="pb-3 pl-2 text-xs font-mono uppercase tracking-[0.12em] text-ink-3 font-normal text-center w-[92px]">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.feature}>
                    <th scope="row" className="py-3.5 pr-3 align-top text-left font-normal border-t border-line">
                      <div className="text-ink font-medium text-[0.95rem]">{r.feature}</div>
                      <div className="text-xs text-ink-3 mt-0.5 leading-relaxed">{r.detail}</div>
                    </th>
                    <td className="py-3.5 px-2 align-top text-center border-t border-line">
                      <CellMark value={r.membership} />
                    </td>
                    <td className="py-3.5 pl-2 align-top text-center border-t border-line">
                      <CellMark value={r.report} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* the fine print, in plain words */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Payments",
              body: "Checkout runs on Stripe. We never see or store card numbers. Prices are in US dollars; your bank may add a conversion fee.",
            },
            {
              title: "Cancelling",
              body: "Membership renews monthly until you cancel from your account page. Cancel today and you keep access until the paid period ends.",
            },
            {
              title: "Refunds",
              body: (
                <>
                  A single report is refunded in full within 14 days if it failed to open, you were charged twice, or it
                  clearly did not process your answers. Details in the{" "}
                  <Link href="/refunds" className="text-signal underline underline-offset-2">
                    refund policy
                  </Link>
                  .
                </>
              ),
            },
          ].map((c, i) => (
            <div key={c.title} className="slab p-5 sm:p-6 animate-rise" style={{ animationDelay: `${240 + i * 40}ms` }}>
              <div className="eyebrow mb-2">{c.title}</div>
              <p className="text-sm text-ink-2 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-ink-3 leading-relaxed px-4">
          LiftDecode is training and nutrition education, not medical advice. You must be 16 or older to use it.{" "}
          <Link href="/faq" className="underline underline-offset-2 hover:text-ink-2">
            More questions answered in the FAQ
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
