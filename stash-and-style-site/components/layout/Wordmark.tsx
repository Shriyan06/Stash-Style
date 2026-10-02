import Image from "next/image";
import { brandLogo } from "@/lib/brand";
import { cn } from "@/lib/cn";

/**
 * The brand logo (public/brand/logo.png, or logo-light.png on navy backgrounds).
 * Falls back to a typeset wordmark if no logo file exists.
 * `logoClassName` sizes the image (set a height); `className` styles the text fallback.
 */
export function Wordmark({
  className,
  logoClassName = "h-12",
  onDark,
  priority,
}: {
  className?: string;
  logoClassName?: string;
  onDark?: boolean;
  priority?: boolean;
}) {
  if (brandLogo) {
    return (
      <Image
        src={onDark && brandLogo.srcOnDark ? brandLogo.srcOnDark : brandLogo.src}
        alt="Stash & Style"
        width={brandLogo.width}
        height={brandLogo.height}
        className={cn("w-auto", logoClassName)}
        sizes="200px"
        priority={priority}
      />
    );
  }
  return (
    <span
      className={cn(
        "font-display text-[1.75rem] leading-none font-semibold tracking-[-0.01em] whitespace-nowrap",
        className,
      )}
    >
      Stash <span className={cn("font-medium italic", onDark ? "text-accent" : "text-accent-strong")}>&amp;</span> Style
    </span>
  );
}
