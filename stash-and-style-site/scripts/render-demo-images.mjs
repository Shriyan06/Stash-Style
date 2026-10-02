#!/usr/bin/env node
/**
 * Renders studio-style jewelry ILLUSTRATIONS (not photographs) for demo mode and the
 * homepage slideshow, so layouts can be judged with image-like content.
 * Replace with real product photography before launch.
 *
 * Output: public/demo/*.jpg  (+ data/demo-images.json with sizes and blur placeholders)
 * Run: npm run demo:images
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public/demo");
mkdirSync(out, { recursive: true });

/* ───────────── materials ───────────── */
const defs = `
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7a5622"/><stop offset=".22" stop-color="#c3913f"/>
    <stop offset=".42" stop-color="#fbe7ad"/><stop offset=".58" stop-color="#d5a653"/>
    <stop offset=".8" stop-color="#8a6326"/><stop offset="1" stop-color="#e3be73"/>
  </linearGradient>
  <linearGradient id="goldHi" x1="0" y1="1" x2="1" y2="0">
    <stop offset="0" stop-color="#fff6d6" stop-opacity="0"/><stop offset=".5" stop-color="#fff6d6" stop-opacity=".9"/>
    <stop offset="1" stop-color="#fff6d6" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#6d737d"/><stop offset=".25" stop-color="#b9bfc8"/>
    <stop offset=".45" stop-color="#ffffff"/><stop offset=".6" stop-color="#c9ced6"/>
    <stop offset=".82" stop-color="#7f8691"/><stop offset="1" stop-color="#dfe3e9"/>
  </linearGradient>
  <linearGradient id="rose" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7d4a3c"/><stop offset=".25" stop-color="#c98e78"/>
    <stop offset=".45" stop-color="#ffe0d2"/><stop offset=".6" stop-color="#d79f88"/>
    <stop offset=".82" stop-color="#8c5646"/><stop offset="1" stop-color="#e8b8a3"/>
  </linearGradient>
  <radialGradient id="pearl" cx=".35" cy=".3" r=".75">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#f6f1e8"/>
    <stop offset=".75" stop-color="#d9cfc0"/><stop offset="1" stop-color="#a99c8a"/>
  </radialGradient>
  <radialGradient id="sapphire" cx=".35" cy=".3" r=".8">
    <stop offset="0" stop-color="#cfe0ff"/><stop offset=".3" stop-color="#4f7fd6"/>
    <stop offset=".7" stop-color="#1b3e8f"/><stop offset="1" stop-color="#0c1f4f"/>
  </radialGradient>
  <radialGradient id="crystal" cx=".35" cy=".3" r=".8">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#e9f1ff"/>
    <stop offset=".75" stop-color="#b6c5dd"/><stop offset="1" stop-color="#8090ad"/>
  </radialGradient>
  <radialGradient id="emerald" cx=".35" cy=".3" r=".8">
    <stop offset="0" stop-color="#d9ffe9"/><stop offset=".35" stop-color="#3fae78"/>
    <stop offset=".75" stop-color="#16603e"/><stop offset="1" stop-color="#0b3322"/>
  </radialGradient>
  <filter id="blur20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
  <filter id="blur8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope=".06"/></feComponentTransfer>
    <feComposite in2="SourceGraphic" operator="over"/>
  </filter>
  <filter id="velvet" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="3" seed="9"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .08  0 0 0 0 .14  0 0 0 0 .3  0 0 0 .55 0"/>
  </filter>
`;

/* ───────────── backdrops ───────────── */
function backdrop(w, h, kind) {
  if (kind === "navy")
    return `
    <rect width="${w}" height="${h}" fill="#10224a"/>
    <rect width="${w}" height="${h}" filter="url(#velvet)"/>
    <radialGradient id="spot" cx=".55" cy=".42" r=".7"><stop offset="0" stop-color="#3a5aa0" stop-opacity=".55"/><stop offset="1" stop-color="#050c1f" stop-opacity=".85"/></radialGradient>
    <rect width="${w}" height="${h}" fill="url(#spot)"/>`;
  if (kind === "linen")
    return `
    <linearGradient id="lin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4efe6"/><stop offset="1" stop-color="#e3d8c6"/></linearGradient>
    <rect width="${w}" height="${h}" fill="url(#lin)"/>
    <radialGradient id="spot" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#b9a98f" stop-opacity=".35"/></radialGradient>
    <rect width="${w}" height="${h}" fill="url(#spot)"/>`;
  // "studio": cool seamless paper
  return `
    <linearGradient id="studio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f9fc"/><stop offset=".62" stop-color="#e9eef6"/><stop offset="1" stop-color="#d5dde9"/></linearGradient>
    <rect width="${w}" height="${h}" fill="url(#studio)"/>
    <radialGradient id="spot" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#c7d1e0" stop-opacity=".4"/></radialGradient>
    <rect width="${w}" height="${h}" fill="url(#spot)"/>`;
}

const shadow = (cx, cy, rx, ry, o = 0.28) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#0b1833" opacity="${o}" filter="url(#blur20)"/>`;

/* ───────────── objects ───────────── */
// A ring seen at an angle: thick metallic ellipse + highlight
function ring(cx, cy, r, { metal = "gold", width = 0.16, tilt = 0.36, gem } = {}) {
  const ry = r * tilt;
  const sw = r * width;
  let g = `
    ${shadow(cx, cy + ry + sw * 0.9, r * 0.95, ry * 0.45, 0.32)}
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry}" fill="none" stroke="url(#${metal})" stroke-width="${sw}"/>
    <ellipse cx="${cx}" cy="${cy - sw * 0.12}" rx="${r - sw * 0.25}" ry="${ry - sw * 0.2}" fill="none" stroke="url(#goldHi)" stroke-width="${sw * 0.18}" opacity=".7"/>`;
  if (gem) g += gemStone(cx, cy - ry - sw * 0.25, r * 0.28, gem);
  return g;
}

function gemStone(cx, cy, s, kind = "crystal") {
  const pts = [
    [0, -1],
    [0.7, -0.5],
    [0.85, 0.25],
    [0, 1],
    [-0.85, 0.25],
    [-0.7, -0.5],
  ]
    .map(([x, y]) => `${cx + x * s},${cy + y * s * 0.8}`)
    .join(" ");
  return `
    <ellipse cx="${cx}" cy="${cy + s * 0.75}" rx="${s * 1.05}" ry="${s * 0.35}" fill="url(#gold)"/>
    <polygon points="${pts}" fill="url(#${kind})" stroke="#ffffff" stroke-opacity=".5" stroke-width="${s * 0.04}"/>
    <polyline points="${cx - s * 0.7},${cy - s * 0.4} ${cx},${cy + s * 0.15} ${cx + s * 0.7},${cy - s * 0.4}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${s * 0.04}"/>
    <circle cx="${cx - s * 0.25}" cy="${cy - s * 0.35}" r="${s * 0.12}" fill="#fff" opacity=".9" filter="url(#blur3)"/>`;
}

function pearl(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#pearl)"/>
    <circle cx="${cx - r * 0.35}" cy="${cy - r * 0.38}" r="${r * 0.22}" fill="#fff" opacity=".9" filter="url(#blur3)"/>`;
}

// Chain along a drape (lower half of an ellipse)
function chain(cx, cy, rx, ry, links, size, metal = "gold", from = 0.04, to = 0.96) {
  let o = "";
  for (let i = 0; i <= links; i++) {
    const t = Math.PI * (from + (to - from) * (i / links));
    const x = cx - rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    const a = (Math.atan2(ry * Math.cos(t), rx * Math.sin(t)) * 180) / Math.PI + (i % 2 ? 90 : 0);
    const sx = i % 2 ? size * 0.55 : size;
    o += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${sx.toFixed(1)}" ry="${(size * 0.55).toFixed(1)}"
      transform="rotate(${a.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="url(#${metal})" stroke-width="${(size * 0.32).toFixed(1)}"/>`;
  }
  return o;
}

function necklace(cx, cy, rx, ry, { metal = "gold", links = 70, size = 9, pendant } = {}) {
  let o = `<ellipse cx="${cx}" cy="${cy + ry + 40}" rx="${rx * 0.5}" ry="${ry * 0.12}" fill="#0b1833" opacity=".12" filter="url(#blur20)"/>`;
  o += chain(cx, cy, rx, ry, links, size, metal);
  if (pendant === "coin")
    o += `${shadow(cx, cy + ry + size * 9, size * 5, size * 1.4, 0.25)}
      <circle cx="${cx}" cy="${cy + ry + size * 5}" r="${size * 4.2}" fill="url(#${metal})"/>
      <circle cx="${cx}" cy="${cy + ry + size * 5}" r="${size * 3.2}" fill="none" stroke="#fff6d6" stroke-opacity=".5" stroke-width="${size * 0.35}"/>
      <path d="M${cx - size * 1.6} ${cy + ry + size * 5} q ${size * 1.6} ${-size * 2.4} ${size * 3.2} 0" fill="none" stroke="#7a5622" stroke-width="${size * 0.4}" opacity=".7"/>`;
  if (pendant === "pearl") o += pearl(cx, cy + ry + size * 3.4, size * 3);
  if (pendant === "gem") o += gemStone(cx, cy + ry + size * 3.5, size * 3, "sapphire");
  return o;
}

function hoop(cx, cy, r, metal = "gold", thick = 0.13) {
  return `
    ${shadow(cx + r * 0.1, cy + r * 1.05, r * 0.8, r * 0.14, 0.22)}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#${metal})" stroke-width="${r * thick}"/>
    <path d="M ${cx - r * 0.75} ${cy - r * 0.62} A ${r} ${r} 0 0 1 ${cx + r * 0.4} ${cy - r * 0.92}" fill="none" stroke="#fff6d6" stroke-opacity=".8" stroke-width="${r * thick * 0.22}" stroke-linecap="round"/>`;
}

function bangle(cx, cy, r, metal, tilt = 0.3, sw = 0.1) {
  const ry = r * tilt;
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry}" fill="none" stroke="url(#${metal})" stroke-width="${r * sw}"/>
    <ellipse cx="${cx}" cy="${cy - r * sw * 0.2}" rx="${r * 0.96}" ry="${ry * 0.92}" fill="none" stroke="url(#goldHi)" stroke-width="${r * sw * 0.18}" opacity=".6"/>`;
}

/* ───────────── scenes ───────────── */
const P = [1200, 1500]; // product 4:5
const H = [2000, 1250]; // hero slide 16:10

const scenes = {
  // Earrings
  "hoops-gold": { size: P, bg: "studio", draw: (w, h) => hoop(w * 0.36, h * 0.47, 210) + hoop(w * 0.64, h * 0.5, 210) },
  "hoops-gold-navy": {
    size: P,
    bg: "navy",
    draw: (w, h) => hoop(w * 0.42, h * 0.45, 260) + hoop(w * 0.6, h * 0.58, 170),
  },
  "pearl-studs": {
    size: P,
    bg: "linen",
    draw: (w, h) =>
      shadow(w * 0.36, h * 0.6, 140, 30) +
      shadow(w * 0.64, h * 0.6, 140, 30) +
      pearl(w * 0.36, h * 0.5, 150) +
      pearl(w * 0.64, h * 0.5, 150),
  },
  "pearl-studs-navy": {
    size: P,
    bg: "navy",
    draw: (w, h) => pearl(w * 0.45, h * 0.48, 120) + pearl(w * 0.62, h * 0.6, 80),
  },
  "drop-earrings": {
    size: P,
    bg: "studio",
    draw: (w, h) =>
      [0.33, 0.67]
        .map(
          (x) =>
            hoop(w * x, h * 0.26, 70, "silver", 0.18) +
            `<line x1="${w * x}" y1="${h * 0.26 + 70}" x2="${w * x}" y2="${h * 0.46}" stroke="url(#silver)" stroke-width="9"/>` +
            gemStone(w * x, h * 0.56, 150, "sapphire"),
        )
        .join(""),
  },
  // Necklaces
  "pendant-gold": {
    size: P,
    bg: "studio",
    draw: (w, h) => necklace(w * 0.5, h * 0.12, 380, 600, { pendant: "coin", size: 10 }),
  },
  "pendant-gold-navy": {
    size: P,
    bg: "navy",
    draw: (w, h) => necklace(w * 0.5, h * 0.05, 420, 640, { pendant: "coin", size: 11 }),
  },
  "layered-silver": {
    size: P,
    bg: "studio",
    draw: (w, h) =>
      necklace(w * 0.5, h * 0.08, 330, 440, { metal: "silver", links: 60, size: 8 }) +
      necklace(w * 0.5, h * 0.08, 410, 650, { metal: "silver", links: 80, size: 9, pendant: "gem" }),
  },
  "layered-mixed-navy": {
    size: P,
    bg: "navy",
    draw: (w, h) =>
      necklace(w * 0.5, h * 0.06, 330, 470, { links: 60, size: 8, pendant: "pearl" }) +
      necklace(w * 0.5, h * 0.06, 420, 700, { metal: "silver", links: 84, size: 9 }),
  },
  // Rings
  "rings-stack-gold": {
    size: P,
    bg: "studio",
    draw: (w, h) =>
      ring(w * 0.5, h * 0.66, 230, { tilt: 0.33 }) +
      ring(w * 0.5, h * 0.53, 230, { tilt: 0.33, width: 0.1 }) +
      ring(w * 0.5, h * 0.41, 230, { tilt: 0.33, gem: "crystal" }),
  },
  "rings-stack-navy": {
    size: P,
    bg: "navy",
    draw: (w, h) =>
      ring(w * 0.4, h * 0.6, 220, { tilt: 0.38 }) +
      ring(w * 0.62, h * 0.48, 200, { metal: "silver", tilt: 0.4, gem: "sapphire" }),
  },
  "cocktail-ring": {
    size: P,
    bg: "linen",
    draw: (w, h) => ring(w * 0.5, h * 0.6, 360, { metal: "rose", tilt: 0.42, width: 0.12, gem: "emerald" }),
  },
  "silver-bands": {
    size: P,
    bg: "studio",
    draw: (w, h) =>
      ring(w * 0.42, h * 0.6, 200, { metal: "silver", tilt: 0.36 }) +
      ring(w * 0.6, h * 0.46, 200, { metal: "rose", tilt: 0.36, width: 0.11 }),
  },
  // Bracelets
  "bangles-gold": {
    size: P,
    bg: "studio",
    draw: (w, h) =>
      [0.36, 0.44, 0.52, 0.6, 0.68]
        .map((y, i) => bangle(w * 0.5, h * y, 360, i % 2 ? "silver" : "gold", 0.28, i % 2 ? 0.05 : 0.08))
        .join("") + shadow(w * 0.5, h * 0.82, 340, 40),
  },
  "bangles-navy": {
    size: P,
    bg: "navy",
    draw: (w, h) =>
      [0.4, 0.5, 0.6].map((y, i) => bangle(w * 0.5, h * y, 380, ["gold", "rose", "gold"][i], 0.3, 0.08)).join(""),
  },
  "chain-bracelet": {
    size: P,
    bg: "studio",
    draw: (w, h) => shadow(w * 0.5, h * 0.72, 330, 40) + chain(w * 0.5, h * 0.3, 360, 420, 46, 15, "silver", 0, 1),
  },
  "chain-bracelet-gold": {
    size: P,
    bg: "linen",
    draw: (w, h) => chain(w * 0.5, h * 0.32, 340, 400, 44, 15, "gold", 0, 1),
  },
  // Sets
  "set-gold": {
    size: P,
    bg: "linen",
    draw: (w, h) =>
      necklace(w * 0.5, h * 0.06, 330, 520, { pendant: "pearl", size: 9 }) +
      pearl(w * 0.24, h * 0.84, 72) +
      pearl(w * 0.76, h * 0.84, 72),
  },
  "set-gold-navy": {
    size: P,
    bg: "navy",
    draw: (w, h) =>
      necklace(w * 0.5, h * 0.05, 360, 560, { pendant: "gem", size: 9 }) +
      hoop(w * 0.27, h * 0.84, 70) +
      hoop(w * 0.73, h * 0.84, 70),
  },
  "set-silver": {
    size: P,
    bg: "studio",
    draw: (w, h) =>
      necklace(w * 0.5, h * 0.06, 340, 540, { metal: "silver", pendant: "gem", size: 9 }) +
      gemStone(w * 0.24, h * 0.84, 66, "sapphire") +
      gemStone(w * 0.76, h * 0.84, 66, "sapphire"),
  },

  // Homepage slideshow
  "slide-everyday": {
    size: H,
    bg: "navy",
    draw: (w, h) =>
      necklace(w * 0.66, h * 0.02, 380, 560, { links: 64, size: 10, pendant: "coin" }) +
      necklace(w * 0.66, h * 0.02, 480, 760, { metal: "silver", links: 90, size: 9 }) +
      ring(w * 0.86, h * 0.78, 120, { tilt: 0.38 }) +
      ring(w * 0.93, h * 0.7, 105, { metal: "silver", tilt: 0.38, gem: "sapphire" }),
  },
  "slide-stack": {
    size: H,
    bg: "navy",
    draw: (w, h) =>
      [0.34, 0.43, 0.52, 0.61, 0.7]
        .map((y, i) =>
          bangle(w * 0.68, h * y, 420, ["gold", "silver", "gold", "rose", "gold"][i], 0.28, i % 2 ? 0.05 : 0.08),
        )
        .join("") + chain(w * 0.68, h * 0.18, 470, 520, 60, 13, "gold", 0, 1),
  },
  "slide-gifts": {
    size: H,
    bg: "navy",
    draw: (w, h) => {
      const bx = w * 0.56,
        by = h * 0.36,
        bw = 560,
        bh = 420;
      return `${shadow(bx + bw / 2, by + bh + 20, bw * 0.55, 50, 0.45)}
        <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="10" fill="#f4efe6"/>
        <rect x="${bx + 24}" y="${by + 24}" width="${bw - 48}" height="${bh - 48}" rx="6" fill="#e9e1d3"/>
        <rect x="${bx + bw / 2 - 22}" y="${by}" width="44" height="${bh}" fill="#c9a35e"/>
        ${necklace(bx + bw / 2, by + 40, 190, 220, { links: 40, size: 7, pendant: "pearl" })}
        ${pearl(bx + 120, by + bh - 90, 34)}${pearl(bx + bw - 120, by + bh - 90, 34)}
        <path d="M${bx + bw / 2} ${by} c -120 -140 -230 -40 -60 -10 M${bx + bw / 2} ${by} c 120 -140 230 -40 60 -10" fill="none" stroke="#c9a35e" stroke-width="30" stroke-linecap="round"/>`;
    },
  },
};

function svg(name, { size: [w, h], bg, draw }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${defs}</defs>
  ${backdrop(w, h, bg)}
  ${draw(w, h)}
  <rect width="${w}" height="${h}" fill="transparent" filter="url(#grain)"/>
</svg>`;
}

const manifest = {};
for (const [name, scene] of Object.entries(scenes)) {
  const file = path.join(out, `${name}.jpg`);
  await sharp(Buffer.from(svg(name, scene)))
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(file);
  const blur = await sharp(file).resize(12).jpeg({ quality: 50 }).toBuffer();
  manifest[name] = {
    src: `/demo/${name}.jpg`,
    width: scene.size[0],
    height: scene.size[1],
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  process.stdout.write(".");
}
writeFileSync(path.join(root, "data/demo-images.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nRendered ${Object.keys(scenes).length} illustrations to public/demo/`);
