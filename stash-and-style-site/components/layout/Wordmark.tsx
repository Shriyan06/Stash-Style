import Image from "next/image";
import { brandLogo } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Uses the downloaded logo when present, otherwise the typographic wordmark. */
export function Wordmark({ className }: { className?: string }) {
  if (brandLogo) {
    return (
      <Image
        src={brandLogo.src}
        alt="Stash & Style"
        width={brandLogo.width}
        height={brandLogo.height}
        className={cn("h-9 w-auto", className)}
        priority
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
      Stash <span className="font-medium text-accent-strong italic">&amp;</span> Style
    </span>
  );
}
