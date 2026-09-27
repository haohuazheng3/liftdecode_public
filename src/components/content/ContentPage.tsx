import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/blog/Breadcrumb";
import { DiagnoseCta } from "@/components/blog/DiagnoseCta";
import { JsonLd } from "@/components/blog/JsonLd";
import { renderMarkdown } from "@/components/blog/MdxComponents";
import { Figure } from "./Figure";
import { Toc } from "./Toc";
import { RelatedLinks } from "./RelatedLinks";
import { extractFaq, extractHeadings, faqSchema, readingMinutes, type ContentImage } from "@/lib/content";
import { formatDate } from "@/lib/blog";
import { lookup, type IndexEntry } from "@/lib/site-index";
import { APP_URL, BRAND } from "@/lib/env";

type Props = {
  url: string;
  crumbs: Crumb[];
  tag: { label: string; href: string };
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  image: ContentImage | null;
  body: string;
  related: string[];
  /** Fallback "keep reading" entries when frontmatter lists fewer than four. */
  siblings?: IndexEntry[];
  ctaCategory?: string;
  /** Rendered between the header and the article body (the calculator on tool pages). */
  top?: ReactNode;
  /** The page's primary JSON-LD node (Article, DefinedTerm, WebApplication…). */
  schema: Record<string, unknown>;
  draft?: boolean;
};

/** Shared layout for articles, glossary terms and calculator pages. */
export async function ContentPage(p: Props) {
  const content = await renderMarkdown(p.body);
  const headings = extractHeadings(p.body);
  const faqLd = faqSchema(extractFaq(p.body));
  const mins = readingMinutes(p.body);
  const updated = p.updatedAt !== p.publishedAt;

  const explicit = lookup(p.related.filter((u) => u !== p.url));
  const extra = (p.siblings ?? []).filter((e) => e.url !== p.url && !explicit.some((x) => x.url === e.url));
  const related = [...explicit, ...extra].slice(0, 4);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <JsonLd data={p.schema} />
        {faqLd && <JsonLd data={faqLd} />}

        <article>
          <header className="slab p-6 sm:p-10 animate-rise">
            <div className="mb-5">
              <Breadcrumb items={p.crumbs} />
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link href={p.tag.href} className="tag tag-signal hover:bg-signal/15 transition-colors">
                {p.tag.label}
              </Link>
              {p.draft && <span className="tag tag-alert">Draft — not in production</span>}
            </div>
            <h1 className="display text-4xl sm:text-6xl">{p.title}</h1>
            <p className="mt-4 text-ink-2 text-lg leading-relaxed">{p.description}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-3">
              <div className="flex gap-2">
                <dt>{updated ? "Updated" : "Published"}</dt>
                <dd>
                  <time dateTime={updated ? p.updatedAt : p.publishedAt}>{formatDate(updated ? p.updatedAt : p.publishedAt)}</time>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt>Reading time</dt>
                <dd>{mins} min</dd>
              </div>
              <div className="flex gap-2">
                <dt>By</dt>
                <dd>{BRAND}</dd>
              </div>
            </dl>
          </header>

          {p.top && (
            <div className="mt-4 animate-rise" style={{ animationDelay: "40ms" }}>
              {p.top}
            </div>
          )}

          <div className="slab p-6 sm:p-10 mt-4 animate-rise" style={{ animationDelay: "60ms" }}>
            {p.image && !p.top && (
              <div className="mb-2 [&>figure]:mt-0">
                <Figure image={p.image} eager />
              </div>
            )}
            <Toc headings={headings} />
            {p.image && p.top && <Figure image={p.image} />}
            <div className="prose-ld">{content}</div>
            <div className="hairline mt-10 mb-6" />
            <p className="text-xs text-ink-3 leading-relaxed">
              Written and maintained by {BRAND}. Training and nutrition education for healthy adults, not medical advice —
              if you have a health condition or an injury, talk to a professional who can examine you.
            </p>
          </div>
        </article>

        <div className="animate-rise" style={{ animationDelay: "120ms" }}>
          <DiagnoseCta categorySlug={p.ctaCategory} />
        </div>

        <RelatedLinks entries={related} />
      </div>
    </div>
  );
}

/** Article JSON-LD shared by blog posts and glossary terms. */
export function articleSchema(o: {
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  section: string;
  image: ContentImage | null;
  keyword?: string;
}): Record<string, unknown> {
  const abs = `${APP_URL}${o.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: o.title,
    description: o.description,
    url: abs,
    mainEntityOfPage: { "@type": "WebPage", "@id": abs },
    datePublished: o.publishedAt,
    dateModified: o.updatedAt,
    articleSection: o.section,
    keywords: o.keyword || undefined,
    image: o.image ? [`${o.image.src}?auto=compress&cs=tinysrgb&w=1200`] : undefined,
    inLanguage: "en",
    author: { "@type": "Organization", name: BRAND, url: APP_URL },
    publisher: {
      "@type": "Organization",
      name: BRAND,
      url: APP_URL,
      logo: { "@type": "ImageObject", url: `${APP_URL}/icon.svg` },
    },
  };
}
