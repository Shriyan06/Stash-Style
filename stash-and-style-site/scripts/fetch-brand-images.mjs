#!/usr/bin/env node
/**
 * Downloads the placeholder brand imagery from the current store into /public/brand.
 * If a download fails (or the image is too small for its use), it generates a tinted
 * line-art placeholder at the target size instead, so the site never ships a broken image.
 *
 * Writes /data/brand-images.json (src, size, alt, blurDataURL, source) for the app to read.
 * Run: npm run brand:fetch
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/brand");
mkdirSync(outDir, { recursive: true });

const CDN = "https://stashandstyle.store/cdn/shop/files/";

/** minWidth: anything narrower is discarded and replaced by a placeholder. */
const images = [
  {
    key: "hero",
    file: "hero-lifestyle.jpg",
    urls: [CDN + "f26866cf-c622-4d83-b43a-46f54dbf14cf_1888x.jpg?v=1769030676"],
    minWidth: 800,
    size: [1888, 1180],
    alt: "A woman wearing layered gold-tone necklaces and stacked rings",
    art: { motif: "hero", from: "#E9D3C4", to: "#C99A6B" },
  },
  {
    key: "braceletFeature",
    file: "bracelets-feature.jpg",
    urls: [CDN + "9fb37958-270c-421d-b32c-1247b8fbeca8_1888x.jpg?v=1769006780"],
    minWidth: 800,
    size: [1600, 1200],
    alt: "A stack of gold-tone and silver-tone bracelets worn on one wrist",
    art: { motif: "bangles", from: "#F3E3DC", to: "#D9B48C" },
  },
  {
    key: "ringsSeasonal",
    file: "rings-seasonal.jpg",
    urls: [
      CDN + "d3ed0fff7e828ff8ba4c97c6be030289_1888x.jpg?v=1765831036",
      CDN + "d3ed0fff7e828ff8ba4c97c6be030289_10x.jpg?v=1765831036",
    ],
    minWidth: 800,
    size: [1200, 1500],
    alt: "Several rings stacked on two fingers",
    art: { motif: "rings", from: "#EFE6DA", to: "#C7A27A" },
  },
  {
    key: "eleganceSet",
    file: "elegance-set.jpg",
    urls: [
      CDN + "1768c1a3b85bba500adcbe1cd06b7398_1888x.jpg?v=1764026987",
      CDN + "1768c1a3b85bba500adcbe1cd06b7398_10x.jpg?v=1764026987",
    ],
    minWidth: 800,
    size: [1200, 1500],
    alt: "A matching necklace and earrings set laid out together",
    art: { motif: "set", from: "#E4E9E1", to: "#B9A07E" },
  },
  {
    key: "earringsPromo",
    file: "earrings-promo.jpg",
    urls: [
      CDN + "8a0570130b9eecf48f0f5639b5f3825d_1888x.jpg?v=1768409742",
      CDN + "8a0570130b9eecf48f0f5639b5f3825d_10x_crop_center.jpg?v=1768409742",
    ],
    minWidth: 800,
    size: [1200, 1500],
    alt: "Close-up of gold-tone hoop earrings",
    art: { motif: "earrings", from: "#F6E7DF", to: "#CFA27C" },
  },
  {
    key: "braceletsPromo",
    file: "bracelets-promo.jpg",
    urls: [
      CDN + "6a7763db-9185-4c10-a9b1-660844b06527_1888x.jpg?v=1768937917",
      CDN + "6a7763db-9185-4c10-a9b1-660844b06527_10x_crop_center.jpg?v=1768937917",
    ],
    minWidth: 800,
    size: [1200, 1500],
    alt: "Chain bracelets in gold-tone and silver-tone",
    art: { motif: "bangles", from: "#E8EDE6", to: "#B7A58C" },
  },
  {
    key: "freshGems",
    file: "fresh-gems.jpg",
    urls: [
      CDN + "b2ae3205d3d4c7e8e3ae9b8b4c60dee1_1888x.jpg?v=1768946136",
      CDN + "b2ae3205d3d4c7e8e3ae9b8b4c60dee1_361x536.jpg?v=1768946136",
    ],
    minWidth: 800,
    size: [1200, 1782],
    alt: "Pendant necklaces arranged on a soft cream background",
    art: { motif: "necklace", from: "#F5EDE4", to: "#D2AE86" },
  },
];

const logo = {
  key: "logo",
  file: "logo.png",
  urls: [CDN + "transparent-logo.png"],
};

function tryDownload(url, dest) {
  try {
    execFileSync("curl", ["-fsSL", "--max-time", "30", "-o", dest, url], { stdio: "pipe" });
    return existsSync(dest);
  } catch {
    if (existsSync(dest)) rmSync(dest);
    return false;
  }
}

/* ---------- placeholder line art ---------- */
const gold = "#8A5F2C";
const stroke = (w) => `fill="none" stroke="${gold}" stroke-opacity="0.55" stroke-width="${w}"`;

function chain(cx, cy, rx, ry, count, link, from = 0.08, to = 0.92) {
  // links along the lower half of an ellipse (a necklace drape)
  let out = "";
  for (let i = 0; i <= count; i++) {
    const t = Math.PI * (from + (to - from) * (i / count));
    const x = cx - rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    const angle = (Math.atan2(ry * Math.cos(t), rx * Math.sin(t)) * 180) / Math.PI;
    out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${link}" ry="${(link * 0.55).toFixed(1)}" transform="rotate(${angle.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" ${stroke(2)}/>`;
  }
  return out;
}

function motifSvg(motif, w, h) {
  const s = Math.min(w, h);
  switch (motif) {
    case "hero":
      return (
        chain(w * 0.66, h * 0.08, s * 0.34, s * 0.52, 46, s * 0.012) +
        chain(w * 0.66, h * 0.08, s * 0.27, s * 0.38, 36, s * 0.01) +
        `<circle cx="${w * 0.66}" cy="${h * 0.08 + s * 0.6}" r="${s * 0.035}" ${stroke(3)}/>` +
        `<circle cx="${w * 0.84}" cy="${h * 0.78}" r="${s * 0.09}" ${stroke(3)}/>` +
        `<circle cx="${w * 0.9}" cy="${h * 0.74}" r="${s * 0.09}" ${stroke(3)}/>`
      );
    case "rings":
      return (
        [0, 1, 2]
          .map(
            (i) =>
              `<ellipse cx="${w * 0.5}" cy="${h * (0.38 + i * 0.12)}" rx="${s * 0.26}" ry="${s * 0.08}" ${stroke(4)}/>`,
          )
          .join("") + `<circle cx="${w * 0.5}" cy="${h * 0.38 - s * 0.085}" r="${s * 0.03}" ${stroke(3)}/>`
      );
    case "bangles":
      return [0, 1, 2, 3, 4]
        .map(
          (i) =>
            `<ellipse cx="${w * 0.5}" cy="${h * (0.3 + i * 0.09)}" rx="${s * 0.32}" ry="${s * 0.11}" ${stroke(i % 2 ? 3 : 5)}/>`,
        )
        .join("");
    case "earrings":
      return [0.36, 0.64]
        .map(
          (x) =>
            `<circle cx="${w * x}" cy="${h * 0.3}" r="${s * 0.018}" ${stroke(3)}/>` +
            `<circle cx="${w * x}" cy="${h * 0.3 + s * 0.17}" r="${s * 0.15}" ${stroke(4)}/>`,
        )
        .join("");
    case "necklace":
      return (
        chain(w * 0.5, h * 0.12, s * 0.38, s * 0.5, 40, s * 0.016) +
        `<path d="M ${w * 0.5} ${h * 0.12 + s * 0.52} l ${s * 0.05} ${s * 0.08} l ${-s * 0.05} ${s * 0.08} l ${-s * 0.05} ${-s * 0.08} z" ${stroke(3)}/>`
      );
    case "set":
      return (
        chain(w * 0.5, h * 0.1, s * 0.3, s * 0.42, 34, s * 0.014) +
        `<circle cx="${w * 0.3}" cy="${h * 0.74}" r="${s * 0.07}" ${stroke(3)}/>` +
        `<circle cx="${w * 0.7}" cy="${h * 0.74}" r="${s * 0.07}" ${stroke(3)}/>`
      );
    default:
      return "";
  }
}

function placeholderSvg({ motif, from, to }, w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.3" r="0.6">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  ${motifSvg(motif, w, h)}
</svg>`;
}

async function blurDataURL(file) {
  const buf = await sharp(file).resize(12).jpeg({ quality: 50 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

const manifest = {};
const report = [];

for (const img of images) {
  const dest = path.join(outDir, img.file);
  let source = "placeholder";
  for (const url of img.urls) {
    if (!tryDownload(url, dest)) continue;
    const meta = await sharp(dest)
      .metadata()
      .catch(() => null);
    if (meta && meta.width >= img.minWidth) {
      source = url;
      break;
    }
    report.push(`${img.key}: ${url} downloaded but only ${meta?.width ?? "?"}px wide — discarded`);
    rmSync(dest, { force: true });
  }
  if (source === "placeholder") {
    const [w, h] = img.size;
    await sharp(Buffer.from(placeholderSvg(img.art, w, h)))
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(dest);
    report.push(`${img.key}: download failed or too small → generated ${w}×${h} placeholder`);
  }
  const meta = await sharp(dest).metadata();
  manifest[img.key] = {
    src: `/brand/${img.file}`,
    width: meta.width,
    height: meta.height,
    alt:
      source === "placeholder"
        ? "" // placeholder art is decorative; real photos get real alt text
        : img.alt,
    intendedAlt: img.alt,
    blurDataURL: await blurDataURL(dest),
    placeholder: source === "placeholder",
    source,
  };
}

const logoDest = path.join(outDir, logo.file);
const logoOk = logo.urls.some((u) => tryDownload(u, logoDest));
if (logoOk) {
  const meta = await sharp(logoDest).metadata();
  manifest.logo = { src: `/brand/${logo.file}`, width: meta.width, height: meta.height };
} else {
  manifest.logo = null;
  report.push("logo: download failed → header uses the text wordmark");
}

writeFileSync(path.join(root, "data/brand-images.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(report.length ? report.join("\n") : "All brand images downloaded.");
