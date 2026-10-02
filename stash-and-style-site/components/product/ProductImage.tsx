import Image from "next/image";
import type { ProductImage as Img } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

/**
 * Fills its (positioned, aspect-ratio'd) parent. Renders a tinted block for demo
 * products or missing images, so layout never shifts and nothing looks broken.
 */
export function ProductImage({
  image,
  sizes,
  priority,
  className,
  title,
}: {
  image: Img | null;
  sizes: string;
  priority?: boolean;
  className?: string;
  title?: string;
}) {
  if (image?.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div
      role={image ? "img" : undefined}
      aria-label={image?.alt}
      aria-hidden={image ? undefined : true}
      className={cn("absolute inset-0 flex items-center justify-center", className)}
      style={{ background: image?.tint ?? "var(--blush)" }}
    >
      {title && (
        // SVG monogram: decorative watermark, not text content
        <svg aria-hidden="true" viewBox="0 0 60 30" className="w-14 opacity-25">
          <text
            x="30"
            y="22"
            textAnchor="middle"
            fontSize="22"
            fontStyle="italic"
            fill="currentColor"
            fontFamily="var(--font-display), serif"
          >
            S&amp;S
          </text>
        </svg>
      )}
    </div>
  );
}
