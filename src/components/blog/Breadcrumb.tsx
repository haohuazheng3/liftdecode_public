import Link from "next/link";
import { APP_URL } from "@/lib/env";
import { JsonLd } from "./JsonLd";

export type Crumb = { href: string; label: string };

/** Visible breadcrumb trail plus the matching BreadcrumbList JSON-LD. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${APP_URL}${c.href}`,
    })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb" className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ol className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-ink-4">
                    /
                  </span>
                )}
                {last ? (
                  <span aria-current="page" className="text-ink-2">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="py-2 hover:text-ink transition-colors">
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={data} />
    </>
  );
}
