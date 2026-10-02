"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetHeader } from "@/components/ui/Sheet";
import { useCommerce, useWishlist } from "@/components/cart/CommerceProvider";
import { ArrowIcon } from "@/components/icons";
import { footerLearn, mainNav } from "@/config/nav";
import { SocialLinks } from "./SocialLinks";

export function MobileMenu() {
  const { panel, close } = useCommerce();
  const pathname = usePathname();
  const wishlist = useWishlist();

  return (
    <Sheet open={panel === "menu"} onClose={close} side="left" labelledBy="menu-title">
      {/* any link click inside closes the menu */}
      <div className="flex h-full flex-col" onClick={(e) => (e.target as HTMLElement).closest("a") && close()}>
        <SheetHeader title="Menu" titleId="menu-title" onClose={close} />
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
          <ul>
            {[{ label: "Shop all", href: "/collections/all" }, ...mainNav].map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-14 items-center justify-between font-display text-[1.75rem] leading-none"
                >
                  {item.label}
                  <ArrowIcon size={18} className="text-muted" />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-1 text-[0.9375rem]">
            <li>
              <Link href="/wishlist" className="flex min-h-11 items-center">
                Wishlist{wishlist.count ? ` (${wishlist.count})` : ""}
              </Link>
            </li>
            <li>
              <Link href="/account" className="flex min-h-11 items-center">
                Account
              </Link>
            </li>
            {footerLearn
              .filter((l) => l.href !== "/blog")
              .map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-11 items-center">
                    {l.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <div className="border-t border-line px-5 py-4">
          <SocialLinks />
        </div>
      </div>
    </Sheet>
  );
}
