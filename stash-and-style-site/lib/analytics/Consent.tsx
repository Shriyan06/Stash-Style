"use client";

import Script from "next/script";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/storage";

type Choice = "accepted" | "declined" | null;
const consentStore = createLocalStore<Choice>("ss-consent-v1", null);
const noop = () => () => {};

/**
 * Only rendered when NEXT_PUBLIC_GTM_ID is set.
 * Nothing loads until the visitor chooses; Accept and Decline carry equal weight.
 */
export function Consent({ gtmId }: { gtmId: string }) {
  const choice = consentStore.useValue();
  // false on the server and during hydration, so returning visitors never see a flash
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  return (
    <>
      {choice === "accepted" && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`}
        </Script>
      )}
      {choice === null && hydrated && (
        <section
          aria-label="Cookie choices"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-md border border-line bg-surface p-5 shadow-soft sm:inset-x-6"
        >
          <p className="text-[0.9375rem]">
            We&rsquo;d like to use analytics cookies to understand how the shop is used. Nothing is tracked unless you
            accept.{" "}
            <Link href="/policies/privacy-policy" className="underline underline-offset-4">
              Privacy policy
            </Link>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => consentStore.set("declined")}
              className="min-h-12 rounded-full border border-ink px-5 text-[0.9375rem] font-medium hover:bg-ink hover:text-surface"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => consentStore.set("accepted")}
              className="min-h-12 rounded-full border border-ink px-5 text-[0.9375rem] font-medium hover:bg-ink hover:text-surface"
            >
              Accept
            </button>
          </div>
        </section>
      )}
    </>
  );
}
