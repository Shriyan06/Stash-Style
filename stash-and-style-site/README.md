# Stash & Style storefront

A custom storefront for Stash & Style (women's jewelry and accessories, everything under $35). It's built with
Next.js 16 (App Router), TypeScript and Tailwind CSS 4. Shopify stays the commerce backend: connecting it is one
module and two environment variables.

Nothing here touches the live Shopify store, and nothing is deployed.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000, empty catalog (what launch looks like with no products yet)
npm run dev:demo       # same, with 12 labelled demo products to judge grids, filters and the cart
```

Production build:

```bash
npm run build && npm start
npm run build:demo && npm start   # demo products, noindex
```

The site runs with **zero** environment variables set. See `.env.example` for the optional ones.

## Scripts

| Script                    | What it does                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run lint`            | ESLint, zero warnings allowed                                                               |
| `npm run typecheck`       | Generates route types, then `tsc --noEmit` (strict)                                         |
| `npm run build`           | Runs `check:prelaunch` (lists every `[REPLACE BEFORE LAUNCH]`), then `next build`           |
| `npm run check`           | lint + typecheck + contrast + build                                                         |
| `npm run check:contrast`  | WCAG AA check of every colour-token pair, read straight from `app/globals.css`              |
| `npm run check:prelaunch` | Lists placeholders and empty business settings. `PRELAUNCH_STRICT=1` makes it fail.         |
| `npm run test:smoke`      | Playwright keyboard/smoke test against a running server (`BASE_URL=http://localhost:3000`)  |
| `npm run screenshots`     | Screenshots routes at 390px and 1280px, flags overflow and console errors                   |
| `npm run brand:fetch`     | Re-tries downloading brand images from the current store; generates placeholders on failure |
| `npm run verify:shopify`  | Read-only check of your Shopify Storefront API credentials                                  |
| `npm run format`          | Prettier                                                                                    |

The Playwright scripts use the Chromium in `/opt/pw-browsers` by default. Elsewhere, set `CHROMIUM_PATH` to any
Chrome/Chromium binary.

## Environment variables

| Variable                   | Default                       | Purpose                                                                   |
| -------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | `https://stashandstyle.store` | Canonical URLs, sitemap, Open Graph                                       |
| `NEXT_PUBLIC_DEMO_MODE`    | `false`                       | Adds 12 demo products and makes every page `noindex`                      |
| `NEXT_PUBLIC_GTM_ID`       | unset                         | Google Tag Manager. Loads only after a visitor accepts the cookie banner. |
| `SHOPIFY_STORE_DOMAIN`     | unset                         | With the token, switches the catalog and checkout to Shopify              |
| `SHOPIFY_STOREFRONT_TOKEN` | unset                         | Storefront API token (server-side only)                                   |
| `SHOPIFY_API_VERSION`      | `2026-07`                     | Storefront API version                                                    |
| `PRELAUNCH_STRICT`         | unset                         | `1` = fail the build while placeholders remain                            |

## Structure

```
app/            routes, layouts, loading/error/not-found, sitemap, robots, manifest, OG image, api/checkout
components/     ui/ layout/ product/ home/ cart/ collection/ search/ forms/ wishlist/ icons/
lib/            catalog/ (the data layer), shopify/, cart/, wishlist/, seo/, format/, analytics/, blog.ts
config/         site.ts (every editable business value), nav.ts
content/        about.ts, faq.ts, policies/, blog/*.md
data/           products.json ([] for now), collections.json, demo-products.ts, brand-images.json
public/brand/   placeholder brand images + README.txt
docs/           CONNECT-SHOPIFY.md, EDITING-GUIDE.md
scripts/        brand images, contrast, pre-launch check, screenshots, smoke test, Shopify check
```

**The one module that matters:** `lib/catalog/index.ts` exports `getCollections`, `getCollection`,
`getProducts`, `getProduct`, `searchProducts` and `getRecommendations`. It reads `data/products.json` by default
and Shopify when the two `SHOPIFY_*` variables are set.

## Demo mode

`NEXT_PUBLIC_DEMO_MODE=true` merges `data/demo-products.ts` into the catalog. These are "Demo Ring 01" and similar:
tinted blocks with no photos, a DEMO ribbon, and a banner at the top of every page. They exist so you can check
cards, badges (New / Sale / Sold out), swatches, filters, variant selection and the bag. Demo builds are
`noindex` with an empty sitemap and `robots.txt` disallowing everything. Never deploy one.

## Connect Shopify

See [`docs/CONNECT-SHOPIFY.md`](docs/CONNECT-SHOPIFY.md). In short: create a Storefront API token, set
`SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_TOKEN`, run `npm run verify:shopify`, rebuild. Checkout then
redirects to Shopify's own checkout, so payments, orders, tax and supplier sync stay where they are.

## Deploying later

Any Node host that runs Next.js works (Vercel, Netlify, Render, a VPS with `npm start`).

1. Fill in everything `npm run check:prelaunch` lists, then build with `PRELAUNCH_STRICT=1`.
2. Replace the placeholder images (`public/brand/README.txt`).
3. Set `NEXT_PUBLIC_SITE_URL`, the Shopify variables and optionally `NEXT_PUBLIC_GTM_ID` on the host.
4. Make sure `NEXT_PUBLIC_DEMO_MODE` is **not** `true`.
5. Point the domain at the host only when you're ready to switch away from the Shopify theme.

## Editing content

See [`docs/EDITING-GUIDE.md`](docs/EDITING-GUIDE.md) for colours, fonts, hero text, navigation, footer,
announcement bar, collection descriptions and adding products.
