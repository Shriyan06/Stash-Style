import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetail } from "@/components/product/ProductDetail";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { getAllProducts, getCollection, getProduct, getRecommendations, toSummary } from "@/lib/catalog";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) return {};
  const img = p.images.find((i) => i.src)?.src;
  return pageMetadata({
    title: p.title,
    description: p.description.split("\n")[0].slice(0, 160) || site.description,
    path: `/products/${handle}`,
    image: img,
    noindex: p.demo,
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const [related, collection] = await Promise.all([
    getRecommendations(handle, 4),
    getCollection(product.collections[0] ?? "all"),
  ]);

  const crumbs = [
    { name: "Home", path: "/" },
    ...(collection ? [{ name: collection.title, path: `/collections/${collection.handle}` }] : []),
    { name: product.title, path: `/products/${handle}` },
  ];

  const prices = product.variants.map((v) => v.price).filter((n) => n > 0);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.filter((i) => i.src).map((i) => i.src),
    brand: { "@type": "Brand", name: site.name },
    url: absoluteUrl(`/products/${handle}`),
    ...(prices.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: site.currency,
            lowPrice: Math.min(...prices).toFixed(2),
            highPrice: Math.max(...prices).toFixed(2),
            offerCount: product.variants.length,
            availability: product.variants.some((v) => v.available)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };

  const paragraphs = product.description.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="container-x pt-4 pb-24 lg:pt-8">
      <ProductDetail product={product} breadcrumbs={<Breadcrumbs items={crumbs} />}>
        <div className="space-y-3 text-[0.9375rem] text-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Accordion className="mt-8">
          <AccordionItem title="Details" defaultOpen>
            {product.details?.length ? (
              <ul className="list-disc space-y-1 pl-5">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              <p>Materials and measurements are listed in the description above.</p>
            )}
          </AccordionItem>
          <AccordionItem title="Shipping & returns">
            <ul className="list-disc space-y-1 pl-5">
              <li>Free shipping on every order.</li>
              {site.shipping.timeframe && <li>{site.shipping.timeframe}</li>}
              <li>
                {site.returns.windowDays}-day returns
                {site.returns.windowStarts ? `, ${site.returns.windowStarts}` : ""}.
              </li>
            </ul>
            <p className="mt-3">
              Full details in our{" "}
              <Link href="/policies/shipping-policy" className="text-ink underline underline-offset-4">
                shipping policy
              </Link>{" "}
              and{" "}
              <Link href="/policies/refund-policy" className="text-ink underline underline-offset-4">
                refund policy
              </Link>
              .
            </p>
          </AccordionItem>
          <AccordionItem title="Care">
            {product.care?.length ? (
              <ul className="list-disc space-y-1 pl-5">
                {product.care.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc space-y-1 pl-5">
                <li>Put jewelry on after perfume, lotion and hairspray.</li>
                <li>Take it off before swimming, showering or working out.</li>
                <li>Wipe with a soft dry cloth and store pieces separately so they don&rsquo;t scratch or tangle.</li>
              </ul>
            )}
          </AccordionItem>
        </Accordion>
      </ProductDetail>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-20 border-t border-line pt-12">
          <h2 id="related-title" className="font-display text-h2">
            Complete the look
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <li key={p.handle}>
                <ProductCard product={toSummary(p)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-20">
        <RecentlyViewed exclude={handle} />
      </div>

      <JsonLd data={productLd} />
    </div>
  );
}
