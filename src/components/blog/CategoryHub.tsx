import Link from "next/link";
import { CATEGORIES, getPostsByCategory, type Category } from "@/lib/blog";
import { Breadcrumb } from "./Breadcrumb";
import { PostCard } from "./PostCard";
import { Pagination, pageHref } from "./Pagination";
import { JsonLd } from "./JsonLd";
import { APP_URL, BRAND } from "@/lib/env";

/** Shared body for `/blog/[category]` and `/blog/[category]/page/[n]`. */
export function CategoryHub({ category, page }: { category: Category; page: number }) {
  const result = getPostsByCategory(category.slug, page);
  const others = CATEGORIES.filter((c) => c.slug !== category.slug);
  const isFirst = result.page === 1;

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.title} · ${BRAND} Blog`,
            description: category.description,
            url: `${APP_URL}${pageHref(category.slug, result.page)}`,
            isPartOf: { "@type": "Blog", name: `${BRAND} Blog`, url: `${APP_URL}/blog` },
          }}
        />

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
            {category.title}
            {!isFirst && (
              <>
                {" "}
                <em>· page {result.page}</em>
              </>
            )}
          </h1>
          {isFirst ? (
            <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">{category.intro}</p>
          ) : (
            <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">{category.description}</p>
          )}
        </header>

        <section className="mt-8" aria-label={`${category.title} articles`}>
          {result.total === 0 ? (
            <div className="slab p-6 sm:p-10 animate-rise" style={{ animationDelay: "80ms" }}>
              <div className="eyebrow mb-3">Coming soon</div>
              <h2 className="display text-3xl sm:text-4xl max-w-xl">
                No articles here <em>yet</em>.
              </h2>
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
              <Link
                key={c.slug}
                href={`/blog/${c.slug}`}
                className="btn btn-ghost btn-sm"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
