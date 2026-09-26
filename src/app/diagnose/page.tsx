import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  title: "Start your diagnosis",
  description:
    "Tap through how you train, eat, sleep and recover. LiftDecode finds the bottleneck that stalled your progress and what to do about it.",
};

export default function DiagnosePage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <Quiz />
      </div>
    </div>
  );
}
