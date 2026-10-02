"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useCommerce } from "@/components/cart/CommerceProvider";

// Drawers and overlays are only needed after a click, so their code loads on first open.
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const CheckoutNotice = dynamic(() => import("@/components/cart/CartDrawer").then((m) => m.CheckoutNotice), {
  ssr: false,
});
const MobileMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu), { ssr: false });
const SearchOverlay = dynamic(() => import("@/components/search/SearchOverlay").then((m) => m.SearchOverlay), {
  ssr: false,
});

export function LazyPanels() {
  const { panel } = useCommerce();
  // remember which panels have been opened so they stay mounted (and can animate closed)
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  if (panel && !seen[panel]) setSeen((s) => ({ ...s, [panel]: true }));
  return (
    <>
      {seen.cart && <CartDrawer />}
      {seen.checkout && <CheckoutNotice />}
      {seen.menu && <MobileMenu />}
      {seen.search && <SearchOverlay />}
    </>
  );
}
