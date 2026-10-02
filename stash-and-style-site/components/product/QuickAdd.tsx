"use client";

import { useCart } from "@/components/cart/CommerceProvider";
import type { ProductSummary } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

/** Quick-add for single-variant products. */
export function QuickAdd({ product, className }: { product: ProductSummary; className?: string }) {
  const cart = useCart();
  if (!product.singleVariantId) return null;
  return (
    <button
      type="button"
      disabled={!product.available}
      onClick={() =>
        cart.add({
          variantId: product.singleVariantId!,
          handle: product.handle,
          title: product.title,
          variantTitle: "",
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.image,
          demo: product.demo,
        })
      }
      className={cn(
        "min-h-11 w-full rounded-full bg-surface/95 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-ink hover:text-surface disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-surface/95",
        className,
      )}
    >
      {product.available ? (
        <>
          Add to bag<span className="sr-only">: {product.title}</span>
        </>
      ) : (
        "Sold out"
      )}
    </button>
  );
}
