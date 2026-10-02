"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store.
 * - Hydration-safe: the server snapshot (and the first client render) is the initial value.
 * - Cross-tab sync through the `storage` event.
 * - Every read/write is wrapped: private windows and blocked storage just fall back to memory.
 */
export function createLocalStore<T>(key: string, initial: T, storage: "local" | "session" = "local") {
  let value: T = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const area = () => {
    try {
      return storage === "local" ? window.localStorage : window.sessionStorage;
    } catch {
      return null;
    }
  };

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = area()?.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      /* ignore corrupt or blocked storage */
    }
  }

  function emit() {
    listeners.forEach((l) => l());
  }

  function set(next: T | ((prev: T) => T)) {
    load();
    value = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
    try {
      area()?.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: keep in memory */
    }
    emit();
  }

  function onStorage(e: StorageEvent) {
    if (e.key !== key) return;
    try {
      value = e.newValue ? (JSON.parse(e.newValue) as T) : initial;
    } catch {
      value = initial;
    }
    emit();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    if (listeners.size === 1) window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (!listeners.size) window.removeEventListener("storage", onStorage);
    };
  }

  function get() {
    load();
    return value;
  }

  function useValue() {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, subscribe, useValue };
}
