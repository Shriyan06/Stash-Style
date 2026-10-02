"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { OptionName, Product, Variant } from "@/lib/catalog/types";
import { formatSize, isRingSize } from "@/lib/catalog/normalize";
import { useCart } from "@/components/cart/CommerceProvider";
import { QuantityStepper } from "@/components/cart/CartLines";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { SwatchDot } from "@/components/ui/Swatch";
import { pushRecentlyViewed } from "@/lib/wishlist/store";
import { cn } from "@/lib/cn";
import { Gallery } from "./Gallery";
import { ShareButtons } from "./ShareButtons";
import { SizeGuide } from "./SizeGuide";
import { WishlistButton } from "./WishlistButton";

type Selection = Partial<Record<OptionName, string>>;

const matches = (v: Variant, sel: Selection) =>
  Object.entries(sel).every(([k, val]) => !val || v.options[k as OptionName] === val);

export function ProductDetail({
  product,
  breadcrumbs,
  children,
}: {
  product: Product;
  breadcrumbs: React.ReactNode;
  /** Server-rendered accordions etc. */
  children: React.ReactNode;
}) {
  const cart = useCart();
  const [selection, setSelection] = useState<Selection>(() =>
    Object.fromEntries(product.options.filter((o) => o.values.length === 1).map((o) => [o.name, o.values[0]])),
  );
  const [qty, setQty] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [addVisible, setAddVisible] = useState(true);
  const msgId = useId();

  const allChosen = product.options.every((o) => selection[o.name]);
  const variant = useMemo(
    () =>
      product.options.length === 0
        ? product.variants[0]
        : allChosen
          ? product.variants.find((v) => matches(v, selection))
          : undefined,
    [product, selection, allChosen],
  );
  const display = variant ?? product.variants.reduce((a, b) => (b.price < a.price ? b : a), product.variants[0]);
  const priceVaries = !variant && new Set(product.variants.map((v) => v.price)).size > 1;
  const soldOut = product.variants.every((v) => !v.available) || (variant && !variant.available);
  const missing = product.options.filter((o) => !selection[o.name]).map((o) => o.name.toLowerCase());
  const hasRingSizes = product.options.some((o) => o.name === "Size" && o.values.some(isRingSize));

  useEffect(() => {
    pushRecentlyViewed(product.handle);
  }, [product.handle]);

  // Show the sticky bar once the main add button has scrolled up out of view.
  useEffect(() => {
    const el = addRef.current;
    if (!el) return;
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setAddVisible(el.getBoundingClientRect().bottom > 0));
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  function goToOptions() {
    setShowErrors(true);
    optionsRef.current?.scrollIntoView({ block: "center" });
    optionsRef.current?.querySelector<HTMLInputElement>("fieldset[data-missing] input")?.focus({ preventScroll: true });
  }

  function add() {
    if (!variant) return goToOptions();
    if (!variant.available) return;
    cart.add(
      {
        variantId: variant.id,
        handle: product.handle,
        title: product.title,
        variantTitle: product.options.length
          ? product.options
              .map((o) => (o.name === "Size" ? formatSize(variant.options[o.name] ?? "") : variant.options[o.name]))
              .join(" / ")
          : "",
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        image: product.images[variant.imageIndex ?? 0] ?? product.images[0] ?? null,
        demo: product.demo,
      },
      qty,
    );
  }

  const addLabel = soldOut ? "Sold out" : "Add to bag";
  const helper = soldOut
    ? variant
      ? "This option is sold out. Try another."
      : "This piece is sold out."
    : missing.length
      ? `Select a ${missing.join(" and ")} to continue.`
      : "";

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Gallery images={product.images} title={product.title} activeIndex={variant?.imageIndex} />
        </div>

        <div>
          {breadcrumbs}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.demo && <Badge tone="demo">Demo</Badge>}
            {soldOut && <Badge tone="soldout">Sold out</Badge>}
          </div>
          <h1 className="mt-3 font-display text-h1">{product.title}</h1>
          <Price
            price={display?.price ?? 0}
            compareAtPrice={variant ? variant.compareAtPrice : display?.compareAtPrice}
            from={priceVaries}
            className="mt-3 text-xl"
          />

          <div ref={optionsRef} className="mt-8 space-y-6">
            {product.options.map((opt) => {
              const chosen = selection[opt.name];
              const isMissing = showErrors && !chosen;
              return (
                <fieldset
                  key={opt.name}
                  data-missing={!chosen || undefined}
                  aria-describedby={isMissing ? msgId : undefined}
                >
                  <legend className="text-[0.9375rem] font-medium">
                    {opt.name}
                    {chosen && (
                      <span className="font-normal text-muted">
                        : {opt.name === "Size" ? formatSize(chosen) : chosen}
                      </span>
                    )}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {opt.values.map((val) => {
                      const available = product.variants.some(
                        (v) => v.available && matches(v, { ...selection, [opt.name]: val }),
                      );
                      const on = chosen === val;
                      return (
                        <label
                          key={val}
                          className={cn(
                            "relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-[0.9375rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-strong",
                            on ? "border-ink bg-ink text-surface" : "border-line-strong hover:border-ink",
                            !available && !on && "text-muted line-through decoration-1",
                            isMissing && "border-danger",
                          )}
                        >
                          <input
                            type="radio"
                            name={`opt-${opt.name}`}
                            value={val}
                            checked={on}
                            onChange={() => setSelection((s) => ({ ...s, [opt.name]: val }))}
                            className="sr-only"
                          />
                          {opt.name === "Color" && <SwatchDot name={val} size={16} />}
                          {opt.name === "Size" ? formatSize(val) : val}
                          {!available && <span className="sr-only"> (sold out)</span>}
                        </label>
                      );
                    })}
                  </div>
                  {opt.name === "Size" && hasRingSizes && (
                    <div className="mt-2">
                      <SizeGuide />
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>

          <div ref={addRef} className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} label="Quantity" />
              <Button
                className="min-w-48 flex-1"
                onClick={add}
                disabled={Boolean(soldOut) || !variant}
                aria-describedby={helper ? msgId : undefined}
              >
                {addLabel}
              </Button>
              <WishlistButton handle={product.handle} title={product.title} withLabel />
            </div>
            <p
              id={msgId}
              aria-live="polite"
              className={cn("mt-3 min-h-6 text-sm", showErrors && missing.length ? "text-danger" : "text-muted")}
            >
              {helper}
            </p>
          </div>

          <div className="mt-4">{children}</div>
          <div className="mt-6">
            <ShareButtons title={product.title} path={`/products/${product.handle}`} />
          </div>
        </div>
      </div>

      {/* Sticky mobile add-to-bag bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 lg:hidden",
          addVisible ? "translate-y-full" : "translate-y-0",
        )}
        data-sticky-atc
        inert={addVisible}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.title}</p>
            <Price
              price={display?.price ?? 0}
              compareAtPrice={variant?.compareAtPrice}
              from={priceVaries}
              className="text-sm text-muted"
            />
          </div>
          <Button size="sm" onClick={add} disabled={Boolean(soldOut)}>
            {soldOut ? "Sold out" : variant ? "Add to bag" : "Select options"}
          </Button>
        </div>
      </div>
    </>
  );
}
