# Editing guide

Where to change things, no coding experience needed. After any change, run `npm run dev` and refresh
http://localhost:3000 to see it.

| I want to change…                                                | Edit this file                                                                                     | What to look for                                                                                                                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand colours                                                    | `app/globals.css`                                                                                  | The `:root { … }` block at the top: `--navy` (brand navy), `--ink` (text and buttons), `--accent` (gold), `--tint` (pale blue panels), `--bg`. Then run `npm run check:contrast`. |
| Fonts                                                            | `app/fonts.ts`                                                                                     | Swap `Cormorant_Garamond` / `Inter` for any Google font name.                                                                                                                     |
| Homepage slideshow (words, buttons, which slide has the $35 tag) | `content/home.ts`                                                                                  | One block per slide. Add or remove blocks to change the number of slides.                                                                                                         |
| Slideshow images                                                 | `public/brand/hero-lifestyle.jpg`, `slide-stack.jpg`, `slide-gifts.jpg` + `data/brand-images.json` | Replace the files (landscape, 2000×1250 or larger), then update `width`, `height`, `alt`, `"placeholder": false`.                                                                 |
| Logo                                                             | `public/brand/logo.png` + `data/brand-images.json`                                                 | Add the file and set `"logo": { "src": "/brand/logo.png", "width": …, "height": … }`. It replaces the text wordmark everywhere.                                                   |
| Announcement bar                                                 | `config/site.ts`                                                                                   | `announcements: [...]`. Empty list `[]` hides the bar.                                                                                                                            |
| Main menu                                                        | `config/nav.ts`                                                                                    | `mainNav`                                                                                                                                                                         |
| Footer links                                                     | `config/nav.ts`                                                                                    | `footerLearn`, `footerPolicies`                                                                                                                                                   |
| Footer text                                                      | `config/site.ts`                                                                                   | `blurb`                                                                                                                                                                           |
| Social links                                                     | `config/site.ts`                                                                                   | `social`. Leave one as `""` to hide it (Pinterest is empty for now).                                                                                                              |
| Support email, address                                           | `config/site.ts`                                                                                   | `supportEmail`, `businessAddress`. Filling the email turns on the contact form.                                                                                                   |
| Shipping time, free-shipping threshold                           | `config/site.ts`                                                                                   | `shipping.timeframe`, `shipping.freeShippingThreshold` (e.g. `35`), `shipping.estimate`                                                                                           |
| Return window                                                    | `config/site.ts`                                                                                   | `returns.windowDays`, `returns.windowStarts` (e.g. `"from the day your order is delivered"`)                                                                                      |
| Newsletter sign-up                                               | `config/site.ts`                                                                                   | `newsletterAction`: the form URL from your email tool (Klaviyo, Shopify Email, …).                                                                                                |
| Collection names, descriptions and tile images                   | `data/collections.json`                                                                            | `title`, `description`, `image` (a key from `data/brand-images.json`, or `null` for the S&S tile)                                                                                 |
| About page                                                       | `content/about.ts`                                                                                 | Add your real story to `story: [ "First paragraph", "Second paragraph" ]` and an "Our story" section appears.                                                                     |
| FAQ                                                              | `content/faq.ts`                                                                                   | Questions and answers. Answers mostly fill themselves from `config/site.ts`.                                                                                                      |
| Policies                                                         | `content/policies/index.ts`                                                                        | Replace every `[REPLACE BEFORE LAUNCH]`.                                                                                                                                          |
| Blog posts                                                       | `content/blog/`                                                                                    | Copy `_example.md`, rename it (no underscore), edit. The file name becomes the URL.                                                                                               |

`npm run check:prelaunch` lists every `[REPLACE BEFORE LAUNCH]` and empty setting that's left.

## Adding a product (without Shopify)

Products live in `data/products.json`, a list `[ … ]` of product objects. Once Shopify is connected
(see `CONNECT-SHOPIFY.md`) you manage products in Shopify instead and this file is ignored.

Put product photos in `public/products/` and reference them as `/products/your-file.jpg`.

Full example (copy, paste between the `[` `]`, and separate products with commas):

```json
{
  "id": "layered-chain-necklace",
  "handle": "layered-chain-necklace",
  "title": "Layered Chain Necklace",
  "description": "Two fine chains on one clasp, so the layered look takes one step.\n\nAdjustable length.",
  "collections": ["necklace"],
  "tags": ["necklace", "layering", "everyday"],
  "createdAt": "2026-10-01",
  "featuredRank": 1,
  "images": [
    {
      "src": "/products/layered-chain-1.jpg",
      "alt": "Layered chain necklace worn with a white tee",
      "width": 1200,
      "height": 1500
    },
    { "src": "/products/layered-chain-2.jpg", "alt": "Layered chain necklace laid flat", "width": 1200, "height": 1500 }
  ],
  "options": [{ "name": "Color", "values": ["Gold-tone", "Silver-tone"] }],
  "variants": [
    {
      "id": "layered-chain-gold",
      "title": "Gold-tone",
      "price": 24,
      "compareAtPrice": null,
      "available": true,
      "options": { "Color": "Gold-tone" },
      "imageIndex": 0
    },
    {
      "id": "layered-chain-silver",
      "title": "Silver-tone",
      "price": 24,
      "compareAtPrice": 30,
      "available": true,
      "options": { "Color": "Silver-tone" },
      "imageIndex": 1
    }
  ],
  "details": ["Length: write the real measurement here", "Clasp: write the real clasp type here"],
  "care": ["Keep dry and store separately"]
}
```

Field notes:

- `handle` becomes the web address: `/products/layered-chain-necklace`. Lowercase, hyphens, no spaces.
- `collections` uses collection handles: `earrings`, `necklace`, `rings-1`, `bracelets`, `elegance-set`.
- `price` / `compareAtPrice` are plain numbers in dollars. A **Sale** badge only appears when `compareAtPrice` is
  higher than `price`. Use `null` for no sale.
- `options` names must be `Color`, `Size` or `Material`. Ring sizes are just numbers (`"7"`, `"7.5"`) and
  show as "US 7".
- `createdAt`: products newer than 30 days get a **New** badge (change the 30 in `config/site.ts`, `newBadgeDays`).
- Only list facts you know in `details`: no "18K", "925 sterling", "hypoallergenic" or "waterproof" unless true.
- One variant and no `options` → the product card shows a quick **Add to bag** button.
