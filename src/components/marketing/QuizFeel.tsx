import { SectionHeading } from "./SectionHeading";
import { IntensityPreview } from "./IntensityPreview";

export function QuizFeel() {
  return (
    <section aria-labelledby="feel-title" className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <SectionHeading
        id="feel-title"
        eyebrow="How it feels"
        title={
          <>
            Tap a number. <em>That&rsquo;s it.</em>
          </>
        }
        intro="No weights, macros or measurements to dig up. Most questions are a single tap on a 1–10 scale; the rest are three or four short picks."
      />
      <IntensityPreview />
    </section>
  );
}
