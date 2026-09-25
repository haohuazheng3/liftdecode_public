import type { Metadata } from "next";
import { BRAND } from "@/lib/env";
import { Hero, TwoDoors, Lenses, FindingExcerpt, HowItWorks, Pricing, FaqTeaser, FinalCta } from "@/components/marketing";

export const metadata: Metadata = {
  title: { absolute: `${BRAND} — Find out why your training stopped working` },
  description:
    "A diagnostic for lifters who stopped progressing. Answer 24–28 honest questions about how you train, eat, recover and measure. Get a report that names your bottleneck and what to change first.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-20 sm:space-y-28">
        <Hero />
        <TwoDoors />
        <Lenses />
        <FindingExcerpt />
        <HowItWorks />
        <Pricing />
        <FaqTeaser />
        <FinalCta />
      </div>
    </div>
  );
}
