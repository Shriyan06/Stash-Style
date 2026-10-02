import { getAllProducts, toSummary } from "@/lib/catalog";

/** Compact product index for client-side search, wishlist and recently viewed. */
export const revalidate = 300;

export async function GET() {
  const products = await getAllProducts();
  return Response.json(products.map(toSummary), {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" },
  });
}
