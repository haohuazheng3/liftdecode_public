import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  title: "Start your diagnosis",
  description:
    "Answer honest questions about how you train, eat, recover and measure progress. We'll tell you why you're stuck.",
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
