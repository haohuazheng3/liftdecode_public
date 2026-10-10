import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/trust/JsonLd";
import { PageHero } from "@/components/trust/PageHero";

export const metadata: Metadata = {
  alternates: { canonical: "/how-it-works" },
  title: "How it works",
  description:
    "Honest answers on how you train, eat, sleep and live, rules that rank your bottlenecks, and a report on what to change and what to stop worrying about.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How a LiftDecode diagnosis works",
  description:
    "Answer quick, honest questions about how you train, eat, sleep, recover and live between sessions; the engine cross-references them into ranked bottlenecks and clearances; the report tells you what to change over the next four weeks.",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "5" },
  step: [
    {
      "@type": "HowToStep",
      name: "Answer the questions",
      text: "Pick your track (physique or strength), then answer quick questions about your build, your training week, effort, recovery, food, sleep, consistency and life load. Most are one tap on a 1-10 scale or a short choice; a few take a real number, such as your weight or grams of protein. Answer what you actually do, not what you plan to do.",
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
      text: "Your problems are named free, each with the answers behind it, and ten parts of your set-up are scored. Paying unlocks the written analysis: why each problem is happening in your case, the fix in your numbers, training-dose, fuel and recovery audits, a 4-week plan and the sources behind it.",
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
    <section id={id} className="slab p-6 sm:p-10 scroll-mt-4 animate-rise">
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
  { title: "Verdict and first move", text: "What is holding you back, in one sentence, and the single change to make this week." },
  { title: "The chain", text: "How your problems feed each other, from the root cause to the stall you feel, so you fix causes, not symptoms." },
  { title: "Your scorecard", text: "Ten parts of your set-up scored 0–100 from your answers, each with the lever that moves it." },
  {
    title: "Each problem, in your case",
    text: "Why it is happening to you, what it is costing you, and the fix in your numbers, with the answers that triggered it quoted back.",
  },
  { title: "Training-dose audit", text: "Every muscle group's sessions and time turned into hard sets a week, against what grows muscle." },
  { title: "Fuel audit", text: "Protein and carbs per kilo, meal timing, sweat and minerals, and what your weight trend says about your goal." },
  { title: "Recovery and conditioning", text: "Sleep, stress and set-to-set recovery, and what cardio does and does not do for growth." },
  { title: "4-week plan", text: "Week-by-week actions with check-offs, plus the numbers to track and what to leave alone." },
  { title: "Sources", text: "Every research claim links to the study behind it, from an evidence base we checked entry by entry." },
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

        <Stage id="answer" number="1" eyebrow="Stage one · your answers" title={<>Light to answer. Honest by <em>design</em>.</>}>
          <div className="prose-ld mt-5">
            <p>
              The first question picks your track — <strong>physique</strong> (you want to look different) or{" "}
              <strong>strength</strong> (you want the bar to move) — and the questions adapt. From there they cover
              the things that actually decide progress: your build and your training week (sessions and time per
              session for each muscle group), how you train and progress, how hard your sets really end, how your programme is built,
              how you sleep and recover, what you eat, and how much the rest of your life is asking of you.
            </p>
            <p>
              Answering is meant to feel light: mostly one tap per question, either a point on a 1–10 scale or one of
              a few short choices. The handful of real numbers — height, weight, age, grams of protein and carbs — are
              there because the report reads everything else against them; if you don&rsquo;t track your food, &ldquo;not
              sure&rdquo; is an honest answer and the report works with it. Answer for a normal recent week, not the
              version of yourself you would like to be; a diagnosis of that lifter is a diagnosis of nobody.
            </p>
            <p>
              No question is a trap and none is filler. Each one exists because at least one finding rule depends on
              it.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["What it reads", "Your training, effort, food, sleep, recovery and life load right now — not intentions or knowledge."],
              ["What it does not ask", "Your name, your lifts, or anything no rule uses. Every question feeds at least one finding."],
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
                <span className="text-clear shrink-0">✓</span>
                The rules decide the findings. After you pay, an AI model (Anthropic&rsquo;s Claude) writes them up for
                your case from your answers, citing only a verified evidence base: it explains what the rules found, it
                does not replace them.
              </li>
              <li className="flex gap-3">
                <span className="text-alert shrink-0">✕</span>
                Not a quiz that maps one answer to one canned paragraph, and no model runs before you pay.
              </li>
            </ul>
          </div>
        </Stage>

        <Stage id="report" number="3" eyebrow="Stage three · the report" title={<>Everything the <em>report</em> contains.</>}>
          <div className="prose-ld mt-5">
            <p>
              Your result page names every problem the engine found, each with the answers behind it, and scores ten
              parts of your set-up, before you pay anything. If it does not describe you, walk away. If it does, the
              report explains it, written for your case:
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

        <section id="membership" className="slab p-6 sm:p-10 scroll-mt-4 animate-rise border-signal/30">
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
