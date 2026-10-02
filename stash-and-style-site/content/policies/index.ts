import { site } from "@/config/site";
import { REPLACE } from "../marker";

/**
 * Policy page TEMPLATES. These are structure only, not legal advice.
 * Replace every [REPLACE BEFORE LAUNCH] with your real terms (ideally reviewed by a professional).
 * Tip: Shopify admin → Settings → Policies can generate starting drafts you can paste here.
 */
export type PolicySection = { id: string; title: string; body: string[] };
export type Policy = { handle: string; title: string; summary: string; updated: string; sections: PolicySection[] };

const updated = REPLACE;
const contactLine = site.supportEmail
  ? `Questions about this policy? Email ${site.supportEmail}.`
  : `${REPLACE} Add the email address customers should use for questions about this policy.`;

export const policies: Policy[] = [
  {
    handle: "privacy-policy",
    title: "Privacy Policy",
    summary: "How we collect, use and protect your personal information.",
    updated,
    sections: [
      {
        id: "who-we-are",
        title: "Who we are",
        body: [`This policy applies to ${site.name} (${site.domain}).`, `${REPLACE} Legal business name and address.`],
      },
      {
        id: "information-we-collect",
        title: "Information we collect",
        body: [`${REPLACE} List what you collect (e.g. contact and order details, device and browsing data) and how.`],
      },
      {
        id: "how-we-use-it",
        title: "How we use your information",
        body: [`${REPLACE} Explain each purpose (fulfilling orders, customer support, marketing with consent, etc.).`],
      },
      {
        id: "cookies",
        title: "Cookies and analytics",
        body: [
          "This site stores your bag and wishlist in your browser so they're there when you come back. Analytics only load if you accept them in the cookie banner.",
          `${REPLACE} Name any analytics or advertising tools you use.`,
        ],
      },
      {
        id: "sharing",
        title: "Who we share it with",
        body: [
          `${REPLACE} List service providers (e.g. Shopify for checkout and orders, payment processors, shipping partners).`,
        ],
      },
      {
        id: "your-rights",
        title: "Your rights and choices",
        body: [
          `${REPLACE} Explain how people can access, correct or delete their data, and the rights that apply where you sell.`,
        ],
      },
      { id: "contact", title: "Contact", body: [contactLine] },
    ],
  },
  {
    handle: "refund-policy",
    title: "Refund Policy",
    summary: `How returns, exchanges and refunds work. We offer ${site.returns.windowDays}-day returns.`,
    updated,
    sections: [
      {
        id: "return-window",
        title: "Return window",
        body: [
          `We offer ${site.returns.windowDays}-day returns.`,
          site.returns.windowStarts
            ? `The ${site.returns.windowDays} days start ${site.returns.windowStarts}.`
            : `${REPLACE} State when the ${site.returns.windowDays} days start (e.g. from delivery).`,
        ],
      },
      {
        id: "eligibility",
        title: "What can be returned",
        body: [
          `${REPLACE} Conditions for returns (unworn, original packaging, any exceptions such as earrings for hygiene reasons).`,
        ],
      },
      {
        id: "how-to-return",
        title: "How to start a return",
        body: [`${REPLACE} Step-by-step instructions and where to send items.`],
      },
      { id: "return-shipping", title: "Return shipping costs", body: [`${REPLACE} Who pays for return shipping.`] },
      {
        id: "refunds",
        title: "Refunds",
        body: [`${REPLACE} How refunds are issued and how long they take once the return is received.`],
      },
      {
        id: "damaged-items",
        title: "Damaged or wrong items",
        body: [`${REPLACE} What to do if an order arrives damaged or incorrect.`],
      },
      { id: "contact", title: "Contact", body: [contactLine] },
    ],
  },
  {
    handle: "shipping-policy",
    title: "Shipping Policy",
    summary: "Shipping costs, processing times and delivery.",
    updated,
    sections: [
      { id: "cost", title: "Shipping cost", body: ["Shipping is free on every order."] },
      {
        id: "processing",
        title: "Processing time",
        body: [site.shipping.timeframe || `${REPLACE} How long orders take to process before they ship.`],
      },
      {
        id: "delivery",
        title: "Delivery times",
        body: [`${REPLACE} Estimated delivery times, by region if they differ.`],
      },
      { id: "where-we-ship", title: "Where we ship", body: [`${REPLACE} Countries or regions you ship to.`] },
      { id: "tracking", title: "Tracking", body: [`${REPLACE} How customers receive tracking information.`] },
      {
        id: "multiple-packages",
        title: "Orders in more than one package",
        body: [`${REPLACE} If items can arrive separately, say so here.`],
      },
      { id: "contact", title: "Contact", body: [contactLine] },
    ],
  },
  {
    handle: "terms-of-service",
    title: "Terms of Service",
    summary: "The terms that apply when you use this site and place an order.",
    updated,
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: [
          `These terms apply to ${site.domain}, operated by ${site.name}.`,
          `${REPLACE} Legal business name and governing jurisdiction.`,
        ],
      },
      {
        id: "orders",
        title: "Orders and pricing",
        body: [`${REPLACE} How orders are accepted, pricing errors, and order cancellation.`],
      },
      {
        id: "products",
        title: "Products",
        body: [
          "We try to show colors and details accurately; screens vary, so the finish in person may look slightly different.",
          `${REPLACE} Any further product terms.`,
        ],
      },
      {
        id: "payments",
        title: "Payments",
        body: ["Payments are processed by Shopify's checkout and the payment providers listed on the site."],
      },
      { id: "liability", title: "Limitation of liability", body: [`${REPLACE} Your limitation of liability terms.`] },
      {
        id: "changes",
        title: "Changes to these terms",
        body: [`${REPLACE} How you will notify customers about changes.`],
      },
      { id: "contact", title: "Contact", body: [contactLine] },
    ],
  },
];

export const getPolicy = (handle: string) => policies.find((p) => p.handle === handle) ?? null;
