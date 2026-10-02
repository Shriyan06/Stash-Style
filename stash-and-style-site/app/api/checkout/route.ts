import { isShopifyConfigured, sfCartCreate } from "@/lib/shopify/client";

/**
 * Creates a Shopify cart from the local bag and returns its checkoutUrl.
 * Only works with the Shopify provider; otherwise responds 501 and the UI shows
 * "Checkout opens once the store is connected".
 */
export async function POST(req: Request) {
  if (!isShopifyConfigured()) {
    return Response.json({ error: "Checkout opens once the store is connected." }, { status: 501 });
  }
  let body: { lines?: { variantId?: unknown; quantity?: unknown }[]; note?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const lines = (body.lines ?? [])
    .filter((l) => typeof l.variantId === "string" && l.variantId.startsWith("gid://shopify/ProductVariant/"))
    .map((l) => ({
      merchandiseId: l.variantId as string,
      quantity: Math.max(1, Math.min(10, Number(l.quantity) || 1)),
    }))
    .slice(0, 50);
  if (!lines.length) return Response.json({ error: "Your bag has no items that can be checked out." }, { status: 400 });
  try {
    const cart = await sfCartCreate(lines, typeof body.note === "string" ? body.note.slice(0, 500) : undefined);
    return Response.json({ checkoutUrl: cart.checkoutUrl });
  } catch (e) {
    console.error("[checkout]", e);
    return Response.json({ error: "Checkout is unavailable right now. Please try again." }, { status: 502 });
  }
}
