import Link from "next/link";
import { CATEGORIES, getPostsByCategory, type Category } from "@/lib/blog";
import { extractFaq, faqSchema, readOne } from "@/lib/content";
import { GLOSSARY_HUB, TOOLS_HUB } from "@/lib/site-index";
import { Breadcrumb } from "./Breadcrumb";
import { PostCard } from "./PostCard";
import { Pagination, pageHref } from "./Pagination";
import { JsonLd } from "./JsonLd";
import { renderMarkdown } from "./MdxComponents";
import { APP_URL, BRAND } from "@/lib/env";
import { EntryCard } from "@/components/content/EntryCards";

/** Shared body for `/blog/[category]` and `/blog/[category]/page/[n]`. */
export async function CategoryHub({ category, page }: { category: Category; page: number }) {
  const result = getPostsByCategory(category.slug, page);
  const others = CATEGORIES.filter((c) => c.slug !== category.slug);
  const isFirst = result.page === 1;
  const hubBody = isFirst ? readOne(`hubs/${category.slug}.md`) : null;
  const hubContent = hubBody ? await renderMarkdown(hubBody) : null;
  const faqLd = hubBody ? faqSchema(extractFaq(hubBody)) : null;
  const url = `${APP_URL}${pageHref(category.slug, result.page)}`;

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.h1,
            description: category.description,
            url,
            isPartOf: { "@type": "Blog", name: `${BRAND} Blog`, url: `${APP_URL}/blog` },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: result.posts.map((p, i) => ({
                "@type": "ListItem",
                position: (result.page - 1) * result.perPage + i + 1,
                url: `${APP_URL}/blog/${p.category}/${p.slug}`,
                name: p.title,
              })),
            },
          }}
        />
        {faqLd && <JsonLd data={faqLd} />}

        <header className="slab p-6 sm:p-10 animate-rise">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { href: "/blog", label: "Blog" },
                { href: `/blog/${category.slug}`, label: category.title },
                ...(isFirst ? [] : [{ href: pageHref(category.slug, result.page), label: `Page ${result.page}` }]),
              ]}
            />
          </div>
          <h1 className="display text-4xl sm:text-6xl max-w-3xl">
            {isFirst ? category.h1 : `${category.title} · page ${result.page}`}
          </h1>
          <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">{isFirst ? category.description : category.intro}</p>
        </header>
        <div className="mt-4 animate-rise" style={{ animationDelay: "40ms" }}>
          <EntryCard category={category.slug} />
        </div>

        {hubContent && (
          <section className="slab p-6 sm:p-10 mt-4 animate-rise" style={{ animationDelay: "60ms" }}>
            <div className="prose-ld max-w-3xl">{hubContent}</div>
          </section>
        )}

        <section className="mt-8" aria-labelledby="hub-articles">
          <h2 id="hub-articles" className="eyebrow mb-4 px-1">
            {isFirst ? `All ${category.title.toLowerCase()} articles` : `${category.title} articles`}
          </h2>
          {result.total === 0 ? (
            <div className="slab p-6 sm:p-10 animate-rise" style={{ animationDelay: "80ms" }}>
              <div className="eyebrow mb-3">Coming soon</div>
              <h3 className="display text-3xl sm:text-4xl max-w-xl">
                No articles here <em>yet</em>.
              </h3>
              <p className="mt-4 text-ink-2 leading-relaxed max-w-xl">
                This topic is on the writing list. If {category.title.toLowerCase()} is what you are stuck on right now,
                the diagnosis already covers it in detail and will tell you whether it is actually the problem.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/diagnose" className="btn btn-primary">
                  Start the diagnosis
                </Link>
                <Link href="/blog" className="btn btn-ghost">
                  Back to all topics
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {result.posts.map((p) => (
                  <PostCard key={p.slug} post={p} showCategory={false} />
                ))}
              </div>
              <Pagination category={category.slug} page={result.page} totalPages={result.totalPages} />
            </>
          )}
        </section>

        <section className="mt-12" aria-labelledby="other-topics">
          <h2 id="other-topics" className="eyebrow mb-4 px-1">
            Other topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {others.map((c) => (
              <Link key={c.slug} href={`/blog/${c.slug}`} className="btn btn-ghost btn-sm">
                {c.title}
              </Link>
            ))}
            <Link href={TOOLS_HUB.url} className="btn btn-ghost btn-sm">
              {TOOLS_HUB.title}
            </Link>
            <Link href={GLOSSARY_HUB.url} className="btn btn-ghost btn-sm">
              {GLOSSARY_HUB.title}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
