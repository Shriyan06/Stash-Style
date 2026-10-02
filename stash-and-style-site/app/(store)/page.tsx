import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import {
  EditorialSplit,
  FollowStrip,
  Gifts,
  NewArrivals,
  NewsletterSection,
  ShopByCategory,
  StyleTips,
} from "@/components/home/Sections";
import { JsonLd } from "@/components/JsonLd";
import { getCollections, getNewArrivals, toSummary } from "@/lib/catalog";
import { getPostSlugs } from "@/lib/blog";
import { pageMetadata, websiteLd } from "@/lib/seo";

export const metadata = pageMetadata({ path: "/" });

export default async function HomePage() {
  const [collections, arrivals] = await Promise.all([getCollections(), getNewArrivals(8)]);
  const postSlugs = getPostSlugs();
  return (
    <>
      <Hero />
      <TrustStrip />
      <ShopByCategory collections={collections} />
      <NewArrivals products={arrivals.map(toSummary)} />
      <EditorialSplit />
      <Gifts />
      <StyleTips postSlugs={postSlugs} />
      <FollowStrip />
      <NewsletterSection />
      <JsonLd data={websiteLd()} />
    </>
  );
}
