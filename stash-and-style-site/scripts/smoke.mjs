#!/usr/bin/env node
/**
 * Keyboard + smoke test against a running production server.
 *   npm run build:demo && npm start   (in another terminal)
 *   npm run test:smoke
 * Demo-only steps are skipped automatically when the catalog has no demo products.
 */
import { chromium } from "playwright-core";

const base = process.env.BASE_URL || "http://localhost:3000";
const executablePath = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath, args: ["--disable-background-networking"] });

let failures = 0;
const consoleProblems = [];
async function step(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    failures++;
    console.log(`✗ ${name}\n    ${String(e.message).split("\n")[0]}`);
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

async function newPage(width = 1280) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on("console", (m) => {
    if (m.type() === "error" || (m.type() === "warning" && /hydrat/i.test(m.text())))
      consoleProblems.push(`${page.url()} ${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => consoleProblems.push(`${page.url()} pageerror: ${e.message}`));
  // wait for React to hydrate after every navigation
  const goto = page.goto.bind(page);
  page.goto = async (url, opts) => {
    const res = await goto(url, opts);
    await page.waitForSelector("html[data-hydrated]", { timeout: 15000 });
    await page.waitForTimeout(700); // let late Suspense boundaries hydrate too
    return res;
  };
  return page;
}
const focused = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return el
      ? `${el.tagName.toLowerCase()}|${el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 40)}`
      : "";
  });
const openDialogs = (page) => page.evaluate(() => document.querySelectorAll("dialog[open]").length);

const index = await (await fetch(`${base}/search-index.json`)).json();
const demo = index.some((p) => p.demo);

/* ── Desktop chrome ───────────────────────────────────────── */
const page = await newPage(1280);
await page.goto(base + "/", { waitUntil: "load" });

await step("skip link is the first tab stop and moves focus to main", async () => {
  await page.keyboard.press("Tab");
  assert((await focused(page)).includes("Skip to content"), `first focus: ${await focused(page)}`);
  await page.keyboard.press("Enter");
  assert((await page.evaluate(() => location.hash)) === "#main", "hash not #main");
});

await step("tabbing through the header reaches nav, search, wishlist, account and bag", async () => {
  await page.goto(base + "/", { waitUntil: "load" });
  const seen = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    seen.push(await focused(page));
  }
  for (const want of ["Earrings", "Blog", "Search", "Wishlist", "Account", "Bag"])
    assert(
      seen.some((s) => s.includes(want)),
      `never focused ${want}: ${seen.join(", ")}`,
    );
});

await step('"/" opens search with the input focused; Esc closes and returns focus', async () => {
  await page.goto(base + "/", { waitUntil: "load" });
  await page.locator("body").click({ position: { x: 5, y: 600 } });
  await page.keyboard.press("/");
  await page.waitForSelector("dialog[open] input[type=search]");
  assert((await focused(page)).startsWith("input"), "search input not focused");
  if (demo) {
    await page.keyboard.type("ring");
    await page.waitForSelector("dialog[open] a[href^='/products/']");
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  assert((await openDialogs(page)) === 0, "search still open");
});

await step("bag drawer opens from the header, traps focus, Esc closes and focus returns", async () => {
  const bag = page.getByRole("button", { name: /^Bag/ });
  await bag.focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector("dialog[open]");
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  const inside = await page.evaluate(() => !!document.activeElement?.closest("dialog[open]"));
  assert(inside, "focus escaped the drawer");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  assert((await openDialogs(page)) === 0, "drawer still open");
  assert((await focused(page)).includes("Bag"), `focus returned to: ${await focused(page)}`);
});

/* ── Mobile menu ──────────────────────────────────────────── */
const mobile = await newPage(390);
await step("mobile menu opens, is focus-trapped and closes with Esc", async () => {
  await mobile.goto(base + "/", { waitUntil: "load" });
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await mobile.waitForSelector("dialog[open] nav[aria-label=Mobile]");
  for (let i = 0; i < 20; i++) await mobile.keyboard.press("Tab");
  assert(await mobile.evaluate(() => !!document.activeElement?.closest("dialog[open]")), "focus escaped menu");
  assert(
    await mobile.evaluate(() => getComputedStyle(document.documentElement).overflow === "hidden"),
    "body not scroll-locked",
  );
  await mobile.keyboard.press("Escape");
  await mobile.waitForTimeout(350);
  assert((await openDialogs(mobile)) === 0, "menu still open");
});

/* ── Demo-mode commerce flow ──────────────────────────────── */
if (demo) {
  await step("collection filters sync to the URL and can be cleared", async () => {
    await page.goto(base + "/collections/rings-1", { waitUntil: "load" });
    await page.waitForSelector("[data-url-synced]");
    const before = await page.locator("main ul li article").count();
    await page.getByRole("checkbox", { name: "Rose gold-tone" }).first().check();
    await page.waitForURL(/color=Rose/);
    const after = await page.locator("main ul li article").count();
    assert(after < before, `filter didn't narrow results (${before} → ${after})`);
    await page.getByRole("button", { name: "Clear all" }).first().click();
    await page.waitForURL((u) => !u.search.includes("color"));
  });

  await step("price slider is keyboard operable", async () => {
    const slider = page.getByLabel("Maximum price").first();
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.waitForURL(/max=/);
  });

  await step("gallery: arrow keys move between images", async () => {
    await page.goto(base + "/products/demo-stacking-ring-set", { waitUntil: "load" });
    const track = page.locator('[aria-roledescription="carousel"]');
    await track.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(700);
    const current = await page
      .locator('button[aria-current="true"][aria-label^="Show image"]')
      .getAttribute("aria-label");
    assert(current?.startsWith("Show image 2"), `current thumbnail: ${current}`);
  });

  await step("size guide modal opens and closes from the keyboard", async () => {
    await page.getByRole("button", { name: "Ring size guide" }).focus();
    await page.keyboard.press("Enter");
    await page.waitForSelector("dialog[open] table");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
    assert((await openDialogs(page)) === 0, "size guide still open");
    assert((await focused(page)).includes("Ring size guide"), "focus not returned to trigger");
  });

  await step("add to bag needs a variant, then updates the bag drawer and count", async () => {
    const add = page.getByRole("button", { name: "Add to bag", exact: true });
    assert(await add.isDisabled(), "add enabled before choosing options");
    await page.getByText("Gold-tone", { exact: true }).click();
    await page.getByText("US 7", { exact: true }).click();
    assert(await add.isEnabled(), "add still disabled after choosing options");
    await add.click();
    await page.waitForSelector("dialog[open] >> text=Stacking Ring Set");
    const label = await page.getByRole("button", { name: /^Bag/ }).getAttribute("aria-label");
    assert(label === "Bag, 1 item", `bag label: ${label}`);
    await page.locator("dialog[open]").getByRole("button", { name: "Increase quantity" }).click();
    await page.waitForSelector("dialog[open] >> text=$28.00");
  });

  await step("checkout opens the branded preview, validates, and never places an order", async () => {
    await page
      .locator("dialog[open]")
      .getByRole("button", { name: /Checkout/ })
      .click();
    await page.waitForURL(/\/checkout$/);
    await page.waitForSelector("text=Checkout preview.");
    assert(
      (await page.locator("input[autocomplete^='cc-'], input[name*='card' i]").count()) === 0,
      "card inputs present",
    );
    await page.getByRole("button", { name: /Pay now/ }).click();
    await page.waitForSelector("text=Enter an email address");
    assert((await focused(page)).startsWith("input"), "focus not moved to first invalid field");
    await page.getByPlaceholder("Email").fill("test@example.com");
    await page.getByPlaceholder("First name").fill("Sam");
    await page.getByPlaceholder("Last name").fill("Lee");
    await page.getByPlaceholder("Address", { exact: true }).fill("1 Main St");
    await page.getByPlaceholder("City").fill("Austin");
    await page.getByLabel("State", { exact: true }).selectOption("TX");
    await page.getByPlaceholder("ZIP code").fill("78701");
    await page.getByRole("button", { name: /Pay now/ }).click();
    await page.waitForSelector("dialog[open] >> text=No order was placed");
    await page.keyboard.press("Escape");
  });

  await step("bag persists across reloads and syncs to the cart page", async () => {
    await page.goto(base + "/cart", { waitUntil: "load" });
    await page.waitForSelector("text=Order summary");
    assert(await page.getByText("Stacking Ring Set").first().isVisible(), "line missing on /cart");
  });

  await step("wishlist toggle is a pressed button and shows on /wishlist", async () => {
    await page.goto(base + "/collections/earrings", { waitUntil: "load" });
    const heart = page.getByRole("button", { name: /Save Everyday Hoop Earrings/ });
    await heart.click();
    assert((await heart.getAttribute("aria-pressed")) === "true", "aria-pressed not true");
    await page.goto(base + "/wishlist", { waitUntil: "load" });
    await page.waitForSelector("text=Everyday Hoop Earrings");
  });
}

/* ── Routes respond ───────────────────────────────────────── */
await step("every static route returns 200 (and unknown routes 404)", async () => {
  const routes = [
    "/",
    "/collections",
    "/collections/all",
    "/search?q=x",
    "/cart",
    "/wishlist",
    "/about-us",
    "/faq",
    "/contact",
    "/blog",
    "/account",
    "/policies/privacy-policy",
    "/policies/refund-policy",
    "/policies/shipping-policy",
    "/policies/terms-of-service",
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.webmanifest",
    "/opengraph-image",
  ];
  for (const r of routes) {
    const res = await fetch(base + r);
    assert(res.status === 200, `${r} → ${res.status}`);
  }
  assert((await fetch(base + "/no-such-page")).status === 404, "unknown route not 404");
  assert((await fetch(base + "/products/no-such-product")).status === 404, "unknown product not 404");
});

await step("no console errors or hydration warnings", async () => {
  // a 404 document fetch is expected for the not-found route only
  const real = consoleProblems.filter((p) => !/no-such|404 \(Not Found\)/.test(p));
  assert(real.length === 0, real.join("\n    "));
});

await browser.close();
console.log(
  failures
    ? `\n${failures} step(s) failed (demo checks ${demo ? "ran" : "skipped"}).`
    : `\nAll steps passed (demo checks ${demo ? "ran" : "skipped"}).`,
);
process.exit(failures ? 1 : 0);
