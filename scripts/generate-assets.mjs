import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDir = path.join(process.cwd(), "public", "images");

const palettes = {
  hero: ["#073d2d", "#0b5a3f", "#dff6e8", "#c7a45a"],
  biochar: ["#10231c", "#31553e", "#9fbf83", "#d8b766"],
  mangrove: ["#05382d", "#0f6c4c", "#84c7a0", "#dff6e8"],
  regenerative: ["#21452f", "#6b8f42", "#d3bf72", "#f6fbf5"],
  policy: ["#073d2d", "#265a42", "#c7a45a", "#eaf6eb"],
};

function landscapeSvg({ title, colors, kind }) {
  const [dark, mid, light, accent] = colors;
  const details =
    kind === "biochar"
      ? `<circle cx="870" cy="555" r="74" fill="${dark}" opacity=".55"/><circle cx="950" cy="570" r="52" fill="${dark}" opacity=".36"/><rect x="780" y="580" width="260" height="42" rx="21" fill="${accent}" opacity=".62"/>`
      : kind === "mangrove"
        ? `<path d="M770 538c44-88 130-88 164 0 40-78 116-74 150 4" fill="none" stroke="${light}" stroke-width="18" stroke-linecap="round" opacity=".9"/><path d="M858 534v110M970 538v118" stroke="${dark}" stroke-width="14" stroke-linecap="round" opacity=".6"/>`
        : kind === "regenerative"
          ? `<path d="M0 675c205-86 372-84 590-8 236 82 416 80 610-8v221H0z" fill="${accent}" opacity=".74"/><path d="M170 655c180-36 334-28 486 24" fill="none" stroke="${dark}" stroke-width="10" opacity=".16"/>`
          : `<rect x="725" y="215" width="300" height="310" rx="34" fill="#fff" opacity=".22"/><path d="M772 292h204M772 356h164M772 420h212" stroke="${accent}" stroke-width="18" stroke-linecap="round" opacity=".8"/>`;

  return `
  <svg width="1200" height="880" viewBox="0 0 1200 880" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${light}"/>
        <stop offset=".52" stop-color="#f7fff5"/>
        <stop offset="1" stop-color="${mid}"/>
      </linearGradient>
      <radialGradient id="sun" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(884 176) rotate(90) scale(170)">
        <stop stop-color="${accent}" stop-opacity=".92"/>
        <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="880" fill="url(#sky)"/>
    <circle cx="884" cy="176" r="190" fill="url(#sun)"/>
    <path d="M0 565c150-96 294-124 434-83 118 34 197 108 323 94 144-17 242-138 443-104v408H0z" fill="${mid}" opacity=".92"/>
    <path d="M0 642c210-91 398-66 588 7 202 78 398 74 612-20v251H0z" fill="${dark}"/>
    <path d="M0 723c160-46 301-43 457 7 198 64 427 68 743-8v158H0z" fill="${light}" opacity=".54"/>
    <path d="M145 602c0-72 56-132 128-136 86-5 154 61 154 143" fill="${dark}" opacity=".32"/>
    <path d="M214 654V510" stroke="${dark}" stroke-width="18" stroke-linecap="round" opacity=".72"/>
    <path d="M170 540c24-54 74-76 132-59 42 12 74 47 84 92-50-8-78 16-112 42-35-30-68-48-104-75z" fill="${light}" opacity=".86"/>
    ${details}
    <rect x="76" y="70" width="404" height="116" rx="28" fill="#fff" opacity=".22"/>
    <text x="112" y="126" fill="${dark}" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="800">${title}</text>
    <text x="112" y="160" fill="${dark}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" opacity=".7">Triochar carbon project visual</text>
  </svg>`;
}

const assets = [
  {
    file: "hero-carbon-platform.png",
    title: "Bankable Carbon",
    kind: "mangrove",
    colors: palettes.hero,
  },
  {
    file: "project-biochar.png",
    title: "Biochar",
    kind: "biochar",
    colors: palettes.biochar,
  },
  {
    file: "project-mangrove.png",
    title: "Restoration",
    kind: "mangrove",
    colors: palettes.mangrove,
  },
  {
    file: "project-regenerative.png",
    title: "Regenerative",
    kind: "regenerative",
    colors: palettes.regenerative,
  },
  {
    file: "knowledge-policy.png",
    title: "Knowledge",
    kind: "policy",
    colors: palettes.policy,
  },
];

await fs.mkdir(outputDir, { recursive: true });

for (const asset of assets) {
  await sharp(Buffer.from(landscapeSvg(asset))).png().toFile(path.join(outputDir, asset.file));
}
