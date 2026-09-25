import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist on LiftDecode.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="slab p-6 sm:p-10 animate-rise">
          <div className="eyebrow mb-3">404 · Nothing here</div>
          <h1 className="display text-4xl sm:text-6xl">
            This page <em>doesn&rsquo;t</em> exist.
          </h1>
          <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-xl">
            The link may be old, or the address has a typo. Your answers and reports are safe — they live on your
            dashboard, not at this address.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="btn btn-ghost">
              Back to home
            </Link>
            <Link href="/diagnose" className="btn btn-primary">
              Start the diagnosis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
