import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/trust/LegalPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The agreement between you and LiftDecode: what the diagnosis is and is not, who can use it, how paying and cancelling work, what you own, and what we are responsible for.",
};

const LAST_UPDATED = "2026-09-25";

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "The agreement",
    body: (
      <>
        <p>
          These terms are a contract between you and <strong>LiftDecode</strong>, the operator of liftdecode.com. By
          taking the diagnostic, creating an account or paying for anything, you agree to them. If you do not agree,
          please do not use the site. Questions go to{" "}
          <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a>; we reply within 2 business days.
        </p>
        <p>
          The <Link href="/privacy">privacy policy</Link> and the <Link href="/refunds">refund and cancellation
          policy</Link> are part of these terms.
        </p>
      </>
    ),
  },
  {
    id: "what-it-is",
    title: "What LiftDecode is — and is not",
    body: (
      <>
        <p>
          LiftDecode is a <strong>training and nutrition education</strong> product. You answer questions about how
          you train, eat, recover and measure progress; a rule-based engine turns those answers into a written report:
          ranked bottlenecks, things that are not your problem, and a 4-week plan. Members also get tools to track
          numbers and compare reports over time.
        </p>
        <p>
          <strong>It is not medical advice.</strong> LiftDecode does not diagnose, treat, cure or prevent any disease,
          injury or condition, and nothing on the site is a substitute for the advice of a physician, physiotherapist,
          registered dietitian or other qualified professional. If you have pain, an injury, a medical condition, an
          eating disorder, are pregnant or postpartum, or are unsure whether a change in training or diet is safe for
          you, get professional advice before acting on anything in a report.
        </p>
        <p>
          <strong>It is not coaching.</strong> No one reviews your individual answers, watches you train, or monitors
          your progress. The report is generated from your answers by rules written by LiftDecode, and it is only as
          accurate as those answers.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can use it",
    body: (
      <>
        <p>
          You must be <strong>at least 16 years old</strong> and able to enter into a binding contract. If you are
          under 18, you should have a parent or guardian&rsquo;s permission. You are responsible for deciding whether
          the training and nutrition changes in a report are appropriate for you.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "Your account",
    body: (
      <>
        <p>
          Sign-in is handled by Clerk using your email address and a 6-digit code. Keep control of that email account:
          anyone who can read its inbox can sign in as you. Tell us at once if you think your account has been used
          without your permission. One person per account; do not share it or resell access.
        </p>
        <p>
          A diagnosis taken before signing in is tied to your browser through the <code>ld_anon</code> cookie. If you
          clear cookies or switch devices before signing in, we may not be able to find it again.
        </p>
      </>
    ),
  },
  {
    id: "paying",
    title: "Paying for a report or a membership",
    body: (
      <>
        <p>
          The diagnostic and your primary finding are free. Two paid options exist, both priced in US dollars and
          charged through Stripe:
        </p>
        <ul>
          <li>
            <strong>Single report — $5, one time.</strong> Unlocks the full report for one specific diagnosis. Yours to
            read for as long as your account exists. It does not cover future diagnoses.
          </li>
          <li>
            <strong>Membership — $15 per month.</strong> Unlocks every report while active, plus unlimited
            re-diagnoses, the plateau tracker, report comparison and the fix library; reports you opened as a member
            stay readable after it ends. It renews automatically each month on the same payment method until you
            cancel.
          </li>
        </ul>
        <p>
          Access is granted when Stripe confirms payment, usually within seconds. Prices may change; we will tell
          members by email at least 14 days before a change affects their next renewal, and you can cancel before it
          does. Taxes may be added where the law requires. Your bank may charge a currency-conversion fee.
        </p>
        <p>
          Cancelling and refunds are covered in the <Link href="/refunds">refund and cancellation policy</Link>. In
          short: cancel any time from <Link href="/account">your account</Link>, access continues to the end of the
          paid period, and single reports are refundable within 14 days only when something went wrong with the
          purchase or the report.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "What you own, what we own",
    body: (
      <>
        <p>
          <strong>Your answers and your data</strong> stay yours. You give us permission to store and process them to
          run the service, as described in the privacy policy, and to use aggregate, de-identified patterns across
          many users to improve the questions and rules.
        </p>
        <p>
          <strong>The site, the questions, the rules, the finding content, the plans and the reports</strong> are the
          work of LiftDecode and are protected by copyright. You may read, print and save your own report for personal
          use. You may not republish reports or finding content, scrape the site, reverse-engineer the rules, or build
          a competing product from them.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>Do not:</p>
        <ul>
          <li>use automated tools to submit diagnoses, create accounts or hit our APIs;</li>
          <li>attempt to bypass payment, rate limits or access controls;</li>
          <li>use the contact form to send spam, abuse or anything unlawful;</li>
          <li>upload anything you do not have the right to share.</li>
        </ul>
        <p>We may suspend or close accounts that do, and refuse service to anyone who abuses it or the people behind it.</p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability and changes",
    body: (
      <>
        <p>
          We aim to keep the site up but do not promise uninterrupted access; hosting, database and payment providers
          have their own outages. We may change or retire features. If we discontinue membership entirely, we will
          refund the unused part of the current period. The rules and content are revised over time; an existing report
          is never recomputed, so what you paid for stays as it was.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer and limitation of liability",
    body: (
      <>
        <p>
          The service is provided <strong>&ldquo;as is&rdquo;</strong>. A report reflects rules applied to your own
          answers; it may be wrong for you, and following it is your decision. To the fullest extent the law allows,
          LiftDecode is not liable for injury, illness, lost gains, lost data or any indirect or consequential loss
          arising from your use of the site or reliance on a report, and our total liability to you for any claim is
          limited to the amount you paid us in the 12 months before the claim arose. Nothing here limits liability that
          cannot be limited by law, including for fraud or for death or personal injury caused by negligence where
          such limits are not permitted.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Ending the agreement",
    body: (
      <>
        <p>
          You can stop using LiftDecode at any time and ask us to delete your account by emailing us. We can end the
          agreement if you break these terms; where practical we will tell you why. Sections about ownership,
          disclaimers and disputes survive termination.
        </p>
      </>
    ),
  },
  {
    id: "disputes",
    title: "Disputes and governing law",
    body: (
      <>
        <p>
          If something goes wrong, email us first; most problems are fixed in one reply. These terms are governed by
          the laws applicable at LiftDecode&rsquo;s place of operation, without affecting any mandatory consumer
          protections you have under the law of the country where you live. If a provision is found unenforceable, the
          rest still applies.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <>
        <p>
          We may update these terms. Material changes are announced by email to account holders at least 14 days before
          they take effect, and the date at the top is updated. Continuing to use the site after that date means you
          accept the new terms; if you do not, cancel and stop using the service before then.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms of service"
      lastUpdated={LAST_UPDATED}
      title={
        <>
          The deal, stated <em>plainly</em>.
        </>
      }
      lede="You bring honest answers; we bring a report and, if you are a member, the tools to check it against reality. These terms say what each side can expect."
      summary={[
        "LiftDecode is training and nutrition education, not medical advice or coaching. Get professional advice for pain, injury or a medical condition.",
        "You must be 16 or older. One person per account; sign-in is by email code.",
        "Single report: $5 once, for one diagnosis. Membership: $15 a month, renews until you cancel from your account; access runs to the end of the paid period.",
        "Your answers are yours. The questions, rules, content and reports are LiftDecode's — read and print your own report, do not republish it.",
        "Reports are never recomputed after the fact; what you paid for stays as it was.",
        <>
          Refunds are covered in the <Link href="/refunds">refund policy</Link>; data in the{" "}
          <Link href="/privacy">privacy policy</Link>.
        </>,
      ]}
      sections={SECTIONS}
      related={[
        { href: "/privacy", label: "Privacy policy" },
        { href: "/refunds", label: "Refunds & cancellation" },
        { href: "/pricing", label: "Pricing" },
      ]}
    />
  );
}
