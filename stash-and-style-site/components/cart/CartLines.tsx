"use client";

import Link from "next/link";
import { useCart } from "./CommerceProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { Price } from "@/components/ui/Price";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { MAX_QTY } from "@/lib/cart/store";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = MAX_QTY,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  const btn =
    "inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 disabled:opacity-35 disabled:hover:bg-transparent";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border border-line-strong", className)}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon size={16} />
      </button>
      <output aria-live="off" className="w-7 text-center text-sm tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

export function CartLines({ onNavigate, compact }: { onNavigate?: () => void; compact?: boolean }) {
  const cart = useCart();
  return (
    <ul className="divide-y divide-line">
      {cart.lines.map((l) => (
        <li key={l.variantId} className="flex gap-4 py-5">
          <Link
            href={`/products/${l.handle}`}
            onClick={onNavigate}
            className={cn("relative shrink-0 overflow-hidden rounded-img bg-blush", compact ? "w-20" : "w-24 sm:w-28")}
            style={{ aspectRatio: "4 / 5" }}
            tabIndex={-1}
            aria-hidden="true"
          >
            <ProductImage image={l.image} sizes="112px" title={l.title} />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/products/${l.handle}`}
                  onClick={onNavigate}
                  className="leading-snug font-medium hover:underline"
                >
                  {l.title}
                </Link>
                {l.variantTitle && <p className="mt-0.5 text-sm text-muted">{l.variantTitle}</p>}
                <Price price={l.price} compareAtPrice={l.compareAtPrice} className="mt-1 text-sm" />
              </div>
              <p className="shrink-0 text-sm font-medium tabular-nums">
                <span className="sr-only">Line total </span>
                {formatMoney(l.price * l.quantity)}
              </p>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 pt-3">
              <QuantityStepper
                value={l.quantity}
                onChange={(n) => cart.setQuantity(l.variantId, n)}
                label={`Quantity for ${l.title}`}
              />
              <button
                type="button"
                onClick={() => cart.remove(l.variantId)}
                className="min-h-11 px-1 text-sm text-muted underline underline-offset-4 hover:text-ink"
              >
                Remove<span className="sr-only"> {l.title}</span>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
