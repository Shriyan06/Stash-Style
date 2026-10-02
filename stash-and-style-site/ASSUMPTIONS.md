# Assumptions and decisions

Every decision made where the brief was silent, every placeholder, and every dependency.

## Environment facts that shaped the build

- **The brand images could not be downloaded.** Outbound requests to `stashandstyle.store` were blocked by the
  build environment's network policy (HTTP 403 at the proxy). As the brief instructs, every image in
  `/public/brand` is a **generated placeholder** at the target size: a tinted gradient with a thin gold line
  drawing of the relevant jewelry (hoops, bangles, stacked rings, chains). `npm run brand:fetch` retries the real
  downloads, applies the "≥ 800px wide" rule, writes `data/brand-images.json`, and regenerates `blurDataURL`s.
- **No logo file** for the same reason. The header and footer use the typographic wordmark ("Stash & Style" in
  Cormorant Garamond with a gold italic ampersand). If `public/brand/logo.png` exists, it's used automatically.
- Placeholder images use `alt=""` because they're decorative art, not photos of the product. Each entry in
  `data/brand-images.json` keeps an `intendedAlt` to use once the real photo is in place.
- The repository root also contains an earlier upload, `stash-style-website-updated-cart.zip`. It was not used.
  **Note:** it contains a `.env.local` with a Shopify Storefront token committed to git. Storefront tokens are
  designed to be public-facing, but consider rotating it and removing the zip from history.

## Round 2 changes (your feedback)

- **Navy theme.** You asked for a dark-blue look like the old site. I couldn't load the old site to sample its
  exact colours (blocked, see above), so the navy is my choice: `--navy` `#142A57`, `--ink` `#0F1D3A`, gold
  `#C9A35E`. I read "dark blue focused" as navy for the big surfaces (announcement bar, slideshow, gift section,
  footer, Necklaces tile) with a light page behind products so they stay easy to see. All colours live in
  `app/globals.css`; send me the old site's hex codes and it's a 1-line change each. The old warm tokens were renamed:
  `--blush` → `--tint` (pale blue), `--sage` → `--champagne`. Focus rings switch to gold on navy surfaces.
- **Original logo: not done.** The logo file couldn't be downloaded (same block). Upload it in chat and it drops into
  `public/brand/logo.png`. A light or white version is also needed if the logo is dark, because the footer is navy.
- **Slideshow** replaces the single hero image: 3 slides (`content/home.ts`), crossfade + slow zoom, staggered text,
  autoplay with a visible pause button, arrows, dots with a progress bar, swipe and ← → keys. Autoplay is off for
  visitors with reduced motion on. Slides 2–3 load their images 2.5s after the page so they don't slow slide 1.
- **The $35 tag** kept its swing-in, swings again whenever slide 1 comes back and on hover, and has a small gold
  glint.
- **Added animations:** bag icon wiggles and count pops when something's added, heart pops when saved, product cards
  lift on hover, grids stagger in on scroll, gold buttons get a shine sweep, announcement messages fade, gift cards
  rise on hover. All of them stop under `prefers-reduced-motion`.
- **"Real" images.** No photo source was reachable (store, Shopify CDN, Unsplash, Pexels, Wikimedia all blocked), so
  `scripts/render-demo-images.mjs` renders studio-style jewelry illustrations (metallic gold/silver/rose,
  pearls, stones, soft shadows, light and navy-velvet backdrops). Demo products, collection tiles and the slideshow
  use them. They are labelled as illustrations in alt text and must be replaced with real photos before launch.
- **Demo product names** changed from "Demo Ring 01" to descriptive names so the preview reads like a real shop.
  The DEMO ribbon, the demo banner and "isn't for sale" in each description stay.
- **Checkout preview.** The original brief said "don't fake an order flow"; you asked to see the checkout, so
  `/checkout` is now a branded _preview_: clearly bannered, nothing saved or sent, no card inputs at all, and "Pay
  now" only confirms that no order was placed. With Shopify connected, checkout goes straight to Shopify, whose
  layout is Shopify's own (logo/colours/fonts are customisable there). The old "Checkout opens once the store is
  connected" modal was removed.
- **Route groups:** store pages moved to `app/(store)/` so checkout can have its own minimal header (logo, secure
  badge, back to bag), like a real checkout. URLs didn't change.
- **Editorial banner** under the slideshow changed from bracelets to "Layer it up" (necklaces), since slide 2 now
  covers stacking bracelets.

## Stack and dependencies

Runtime dependencies (5 of the 10 allowed):

| Package                      | Why                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `next`, `react`, `react-dom` | The required stack                                                                           |
| `marked`                     | Markdown → HTML for blog posts. Writing a safe Markdown parser by hand isn't worth it.       |
| `server-only`                | Build error if the Shopify client (which holds the token) is ever imported into browser code |

Dev dependencies: `typescript`, `@types/*`, `tailwindcss` + `@tailwindcss/postcss`, `eslint` +
`eslint-config-next`, `prettier` + `prettier-plugin-tailwindcss`, `playwright-core` (screenshots and smoke test,
using the pre-installed Chromium instead of downloading one), `sharp` (placeholder images and blur hashes; Next
also uses it for image optimisation).

Not added: UI kit, icon library, animation library, state library, test framework, CMS, front-matter parser
(a 15-line parser in `lib/blog.ts` covers the documented fields).

## Design decisions

- **Direction:** the brief pinned the palette (warm cream, ink, gold-tone) and fonts (Cormorant Garamond 600 +
  Inter). The one deliberate signature is the **hang tag**: a cardstock price tag on a string, the thing
  affordable jewelry actually hangs from. It swings once on load in the hero ("Under $35, every piece"), echoes as a
  punched hole on the gift cards and in the "coming soon" card. Everything else stays quiet.
- **Hero text contrast:** the brief suggested a gradient scrim. I used a _cream_ scrim with ink text rather than a
  dark one with white text, which keeps the page light and airy and guarantees AA on any photo.
- **Colour tokens:** `--accent` `#B8864B` measures 3.01:1 on cream, enough for decoration but not for text or a
  focus ring on blush panels. I added `--accent-strong` `#855A28` (5.6:1) for gold text, the accent button
  fill and the **focus ring** (2px, 2px offset). I also added `--line-strong` `#958778` so form borders reach 3:1.
  `npm run check:contrast` checks 24 pairs; all pass.
- **Fonts use `display: optional`.** With `swap`, the late font swap caused CLS 0.10 on the collection page.
  `optional` removed it (0.001). Fonts are preloaded and small, so they normally arrive in time. On a very slow
  first visit the fallback font may show for that page view only.
- **Desktop nav at ≥ 1280px.** Six links plus the centred wordmark don't fit at 1024px, so 1024–1279px uses the
  menu drawer. A simple link bar was chosen over the optional mega-menu.
- **Monogram tile for Necklaces** as specified (blush block, gold italic "S&S", the word "Necklaces").
- **Announcement bar** rotates every 4.5s, pauses on hover/focus, does not rotate under reduced motion, and is
  dismissible for the session.
- **Mobile filters** open in a bottom sheet; desktop filters are a sticky sidebar.
- **Load more, not pagination:** 24 per page. Shoppers browse rather than jump to page 4, and filters are
  URL-synced anyway. The visible count resets when filters change.
- **Price filter:** two native range inputs (min and max) instead of a custom dual-thumb slider. Fully keyboard
  and screen-reader accessible with no extra code.
- **Size guide:** shown only when a product's Size option contains ring sizes (3–13). It lists the standard
  published US ring-size conversions (inside diameter and circumference).
- **Product care text:** when a product has no care notes, generic, claim-free advice is shown (put jewelry on
  after perfume, keep it dry, store separately). No material claims.
- **Trust strip copy:** "Secure checkout" is true because payment happens in Shopify's checkout. "Styles under
  $35" is the brand's own price promise.
- **Follow strip:** six tinted squares, explicitly no fake posts.
- **Style tips** on the home page are generic styling advice. They link to `/blog/mixing-metals` and similar only
  if a post with that slug exists; otherwise they're plain text.
- **Gift copy** avoids gendering the recipient.

## Behaviour decisions

- **Newsletter:** there's no backend. With `config.newsletterAction` empty, submitting a valid email shows "Sign-ups
  open when the store launches. Until then, follow @stash_nstyle", rather than pretending to subscribe. Set the
  endpoint (Klaviyo, Shopify Email form, …) to make it real. If it's a different origin, add it to `connect-src`
  in `next.config.ts`.
- **Contact form** opens the visitor's email app (`mailto:`) addressed to `supportEmail`. With no email
  configured, the form is replaced by Instagram/Facebook buttons.
- **Checkout:** local provider → modal "Checkout opens once the store is connected" (nothing is logged or sent).
  Shopify provider → `POST /api/checkout` creates a Shopify cart from variant IDs and quantities and redirects to
  `checkoutUrl`. Prices are never sent from the browser. The cart syncs to Shopify **at checkout time**, not on
  every change. The bag lives in `localStorage`, so it works offline and costs no API calls while browsing. The
  `cartLinesAdd/Update/Remove` mutations are implemented in `lib/shopify/client.ts` for a future live-synced cart.
- **Cart, wishlist, recently viewed and recent searches** persist in `localStorage` through a tiny store built on
  `useSyncExternalStore` (`lib/storage.ts`). It's hydration-safe (the server snapshot is empty), syncs across tabs
  with the `storage` event, and falls back to memory if storage is blocked.
- **Search** is client-side over `/search-index.json` (a compact product list, cached 5 minutes), loaded only when
  search, wishlist or recently viewed is used.
- **Drawers and modals** use the native `<dialog>` element: `showModal()` makes the rest of the page inert (the
  focus trap), Esc closes, backdrop click closes, focus returns to the trigger, and the body is scroll-locked via
  `html:has(dialog[open])`. Their code is lazy-loaded on first open to keep the home page light.
- **"New" badge:** products created in the last 30 days (`config.newBadgeDays`).
- **Sale badge:** only when `compareAtPrice > price > 0`. `0` or a non-higher compare-at is normalised to `null` at
  the data layer, so a "-100%" or "$0.00" can't render. `<Price>` also refuses to render a zero price.
- **Unknown Shopify option names** (anything not Color/Size/Material) are mapped to "Style" with a dev-console
  warning, so variant selection still works.
- **Collection copy** stays in `data/collections.json` even with Shopify connected, so admin edits can't break the
  design.
- **Account** links to an "Accounts are coming soon" page. No auth was built.
- **404:** the App Router's `not-found.tsx` serves the custom 404 for any unknown URL (there's no literal `/404`
  page in the App Router).
- **SEO:** canonical URLs, OG/Twitter tags, a generated default OG image (system fonts, so the build needs no
  network), JSON-LD for Organization, WebSite + SearchAction, Product (no ratings, no reviews), BreadcrumbList,
  FAQPage (answered questions only) and Article. `noindex` on cart, wishlist, search, account, 404 and **every
  page in demo mode**; demo mode also empties the sitemap and disallows all in `robots.txt`.
- **Consent:** the banner (equal-weight Accept/Decline) and GTM render only when `NEXT_PUBLIC_GTM_ID` is set. GTM
  loads only after Accept.
- **CSP** has no nonces, so every page stays statically rendered. That requires `'unsafe-inline'` for scripts (the
  approach the Next.js docs describe for static sites). GTM and Shopify CDN origins are added only when used.
- **Hydration marker:** `<html data-hydrated>` is set once React is interactive; only the smoke test uses it.

## Placeholders and empty values (all hidden or clearly marked)

`config/site.ts`: `supportEmail`, `businessAddress`, `shipping.timeframe`, `shipping.freeShippingThreshold`,
`shipping.estimate`, `returns.windowStarts`, `newsletterAction`, `social.pinterest`. Each piece of UI that depends
on one of these hides itself.

`[REPLACE BEFORE LAUNCH]` markers (29, listed on every build):

- **FAQ:** delivery time, tracking, when the return window starts, how to start a return, refund timing, and the
  support email.
- **Policies:** all four are structured templates with no binding terms written. They contain the facts already
  public on the live store (free shipping, 30-day returns, payment via Shopify) and markers for everything else.
- **"Last updated" date** on each policy.

**Images:** all 7 brand images are generated placeholders (see above), and there's no logo.

## Known gaps against the brief

See the final report. In short: the JS budget is over, one Lighthouse performance score sits under 95, demo-mode
SEO can't reach 100 by design, and a 404 visitor's very first page view uses fallback fonts.
