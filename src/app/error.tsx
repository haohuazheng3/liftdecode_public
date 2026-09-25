"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function reportError(error: ErrorPageProps["error"]) {
  try {
    const body = JSON.stringify({
      name: error.name || "Error",
      message: error.message || "Unknown error",
      stack: error.stack,
      route: location.pathname,
      meta: { digest: error.digest ?? null, boundary: "app/error", ua: navigator.userAgent },
    });
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/errors", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/errors", {
        method: "POST",
        body,
        headers: { "content-type": "application/json" },
        keepalive: true,
      }).catch((e) => console.warn("[errors] report failed", e));
    }
  } catch (e) {
    console.warn("[errors] report failed", e);
  }
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="slab p-6 sm:p-10 animate-rise">
          <div className="eyebrow mb-3">Something went wrong</div>
          <h1 className="display text-4xl sm:text-6xl">
            That page <em>didn&rsquo;t</em> load.
          </h1>
          <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-xl">
            Not you — us. The error has been logged on our side. Trying again usually fixes it; if it keeps
            happening, your answers and reports are still safe on your dashboard.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={reset} className="btn btn-primary">
              Try again
            </button>
            <Link href="/" className="btn btn-ghost">
              Back to home
            </Link>
          </div>
          {error.digest && (
            <p className="mt-6 font-mono text-xs text-ink-3 break-all">Reference: {error.digest}</p>
          )}
        </div>
      </div>
    </div>
  );
}
