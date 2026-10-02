"use client";

import { useSyncExternalStore } from "react";
import { useWishlist } from "@/components/cart/CommerceProvider";
import { useSearchIndex } from "@/components/search/useSearchIndex";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { HeartIcon } from "@/components/icons";
import { pluralize } from "@/lib/format";

const noop = () => () => {};

export function WishlistView() {
  const { handles } = useWishlist();
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const index = useSearchIndex(handles.length > 0);

  if (!hydrated || (handles.length > 0 && !index)) return <ProductGridSkeleton count={4} />;

  const items = handles.map((h) => index?.find((p) => p.handle === h)).filter((p) => p !== undefined);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-tint">
          <HeartIcon size={26} />
        </span>
        <h2 className="mt-5 font-display text-h2">Nothing saved yet</h2>
        <p className="mt-2 max-w-sm text-muted">Tap the heart on any piece to keep it here for later.</p>
        <ButtonLink href="/collections/all" className="mt-6">
          Start browsing
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-muted">{pluralize(items.length, "saved piece")}</p>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
        {items.map((p) => (
          <li key={p.handle}>
            <ProductCard product={p} headingLevel={2} />
          </li>
        ))}
      </ul>
    </>
  );
}
