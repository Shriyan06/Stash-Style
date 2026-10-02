#!/usr/bin/env node
/**
 * Checks the Shopify Storefront API connection using SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN
 * (read from the environment or .env.local). Read-only: it never writes to the store.
 * Run: npm run verify:shopify
 */
import { existsSync } from "node:fs";

for (const f of [".env.local", ".env"]) if (existsSync(f)) process.loadEnvFile(f);

const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const token = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";
const version = process.env.SHOPIFY_API_VERSION || "2026-07";

if (!domain || !token) {
  console.error("✗ Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN (see docs/CONNECT-SHOPIFY.md).");
  process.exit(1);
}

const query = /* GraphQL */ `
  {
    shop {
      name
      primaryDomain {
        url
      }
    }
    products(first: 5) {
      nodes {
        handle
        title
        availableForSale
        options {
          name
        }
        variants(first: 1) {
          nodes {
            price {
              amount
            }
            compareAtPrice {
              amount
            }
          }
        }
        images(first: 1) {
          nodes {
            url
          }
        }
      }
    }
    collections(first: 20) {
      nodes {
        handle
        title
      }
    }
  }
`;

const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
  body: JSON.stringify({ query }),
});
if (!res.ok) {
  console.error(`✗ HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const { data, errors } = await res.json();
if (errors?.length) {
  console.error("✗ " + errors.map((e) => e.message).join("; "));
  process.exit(1);
}

console.log(`✓ Connected to "${data.shop.name}" (${data.shop.primaryDomain.url}) on API ${version}`);
console.log(`✓ Collections: ${data.collections.nodes.map((c) => c.handle).join(", ") || "(none)"}`);
const expected = ["earrings", "necklace", "rings-1", "bracelets", "elegance-set"];
const missing = expected.filter((h) => !data.collections.nodes.some((c) => c.handle === h));
if (missing.length) console.warn(`! Collections this site expects but Shopify didn't return: ${missing.join(", ")}`);
console.log(`✓ Sample products: ${data.products.nodes.length}`);
for (const p of data.products.nodes) {
  const v = p.variants.nodes[0];
  const notes = [];
  if (!p.images.nodes.length) notes.push("no images");
  if (!v || !Number(v.price.amount)) notes.push("no price");
  if (v?.compareAtPrice && Number(v.compareAtPrice.amount) <= Number(v.price.amount))
    notes.push("compare-at ≤ price (ignored)");
  const odd = p.options.map((o) => o.name).filter((n) => n !== "Title" && !/colou?r|size|material|metal|tone/i.test(n));
  if (odd.length) notes.push(`option(s) shown as "Style": ${odd.join(", ")}`);
  console.log(`  - ${p.handle}${notes.length ? `  ⚠ ${notes.join("; ")}` : ""}`);
}
