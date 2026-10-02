import type { MetadataRoute } from "next";
import { getAllProducts, getCollections } from "@/lib/catalog";
import { getPosts } from "@/lib/blog";
import { policies } from "@/content/policies";
import { absoluteUrl } from "@/lib/seo";
import { env } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (env.demoMode) return []; // demo content must never be indexed
  const [collections, products] = await Promise.all([getCollections(), getAllProducts()]);
  const pages = ["/", "/collections", "/collections/all", "/about-us", "/faq", "/contact", "/blog"];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...collections.map((c) => ({
      url: absoluteUrl(`/collections/${c.handle}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products
      .filter((p) => !p.demo)
      .map((p) => ({ url: absoluteUrl(`/products/${p.handle}`), lastModified: p.createdAt, priority: 0.7 })),
    ...getPosts().map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.date || undefined,
      priority: 0.5,
    })),
    ...policies.map((p) => ({ url: absoluteUrl(`/policies/${p.handle}`), priority: 0.2 })),
  ];
}
