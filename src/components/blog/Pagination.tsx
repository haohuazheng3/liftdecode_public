import Link from "next/link";

export function pageHref(category: string, page: number): string {
  return page <= 1 ? `/blog/${category}` : `/blog/${category}/page/${page}`;
}

export function Pagination({ category, page, totalPages }: { category: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? pageHref(category, page - 1) : null;
  const next = page < totalPages ? pageHref(category, page + 1) : null;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
      {prev ? (
        <Link href={prev} className="btn btn-ghost btn-sm" rel="prev">
          <span aria-hidden="true">←</span> Newer
        </Link>
      ) : (
        <span className="btn btn-ghost btn-sm" aria-disabled="true">
          <span aria-hidden="true">←</span> Newer
        </span>
      )}
      <span className="eyebrow">
        Page {page} of {totalPages}
      </span>
      {next ? (
        <Link href={next} className="btn btn-ghost btn-sm" rel="next">
          Older <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className="btn btn-ghost btn-sm" aria-disabled="true">
          Older <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  );
}
