"use client";

import Link from "next/link";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { useCart, useCommerce } from "@/components/cart/CommerceProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { PaymentBadges } from "@/components/layout/PaymentBadges";
import { Sheet } from "@/components/ui/Sheet";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronIcon, LockIcon } from "@/components/icons";
import { site } from "@/config/site";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";

const noop = () => () => {};

const STATES =
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(
    " ",
  );

type Field = "email" | "firstName" | "lastName" | "address" | "city" | "state" | "zip";
const REQUIRED: Record<Field, string> = {
  email: "Enter an email address",
  firstName: "Enter a first name",
  lastName: "Enter a last name",
  address: "Enter an address",
  city: "Enter a city",
  state: "Select a state",
  zip: "Enter a ZIP code",
};

/**
 * Checkout.
 * - Shopify connected: hands the bag to Shopify's real checkout straight away.
 * - Not connected: a branded PREVIEW of the checkout. Nothing is saved or sent,
 *   card details are never collected, and no order is created.
 */
export function CheckoutView({ connected }: { connected: boolean }) {
  const cart = useCart();
  const { checkout, checkoutError } = useCommerce();
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (connected && hydrated && cart.lines.length) void checkout();
  }, [connected, hydrated, cart.lines.length, checkout]);

  if (!hydrated) {
    return (
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_26rem]" aria-busy="true">
        <span className="sr-only">Loading checkout…</span>
        <Skeleton className="h-[32rem] w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!cart.lines.length) {
    return (
      <div className="container-x flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-h1">Your bag is empty</h1>
        <p className="mt-3 text-muted">Add something you love, then come back to check out.</p>
        <ButtonLink href="/collections/all" className="mt-8">
          Shop all jewelry
        </ButtonLink>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="container-x flex flex-col items-center py-24 text-center" aria-live="polite">
        <LockIcon size={28} className="text-accent-strong" />
        <h1 className="mt-4 font-display text-h2">Taking you to secure checkout…</h1>
        {checkoutError && (
          <p role="alert" className="mt-3 text-danger">
            {checkoutError}
          </p>
        )}
      </div>
    );
  }

  return <CheckoutPreview />;
}

function CheckoutPreview() {
  const cart = useCart();
  const [values, setValues] = useState<Record<Field, string>>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const id = useId();
  const count = cart.lines.reduce((n, l) => n + l.quantity, 0);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    for (const k of Object.keys(REQUIRED) as Field[]) if (!values[k].trim()) next[k] = REQUIRED[k];
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) next.email = "Enter a valid email address";
    setErrors(next);
    const first = (Object.keys(next) as Field[])[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setDone(true);
  }

  const input = (k: Field, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, span = "") => (
    <div className={span}>
      <label htmlFor={`${id}-${k}`} className="sr-only">
        {label}
      </label>
      <input
        id={`${id}-${k}`}
        value={values[k]}
        onChange={set(k)}
        placeholder={label}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
        className="field"
        {...props}
      />
      {errors[k] && (
        <p id={`${id}-${k}-err`} className="mt-1 text-sm text-danger">
          {errors[k]}
        </p>
      )}
    </div>
  );

  const summary = (
    <div>
      <ul className="space-y-4">
        {cart.lines.map((l) => (
          <li key={l.variantId} className="flex items-center gap-4">
            <div className="relative w-16 shrink-0">
              <div className="relative aspect-square overflow-hidden rounded-md border border-line bg-tint">
                <ProductImage image={l.image} sizes="64px" />
              </div>
              <span className="absolute -top-2 -right-2 inline-flex min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs leading-5 font-semibold text-surface tabular-nums">
                <span className="sr-only">Quantity </span>
                {l.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug font-medium">{l.title}</p>
              {l.variantTitle && <p className="text-xs text-muted">{l.variantTitle}</p>}
            </div>
            <p className="text-sm tabular-nums">{formatMoney(l.price * l.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-2">
        <label htmlFor={`${id}-discount`} className="sr-only">
          Discount code
        </label>
        <input id={`${id}-discount`} className="field flex-1" placeholder="Discount code" disabled />
        <button type="button" disabled className="min-h-12 rounded-md border border-line px-5 text-sm text-muted">
          Apply
        </button>
      </div>
      <p className="mt-1.5 text-xs text-muted">Discount codes work once checkout is connected.</p>
      <dl className="mt-6 space-y-2 text-[0.9375rem]">
        <div className="flex justify-between">
          <dt>
            Subtotal · {count} {count === 1 ? "item" : "items"}
          </dt>
          <dd className="tabular-nums">{formatMoney(cart.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>Free</dd>
        </div>
        <div className="flex justify-between text-muted">
          <dt>Estimated taxes</dt>
          <dd>Calculated at checkout</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4 text-lg font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">
            <span className="mr-2 text-xs font-normal text-muted">USD</span>
            {formatMoney(cart.subtotal)}
          </dd>
        </div>
      </dl>
    </div>
  );

  return (
    <>
      <div className="border-b border-accent/40 bg-champagne">
        <p className="container-x py-3 text-center text-sm">
          <strong>Checkout preview.</strong> Payments aren&rsquo;t connected yet, so nothing you enter is saved or sent
          and no order will be placed.
        </p>
      </div>

      {/* Mobile: collapsible order summary, like Shopify */}
      <div className="border-b border-line bg-tint lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          aria-expanded={summaryOpen}
          aria-controls={`${id}-summary`}
          className="container-x flex min-h-14 w-full items-center justify-between text-sm"
        >
          <span className="inline-flex items-center gap-1.5 font-medium text-accent-strong">
            {summaryOpen ? "Hide" : "Show"} order summary
            <ChevronIcon size={16} dir={summaryOpen ? "up" : "down"} />
          </span>
          <span className="text-base font-semibold tabular-nums">{formatMoney(cart.subtotal)}</span>
        </button>
        <div id={`${id}-summary`} hidden={!summaryOpen} className="container-x pb-6">
          {summary}
        </div>
      </div>

      <div className="lg:bg-[linear-gradient(to_right,transparent_50%,rgb(232_238_248/0.6)_50%)]">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_minmax(22rem,26rem)]">
          <form onSubmit={submit} noValidate className="px-4 py-8 sm:px-8 lg:border-r lg:border-line lg:py-12 lg:pr-12">
            <h1 className="sr-only">Checkout</h1>

            <section aria-labelledby={`${id}-express`}>
              <h2 id={`${id}-express`} className="text-center font-body text-sm font-normal text-muted">
                Express checkout
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden="true">
                {[
                  ["shop", "bg-[#5a31f4] text-white"],
                  ["PayPal", "bg-[#ffc439] text-[#003087]"],
                  ["Apple Pay", "bg-black text-white"],
                  ["G Pay", "bg-black text-white"],
                ].map(([label, cls]) => (
                  <div
                    key={label}
                    className={cn("flex h-12 items-center justify-center rounded-md text-sm font-bold opacity-80", cls)}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-muted">Express buttons appear once Shopify is connected.</p>
              <div className="my-6 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
                <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
              </div>
            </section>

            <section aria-labelledby={`${id}-contact`} className="space-y-3">
              <h2 id={`${id}-contact`} className="font-display text-h3">
                Contact
              </h2>
              {input("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
              <label className="flex min-h-11 items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-[var(--ink)]" /> Email me with news and offers
              </label>
            </section>

            <section aria-labelledby={`${id}-delivery`} className="mt-8 space-y-3">
              <h2 id={`${id}-delivery`} className="font-display text-h3">
                Delivery
              </h2>
              <div>
                <label htmlFor={`${id}-country`} className="sr-only">
                  Country/Region
                </label>
                <select id={`${id}-country`} className="field" defaultValue="US">
                  <option value="US">United States</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {input("firstName", "First name", { autoComplete: "given-name" })}
                {input("lastName", "Last name", { autoComplete: "family-name" })}
              </div>
              {input("address", "Address", { autoComplete: "address-line1" })}
              <div>
                <label htmlFor={`${id}-apt`} className="sr-only">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  id={`${id}-apt`}
                  className="field"
                  placeholder="Apartment, suite, etc. (optional)"
                  autoComplete="address-line2"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {input("city", "City", { autoComplete: "address-level2" })}
                <div>
                  <label htmlFor={`${id}-state`} className="sr-only">
                    State
                  </label>
                  <select
                    id={`${id}-state`}
                    value={values.state}
                    onChange={set("state")}
                    aria-invalid={errors.state ? true : undefined}
                    aria-describedby={errors.state ? `${id}-state-err` : undefined}
                    className={cn("field", !values.state && "text-muted")}
                    autoComplete="address-level1"
                  >
                    <option value="">State</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p id={`${id}-state-err`} className="mt-1 text-sm text-danger">
                      {errors.state}
                    </p>
                  )}
                </div>
                {input("zip", "ZIP code", { autoComplete: "postal-code", inputMode: "numeric" })}
              </div>
              <div>
                <label htmlFor={`${id}-phone`} className="sr-only">
                  Phone (optional)
                </label>
                <input
                  id={`${id}-phone`}
                  type="tel"
                  className="field"
                  placeholder="Phone (optional)"
                  autoComplete="tel"
                />
              </div>
            </section>

            <section aria-labelledby={`${id}-shipping`} className="mt-8">
              <h2 id={`${id}-shipping`} className="mb-3 font-display text-h3">
                Shipping method
              </h2>
              <div className="flex items-center justify-between rounded-md border border-ink bg-tint/60 px-4 py-4 text-[0.9375rem]">
                <span>
                  <span className="block font-medium">Free shipping</span>
                  {site.shipping.timeframe && <span className="text-sm text-muted">{site.shipping.timeframe}</span>}
                </span>
                <span className="font-semibold">Free</span>
              </div>
            </section>

            <section aria-labelledby={`${id}-payment`} className="mt-8">
              <h2 id={`${id}-payment`} className="font-display text-h3">
                Payment
              </h2>
              <p className="mt-1 text-sm text-muted">All transactions are secure and encrypted.</p>
              <div className="mt-3 overflow-hidden rounded-md border border-line-strong">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-strong bg-tint/60 px-4 py-3">
                  <span className="text-[0.9375rem] font-medium">Credit card</span>
                  <PaymentBadges className="[&_li:nth-child(n+5)]:hidden" />
                </div>
                {/* Not inputs: card details are never collected on this preview. */}
                <div className="space-y-3 bg-surface p-4" aria-describedby={`${id}-cardnote`}>
                  {["Card number", "Name on card"].map((t) => (
                    <div
                      key={t}
                      className="flex min-h-12 items-center rounded-[2px] border border-line bg-bg px-4 text-muted select-none"
                    >
                      {t}
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    {["Expiration date (MM / YY)", "Security code"].map((t) => (
                      <div
                        key={t}
                        className="flex min-h-12 items-center rounded-[2px] border border-line bg-bg px-4 text-sm text-muted select-none"
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                  <p id={`${id}-cardnote`} className="text-xs text-muted">
                    Card fields are provided by Shopify&rsquo;s secure checkout once the store is connected. This
                    preview never asks for card details.
                  </p>
                </div>
              </div>
              <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--ink)]" /> Use shipping address as
                billing address
              </label>
            </section>

            <Button type="submit" className="mt-8 w-full rounded-md! text-base">
              Pay now · {formatMoney(cart.subtotal)}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Preview only. Pressing this won&rsquo;t place an order.
            </p>
          </form>

          <aside aria-label="Order summary" className="hidden px-8 py-12 lg:block lg:bg-[rgb(232_238_248/0.6)]">
            <div className="sticky top-8">{summary}</div>
          </aside>
        </div>
      </div>

      <Sheet open={done} onClose={() => setDone(false)} side="center" labelledBy={`${id}-done`}>
        <div className="p-6 sm:p-8">
          <p className="eyebrow text-accent-strong">Preview complete</p>
          <h2 id={`${id}-done`} className="mt-2 font-display text-h2">
            That&rsquo;s the whole checkout
          </h2>
          <p className="mt-3 text-muted">
            No order was placed and nothing was charged. Once Shopify is connected, this step takes shoppers to
            Shopify&rsquo;s secure checkout, styled with your logo and colours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/cart">Back to my bag</ButtonLink>
            <Button variant="secondary" onClick={() => setDone(false)}>
              Stay here
            </Button>
          </div>
          <p className="mt-6 text-sm">
            <Link href="/collections/all" className="underline underline-offset-4">
              Keep shopping
            </Link>
          </p>
        </div>
      </Sheet>
    </>
  );
}
