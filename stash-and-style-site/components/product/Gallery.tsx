"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductImage as Img } from "@/lib/catalog/types";
import { ChevronIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { ProductImage } from "./ProductImage";

/**
 * Gallery: swipe (scroll-snap) on touch with native pinch-zoom, hover zoom on desktop,
 * thumbnails and arrow keys for keyboard users.
 */
export function Gallery({ images, title, activeIndex }: { images: Img[]; title: string; activeIndex?: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const list = images.length ? images : [null];

  const go = (i: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(list.length - 1, i));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth && !reduce ? "smooth" : "auto" });
  };

  // jump to the selected variant's image
  useEffect(() => {
    if (activeIndex != null) go(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setCurrent(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[4.5rem_1fr] lg:items-start lg:gap-4">
      {list.length > 1 && (
        <ul
          className="order-2 mt-3 flex gap-2 overflow-x-auto lg:order-none lg:mt-0 lg:flex-col"
          aria-label="Choose image"
        >
          {list.map((img, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show image ${i + 1} of ${list.length}`}
                aria-current={current === i}
                className={cn(
                  "relative block aspect-[4/5] w-16 overflow-hidden rounded-img border transition-colors lg:w-full",
                  current === i ? "border-ink" : "border-transparent opacity-75 hover:opacity-100",
                )}
              >
                <ProductImage image={img ? { ...img, alt: "" } : null} sizes="72px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <div
          ref={track}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${title} images. Use left and right arrow keys to browse.`}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(current + 1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(current - 1);
            }
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-img"
        >
          {list.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-blush [@media(pointer:fine)]:cursor-zoom-in"
              onMouseMove={(e) => {
                if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
              aria-hidden={i !== current ? true : undefined}
            >
              <div
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={
                  zoom && i === current
                    ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              >
                <ProductImage image={img} sizes="(min-width: 1024px) 50vw, 100vw" priority={i === 0} title={title} />
              </div>
            </div>
          ))}
        </div>

        {list.length > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between md:flex">
              <button
                type="button"
                onClick={() => go(current - 1)}
                disabled={current === 0}
                className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-surface/90 shadow-soft disabled:opacity-0"
                aria-label="Previous image"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                onClick={() => go(current + 1)}
                disabled={current === list.length - 1}
                className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-surface/90 shadow-soft disabled:opacity-0"
                aria-label="Next image"
              >
                <ChevronIcon />
              </button>
            </div>
            <p
              className="absolute right-3 bottom-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs tabular-nums md:hidden"
              aria-hidden="true"
            >
              {current + 1} / {list.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
