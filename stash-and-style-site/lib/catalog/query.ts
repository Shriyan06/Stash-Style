/**
 * Pure filtering/sorting over product summaries.
 * Shared by the server (getProducts) and the collection page's client-side filters.
 */
import type { ProductFilters, ProductSummary, SortKey } from "./types";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price, low to high" },
  { key: "price-desc", label: "Price, high to low" },
  { key: "newest", label: "Newest" },
];

export function filterSummaries(items: ProductSummary[], f: ProductFilters = {}) {
  return items.filter((p) => {
    if (f.minPrice != null && p.price < f.minPrice) return false;
    if (f.maxPrice != null && p.price > f.maxPrice) return false;
    if (f.colors?.length && !p.colors.some((c) => f.colors!.includes(c))) return false;
    if (f.sizes?.length && !p.sizes.some((s) => f.sizes!.includes(s))) return false;
    if (f.inStock && !p.available) return false;
    return true;
  });
}

export function sortSummaries(items: ProductSummary[], sort: SortKey = "featured") {
  const out = [...items];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "newest":
      return out.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    default:
      return out.sort((a, b) => a.featuredRank - b.featuredRank);
  }
}

export type Facets = {
  colors: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
};

export function facetsFor(items: ProductSummary[]): Facets {
  const colors = new Set<string>();
  const sizes = new Set<string>();
  let lo = Infinity;
  let hi = 0;
  for (const p of items) {
    p.colors.forEach((c) => colors.add(c));
    p.sizes.forEach((s) => sizes.add(s));
    lo = Math.min(lo, p.price);
    hi = Math.max(hi, p.price);
  }
  return {
    colors: [...colors].sort(),
    sizes: [...sizes].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)),
    priceMin: Number.isFinite(lo) ? Math.floor(lo) : 0,
    priceMax: Math.ceil(hi),
  };
}

export function searchSummaries(items: ProductSummary[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return items
    .map((p) => {
      const hay = [p.title, ...p.tags, ...p.collections, ...p.colors].join(" ").toLowerCase();
      const title = p.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return null;
        score += title.includes(t) ? 2 : 1;
      }
      return { p, score };
    })
    .filter((x): x is { p: ProductSummary; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}
