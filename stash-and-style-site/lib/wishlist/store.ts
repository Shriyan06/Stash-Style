"use client";

import { createLocalStore } from "@/lib/storage";

/** Saved product handles, newest first. */
export const wishlistStore = createLocalStore<string[]>("ss-wishlist-v1", []);

export function toggleWishlist(handle: string): boolean {
  let added = false;
  wishlistStore.set((list) => {
    added = !list.includes(handle);
    return added ? [handle, ...list] : list.filter((h) => h !== handle);
  });
  return added;
}

/** Recently viewed product handles (max 8, newest first). */
export const recentlyViewedStore = createLocalStore<string[]>("ss-recent-v1", []);

export function pushRecentlyViewed(handle: string) {
  recentlyViewedStore.set((list) => [handle, ...list.filter((h) => h !== handle)].slice(0, 8));
}

/** Recent search terms (max 5). */
export const recentSearchStore = createLocalStore<string[]>("ss-searches-v1", []);

export function pushRecentSearch(term: string) {
  const t = term.trim();
  if (t.length < 2) return;
  recentSearchStore.set((list) => [t, ...list.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5));
}
