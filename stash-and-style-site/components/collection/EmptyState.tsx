import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { mainNav } from "@/config/nav";
import { cn } from "@/lib/cn";

/** Inline illustration: an empty trinket dish waiting for its first piece. */
export function EmptyDishArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true" className={cn("w-56", className)}>
      <ellipse cx="120" cy="118" rx="98" ry="16" fill="#E8DFD5" />
      <path d="M26 92c0 18 42 32 94 32s94-14 94-32" fill="#FFFFFF" stroke="#B8864B" strokeWidth="1.5" />
      <ellipse cx="120" cy="92" rx="94" ry="22" fill="#F3E3DC" stroke="#B8864B" strokeWidth="1.5" />
      <ellipse cx="120" cy="94" rx="70" ry="14" fill="none" stroke="#B8864B" strokeOpacity=".4" />
      <g fill="none" stroke="#855A28" strokeWidth="1.6" className="origin-center">
        <path d="M150 28c10 0 18 8 18 18s-8 18-18 18" strokeDasharray="3 4" />
        <circle cx="96" cy="40" r="3" />
        <path d="M120 14v8M116 18h8" />
      </g>
    </svg>
  );
}

export function EmptyCollection({ currentHandle, title }: { currentHandle?: string; title?: string }) {
  const others = mainNav.filter((n) => n.href.startsWith("/collections") && n.href !== `/collections/${currentHandle}`);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center lg:py-16">
      <EmptyDishArt />
      <h2 className="mt-6 font-display text-h2">{title ?? "Nothing here yet"}</h2>
      <p className="mt-3 text-muted">
        New pieces are on the way. Leave your email and we&rsquo;ll let you know when they land.
      </p>
      <NewsletterForm className="mt-6 text-left" />
      {others.length > 0 && (
        <>
          <p className="eyebrow mt-10 text-muted">Or browse</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {others.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm hover:border-ink"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
