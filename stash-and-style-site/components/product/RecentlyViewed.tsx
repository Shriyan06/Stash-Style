"use client";

import Link from "next/link";
import { useSearchIndex } from "@/components/search/useSearchIndex";
import { recentlyViewedStore } from "@/lib/wishlist/store";
import { ProductCard } from "./ProductCard";

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const handles = recentlyViewedStore.useValue().filter((h) => h !== exclude);
  const index = useSearchIndex(handles.length > 0);
  const items = index ? handles.map((h) => index.find((p) => p.handle === h)).filter((p) => p !== undefined) : [];

  return (
    <section aria-labelledby="recent-title" className="border-t border-line pt-12">
      <h2 id="recent-title" className="font-display text-h2">
        Recently viewed
      </h2>
      {items.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
          {items.slice(0, 4).map((p) => (
            <li key={p.handle}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-muted">
          Pieces you look at will show up here so you can find them again.{" "}
          <Link href="/collections/all" className="text-ink underline underline-offset-4">
            Browse everything
          </Link>
        </p>
      )}
    </section>
  );
}
