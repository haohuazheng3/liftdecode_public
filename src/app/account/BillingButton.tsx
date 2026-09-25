"use client";

import { useState } from "react";

export function BillingButton({ label = "Manage billing" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function open() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not open billing");
      window.location.assign(data.url);
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Could not open billing");
    }
  }
  return (
    <div>
      <button type="button" className="btn btn-ghost" onClick={open} disabled={busy} aria-busy={busy}>
        {busy ? "Opening Stripe…" : label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-alert">
          {error}
        </p>
      )}
    </div>
  );
}
