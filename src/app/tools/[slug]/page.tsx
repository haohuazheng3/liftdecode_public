import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllToolPages, getToolPage } from "@/lib/tool-pages";
import { ContentPage } from "@/components/content/ContentPage";
import { TOOL_COMPONENTS } from "@/components/tools";
import { TOOLS_HUB, siteIndex } from "@/lib/site-index";
import { APP_URL, BRAND } from "@/lib/env";
import { pageTitle } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllToolPages().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getToolPage(slug);
  if (!t) return {};
  const path = `/tools/${t.slug}`;
  return {
    title: pageTitle(t.title),
    description: t.description,
    alternates: { canonical: path },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${APP_URL}${path}`,
      images: t.image ? [{ url: `${t.image.src}?auto=compress&cs=tinysrgb&w=1200`, alt: t.image.alt }] : undefined,
    },
    robots: t.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function ToolPageRoute(props: PageProps<"/tools/[slug]">) {
  const { slug } = await props.params;
  const t = getToolPage(slug);
  const Calculator = TOOL_COMPONENTS[slug];
  if (!t || !Calculator) notFound();
  const url = `/tools/${t.slug}`;

  return (
    <ContentPage
      url={url}
      crumbs={[
        { href: TOOLS_HUB.url, label: TOOLS_HUB.title },
        { href: url, label: t.name },
      ]}
      tag={{ label: "Calculator", href: TOOLS_HUB.url }}
      title={t.title}
      description={t.description}
      publishedAt={t.publishedAt}
      updatedAt={t.updatedAt}
      image={t.image}
      body={t.content}
      related={t.related}
      siblings={siteIndex().filter((e) => e.kind === "tool")}
      draft={t.draft}
      top={<Calculator />}
      variant="tool"
      heroLine={t.heroLine || undefined}
      schema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        headline: t.title,
        description: t.description,
        url: `${APP_URL}${url}`,
        applicationCategory: "HealthApplication",
        operatingSystem: "Any (web browser)",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        datePublished: t.publishedAt,
        dateModified: t.updatedAt,
        inLanguage: "en",
        keywords: t.keyword || undefined,
        publisher: { "@type": "Organization", name: BRAND, url: APP_URL },
      }}
    />
  );
}
