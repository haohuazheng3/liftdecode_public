import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/trust/JsonLd";
import { PageHero } from "@/components/trust/PageHero";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Twenty-odd uncomfortable questions, a rule engine that cross-references your answers into ranked bottlenecks, and a report that says what to change and what to stop worrying about.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How a LiftDecode diagnosis works",
  description:
    "Answer honest questions about how you train, eat, recover and measure progress; the engine cross-references them into ranked bottlenecks and clearances; the report tells you what to change over the next four weeks.",
  totalTime: "PT10M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "5" },
  step: [
    {
      "@type": "HowToStep",
      name: "Answer the questions",
      text: "Pick your track (physique or strength) and answer 24 to 28 questions about training, effort, progression, recovery, nutrition, consistency and how you measure progress. Answer what you actually do, not what you plan to do.",
      url: "https://liftdecode.com/how-it-works#answer",
    },
    {
      "@type": "HowToStep",
      name: "The engine cross-references your answers",
      text: "Each answer is matched against rules. Rules that fire add weight to a finding; findings that clear a threshold are ranked by score, weaker ones are suppressed by stronger causes, and clearances mark what is not your problem.",
      url: "https://liftdecode.com/how-it-works#engine",
    },
    {
      "@type": "HowToStep",
      name: "Read the report and run the 4-week plan",
      text: "Your primary bottleneck is shown free. The full report unlocks every finding with its mechanism, how it shows up, the fix, timeline, mistakes to avoid, what is not your problem, and a week-by-week plan.",
      url: "https://liftdecode.com/how-it-works#report",
    },
  ],
};

function Stage({
  id,
  number,
  eyebrow,
  title,
  children,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="slab p-6 sm:p-10 scroll-mt-24 animate-rise">
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-signal/15 text-signal font-mono text-sm">{number}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="display text-3xl sm:text-5xl">{title}</h2>
      {children}
    </section>
  );
}

const REPORT_PARTS: { title: string; text: string }[] = [
  { title: "Verdict", text: "One sentence per finding. What is wrong, in plain words, before any explanation." },
  {
    title: "What you told us",
    text: "The exact answers that triggered the finding, quoted back to you. You can check our reasoning against your own words.",
  },
  { title: "Mechanism", text: "Why this stalls progress — the physiology and the logic, evidence-informed, no hand-waving." },
  { title: "How it shows up", text: "The symptoms you will recognise from your own sessions, so you can tell whether we got it right." },
  { title: "The fix", text: "The protocol, in numbered steps. Specific numbers, specific changes, in an order that works." },
  { title: "Timeline", text: "What to expect and when — so you do not abandon a fix a week before it starts working." },
  { title: "Mistakes", text: "The wrong fixes people reach for with this exact problem, and why each one fails." },
  {
    title: "Not your problem",
    text: "Clearances: things you may have suspected that your answers rule out. Stop spending effort there.",
  },
  {
    title: "4-week plan",
    text: "Week-by-week directives built from your top three findings, with check-offs, so the report turns into sessions.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-4xl space-y-4">
        <PageHero
          eyebrow="How it works"
          title={
            <>
              Honest questions in. A ranked <em>diagnosis</em> out.
            </>
          }
          lede="Most stalled lifters are not missing information — they are missing the link between what they actually do and why it stops working. LiftDecode makes that link explicit in three stages."
        >
          <ol className="mt-6 flex flex-wrap gap-2">
            {[
              ["#answer", "1 · Answer"],
              ["#engine", "2 · Engine"],
              ["#report", "3 · Report"],
              ["#membership", "+ Membership"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="btn btn-ghost btn-sm">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </PageHero>

        <Stage id="answer" number="1" eyebrow="Stage one · about ten minutes" title={<>The questions are meant to be <em>uncomfortable</em>.</>}>
          <div className="prose-ld mt-5">
            <p>
              The first question picks your track — <strong>physique</strong> (you want to look different) or{" "}
              <strong>strength</strong> (you want the bar to move) — and the bank adapts. From there you answer 24 to
              28 questions across seven areas: how you measure progress, how you progress load and reps, how hard your
              sets really end, how much you do, how your programme is built, how you recover, and how you eat and live
              between sessions.
            </p>
            <p>
              Every option is a concrete behaviour, not a rating. Not &ldquo;how consistent are you, 1–5?&rdquo; but
              &ldquo;in the last eight weeks, how many planned sessions did you actually skip?&rdquo; with answers you
              can only pick by admitting what happened. That is deliberate. A diagnosis built on the version of yourself
              you would like to be is a diagnosis of nobody.
            </p>
            <p>
              Under most questions there is a line that says why we ask. Read it if you want; the point is that no
              question is a trap and none is filler. Each one exists because at least one finding rule depends on it.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["What it probes", "Behaviour over the last 8–12 weeks, not intentions or knowledge."],
              ["What it does not ask", "Your name, your weight, your history. Nothing that is not used by a rule."],
              ["If you are unsure", "Pick the option closest to a normal week. The engine weights, it does not punish."],
            ].map(([t, b]) => (
              <div key={t} className="slab-inset p-4">
                <div className="eyebrow mb-1.5">{t}</div>
                <p className="text-sm text-ink-2 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </Stage>

        <Stage id="engine" number="2" eyebrow="Stage two · a few seconds" title={<>The engine <em>cross-references</em>, it does not average.</>}>
          <div className="prose-ld mt-5">
            <p>
              Your answers are matched against a set of finding rules. A rule describes a bottleneck — say, sets ending
              too far from failure to drive growth — as a list of triggers: answer patterns that point at it, each with a
              weight. One answer can feed several findings; one finding usually needs several answers. When the summed
              weight clears the rule&rsquo;s threshold, the finding fires, and it carries with it the exact answers that
              made it fire.
            </p>
            <p>
              Then two things happen that a simple score sheet would not do. Findings are <strong>ranked</strong> by how
              strongly your answers support them, so the report leads with the thing most worth changing first. And
              weaker findings are <strong>suppressed</strong> by stronger causes: if your programme has no progression
              at all, we will not also lecture you about exercise order, because fixing the first makes the second
              irrelevant for now.
            </p>
            <p>
              Alongside findings, the engine checks <strong>clearances</strong> — answer patterns that rule something
              out. These become the &ldquo;not your problem&rdquo; section, and they matter as much as the findings: most
              stalled lifters are quietly fixing the wrong thing.
            </p>
          </div>
          <div className="mt-6 slab-inset p-5">
            <div className="eyebrow mb-3">What the engine is, and is not</div>
            <ul className="space-y-2.5 text-sm text-ink-2 leading-relaxed">
              <li className="flex gap-3">
                <span className="text-clear shrink-0">✓</span>
                Deterministic rules written and revised by LiftDecode. The same answers always give the same result, and
                every result can be traced to specific answers.
              </li>
              <li className="flex gap-3">
                <span className="text-clear shrink-0">✓</span>
                Versioned. A report is stored with the engine version that produced it and is never silently recomputed.
              </li>
              <li className="flex gap-3">
                <span className="text-alert shrink-0">✕</span>
                Not a language model guessing from your answers, and not a quiz that maps one answer to one canned
                paragraph.
              </li>
            </ul>
          </div>
        </Stage>

        <Stage id="report" number="3" eyebrow="Stage three · the report" title={<>Everything the <em>report</em> contains.</>}>
          <div className="prose-ld mt-5">
            <p>
              Your result page shows your primary bottleneck in full — verdict, summary and the answers behind it —
              before you pay anything. If it does not describe you, walk away. If it does, the full report opens the
              rest. Each finding is written to the same structure:
            </p>
          </div>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {REPORT_PARTS.map((p, i) => (
              <li key={p.title} className="slab-inset p-4 flex gap-3">
                <span className="font-mono text-xs text-ink-4 shrink-0 mt-1">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="text-ink font-medium">{p.title}</div>
                  <p className="text-sm text-ink-2 leading-relaxed mt-1">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-ink-3 leading-relaxed">
            A single report is $5 and is yours for as long as your account exists. It can be printed. Track-specific
            notes appear where the fix differs between physique and strength goals.
          </p>
        </Stage>

        <section id="membership" className="slab p-6 sm:p-10 scroll-mt-24 animate-rise border-signal/30">
          <span className="tag tag-signal mb-4">What membership adds</span>
          <h2 className="display text-3xl sm:text-5xl">The report tells you what to change. Membership tells you whether it <em>worked</em>.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              [
                "Unlimited re-diagnoses",
                "Training changes; so do bottlenecks. Re-run in four or eight weeks and see what cleared and what surfaced.",
              ],
              [
                "Plateau tracker",
                "Log lifts and measurements weekly. The point is not the graph — it is knowing, with numbers, whether the plan is moving anything.",
              ],
              [
                "Report comparison",
                "Two diagnoses side by side. Which findings disappeared, which persisted, which are new.",
              ],
              [
                "Fix library",
                "The full protocol for every bottleneck we can detect, not only the ones you were flagged for.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="slab-inset p-4">
                <div className="text-ink font-medium">{t}</div>
                <p className="text-sm text-ink-2 leading-relaxed mt-1">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/diagnose" className="btn btn-primary btn-lg">
              Start the diagnosis
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink-3 leading-relaxed">
            Training and nutrition education, not medical advice. If you have pain, an injury or a medical condition,
            see a qualified professional first.
          </p>
        </section>
      </div>
    </div>
  );
}
