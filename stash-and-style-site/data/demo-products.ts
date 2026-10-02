import type { Product, ProductImage, Variant } from "@/lib/catalog/types";

/**
 * DEMO MODE ONLY (NEXT_PUBLIC_DEMO_MODE=true).
 * Neutral placeholder products for judging grids, cards, filters and the cart.
 * Plain tinted blocks, no photos, obviously labelled "Demo".
 */

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

const tints = {
  gold: ["#E9D6BE", "#DCC3A3"],
  silver: ["#E3E4E2", "#CFD2CF"],
  rose: ["#F1DAD3", "#E5C2B7"],
  pearl: ["#F2ECE3", "#E6DCCF"],
};
type Tone = keyof typeof tints;

const img = (title: string, tone: Tone, n = 0): ProductImage => ({
  alt: `${title}, ${tone === "rose" ? "rose gold" : tone}-tone placeholder image`,
  width: 800,
  height: 1000,
  tint: tints[tone][n],
});

const colorName: Record<Tone, string> = {
  gold: "Gold-tone",
  silver: "Silver-tone",
  rose: "Rose gold-tone",
  pearl: "Pearl",
};

type Spec = {
  n: number;
  kind: "Ring" | "Earrings" | "Necklace" | "Bracelet" | "Set";
  collection: string;
  price: number;
  compareAt?: number;
  tones: Tone[];
  sizes?: string[];
  soldOut?: boolean;
  age: number;
};

const specs: Spec[] = [
  {
    n: 1,
    kind: "Ring",
    collection: "rings-1",
    price: 14,
    tones: ["gold", "silver"],
    sizes: ["5", "6", "7", "8", "9"],
    age: 3,
  },
  {
    n: 2,
    kind: "Ring",
    collection: "rings-1",
    price: 18,
    compareAt: 24,
    tones: ["gold"],
    sizes: ["6", "7", "8"],
    age: 12,
  },
  {
    n: 3,
    kind: "Ring",
    collection: "rings-1",
    price: 12,
    tones: ["silver", "rose", "gold"],
    sizes: ["5", "6", "7", "8"],
    age: 60,
  },
  { n: 1, kind: "Earrings", collection: "earrings", price: 16, tones: ["gold", "silver"], age: 5 },
  { n: 2, kind: "Earrings", collection: "earrings", price: 22, tones: ["pearl"], age: 40 },
  { n: 3, kind: "Earrings", collection: "earrings", price: 19, compareAt: 0, tones: ["rose"], soldOut: true, age: 90 },
  { n: 1, kind: "Necklace", collection: "necklace", price: 26, tones: ["gold", "silver", "rose", "pearl"], age: 2 },
  { n: 2, kind: "Necklace", collection: "necklace", price: 29, compareAt: 34, tones: ["gold"], age: 25 },
  { n: 1, kind: "Bracelet", collection: "bracelets", price: 17, tones: ["gold", "silver"], age: 8 },
  { n: 2, kind: "Bracelet", collection: "bracelets", price: 21, tones: ["silver"], age: 120 },
  { n: 1, kind: "Set", collection: "elegance-set", price: 32, tones: ["gold"], age: 15 },
  { n: 2, kind: "Set", collection: "elegance-set", price: 34, compareAt: 34, tones: ["silver", "gold"], age: 45 },
];

export const demoProducts: Product[] = specs.map((s, i) => {
  const title = `Demo ${s.kind} ${String(s.n).padStart(2, "0")}`;
  const handle = `demo-${s.kind.toLowerCase()}-${String(s.n).padStart(2, "0")}`;
  const images = s.tones.flatMap((t) => [img(title, t, 0), img(title, t, 1)]);
  const variants: Variant[] = [];
  s.tones.forEach((tone, ti) => {
    const sizes = s.sizes ?? [null];
    sizes.forEach((size) => {
      const options: Variant["options"] = {};
      if (s.tones.length > 1) options.Color = colorName[tone];
      if (size) options.Size = size;
      variants.push({
        id: `${handle}-${tone}${size ? `-${size}` : ""}`,
        title: [options.Color, size && `US ${size}`].filter(Boolean).join(" / ") || "Default",
        price: s.price,
        compareAtPrice: s.compareAt ?? null,
        available: !s.soldOut && !(size === "9"),
        options,
        imageIndex: ti * 2,
      });
    });
  });
  const options: Product["options"] = [];
  if (s.tones.length > 1) options.push({ name: "Color", values: s.tones.map((t) => colorName[t]) });
  if (s.sizes) options.push({ name: "Size", values: s.sizes });

  return {
    id: `demo-${i + 1}`,
    handle,
    title,
    description:
      "This is a demo product used to preview the store layout. It isn't for sale.\n\nReal product descriptions, details and photos appear here once your catalog is connected.",
    collections: [s.collection],
    tags: ["demo", s.kind.toLowerCase()],
    createdAt: daysAgo(s.age),
    images,
    options,
    variants,
    details: ["Demo detail: material comes from product data", "Demo detail: measurements come from product data"],
    featuredRank: i,
    demo: true,
  };
});
