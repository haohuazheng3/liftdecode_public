"use client";

import { useEffect, useState } from "react";

/**
 * Phones only: the offer sits below the ranked problems, so a slim bar keeps it one tap away.
 * It hides while the offer itself (#unlock) is on screen.
 */
export function UnlockBar({ problems }: { problems: number }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const target = document.getElementById("unlock");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.15 });
    io.observe(target);
    return () => io.disconnect();
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-transform duration-200 sm:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <a href="#unlock" className="slab flex items-center justify-between gap-3 !rounded-2xl px-4 py-3 shadow-[var(--shadow-signal)]">
        <span className="min-w-0 truncate text-sm font-semibold text-ink">
          {problems > 0 ? `${problems} ${problems === 1 ? "problem" : "problems"}: see why, and the fix` : "See what to change"}
        </span>
        <span className="btn btn-primary btn-sm shrink-0">Unlock</span>
      </a>
    </div>
  );
}
