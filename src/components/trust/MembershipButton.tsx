"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { track } from "@/components/Analytics";

const SIGN_IN_URL = "/sign-in?redirect_url=/pricing%3Fintent%3Dmembership";

/**
 * Membership CTA that works for anyone: signed-out visitors go to sign-in and
 * come back with ?intent=membership, which auto-opens Stripe Checkout once.
 * Must be rendered inside <Suspense> (useSearchParams) so /pricing stays static.
 */
export function MembershipButton({ className = "", label = "Become a member" }: { className?: string; label?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();
  const [busy, setBusy] = useState(false);
  const [already, setAlready] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoFired = useRef(false);

  async function checkout(auto: boolean) {
    setBusy(true); // instant feedback — before any network
    setError(null);
    track("paywall_click", { kind: "membership", source: "pricing", auto });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "membership" }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string; already?: boolean };
      if (res.status === 401) {
        router.push(SIGN_IN_URL);
        return;
      }
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not start checkout");
      // already a member: the server sends the account page instead of a second Checkout
      if (data.already) setAlready(true);
      window.location.assign(data.url);
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function onClick() {
    if (busy) return;
    if (!isLoaded) return;
    if (!isSignedIn) {
      setBusy(true);
      track("paywall_click", { kind: "membership", source: "pricing", signedIn: false });
      router.push(SIGN_IN_URL);
      return;
    }
    void checkout(false);
  }

  // Back from sign-in with intent=membership → open Checkout once, automatically.
  useEffect(() => {
    if (autoFired.current) return;
    if (!isLoaded || !isSignedIn) return;
    if (params.get("intent") !== "membership") return;
    // deferred a tick so the effect itself stays free of state updates
    const t = window.setTimeout(() => {
      if (autoFired.current) return;
      autoFired.current = true;
      void checkout(true);
    }, 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, params]);

  const text = already
    ? "You're already a member — opening your account…"
    : busy
      ? isSignedIn
        ? "Opening secure checkout…"
        : "Taking you to sign in…"
      : label;

  return (
    <div className={className}>
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={onClick}
        disabled={busy}
        aria-busy={busy}
        aria-disabled={!isLoaded}
      >
        {text}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-alert">
          {error}
        </p>
      )}
    </div>
  );
}
