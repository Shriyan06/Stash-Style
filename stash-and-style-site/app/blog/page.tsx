import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata = pageMetadata({
  title: "Blog",
  description: "Styling notes from Stash & Style: layering, stacking and mixing metals.",
  path: "/blog",
});

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <div className="container-x pt-6 pb-20 lg:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
      <header className="mt-8 max-w-2xl lg:mt-12">
        <h1 className="font-display text-h1">Style notes</h1>
        <p className="mt-3 text-muted">How to layer, stack and mix pieces so they look like you.</p>
      </header>

      {posts.length === 0 ? (
        <div className="mt-12 grid items-center gap-10 rounded-img border border-line bg-surface p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-accent-strong">First post coming soon</p>
            <h2 className="mt-3 font-display text-h2">We&rsquo;re writing our first style notes</h2>
            <p className="mt-3 text-muted">
              Expect short, practical guides to layering necklaces, stacking rings and mixing gold-tone with
              silver-tone. Get them in your inbox, or follow {site.socialHandle} in the meantime.
            </p>
          </div>
          <NewsletterForm />
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-img bg-blush">
                  {p.cover && (
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="zoom-img object-cover"
                    />
                  )}
                </div>
                <p className="mt-4 text-sm text-muted">
                  {p.date && <time dateTime={p.date}>{formatDate(p.date)}</time>} · {p.readingMinutes} min read
                </p>
                <h2 className="mt-1 font-display text-h3 group-hover:underline">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-muted">{p.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
