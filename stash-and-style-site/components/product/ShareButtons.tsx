"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckIcon, LinkIcon, ShareIcon } from "@/components/icons";

const noop = () => () => {};

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator.share === "function",
    () => false,
  );
  const url = () => new URL(path, window.location.origin).toString();
  const btn = "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm hover:bg-ink/5";

  return (
    <div className="-ml-3 flex flex-wrap items-center gap-1">
      <button
        type="button"
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard blocked: nothing to do */
          }
        }}
      >
        {copied ? <CheckIcon size={18} /> : <LinkIcon size={18} />}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
      {canShare && (
        <button type="button" className={btn} onClick={() => navigator.share({ title, url: url() }).catch(() => {})}>
          <ShareIcon size={18} /> Share
        </button>
      )}
    </div>
  );
}
