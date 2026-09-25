/** Skeleton shaped like an admin page: headline, four stat tiles, a table. */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-5">
        <div className="skeleton h-3 w-24 mb-3" />
        <div className="skeleton h-9 w-56" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="slab p-4 sm:p-5">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-8 w-16 mt-3" />
          </div>
        ))}
      </div>
      <div className="slab p-4">
        <div className="skeleton h-3 w-full mb-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-full mb-2" />
        ))}
      </div>
    </div>
  );
}
