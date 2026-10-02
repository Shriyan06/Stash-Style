"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Slide } from "@/content/home";
import type { BrandImage } from "@/lib/brand";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { HangTag } from "./HangTag";

const INTERVAL = 6500;
const noop = () => () => {};

/**
 * Homepage slideshow (WAI-ARIA carousel pattern):
 * - autoplays, pauses on hover/focus, has a visible pause button
 * - never autoplays when the visitor prefers reduced motion
 * - arrows, dots, keyboard (← →) and swipe
 * - inactive slides are inert, so focus and screen readers only see the current one
 */
export function HeroSlideshow({ slides, images }: { slides: Slide[]; images: (BrandImage | null)[] }) {
  const [index, setIndex] = useState(0);
  const [visits, setVisits] = useState(0); // remounts the tag so it swings each time slide 1 returns
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reduced = useSyncExternalStore(
    noop,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const touchX = useRef<number | null>(null);
  // Only the first slide's image loads up front; the rest wait until the page has settled.
  const [loadRest, setLoadRest] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoadRest(true), 2500);
    return () => clearTimeout(t);
  }, []);
  const count = slides.length;
  const playing = !userPaused && !reduced && !hovering && count > 1;

  const go = useCallback(
    (n: number) => {
      const next = (n + count) % count;
      setLoadRest(true);
      setIndex(next);
      if (next === 0) setVisits((v) => v + 1);
    },
    [count],
  );

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [playing, index, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="on-navy relative isolate overflow-hidden bg-navy text-surface"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div
        className="relative min-h-[min(88svh,46rem)] md:min-h-[min(82svh,48rem)]"
        aria-live={playing ? "off" : "polite"}
      >
        {slides.map((s, i) => {
          const img = images[i];
          const active = i === index;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              data-active={active || undefined}
              className={cn(
                "slide absolute inset-0 transition-opacity duration-700 ease-brand",
                active ? "z-10 opacity-100" : "z-0 opacity-0",
              )}
            >
              {img && (i === 0 || loadRest) && (
                <div className="kenburns absolute inset-0 -z-20">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={i === 0}
                    fetchPriority={i === 0 ? "high" : "low"}
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={img.blurDataURL}
                    className="object-cover object-[72%_center]"
                  />
                </div>
              )}
              {/* Navy scrim keeps white text at AA over any photo */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(11_24_51/0.96)_0%,rgb(11_24_51/0.82)_45%,rgb(11_24_51/0.15)_80%)] md:bg-[linear-gradient(to_right,rgb(11_24_51/0.95)_0%,rgb(11_24_51/0.8)_40%,rgb(11_24_51/0)_72%)]"
              />

              <div className="container-x relative flex h-full items-end pt-44 pb-28 md:items-center md:py-24">
                <div className="stagger max-w-[36rem]">
                  <p className="eyebrow text-accent" style={{ "--i": 0 } as React.CSSProperties}>
                    {s.eyebrow}
                  </p>
                  {i === 0 ? (
                    <h1 className="mt-4 font-display text-display" style={{ "--i": 1 } as React.CSSProperties}>
                      {s.title} <em className="font-medium text-accent">{s.emphasis}</em>
                    </h1>
                  ) : (
                    <h2 className="mt-4 font-display text-display" style={{ "--i": 1 } as React.CSSProperties}>
                      {s.title} <em className="font-medium text-accent">{s.emphasis}</em>
                    </h2>
                  )}
                  <p
                    className="mt-5 max-w-[30rem] text-[1.0625rem] text-on-navy-muted sm:text-lg"
                    style={{ "--i": 2 } as React.CSSProperties}
                  >
                    {s.text}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3" style={{ "--i": 3 } as React.CSSProperties}>
                    <ButtonLink href={s.primary.href} variant="gold">
                      {s.primary.label}
                    </ButtonLink>
                    {s.secondary && (
                      <ButtonLink href={s.secondary.href} variant="outline-light">
                        {s.secondary.label}
                      </ButtonLink>
                    )}
                  </div>
                </div>

                {s.tag && active && (
                  <HangTag
                    key={visits}
                    onDark
                    className="absolute top-0 right-5 origin-top scale-[0.62] sm:right-10 sm:scale-75 md:right-[8%] lg:right-[12%] lg:scale-100"
                    stringLength={72}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="container-x flex items-center gap-3 pb-6 md:pb-8">
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-surface/40 transition-colors hover:bg-surface hover:text-ink"
              aria-label={userPaused || reduced ? "Play slideshow" : "Pause slideshow"}
            >
              {userPaused || reduced ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor" />
                </svg>
              )}
            </button>
            <ol className="flex items-center gap-1" aria-label="Choose slide">
              {slides.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}: ${s.title} ${s.emphasis}`}
                    aria-current={i === index}
                    className="group/dot flex h-11 w-10 items-center sm:w-14"
                  >
                    <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-surface/30 transition-colors group-hover/dot:bg-surface/50">
                      {i === index && (
                        <span
                          key={`${index}-${playing}`}
                          className={cn("slide-progress absolute inset-0 origin-left bg-accent", !playing && "paused")}
                          style={{ animationDuration: `${INTERVAL}ms` }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="ml-auto hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-surface/40 transition-colors hover:bg-surface hover:text-ink"
                aria-label="Previous slide"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-surface/40 transition-colors hover:bg-surface hover:text-ink"
                aria-label="Next slide"
              >
                <ChevronIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
