"use client";

import Link from "next/link";
import { Sheet, SheetHeader } from "@/components/ui/Sheet";
import { ButtonLink } from "@/components/ui/Button";
import { BagIcon } from "@/components/icons";
import { mainNav } from "@/config/nav";
import { CartLines } from "./CartLines";
import { CartSummary, FreeShippingProgress } from "./CartSummary";
import { useCart, useCommerce } from "./CommerceProvider";

export function CartEmpty({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center px-2 py-10 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-tint">
        <BagIcon size={26} />
      </span>
      <p className="mt-5 font-display text-h3">Your bag is empty</p>
      <p className="mt-2 max-w-xs text-muted">Start with a collection. Everything is under $35.</p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2" onClick={onNavigate}>
        {mainNav
          .filter((n) => n.href.startsWith("/collections"))
          .map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm transition-colors hover:border-ink"
              >
                {n.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export function CartDrawer() {
  const { panel, close } = useCommerce();
  const cart = useCart();
  return (
    <Sheet open={panel === "cart"} onClose={close} side="right" labelledBy="cart-title">
      <div className="flex h-full flex-col">
        <SheetHeader
          title={
            <>
              Your bag{" "}
              {cart.count > 0 && <span className="font-body text-base font-normal text-muted">({cart.count})</span>}
            </>
          }
          titleId="cart-title"
          onClose={close}
        />
        {cart.lines.length === 0 ? (
          <div className="flex-1 overflow-y-auto px-5">
            <CartEmpty onNavigate={close} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <div className="pt-4">
                <FreeShippingProgress subtotal={cart.subtotal} />
              </div>
              <CartLines onNavigate={close} compact />
            </div>
            <div className="border-t border-line bg-surface px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <CartSummary />
              <ButtonLink
                href="/cart"
                variant="ghost"
                size="sm"
                className="mt-1 w-full underline underline-offset-4"
                onClick={close}
              >
                View full bag
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
