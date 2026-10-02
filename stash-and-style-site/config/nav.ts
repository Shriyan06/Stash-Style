export type NavItem = { label: string; href: string };

/** Desktop + mobile primary navigation. */
export const mainNav: NavItem[] = [
  { label: "Earrings", href: "/collections/earrings" },
  { label: "Necklaces", href: "/collections/necklace" },
  { label: "Rings", href: "/collections/rings-1" },
  { label: "Bracelets", href: "/collections/bracelets" },
  { label: "Elegance Set", href: "/collections/elegance-set" },
  { label: "Blog", href: "/blog" },
];

export const footerLearn: NavItem[] = [
  { label: "About Us", href: "/about-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export const footerPolicies: NavItem[] = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Shipping Policy", href: "/policies/shipping-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
];
