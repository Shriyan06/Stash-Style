# Connect the site to Shopify

Shopify stays your commerce backend: orders, payments, tax, shipping rates and your supplier-sync / dropshipping
apps all keep working exactly as they do today. This site only **reads** your catalog and **hands the bag to
Shopify's checkout**. Nothing here writes products, edits orders or touches your theme.

## 1. Create a Storefront API token

1. In Shopify admin go to **Settings → Apps and sales channels → Develop apps**.
   (If you've never done this, click **Allow custom app development** first.)
2. Click **Create an app**, name it `Stash & Style storefront`, and create it.
3. Open **Configuration → Storefront API integration → Configure** and tick these scopes:
   - `unauthenticated_read_product_listings` (products and collections)
   - `unauthenticated_read_product_inventory` (in-stock / sold-out)
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts` and `unauthenticated_read_checkouts` (cart → checkout)
4. **Save**, then **Install app**.
5. Under **API credentials**, copy the **Storefront API access token**.
   (Not the Admin API token. The site never needs admin access.)

> Shopify renames admin screens and scopes from time to time. If the steps above don't match what you see,
> install Shopify's free **Headless** sales channel instead: it creates a storefront and gives you the same
> public Storefront API access token. Any token with read access to products/collections/inventory and
> cart/checkout access works.

## 2. Set the environment variables

Create `.env.local` in the project folder (or set these in your hosting provider's dashboard):

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com   # the .myshopify.com domain, not stashandstyle.store
SHOPIFY_STOREFRONT_TOKEN=paste-the-storefront-token-here
# SHOPIFY_API_VERSION=2026-07                   # optional
```

Keep these **without** the `NEXT_PUBLIC_` prefix so the token stays on the server.

## 3. Verify

```bash
npm run verify:shopify
```

It prints your shop name, the collections it can see, and a few sample products. It warns about:

- collections this site expects (`earrings`, `necklace`, `rings-1`, `bracelets`, `elegance-set`) that Shopify didn't return
- products with no images or no price
- a compare-at price that is `0` or not higher than the price (the site ignores it; no "-100%" badges)
- option names other than Color / Size / Material (shown on the site as "Style")

## 4. Build and run

```bash
npm run build && npm start
```

When both variables are set, the site automatically switches from `data/products.json` to Shopify:

| What                     | Local provider (default)                                   | Shopify provider                                 |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------ |
| Products and collections | `data/products.json`                                       | Storefront API (refreshed every 5 minutes)       |
| Bag                      | Saved in the visitor's browser                             | Same, and turned into a Shopify cart at checkout |
| Checkout button          | Polite "Checkout opens once the store is connected" notice | Redirects to Shopify's `checkoutUrl`             |

Pages for new products are generated at build time. Rebuild (or redeploy) after adding products, or add a
Shopify webhook that triggers a redeploy on your host.

## How it works (for a developer)

- `lib/catalog/index.ts` is the only module pages use. It picks `lib/catalog/shopify.ts` when the env vars exist.
- `lib/shopify/client.ts` holds the typed GraphQL queries (products, collections, `cartCreate`, `cartLinesAdd`,
  `cartLinesUpdate`, `cartLinesRemove`).
- `app/api/checkout/route.ts` receives the bag's variant IDs and quantities, creates a Shopify cart, and returns
  `checkoutUrl`. Prices are always recalculated by Shopify, never trusted from the browser.
- Data is normalised defensively in `lib/catalog/normalize.ts`: compare-at `0` is treated as absent,
  availability comes from `availableForSale`, sizes like "7 yards" become "7" and display as "US 7".

## Caveats

- Collection titles, descriptions and tile images come from `data/collections.json`, not Shopify, so the design
  stays consistent. Edit them there.
- If you rename a collection handle in Shopify, update `data/collections.json` and `config/nav.ts` to match.
- Customer accounts aren't built. Shopify's checkout still offers order-status pages and emails.
