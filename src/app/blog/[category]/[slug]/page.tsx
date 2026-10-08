import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getCategory, getPost } from "@/lib/blog";
import { ContentPage, articleSchema } from "@/components/content/ContentPage";
import { siteIndex } from "@/lib/site-index";
import { PageTool } from "@/components/tools/registry";
import { APP_URL, BRAND } from "@/lib/env";
import { pageTitle } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await props.params;
  const post = getPost(category, slug);
  if (!post) return {};
  const path = `/blog/${post.category}/${post.slug}`;
  const ogImage = post.image ? [{ url: `${post.image.src}?auto=compress&cs=tinysrgb&w=1200`, alt: post.image.alt }] : undefined;
  return {
    title: pageTitle(post.title),
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${APP_URL}${path}`,
      publishedTime: `${post.publishedAt}T00:00:00Z`,
      modifiedTime: `${post.updatedAt}T00:00:00Z`,
      authors: [BRAND],
      images: ogImage,
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
  const url = `/blog/${post.category}/${post.slug}`;
  const siblings = siteIndex().filter((e) => e.kind === "article" && e.url.startsWith(`/blog/${post.category}/`));

  return (
    <ContentPage
      url={url}
      crumbs={[
        { href: "/blog", label: "Blog" },
        { href: `/blog/${category.slug}`, label: category.title },
        { href: url, label: post.title },
      ]}
      tag={{ label: category.title, href: `/blog/${category.slug}` }}
      title={post.title}
      description={post.description}
      publishedAt={post.publishedAt}
      updatedAt={post.updatedAt}
      image={post.image}
      body={post.content}
      related={post.related}
      siblings={siblings}
      ctaCategory={category.slug}
      draft={post.draft}
      variant={post.level === "A" ? "tool" : post.level === "B" ? "verdict" : "article"}
      top={post.level === "A" && post.tool ? <PageTool id={post.tool} /> : undefined}
      verdict={post.verdict || undefined}
      heroLine={post.heroLine || undefined}
      schema={articleSchema({
        url,
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        section: category.title,
        image: post.image,
        keyword: post.keyword,
      })}
    />
  );
}
