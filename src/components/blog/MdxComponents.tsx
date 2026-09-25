import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Components map for `compileMDX`. Typography comes from `.prose-ld`; these add the
 * few things the prose system does not style on its own (links, quotes, tables, code).
 */

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const internal = href.startsWith("/") || href.startsWith("#");
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

export const mdxComponents = {
  h2: (p: ComponentPropsWithoutRef<"h2">) => <h2 {...p} />,
  h3: (p: ComponentPropsWithoutRef<"h3">) => <h3 {...p} />,
  p: (p: ComponentPropsWithoutRef<"p">) => <p {...p} />,
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
