import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { formatDate, getAllPosts, getCategory, getPost, readingTime } from "@/lib/blog";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { DiagnoseCta } from "@/components/blog/DiagnoseCta";
import { JsonLd } from "@/components/blog/JsonLd";
import { PostCard } from "@/components/blog/PostCard";
import { mdxComponents } from "@/components/blog/MdxComponents";
import { APP_URL, BRAND } from "@/lib/env";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await props.params;
  const post = getPost(category, slug);
  if (!post) return {};
  const url = `${APP_URL}/blog/${post.category}/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.category}/${post.slug}` },
    keywords: post.tags.length ? post.tags : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: `${post.publishedAt}T00:00:00Z`,
      modifiedTime: `${post.updatedAt}T00:00:00Z`,
      authors: [BRAND],
      tags: post.tags,
    },
    // Drafts are visible only on preview / local builds; keep them out of any index anyway.
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function PostPage(props: PageProps<"/blog/[category]/[slug]">) {
  const { category: categorySlug, slug } = await props.params;
  const category = getCategory(categorySlug);
  const post = getPost(categorySlug, slug);
  if (!category || !post) notFound();

  const { content } = await compileMDX({ source: post.content, components: mdxComponents });
  const mins = readingTime(post.content);
  const updated = post.updatedAt !== post.publishedAt;
  const url = `${APP_URL}/blog/${post.category}/${post.slug}`;
  const related = getAllPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            articleSection: category.title,
            keywords: post.tags.length ? post.tags.join(", ") : undefined,
            inLanguage: "en",
            author: { "@type": "Organization", name: BRAND, url: APP_URL },
            publisher: {
              "@type": "Organization",
              name: BRAND,
              url: APP_URL,
              logo: { "@type": "ImageObject", url: "https://liftdecode.com/icon.svg" },
            },
          }}
        />

        <article>
          <header className="slab p-6 sm:p-10 animate-rise">
            <div className="mb-5">
              <Breadcrumb
                items={[
                  { href: "/blog", label: "Blog" },
                  { href: `/blog/${category.slug}`, label: category.title },
                  { href: `/blog/${post.category}/${post.slug}`, label: post.title },
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link href={`/blog/${category.slug}`} className="tag tag-signal hover:bg-signal/15 transition-colors">
                {category.title}
              </Link>
              {post.draft && <span className="tag tag-alert">Draft — not in production</span>}
              {post.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="display text-4xl sm:text-6xl">{post.title}</h1>
            <p className="mt-4 text-ink-2 text-lg leading-relaxed">{post.description}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-3">
              <div className="flex gap-2">
                <dt className="text-ink-3">Published</dt>
                <dd>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </dd>
              </div>
              {updated && (
                <div className="flex gap-2">
                  <dt className="text-ink-3">Updated</dt>
                  <dd>
                    <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                  </dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="text-ink-3">Reading time</dt>
                <dd>{mins} min</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-3">By</dt>
                <dd>{BRAND}</dd>
              </div>
            </dl>
          </header>

          <div className="slab p-6 sm:p-10 mt-4 animate-rise" style={{ animationDelay: "60ms" }}>
            <div className="prose-ld">{content}</div>
            <div className="hairline mt-10 mb-6" />
            <p className="text-xs text-ink-3 leading-relaxed">
              Written and maintained by {BRAND}. Training and nutrition education, not medical advice — if you have a
              health condition or an injury, talk to a professional who can examine you.
            </p>
          </div>
        </article>

        <div className="animate-rise" style={{ animationDelay: "120ms" }}>
          <DiagnoseCta categorySlug={category.slug} />
        </div>

        {related.length > 0 && (
          <section className="pt-6" aria-labelledby="more">
            <h2 id="more" className="eyebrow mb-4 px-1">
              More on {category.title.toLowerCase()}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} showCategory={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
