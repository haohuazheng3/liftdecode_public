import Link from "next/link";
import type { IndexEntry } from "@/lib/site-index";

const KIND_LABEL: Record<IndexEntry["kind"], string> = {
  article: "Article",
  hub: "Topic",
  term: "Glossary",
  tool: "Calculator",
  page: "Page",
};

/** "Keep reading" cards. Plain links, so every card is also a crawlable internal link. */
export function RelatedLinks({ entries, title = "Keep reading" }: { entries: IndexEntry[]; title?: string }) {
  if (entries.length === 0) return null;
  return (
    <section className="pt-6" aria-labelledby="related-heading">
      <h2 id="related-heading" className="eyebrow mb-4 px-1">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((e) => (
          <Link key={e.url} href={e.url} className="slab slab-hover block p-5 sm:p-6 group">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="tag tag-signal">{KIND_LABEL[e.kind]}</span>
              <span className="eyebrow">{e.section}</span>
            </div>
            <h3 className="display text-xl sm:text-2xl text-ink group-hover:text-signal-2 transition-colors">{e.title}</h3>
            <p className="mt-2 text-sm text-ink-2 leading-relaxed line-clamp-3">{e.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
