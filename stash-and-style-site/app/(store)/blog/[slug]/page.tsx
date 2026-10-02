import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, getRelatedPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/product/ShareButtons";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = getPost(slug);
  return p
    ? pageMetadata({
        title: p.title,
        description: p.excerpt || undefined,
        path: `/blog/${slug}`,
        image: p.cover || undefined,
        type: "article",
      })
    : {};
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);
  return (
    <article className="container-x pt-6 pb-20 lg:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ]}
      />
      <header className="mx-auto mt-10 max-w-3xl text-center">
        <p className="text-sm text-muted">
          {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>} · {post.readingMinutes} min read
        </p>
        <h1 className="mt-3 font-display text-h1">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-muted">{post.excerpt}</p>}
      </header>
      {post.cover && (
        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-img bg-tint">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="prose-s mx-auto mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
      <div className="mx-auto mt-10 max-w-[68ch] border-t border-line pt-6">
        <ShareButtons title={post.title} path={`/blog/${slug}`} />
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related-posts" className="mx-auto mt-16 max-w-5xl">
          <h2 id="related-posts" className="font-display text-h2">
            Keep reading
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`} className="block hover:underline">
                  <p className="font-display text-h3">{r.title}</p>
                  <p className="mt-1 text-sm text-muted">{r.readingMinutes} min read</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date || undefined,
          image: post.cover ? absoluteUrl(post.cover) : undefined,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
          mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
        }}
      />
    </article>
  );
}
