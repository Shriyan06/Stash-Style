import { CartPageView } from "@/components/cart/CartPageView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Your bag", path: "/cart", noindex: true });

export default function CartPage() {
  return (
    <div className="container-x pt-10 pb-20 lg:pt-14">
      <h1 className="font-display text-h1">Your bag</h1>
      <CartPageView />
    </div>
  );
}
