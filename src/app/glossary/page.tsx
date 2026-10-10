import type { Metadata } from "next";
import Link from "next/link";
import { getAllTerms } from "@/lib/glossary";
import { extractFaq, faqSchema, readOne } from "@/lib/content";
import { GLOSSARY_HUB, TOOLS_HUB } from "@/lib/site-index";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { JsonLd } from "@/components/blog/JsonLd";
import { renderMarkdown } from "@/components/blog/MdxComponents";
import { APP_URL } from "@/lib/env";
import { EntryCard } from "@/components/content/EntryCards";

export const metadata: Metadata = {
  title: GLOSSARY_HUB.h1,
  description: GLOSSARY_HUB.description,
  alternates: { canonical: GLOSSARY_HUB.url },
  openGraph: { title: GLOSSARY_HUB.h1, description: GLOSSARY_HUB.description, url: `${APP_URL}${GLOSSARY_HUB.url}` },
};

export default async function GlossaryIndex() {
  const terms = getAllTerms();
  const body = readOne("hubs/glossary.md");
  const intro = body ? await renderMarkdown(body) : null;
  const faqLd = body ? faqSchema(extractFaq(body)) : null;
  const letters = [...new Set(terms.map((t) => t.term[0].toUpperCase()))];

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: GLOSSARY_HUB.h1,
            description: GLOSSARY_HUB.description,
            url: `${APP_URL}${GLOSSARY_HUB.url}`,
            hasDefinedTerm: terms.map((t) => ({
              "@type": "DefinedTerm",
              name: t.term,
              description: t.short,
              url: `${APP_URL}/glossary/${t.slug}`,
            })),
          }}
        />
        {faqLd && <JsonLd data={faqLd} />}
        <header className="slab p-6 sm:p-10 animate-rise">
          <div className="mb-4">
            <Breadcrumb items={[{ href: GLOSSARY_HUB.url, label: GLOSSARY_HUB.title }]} />
          </div>
          <h1 className="display text-4xl sm:text-6xl max-w-3xl">{GLOSSARY_HUB.h1}</h1>
          <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">{GLOSSARY_HUB.description}</p>
        </header>
        <div className="mt-4 animate-rise" style={{ animationDelay: "40ms" }}>
          <EntryCard />
        </div>

        {intro && (
          <section className="slab p-6 sm:p-10 mt-4 animate-rise" style={{ animationDelay: "60ms" }}>
            <div className="prose-ld max-w-3xl">{intro}</div>
          </section>
        )}

        <section className="mt-8" aria-labelledby="terms">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4 px-1">
            <h2 id="terms" className="eyebrow">
              Terms A–Z
            </h2>
            {letters.length > 1 && (
              <nav aria-label="Jump to letter" className="flex flex-wrap gap-1">
                {letters.map((l) => (
                  <a key={l} href={`#letter-${l}`} className="btn btn-quiet btn-sm !min-w-11">
                    {l}
                  </a>
                ))}
              </nav>
            )}
          </div>
          {terms.length === 0 ? (
            <div className="slab p-6 sm:p-10">
              <p className="text-ink-2">Definitions are being written. Until then, the diagnosis explains every term it uses in your report.</p>
            </div>
          ) : (
            <dl className="grid gap-4 md:grid-cols-2">
              {terms.map((t, i) => {
                const first = i === 0 || terms[i - 1].term[0].toUpperCase() !== t.term[0].toUpperCase();
                return (
                  <div key={t.slug} id={first ? `letter-${t.term[0].toUpperCase()}` : undefined} className="slab slab-hover scroll-mt-4">
                    <Link href={`/glossary/${t.slug}`} className="block p-5 sm:p-6 group">
                      <dt className="display text-2xl text-ink group-hover:text-signal-2 transition-colors">{t.term}</dt>
                      <dd className="mt-2 text-sm text-ink-2 leading-relaxed">{t.short}</dd>
                    </Link>
                  </div>
                );
              })}
            </dl>
          )}
        </section>

        <section className="mt-12 flex flex-wrap gap-2" aria-label="More">
          <Link href="/blog" className="btn btn-ghost btn-sm">
            Blog
          </Link>
          <Link href={TOOLS_HUB.url} className="btn btn-ghost btn-sm">
            {TOOLS_HUB.title}
          </Link>
          <Link href="/diagnose" className="btn btn-primary btn-sm">
            Start the diagnosis
          </Link>
        </section>
      </div>
    </div>
  );
}
