import Link from "next/link";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ContactForm } from "@/components/forms/ContactForm";
import { MailIcon } from "@/components/icons";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `Get in touch with ${site.name}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-x pt-6 pb-20 lg:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ]}
      />
      <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <h1 className="font-display text-h1">Get in touch</h1>
          <p className="mt-4 max-w-md text-muted">
            Questions about a piece, an order or a return? Send us a message. You might find a quick answer in our{" "}
            <Link href="/faq" className="text-ink underline underline-offset-4">
              FAQ
            </Link>
            .
          </p>
          <div className="mt-8 space-y-4">
            {site.supportEmail && (
              <p className="flex items-center gap-3">
                <MailIcon className="text-accent-strong" />
                <a href={`mailto:${site.supportEmail}`} className="underline underline-offset-4">
                  {site.supportEmail}
                </a>
              </p>
            )}
            {site.businessAddress && <p className="whitespace-pre-line text-muted">{site.businessAddress}</p>}
            <div>
              <p className="eyebrow text-muted">Find us on</p>
              <SocialLinks className="mt-2" />
            </div>
          </div>
        </div>
        <div className="rounded-img border border-line bg-surface p-6 sm:p-8">
          {site.supportEmail ? (
            <ContactForm to={site.supportEmail} />
          ) : (
            <div>
              <h2 className="font-display text-h3">Message us on social</h2>
              <p className="mt-3 text-muted">
                The quickest way to reach us is a direct message on Instagram at {site.socialHandle}. We read every one.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {site.social.instagram && (
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-surface"
                  >
                    Message on Instagram<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {site.social.facebook && (
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full border border-ink px-6 text-[0.9375rem] font-medium"
                  >
                    Facebook<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
