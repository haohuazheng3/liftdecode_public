import type { Metadata } from "next";
import Link from "next/link";
import { getAllToolPages } from "@/lib/tool-pages";
import { extractFaq, faqSchema, readOne } from "@/lib/content";
import { GLOSSARY_HUB, TOOLS_HUB } from "@/lib/site-index";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { JsonLd } from "@/components/blog/JsonLd";
import { renderMarkdown } from "@/components/blog/MdxComponents";
import { APP_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: TOOLS_HUB.h1,
  description: TOOLS_HUB.description,
  alternates: { canonical: TOOLS_HUB.url },
  openGraph: { title: TOOLS_HUB.h1, description: TOOLS_HUB.description, url: `${APP_URL}${TOOLS_HUB.url}` },
};

export default async function ToolsIndex() {
  const tools = getAllToolPages();
  const body = readOne("hubs/tools.md");
  const intro = body ? await renderMarkdown(body) : null;
  const faqLd = body ? faqSchema(extractFaq(body)) : null;

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: TOOLS_HUB.h1,
            description: TOOLS_HUB.description,
            url: `${APP_URL}${TOOLS_HUB.url}`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: tools.map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${APP_URL}/tools/${t.slug}`,
                name: t.name,
              })),
            },
          }}
        />
        {faqLd && <JsonLd data={faqLd} />}
        <header className="slab p-6 sm:p-10 animate-rise">
          <div className="mb-4">
            <Breadcrumb items={[{ href: TOOLS_HUB.url, label: TOOLS_HUB.title }]} />
          </div>
          <h1 className="display text-4xl sm:text-6xl max-w-3xl">{TOOLS_HUB.h1}</h1>
          <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">{TOOLS_HUB.description}</p>
        </header>

        <section className="mt-8" aria-labelledby="all-tools">
          <h2 id="all-tools" className="eyebrow mb-4 px-1">
            All calculators
          </h2>
          {tools.length === 0 ? (
            <div className="slab p-6 sm:p-10">
              <p className="text-ink-2">The calculators are being finished. The diagnosis is live now.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tools.map((t, i) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="slab slab-hover block p-5 sm:p-6 group animate-rise"
                  style={{ animationDelay: `${60 + i * 30}ms` }}
                >
                  <span className="tag tag-signal">Calculator</span>
                  <h3 className="mt-3 display text-2xl text-ink group-hover:text-signal-2 transition-colors">{t.name}</h3>
                  <p className="mt-2 text-sm text-ink-2 leading-relaxed line-clamp-3">{t.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {intro && (
          <section className="slab p-6 sm:p-10 mt-8">
            <div className="prose-ld max-w-3xl">{intro}</div>
          </section>
        )}

        <section className="mt-12 flex flex-wrap gap-2" aria-label="More">
          <Link href="/blog" className="btn btn-ghost btn-sm">
            Blog
          </Link>
          <Link href={GLOSSARY_HUB.url} className="btn btn-ghost btn-sm">
            {GLOSSARY_HUB.title}
          </Link>
          <Link href="/diagnose" className="btn btn-primary btn-sm">
            Start the diagnosis
          </Link>
        </section>
      </div>
    </div>
  );
}
