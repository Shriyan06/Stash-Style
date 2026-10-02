import { site } from "@/config/site";
import type { OptionName, Product, ProductOption, ProductSummary, Variant } from "./types";

const isDev = process.env.NODE_ENV !== "production";

function warn(product: string, message: string) {
  if (isDev) console.warn(`[catalog] ${product}: ${message}`);
}

/** "Colour" → Color, "Ring size" → Size, "Metal" → Material, anything else → Style. */
export function normalizeOptionName(raw: string, productTitle = "product"): OptionName {
  const n = raw.trim().toLowerCase();
  if (/colou?r|tone/.test(n)) return "Color";
  if (/size/.test(n)) return "Size";
  if (/material|metal|finish/.test(n)) return "Material";
  warn(productTitle, `option "${raw}" is not Color/Size/Material — shown as "Style"`);
  return "Style";
}

/** Strips bogus units suppliers attach to sizes ("7 yards" → "7"). */
export function normalizeSize(raw: string): string {
  return raw
    .replace(/\b(yards?|yd|inch(es)?|in|cm|mm|us|size)\b\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** True for values that look like US ring sizes (3–13, halves allowed). */
export function isRingSize(value: string) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 3 && n <= 13 && (n * 2) % 1 === 0;
}

export function formatSize(value: string) {
  return isRingSize(value) ? `US ${value}` : value;
}

/** compare-at must be a real, higher price — otherwise it's absent. */
export function normalizeCompareAt(price: number, compareAt: unknown): number | null {
  const c = typeof compareAt === "string" ? parseFloat(compareAt) : Number(compareAt);
  if (!Number.isFinite(c) || c <= 0 || c <= price) return null;
  return c;
}

export function normalizeProduct(p: Product): Product {
  const options: ProductOption[] = p.options.map((o) => {
    const name = normalizeOptionName(o.name, p.title);
    return { name, values: name === "Size" ? o.values.map(normalizeSize) : o.values };
  });
  const variants: Variant[] = p.variants.map((v) => {
    const price = Number(v.price);
    const opts: Variant["options"] = {};
    for (const [k, val] of Object.entries(v.options)) {
      if (!val) continue;
      const name = normalizeOptionName(k, p.title);
      opts[name] = name === "Size" ? normalizeSize(val) : val;
    }
    return {
      ...v,
      price: Number.isFinite(price) ? price : 0,
      compareAtPrice: normalizeCompareAt(price, v.compareAtPrice),
      options: opts,
    };
  });
  if (!p.images.length) warn(p.title, "has no images");
  if (!variants.length || variants.every((v) => !v.price)) warn(p.title, "has no price");
  return { ...p, options, variants };
}

export const minPrice = (p: Product) => (p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : 0);

export function isNewProduct(createdAt: string, now = Date.now()) {
  const t = Date.parse(createdAt);
  return Number.isFinite(t) && now - t < site.newBadgeDays * 86_400_000;
}

export function toSummary(p: Product): ProductSummary {
  const cheapest = p.variants.reduce<Variant | undefined>(
    (best, v) => (!best || v.price < best.price ? v : best),
    undefined,
  );
  const colors = p.options.find((o) => o.name === "Color")?.values ?? [];
  const sizes = p.options.find((o) => o.name === "Size")?.values ?? [];
  return {
    handle: p.handle,
    title: p.title,
    price: cheapest?.price ?? 0,
    compareAtPrice: cheapest?.compareAtPrice ?? null,
    image: p.images[0] ?? null,
    secondImage: p.images[1] ?? null,
    colors,
    sizes,
    // trust availableForSale per variant; product is available if any variant is
    available: p.variants.some((v) => v.available),
    isNew: isNewProduct(p.createdAt),
    createdAt: p.createdAt,
    featuredRank: p.featuredRank ?? 9999,
    singleVariantId: p.variants.length === 1 ? p.variants[0].id : null,
    collections: p.collections,
    tags: p.tags,
    demo: p.demo,
  };
}
