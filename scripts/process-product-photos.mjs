// Resizes/re-encodes the real product photos into public/products/ with
// consistent naming, so every product image on the site is the same format
// (webp, capped at 1400px longest side) regardless of the original photo's
// size or orientation.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC_DIR = "/tmp/product-photos";
const OUT_DIR = "public/products";
mkdirSync(OUT_DIR, { recursive: true });

const MAP = [
  ["WhatsApp_Image_2026-09-15_at_03.25.09.jpeg", "watches-fang-bezel-onyx-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.09__5_.jpeg", "watches-fang-bezel-onyx-2.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.09__4_.jpeg", "watches-fang-bezel-crimson-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.09__1_.jpeg", "watches-orbit-chrono-teal-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.10.jpeg", "watches-orbit-chrono-teal-2.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.09__2_.jpeg", "watches-orbit-chrono-crimson-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.10__1_.jpeg", "watches-orbit-chrono-graphite-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.09__3_.jpeg", "watches-titanium-chrono-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.10__2_.jpeg", "wallets-panther-case-scarlet-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.11.jpeg", "wallets-panther-case-noir-gold-1.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.10__3_.jpeg", "wallets-panther-case-noir-gold-2.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.10__4_.jpeg", "wallets-panther-case-noir-gold-3.webp"],
  ["WhatsApp_Image_2026-09-15_at_03.25.10__5_.jpeg", "wallets-panther-case-noir-gold-4.webp"],
];

async function main() {
  for (const [src, out] of MAP) {
    await sharp(`${SRC_DIR}/${src}`)
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(`${OUT_DIR}/${out}`);
    console.log(`${src} -> ${out}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
