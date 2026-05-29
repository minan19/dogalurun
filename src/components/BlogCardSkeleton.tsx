export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-olive-border/20 overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-100" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-4 bg-gray-100 rounded-lg w-full" />
        <div className="h-4 bg-gray-100 rounded-lg w-4/5" />
        <div className="h-3 bg-gray-100 rounded-lg w-full" />
        <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
        <div className="flex items-center gap-2 mt-1">
          <div className="h-3 w-20 bg-gray-100 rounded-full" />
          <div className="h-3 w-3 bg-gray-100 rounded-full" />
          <div className="h-3 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BlogFeaturedSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-olive-border/20 overflow-hidden mb-8 animate-pulse">
      <div className="h-48 sm:h-64 bg-gray-100" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-4 w-20 bg-gray-100 rounded-full" />
        <div className="h-6 bg-gray-100 rounded-lg w-full" />
        <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-4 bg-gray-100 rounded-lg w-full" />
        <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
        <div className="flex items-center gap-3 mt-1">
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
          <div className="h-3 w-3 bg-gray-100 rounded-full" />
          <div className="h-3 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      <BlogFeaturedSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
