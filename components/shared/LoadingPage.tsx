import { Skeleton } from "@/components/ui/skeleton";

/**
 * Full-page loading skeleton.
 * Use as the `loading.tsx` export in any route segment.
 */
export function LoadingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default LoadingPage;
