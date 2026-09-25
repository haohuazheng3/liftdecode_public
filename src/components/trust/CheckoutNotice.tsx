"use client";

import { useSearchParams } from "next/navigation";

/** Shows a quiet note when Stripe sends the visitor back with ?canceled=1. Render inside <Suspense>. */
export function CheckoutNotice() {
  const params = useSearchParams();
  if (params.get("canceled") !== "1") return null;
  return (
    <p role="status" className="mt-4 text-sm text-ink-3">
      Checkout was cancelled — nothing was charged. Your account and any diagnosis you ran are exactly as you left them.
    </p>
  );
}
