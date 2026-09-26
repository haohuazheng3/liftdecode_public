import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/trust/JsonLd";
import { PageHero } from "@/components/trust/PageHero";

export const metadata: Metadata = {
  title: "About",
  description:
    "LiftDecode is a diagnostic for lifters who stopped progressing: a rule-based engine that turns honest answers into ranked bottlenecks, clearances and a 4-week plan. What it is, how the method works, and what it is not.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://liftdecode.com/#organization",
  name: "LiftDecode",
  url: "https://liftdecode.com",
  logo: "https://liftdecode.com/icon.svg",
  description:
    "A diagnostic for lifters who stopped progressing. Honest questions about training, effort, recovery and nutrition, cross-referenced into ranked bottlenecks and a 4-week plan.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@liftdecode.com",
    contactType: "customer support",
    availableLanguage: ["English"],
  },
  sameAs: [],
};

export default function AboutPage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-4xl space-y-4">
        <PageHero
          eyebrow="About LiftDecode"
          title={
            <>
              Built for the lifter who does everything &ldquo;right&rdquo; and still <em>stalls</em>.
            </>
          }
          lede="LiftDecode is a diagnostic, not a programme. It exists because the usual answer to a plateau — another programme, another supplement, another video — skips the only step that matters: finding out what is actually wrong."
        />

        <section className="slab p-6 sm:p-10 animate-rise" style={{ animationDelay: "60ms" }}>
          <div className="eyebrow mb-4">What it is</div>
          <div className="prose-ld">
            <p>
              LiftDecode is a web-based diagnostic for people who train with weights and have stopped making progress —
              whether progress means a changing physique or a heavier bar. You answer quick, honest questions about how
              you actually train, eat, sleep, recover and live — mostly one tap each. A rule engine cross-references those answers
              into a ranked list of bottlenecks, a list of things that are <strong>not</strong> your problem, and a
              4-week plan that turns the top findings into sessions.
            </p>
            <p>
              LiftDecode is operated as a brand, not as a person. Everything on this site — the questions, the rules,
              the finding content, the plans — is written, reviewed and revised by LiftDecode as an organisation, and
              it is the organisation that stands behind it. We do not put a face on the work or invent a résumé for it.
              The work should stand on whether it describes you accurately and whether the fix moves your numbers.
            </p>
          </div>
        </section>

        <section className="slab p-6 sm:p-10 animate-rise" style={{ animationDelay: "120ms" }}>
          <div className="eyebrow mb-4">The method</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Behaviour, not self-assessment",
                "Every question asks about your current state — training, effort, food, sleep, life load — with short answers and 1–10 scales. No numbers to look up, nothing to measure.",
              ],
              [
                "Rules you can trace",
                "Each finding is triggered by specific answers, and the report quotes those answers back to you. Nothing comes out of a black box.",
              ],
              [
                "Ranking and suppression",
                "Findings are ordered by how strongly your answers support them, and a strong cause suppresses the weaker ones it explains. You get a short list, in order.",
              ],
              [
                "Clearances are content too",
                "Ruling things out is half the value. Most stalled lifters are busy fixing something their answers already rule out.",
              ],
              [
                "Evidence-informed, plainly written",
                "Mechanisms are grounded in the exercise-science literature and coaching practice, then written the way a good coach would say them.",
              ],
              [
                "Stable reports",
                "A report is stored with the engine version that produced it. When we improve the rules, your old report stays as it was; run a new diagnosis to see the difference.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="slab-inset p-5">
                <div className="text-ink font-medium">{t}</div>
                <p className="text-sm text-ink-2 leading-relaxed mt-1.5">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="slab p-6 sm:p-10 animate-rise" style={{ animationDelay: "180ms" }}>
          <div className="eyebrow mb-4">What it is not</div>
          <div className="prose-ld">
            <ul>
              <li>
                <strong>Not medical advice.</strong> LiftDecode is training and nutrition education. It does not
                diagnose, treat or manage any medical condition, injury or eating disorder. If you have pain, an injury,
                a diagnosed condition, or you are pregnant, talk to a qualified professional before changing your
                training or diet.
              </li>
              <li>
                <strong>Not a coach.</strong> Nobody reviews your answers individually and nobody watches your form.
                The engine is only as honest as your answers, and the report only works if you run the plan.
              </li>
              <li>
                <strong>Not a programme generator.</strong> The 4-week plan is a set of directives to apply to the
                training you already do. It will not write you a new split, and it should not need to.
              </li>
              <li>
                <strong>Not for everyone.</strong> You must be 16 or older. Beginners in their first few months usually
                do not have a bottleneck yet; they have a start.
              </li>
            </ul>
          </div>
        </section>

        <section className="slab p-6 sm:p-10 animate-rise" style={{ animationDelay: "240ms" }}>
          <div className="eyebrow mb-4">How LiftDecode is run</div>
          <div className="prose-ld">
            <p>
              The site is operated by LiftDecode. Sign-in uses an email code (no passwords to leak), payments run through
              Stripe (we never see card numbers), and your answers and reports live in a Postgres database hosted in the
              US East region. We use one analytics tool, FlowGlance, to understand how the diagnostic is used; the{" "}
              <Link href="/privacy">privacy policy</Link> says exactly what it records and how to decline it. Support is
              by email at <a href="mailto:contact@liftdecode.com">contact@liftdecode.com</a>, answered within 2 business
              days.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/diagnose" className="btn btn-primary btn-lg">
              Start the diagnosis
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost btn-lg">
              Read how it works
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
