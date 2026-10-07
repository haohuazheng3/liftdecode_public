import { PageSkeleton } from "@/components/skeletons/PageSkeleton";

/** Personal pages render per request; static pages have no loading state, so their HTML ships complete. */
export default function Loading() {
  return <PageSkeleton />;
}
