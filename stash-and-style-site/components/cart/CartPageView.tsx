"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CartLines } from "./CartLines";
import { CartSummary, FreeShippingProgress } from "./CartSummary";
import { CartEmpty } from "./CartDrawer";
import { useCart } from "./CommerceProvider";
import { PaymentBadges } from "@/components/layout/PaymentBadges";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowIcon } from "@/components/icons";

const noop = () => () => {};

export function CartPageView() {
  const cart = useCart();
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  if (!hydrated) {
    return (
      <div aria-busy="true" className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <span className="sr-only">Loading your bag…</span>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!cart.lines.length) {
    return (
      <div className="mx-auto mt-6 max-w-lg">
        <CartEmpty />
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <section aria-label="Items in your bag" className="border-t border-line">
          <CartLines />
          <Link
            href="/collections/all"
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-4"
          >
            <ArrowIcon size={16} className="rotate-180" /> Continue shopping
          </Link>
        </section>
        <aside aria-label="Order summary" className="rounded-img border border-line bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="mb-5 font-display text-h3">Order summary</h2>
          <div className="mb-5">
            <FreeShippingProgress subtotal={cart.subtotal} />
          </div>
          <CartSummary />
          <PaymentBadges className="mt-6 justify-center" />
        </aside>
      </div>
      <TrustStrip className="mt-16 rounded-img border-x" compact />
    </>
  );
}
