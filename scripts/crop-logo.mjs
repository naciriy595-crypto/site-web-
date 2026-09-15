// Regenerates the site's brand assets from the original square logo photo
// (public/brand/clifstone-logo-original.jpg). Re-run this if you replace that
// source file with a higher-resolution version of the same graffiti wordmark.
import sharp from "sharp";

const SRC = "public/brand/clifstone-logo-original.jpg";

async function main() {
  // Wide lockup used in the header/footer/admin/login logo — cropped tightly
  // around the letterforms (excluding most of the outer spray splatter) so
  // the wordmark stays legible at small sizes instead of being squeezed into
  // a near-square crop.
  await sharp(SRC)
    .extract({ left: 15, top: 232, width: 815, height: 345 })
    .webp({ quality: 88 })
    .toFile("public/brand/logo-wordmark.webp");

  // Square crop around the leading "C" for the favicon / apple touch icon —
  // doesn't need to be legible as a letter at 16-32px, just read as the
  // brand's textured mark.
  await sharp(SRC)
    .extract({ left: 0, top: 228, width: 380, height: 380 })
    .toFile("public/brand/logo-mark-square.png");

  await sharp("public/brand/logo-mark-square.png").resize(256, 256).toFile("src/app/icon.png");
  await sharp("public/brand/logo-mark-square.png").resize(180, 180).toFile("src/app/apple-icon.png");

  console.log("Regenerated logo-wordmark.webp, icon.png, apple-icon.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
