// Generates lightweight, on-brand SVG placeholder images for seeded products.
// Chrome/off-white palette with a subtle diagonal sheen + category monogram,
// so the store looks visually complete before real product photography is added.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "products");
mkdirSync(outDir, { recursive: true });

const categories = {
  watches: { icon: "watch", label: "Watches" },
  sunglasses: { icon: "sunglasses", label: "Sunglasses" },
  wallets: { icon: "wallet", label: "Wallets" },
  jewelry: { icon: "jewelry", label: "Jewelry" },
  accessories: { icon: "accessory", label: "Accessories" },
};

const icons = {
  watch: `<circle cx="0" cy="-10" r="58" fill="none" stroke="#111114" stroke-width="6"/>
    <circle cx="0" cy="-10" r="46" fill="none" stroke="#111114" stroke-width="2"/>
    <line x1="0" y1="-10" x2="0" y2="-42" stroke="#111114" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="-10" x2="24" y2="-2" stroke="#111114" stroke-width="5" stroke-linecap="round"/>
    <rect x="-16" y="-72" width="32" height="16" rx="4" fill="#111114"/>
    <rect x="-16" y="42" width="32" height="16" rx="4" fill="#111114"/>`,
  sunglasses: `<circle cx="-42" cy="0" r="34" fill="none" stroke="#111114" stroke-width="6"/>
    <circle cx="42" cy="0" r="34" fill="none" stroke="#111114" stroke-width="6"/>
    <line x1="-8" y1="-4" x2="8" y2="-4" stroke="#111114" stroke-width="6"/>
    <line x1="-76" y1="-6" x2="-96" y2="-16" stroke="#111114" stroke-width="6" stroke-linecap="round"/>
    <line x1="76" y1="-6" x2="96" y2="-16" stroke="#111114" stroke-width="6" stroke-linecap="round"/>`,
  wallet: `<rect x="-60" y="-42" width="120" height="84" rx="10" fill="none" stroke="#111114" stroke-width="6"/>
    <path d="M -60 -6 H 60" stroke="#111114" stroke-width="4"/>
    <rect x="16" y="-6" width="34" height="26" rx="4" fill="#111114"/>`,
  jewelry: `<circle cx="0" cy="-14" r="30" fill="none" stroke="#111114" stroke-width="6"/>
    <path d="M -30 -14 L 0 40 L 30 -14 Z" fill="none" stroke="#111114" stroke-width="5" stroke-linejoin="round"/>`,
  accessory: `<rect x="-50" y="-50" width="100" height="100" rx="20" fill="none" stroke="#111114" stroke-width="6"/>
    <circle cx="0" cy="0" r="18" fill="#111114"/>`,
};

function svgFor(name, categoryKey, seedIndex) {
  const rot = (seedIndex * 13) % 7 - 3;
  const icon = icons[categories[categoryKey].icon];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7f6f3"/>
      <stop offset="55%" stop-color="#eceae4"/>
      <stop offset="100%" stop-color="#dcd9d1"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="640" height="640" fill="url(#bg)"/>
  <rect width="640" height="640" fill="url(#sheen)"/>
  <g transform="translate(320 300) rotate(${rot})" opacity="0.92">${icon}</g>
  <text x="320" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="2" fill="#111114">${name.toUpperCase()}</text>
  <text x="320" y="574" text-anchor="middle" font-family="Arial, sans-serif" font-weight="400" font-size="18" letter-spacing="6" fill="#6b675f">CLIFSTONE</text>
  <rect x="16" y="16" width="608" height="608" fill="none" stroke="#111114" stroke-opacity="0.08" stroke-width="1"/>
</svg>`;
}

export const seedProducts = {
  watches: [
    "Onyx Chrono",
    "Midnight Steel",
    "Argent Classic",
    "Noir Heritage",
  ],
  sunglasses: [
    "Shadow Wrap",
    "Chrome Aviator",
    "Obsidian Round",
    "Ghost Frame",
  ],
  wallets: [
    "Slate Bifold",
    "Carbon Card Case",
    "Noir Leather Fold",
    "Ash Cardholder",
  ],
  jewelry: ["Iron Chain", "Silver Cross Pendant", "Signet Noir", "Chrome Hoop"],
  accessories: ["Steel Keyring", "Noir Cap", "Chrome Belt", "Signature Pin"],
};

let count = 0;
for (const [cat, names] of Object.entries(seedProducts)) {
  names.forEach((name, i) => {
    const slug = `${cat}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    for (let v = 1; v <= 2; v++) {
      const svg = svgFor(v === 1 ? name : `${name} — ${v}`, cat, i + v);
      writeFileSync(path.join(outDir, `${slug}-${v}.svg`), svg);
      count++;
    }
  });
}

console.log(`Generated ${count} placeholder images in public/products`);
