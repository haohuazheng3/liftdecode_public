"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    fw?: (...args: unknown[]) => void;
  }
}

const SITE = process.env.NEXT_PUBLIC_FLOWGLANCE_SITE;
export const CONSENT_COOKIE = "ld_consent";
/** Fired on window once the snippet has been injected, so identify() can run without a reload. */
const LOADED_EVENT = "ld:analytics-loaded";

export function readConsent(): "all" | "essential" | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)ld_consent=([^;]+)/);
  if (!m) return null;
  return m[1] === "essential" ? "essential" : "all";
}

/** Fire a FlowGlance business event (no-op when the snippet is not loaded). */
export function track(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.fw?.("event", name, props ?? {});
  } catch (e) {
    console.warn("[analytics] event failed", e);
  }
}

/**
 * Inject the FlowGlance snippet once. Called only after the visitor accepted
 * analytics: on later visits from <Analytics/>, on the spot from the cookie
 * banner's "Accept". With deep capture on this is strictly opt-in, as the
 * privacy policy says.
 */
export function loadFlowGlance(): void {
  if (!SITE || typeof document === "undefined") return;
  if (document.querySelector('script[data-site="' + SITE + '"]')) return;
  const s = document.createElement("script");
  s.defer = true;
  s.src = "https://flowglance.com/fw.js";
  s.setAttribute("data-site", SITE);
  document.head.appendChild(s);
  window.dispatchEvent(new Event(LOADED_EVENT));
}

/**
 * Loads FlowGlance for visitors who accepted it in the cookie banner (nothing
 * loads while the choice is still open or was "essential only"), and
 * identifies signed-in users so the owner's own traffic can be filtered out
 * of the numbers.
 */
export function Analytics() {
  const { user, isLoaded } = useUser();
  const [loads, setLoads] = useState(0);

  useEffect(() => {
    const onLoaded = () => setLoads((n) => n + 1);
    window.addEventListener(LOADED_EVENT, onLoaded);
    if (readConsent() === "all") loadFlowGlance();
    return () => window.removeEventListener(LOADED_EVENT, onLoaded);
  }, []);

  // re-runs when the banner's "Accept" injects the snippet mid-session (`loads`)
  useEffect(() => {
    if (!isLoaded || !user) return;
    const email = user.primaryEmailAddress?.emailAddress;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (window.fw) {
        try {
          window.fw("identify", { userRef: user.id, email });
        } catch (e) {
          console.warn("[analytics] identify failed", e);
        }
        clearInterval(timer);
      } else if (tries > 40) {
        clearInterval(timer);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [isLoaded, user, loads]);

  return null;
}
