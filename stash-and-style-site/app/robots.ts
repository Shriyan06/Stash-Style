import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { env } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (env.demoMode) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/wishlist", "/search", "/account", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
