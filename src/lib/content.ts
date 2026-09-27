import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Shared helpers for the Markdown content collections (blog posts, glossary terms,
 * tool pages, category hubs). Bodies are plain Markdown (GFM) compiled with
 * `format: "md"`, so a stray `<` or `{` in prose can never break a build.
 */

export type ContentImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  creditUrl: string;
  pageUrl: string;
};

export type FaqItem = { q: string; a: string };
export type Heading = { id: string; text: string };

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function toDateString(v: unknown): string | null {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && DATE_RE.test(v)) return v;
  return null;
}

export function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((t): t is string => typeof t === "string" && t.trim().length > 0).map((t) => t.trim());
}

export function toImage(v: unknown): ContentImage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const src = typeof o.src === "string" ? o.src : "";
  const alt = typeof o.alt === "string" ? o.alt : "";
  const width = Number(o.width);
  const height = Number(o.height);
  if (!src.startsWith("https://images.pexels.com/") || !alt || !(width > 0) || !(height > 0)) return null;
  return {
    src,
    alt,
    width,
    height,
    credit: typeof o.credit === "string" ? o.credit : "",
    creditUrl: typeof o.creditUrl === "string" ? o.creditUrl : "",
    pageUrl: typeof o.pageUrl === "string" ? o.pageUrl : "",
  };
}

/** Read every `<slug>.md` file in a folder. Invalid slugs are skipped. */
export function readCollection(dir: string): { slug: string; data: Record<string, unknown>; content: string }[] {
  const abs = path.join(process.cwd(), "content", dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(abs, f), "utf8"));
      return { slug, data, content };
    })
    .filter((e) => SLUG_RE.test(e.slug));
}

/** Read one optional Markdown file (e.g. a hub intro). */
export function readOne(file: string): string | null {
  const abs = path.join(process.cwd(), "content", file);
  if (!fs.existsSync(abs)) return null;
  return matter(fs.readFileSync(abs, "utf8")).content;
}

/** Anchor id for a heading: same rule on the server (TOC) and in the rendered heading. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stripInline(md: string): string {
  return md
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

const FAQ_HEADING = /^##\s+(faq|faqs|frequently asked questions)\b.*$/i;

/** H2 headings for the table of contents (the FAQ block is included as one entry). */
export function extractHeadings(md: string): Heading[] {
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const text = stripInline(m[1]);
      out.push({ id: headingId(text), text });
    }
  }
  return out;
}

/**
 * FAQ pairs from the body: an `## FAQ` (or "Frequently asked questions") section whose
 * questions are `### ...` headings followed by answer paragraphs. Used for FAQPage JSON-LD,
 * so the structured data always matches what the reader sees.
 */
export function extractFaq(md: string): FaqItem[] {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => FAQ_HEADING.test(l.trim()));
  if (start < 0) return [];
  const items: FaqItem[] = [];
  let q: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (q) {
      const a = stripInline(buf.join(" ").replace(/\s+/g, " "));
      if (a) items.push({ q, a });
    }
    q = null;
    buf = [];
  };
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s/.test(line)) break;
    const h = /^###\s+(.+?)\s*#*\s*$/.exec(line);
    if (h) {
      flush();
      q = stripInline(h[1]);
      continue;
    }
    if (q && line.trim()) buf.push(line.trim());
  }
  flush();
  return items;
}

/** FAQPage JSON-LD for the FAQ pairs of a body, or null when it has none. */
export function faqSchema(faq: FaqItem[]): Record<string, unknown> | null {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Plain text of a React children tree, for heading ids. */
export function textOf(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return textOf((node as { props: { children?: unknown } }).props.children);
  }
  return "";
}

/** Rough reading time in whole minutes (min 1) at ~215 words per minute. */
export function readingMinutes(text: string): number {
  const plain = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~\[\]()|-]/g, " ");
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 215));
}
