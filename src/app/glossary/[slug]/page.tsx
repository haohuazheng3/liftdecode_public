import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTerms, getTerm } from "@/lib/glossary";
import { ContentPage, articleSchema } from "@/components/content/ContentPage";
import { GLOSSARY_HUB, siteIndex } from "@/lib/site-index";
import { APP_URL } from "@/lib/env";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTerms().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/glossary/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getTerm(slug);
  if (!t) return {};
  const path = `/glossary/${t.slug}`;
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: t.title,
      description: t.description,
      url: `${APP_URL}${path}`,
      images: t.image ? [{ url: `${t.image.src}?auto=compress&cs=tinysrgb&w=1200`, alt: t.image.alt }] : undefined,
    },
    robots: t.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function TermPage(props: PageProps<"/glossary/[slug]">) {
  const { slug } = await props.params;
  const t = getTerm(slug);
  if (!t) notFound();
  const url = `/glossary/${t.slug}`;
  const article = articleSchema({
    url,
    title: t.title,
    description: t.description,
    publishedAt: t.publishedAt,
    updatedAt: t.updatedAt,
    section: "Glossary",
    image: t.image,
    keyword: t.keyword,
  });
  const { "@context": _ctx, ...articleNode } = article;
  void _ctx;

  return (
    <ContentPage
      url={url}
      crumbs={[
        { href: GLOSSARY_HUB.url, label: GLOSSARY_HUB.title },
        { href: url, label: t.term },
      ]}
      tag={{ label: "Glossary", href: GLOSSARY_HUB.url }}
      title={t.title}
      description={t.description}
      publishedAt={t.publishedAt}
      updatedAt={t.updatedAt}
      image={t.image}
      body={t.content}
      related={t.related}
      siblings={siteIndex().filter((e) => e.kind === "term")}
      draft={t.draft}
      schema={{
        "@context": "https://schema.org",
        "@graph": [
          articleNode,
          {
            "@type": "DefinedTerm",
            name: t.term,
            description: t.short,
            url: `${APP_URL}${url}`,
            inDefinedTermSet: { "@type": "DefinedTermSet", name: GLOSSARY_HUB.h1, url: `${APP_URL}${GLOSSARY_HUB.url}` },
          },
        ],
      }}
    />
  );
}
