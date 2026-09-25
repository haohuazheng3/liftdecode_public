import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const DOORS = [
  {
    id: "physique",
    label: "Physique",
    title: "The mirror stopped changing.",
    intro: "You lift, you eat, you show up. Muscle and shape look the same as three months ago.",
    symptoms: [
      "Arms, shoulders or legs measure the same as last quarter",
      "Scale drifts but photos don’t",
      "You keep swapping programmes hoping one finally sticks",
    ],
    cta: "Diagnose my physique",
  },
  {
    id: "strength",
    label: "Strength",
    title: "The numbers are stuck.",
    intro: "Same weight, same reps, same grind. Your squat, bench or deadlift hasn’t moved in months.",
    symptoms: [
      "Your top set today is the one you hit in spring",
      "Every add-a-plate attempt turns into a missed rep",
      "Sessions feel hard but nothing carries over week to week",
    ],
    cta: "Diagnose my strength",
  },
] as const;

function Glyph({ kind }: { kind: "physique" | "strength" }) {
  // two small geometric marks: a taper for physique, a stacked plate for strength
  return kind === "physique" ? (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 22c3-6 3-10 8-16 5 6 5 10 8 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.5 22h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="9" width="4" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="20" y="9" width="4" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 14h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TwoDoors() {
  return (
    <section>
      <SectionHeading
        eyebrow="Two doors, one diagnosis"
        title={
          <>
            Pick the plateau <em>you</em> are in.
          </>
        }
        intro="The first question picks your track. Everything after it is built around that goal."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {DOORS.map((d) => (
          <article key={d.id} className="slab slab-hover p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="tag tag-signal">{d.label} track</span>
              <span className="text-ink-3">
                <Glyph kind={d.id} />
              </span>
            </div>
            <h3 className="display text-3xl sm:text-4xl">{d.title}</h3>
            <p className="mt-3 text-ink-2 leading-relaxed">{d.intro}</p>
            <ul className="mt-5 space-y-2.5">
              {d.symptoms.map((s) => (
                <li key={s} className="flex gap-3 text-[0.95rem] text-ink-2 leading-relaxed">
                  <span className="text-signal shrink-0" aria-hidden="true">
                    ›
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 pt-5 border-t border-line">
              <Link href="/diagnose" className="btn btn-ghost w-full sm:w-auto" prefetch>
                {d.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
