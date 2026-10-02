"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page: any element with class "reveal"
 * fades up the first time it scrolls into view. Re-scans on route change.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true"; // lets tests wait for interactivity
    const els = document.querySelectorAll<HTMLElement>(".reveal:not([data-shown])");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => (el.dataset.shown = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = "true";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
