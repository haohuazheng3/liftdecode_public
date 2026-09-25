import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/trust/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What LiftDecode collects (your answers, reports, sign-in email, payment status, analytics), where it lives, who processes it, how long it is kept, and how to see or delete it.",
};

const LAST_UPDATED = "2026-09-25";

const SECTIONS: LegalSection[] = [
  {
    id: "who",
    title: "Who we are and how to reach us",
    body: (
      <>
        <p>
          This site, liftdecode.com, is operated by <strong>LiftDecode</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
          For anything in this policy — a question, a copy of your data, a deletion — email{" "}
          <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a>. We reply within 2 business days. We
          are the controller of the personal data described here.
        </p>
        <p>
          You must be at least 16 to use LiftDecode. We do not knowingly collect data from anyone younger; if you
          believe we have, email us and we will delete it.
        </p>
      </>
    ),
  },
  {
    id: "what",
    title: "What we collect, and why",
    body: (
      <>
        <h3>Your diagnosis answers and reports</h3>
        <p>
          The answers you give in the diagnostic, the track you chose, how long you took, and the result the engine
          produced (findings, clearances, the 4-week plan and your check-offs). This is the product: without it there
          is no report. We also keep the engine version so an old report is never silently recomputed.
        </p>
        <h3>An anonymous owner token</h3>
        <p>
          If you take the diagnostic before signing in, a random token in the <code>ld_anon</code> cookie is the only
          thing linking that browser to that result. It contains no personal data. When you sign in, the assessment is
          claimed by your account.
        </p>
        <h3>Your account</h3>
        <p>
          Your email address, a Clerk user id, and timestamps (created, last seen). Sign-in is email plus a 6-digit
          code — we never hold a password for you. We do not ask for your name, age, weight or any health history.
        </p>
        <h3>Payment status</h3>
        <p>
          Which product you bought (single report or membership), the Stripe customer, checkout session, subscription
          and invoice identifiers, the amount, currency, any promo code, the email Stripe used, and whether the purchase
          was refunded. <strong>We never see or store card numbers</strong>; Stripe handles those entirely.
        </p>
        <h3>Member tools</h3>
        <p>If you use the plateau tracker: the lifts and measurements you log, with dates, units and notes.</p>
        <h3>Contact messages</h3>
        <p>
          Name, email and message from the contact form, plus the IP address and browser user-agent that sent it, so
          we can tell people from bots and answer you.
        </p>
        <h3>Email you send us</h3>
        <p>
          If you email contact@liftdecode.com — or any address at this domain — the whole message is kept: sender,
          subject, body and the mail headers, in our database and in the mailbox we answer from, so we can reply and
          keep the thread.
        </p>
        <h3>Technical and error logs</h3>
        <p>
          When something breaks we record the error name, message, stack, route and a coarse fingerprint so we can fix
          it. Rate-limit counters are keyed by route and IP address and expire on their own.
        </p>
        <h3>Analytics (FlowGlance)</h3>
        <p>
          We use one analytics service, FlowGlance, to understand how the diagnostic is used. It records page views,
          clicks, scroll depth, the path you take through the site, and JavaScript errors. Because we have{" "}
          <strong>deep capture switched on</strong>, it also records the <strong>text you type into forms</strong> on
          this site and <strong>images you upload</strong>, and once you are signed in it is told your{" "}
          <strong>email address</strong> so your sessions can be identified (mainly so we can exclude our own traffic
          and follow up on a bug you report). FlowGlance runs only if you accept it in the cookie banner; choose
          &ldquo;Essential only&rdquo; and it is not loaded. See{" "}
          <a href="#cookies">Cookies</a> for how to change your mind later.
        </p>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "The legal basis we rely on",
    body: (
      <>
        <ul>
          <li>
            <strong>Performing our contract with you</strong> — storing answers and producing reports, running your
            account, taking payment, granting access, answering your messages.
          </li>
          <li>
            <strong>Our legitimate interests</strong> — keeping the service secure (rate limits, error logs, the
            honeypot on the contact form), preventing fraud and abuse, and improving the questions and rules based on
            aggregate patterns.
          </li>
          <li>
            <strong>Your consent</strong> — for FlowGlance analytics. You can withdraw it at any time; see{" "}
            <a href="#cookies">Cookies</a>.
          </li>
          <li>
            <strong>Legal obligations</strong> — keeping payment records for tax and accounting purposes.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "processors",
    title: "Who processes your data for us",
    body: (
      <>
        <p>We keep the list short and each provider only sees what it needs for its job.</p>
        <ul>
          <li>
            <strong>Neon</strong> — our Postgres database, hosted in the US East region. Holds everything in the
            &ldquo;What we collect&rdquo; section except card data.
          </li>
          <li>
            <strong>Clerk</strong> — sign-in. Holds your email address, sends the 6-digit code, and issues the session
            cookies.
          </li>
          <li>
            <strong>Stripe</strong> — payments. Holds your card details and billing information; sends us the
            identifiers and status listed above.
          </li>
          <li>
            <strong>FlowGlance</strong> — analytics, only with your consent, as described above.
          </li>
          <li>
            <strong>Vercel</strong> — hosts the site and its server code; sees request logs (IP address, URL,
            user-agent) in the ordinary course of serving pages.
          </li>
          <li>
            <strong>Cloudflare</strong> — DNS; inbound email for liftdecode.com (Cloudflare Email Routing receives
            every message to an address at this domain and hands it to our server through a Cloudflare Email Worker,
            which also delivers contact-form notifications to us); and nightly backups of our database, stored
            encrypted at rest in Cloudflare R2 and deleted after 30 days.
          </li>
        </ul>
        <p>
          We do not sell personal data, do not share it with advertisers, and do not use it to train language models.
          We disclose it only to the providers above, or if the law requires it.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>These are all of them:</p>
        <ul>
          <li>
            <strong>Clerk session cookies</strong> (essential) — keep you signed in. Set when you sign in; removed when
            you sign out or the session expires.
          </li>
          <li>
            <strong>Stripe</strong> (essential) — set by Stripe during checkout for fraud prevention and to complete the
            payment.
          </li>
          <li>
            <strong>ld_anon</strong> (essential) — lets an anonymous visitor own the diagnosis they just completed and
            come back to their result. Random token, no personal data, kept for 90 days.
          </li>
          <li>
            <strong>ld_consent</strong> — remembers whether you accepted or declined analytics so the banner does not
            reappear.
          </li>
          <li>
            <strong>FlowGlance</strong> (analytics) — only if you accepted analytics in the banner; nothing is set
            while the choice is still open. Used to tell one visit from another and to link sessions to your account
            once signed in.
          </li>
        </ul>
        <p>
          To change your choice, delete the <code>ld_consent</code> cookie in your browser and the banner will ask
          again on your next visit. Blocking essential cookies will stop sign-in and checkout from working.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep things",
    body: (
      <>
        <ul>
          <li>
            <strong>Assessments, reports, plan check-offs, tracker entries</strong> — for as long as your account
            exists. Anonymous assessments that are never claimed by an account are kept so the <code>ld_anon</code>{" "}
            cookie can find them again, and may be deleted after the cookie&rsquo;s 90 days have passed.
          </li>
          <li>
            <strong>Account</strong> — until you ask us to delete it.
          </li>
          <li>
            <strong>Payment records</strong> — as long as tax and accounting law requires, typically 7 years, even
            after the account is deleted. Card details are Stripe&rsquo;s and follow Stripe&rsquo;s retention.
          </li>
          <li>
            <strong>Contact messages and email you send us</strong> — until the conversation is closed and no longer
            needed, then deleted.
          </li>
          <li>
            <strong>Backups</strong> — a nightly copy of the database is kept for 30 days, then deleted. Anything you
            ask us to delete disappears from the backups within that window.
          </li>
          <li>
            <strong>Error logs and rate-limit counters</strong> — error records are cleared once resolved; rate-limit
            windows expire within minutes.
          </li>
          <li>
            <strong>Analytics</strong> — per FlowGlance&rsquo;s retention; we can ask FlowGlance to delete the sessions
            linked to your email on request.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights, and how to use them",
    body: (
      <>
        <p>
          Wherever you live, you can ask us to <strong>show you</strong> the data we hold about you, <strong>correct</strong>{" "}
          it, <strong>delete</strong> it, <strong>restrict</strong> or <strong>object</strong> to how we use it, or
          give you a <strong>copy</strong> in a portable format. If you are in the EU/EEA, UK, Switzerland, California
          or another place with a privacy law, these are legal rights; everywhere else we honour them anyway.
        </p>
        <p>
          To use any of them, email <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a> from the
          address on your account so we can verify it is you. Deletion removes your account, assessments, reports and
          tracker data, and cancels any active membership; payment records we are legally required to keep are
          retained, and copies in nightly backups expire within 30 days. We respond within 2 business days and
          complete requests within 30 days.
        </p>
        <p>
          If you think we have handled your data badly, tell us first — we would rather fix it. You also have the right
          to complain to your local data-protection authority.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Where your data goes",
    body: (
      <>
        <p>
          Our database and hosting are in the United States, and our providers operate globally. If you are outside the
          US, your data is transferred there. Our providers rely on standard contractual clauses or equivalent
          safeguards for those transfers, and we choose providers with strong security practices.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          All traffic is encrypted in transit. There are no passwords to steal: sign-in is by one-time code. Card data
          never touches our servers. Access to the database is limited to the operator and to the site&rsquo;s own
          server code. Anonymous results are protected by a long random token, not a guessable id. No system is
          perfectly secure; if we ever learn of a breach affecting your data we will tell you without undue delay.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          When we change something that matters — a new provider, a new category of data, a new use — we update the
          date at the top and, if you have an account, tell you by email before it takes effect. Minor wording fixes
          just update the date.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy policy"
      lastUpdated={LAST_UPDATED}
      title={
        <>
          What we keep, and what we <em>don&rsquo;t</em>.
        </>
      }
      lede="LiftDecode stores your answers because they are the product, your email because you sign in with it, and your payment status because you paid. Here is the rest, in plain English."
      summary={[
        "Your diagnosis answers and reports are stored in a Postgres database (Neon, US East) for as long as your account exists; nightly backups in Cloudflare R2 are deleted after 30 days.",
        "Sign-in is by email code through Clerk. No password. Payments are by Stripe; we never see card numbers.",
        <>
          Analytics is FlowGlance, only if you accept it. With deep capture on, it records what you type into forms,
          images you upload, and your signed-in email — not just page views.
        </>,
        "Five cookies in total: Clerk session, Stripe, ld_anon, ld_consent, FlowGlance. The first three are essential.",
        <>
          Delete everything by emailing <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a>. We reply
          within 2 business days.
        </>,
        <>
          Not medical advice, and you must be 16 or older. See the <Link href="/terms">terms</Link>.
        </>,
      ]}
      sections={SECTIONS}
      related={[
        { href: "/terms", label: "Terms of service" },
        { href: "/refunds", label: "Refunds & cancellation" },
        { href: "/contact", label: "Contact" },
      ]}
    />
  );
}
