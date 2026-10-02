import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CategoryTile } from "@/components/home/CategoryTile";
import { ArrowIcon } from "@/components/icons";
import { getAllProducts, getCollections } from "@/lib/catalog";
import { pluralize } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Collections",
  description: "Shop earrings, necklaces, rings, bracelets and matching sets, all under $35.",
  path: "/collections",
});

export default async function CollectionsIndex() {
  const [collections, products] = await Promise.all([getCollections(), getAllProducts()]);
  const count = (h: string) => products.filter((p) => p.collections.includes(h)).length;
  return (
    <div className="container-x pt-6 pb-20 lg:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
        ]}
      />
      <header className="mt-6 mb-10 flex flex-wrap items-end justify-between gap-4 lg:mt-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-h1">Collections</h1>
          <p className="mt-3 text-muted">Everyday pieces in gold-tone and silver-tone, every one under $35.</p>
        </div>
        <Link
          href="/collections/all"
          className="inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-[6px]"
        >
          Shop everything <ArrowIcon size={16} />
        </Link>
      </header>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
        {collections.map((c) => (
          <li key={c.handle}>
            <CategoryTile collection={c} sizes="(min-width: 768px) 33vw, 50vw" />
            <p className="mt-1 text-sm text-muted">
              {count(c.handle) ? pluralize(count(c.handle), "piece") : "New pieces coming soon"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
