import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error("Pass the project icon sheet path as the first argument.");
}

const outputDirectory = path.join(process.cwd(), "public", "project-icons");
const icons = [
  { name: "biochar-production", left: 174, top: 13 },
  { name: "afforestation", left: 626, top: 13 },
  { name: "agroforestry", left: 1047, top: 13 },
  { name: "clean-cookstove", left: 174, top: 334 },
  { name: "renewable-energy", left: 626, top: 334 },
  { name: "bioenergy-carbon-capture-and-storage", left: 1047, top: 334 },
  { name: "direct-air-carbon-capture-and-storage", left: 185, top: 688, size: 260 },
  { name: "enhanced-rock-weathering", left: 637, top: 688, size: 260 },
  { name: "sustainable-agriculture", left: 1058, top: 688, size: 260 },
];

await fs.mkdir(outputDirectory, { recursive: true });

await Promise.all(
  icons.map(({ name, left, top, size = 282 }) =>
    sharp(sourcePath)
      .extract({ left, top, width: size, height: size })
      .resize(240, 240)
      .webp({ quality: 90 })
      .toFile(path.join(outputDirectory, `${name}.webp`)),
  ),
);

console.log(`Extracted ${icons.length} project icons to ${outputDirectory}`);
