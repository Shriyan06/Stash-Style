import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Search", path: "/search", noindex: true });

export default function SearchPage() {
  return (
    <div className="container-x pt-10 pb-20 lg:pt-14">
      <h1 className="mb-6 font-display text-h1">Search</h1>
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
