#!/usr/bin/env node
/**
 * WCAG contrast check for every text/background token pair used in the UI.
 * Reads the colour tokens straight from app/globals.css so it can't drift.
 * Exit code 1 if any pair fails.  Run: npm run check:contrast
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const css = readFileSync(path.resolve(import.meta.dirname, "../app/globals.css"), "utf8");
const root = css.match(/:root\s*{([\s\S]*?)}/)?.[1] ?? "";
const tokens = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [foreground, background, minimum, usage]
const pairs = [
  ["ink", "bg", 4.5, "body text"],
  ["ink", "surface", 4.5, "text on cards"],
  ["ink", "tint", 4.5, "text on ice-blue panels"],
  ["ink", "champagne", 4.5, "text on champagne badges"],
  ["surface", "navy", 4.5, "white text on navy sections"],
  ["surface", "navy-deep", 4.5, "white text on announcement bar"],
  ["on-navy-muted", "navy", 4.5, "secondary text on navy"],
  ["on-navy-muted", "navy-deep", 4.5, "secondary text on deep navy"],
  ["accent", "navy", 4.5, "gold text on navy"],
  ["accent", "navy-deep", 4.5, "gold text on deep navy"],
  ["ink", "accent", 4.5, "navy text on gold buttons"],
  ["accent", "navy", 3, "focus ring on navy"],
  ["muted", "bg", 4.5, "secondary text"],
  ["muted", "surface", 4.5, "secondary text on cards"],
  ["muted", "tint", 4.5, "secondary text on ice-blue"],
  ["accent-strong", "bg", 4.5, "gold-tone links / eyebrows"],
  ["accent-strong", "surface", 4.5, "gold-tone text on cards"],
  ["accent-ink", "accent-strong", 4.5, "accent button label"],
  ["surface", "ink", 4.5, "primary button label"],
  ["bg", "ink", 4.5, "text on dark footer strip"],
  ["danger", "bg", 4.5, "error text"],
  ["danger", "surface", 4.5, "error text on cards"],
  ["success", "bg", 4.5, "success text"],
  ["success", "champagne", 4.5, "success text on champagne"],
  ["surface", "danger", 4.5, "sale badge label"],
  ["accent-strong", "bg", 3, "focus ring vs page"],
  ["accent-strong", "surface", 3, "focus ring vs cards"],
  ["accent-strong", "tint", 3, "focus ring vs ice-blue panels"],
  ["accent-strong", "champagne", 3, "focus ring vs champagne"],
  ["line-strong", "surface", 3, "form control borders"],
  ["line-strong", "bg", 3, "form control borders on page"],
];

let failed = 0;
console.log("Pair".padEnd(34), "Ratio".padStart(6), " Min  Result  Usage");
for (const [fg, bg, min, usage] of pairs) {
  if (!tokens[fg] || !tokens[bg]) {
    console.log(`${fg} / ${bg}: missing token`);
    failed++;
    continue;
  }
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${fg} on ${bg}`.padEnd(34),
    r.toFixed(2).padStart(6),
    ` ${min.toFixed(1)}  ${ok ? "pass" : "FAIL"}    ${usage}`,
  );
}
console.log(failed ? `\n${failed} pair(s) failed.` : "\nAll pairs pass WCAG AA.");
process.exit(failed ? 1 : 0);
