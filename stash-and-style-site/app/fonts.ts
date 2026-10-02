import { Cormorant_Garamond, Inter } from "next/font/google";

export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  // "optional": no late swap, so no layout shift; fonts are preloaded and small, so they normally make it
  display: "optional",
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  // "optional": no late swap, so no layout shift; fonts are preloaded and small, so they normally make it
  display: "optional",
});
