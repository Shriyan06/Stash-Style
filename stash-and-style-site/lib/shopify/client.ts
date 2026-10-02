/**
 * Minimal typed Shopify Storefront API client.
 * Only used when SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN are set (server-side only).
 * See docs/CONNECT-SHOPIFY.md.
 */
import "server-only";

export const shopifyConfig = {
  domain: (process.env.SHOPIFY_STORE_DOMAIN ?? "").replace(/^https?:\/\//, "").replace(/\/$/, ""),
  token: process.env.SHOPIFY_STOREFRONT_TOKEN ?? "",
  apiVersion: process.env.SHOPIFY_API_VERSION || "2026-07",
};

export const isShopifyConfigured = () => Boolean(shopifyConfig.domain && shopifyConfig.token);

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  { revalidate = 300, cache }: { revalidate?: number | false; cache?: RequestCache } = {},
): Promise<T> {
  if (!isShopifyConfigured()) throw new Error("Shopify is not configured");
  const res = await fetch(`https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": shopifyConfig.token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { cache } : { next: { revalidate } }),
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Shopify returned no data");
  return json.data;
}

/* ───────────── Types (subset of the Storefront schema we query) ───────────── */

export type SfMoney = { amount: string; currencyCode: string };
export type SfImage = { url: string; altText: string | null; width: number | null; height: number | null };
export type SfVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: SfMoney;
  compareAtPrice: SfMoney | null;
  selectedOptions: { name: string; value: string }[];
  image: SfImage | null;
};
export type SfProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  createdAt: string;
  tags: string[];
  availableForSale: boolean;
  options: { name: string; values: string[] }[];
  images: { nodes: SfImage[] };
  variants: { nodes: SfVariant[] };
  collections: { nodes: { handle: string }[] };
};
export type SfCollection = { handle: string; title: string; description: string };
export type SfCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: SfMoney };
  lines: { nodes: { id: string; quantity: number; merchandise: { id: string } }[] };
};

/* ───────────── Fragments & queries ───────────── */

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    createdAt
    tags
    availableForSale
    options {
      name
      values
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
    collections(first: 20) {
      nodes {
        handle
      }
    }
  }
`;

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
          }
        }
      }
    }
  }
`;

export const QUERIES = {
  products: /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query Products($cursor: String) {
      products(first: 100, after: $cursor, sortKey: BEST_SELLING) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...ProductFields
        }
      }
    }
  `,
  product: /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query Product($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `,
  collections: /* GraphQL */ `
    query Collections {
      collections(first: 50) {
        nodes {
          handle
          title
          description
        }
      }
    }
  `,
  cartCreate: /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
  cartLinesAdd: /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
  cartLinesUpdate: /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
  cartLinesRemove: /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
};

/* ───────────── Catalog reads ───────────── */

export async function sfGetAllProducts(): Promise<SfProduct[]> {
  const out: SfProduct[] = [];
  let cursor: string | null = null;
  // Dropshipping catalogs are small; page through everything (100 per request).
  for (let i = 0; i < 50; i++) {
    const data: {
      products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: SfProduct[] };
    } = await shopifyFetch(QUERIES.products, { cursor });
    out.push(...data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return out;
}

export async function sfGetProduct(handle: string) {
  const data = await shopifyFetch<{ product: SfProduct | null }>(QUERIES.product, { handle });
  return data.product;
}

export async function sfGetCollections() {
  const data = await shopifyFetch<{ collections: { nodes: SfCollection[] } }>(QUERIES.collections);
  return data.collections.nodes;
}

/* ───────────── Cart mutations (never cached) ───────────── */

type UserErrors = { field: string[] | null; message: string }[];
type CartPayload<K extends string> = Record<K, { cart: SfCart | null; userErrors: UserErrors }>;

function unwrap<K extends string>(data: CartPayload<K>, key: K): SfCart {
  const { cart, userErrors } = data[key];
  if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  if (!cart) throw new Error("Shopify returned no cart");
  return cart;
}

export async function sfCartCreate(lines: { merchandiseId: string; quantity: number }[], note?: string) {
  const data = await shopifyFetch<CartPayload<"cartCreate">>(
    QUERIES.cartCreate,
    { input: { lines, note: note || undefined } },
    { cache: "no-store" },
  );
  return unwrap(data, "cartCreate");
}

export async function sfCartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const data = await shopifyFetch<CartPayload<"cartLinesAdd">>(
    QUERIES.cartLinesAdd,
    { cartId, lines },
    { cache: "no-store" },
  );
  return unwrap(data, "cartLinesAdd");
}

export async function sfCartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[]) {
  const data = await shopifyFetch<CartPayload<"cartLinesUpdate">>(
    QUERIES.cartLinesUpdate,
    { cartId, lines },
    { cache: "no-store" },
  );
  return unwrap(data, "cartLinesUpdate");
}

export async function sfCartLinesRemove(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<CartPayload<"cartLinesRemove">>(
    QUERIES.cartLinesRemove,
    { cartId, lineIds },
    { cache: "no-store" },
  );
  return unwrap(data, "cartLinesRemove");
}
