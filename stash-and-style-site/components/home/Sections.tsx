import Image from "next/image";
import Link from "next/link";
import type { Collection, ProductSummary } from "@/lib/catalog/types";
import { brandImage } from "@/lib/brand";
import { site } from "@/config/site";
import { ArrowIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Carousel } from "./Carousel";
import { CategoryTile } from "./CategoryTile";
import { HangTag } from "./HangTag";
import { SectionHeading } from "./SectionHeading";

export function ShopByCategory({ collections }: { collections: Collection[] }) {
  return (
    <section aria-labelledby="cat-title" className="container-x reveal py-16 lg:py-24">
      <SectionHeading
        id="cat-title"
        eyebrow="Shop by category"
        title="Find your next favorite"
        link={{ href: "/collections", label: "All collections" }}
      />
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-5 lg:gap-x-6">
        {collections.map((c, i) => (
          <li
            key={c.handle}
            className={i === collections.length - 1 && collections.length % 2 ? "col-span-2 lg:col-span-1" : ""}
          >
            <CategoryTile
              collection={c}
              aspect={
                i === collections.length - 1 && collections.length % 2 ? "aspect-[8/5] lg:aspect-[4/5]" : "aspect-[4/5]"
              }
              sizes={
                i === collections.length - 1 ? "(min-width: 1024px) 20vw, 100vw" : "(min-width: 1024px) 20vw, 50vw"
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ComingSoonCard() {
  return (
    <div className="grid overflow-hidden rounded-img border border-line bg-surface md:grid-cols-[1fr_1.2fr]">
      <div className="relative min-h-56 bg-blush">
        <HangTag
          top="Coming"
          amount="Soon"
          bottom="new pieces"
          className="absolute top-0 left-1/2 origin-top -translate-x-1/2 scale-[0.85]"
          stringLength={28}
        />
      </div>
      <div className="p-6 sm:p-10">
        <h3 className="font-display text-h3">New pieces landing soon</h3>
        <p className="mt-2 mb-6 max-w-md text-muted">
          We&rsquo;re adding the first drop of rings, hoops and layering chains. Leave your email and we&rsquo;ll tell
          you when they&rsquo;re in.
        </p>
        <NewsletterForm />
      </div>
    </div>
  );
}

export function NewArrivals({ products }: { products: ProductSummary[] }) {
  return (
    <section aria-labelledby="new-title" className="reveal bg-surface py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading
          id="new-title"
          eyebrow="Just in"
          title="New arrivals"
          link={products.length ? { href: "/collections/all?sort=newest", label: "Shop all new" } : undefined}
          className="mb-8"
        />
        {products.length ? (
          <Carousel label="New arrivals">
            {products.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </Carousel>
        ) : (
          <ComingSoonCard />
        )}
      </div>
    </section>
  );
}

export function EditorialSplit() {
  const img = brandImage("braceletFeature");
  return (
    <section aria-labelledby="stack-title" className="container-x reveal py-16 lg:py-24">
      <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-img bg-blush">
          {img && (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={img.blurDataURL}
              className="object-cover"
            />
          )}
        </div>
        <div className="max-w-md">
          <p className="eyebrow text-accent-strong">Bracelets</p>
          <h2 id="stack-title" className="mt-3 font-display text-h1">
            Stack them <em className="font-medium">your</em> way
          </h2>
          <p className="mt-4 text-muted">
            One chain on its own is easy. Three is a look. Mix gold-tone with silver-tone, thin with chunky, and add one
            piece at a time until it feels like yours.
          </p>
          <ButtonLink href="/collections/bracelets" className="mt-8">
            Shop bracelets
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

const gifts = [
  {
    title: "For the hoop lover",
    text: "Everyday hoops and drops to wear on repeat.",
    href: "/collections/earrings",
    cta: "Shop earrings",
  },
  {
    title: "For the stacker",
    text: "Thin bands and statement rings to build a stack.",
    href: "/collections/rings-1",
    cta: "Shop rings",
  },
  {
    title: "Ready to give",
    text: "Matching sets, already put together for you.",
    href: "/collections/elegance-set",
    cta: "Shop sets",
  },
];

export function Gifts() {
  return (
    <section aria-labelledby="gift-title" className="reveal bg-blush py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading
          id="gift-title"
          eyebrow="Gift guide"
          title={
            <>
              Gifts under <em className="font-medium">$35</em>
            </>
          }
        />
        <ul className="mt-8 grid gap-4 md:grid-cols-3 lg:gap-6">
          {gifts.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group relative flex h-full flex-col rounded-img border border-ink/10 bg-bg p-6 pt-10 transition-shadow duration-200 hover:shadow-soft sm:p-8 sm:pt-12"
              >
                {/* punched tag hole: echoes the hero's hang tag */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 left-1/2 size-3.5 -translate-x-1/2 rounded-full border-2 border-accent bg-blush"
                />
                <h3 className="font-display text-h3">{g.title}</h3>
                <p className="mt-2 text-muted">{g.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
                  {g.cta}{" "}
                  <ArrowIcon size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const tips = [
  {
    title: "Mixing metals",
    text: "Start with one piece that has both gold-tone and silver-tone in it. It ties everything else together.",
    slug: "mixing-metals",
  },
  {
    title: "Layering necklaces",
    text: "Pick chains about two inches apart in length so each one sits on its own instead of tangling.",
    slug: "layering-necklaces",
  },
  {
    title: "Stacking rings",
    text: "Anchor the stack with one statement ring, then add thin bands either side. Mixed widths keep it light.",
    slug: "stacking-rings",
  },
];

export function StyleTips({ postSlugs }: { postSlugs: string[] }) {
  return (
    <section aria-labelledby="tips-title" className="container-x reveal py-16 lg:py-24">
      <SectionHeading
        id="tips-title"
        eyebrow="Style notes"
        title="Small tricks, big difference"
        link={postSlugs.length ? { href: "/blog", label: "Read the blog" } : undefined}
      />
      <ul className="mt-8 grid gap-x-8 gap-y-6 border-t border-line pt-8 md:grid-cols-3">
        {tips.map((t) => {
          const linked = postSlugs.includes(t.slug);
          const body = (
            <>
              <h3 className="font-display text-h3">{t.title}</h3>
              <p className="mt-2 text-muted">{t.text}</p>
              {linked && (
                <span className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
                  Read more <ArrowIcon size={16} />
                </span>
              )}
            </>
          );
          return (
            <li key={t.slug}>
              {linked ? (
                <Link href={`/blog/${t.slug}`} className="block hover:text-accent-strong">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const tiles = ["#F3E3DC", "#DDE5DA", "#EFE6DA", "#E9D6BE", "#F3E3DC", "#DDE5DA"];

export function FollowStrip() {
  const { instagram, tiktok } = site.social;
  if (!instagram && !tiktok) return null;
  return (
    <section aria-labelledby="follow-title" className="reveal border-t border-line bg-surface py-16 lg:py-20">
      <div className="container-x text-center">
        <p className="eyebrow text-accent-strong">See it worn</p>
        <h2 id="follow-title" className="mt-2 font-display text-h2">
          Follow {site.socialHandle}
        </h2>
        <ul aria-hidden="true" className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {tiles.map((c, i) => (
            <li
              key={i}
              className="flex aspect-square items-center justify-center rounded-img"
              style={{ background: c }}
            >
              {i === 2 && <span className="font-display text-2xl text-accent-strong italic">S&amp;S</span>}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-surface hover:bg-[#3a332e]"
            >
              <InstagramIcon size={18} /> Instagram<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {tiktok && (
            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink px-6 text-[0.9375rem] font-medium hover:bg-ink hover:text-surface"
            >
              <TikTokIcon size={18} /> TikTok<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section aria-labelledby="news-title" className="reveal bg-sage/60 py-16 lg:py-24">
      <div className="container-x grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <h2 id="news-title" className="font-display text-h2 lg:text-h1">
          Be the first to know about new collections and exclusive offers
        </h2>
        <NewsletterForm />
      </div>
    </section>
  );
}
