import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { FitIcon, type IconName } from "./graphics";

const CHECKS: { icon: IconName; title: string; text: string }[] = [
  { icon: "effort", title: "Effort", text: "How close your sets really get to failure." },
  { icon: "progression", title: "Progression", text: "Whether the load or reps actually climb." },
  { icon: "volume", title: "Volume", text: "Too few hard sets — or too many to recover from." },
  { icon: "programme", title: "Programme", text: "Structure, exercise choice, programme hopping." },
  { icon: "technique", title: "Technique", text: "Range and execution that leak the stimulus." },
  { icon: "sleep", title: "Sleep", text: "Hours and quality, night after night." },
  { icon: "food", title: "Food", text: "Protein, calories, and which way they point." },
  { icon: "recovery", title: "Recovery", text: "Fatigue that never gets cleared." },
  { icon: "consistency", title: "Consistency", text: "Missed weeks and fresh starts." },
  { icon: "stress", title: "Stress", text: "The life load you carry into the gym." },
  { icon: "cardio", title: "Cardio & habits", text: "Cardio, steps, drinks — the rest of your day." },
  { icon: "timeline", title: "Timeline", text: "Whether your expectations fit your stage." },
];

export function WhatWeCheck() {
  return (
    <section aria-labelledby="checks-title">
      <SectionHeading
        id="checks-title"
        eyebrow="What it reads"
        title={
          <>
            Every lever that decides <em>progress</em>.
          </>
        }
        intro="Your answers are cross-checked across all of these at once. The report ranks the ones holding you back and clears the ones that aren’t."
      />
      <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {CHECKS.map((c) => (
          <li key={c.title} className="slab p-4 sm:p-5">
            <span className="grid place-items-center w-11 h-11 rounded-[14px] bg-signal/10 text-signal border border-signal/20">
              <FitIcon name={c.icon} />
            </span>
            <h3 className="mt-3.5 display display-caps text-[1.55rem] sm:text-[1.75rem] leading-none">{c.title}</h3>
            <p className="mt-1.5 text-[13px] sm:text-sm text-ink-2 leading-snug">{c.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Link href="/how-it-works" className="btn btn-quiet -ml-2">
          How the engine ranks them <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
