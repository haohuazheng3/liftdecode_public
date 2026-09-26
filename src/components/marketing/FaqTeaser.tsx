import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const FAQ = [
  {
    q: "Do I need to know my numbers?",
    a: "No. You don’t need your lifts, macros or bodyweight to hand. The questions ask how your training, food, sleep and life actually go — not for data.",
  },
  {
    q: "Is this medical advice?",
    a: "No. LiftDecode is a training diagnostic. It does not diagnose or treat any condition. If you have pain, an injury or a health concern, see a qualified professional.",
  },
  {
    q: "What if nothing is wrong?",
    a: "Then the report says so. Clearances are as real as findings: if your answers describe a well-run programme, you get what is fine, a note on expectations, and a nudge to re-check in four weeks.",
  },
  {
    q: "Can I redo it?",
    a: "Yes. Anyone can start a new diagnosis at any time. Members re-diagnose as often as they like and compare reports to see which bottlenecks cleared.",
  },
];

export function FaqTeaser() {
  return (
    <section aria-labelledby="faq-title">
      <SectionHeading
        id="faq-title"
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
            <dt className="font-semibold text-ink text-[1.02rem]">{f.q}</dt>
            <dd className="mt-2 text-sm sm:text-[0.95rem] text-ink-2 leading-relaxed">{f.a}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <Link href="/faq" className="btn btn-quiet -ml-2">
          All questions, answered <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
