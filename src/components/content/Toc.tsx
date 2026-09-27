import type { Heading } from "@/lib/content";

/** Table of contents from the article's H2s. Collapsed by default on phones, open on wider screens. */
export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;
  return (
    <nav aria-label="Table of contents" className="slab-inset p-4 sm:p-5 mb-8">
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 min-h-11 [&::-webkit-details-marker]:hidden">
          <span className="eyebrow">On this page</span>
          <span aria-hidden="true" className="text-ink-3 transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <ol className="mt-2 space-y-1.5 text-[0.95rem]">
          {headings.map((h, i) => (
            <li key={h.id} className="flex gap-3">
              <span className="font-mono text-xs text-ink-4 pt-1 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <a href={`#${h.id}`} className="text-ink-2 hover:text-ink underline-offset-4 hover:underline py-0.5">
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
