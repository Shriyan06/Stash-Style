import type { Metadata } from "next";
import { env, site } from "@/config/site";

export const absoluteUrl = (path = "/") => `${env.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Per-page metadata with canonical + OG/Twitter, and noindex where needed (always in demo mode). */
export function pageMetadata({
  title,
  description = site.description,
  path,
  noindex,
  image,
  type = "website",
}: {
  title?: string;
  description?: string;
  path: string;
  noindex?: boolean;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const robots = noindex || env.demoMode ? { index: false, follow: !env.demoMode } : undefined;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    robots,
    openGraph: {
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      url: path,
      type,
      siteName: site.name,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function organizationLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: env.siteUrl,
    logo: absoluteUrl("/icon.svg"),
    ...(sameAs.length ? { sameAs } : {}),
    ...(site.supportEmail ? { email: site.supportEmail } : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: env.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}
