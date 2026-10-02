/**
 * Homepage slideshow. Edit the words here; images come from data/brand-images.json
 * (replace the files in public/brand/ with your own photos).
 * `emphasis` is shown in gold italics after the title.
 */
export type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Shows the swinging "Under $35" price tag on this slide. */
  tag?: boolean;
};

export const slides: Slide[] = [
  {
    image: "hero",
    eyebrow: "Rings · Necklaces · Earrings · Bracelets",
    title: "Everyday jewelry,",
    emphasis: "under $35.",
    text: "Rings, necklaces, earrings and bracelets in gold-tone and silver-tone — free shipping and 30-day returns.",
    primary: { label: "Shop new arrivals", href: "/collections/all?sort=newest" },
    secondary: { label: "Browse collections", href: "/collections" },
    tag: true,
  },
  {
    image: "slide2",
    eyebrow: "Bracelets",
    title: "Stack them",
    emphasis: "your way.",
    text: "Mix gold-tone with silver-tone, thin with chunky. Start with one and add as you go.",
    primary: { label: "Shop bracelets", href: "/collections/bracelets" },
    secondary: { label: "Shop rings", href: "/collections/rings-1" },
  },
  {
    image: "slide3",
    eyebrow: "Gift guide",
    title: "Gifts that look",
    emphasis: "put together.",
    text: "Matching sets and easy favorites, all under $35 and shipped free.",
    primary: { label: "Shop the Elegance Set", href: "/collections/elegance-set" },
    secondary: { label: "Shop earrings", href: "/collections/earrings" },
  },
];
