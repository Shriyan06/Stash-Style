import Link from "next/link";
import { EmptyDishArt } from "@/components/collection/EmptyState";
import { mainNav } from "@/config/nav";
import { pageMetadata } from "@/lib/seo";
import { StoreChrome } from "@/components/layout/StoreChrome";

export const metadata = { ...pageMetadata({ title: "Page not found", path: "/404", noindex: true }) };

export default function NotFound() {
  return (
    <StoreChrome>
      <div className="container-x flex flex-col items-center py-20 text-center lg:py-28">
        <EmptyDishArt />
        <p className="eyebrow mt-8 text-accent-strong">Error 404</p>
        <h1 className="mt-3 font-display text-h1">This page wandered off</h1>
        <p className="mt-3 max-w-md text-muted">
          The link may be old or mistyped. Search for what you need, or pick a collection.
        </p>
        <form action="/search" role="search" className="mt-8 flex w-full max-w-md gap-2">
          <label htmlFor="nf-q" className="sr-only">
            Search products
          </label>
          <input
            id="nf-q"
            name="q"
            type="search"
            placeholder="Search the shop"
            className="field flex-1 rounded-full! px-5"
          />
          <button type="submit" className="min-h-12 rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-surface">
            Search
          </button>
        </form>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {mainNav
            .filter((n) => n.href.startsWith("/collections"))
            .map((n) => (
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
        <Link href="/" className="mt-8 text-sm underline underline-offset-4">
          Back to the homepage
        </Link>
      </div>
    </StoreChrome>
  );
}
