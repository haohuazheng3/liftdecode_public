"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { track } from "@/components/Analytics";

/**
 * A link into the core product that records where the click came from (page + spot on the page),
 * so FlowGlance can answer "which SEO pages send people into the diagnosis". No query string is
 * added to the URL: /diagnose stays one canonical address.
 */
export function TrackedCta({
  href = "/diagnose",
  place,
  className,
  children,
  detail,
}: {
  href?: string;
  /** where on the page: "hero", "tool", "verdict", "entry", "end"… */
  place: string;
  className?: string;
  children: ReactNode;
  /** optional extra context, e.g. the tool result that was showing */
  detail?: string;
}) {
  const from = usePathname();
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("cta_click", { from, place, to: href, ...(detail ? { detail } : {}) })}
    >
      {children}
    </Link>
  );
}
