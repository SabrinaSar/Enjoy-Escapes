export default function Loading() {
  return (
    <div className="p-2 sm:p-4 space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>

      {/* Info Box Skeleton */}
      <div className="h-32 w-full rounded-lg bg-muted/50 animate-pulse border border-muted" />
      
      {/* Overview Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border h-24 flex flex-col justify-between animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-5 w-5 bg-muted rounded-full" />
            </div>
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
      
      {/* Banner Analytics Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="h-7 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="rounded-md border overflow-hidden">
          <div className="bg-muted/50 h-10 w-full border-b" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b last:border-0 gap-4 animate-pulse">
              <div className="h-4 w-8 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-4 w-12 ml-auto bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Escape Analytics Skeleton */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
          <div className="h-7 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="rounded-md border overflow-hidden">
          <div className="bg-muted/50 h-10 w-full border-b" />
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b last:border-0 gap-4 animate-pulse">
              <div className="h-4 w-8 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-12 ml-auto bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="h-7 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="rounded-md border overflow-hidden">
          <div className="bg-muted/50 h-10 w-full border-b" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b last:border-0 gap-4 animate-pulse">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-24 ml-auto bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}