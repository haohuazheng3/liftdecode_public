"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { LogoLink } from "./Logo";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/library", label: "Library" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const inQuiz = pathname?.startsWith("/diagnose") && !pathname.includes("/result");

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4 no-print">
      <div className="mx-auto max-w-6xl">
        <div className="slab !rounded-[22px] sm:!rounded-[26px] px-3 py-2 sm:px-4 backdrop-blur-md bg-slab/80">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 shrink">
              <LogoLink className="whitespace-nowrap" />
            </div>

            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {NAV.map((n) => {
                const active = pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      active ? "text-ink bg-white/[0.06]" : "text-ink-2 hover:text-ink hover:bg-white/[0.05]"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <Show when="signed-in">
                <Link href="/dashboard" className="hidden sm:inline-flex btn btn-quiet btn-sm">
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      // 44px trigger around a 36px avatar: the tap target is the button, not the picture
                      userButtonTrigger: "w-11 h-11 grid place-items-center rounded-full",
                      userButtonAvatarBox: "w-9 h-9 ring-1 ring-white/10",
                    },
                  }}
                />
              </Show>
              <Show when="signed-out">
                <Link href="/sign-in" className="hidden sm:inline-flex btn btn-quiet btn-sm">
                  Sign in
                </Link>
              </Show>
              {!inQuiz && (
                <>
                  {/* Below `sm` the row cannot hold the full label next to the avatar and the menu button:
                      signed-out visitors get a short CTA; signed-in users have it in the menu and on the dashboard. */}
                  <Show when="signed-out">
                    <Link href="/diagnose" className="sm:hidden btn btn-primary btn-sm !px-3.5" prefetch>
                      Start
                    </Link>
                  </Show>
                  <Link href="/diagnose" className="hidden sm:inline-flex btn btn-primary btn-sm" prefetch>
                    Start diagnosis
                  </Link>
                </>
              )}
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="md:hidden grid place-items-center w-11 h-11 rounded-full hover:bg-white/[0.06] active:bg-white/[0.08] text-ink-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  {open ? (
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  ) : (
                    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {open && (
            <nav className="md:hidden mt-2 pb-2 border-t border-line pt-2 animate-rise" aria-label="Mobile">
              {!inQuiz && (
                <Link
                  href="/diagnose"
                  onClick={() => setOpen(false)}
                  className="sm:hidden btn btn-primary w-full mb-2"
                  prefetch
                >
                  Start diagnosis
                </Link>
              )}
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-2xl text-ink-2 hover:text-ink hover:bg-white/[0.05]"
                >
                  {n.label}
                </Link>
              ))}
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-2xl text-ink-2 hover:text-ink hover:bg-white/[0.05]"
                >
                  Dashboard
                </Link>
              </Show>
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-2xl text-ink-2 hover:text-ink hover:bg-white/[0.05]"
                >
                  Sign in
                </Link>
              </Show>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
