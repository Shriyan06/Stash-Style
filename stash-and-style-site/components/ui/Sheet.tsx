"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { CloseIcon } from "@/components/icons";

type Side = "left" | "right" | "bottom" | "top" | "center";

/**
 * Drawer / modal built on the native <dialog> element:
 * - showModal() makes the rest of the page inert (focus is trapped inside)
 * - Esc closes, clicking the backdrop closes
 * - focus returns to whatever opened it
 * - body scroll is locked via `html:has(dialog[open])` in globals.css
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  label,
  labelledBy,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  side?: Side;
  label?: string;
  labelledBy?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
      returnFocus.current?.focus?.();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-side={side}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={cn("sheet text-ink", className)}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}

export function SheetHeader({
  title,
  titleId,
  onClose,
  children,
}: {
  title: React.ReactNode;
  titleId?: string;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-16 items-center justify-between gap-4 border-b border-line px-5">
      <h2 id={titleId} className="font-display text-2xl">
        {title}
      </h2>
      {children}
      <button
        type="button"
        onClick={onClose}
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-ink/5"
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
