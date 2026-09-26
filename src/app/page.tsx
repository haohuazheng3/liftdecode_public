import type { Metadata } from "next";
import { BRAND } from "@/lib/env";
import {
  Hero,
  StallTicker,
  Tracks,
  QuizFeel,
  WhatWeCheck,
  FindingExcerpt,
  HowItWorks,
  Pricing,
  FaqTeaser,
  FinalCta,
} from "@/components/marketing";

const DESCRIPTION =
  "Find the real reason your training stopped working — and what to change first. A diagnostic for lifters that reads your training, effort, food, sleep and recovery, then names your bottleneck.";

export const metadata: Metadata = {
  title: { absolute: `${BRAND} — Find out why your training stopped working` },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
};

// Static marketing page: no cookies, no headers — cached at the CDN.
export default function HomePage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-20 sm:space-y-28">
        <div className="space-y-3 sm:space-y-4">
          <Hero />
          <StallTicker />
        </div>
        <Tracks />
        <QuizFeel />
        <WhatWeCheck />
        <FindingExcerpt />
        <HowItWorks />
        <Pricing />
        <FaqTeaser />
        <FinalCta />
      </div>
    </div>
  );
}
