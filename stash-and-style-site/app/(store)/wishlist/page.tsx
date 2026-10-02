import { WishlistView } from "@/components/wishlist/WishlistView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Wishlist", path: "/wishlist", noindex: true });

export default function WishlistPage() {
  return (
    <div className="container-x pt-10 pb-20 lg:pt-14">
      <h1 className="mb-6 font-display text-h1">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
