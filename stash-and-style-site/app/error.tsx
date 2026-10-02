"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <p className="eyebrow text-accent-strong">Something went wrong</p>
      <h1 className="mt-3 font-display text-h1">This page didn&rsquo;t load</h1>
      <p className="mt-3 max-w-md text-muted">
        It&rsquo;s probably a brief hiccup. Try again, and if it keeps happening, head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-h-12 rounded-full bg-ink px-7 text-[0.9375rem] font-medium text-surface"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-full border border-ink px-7 text-[0.9375rem] font-medium"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
