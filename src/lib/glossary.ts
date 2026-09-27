import { isProduction } from "@/lib/blog";
import { readCollection, toDateString, toImage, toStringArray, type ContentImage } from "@/lib/content";

/**
 * Glossary terms: `content/glossary/<slug>.md` with frontmatter
 * `{ term, title, description, short, publishedAt, updatedAt?, keyword?, image?, related?, draft? }`.
 * `short` is the one-sentence definition used on the A–Z hub and in DefinedTerm JSON-LD.
 */
export type GlossaryTerm = {
  slug: string;
  term: string;
  title: string;
  description: string;
  short: string;
  publishedAt: string;
  updatedAt: string;
  keyword: string;
  image: ContentImage | null;
  related: string[];
  draft: boolean;
  content: string;
};

let cache: GlossaryTerm[] | null = null;

function loadAll(): GlossaryTerm[] {
  if (cache) return cache;
  const terms: GlossaryTerm[] = [];
  for (const { slug, data, content } of readCollection("glossary")) {
    const term = typeof data.term === "string" ? data.term.trim() : "";
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const description = typeof data.description === "string" ? data.description.trim() : "";
    const short = typeof data.short === "string" ? data.short.trim() : "";
    const publishedAt = toDateString(data.publishedAt);
    if (!term || !title || !description || !short || !publishedAt) continue;
    const updatedAt = toDateString(data.updatedAt) ?? publishedAt;
    terms.push({
      slug,
      term,
      title,
      description,
      short,
      publishedAt,
      updatedAt: updatedAt < publishedAt ? publishedAt : updatedAt,
      keyword: typeof data.keyword === "string" ? data.keyword.trim() : "",
      image: toImage(data.image),
      related: toStringArray(data.related).filter((u) => u.startsWith("/")),
      draft: data.draft === true,
      content,
    });
  }
  terms.sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
  if (process.env.NODE_ENV === "production") cache = terms;
  return terms;
}

export function getAllTerms(): GlossaryTerm[] {
  const hide = isProduction();
  return loadAll().filter((t) => !(hide && t.draft));
}

export function getTerm(slug: string): GlossaryTerm | undefined {
  return getAllTerms().find((t) => t.slug === slug);
}
