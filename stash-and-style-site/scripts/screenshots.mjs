#!/usr/bin/env node
/**
 * Screenshots key routes at 390px and 1280px and reports console errors / horizontal overflow.
 * Usage: BASE_URL=http://localhost:3000 node scripts/screenshots.mjs [outDir] [route ...]
 * Needs a running server (npm run build && npm start).
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL || "http://localhost:3000";
const outDir = path.resolve(process.argv[2] || "screenshots");
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ["/"];
const widths = (process.env.WIDTHS || "390,1280").split(",").map(Number);
const fullPage = process.env.FULL !== "0";
mkdirSync(outDir, { recursive: true });

const executablePath = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({
  executablePath,
  args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"],
});
let problems = 0;

for (const route of routes) {
  // "route#action" lets us open drawers before shooting: #cart, #menu, #search
  const [url, action] = route.split("#");
  for (const width of widths) {
    if (action === "menu" && width >= 1280) continue; // desktop shows the full nav instead
    const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 } });
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    await page.goto(base + url, { waitUntil: "load" });
    if (action === "cart") await page.getByRole("button", { name: /^Bag/ }).click();
    if (action === "menu") await page.getByRole("button", { name: "Open menu" }).click();
    if (action === "search") await page.keyboard.press("/");
    if (action) await page.waitForTimeout(500);
    // reveal everything for full-page shots
    await page.evaluate(() =>
      document.querySelectorAll(".reveal").forEach((el) => el.setAttribute("data-shown", "true")),
    );
    await page.waitForTimeout(700);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = `${(url.replace(/[/?=&]+/g, "_").replace(/^_|_$/g, "") || "home") + (action ? `-${action}` : "")}-${width}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: fullPage && !action });
    const flags = [];
    if (overflow > 0) flags.push(`horizontal overflow ${overflow}px`);
    if (errors.length) flags.push(...errors);
    if (flags.length) problems++;
    console.log(`${name}: ${flags.length ? flags.join(" | ") : "ok"}`);
    await page.close();
  }
}
await browser.close();
process.exit(problems ? 1 : 0);
