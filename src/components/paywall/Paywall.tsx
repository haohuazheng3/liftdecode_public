"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/components/Analytics";

type Kind = "membership" | "report";

export function Paywall({
  assessmentId,
  signedIn,
  returnTo,
  compact = false,
}: {
  assessmentId?: string;
  signedIn: boolean;
  returnTo: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<Kind | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(kind: Kind) {
    if (busy) return;
    setBusy(kind); // instant feedback — before any network
    setError(null);
    track("paywall_click", { kind, assessmentId, signedIn });
    if (!signedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(`${returnTo}${returnTo.includes("?") ? "&" : "?"}intent=${kind}`)}`);
      return;
    }
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, assessmentId }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.status === 401) {
        router.push(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
        return;
      }
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not start checkout");
      window.location.assign(data.url);
    } catch (e) {
      setBusy(null);
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div className={compact ? "" : "space-y-3"}>
      {/* 1 — membership first */}
      <div className="slab-inset p-5 border-signal/30 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-signal/10 blur-2xl" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="tag tag-signal mb-2">Most complete</div>
            <h3 className="text-lg font-semibold">LiftDecode Membership</h3>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              This report, plus unlimited re-diagnoses, the plateau tracker, report comparison and the full fix
              library.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-semibold tracking-tight">$15</div>
            <div className="text-xs text-ink-3">per month</div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary w-full mt-4"
          onClick={() => go("membership")}
          disabled={busy !== null}
          aria-busy={busy === "membership"}
        >
          {busy === "membership" ? (signedIn ? "Opening secure checkout…" : "Taking you to sign in…") : "Become a member"}
        </button>
        <p className="mt-2 text-[11px] text-ink-3 text-center">Cancel any time from your account. No lock-in.</p>
      </div>

      {/* 2 — single report */}
      <div className="slab-inset p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Just this report</h3>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              The full diagnosis and your 4-week plan for this set of answers. Yours to keep.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-semibold tracking-tight">$5</div>
            <div className="text-xs text-ink-3">one time</div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-ghost w-full mt-4"
          onClick={() => go("report")}
          disabled={busy !== null || !assessmentId}
          aria-busy={busy === "report"}
        >
          {busy === "report" ? (signedIn ? "Opening secure checkout…" : "Taking you to sign in…") : "Unlock this report — $5"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-alert">
          {error}
        </p>
      )}
      <p className="text-[11px] text-ink-3 text-center leading-relaxed">
        {signedIn ? "Secure checkout by Stripe." : "Sign in with your email — no password, just a code."}{" "}
        <a href="/refunds" className="underline underline-offset-2 hover:text-ink-2">
          Refund policy
        </a>
      </p>
    </div>
  );
}
