import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const gtm = Boolean(process.env.NEXT_PUBLIC_GTM_ID);

/**
 * CSP without nonces keeps every page statically rendered (fast).
 * 'unsafe-inline' for scripts is required by Next's inline bootstrap in that mode.
 * See node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${gtm ? " https://www.googletagmanager.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://cdn.shopify.com${gtm ? " https://www.googletagmanager.com https://www.google-analytics.com" : ""}`,
  "font-src 'self'",
  `connect-src 'self'${gtm ? " https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com" : ""}${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
