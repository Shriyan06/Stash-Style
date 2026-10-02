"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { useCart, useCommerce, useWishlist } from "@/components/cart/CommerceProvider";
import { mainNav } from "@/config/nav";
import { cn } from "@/lib/cn";
import { Wordmark } from "./Wordmark";

const iconBtn =
  "relative size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-ink/5";

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span
      key={n}
      aria-hidden="true"
      className="pop absolute top-1 right-0.5 inline-flex min-w-[1.125rem] items-center justify-center rounded-full bg-accent-strong px-1 text-[0.625rem] leading-[1.125rem] font-semibold text-accent-ink tabular-nums"
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

export function Header() {
  const { open } = useCommerce();
  const { count } = useCart();
  const wishlist = useWishlist();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [added, setAdded] = useState(0);

  // the bag icon wiggles whenever something is added
  useEffect(() => {
    const onAdd = () => setAdded((n) => n + 1);
    window.addEventListener("ss:added", onAdd);
    return () => window.removeEventListener("ss:added", onAdd);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // "/" opens search (unless typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      e.preventDefault();
      open("search");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-bg/95 backdrop-blur-md transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-line shadow-[0_1px_0_rgb(31_27_24/0.02)]" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "container-x grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-200 ease-brand",
          scrolled ? "h-16" : "h-[4.75rem] sm:h-20",
        )}
      >
        {/* Left: menu (mobile) / nav (desktop) */}
        <div className="flex items-center">
          <button
            type="button"
            className={cn(iconBtn, "-ml-2.5 inline-flex xl:hidden")}
            onClick={() => open("menu")}
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <MenuIcon size={22} />
          </button>
          <button
            type="button"
            className={cn(iconBtn, "inline-flex xl:hidden")}
            onClick={() => open("search")}
            aria-label="Search"
            aria-haspopup="dialog"
          >
            <SearchIcon />
          </button>
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-x-5 2xl:gap-x-8">
              {mainNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[0.875rem] font-medium tracking-[0.01em] whitespace-nowrap",
                        "after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100",
                        active && "after:scale-x-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Center: logo */}
        <Link href="/" className="justify-self-center rounded-sm px-1" aria-label="Stash & Style, home">
          <Wordmark
            priority
            className={cn(
              "transition-[font-size] duration-200",
              scrolled ? "text-[1.5rem]" : "text-[1.625rem] sm:text-[1.875rem]",
            )}
            logoClassName={cn("transition-[height] duration-200 ease-brand", scrolled ? "h-12" : "h-[3.75rem] sm:h-16")}
          />
        </Link>

        {/* Right: actions */}
        <div className="-mr-2.5 flex items-center justify-self-end">
          <button
            type="button"
            className={cn(iconBtn, "hidden xl:inline-flex")}
            onClick={() => open("search")}
            aria-label="Search (press /)"
            aria-haspopup="dialog"
          >
            <SearchIcon />
          </button>
          <Link
            href="/wishlist"
            className={cn(iconBtn, "hidden sm:inline-flex")}
            aria-label={`Wishlist, ${wishlist.count} ${wishlist.count === 1 ? "item" : "items"}`}
          >
            <HeartIcon />
            <CountBadge n={wishlist.count} />
          </Link>
          <Link href="/account" className={cn(iconBtn, "hidden sm:inline-flex")} aria-label="Account">
            <UserIcon />
          </Link>
          <button
            type="button"
            className={cn(iconBtn, "inline-flex")}
            onClick={() => open("cart")}
            aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
            aria-haspopup="dialog"
          >
            <span key={added} className={added ? "wiggle inline-flex" : "inline-flex"}>
              <BagIcon />
            </span>
            <CountBadge n={count} />
          </button>
        </div>
      </div>
    </header>
  );
}
