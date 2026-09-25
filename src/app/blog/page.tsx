import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getAllPosts } from "@/lib/blog";
import { CategoryCard } from "@/components/blog/CategoryCard";
import { PostCard } from "@/components/blog/PostCard";
import { JsonLd } from "@/components/blog/JsonLd";
import { APP_URL, BRAND } from "@/lib/env";

export const metadata: Metadata = {
  title: "Blog — Why lifts stall and how to fix it",
  description:
    "Coach-grade articles on plateaus, programming, nutrition, recovery, strength and physique. Direct, specific and free of hype.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog · ${BRAND}`,
    description: "Coach-grade articles on plateaus, programming, nutrition, recovery, strength and physique.",
    url: `${APP_URL}/blog`,
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const latest = posts.slice(0, 6);
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${BRAND} Blog`,
            url: `${APP_URL}/blog`,
            publisher: { "@type": "Organization", name: BRAND, url: APP_URL, logo: `${APP_URL}/icon.svg` },
          }}
        />

        <header className="slab p-6 sm:p-10 animate-rise">
          <div className="eyebrow mb-3">The LiftDecode blog</div>
          <h1 className="display text-4xl sm:text-6xl max-w-3xl">
            Why lifts <em>stall</em>, and what actually fixes them.
          </h1>
          <p className="mt-4 text-ink-2 text-lg leading-relaxed max-w-2xl">
            The same reasoning we use inside the diagnosis, written out one topic at a time. No supplement stacks, no
            secret programmes — the levers that move results and how to tell which one you need.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="topics">
          <div className="flex items-baseline justify-between gap-3 mb-4 px-1">
            <h2 id="topics" className="eyebrow">
              Browse by topic
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <CategoryCard key={c.slug} category={c} count={counts.get(c.slug) ?? 0} index={i} />
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="latest">
          <div className="flex items-baseline justify-between gap-3 mb-4 px-1">
            <h2 id="latest" className="eyebrow">
              Latest
            </h2>
            {posts.length > 0 && (
              <span className="text-xs text-ink-3">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </span>
            )}
          </div>

          {latest.length === 0 ? (
            <div className="slab p-6 sm:p-10 animate-rise" style={{ animationDelay: "120ms" }}>
              <div className="eyebrow mb-3">Nothing published yet</div>
              <h3 className="display text-3xl sm:text-4xl max-w-xl">
                The first articles are being <em>written</em>.
              </h3>
              <p className="mt-4 text-ink-2 leading-relaxed max-w-xl">
                We publish when a piece is genuinely useful, not on a schedule. Until then, the diagnosis is the most
                direct answer we can give you: it reads your training, eating and recovery and tells you which one is
                the bottleneck.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/diagnose" className="btn btn-primary">
                  Start the diagnosis
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost">
                  See how it works
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {latest.map((p) => (
                <PostCard key={`${p.category}/${p.slug}`} post={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
