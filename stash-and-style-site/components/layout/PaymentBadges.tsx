import { site, type PaymentMethod } from "@/config/site";
import { cn } from "@/lib/cn";

/** Simplified, text-led payment badges (no third-party logo files). */
const badges: Record<PaymentMethod, { label: string; art: React.ReactNode }> = {
  visa: {
    label: "Visa",
    art: (
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="800"
        fontStyle="italic"
        fill="#1A1F71"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </text>
    ),
  },
  mastercard: {
    label: "Mastercard",
    art: (
      <>
        <circle cx="15.5" cy="12" r="6" fill="#EB001B" />
        <circle cx="22.5" cy="12" r="6" fill="#F79E1B" fillOpacity="0.9" />
      </>
    ),
  },
  amex: {
    label: "American Express",
    art: (
      <>
        <rect x="3" y="4" width="32" height="16" rx="2" fill="#1F72CD" />
        <text
          x="19"
          y="15.2"
          textAnchor="middle"
          fontSize="7"
          fontWeight="800"
          fill="#fff"
          fontFamily="Arial, sans-serif"
        >
          AMEX
        </text>
      </>
    ),
  },
  discover: {
    label: "Discover",
    art: (
      <>
        <text
          x="16"
          y="14.8"
          textAnchor="middle"
          fontSize="6"
          fontWeight="700"
          fill="#231F20"
          fontFamily="Arial, sans-serif"
        >
          DISC
        </text>
        <circle cx="27" cy="12.6" r="3.2" fill="#F48024" />
      </>
    ),
  },
  diners: {
    label: "Diners Club",
    art: (
      <>
        <circle cx="19" cy="12" r="7" fill="none" stroke="#0079BE" strokeWidth="1.6" />
        <path d="M17 7.8v8.4M21 7.8v8.4" stroke="#0079BE" strokeWidth="1.4" />
      </>
    ),
  },
  paypal: {
    label: "PayPal",
    art: (
      <text
        x="19"
        y="15.3"
        textAnchor="middle"
        fontSize="7.6"
        fontWeight="800"
        fontStyle="italic"
        fill="#003087"
        fontFamily="Arial, sans-serif"
      >
        Pay<tspan fill="#009CDE">Pal</tspan>
      </text>
    ),
  },
  applepay: {
    label: "Apple Pay",
    art: (
      <text
        x="19"
        y="15.2"
        textAnchor="middle"
        fontSize="7"
        fontWeight="600"
        fill="#000"
        fontFamily="-apple-system, Arial, sans-serif"
      >
        Apple Pay
      </text>
    ),
  },
  googlepay: {
    label: "Google Pay",
    art: (
      <text
        x="19"
        y="15.2"
        textAnchor="middle"
        fontSize="7.2"
        fontWeight="600"
        fill="#3C4043"
        fontFamily="Arial, sans-serif"
      >
        <tspan fill="#4285F4">G</tspan> Pay
      </text>
    ),
  },
  shoppay: {
    label: "Shop Pay",
    art: (
      <>
        <rect x="3" y="4" width="32" height="16" rx="2" fill="#5A31F4" />
        <text
          x="19"
          y="15.2"
          textAnchor="middle"
          fontSize="7"
          fontWeight="800"
          fill="#fff"
          fontFamily="Arial, sans-serif"
        >
          shop
        </text>
      </>
    ),
  },
};

export function PaymentBadges({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Accepted payment methods">
      {site.paymentMethods.map((m) => (
        <li key={m}>
          <svg width="38" height="24" viewBox="0 0 38 24" role="img" aria-label={badges[m].label} className="block">
            <rect x="0.5" y="0.5" width="37" height="23" rx="3" fill="#fff" stroke="#E8DFD5" />
            {badges[m].art}
          </svg>
        </li>
      ))}
    </ul>
  );
}
