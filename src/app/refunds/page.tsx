import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/trust/LegalPage";

export const metadata: Metadata = {
  title: "Refunds & cancellation",
  description:
    "When a LiftDecode single report is refunded, how membership cancellation works, what happens with an accidental renewal, and exactly how to ask.",
};

const LAST_UPDATED = "2026-09-25";

const SECTIONS: LegalSection[] = [
  {
    id: "single-report",
    title: "Single report — $5",
    body: (
      <>
        <p>
          A single report is digital content that unlocks the moment Stripe confirms payment, so the usual
          &ldquo;changed my mind&rdquo; return does not apply. We refund it <strong>in full, within 14 days of
          purchase</strong>, if any of these happened:
        </p>
        <ul>
          <li>
            <strong>The report failed to open.</strong> You paid, but the report page never unlocked or shows an
            error, and it is still not working after you sign in with the same email you paid with.
          </li>
          <li>
            <strong>You were charged twice</strong> for the same report. The duplicate is refunded, always, no
            time limit.
          </li>
          <li>
            <strong>The report clearly did not process your answers</strong> — for example it is empty, or the
            &ldquo;what you told us&rdquo; sections quote answers you did not give.
          </li>
        </ul>
        <p>
          Outside those cases the report is not refundable — but if you think a finding is wrong for you, or something
          in it does not make sense, <strong>email us anyway</strong>. We will look at your answers with you, explain
          the rule that fired, and correct our content if it is at fault. That help is free and does not depend on a
          refund.
        </p>
        <p>
          Remember that your primary bottleneck is shown in full before you pay. If it does not describe you, that is
          the moment to stop.
        </p>
      </>
    ),
  },
  {
    id: "membership",
    title: "Membership — $15 per month",
    body: (
      <>
        <h3>Cancelling</h3>
        <p>
          Cancel any time from <Link href="/account">your account page</Link> — one button, no email required, no
          retention call. Your membership then runs to the end of the period you already paid for; you keep full access
          until then and are not charged again. Reports you opened while a member stay readable afterwards; reports
          you never opened lock again until you re-join or unlock them singly.
        </p>
        <h3>No partial-month refunds</h3>
        <p>
          Because access continues to the end of the paid period, we do not refund the unused part of a month when
          you cancel.
        </p>
        <h3>Accidental renewals</h3>
        <p>
          If a renewal went through that you did not mean to keep, we refund it on request{" "}
          <strong>within 7 days of the renewal charge</strong>, provided <strong>no report was unlocked</strong> in
          that billing period. Email us with the receipt; we cancel the membership and refund the charge in the same
          reply.
        </p>
        <h3>Duplicate subscriptions and errors</h3>
        <p>
          If you were charged twice in one period, or charged after cancelling, tell us and we refund the extra charge
          regardless of the 7-day window.
        </p>
      </>
    ),
  },
  {
    id: "how-to",
    title: "How to request a refund",
    body: (
      <>
        <ol>
          <li>
            Find the Stripe receipt in your email (the subject line mentions LiftDecode). The receipt number or the
            charge date and last four digits of the card are enough for us to locate it.
          </li>
          <li>
            Email <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a> from the address on your account,
            with the receipt and one line on what happened.
          </li>
          <li>
            We reply within <strong>2 business days</strong>. Approved refunds are issued through Stripe to the
            original payment method; banks usually show them within 5–10 business days.
          </li>
        </ol>
        <p>
          You can also use the <Link href="/contact">contact form</Link>; it reaches the same inbox. Please do not
          open a chargeback with your bank before writing to us — it takes weeks longer and we will almost always have
          resolved it in one reply.
        </p>
      </>
    ),
  },
  {
    id: "promo",
    title: "Promo codes and free access",
    body: (
      <>
        <p>
          Purchases made with a 100% promotional code have nothing to refund. Discounted purchases are refunded at the
          amount actually paid. Free access granted for testing or support may be withdrawn at any time.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Your statutory rights",
    body: (
      <>
        <p>
          Nothing here removes rights you have under the consumer law where you live. In some places, including the
          EU and UK, digital content is exempt from the standard cancellation period once delivery has begun with your
          agreement; by unlocking a report you agree to immediate delivery. Where the law gives you more than this
          policy does, the law applies.
        </p>
      </>
    ),
  },
];

export default function RefundsPage() {
  return (
    <LegalPage
      eyebrow="Refunds & cancellation"
      lastUpdated={LAST_UPDATED}
      title={
        <>
          Fair, and written <em>before</em> you ask.
        </>
      }
      lede="A report is delivered instantly, a membership runs month to month. Here is exactly what is refunded, what is not, and how to ask."
      summary={[
        "Single report: full refund within 14 days if it failed to open, you were charged twice, or it clearly did not process your answers. Otherwise not refundable — but we will help.",
        <>
          Membership: cancel any time from <Link href="/account">your account</Link>. Access continues to the end of
          the paid period; no partial-month refunds.
        </>,
        "An accidental renewal is refunded on request within 7 days if no report was unlocked in that period.",
        <>
          To ask: email <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a> with your Stripe receipt.
          Reply within 2 business days; refunds go back to the original payment method.
        </>,
      ]}
      sections={SECTIONS}
      related={[
        { href: "/pricing", label: "Pricing" },
        { href: "/terms", label: "Terms of service" },
        { href: "/contact", label: "Contact" },
      ]}
    />
  );
}
