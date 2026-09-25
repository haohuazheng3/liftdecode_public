import Link from "next/link";
import type { Category } from "@/lib/blog";

export function CategoryCard({ category, count, index }: { category: Category; count: number; index: number }) {
  return (
    <Link
      href={`/blog/${category.slug}`}
      className="slab slab-hover block p-5 sm:p-6 group animate-rise"
      style={{ animationDelay: `${60 + index * 40}ms` }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
        <span className="tag">{count === 0 ? "Coming soon" : `${count} ${count === 1 ? "article" : "articles"}`}</span>
      </div>
      <h3 className="display text-2xl sm:text-[1.7rem] text-ink group-hover:text-signal-2 transition-colors">
        {category.title}
      </h3>
      <p className="mt-2 text-sm text-ink-2 leading-relaxed">{category.description}</p>
    </Link>
  );
}
