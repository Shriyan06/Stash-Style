"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import type { ProductFilters, ProductSummary, SortKey } from "@/lib/catalog/types";
import { facetsFor, filterSummaries, SORTS, sortSummaries, type Facets } from "@/lib/catalog/query";
import { formatSize } from "@/lib/catalog/normalize";
import { formatMoney, pluralize } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";
import { Sheet, SheetHeader } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { SwatchDot } from "@/components/ui/Swatch";
import { CloseIcon, FilterIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 24;

type State = { sort: SortKey; filters: ProductFilters };

function parse(params: URLSearchParams | null): State {
  const list = (k: string) => (params?.get(k) ?? "").split(",").filter(Boolean);
  const num = (k: string) => {
    const v = params?.get(k);
    return v != null && v !== "" && Number.isFinite(Number(v)) ? Number(v) : undefined;
  };
  const sort = params?.get("sort") as SortKey | null;
  return {
    sort: SORTS.some((s) => s.key === sort) ? sort! : "featured",
    filters: {
      minPrice: num("min"),
      maxPrice: num("max"),
      colors: list("color"),
      sizes: list("size"),
      inStock: params?.get("stock") === "1" || undefined,
    },
  };
}

function serialize({ sort, filters: f }: State) {
  const q = new URLSearchParams();
  if (sort !== "featured") q.set("sort", sort);
  if (f.minPrice != null) q.set("min", String(f.minPrice));
  if (f.maxPrice != null) q.set("max", String(f.maxPrice));
  if (f.colors?.length) q.set("color", f.colors.join(","));
  if (f.sizes?.length) q.set("size", f.sizes.join(","));
  if (f.inStock) q.set("stock", "1");
  return q.toString();
}

/** Reads the URL. Rendered inside <Suspense>; the fallback is the same view with default params. */
export function CollectionViewFromUrl(props: { products: ProductSummary[]; collectionHandle: string }) {
  const params = useSearchParams();
  return <CollectionView {...props} params={params} />;
}

export function CollectionView({
  products,
  params,
}: {
  products: ProductSummary[];
  collectionHandle: string;
  params?: URLSearchParams | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // Local state reacts instantly; the URL follows. Re-sync when the URL changes elsewhere (back button).
  const urlQs = params?.toString() ?? "";
  const [state, setState] = useState<State>(() => parse(params ?? null));
  const [lastUrlQs, setLastUrlQs] = useState(urlQs);
  if (urlQs !== lastUrlQs) {
    // only when the URL itself changed; renders that still see the old URL must not undo a fresh click
    setLastUrlQs(urlQs);
    setState(parse(params ?? null));
  }
  const facets = useMemo(() => facetsFor(products), [products]);
  const results = useMemo(() => sortSummaries(filterSummaries(products, state.filters), state.sort), [products, state]);
  const qs = serialize(state);
  const [shown, setShown] = useState({ key: qs, count: PAGE_SIZE });
  const visible = shown.key === qs ? shown.count : PAGE_SIZE; // reset paging when filters change
  const [sheetOpen, setSheetOpen] = useState(false);

  function update(next: Partial<State> | ((s: State) => Partial<State>)) {
    const patch = typeof next === "function" ? next(state) : next;
    const merged: State = { ...state, ...patch, filters: { ...state.filters, ...patch.filters } };
    const q = serialize(merged);
    setState(merged);
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  const chips: { label: string; clear: () => void }[] = [];
  const f = state.filters;
  if (f.minPrice != null || f.maxPrice != null)
    chips.push({
      label: `${formatMoney(f.minPrice ?? facets.priceMin)} – ${formatMoney(f.maxPrice ?? facets.priceMax)}`,
      clear: () => update({ filters: { minPrice: undefined, maxPrice: undefined } }),
    });
  f.colors?.forEach((c) =>
    chips.push({
      label: c,
      clear: () => update((s) => ({ filters: { colors: s.filters.colors?.filter((x) => x !== c) } })),
    }),
  );
  f.sizes?.forEach((sz) =>
    chips.push({
      label: `Size ${formatSize(sz)}`,
      clear: () => update((s) => ({ filters: { sizes: s.filters.sizes?.filter((x) => x !== sz) } })),
    }),
  );
  if (f.inStock) chips.push({ label: "In stock", clear: () => update({ filters: { inStock: undefined } }) });
  const clearAll = () =>
    update({ filters: { minPrice: undefined, maxPrice: undefined, colors: [], sizes: [], inStock: undefined } });

  const filterPanel = <Filters facets={facets} state={state} update={update} />;
  const sortId = useId();

  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12" data-url-synced={params ? "" : undefined}>
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24">{filterPanel}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-muted" aria-live="polite">
            {pluralize(results.length, "product")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm hover:border-ink lg:hidden"
              aria-haspopup="dialog"
            >
              <FilterIcon size={18} /> Filter{chips.length ? ` (${chips.length})` : ""}
            </button>
            <label htmlFor={sortId} className="sr-only">
              Sort by
            </label>
            <select
              id={sortId}
              value={state.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="min-h-11 rounded-full border border-line-strong bg-surface py-2 pr-9 pl-4 text-sm hover:border-ink"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={c.clear}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-blush px-4 text-sm hover:bg-[#ecd4ca]"
                >
                  {c.label}
                  <CloseIcon size={14} />
                  <span className="sr-only">Remove filter</span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={clearAll} className="min-h-11 px-2 text-sm underline underline-offset-4">
                Clear all
              </button>
            </li>
          </ul>
        )}

        {results.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="font-display text-h3">No pieces match these filters</h2>
            <p className="mt-2 text-muted">Try removing a filter or two.</p>
            <Button variant="secondary" className="mt-6" onClick={clearAll}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
              {results.slice(0, visible).map((p, i) => (
                <li key={p.handle}>
                  <ProductCard product={p} priority={i < 2} headingLevel={2} />
                </li>
              ))}
            </ul>
            {visible < results.length && (
              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-sm text-muted">
                  Showing {visible} of {results.length}
                </p>
                <Button variant="secondary" onClick={() => setShown({ key: qs, count: visible + PAGE_SIZE })}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom" labelledBy="filter-title">
        <div className="flex max-h-[88dvh] flex-col">
          <SheetHeader title="Filter" titleId="filter-title" onClose={() => setSheetOpen(false)} />
          <div className="flex-1 overflow-y-auto px-5 py-4">{filterPanel}</div>
          <div className="flex gap-3 border-t border-line px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button variant="secondary" className="flex-1" onClick={clearAll} disabled={!chips.length}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setSheetOpen(false)}>
              Show {pluralize(results.length, "result")}
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0">
      <legend className="eyebrow float-left mb-3 w-full text-ink">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Filters({
  facets,
  state,
  update,
}: {
  facets: Facets;
  state: State;
  update: (p: Partial<State> | ((s: State) => Partial<State>)) => void;
}) {
  const f = state.filters;
  const lo = f.minPrice ?? facets.priceMin;
  const hi = f.maxPrice ?? facets.priceMax;
  const minId = useId();
  const maxId = useId();
  const toggle = (key: "colors" | "sizes", value: string) =>
    update((s) => {
      const cur = s.filters[key] ?? [];
      return { filters: { [key]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value] } };
    });

  return (
    <div>
      {facets.priceMax > facets.priceMin && (
        <FilterGroup title="Price">
          <p className="mb-3 text-sm tabular-nums">
            {formatMoney(lo)} – {formatMoney(hi)}
          </p>
          <div className="space-y-3">
            <div>
              <label htmlFor={minId} className="text-sm text-muted">
                Minimum price
              </label>
              <input
                id={minId}
                type="range"
                min={facets.priceMin}
                max={facets.priceMax}
                step={1}
                value={lo}
                onChange={(e) => {
                  const v = Math.min(Number(e.target.value), hi);
                  update({ filters: { minPrice: v === facets.priceMin ? undefined : v } });
                }}
                aria-valuetext={formatMoney(lo)}
                className="block h-11 w-full accent-[var(--accent-strong)]"
              />
            </div>
            <div>
              <label htmlFor={maxId} className="text-sm text-muted">
                Maximum price
              </label>
              <input
                id={maxId}
                type="range"
                min={facets.priceMin}
                max={facets.priceMax}
                step={1}
                value={hi}
                onChange={(e) => {
                  const v = Math.max(Number(e.target.value), lo);
                  update({ filters: { maxPrice: v === facets.priceMax ? undefined : v } });
                }}
                aria-valuetext={formatMoney(hi)}
                className="block h-11 w-full accent-[var(--accent-strong)]"
              />
            </div>
          </div>
        </FilterGroup>
      )}

      {facets.colors.length > 0 && (
        <FilterGroup title="Color">
          <ul className="space-y-1">
            {facets.colors.map((c) => (
              <li key={c}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
                  <input
                    type="checkbox"
                    checked={f.colors?.includes(c) ?? false}
                    onChange={() => toggle("colors", c)}
                    className="size-4 accent-[var(--ink)]"
                  />
                  <SwatchDot name={c} size={16} />
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      {facets.sizes.length > 0 && (
        <FilterGroup title="Size">
          <ul className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const on = f.sizes?.includes(s) ?? false;
              return (
                <li key={s}>
                  <label
                    className={cn(
                      "inline-flex min-h-11 min-w-14 cursor-pointer items-center justify-center rounded-full border px-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-strong",
                      on ? "border-ink bg-ink text-surface" : "border-line-strong hover:border-ink",
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle("sizes", s)} />
                    {formatSize(s)}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Availability">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
          <input
            type="checkbox"
            checked={Boolean(f.inStock)}
            onChange={(e) => update({ filters: { inStock: e.target.checked || undefined } })}
            className="size-4 accent-[var(--ink)]"
          />
          In stock only
        </label>
      </FilterGroup>
    </div>
  );
}
