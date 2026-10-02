import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { env, site } from "@/config/site";

/** Announcement bar, header, main and footer: everything except checkout. */
export function StoreChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      {env.demoMode && (
        <p className="bg-accent py-1.5 text-center text-xs font-semibold tracking-[0.12em] text-ink uppercase">
          Demo mode: sample products, not for sale
        </p>
      )}
      <AnnouncementBar messages={site.announcements} />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
