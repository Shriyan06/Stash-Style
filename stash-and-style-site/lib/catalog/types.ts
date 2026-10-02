/** App-level commerce model. Both providers (local JSON, Shopify) map into this. */

export type ProductImage = {
  /** Omitted for demo products, which render a tinted block instead. */
  src?: string;
  alt: string;
  width: number;
  height: number;
  /** CSS colour used for demo / missing images. */
  tint?: string;
};

/**
 * Only Color/Size/Material are expected. Any other option name from the backend is
 * mapped to "Style" (and a dev warning is logged) so variant selection still works.
 */
export type OptionName = "Color" | "Size" | "Material" | "Style";

export type ProductOption = {
  name: OptionName;
  values: string[];
};

export type Variant = {
  id: string;
  title: string;
  /** USD, e.g. 24 */
  price: number;
  /** Only meaningful when > price. Normalised to null otherwise. */
  compareAtPrice: number | null;
  available: boolean;
  options: Partial<Record<OptionName, string>>;
  /** Index into product.images for this variant. */
  imageIndex?: number;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  /** Plain text. Paragraphs separated by blank lines. */
  description: string;
  collections: string[];
  tags: string[];
  /** ISO date, used for "New" badge and "Newest" sort. */
  createdAt: string;
  images: ProductImage[];
  options: ProductOption[];
  variants: Variant[];
  /** Optional bullet lists for the PDP accordions. */
  details?: string[];
  care?: string[];
  /** Position in "Featured" sort (lower first). */
  featuredRank?: number;
  demo?: boolean;
};

export type Collection = {
  handle: string;
  title: string;
  /** 1–2 honest sentences. */
  description: string;
  /** Key in data/brand-images.json, or null for the typographic tile. */
  image: string | null;
  /** Singular noun for CTAs: "Shop Earrings →". */
  shortLabel: string;
};

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export type ProductFilters = {
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
};

export type ProductQuery = {
  collection?: string;
  sort?: SortKey;
  filters?: ProductFilters;
  /** Opaque pagination cursor (an offset for the local provider). */
  cursor?: string;
  limit?: number;
};

export type ProductPage = {
  products: Product[];
  total: number;
  nextCursor: string | null;
};

/** Compact product shape for client-side search, wishlist and recently viewed. */
export type ProductSummary = {
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: ProductImage | null;
  secondImage: ProductImage | null;
  colors: string[];
  sizes: string[];
  available: boolean;
  isNew: boolean;
  createdAt: string;
  featuredRank: number;
  singleVariantId: string | null;
  collections: string[];
  tags: string[];
  demo?: boolean;
};

export type CartLineInput = { variantId: string; quantity: number };

export interface CatalogProvider {
  name: "local" | "shopify";
  getCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;
  getAllProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
}
