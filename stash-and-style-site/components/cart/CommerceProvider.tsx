"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  addLine,
  cartCount,
  cartStore,
  cartSubtotal,
  clearCart,
  removeLine,
  setNote,
  setQuantity,
  type CartLine,
} from "@/lib/cart/store";
import { toggleWishlist, wishlistStore } from "@/lib/wishlist/store";

type Panel = "cart" | "search" | "menu" | "checkout" | null;

type Ctx = {
  /** True when the Shopify provider is active (real checkout). */
  connected: boolean;
  panel: Panel;
  open: (p: Exclude<Panel, null>) => void;
  close: () => void;
  announce: (msg: string) => void;
  checkout: () => Promise<void>;
  checkoutError: string | null;
  checkingOut: boolean;
};

const CommerceCtx = createContext<Ctx | null>(null);

export function CommerceProvider({ connected, children }: { connected: boolean; children: React.ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [message, setMessage] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const tick = useRef(0);

  const announce = useCallback((msg: string) => {
    // Alternate a zero-width char so repeated identical messages are re-announced.
    tick.current++;
    setMessage(msg + (tick.current % 2 ? "​" : ""));
  }, []);

  const checkout = useCallback(async () => {
    setCheckoutError(null);
    if (!connected) {
      setPanel("checkout");
      return;
    }
    const { lines, note } = cartStore.get();
    if (!lines.length) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
          note,
        }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Checkout is unavailable right now.");
      window.location.assign(data.checkoutUrl);
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : "Checkout is unavailable right now.");
      setCheckingOut(false);
    }
  }, [connected]);

  const value = useMemo<Ctx>(
    () => ({
      connected,
      panel,
      open: setPanel,
      close: () => setPanel(null),
      announce,
      checkout,
      checkoutError,
      checkingOut,
    }),
    [connected, panel, announce, checkout, checkoutError, checkingOut],
  );

  return (
    <CommerceCtx.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
    </CommerceCtx.Provider>
  );
}

export function useCommerce() {
  const ctx = useContext(CommerceCtx);
  if (!ctx) throw new Error("useCommerce must be used inside <CommerceProvider>");
  return ctx;
}

export function useCart() {
  const state = cartStore.useValue();
  const { announce, open } = useCommerce();
  return {
    lines: state.lines,
    note: state.note,
    count: cartCount(state),
    subtotal: cartSubtotal(state),
    add(line: Omit<CartLine, "quantity">, qty = 1, { openDrawer = true } = {}) {
      addLine(line, qty);
      announce(`${line.title} added to your bag.`);
      if (openDrawer) open("cart");
    },
    setQuantity(variantId: string, qty: number) {
      setQuantity(variantId, qty);
      const line = state.lines.find((l) => l.variantId === variantId);
      if (line) announce(qty > 0 ? `${line.title} quantity ${qty}.` : `${line.title} removed from your bag.`);
    },
    remove(variantId: string) {
      const line = state.lines.find((l) => l.variantId === variantId);
      removeLine(variantId);
      if (line) announce(`${line.title} removed from your bag.`);
    },
    setNote,
    clear: clearCart,
  };
}

export function useWishlist() {
  const handles = wishlistStore.useValue();
  const { announce } = useCommerce();
  return {
    handles,
    count: handles.length,
    has: (h: string) => handles.includes(h),
    toggle(handle: string, title: string) {
      const added = toggleWishlist(handle);
      announce(added ? `${title} saved to your wishlist.` : `${title} removed from your wishlist.`);
    },
  };
}
