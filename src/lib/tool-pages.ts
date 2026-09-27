import { isProduction } from "@/lib/blog";
import { readCollection, toDateString, toImage, toStringArray, type ContentImage } from "@/lib/content";

/**
 * Calculator pages: the interactive component lives in `src/components/tools`, the
 * explanatory body in `content/tools/<slug>.md` with frontmatter
 * `{ name, title, description, publishedAt, updatedAt?, keyword?, image?, related?, draft? }`.
 * A tool page exists only when both halves exist.
 */
export type ToolPage = {
  slug: string;
  name: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  keyword: string;
  image: ContentImage | null;
  related: string[];
  draft: boolean;
  content: string;
};

/** Slugs that have an interactive component in `src/components/tools` (keep in sync with TOOL_COMPONENTS). */
export const TOOL_SLUGS: readonly string[] = [
  "1rm-calculator",
  "bench-press-calculator",
  "rpe-calculator",
  "protein-intake-calculator",
  "ffmi-calculator",
  "dots-calculator",
  "bulking-calorie-calculator",
  "lean-body-mass-calculator",
  "body-recomposition-calculator",
  "plate-calculator",
];

let cache: ToolPage[] | null = null;

function loadAll(): ToolPage[] {
  if (cache) return cache;
  const pages: ToolPage[] = [];
  for (const { slug, data, content } of readCollection("tools")) {
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const description = typeof data.description === "string" ? data.description.trim() : "";
    const publishedAt = toDateString(data.publishedAt);
    if (!name || !title || !description || !publishedAt) continue;
    const updatedAt = toDateString(data.updatedAt) ?? publishedAt;
    pages.push({
      slug,
      name,
      title,
      description,
      publishedAt,
      updatedAt: updatedAt < publishedAt ? publishedAt : updatedAt,
      keyword: typeof data.keyword === "string" ? data.keyword.trim() : "",
      image: toImage(data.image),
      related: toStringArray(data.related).filter((u) => u.startsWith("/")),
      draft: data.draft === true,
      content,
    });
  }
  pages.sort((a, b) => a.name.localeCompare(b.name, "en"));
  if (process.env.NODE_ENV === "production") cache = pages;
  return pages;
}

export function getAllToolPages(): ToolPage[] {
  const hide = isProduction();
  return loadAll().filter((t) => TOOL_SLUGS.includes(t.slug) && !(hide && t.draft));
}

export function getToolPage(slug: string): ToolPage | undefined {
  return getAllToolPages().find((t) => t.slug === slug);
}
