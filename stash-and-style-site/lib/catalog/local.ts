import collectionsData from "@/data/collections.json";
import productsData from "@/data/products.json";
import { demoProducts } from "@/data/demo-products";
import { env } from "@/config/site";
import { normalizeProduct } from "./normalize";
import type { CatalogProvider, Collection, Product } from "./types";

const collections = collectionsData as Collection[];

let cache: Product[] | null = null;
function all(): Product[] {
  if (!cache) {
    const real = (productsData as unknown as Product[]).map(normalizeProduct);
    cache = env.demoMode ? [...real, ...demoProducts.map(normalizeProduct)] : real;
  }
  return cache;
}

export const localProvider: CatalogProvider = {
  name: "local",
  async getCollections() {
    return collections;
  },
  async getCollection(handle) {
    return collections.find((c) => c.handle === handle) ?? null;
  },
  async getAllProducts() {
    return all();
  },
  async getProduct(handle) {
    return all().find((p) => p.handle === handle) ?? null;
  },
};
