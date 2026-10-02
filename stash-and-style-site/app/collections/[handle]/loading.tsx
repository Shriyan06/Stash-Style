import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-x pt-6 pb-20 lg:pt-8" aria-busy="true">
      <span className="sr-only">Loading collection…</span>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-8 h-12 w-64" />
      <Skeleton className="mt-4 mb-12 h-4 w-full max-w-lg" />
      <ProductGridSkeleton />
    </div>
  );
}
