import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";
import { BagIcon, LockIcon } from "@/components/icons";
import { footerPolicies } from "@/config/nav";

/** Minimal, distraction-free chrome for checkout (like Shopify's own checkout). */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link href="/" aria-label="Stash & Style, home" className="rounded-sm">
            <Wordmark priority className="text-[1.6rem] sm:text-[1.9rem]" logoClassName="h-12 sm:h-14" />
          </Link>
          <div className="flex items-center gap-1">
            <span className="hidden items-center gap-1.5 text-sm text-muted sm:inline-flex">
              <LockIcon size={16} /> Secure checkout
            </span>
            <Link
              href="/cart"
              className="ml-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Back to your bag"
            >
              <BagIcon />
            </Link>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <footer className="border-t border-line">
        <nav aria-label="Policies" className="container-x flex flex-wrap gap-x-5 gap-y-1 py-6 text-sm">
          {footerPolicies.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </footer>
    </>
  );
}
