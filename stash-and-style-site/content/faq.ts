import { site } from "@/config/site";
import { REPLACE } from "./marker";

export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

const paymentNames: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  paypal: "PayPal",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  shoppay: "Shop Pay",
};

/**
 * Answers come from config/site.ts where possible. Anything unknown shows
 * [REPLACE BEFORE LAUNCH], is listed by the build check, and is left out of the FAQ schema.
 */
export const faqs: FaqGroup[] = [
  {
    id: "orders-shipping",
    title: "Orders & Shipping",
    items: [
      { q: "How much is shipping?", a: "Shipping is free on every order." },
      {
        q: "How long will my order take to arrive?",
        a:
          site.shipping.timeframe ||
          `${REPLACE} Add your processing and delivery times in config/site.ts (shipping.timeframe).`,
      },
      {
        q: "How do I track my order?",
        a: `${REPLACE} Explain how customers receive tracking details for their order.`,
      },
    ],
  },
  {
    id: "returns-refunds",
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: site.returns.windowStarts
          ? `You can return items within ${site.returns.windowDays} days ${site.returns.windowStarts}.`
          : `We offer ${site.returns.windowDays}-day returns. ${REPLACE} State when the ${site.returns.windowDays} days start and any conditions.`,
      },
      { q: "How do I start a return?", a: `${REPLACE} Describe the steps to start a return.` },
      { q: "When will I get my refund?", a: `${REPLACE} Say how and when refunds are issued.` },
    ],
  },
  {
    id: "sizing-care",
    title: "Sizing & Care",
    items: [
      {
        q: "How do I find my ring size?",
        a: "Open any ring and select “Ring size guide” next to the size options. It lists US sizes with the matching inside diameter and circumference. If you're between sizes, go up half a size.",
      },
      {
        q: "How should I look after my jewelry?",
        a: "Put pieces on after perfume, lotion and hairspray, take them off before swimming or showering, and store them separately in a dry place so they don't scratch or tangle.",
      },
      {
        q: "What are the pieces made of?",
        a: "It varies by piece. Each product page lists the details for that item.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: `We accept ${site.paymentMethods
          .map((m) => paymentNames[m])
          .join(", ")
          .replace(/, ([^,]*)$/, " and $1")}.`,
      },
      {
        q: "Is checkout secure?",
        a: "Yes. Payments are processed through Shopify's secure checkout, and your full card details are never shared with us.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    items: [
      {
        q: "How can I reach you?",
        a: site.supportEmail
          ? `Email us at ${site.supportEmail} or use the contact form. You can also message us on Instagram at ${site.socialHandle}.`
          : `Message us on Instagram at ${site.socialHandle}. ${REPLACE} Add a support email in config/site.ts (supportEmail).`,
      },
    ],
  },
];
