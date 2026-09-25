import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const FAQ = [
  {
    q: "Is this medical advice?",
    a: "No. LiftDecode is a training diagnostic: it reads how you train, eat, recover and measure, and explains where the stimulus is being lost. It does not diagnose or treat any condition. If you have pain, an injury or a health concern, see a qualified professional.",
  },
  {
    q: "How long does it take?",
    a: "About ten minutes. There are 24–28 questions depending on your track, every one of them multiple choice, and you can pause and come back. The report is ready the moment you finish.",
  },
  {
    q: "What if nothing is wrong?",
    a: "Then the report says so. Clearances are as real as findings: if your answers describe a well-run programme, you get a short list of what is fine, a note on expectations, and a suggestion to re-run in four weeks with fresh numbers.",
  },
  {
    q: "Can I redo it?",
    a: "Yes. Anyone can start a new diagnosis at any time. Members re-diagnose as often as they like and can compare reports side by side to see which bottlenecks cleared.",
  },
];

export function FaqTeaser() {
  return (
    <section>
      <SectionHeading
        eyebrow="Before you start"
        title={
          <>
            Fair <em>questions</em>.
          </>
        }
      />
      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        {FAQ.map((f) => (
          <div key={f.q} className="slab p-5 sm:p-6">
            <dt className="font-semibold text-ink">{f.q}</dt>
            <dd className="mt-2 text-sm sm:text-[0.95rem] text-ink-2 leading-relaxed">{f.a}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <Link href="/faq" className="btn btn-quiet -ml-2">
          All questions, answered →
        </Link>
      </div>
    </section>
  );
}
