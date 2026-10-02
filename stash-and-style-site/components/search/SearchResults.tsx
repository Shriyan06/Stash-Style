"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { mainNav } from "@/config/nav";
import { searchSummaries } from "@/lib/catalog/query";
import { pluralize } from "@/lib/format";
import { pushRecentSearch } from "@/lib/wishlist/store";
import { useSearchIndex } from "./useSearchIndex";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").trim();
  const [draft, setDraft] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    // keep the field in sync when the URL changes (e.g. from the header overlay)
    setLastQ(q);
    setDraft(q);
  }
  const index = useSearchIndex();
  const id = useId();
  const results = index && q ? searchSummaries(index, q) : [];

  return (
    <>
      <form
        role="search"
        className="flex max-w-2xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const t = draft.trim();
          if (!t) return;
          pushRecentSearch(t);
          router.replace(`/search?q=${encodeURIComponent(t)}`);
        }}
      >
        <label htmlFor={id} className="sr-only">
          Search products
        </label>
        <input
          id={id}
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search the shop"
          className="field flex-1 rounded-full! px-5"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-10" aria-live="polite">
        {!q ? (
          <p className="text-muted">
            Type what you&rsquo;re looking for, like &ldquo;hoops&rdquo; or &ldquo;layering chain&rdquo;.
          </p>
        ) : !index ? (
          <ProductGridSkeleton count={4} />
        ) : results.length ? (
          <>
            <p className="text-sm text-muted">
              {pluralize(results.length, "result")} for &ldquo;{q}&rdquo;
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
              {results.map((p) => (
                <li key={p.handle}>
                  <ProductCard product={p} headingLevel={2} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="max-w-xl">
            <h2 className="font-display text-h2">No results for &ldquo;{q}&rdquo;</h2>
            <p className="mt-2 text-muted">Check the spelling, try a broader word, or start from a collection.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {mainNav
                .filter((n) => n.href.startsWith("/collections"))
                .map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm hover:border-ink"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
