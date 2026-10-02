"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useId, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { useCommerce } from "@/components/cart/CommerceProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { Price } from "@/components/ui/Price";
import { ArrowIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { mainNav } from "@/config/nav";
import { searchSummaries } from "@/lib/catalog/query";
import { pushRecentSearch, recentSearchStore } from "@/lib/wishlist/store";
import { useSearchIndex } from "./useSearchIndex";

export function SearchOverlay() {
  const { panel, close } = useCommerce();
  const open = panel === "search";
  return (
    <Sheet open={open} onClose={close} side="top" label="Search">
      {open && <SearchPanel onClose={close} />}
    </Sheet>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const query = useDeferredValue(q.trim());
  const index = useSearchIndex();
  const recent = recentSearchStore.useValue();
  const inputId = useId();
  const results = index && query ? searchSummaries(index, query).slice(0, 6) : [];

  function submit(term: string) {
    const t = term.trim();
    if (!t) return;
    pushRecentSearch(t);
    onClose();
    router.push(`/search?q=${encodeURIComponent(t)}`);
  }

  return (
    <div className="container-x pt-4 pb-8" onClick={(e) => (e.target as HTMLElement).closest("a") && onClose()}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className="flex items-center gap-2 border-b-2 border-ink pb-2 focus-within:border-accent-strong"
      >
        <label htmlFor={inputId} className="sr-only">
          Search products
        </label>
        <SearchIcon size={22} className="shrink-0" />
        <input
          id={inputId}
          type="search"
          autoFocus
          autoComplete="off"
          enterKeyHint="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            // native search fields swallow the first Esc to clear text; close straight away instead
            if (e.key === "Escape") {
              e.preventDefault();
              onClose();
            }
          }}
          placeholder="Search rings, hoops, layering chains…"
          className="min-h-12 w-full bg-transparent font-display text-2xl outline-none placeholder:text-muted sm:text-3xl"
        />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-ink/5"
          aria-label="Close search"
        >
          <CloseIcon />
        </button>
      </form>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          {recent.length > 0 && (
            <section aria-labelledby="recent-searches">
              <h2 id="recent-searches" className="eyebrow text-muted">
                Recent searches
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {recent.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => submit(r)}
                      className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm hover:border-ink"
                    >
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="popular-collections">
            <h2 id="popular-collections" className="eyebrow text-muted">
              Popular collections
            </h2>
            <ul className="mt-2">
              {mainNav
                .filter((n) => n.href.startsWith("/collections"))
                .map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="flex min-h-11 items-center gap-2 font-display text-xl hover:text-accent-strong"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="search-results" aria-live="polite">
          <h2 id="search-results" className="eyebrow text-muted">
            {query ? (index ? `${results.length ? "Products" : "No matches"}` : "Searching…") : "Products"}
          </h2>
          {!query && <p className="mt-2 text-muted">Start typing to see matching pieces.</p>}
          {query && index && results.length === 0 && (
            <p className="mt-2 text-muted">
              Nothing matches &ldquo;{query}&rdquo; yet. Try a broader word like &ldquo;ring&rdquo; or browse a
              collection.
            </p>
          )}
          {results.length > 0 && (
            <>
              <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {results.map((p) => (
                  <li key={p.handle}>
                    <Link href={`/products/${p.handle}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-img bg-tint">
                        <ProductImage
                          image={p.image}
                          sizes="(min-width: 768px) 20vw, 45vw"
                          className="zoom-img"
                          title={p.title}
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium">{p.title}</p>
                      <Price price={p.price} compareAtPrice={p.compareAtPrice} className="text-sm" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => pushRecentSearch(query)}
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-4"
              >
                See all results <ArrowIcon size={16} />
              </Link>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
