"use client";

import { useEffect } from "react";
import Link from "next/link";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function reportError(error: GlobalErrorProps["error"]) {
  try {
    const body = JSON.stringify({
      name: error.name || "Error",
      message: error.message || "Unknown error",
      stack: error.stack,
      route: location.pathname,
      meta: { digest: error.digest ?? null, boundary: "app/global-error", ua: navigator.userAgent },
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

// This boundary replaces the root layout, so nothing from globals.css is guaranteed.
// Everything below is inline and self-contained.
const styles = {
  body: {
    margin: 0,
    minHeight: "100vh",
    background: "#08080b",
    color: "#f3f2ee",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
    WebkitFontSmoothing: "antialiased",
  },
  wrap: { padding: "40px 12px", maxWidth: 760, margin: "0 auto" },
  slab: {
    background: "#121217",
    border: "1px solid rgba(255,255,255,0.075)",
    borderRadius: 24,
    padding: "32px 24px",
    boxShadow: "0 40px 90px -40px rgba(0,0,0,0.9)",
  },
  eyebrow: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11.5,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#8a8990",
    marginBottom: 12,
  },
  h1: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: 400,
    fontSize: "clamp(2.2rem, 7vw, 3.6rem)",
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  em: { fontStyle: "italic", color: "#ffd58a" },
  p: { marginTop: 16, color: "#b1b0ab", fontSize: 17, lineHeight: 1.6, maxWidth: 560 },
  row: { display: "flex", flexWrap: "wrap" as const, gap: 12, marginTop: 28 },
  btnBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "14px 22px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 15,
    lineHeight: 1,
    cursor: "pointer",
    textDecoration: "none",
    border: "1px solid transparent",
  },
  primary: { background: "#f5b544", color: "#14100a" },
  ghost: { background: "rgba(255,255,255,0.04)", color: "#f3f2ee", borderColor: "rgba(255,255,255,0.14)" },
  ref: {
    marginTop: 24,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12,
    color: "#8a8990",
    wordBreak: "break-all" as const,
  },
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={styles.body}>
        <div style={styles.wrap}>
          <div style={styles.slab}>
            <div style={styles.eyebrow}>Something went wrong</div>
            <h1 style={styles.h1}>
              LiftDecode <em style={styles.em}>didn&rsquo;t</em> load.
            </h1>
            <p style={styles.p}>
              Not you — us. The error has been logged on our side. Trying again usually fixes it; if it keeps
              happening, your answers and reports are still safe on your account.
            </p>
            <div style={styles.row}>
              <button type="button" onClick={reset} style={{ ...styles.btnBase, ...styles.primary }}>
                Try again
              </button>
              <Link href="/" style={{ ...styles.btnBase, ...styles.ghost }}>
                Back to home
              </Link>
            </div>
            {error.digest && <p style={styles.ref}>Reference: {error.digest}</p>}
          </div>
        </div>
      </body>
    </html>
  );
}
