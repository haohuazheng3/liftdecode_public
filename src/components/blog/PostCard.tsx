import Link from "next/link";
import { formatDate, getCategory, readingTime, type Post } from "@/lib/blog";

export function PostCard({ post, showCategory = true }: { post: Post; showCategory?: boolean }) {
  const category = getCategory(post.category);
  const mins = readingTime(post.content);
  return (
    <article className="slab slab-hover">
      <Link href={`/blog/${post.category}/${post.slug}`} className="block p-5 sm:p-7 group">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {showCategory && category && <span className="tag tag-signal">{category.title}</span>}
          {post.draft && <span className="tag tag-alert">Draft</span>}
          <span className="eyebrow">
            {formatDate(post.publishedAt)} · {mins} min read
          </span>
        </div>
        <h3 className="display text-2xl sm:text-3xl text-ink group-hover:text-signal-2 transition-colors">
          {post.title}
        </h3>
        <p className="mt-3 text-ink-2 leading-relaxed">{post.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">
          Read the article
          <span aria-hidden="true" className="text-signal">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}

/** Shimmer block shaped like a PostCard, for loading states. */
export function PostCardSkeleton() {
  return (
    <div className="slab p-5 sm:p-7" aria-hidden="true">
      <div className="flex gap-2 mb-4">
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-6 w-40" />
      </div>
      <div className="skeleton h-8 w-4/5" />
      <div className="skeleton h-8 w-3/5 mt-2" />
      <div className="skeleton h-4 w-full mt-4" />
      <div className="skeleton h-4 w-11/12 mt-2" />
      <div className="skeleton h-4 w-24 mt-5" />
    </div>
  );
}
