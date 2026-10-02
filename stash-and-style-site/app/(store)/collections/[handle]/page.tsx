import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CollectionView, CollectionViewFromUrl } from "@/components/collection/CollectionView";
import { EmptyCollection } from "@/components/collection/EmptyState";
import { getCollection, getCollections, getProducts, toSummary } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  const collections = await getCollections();
  return [...collections.map((c) => ({ handle: c.handle })), { handle: "all" }];
}

export async function generateMetadata({ params }: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const c = await getCollection(handle);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.description, path: `/collections/${handle}` });
}

export default async function CollectionPage({ params }: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();
  const { products } = await getProducts({ collection: handle, limit: 10_000 });
  const summaries = products.map(toSummary);

  return (
    <div className="container-x pt-6 pb-20 lg:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          { name: collection.title, path: `/collections/${handle}` },
        ]}
      />
      <header className="mt-6 mb-8 max-w-2xl lg:mt-10 lg:mb-12">
        <h1 className="font-display text-h1">{collection.title}</h1>
        <p className="mt-3 text-muted">{collection.description}</p>
      </header>

      {summaries.length === 0 ? (
        <EmptyCollection currentHandle={handle} />
      ) : (
        <Suspense fallback={<CollectionView products={summaries} collectionHandle={handle} />}>
          <CollectionViewFromUrl products={summaries} collectionHandle={handle} />
        </Suspense>
      )}
    </div>
  );
}
