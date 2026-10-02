/**
 * Every editable business value lives here.
 * Empty string / null = unknown → any UI that depends on it hides itself.
 * See docs/EDITING-GUIDE.md.
 */
export const site = {
  name: "Stash & Style",
  domain: "stashandstyle.store",
  url: "https://stashandstyle.store",
  tagline: "Everyday jewelry, under $35.",
  description:
    "Trend-led rings, necklaces, earrings and bracelets in gold-tone and silver-tone, all under $35. Free shipping and 30-day returns.",
  blurb:
    "We deliver quality products, great value, and a seamless shopping experience for every style. Through innovation, trust, and sustainability, we're committed to exceeding expectations and building lasting relationships.",

  /** Contact — unknown until you fill them in. */
  supportEmail: "",
  businessAddress: "",

  social: {
    instagram: "https://www.instagram.com/stash_nstyle",
    tiktok: "https://www.tiktok.com/@stash_nstyle",
    facebook: "https://www.facebook.com/profile.php?id=61585926674216",
    pinterest: "",
  },
  socialHandle: "@stash_nstyle",

  /** Rotating announcement bar. Empty array hides the bar. */
  announcements: ["Free shipping on every order", "30-day returns"],

  /** Shipping & returns. Leave blank until you have confirmed the real terms. */
  shipping: {
    /** e.g. "Orders ship within 1–3 business days and arrive in 7–14 business days." */
    timeframe: "",
    /** e.g. 35 → shows a "spend $X more" progress line in the cart. null hides it. */
    freeShippingThreshold: null as number | null,
    /** Shown in cart as estimated shipping; e.g. "Free". Empty hides the line. */
    estimate: "",
  },
  returns: {
    windowDays: 30,
    /** e.g. "from the day your order is delivered". Empty → shown as [REPLACE BEFORE LAUNCH]. */
    windowStarts: "",
  },

  /** Price promise used in copy. */
  priceCeiling: 35,
  currency: "USD",
  locale: "en-US",

  /** Product card "New" badge: products created within this many days. */
  newBadgeDays: 30,

  /**
   * Newsletter form endpoint (e.g. a Klaviyo/Shopify form URL). Empty → the form
   * explains sign-ups open at launch instead of pretending to subscribe.
   */
  newsletterAction: "",

  paymentMethods: [
    "visa",
    "mastercard",
    "amex",
    "discover",
    "diners",
    "paypal",
    "applepay",
    "googlepay",
    "shoppay",
  ] as const,

  /** Optional homepage sections that need real data. Empty = hidden. */
  pressMentions: [] as { name: string; url: string }[],
} as const;

export const env = {
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, ""),
};

export type PaymentMethod = (typeof site.paymentMethods)[number];
