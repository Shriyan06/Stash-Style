import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function SectionHeading({
  id,
  eyebrow,
  title,
  link,
  children,
  className,
  onDark,
}: {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  link?: { href: string; label: string };
  children?: React.ReactNode;
  className?: string;
  /** Use on navy sections. */
  onDark?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-3", className)}>
      <div>
        {eyebrow && <p className={cn("eyebrow mb-2", onDark ? "text-accent" : "text-accent-strong")}>{eyebrow}</p>}
        <h2 id={id} className="font-display text-h2">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {children}
        {link && (
          <Link
            href={link.href}
            className="group/l inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium"
          >
            <span
              className={cn(
                "underline underline-offset-[6px]",
                onDark
                  ? "decoration-surface/40 group-hover/l:decoration-surface"
                  : "decoration-line-strong group-hover/l:decoration-ink",
              )}
            >
              {link.label}
            </span>
            <ArrowIcon size={16} className="transition-transform duration-200 group-hover/l:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
