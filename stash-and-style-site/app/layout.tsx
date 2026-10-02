import type { Metadata, Viewport } from "next";
import "./globals.css";
import { body, display } from "./fonts";
import { CommerceProvider } from "@/components/cart/CommerceProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LazyPanels } from "@/components/layout/LazyPanels";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { JsonLd } from "@/components/JsonLd";
import { Consent } from "@/lib/analytics/Consent";
import { isCommerceConnected } from "@/lib/catalog";
import { organizationLd } from "@/lib/seo";
import { env, site } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  robots: env.demoMode ? { index: false, follow: false } : undefined,
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FBF7F2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so scroll-reveal can hide content until it animates in. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed top-2 left-2 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-surface transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <CommerceProvider connected={isCommerceConnected}>
          {env.demoMode && (
            <p className="bg-blush py-1.5 text-center text-xs font-semibold tracking-[0.12em] uppercase">
              Demo mode: placeholder products, not for sale
            </p>
          )}
          <AnnouncementBar messages={site.announcements} />
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
          <LazyPanels />
        </CommerceProvider>
        <RevealObserver />
        {env.gtmId && <Consent gtmId={env.gtmId} />}
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
