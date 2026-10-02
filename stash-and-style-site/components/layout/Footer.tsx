import Link from "next/link";
import { footerLearn, footerPolicies } from "@/config/nav";
import { site } from "@/config/site";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { PaymentBadges } from "./PaymentBadges";
import { SocialLinks } from "./SocialLinks";
import { Wordmark } from "./Wordmark";

function LinkList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const id = `footer-${title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="eyebrow text-bg/70">
        {title}
      </h2>
      <ul className="mt-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-11 items-center text-[0.9375rem] hover:underline hover:underline-offset-4 sm:min-h-9"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-surface">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="Stash & Style, home" className="inline-block rounded-sm">
            <Wordmark onDark className="text-[2rem]" logoClassName="h-20" />
          </Link>
          <p className="mt-4 max-w-sm text-[0.9375rem] text-bg/75">{site.blurb}</p>
          <SocialLinks className="mt-5" />
        </div>
        <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:pl-8">
          <LinkList title="Learn more" links={footerLearn} />
          <LinkList title="Policies" links={footerPolicies} />
        </div>
        <div className="lg:col-span-4">
          <h2 className="font-display text-h3">New pieces, first.</h2>
          <p className="mt-2 mb-4 text-[0.9375rem] text-bg/75">
            Be the first to know about new collections and exclusive offers.
          </p>
          <NewsletterForm tone="dark" />
        </div>
      </div>
      <div className="border-t border-bg/15">
        <div className="container-x flex flex-col-reverse items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <p className="text-sm text-bg/70">© 2026 {site.name}</p>
          <PaymentBadges />
        </div>
      </div>
    </footer>
  );
}
