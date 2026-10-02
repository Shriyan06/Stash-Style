import { site } from "@/config/site";

const money = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  minimumFractionDigits: 2,
});

export const formatMoney = (amount: number) => money.format(amount);

/** Sale only when compare-at is a real, higher, non-zero price. */
export const isOnSale = (price: number, compareAt: number | null | undefined): compareAt is number =>
  typeof compareAt === "number" && compareAt > 0 && compareAt > price && price > 0;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(site.locale, { year: "numeric", month: "long", day: "numeric" });

/** Best-effort swatch colour for common jewelry colour names. */
const SWATCHES: [RegExp, string][] = [
  [/rose/i, "#D9A796"],
  [/gold/i, "#CDA554"],
  [/silver|platinum|steel/i, "#C4C7C9"],
  [/pearl|ivory|cream/i, "#EFE7DA"],
  [/black|onyx/i, "#25211E"],
  [/white/i, "#FFFFFF"],
  [/pink|blush/i, "#EBB9C0"],
  [/green|emerald|jade/i, "#4E8A6A"],
  [/blue|sapphire|turquoise/i, "#4A73A8"],
  [/red|ruby/i, "#A8323A"],
  [/purple|amethyst|lilac/i, "#8E6BAF"],
  [/brown|bronze|copper/i, "#A06A42"],
  [/multi|rainbow/i, "conic-gradient(#CDA554, #EBB9C0, #4A73A8, #4E8A6A, #CDA554)"],
];

export function swatchColor(name: string) {
  return SWATCHES.find(([re]) => re.test(name))?.[1] ?? "#D8CFC4";
}

export const pluralize = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
