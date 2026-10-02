"use client";

import { useWishlist } from "@/components/cart/CommerceProvider";
import { HeartIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function WishlistButton({
  handle,
  title,
  className,
  withLabel,
}: {
  handle: string;
  title: string;
  className?: string;
  withLabel?: boolean;
}) {
  const wishlist = useWishlist();
  const saved = wishlist.has(handle);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={withLabel ? undefined : `Save ${title} to wishlist`}
      onClick={() => wishlist.toggle(handle, title)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-colors duration-200",
        withLabel
          ? "min-h-12 border border-line-strong px-5 text-[0.9375rem] hover:border-ink"
          : "size-11 bg-surface/85 backdrop-blur hover:bg-surface",
        className,
      )}
    >
      <HeartIcon key={String(saved)} filled={saved} className={cn(saved && "heart-pop text-danger")} />
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
