export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-olive-border/20 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-4 bg-gray-100 rounded-lg w-full" />
        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-3 w-20 bg-gray-100 rounded-full mt-1" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 w-16 bg-gray-100 rounded-lg" />
          <div className="h-8 w-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
