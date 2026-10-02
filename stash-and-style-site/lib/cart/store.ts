"use client";

import { createLocalStore } from "@/lib/storage";
import type { ProductImage } from "@/lib/catalog/types";

export type CartLine = {
  variantId: string;
  handle: string;
  title: string;
  /** e.g. "Gold-tone / US 7" — empty for single-variant products */
  variantTitle: string;
  price: number;
  compareAtPrice: number | null;
  image: ProductImage | null;
  quantity: number;
  demo?: boolean;
};

export type CartState = { lines: CartLine[]; note: string };

export const MAX_QTY = 10;

export const cartStore = createLocalStore<CartState>("ss-cart-v1", { lines: [], note: "" });

export function addLine(line: Omit<CartLine, "quantity">, quantity = 1) {
  cartStore.set((s) => {
    const existing = s.lines.find((l) => l.variantId === line.variantId);
    const lines = existing
      ? s.lines.map((l) =>
          l.variantId === line.variantId ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l,
        )
      : [...s.lines, { ...line, quantity: Math.min(MAX_QTY, quantity) }];
    return { ...s, lines };
  });
}

export function setQuantity(variantId: string, quantity: number) {
  cartStore.set((s) => ({
    ...s,
    lines:
      quantity <= 0
        ? s.lines.filter((l) => l.variantId !== variantId)
        : s.lines.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l)),
  }));
}

export const removeLine = (variantId: string) => setQuantity(variantId, 0);

export const setNote = (note: string) => cartStore.set((s) => ({ ...s, note: note.slice(0, 500) }));

export const clearCart = () => cartStore.set({ lines: [], note: "" });

export const cartCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const cartSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.price * l.quantity, 0);
