import "server-only";
import collectionsData from "@/data/collections.json";
import { sfGetAllProducts, sfGetProduct, type SfImage, type SfProduct } from "@/lib/shopify/client";
import { normalizeProduct } from "./normalize";
import type { CatalogProvider, Collection, Product, ProductImage } from "./types";

/**
 * Shopify provider. Collection copy/imagery stays local (data/collections.json) so
 * the design doesn't depend on admin text; products come from the Storefront API.
 */
const collections = collectionsData as Collection[];

const mapImage = (img: SfImage, title: string): ProductImage => ({
  src: img.url,
  alt: img.altText?.trim() || title,
  width: img.width ?? 1000,
  height: img.height ?? 1250,
});

export function mapShopifyProduct(p: SfProduct, rank = 0): Product {
  const images = p.images.nodes.map((i) => mapImage(i, p.title));
  // Shopify's placeholder option for single-variant products is "Title: Default Title".
  const options = p.options
    .filter((o) => !(o.name === "Title" && o.values.length === 1))
    .map((o) => ({ name: o.name as Product["options"][number]["name"], values: o.values }));

  const product: Product = {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    collections: p.collections.nodes.map((c) => c.handle),
    tags: p.tags,
    createdAt: p.createdAt,
    images,
    options,
    variants: p.variants.nodes.map((v) => {
      const price = parseFloat(v.price.amount);
      return {
        id: v.id,
        title: v.title,
        price,
        // normalizeProduct turns 0 / not-higher compare-at into null
        compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
        // availableForSale is the source of truth, not inventory counts
        available: v.availableForSale,
        options: Object.fromEntries(
          v.selectedOptions
            .filter((o) => !(o.name === "Title" && o.value === "Default Title"))
            .map((o) => [o.name, o.value]),
        ),
        imageIndex: v.image
          ? Math.max(
              0,
              images.findIndex((i) => i.src === v.image!.url),
            )
          : undefined,
      };
    }),
    featuredRank: rank,
  };
  return normalizeProduct(product);
}

let cache: { at: number; products: Product[] } | null = null;

export const shopifyProvider: CatalogProvider = {
  name: "shopify",
  async getCollections() {
    return collections;
  },
  async getCollection(handle) {
    return collections.find((c) => c.handle === handle) ?? null;
  },
  async getAllProducts() {
    if (cache && Date.now() - cache.at < 60_000) return cache.products;
    const products = (await sfGetAllProducts()).map(mapShopifyProduct);
    cache = { at: Date.now(), products };
    return products;
  },
  async getProduct(handle) {
    const p = await sfGetProduct(handle);
    return p ? mapShopifyProduct(p) : null;
  },
};
