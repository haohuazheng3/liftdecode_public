"use client";

import { useEffect } from "react";

const seen = new Set<string>();

function report(payload: { name: string; message: string; stack?: string; route: string; meta?: Record<string, unknown> }) {
  const key = `${payload.name}|${payload.message.slice(0, 80)}`;
  if (seen.has(key)) return;
  seen.add(key);
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/errors", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/errors", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(
        (e) => console.warn("[errors] report failed", e),
      );
    }
  } catch (e) {
    console.warn("[errors] report failed", e);
  }
}

/** Sends uncaught browser errors and unhandled rejections to the error inbox. */
export function ClientErrorReporter() {
  useEffect(() => {
    const onError = (ev: ErrorEvent) => {
      const err = ev.error instanceof Error ? ev.error : null;
      report({
        name: err?.name ?? "Error",
        message: err?.message ?? ev.message ?? "Unknown error",
        stack: err?.stack ?? `${ev.filename}:${ev.lineno}:${ev.colno}`,
        route: location.pathname,
        meta: { ua: navigator.userAgent },
      });
    };
    const onRejection = (ev: PromiseRejectionEvent) => {
      const r = ev.reason;
      const err = r instanceof Error ? r : null;
      report({
        name: err?.name ?? "UnhandledRejection",
        message: err?.message ?? (typeof r === "string" ? r : JSON.stringify(r ?? null)).slice(0, 500),
        stack: err?.stack,
        route: location.pathname,
        meta: { ua: navigator.userAgent },
      });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
