import type { Product, ProductImage, Variant } from "@/lib/catalog/types";
import demoImages from "./demo-images.json";

/**
 * DEMO MODE ONLY (NEXT_PUBLIC_DEMO_MODE=true).
 * Sample products for judging grids, cards, filters, the bag and the checkout preview.
 * Images are rendered ILLUSTRATIONS (scripts/render-demo-images.mjs), not photos of real stock.
 * Every card carries a DEMO ribbon and every page a demo banner.
 */

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

type ImageKey = keyof typeof demoImages;
type Tone = "gold" | "silver" | "rose" | "pearl";

const colorName: Record<Tone, string> = {
  gold: "Gold-tone",
  silver: "Silver-tone",
  rose: "Rose gold-tone",
  pearl: "Pearl",
};

const img = (key: ImageKey, alt: string): ProductImage => {
  const m = demoImages[key];
  return { src: m.src, width: m.width, height: m.height, alt };
};

type Spec = {
  title: string;
  collection: string;
  price: number;
  compareAt?: number;
  /** One entry per colour: [tone, main image, hover image] */
  looks: [Tone, ImageKey, ImageKey][];
  sizes?: string[];
  soldOut?: boolean;
  age: number;
  blurb: string;
};

const specs: Spec[] = [
  {
    title: "Everyday Hoop Earrings",
    collection: "earrings",
    price: 16,
    looks: [
      ["gold", "hoops-gold", "hoops-gold-navy"],
      ["silver", "drop-earrings", "hoops-gold-navy"],
    ],
    age: 5,
    blurb: "Medium hoops that go with everything, from jeans to a dress.",
  },
  {
    title: "Pearl Stud Earrings",
    collection: "earrings",
    price: 22,
    looks: [["pearl", "pearl-studs", "pearl-studs-navy"]],
    age: 40,
    blurb: "Small round pearl-look studs for a polished finish.",
  },
  {
    title: "Blue Drop Earrings",
    collection: "earrings",
    price: 19,
    compareAt: 0,
    looks: [["silver", "drop-earrings", "set-silver"]],
    soldOut: true,
    age: 90,
    blurb: "A fine drop with a deep-blue stone. Back soon.",
  },
  {
    title: "Coin Pendant Necklace",
    collection: "necklace",
    price: 26,
    looks: [
      ["gold", "pendant-gold", "pendant-gold-navy"],
      ["silver", "layered-silver", "layered-mixed-navy"],
    ],
    age: 2,
    blurb: "A small coin pendant on a fine chain. Wear it alone or layered.",
  },
  {
    title: "Layered Chain Necklace",
    collection: "necklace",
    price: 29,
    compareAt: 34,
    looks: [["silver", "layered-silver", "layered-mixed-navy"]],
    age: 25,
    blurb: "Two lengths in one piece for an easy layered look.",
  },
  {
    title: "Stacking Ring Set",
    collection: "rings-1",
    price: 14,
    looks: [
      ["gold", "rings-stack-gold", "rings-stack-navy"],
      ["silver", "silver-bands", "rings-stack-navy"],
    ],
    sizes: ["5", "6", "7", "8", "9"],
    age: 3,
    blurb: "Three slim bands to wear together or split up.",
  },
  {
    title: "Green Stone Cocktail Ring",
    collection: "rings-1",
    price: 18,
    compareAt: 24,
    looks: [["rose", "cocktail-ring", "rings-stack-navy"]],
    sizes: ["6", "7", "8"],
    age: 12,
    blurb: "A single green stone on a slim rose gold-tone band.",
  },
  {
    title: "Mixed Metal Bands",
    collection: "rings-1",
    price: 12,
    looks: [
      ["silver", "silver-bands", "rings-stack-navy"],
      ["rose", "cocktail-ring", "rings-stack-navy"],
      ["gold", "rings-stack-gold", "rings-stack-navy"],
    ],
    sizes: ["5", "6", "7", "8"],
    age: 60,
    blurb: "Two-tone stacking bands for mixing metals.",
  },
  {
    title: "Bangle Stack",
    collection: "bracelets",
    price: 17,
    looks: [
      ["gold", "bangles-gold", "bangles-navy"],
      ["silver", "chain-bracelet", "bangles-navy"],
    ],
    age: 8,
    blurb: "Five slim bangles in mixed tones. Wear all five or a few.",
  },
  {
    title: "Fine Chain Bracelet",
    collection: "bracelets",
    price: 21,
    looks: [["silver", "chain-bracelet", "chain-bracelet-gold"]],
    age: 120,
    blurb: "A delicate chain with an adjustable fit.",
  },
  {
    title: "Pearl Necklace & Earring Set",
    collection: "elegance-set",
    price: 32,
    looks: [["gold", "set-gold", "set-gold-navy"]],
    age: 15,
    blurb: "A matching pearl-look pendant and studs, ready to give.",
  },
  {
    title: "Blue Stone Gift Set",
    collection: "elegance-set",
    price: 34,
    compareAt: 34,
    looks: [
      ["silver", "set-silver", "set-gold-navy"],
      ["gold", "set-gold-navy", "set-gold"],
    ],
    age: 45,
    blurb: "Necklace and earrings with deep-blue stones, matched for you.",
  },
];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const demoProducts: Product[] = specs.map((s, i) => {
  const handle = `demo-${slug(s.title)}`;
  const images = s.looks.flatMap(([tone, a, b]) => [
    img(a, `${s.title} in ${colorName[tone].toLowerCase()}, illustration`),
    img(b, `${s.title} on navy velvet, illustration`),
  ]);
  const variants: Variant[] = [];
  s.looks.forEach(([tone], ti) => {
    for (const size of s.sizes ?? [null]) {
      const options: Variant["options"] = {};
      if (s.looks.length > 1) options.Color = colorName[tone];
      if (size) options.Size = size;
      variants.push({
        id: `${handle}-${tone}${size ? `-${size}` : ""}`,
        title: [options.Color, size && `US ${size}`].filter(Boolean).join(" / ") || "Default",
        price: s.price,
        compareAtPrice: s.compareAt ?? null,
        available: !s.soldOut && size !== "9",
        options,
        imageIndex: ti * 2,
      });
    }
  });
  const options: Product["options"] = [];
  if (s.looks.length > 1) options.push({ name: "Color", values: s.looks.map(([t]) => colorName[t]) });
  if (s.sizes) options.push({ name: "Size", values: s.sizes });

  return {
    id: `demo-${i + 1}`,
    handle,
    title: s.title,
    description: `${s.blurb}\n\nThis is a sample product for previewing the store. It isn't for sale, and the picture is an illustration.`,
    collections: [s.collection],
    tags: ["demo", s.collection],
    createdAt: daysAgo(s.age),
    images,
    options,
    variants,
    details: ["Sample details: real materials and measurements come from your product data"],
    featuredRank: i,
    demo: true,
  };
});
