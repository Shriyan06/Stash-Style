"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CloseIcon } from "@/components/icons";
import { createLocalStore } from "@/lib/storage";

const dismissed = createLocalStore<boolean>("ss-announce-dismissed", false, "session");
const noop = () => () => {};

/** Rotating announcement. Pauses on hover/focus, static under reduced motion, dismissible per session. */
export function AnnouncementBar({ messages }: { messages: readonly string[] }) {
  const isDismissed = dismissed.useValue();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    noop,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );

  useEffect(() => {
    if (paused || reduced || messages.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, [paused, reduced, messages.length]);

  if (!messages.length || isDismissed) return null;

  return (
    <div
      className="relative bg-navy-deep text-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x flex h-11 items-center justify-center px-12">
        <p className="eyebrow text-[0.6875rem]">
          {messages.map((m, n) => (
            <span key={m} hidden={n !== i} className={n === i ? "fade-in inline-block" : undefined}>
              {m}
            </span>
          ))}
        </p>
      </div>
      <button
        type="button"
        onClick={() => dismissed.set(true)}
        className="absolute top-0 right-1 inline-flex size-11 items-center justify-center rounded-full hover:bg-bg/10 sm:right-3"
        aria-label="Dismiss announcement"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
