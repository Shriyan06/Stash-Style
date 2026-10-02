import { CheckoutView } from "@/components/checkout/CheckoutView";
import { isCommerceConnected } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Checkout", path: "/checkout", noindex: true });

export default function CheckoutPage() {
  return <CheckoutView connected={isCommerceConnected} />;
}
