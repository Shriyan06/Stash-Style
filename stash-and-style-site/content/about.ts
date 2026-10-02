import { site } from "@/config/site";

/**
 * About page copy. `story` is empty on purpose: add your real story here
 * (a few short paragraphs) and the "Our story" section appears automatically.
 */
export const about = {
  intro: "Trend-led jewelry for every day, priced so you can actually wear it.",
  story: [] as string[],
  sections: [
    {
      title: "Who we are",
      body: [
        `${site.name} is an online shop for women's jewelry and accessories. We deliver quality products, great value and a seamless shopping experience for every style.`,
        "We pick pieces that follow what people are wearing right now and work with what you already own.",
      ],
    },
    {
      title: "What we sell",
      body: [
        "Earrings, necklaces, rings, bracelets and matching sets in gold-tone and silver-tone. Everything is under $35, so you can try a new look without overthinking it.",
      ],
    },
    {
      title: "What we promise",
      body: [
        "Free shipping on every order, and 30-day returns if something isn't right.",
        "Clear prices with no surprises. If a piece is on sale, the original price is shown next to it.",
      ],
    },
  ],
};
