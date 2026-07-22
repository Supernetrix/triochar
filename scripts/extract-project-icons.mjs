import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error("Pass the project icon sheet path as the first argument.");
}

const outputDirectory = path.join(process.cwd(), "public", "project-icons");
const icons = [
  { name: "biochar-production", left: 186, top: 16 },
  { name: "afforestation", left: 607, top: 16 },
  { name: "agroforestry", left: 1023, top: 16 },
  { name: "clean-cookstove", left: 186, top: 333 },
  { name: "renewable-energy", left: 607, top: 333 },
  { name: "bioenergy-carbon-capture-and-storage", left: 1023, top: 333 },
  { name: "direct-air-carbon-capture-and-storage", left: 186, top: 653 },
  { name: "enhanced-rock-weathering", left: 607, top: 653 },
  { name: "sustainable-agriculture", left: 1023, top: 653 },
];

await fs.mkdir(outputDirectory, { recursive: true });

await Promise.all(
  icons.map(({ name, left, top }) =>
    sharp(sourcePath)
      .extract({ left, top, width: 282, height: 282 })
      .resize(240, 240)
      .webp({ quality: 90 })
      .toFile(path.join(outputDirectory, `${name}.webp`)),
  ),
);

console.log(`Extracted ${icons.length} project icons to ${outputDirectory}`);
