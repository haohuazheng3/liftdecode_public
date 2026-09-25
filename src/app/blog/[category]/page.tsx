import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory, getPostsByCategory } from "@/lib/blog";
import { CategoryHub } from "@/components/blog/CategoryHub";
import { pageHref } from "@/components/blog/Pagination";
import { APP_URL, BRAND } from "@/lib/env";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[category]">): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = getCategory(slug);
  if (!category) return {};
  const { totalPages } = getPostsByCategory(slug, 1);
  return {
    title: `${category.title} — Blog`,
    description: category.description,
    alternates: { canonical: `/blog/${slug}` },
    pagination: totalPages > 1 ? { next: pageHref(slug, 2) } : undefined,
    openGraph: {
      title: `${category.title} · ${BRAND} Blog`,
      description: category.description,
      url: `${APP_URL}/blog/${slug}`,
    },
  };
}

export default async function CategoryPage(props: PageProps<"/blog/[category]">) {
  const { category: slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();
  return <CategoryHub category={category} page={1} />;
}
