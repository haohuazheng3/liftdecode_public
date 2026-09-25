import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory, getPostsByCategory } from "@/lib/blog";
import { CategoryHub } from "@/components/blog/CategoryHub";
import { pageHref } from "@/components/blog/Pagination";
import { APP_URL, BRAND } from "@/lib/env";

export const dynamicParams = false;

function parsePageNumber(n: string): number | null {
  if (!/^\d+$/.test(n)) return null;
  const page = Number(n);
  return page >= 2 ? page : null;
}

/** Only pages 2..N exist here; page 1 is the hub itself. */
export function generateStaticParams() {
  const params: { category: string; n: string }[] = [];
  for (const c of CATEGORIES) {
    const { totalPages } = getPostsByCategory(c.slug, 1);
    for (let n = 2; n <= totalPages; n++) params.push({ category: c.slug, n: String(n) });
  }
  return params;
}

export async function generateMetadata(props: PageProps<"/blog/[category]/page/[n]">): Promise<Metadata> {
  const { category: slug, n } = await props.params;
  const category = getCategory(slug);
  const page = parsePageNumber(n);
  if (!category || !page) return {};
  const { totalPages } = getPostsByCategory(slug, page);
  if (page > totalPages) return {};
  return {
    title: `${category.title} — page ${page}`,
    description: category.description,
    alternates: { canonical: pageHref(slug, page) },
    pagination: {
      previous: pageHref(slug, page - 1),
      next: page < totalPages ? pageHref(slug, page + 1) : undefined,
    },
    openGraph: {
      title: `${category.title} · page ${page} · ${BRAND} Blog`,
      description: category.description,
      url: `${APP_URL}${pageHref(slug, page)}`,
    },
  };
}

export default async function CategoryPagedPage(props: PageProps<"/blog/[category]/page/[n]">) {
  const { category: slug, n } = await props.params;
  const category = getCategory(slug);
  const page = parsePageNumber(n);
  if (!category || !page) notFound();
  const { totalPages } = getPostsByCategory(slug, page);
  if (page > totalPages) notFound();
  return <CategoryHub category={category} page={page} />;
}
