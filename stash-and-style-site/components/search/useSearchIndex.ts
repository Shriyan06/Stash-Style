"use client";

import { useEffect, useState } from "react";
import type { ProductSummary } from "@/lib/catalog/types";

let cache: Promise<ProductSummary[]> | null = null;

function load() {
  cache ??= fetch("/search-index.json")
    .then((r) => (r.ok ? (r.json() as Promise<ProductSummary[]>) : []))
    .catch(() => {
      cache = null;
      return [];
    });
  return cache;
}

/** Lazily loads the compact product index (shared by search, wishlist, recently viewed). */
export function useSearchIndex(enabled = true) {
  const [items, setItems] = useState<ProductSummary[] | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    load().then((d) => alive && setItems(d));
    return () => {
      alive = false;
    };
  }, [enabled]);
  return items;
}
