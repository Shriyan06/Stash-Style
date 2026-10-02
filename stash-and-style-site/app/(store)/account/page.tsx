import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { UserIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Account", path: "/account", noindex: true });

export default function AccountPage() {
  return (
    <div className="container-x flex flex-col items-center py-20 text-center lg:py-28">
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-tint">
        <UserIcon size={26} />
      </span>
      <h1 className="mt-6 font-display text-h1">Accounts are coming soon</h1>
      <p className="mt-3 max-w-md text-muted">
        You don&rsquo;t need an account to shop. Your bag and wishlist are saved on this device, and order updates
        arrive by email after checkout.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/collections/all">Shop all jewelry</ButtonLink>
        <ButtonLink href="/wishlist" variant="secondary">
          View wishlist
        </ButtonLink>
      </div>
      <p className="mt-8 text-sm text-muted">
        Questions about an order?{" "}
        <Link href="/contact" className="text-ink underline underline-offset-4">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
