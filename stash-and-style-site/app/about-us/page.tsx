import Image from "next/image";
import Link from "next/link";
import { about } from "@/content/about";
import { site } from "@/config/site";
import { brandImage } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ButtonLink } from "@/components/ui/Button";
import { TrustStrip } from "@/components/home/TrustStrip";

export const metadata = pageMetadata({
  title: "About Us",
  description: `${site.name}: trend-led jewelry under $35 with free shipping and 30-day returns.`,
  path: "/about-us",
});

export default function AboutPage() {
  const img = brandImage("freshGems");
  return (
    <>
      <div className="container-x pt-6 pb-16 lg:pt-8 lg:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about-us" },
          ]}
        />
        <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <div>
            <p className="eyebrow text-accent-strong">About us</p>
            <h1 className="mt-3 font-display text-display">{about.intro}</h1>

            {about.story.length > 0 && (
              <section aria-labelledby="story" className="mt-12 max-w-prose">
                <h2 id="story" className="font-display text-h2">
                  Our story
                </h2>
                <div className="mt-4 space-y-4 text-muted">
                  {about.story.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              {about.sections.map((s) => (
                <section key={s.title} aria-labelledby={s.title}>
                  <h2 id={s.title} className="font-display text-h3">
                    {s.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-muted">
                    {s.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
              <section aria-labelledby="reach-us">
                <h2 id="reach-us" className="font-display text-h3">
                  How to reach us
                </h2>
                <div className="mt-3 space-y-3 text-muted">
                  {site.supportEmail ? (
                    <p>
                      Email{" "}
                      <a className="text-ink underline underline-offset-4" href={`mailto:${site.supportEmail}`}>
                        {site.supportEmail}
                      </a>
                      , or use our{" "}
                      <Link className="text-ink underline underline-offset-4" href="/contact">
                        contact page
                      </Link>
                      .
                    </p>
                  ) : (
                    <p>
                      Send us a message on Instagram at {site.socialHandle}, or see the{" "}
                      <Link className="text-ink underline underline-offset-4" href="/contact">
                        contact page
                      </Link>
                      .
                    </p>
                  )}
                  <SocialLinks />
                </div>
              </section>
            </div>
            <ButtonLink href="/collections" className="mt-12">
              Browse collections
            </ButtonLink>
          </div>
          {img && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-img bg-blush lg:sticky lg:top-24">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={img.blurDataURL}
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <TrustStrip />
    </>
  );
}
