import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/catalog/types";
import { brandImage } from "@/lib/brand";
import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Typographic tile for collections without imagery (e.g. Necklaces). */
export function MonogramArt({ label, className }: { label: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 flex flex-col items-center justify-center bg-navy", className)}
    >
      <span className="font-display text-[clamp(3.5rem,9vw,6rem)] leading-none font-medium text-accent italic">
        S&amp;S
      </span>
      <span className="mt-3 h-px w-10 bg-accent" />
      <span className="eyebrow mt-3 text-surface/80">{label}</span>
    </div>
  );
}

export function CategoryTile({
  collection,
  className,
  sizes = "(min-width: 1024px) 20vw, 50vw",
  aspect = "aspect-[4/5]",
}: {
  collection: Collection;
  className?: string;
  sizes?: string;
  aspect?: string;
}) {
  const img = brandImage(collection.image);
  return (
    <Link href={`/collections/${collection.handle}`} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden rounded-img bg-tint", aspect)}>
        {img ? (
          <Image
            src={img.src}
            alt=""
            fill
            sizes={sizes}
            placeholder="blur"
            blurDataURL={img.blurDataURL}
            className="zoom-img object-cover"
          />
        ) : (
          <MonogramArt label={collection.title} />
        )}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center bg-gradient-to-t from-ink/75 to-transparent pt-10 pb-4 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-surface">
            Shop {collection.shortLabel} <ArrowIcon size={15} />
          </span>
        </div>
      </div>
      <p className="mt-3 font-display text-[1.375rem] leading-tight">{collection.title}</p>
    </Link>
  );
}
