import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  alternates: { canonical: "/diagnose" },
  title: "Start your diagnosis",
  description:
    "Your build, your week, how you train, eat, sleep and recover. LiftDecode finds the bottleneck that stalled your progress and what to do about it.",
};

export default function DiagnosePage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Server-rendered so the page has a heading before the quiz hydrates (the quiz reads localStorage). */}
        <h1 className="eyebrow mb-3 px-1">LiftDecode diagnosis · find what stalled your progress</h1>
        <Quiz />
        {/* Server-rendered too, so crawlers and readers without JavaScript learn what the diagnosis does. */}
        <p className="mt-4 px-1 max-w-xl text-sm leading-relaxed text-ink-3">
          LiftDecode reads your build, your training week and how you eat, sleep and recover, then names what is most
          likely holding your progress back. No account is needed to answer, and you see what was found before you pay
          anything.
        </p>
      </div>
    </div>
  );
}
