export default function Loading() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Page skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-olive-border/20 rounded-lg w-1/3" />
          <div className="h-4 bg-olive-border/20 rounded w-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 space-y-3 border border-olive-border/20">
                <div className="aspect-square bg-olive-border/10 rounded-xl" />
                <div className="h-4 bg-olive-border/20 rounded w-3/4" />
                <div className="h-3 bg-olive-border/10 rounded w-1/2" />
                <div className="h-8 bg-olive-border/10 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
