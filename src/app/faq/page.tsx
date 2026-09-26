import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/trust/JsonLd";
import { PageHero } from "@/components/trust/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Straight answers about the LiftDecode diagnosis, the report, pricing and refunds, and how your account and data are handled.",
};

interface Faq {
  q: string;
  /** plain-text answer for JSON-LD */
  a: string;
  /** rendered answer (may contain links); falls back to `a` */
  body?: ReactNode;
}

const GROUPS: { id: string; title: string; items: Faq[] }[] = [
  {
    id: "diagnosis",
    title: "The diagnosis",
    items: [
      {
        q: "Who is this for?",
        a: "Lifters who have trained consistently for at least a few months and have stopped seeing progress — in their physique or in their lifts. If you are in your first weeks of training you do not have a bottleneck yet; come back when the easy gains slow down. You must be 16 or older.",
      },
      {
        q: "What is answering like, and do I need to sign in first?",
        a: "Quick and light: most questions are one tap on a 1–10 scale or one of a few short answers, with nothing to look up or measure. You do not need an account to take it: your result is tied to your browser with a cookie, and you only sign in (email plus a 6-digit code, no password) when you want to unlock the full report.",
      },
      {
        q: "Why no weights, macros or measurements?",
        a: "Because the numbers are not where a stall hides. The questions read your current training, effort, food, sleep, recovery and life load — the factors that actually decide progress — so the engine can see where the problem is. Answer for a normal recent week, not the week you would like to have had; that honesty is what makes the findings trustworthy.",
      },
      {
        q: "Is this an AI guessing at my answers?",
        a: "No. The engine is a set of deterministic rules written and revised by LiftDecode. Each finding is triggered by specific answers, weighted and ranked, and the report quotes those answers back to you. The same answers always produce the same result.",
      },
      {
        q: "What if my result does not describe me?",
        a: "Your primary bottleneck is shown in full, with the answers behind it, before you pay anything. If it is wrong, do not pay — email us instead and tell us what you answered and what you expected. That is exactly the feedback the rules are improved with.",
      },
    ],
  },
  {
    id: "report",
    title: "The report",
    items: [
      {
        q: "What exactly is in the full report?",
        a: "Every bottleneck your answers triggered, ranked by impact. For each: a verdict, the answers that triggered it, the mechanism, how it shows up, the fix in numbered steps, a timeline, and the wrong fixes to avoid. Then the clearances — what is not your problem — and a 4-week plan built from your top three findings, with check-offs.",
      },
      {
        q: "How long do I keep access to a report?",
        a: "For as long as your account exists. A single-report unlock is permanent for that diagnosis. Membership covers every report while it is active, and any report you opened as a member stays readable after it ends; reports you never opened lock again until you re-join or unlock them singly. Reports can also be printed or saved as PDF from your browser.",
      },
      {
        q: "Will my report change when you update the engine?",
        a: "No. Each report is stored with the engine version that produced it and is never recomputed. If you want to see what changed, run a new diagnosis; members can compare the two side by side.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & refunds",
    items: [
      {
        q: "What does it cost?",
        a: "Membership is $15 a month and includes unlimited diagnoses, the plateau tracker, report comparison and the fix library. A single report is $5, one time, for one set of answers. Prices are in US dollars and checkout runs on Stripe.",
        body: (
          <>
            Membership is <strong>$15 a month</strong> and includes unlimited diagnoses, the plateau tracker, report
            comparison and the fix library. A single report is <strong>$5</strong>, one time, for one set of answers.
            Prices are in US dollars and checkout runs on Stripe. Full comparison on the{" "}
            <Link href="/pricing">pricing page</Link>.
          </>
        ),
      },
      {
        q: "Can I cancel the membership?",
        a: "Yes, any time, from your account page. Access continues until the end of the period you already paid for, and you are not charged again. There are no partial-month refunds, but an accidental renewal is refunded on request within 7 days if no report was unlocked in that period.",
        body: (
          <>
            Yes, any time, from your <Link href="/account">account page</Link>. Access continues until the end of the
            period you already paid for, and you are not charged again. There are no partial-month refunds, but an
            accidental renewal is refunded on request within 7 days if no report was unlocked in that period.
          </>
        ),
      },
      {
        q: "Can I get a refund on a single report?",
        a: "Within 14 days, in full, if the report failed to open, you were charged twice, or the report clearly did not process your answers. Otherwise a report is digital content delivered instantly and is not refundable — but if something is wrong with it, email us and we will help. Send the receipt to contact@liftdecode.com.",
        body: (
          <>
            Within 14 days, in full, if the report failed to open, you were charged twice, or the report clearly did not
            process your answers. Otherwise a report is digital content delivered instantly and is not refundable — but
            if something is wrong with it, email us and we will help. Details in the{" "}
            <Link href="/refunds">refund policy</Link>.
          </>
        ),
      },
    ],
  },
  {
    id: "account",
    title: "Account & privacy",
    items: [
      {
        q: "Why is there no password?",
        a: "Sign-in is handled by Clerk: you enter your email and type the 6-digit code we send. There is no password to reuse, forget or leak. Your session is kept in an essential cookie.",
      },
      {
        q: "What data do you collect, and who sees my answers?",
        a: "Your answers and reports are stored in a Postgres database (Neon, US East) against your account, or against an anonymous cookie until you sign in. Stripe handles payment and we never see card numbers. Our analytics tool, FlowGlance, records page views, clicks, scrolling, journeys and errors, and — because deep capture is on — text typed into forms, images uploaded, and the signed-in email; it only runs if you accept it in the cookie banner. We do not sell data.",
        body: (
          <>
            Your answers and reports are stored in a Postgres database (Neon, US East) against your account, or against
            an anonymous cookie until you sign in. Stripe handles payment and we never see card numbers. Our analytics
            tool, FlowGlance, records page views, clicks, scrolling, journeys and errors, and — because deep capture is
            on — text typed into forms, images uploaded, and the signed-in email; it only runs if you accept it in the
            cookie banner. We do not sell data. Everything is spelled out in the <Link href="/privacy">privacy policy</Link>.
          </>
        ),
      },
      {
        q: "How do I delete my account and data?",
        a: "Email contact@liftdecode.com from the address on the account and ask. We delete the account, its assessments and reports, and cancel any active membership; we reply within 2 business days. Payment records that we must keep for tax and fraud purposes are retained as the law requires.",
        body: (
          <>
            Email <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a> from the address on the account and
            ask. We delete the account, its assessments and reports, and cancel any active membership; we reply within 2
            business days. Payment records that we must keep for tax and fraud purposes are retained as the law
            requires.
          </>
        ),
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROUPS.flatMap((g) =>
    g.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  ),
};

export default function FaqPage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl space-y-4">
        <PageHero
          eyebrow="FAQ"
          title={
            <>
              The questions people ask <em>before</em> they take it.
            </>
          }
          lede="If yours is not here, email contact@liftdecode.com — we reply within 2 business days."
        >
          <ul className="mt-6 flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="btn btn-ghost btn-sm">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </PageHero>

        {GROUPS.map((g, gi) => (
          <section key={g.id} id={g.id} className="scroll-mt-24 animate-rise" style={{ animationDelay: `${60 + gi * 40}ms` }}>
            <div className="eyebrow px-2 mb-2 mt-6">{g.title}</div>
            <div className="space-y-3">
              {g.items.map((f) => (
                <details key={f.q} className="slab group open:border-line-2">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer select-none list-none p-5 sm:p-6 min-h-[56px] [&::-webkit-details-marker]:hidden">
                    <span className="text-ink font-medium text-[1.02rem] leading-snug">{f.q}</span>
                    <span
                      className="grid place-items-center shrink-0 w-7 h-7 rounded-full bg-white/[0.05] text-ink-3 transition-transform duration-200 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="prose-ld text-[0.97rem] px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
                    <p>{f.body ?? f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="slab p-6 sm:p-8 mt-6 text-center">
          <h2 className="display text-3xl sm:text-4xl">Still <em>wondering</em>?</h2>
          <p className="mt-3 text-ink-2 leading-relaxed">
            The fastest way to find out whether it fits you is to see your primary bottleneck — it is free.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/diagnose" className="btn btn-primary">
              Start the diagnosis
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Ask us something
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
