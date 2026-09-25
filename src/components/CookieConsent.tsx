"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { loadFlowGlance, readConsent } from "./Analytics";

function setConsent(value: "all" | "essential") {
  const expires = new Date(Date.now() + 180 * 24 * 3600 * 1000).toUTCString();
  document.cookie = `ld_consent=${value}; path=/; expires=${expires}; SameSite=Lax; Secure`;
}

// The consent cookie is browser state. Reading it through useSyncExternalStore keeps
// the server render and the hydration render identical (banner closed), then the
// client re-renders with the real value — no setState-in-effect needed.
const subscribe = () => () => {};
const needsChoiceInBrowser = () => readConsent() === null;
const needsChoiceOnServer = () => false;

export function CookieConsent() {
  const needsChoice = useSyncExternalStore(subscribe, needsChoiceInBrowser, needsChoiceOnServer);
  const [dismissed, setDismissed] = useState(false);

  if (!needsChoice || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie choices"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md animate-rise no-print"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="slab p-4 sm:p-5">
        <p className="text-sm text-ink-2 leading-relaxed">
          We use cookies for sign-in and payments (essential), and FlowGlance analytics to see how the diagnostic is
          used — including text you type into forms. Details in our{" "}
          <Link href="/privacy" className="text-signal underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm flex-1"
            onClick={() => {
              setConsent("all");
              setDismissed(true);
              loadFlowGlance(); // opt-in: the snippet starts now, not before
            }}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm flex-1"
            onClick={() => {
              // nothing was loaded while the choice was open, so there is nothing to stop
              setConsent("essential");
              setDismissed(true);
            }}
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}
