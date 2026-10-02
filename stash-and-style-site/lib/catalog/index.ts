/**
 * The one module the storefront talks to for catalog data.
 * Provider = Shopify when SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN are set, else local JSON.
 */
import "server-only";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { localProvider } from "./local";
import { toSummary } from "./normalize";
import { filterSummaries, searchSummaries, sortSummaries } from "./query";
import { shopifyProvider } from "./shopify";
import type { CatalogProvider, Collection, Product, ProductPage, ProductQuery } from "./types";

export * from "./types";
export { toSummary } from "./normalize";

const provider: CatalogProvider = isShopifyConfigured() ? shopifyProvider : localProvider;

export const catalogProvider = provider.name;
export const isCommerceConnected = provider.name === "shopify";

export const ALL_COLLECTION: Collection = {
  handle: "all",
  title: "All jewelry",
  shortLabel: "All",
  description: "Every piece in the shop, from everyday studs to stackable rings.",
  image: null,
};

export async function getCollections(): Promise<Collection[]> {
  return provider.getCollections();
}

export async function getCollection(handle: string): Promise<Collection | null> {
  if (handle === "all") return ALL_COLLECTION;
  return provider.getCollection(handle);
}

export async function getAllProducts(): Promise<Product[]> {
  return provider.getAllProducts();
}

export async function getProducts({
  collection,
  sort = "featured",
  filters,
  cursor,
  limit = 24,
}: ProductQuery = {}): Promise<ProductPage> {
  const all = await provider.getAllProducts();
  const inCollection =
    !collection || collection === "all" ? all : all.filter((p) => p.collections.includes(collection));
  const byHandle = new Map(inCollection.map((p) => [p.handle, p]));
  const matched = sortSummaries(filterSummaries(inCollection.map(toSummary), filters), sort);
  const offset = cursor ? Math.max(0, parseInt(cursor, 10) || 0) : 0;
  const slice = matched.slice(offset, offset + limit);
  return {
    products: slice.map((s) => byHandle.get(s.handle)!),
    total: matched.length,
    nextCursor: offset + limit < matched.length ? String(offset + limit) : null,
  };
}

export async function getProduct(handle: string): Promise<Product | null> {
  return provider.getProduct(handle);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const all = await provider.getAllProducts();
  const byHandle = new Map(all.map((p) => [p.handle, p]));
  return searchSummaries(all.map(toSummary), query).map((s) => byHandle.get(s.handle)!);
}

/** Same-collection products, excluding the current one. */
export async function getRecommendations(handle: string, limit = 4): Promise<Product[]> {
  const all = await provider.getAllProducts();
  const current = all.find((p) => p.handle === handle);
  if (!current) return [];
  const same = all.filter((p) => p.handle !== handle && p.collections.some((c) => current.collections.includes(c)));
  return same.slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return (await getProducts({ sort: "newest", limit })).products;
}
