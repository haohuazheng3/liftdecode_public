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
            Tap a number. <em>Mostly.</em>
          </>
        }
        intro="Most questions are a single tap on a 1–10 scale or one short pick. A handful ask for real numbers: height, weight, and rough protein and carbs, where “Not sure” counts as an answer."
      />
      <IntensityPreview />
    </section>
  );
}
