import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "accent" | "gold" | "ghost" | "light" | "outline-light";
type Size = "md" | "sm";

const base =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-brand active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-surface hover:bg-navy",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-surface",
  accent: "bg-accent-strong text-accent-ink hover:bg-[#6f4f18]",
  gold: "bg-accent text-ink hover:bg-[#d8b878] shine",
  ghost: "text-ink hover:bg-ink/5",
  "outline-light": "border border-surface/70 text-surface hover:bg-surface hover:text-ink",
  light: "bg-surface text-ink hover:bg-bg",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-7 text-[0.9375rem]",
  sm: "min-h-11 px-5 text-sm",
};

export function buttonClass(variant: ButtonVariant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
};

export function Button({ variant, size, loading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="absolute inset-0 m-auto size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: Size };

export function ButtonLink({ variant, size, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}
