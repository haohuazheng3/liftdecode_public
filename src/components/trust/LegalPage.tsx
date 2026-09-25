import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "./PageHero";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * Shell for privacy / terms / refunds: hero, plain-English summary box,
 * jump list, then one anchored slab per section. Static, no client JS.
 */
export function LegalPage({
  eyebrow,
  title,
  lede,
  lastUpdated,
  summary,
  sections,
  related,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  lastUpdated: string;
  summary: ReactNode[];
  sections: LegalSection[];
  related: { href: string; label: string }[];
}) {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <PageHero eyebrow={`${eyebrow} · Last updated: ${lastUpdated}`} title={title} lede={lede}>
          <div className="mt-6 slab-inset p-5">
            <div className="eyebrow mb-3">The short version</div>
            <ul className="space-y-2.5 [&_a]:text-signal [&_a]:underline [&_a]:underline-offset-2">
              {summary.map((s, i) => (
                <li key={i} className="flex gap-3 text-[0.95rem] text-ink-2 leading-relaxed">
                  <span className="text-signal shrink-0" aria-hidden="true">
                    ›
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </PageHero>

        <nav aria-label="Sections" className="slab p-5 sm:p-6 animate-rise" style={{ animationDelay: "60ms" }}>
          <div className="eyebrow mb-3">On this page</div>
          <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-3 py-2.5 text-sm text-ink-2 hover:text-signal transition-colors"
                >
                  <span className="font-mono text-xs text-ink-4 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="slab p-6 sm:p-8 scroll-mt-24 animate-rise"
            style={{ animationDelay: `${Math.min(300, 90 + i * 30)}ms` }}
          >
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{s.title}</h2>
            </div>
            <div className="prose-ld text-[0.98rem]">{s.body}</div>
          </section>
        ))}

        <div className="slab p-5 sm:p-6">
          <div className="eyebrow mb-3">Related</div>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="btn btn-ghost btn-sm">
                {r.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-3 leading-relaxed">
            Questions about this page? Email{" "}
            <a href="mailto:contact@liftdecode.com" className="underline underline-offset-2 hover:text-ink-2">
              contact@liftdecode.com
            </a>{" "}
            — we reply within 2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
