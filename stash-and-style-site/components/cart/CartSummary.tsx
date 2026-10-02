"use client";

import { useId } from "react";
import { useCart, useCommerce } from "./CommerceProvider";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/icons";
import { site } from "@/config/site";
import { formatMoney } from "@/lib/format";

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const threshold = site.shipping.freeShippingThreshold;
  if (!threshold) return null;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div className="space-y-2">
      <p className="text-sm">
        {remaining > 0 ? (
          <>
            Spend <strong className="tabular-nums">{formatMoney(remaining)}</strong> more for free shipping.
          </>
        ) : (
          "Your order ships free."
        )}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full bg-accent-strong transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function OrderNote() {
  const cart = useCart();
  const id = useId();
  return (
    <details className="group/note">
      <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm underline underline-offset-4">
        {cart.note ? "Edit order note" : "Add an order note"}
      </summary>
      <label htmlFor={id} className="sr-only">
        Order note
      </label>
      <textarea
        id={id}
        className="field mt-2 min-h-24 resize-y text-sm"
        maxLength={500}
        placeholder="Gift message or special instructions"
        value={cart.note}
        onChange={(e) => cart.setNote(e.target.value)}
      />
    </details>
  );
}

export function CartSummary({ showNote = true }: { showNote?: boolean }) {
  const cart = useCart();
  const { checkout, checkingOut, checkoutError } = useCommerce();
  return (
    <div className="space-y-4">
      {showNote && <OrderNote />}
      <dl className="space-y-2 text-[0.9375rem]">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold tabular-nums">{formatMoney(cart.subtotal)}</dd>
        </div>
        {site.shipping.estimate && (
          <div className="flex items-center justify-between text-muted">
            <dt>Shipping</dt>
            <dd>{site.shipping.estimate}</dd>
          </div>
        )}
      </dl>
      <p className="text-sm text-muted">Taxes and shipping are calculated at checkout.</p>
      <Button className="w-full" onClick={checkout} loading={checkingOut} disabled={!cart.lines.length}>
        <LockIcon size={16} /> Checkout
      </Button>
      {checkoutError && (
        <p role="alert" className="text-sm text-danger">
          {checkoutError}
        </p>
      )}
    </div>
  );
}
