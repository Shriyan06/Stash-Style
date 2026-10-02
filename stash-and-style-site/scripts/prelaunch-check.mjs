#!/usr/bin/env node
/**
 * Pre-launch warning list. Runs before every build (npm "prebuild").
 * Lists every [REPLACE BEFORE LAUNCH] marker and every empty business value in config/site.ts.
 * It warns, it doesn't fail — set PRELAUNCH_STRICT=1 to make it fail the build.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const MARK = "[REPLACE BEFORE LAUNCH]";
const hits = [];

function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|md)$/.test(f) && !f.startsWith("_") && f !== "marker.ts") {
      readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (/^\s*(\*|\/\/)/.test(line)) return; // skip comments
          if (line.includes("${REPLACE}") || line.includes(MARK))
            hits.push(`${path.relative(root, p)}:${i + 1}  ${line.trim().slice(0, 110)}`);
        });
    }
  }
}
walk(path.join(root, "content"));

const config = readFileSync(path.join(root, "config/site.ts"), "utf8");
const empties = [...config.matchAll(/^\s*(\w+):\s*(""|null(?: as [^,]+)?),/gm)].map((m) => m[1]);

const brand = JSON.parse(readFileSync(path.join(root, "data/brand-images.json"), "utf8"));
const placeholders = Object.entries(brand)
  .filter(([, v]) => v && v.placeholder)
  .map(([k]) => k);

const lines = [];
if (hits.length) lines.push(`${MARK} markers (${hits.length}):`, ...hits.map((h) => `  - ${h}`));
if (empties.length) lines.push(`Empty values in config/site.ts (UI hides these): ${empties.join(", ")}`);
if (placeholders.length) lines.push(`Generated placeholder images in /public/brand: ${placeholders.join(", ")}`);
if (!brand.logo) lines.push("No logo file: header uses the text wordmark.");

if (lines.length) {
  console.warn("\n⚠  Pre-launch checklist — fill these in before going live:\n" + lines.join("\n") + "\n");
  if (process.env.PRELAUNCH_STRICT === "1") process.exit(1);
} else {
  console.log("Pre-launch check: nothing left to replace.");
}
