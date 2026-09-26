import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { PhysiquePictogram, StrengthPictogram } from "./graphics";

const TRACKS = [
  {
    id: "physique",
    zone: "Zone 01",
    label: "Physique",
    line: "The mirror stopped changing.",
    text: "You train, you eat, you show up. Your shape looks the way it did months ago.",
    cta: "Diagnose my physique",
    Pictogram: PhysiquePictogram,
  },
  {
    id: "strength",
    zone: "Zone 02",
    label: "Strength",
    line: "The bar stopped going up.",
    text: "Same weight, same grind. Your squat, bench or deadlift hasn’t moved in months.",
    cta: "Diagnose my strength",
    Pictogram: StrengthPictogram,
  },
] as const;

export function Tracks() {
  return (
    <section aria-labelledby="tracks-title">
      <SectionHeading
        id="tracks-title"
        eyebrow="Two tracks"
        title={
          <>
            Pick the plateau <em>you&rsquo;re</em> in.
          </>
        }
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {TRACKS.map(({ id, zone, label, line, text, cta, Pictogram }) => (
          <article key={id} className="slab slab-hover overflow-hidden flex flex-col">
            <div className="hazard h-2 w-full" aria-hidden="true" />
            <div className="p-5 sm:p-8 flex flex-col flex-1">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="slab-inset knurl grid place-items-center w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] shrink-0 text-ink">
                  <Pictogram className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px]" />
                </div>
                <div className="min-w-0 pt-1">
                  <div className="font-stencil uppercase text-sm tracking-[0.18em] text-signal">{zone}</div>
                  <h3 className="display display-caps text-[3rem] sm:text-[4.25rem] mt-1">{label}</h3>
                </div>
              </div>
              <p className="mt-6 text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-ink">{line}</p>
              <p className="mt-2 text-ink-2 leading-relaxed">{text}</p>
              <div className="mt-auto pt-7">
                <Link href="/diagnose" className="btn btn-ghost w-full sm:w-auto" prefetch>
                  {cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
