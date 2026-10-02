import Link from "next/link";
import type { ProductSummary } from "@/lib/catalog/types";
import { isOnSale } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { SwatchRow } from "@/components/ui/Swatch";
import { ProductImage } from "./ProductImage";
import { QuickAdd } from "./QuickAdd";
import { WishlistButton } from "./WishlistButton";

const SIZES = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw";

/**
 * One link target (the title link stretches over the card) plus separate,
 * independently focusable wishlist and add buttons layered above it.
 */
export function ProductCard({
  product: p,
  priority,
  headingLevel = 3,
}: {
  product: ProductSummary;
  priority?: boolean;
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as "h3";
  const href = `/products/${p.handle}`;
  const hoverReveal =
    "[@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100";

  return (
    <article className="group lift relative flex flex-col">
      <div className="lift-shadow relative aspect-[4/5] overflow-hidden rounded-img bg-tint">
        <ProductImage image={p.image} sizes={SIZES} priority={priority} className="zoom-img" title={p.title} />
        {p.secondImage && (
          <ProductImage
            image={{ ...p.secondImage, alt: "" }}
            sizes={SIZES}
            className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {p.demo && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 -left-9 w-32 -rotate-45 bg-ink py-0.5 text-center text-[0.625rem] font-bold tracking-[0.2em] text-surface"
          >
            DEMO
          </span>
        )}

        <div
          className={cn(
            "pointer-events-none absolute top-3 flex flex-col items-start gap-1.5",
            p.demo ? "left-10" : "left-3",
          )}
        >
          {!p.available && <Badge tone="soldout">Sold out</Badge>}
          {p.available && isOnSale(p.price, p.compareAtPrice) && <Badge tone="sale">Sale</Badge>}
          {p.isNew && <Badge tone="new">New</Badge>}
        </div>

        <div className="absolute top-2 right-2 z-10">
          <WishlistButton handle={p.handle} title={p.title} />
        </div>

        <div
          className={cn("absolute inset-x-3 bottom-3 z-10 transition-[opacity,transform] duration-200", hoverReveal)}
        >
          {p.singleVariantId ? (
            <QuickAdd product={p} />
          ) : (
            <Link
              href={href}
              tabIndex={-1}
              aria-hidden="true"
              className="flex min-h-11 w-full items-center justify-center rounded-full bg-surface/95 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-ink hover:text-surface"
            >
              {p.available ? "Select options" : "Sold out"}
            </Link>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <H className="font-body text-[0.9375rem] leading-snug font-medium">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent-strong"
          >
            {p.title}
            {p.demo && <span className="sr-only"> (demo product)</span>}
          </Link>
        </H>
        <Price price={p.price} compareAtPrice={p.compareAtPrice} className="text-[0.9375rem] text-muted" />
        <SwatchRow colors={p.colors} />
      </div>
    </article>
  );
}
