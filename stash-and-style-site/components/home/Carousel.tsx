"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Scroll-snap carousel. Native swipe on touch, arrow buttons on desktop,
 * and the track itself is focusable so arrow keys scroll it.
 */
export function Carousel({
  label,
  children,
  itemClassName = "w-[68%] sm:w-[42%] lg:w-[calc((100%-4.5rem)/4)]",
}: {
  label: string;
  children: React.ReactNode[];
  itemClassName?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-surface transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line-strong";

  return (
    <div className="relative">
      <div className="mb-4 hidden justify-end gap-2 lg:flex">
        <button
          type="button"
          className={arrow}
          onClick={() => scroll(-1)}
          disabled={edges.start}
          aria-label={`Previous: ${label}`}
        >
          <ChevronIcon dir="left" />
        </button>
        <button
          type="button"
          className={arrow}
          onClick={() => scroll(1)}
          disabled={edges.end}
          aria-label={`Next: ${label}`}
        >
          <ChevronIcon />
        </button>
      </div>
      <ul
        ref={track}
        tabIndex={0}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0"
      >
        {children.map((child, i) => (
          <li key={i} className={cn("shrink-0 snap-start", itemClassName)}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}
