"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Overview", badge: null },
  { href: "/admin/errors", label: "Errors", badge: "errors" },
  { href: "/admin/orders", label: "Orders", badge: null },
  { href: "/admin/users", label: "Users", badge: null },
  { href: "/admin/assessments", label: "Assessments", badge: null },
  { href: "/admin/contact", label: "Contact", badge: "contact" },
  { href: "/admin/inbox", label: "Inbox", badge: null },
  { href: "/admin/events", label: "Events", badge: null },
] as const;

export interface AdminBadges {
  errors: number;
  contact: number;
}

export function AdminNav({ badges }: { badges: AdminBadges }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="slab px-2 py-2 mb-4 sm:mb-6">
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ITEMS.map((it) => {
          const active = it.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(it.href);
          const n = it.badge ? badges[it.badge] : 0;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 inline-flex items-center gap-2 min-h-11 px-3.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                active ? "bg-white/[0.08] text-ink" : "text-ink-2 hover:text-ink hover:bg-white/[0.05] active:bg-white/[0.08]"
              }`}
            >
              {it.label}
              {n > 0 && (
                <span className="font-mono text-[11px] leading-none px-1.5 py-1 rounded-full bg-alert/15 text-alert tabular-nums">
                  {n > 99 ? "99+" : n}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
