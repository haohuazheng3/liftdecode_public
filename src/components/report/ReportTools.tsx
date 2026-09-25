"use client";

import { useEffect } from "react";
import { track } from "@/components/Analytics";

export function PrintButton() {
  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>
      Save as PDF
    </button>
  );
}

/** Fires purchase + unlock events once, right after a successful checkout redirect. */
export function UnlockPing({
  assessmentId,
  amount,
  currency,
  item,
  orderId,
}: {
  assessmentId: string;
  amount: number | null;
  currency: string | null;
  item: string | null;
  orderId: string | null;
}) {
  useEffect(() => {
    const key = `ld_unlock_${assessmentId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
    let tries = 0;
    const t = setInterval(() => {
      tries += 1;
      if (window.fw) {
        if (amount !== null && item && orderId) {
          window.fw("event", "purchase", { amount: amount / 100, currency: currency ?? "usd", item, id: orderId });
        }
        window.fw("event", "unlock", { assessmentId });
        clearInterval(t);
      } else if (tries > 40) clearInterval(t);
    }, 250);
    track("report_view", { assessmentId, fresh: true });
    return () => clearInterval(t);
  }, [assessmentId, amount, currency, item, orderId]);
  return null;
}
