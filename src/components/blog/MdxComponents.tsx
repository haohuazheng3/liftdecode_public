import Link from "next/link";
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { headingId, textOf } from "@/lib/content";
import { Figure, imageFromMarkdown } from "@/components/content/Figure";
import { siteIndex } from "@/lib/site-index";

/** Content sections whose pages come and go with publishing; links into them are checked. */
const MANAGED = /^\/(blog|glossary|tools)(\/|$)/;
let live: Set<string> | null = null;
function isLive(path: string): boolean {
  if (!MANAGED.test(path)) return true;
  if (!live || process.env.NODE_ENV !== "production") live = new Set(["/blog", ...siteIndex().map((e) => e.url)]);
  return live.has(path.replace(/[#?].*$/, "").replace(/\/$/, "") || "/");
}

/**
 * Components map for `compileMDX`. Typography comes from `.prose-ld`; these add the
 * few things the prose system does not style on its own (links, quotes, tables, code).
 */

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const internal = href.startsWith("/") || href.startsWith("#");
  // A page that is not published yet renders as plain text instead of a dead link;
  // it becomes a link again on the first build after the target goes live.
  if (href.startsWith("/") && !isLive(href)) return <>{children}</>;
  if (internal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="my-6 border-l-2 border-signal/60 pl-4 text-ink italic [&_p]:m-0 [&_p+p]:mt-3">
      {children}
    </blockquote>
  );
}

function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="my-6 -mx-1 overflow-x-auto">
      <table className="w-full min-w-[28rem] text-[0.95rem] border-collapse">{children}</table>
    </div>
  );
}

function Th({ children }: { children?: ReactNode }) {
  return (
    <th className="text-left font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-3 px-3 py-2 border-b border-line-2">
      {children}
    </th>
  );
}

function Td({ children }: { children?: ReactNode }) {
  return <td className="align-top px-3 py-2.5 border-b border-line text-ink-2">{children}</td>;
}

function Hr() {
  return <div className="hairline my-10" role="separator" />;
}

function InlineCode({ children }: { children?: ReactNode }) {
  return <code className="font-mono text-[0.88em] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-ink">{children}</code>;
}

function Pre({ children }: { children?: ReactNode }) {
  return (
    <pre className="my-6 slab-inset p-4 overflow-x-auto text-[0.85rem] leading-relaxed [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  );
}

function Callout({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <aside className="my-6 slab-inset p-5 not-italic">
      {title && <div className="eyebrow mb-2">{title}</div>}
      <div className="text-ink-2 [&_p]:m-0 [&_p+p]:mt-3">{children}</div>
    </aside>
  );
}

function MdImage({ src, alt, title }: ComponentPropsWithoutRef<"img">) {
  const image = imageFromMarkdown(typeof src === "string" ? src : undefined, alt, title);
  if (!image) return null;
  return <Figure image={image} />;
}

/** A paragraph that only wraps an image becomes the figure itself (a figure cannot live in a <p>). */
function Paragraph({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  const kids = Children.toArray(children).filter((c) => !(typeof c === "string" && !c.trim()));
  if (kids.length === 1 && isValidElement(kids[0]) && kids[0].type === MdImage) return <>{kids[0]}</>;
  return <p {...rest}>{children}</p>;
}

export const mdxComponents = {
  h2: ({ children, ...p }: ComponentPropsWithoutRef<"h2">) => (
    <h2 id={headingId(textOf(children))} className="scroll-mt-4" {...p}>
      {children}
    </h2>
  ),
  h3: ({ children, ...p }: ComponentPropsWithoutRef<"h3">) => (
    <h3 id={headingId(textOf(children))} className="scroll-mt-4" {...p}>
      {children}
    </h3>
  ),
  p: Paragraph,
  img: MdImage,
  ul: (p: ComponentPropsWithoutRef<"ul">) => <ul {...p} />,
  ol: (p: ComponentPropsWithoutRef<"ol">) => <ol {...p} />,
  li: (p: ComponentPropsWithoutRef<"li">) => <li {...p} />,
  a: Anchor,
  blockquote: Blockquote,
  table: Table,
  th: Th,
  td: Td,
  hr: Hr,
  code: InlineCode,
  pre: Pre,
  Callout,
};

/**
 * Compile a Markdown body (GFM: tables, strikethrough, autolinks) with the site's
 * components. `format: "md"` means raw `<`, `{` and HTML in prose are treated as text.
 */
export async function renderMarkdown(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: { mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } },
  });
  return content;
}
