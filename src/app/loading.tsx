/** Page-shaped skeleton: the outline of a headline slab and two content slabs. */
export default function Loading() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10" aria-busy="true" aria-label="Loading">
      <div className="mx-auto max-w-5xl">
        <div className="slab p-6 sm:p-10">
          <div className="skeleton h-3 w-32 mb-5" />
          <div className="skeleton h-10 sm:h-14 w-full max-w-2xl mb-3" />
          <div className="skeleton h-10 sm:h-14 w-3/4 max-w-xl mb-6" />
          <div className="space-y-3 max-w-2xl">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="slab p-6 sm:p-8">
            <div className="flex gap-2 mb-5">
              <div className="skeleton h-6 w-28 rounded-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="skeleton h-7 w-3/4 mb-4" />
            <div className="space-y-3">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          </div>
          <div className="slab p-6 sm:p-8">
            <div className="skeleton h-3 w-24 mb-5" />
            <div className="skeleton h-24 w-full rounded-[18px] mb-3" />
            <div className="skeleton h-24 w-full rounded-[18px] mb-5" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
