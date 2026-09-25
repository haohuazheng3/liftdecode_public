import { PostCardSkeleton } from "@/components/blog/PostCard";

/** Skeleton laid out like the blog index / hub pages — never a spinner. */
export default function BlogLoading() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10" aria-busy="true" aria-label="Loading">
      <div className="mx-auto max-w-5xl">
        <div className="slab p-6 sm:p-10">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="skeleton h-12 w-5/6 max-w-2xl" />
          <div className="skeleton h-12 w-2/3 max-w-xl mt-2" />
          <div className="skeleton h-5 w-full max-w-2xl mt-5" />
          <div className="skeleton h-5 w-4/5 max-w-2xl mt-2" />
        </div>
        <div className="mt-10 px-1">
          <div className="skeleton h-4 w-28 mb-4" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    </div>
  );
}
