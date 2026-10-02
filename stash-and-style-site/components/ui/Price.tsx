import { formatMoney, isOnSale } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Price({
  price,
  compareAtPrice,
  className,
  from,
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  /** Prefix "From" when variants have different prices. */
  from?: boolean;
}) {
  if (!(price > 0)) return null; // never render $0.00
  const sale = isOnSale(price, compareAtPrice);
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 tabular-nums", className)}>
      {sale ? <span className="sr-only">Sale price</span> : <span className="sr-only">Price</span>}
      <span className={cn(sale && "text-danger")}>
        {from && "From "}
        {formatMoney(price)}
      </span>
      {sale && (
        <>
          <span className="sr-only">Regular price</span>
          <s className="text-[0.9em] text-muted">{formatMoney(compareAtPrice)}</s>
        </>
      )}
    </p>
  );
}
