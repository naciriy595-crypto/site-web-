import { PrismaClient, StockStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedProduct = {
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  featured?: boolean;
  stockStatus?: StockStatus;
  color?: string;
  variantGroup?: string;
};

type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  products: SeedProduct[];
};

const categories: SeedCategory[] = [
  {
    slug: "watches",
    name: "Watches",
    description: "Bold statement watches with a gothic streetwear-luxe edge.",
    products: [
      {
        slug: "fang-bezel-onyx",
        name: "Fang Bezel — Onyx",
        shortDesc: "Sculpted claw bezel, matte black dial, stainless steel band.",
        description:
          "A sculpted claw/fang bezel wraps around a matte black dial for a bold, unmistakable silhouette. Solid stainless steel case and band with a brushed gunmetal finish. Built to be the centerpiece of any outfit — streetwear or evening wear alike.",
        price: 890,
        compareAtPrice: 1090,
        images: [
          "/products/watches-fang-bezel-onyx-1.webp",
          "/products/watches-fang-bezel-onyx-2.webp",
        ],
        featured: true,
        color: "Onyx",
        variantGroup: "fang-bezel",
      },
      {
        slug: "fang-bezel-crimson",
        name: "Fang Bezel — Crimson",
        shortDesc: "Same sculpted claw bezel, deep red dial for a bolder look.",
        description:
          "The same sculpted claw/fang bezel design as our Onyx edition, finished with a striking deep red dial. Solid stainless steel construction, water resistant, and built to turn heads.",
        price: 890,
        images: ["/products/watches-fang-bezel-crimson-1.webp"],
        color: "Crimson",
        variantGroup: "fang-bezel",
      },
      {
        slug: "orbit-chrono-teal",
        name: "Orbit Chrono — Teal",
        shortDesc: "Rounded case, globe emblem dial in tiffany teal.",
        description:
          "A smooth, rounded case houses a striking teal dial with a raised globe emblem and luminous hour markers. Polished stainless steel band. A distinctive everyday watch that stands out without trying too hard.",
        price: 750,
        images: [
          "/products/watches-orbit-chrono-teal-1.webp",
          "/products/watches-orbit-chrono-teal-2.webp",
        ],
        featured: true,
        color: "Teal",
        variantGroup: "orbit-chrono",
      },
      {
        slug: "orbit-chrono-crimson",
        name: "Orbit Chrono — Crimson",
        shortDesc: "Rounded case, globe emblem dial in bold red.",
        description:
          "Same rounded case and raised globe emblem as our Teal edition, finished in a bold red dial with a brushed silver bezel. Polished stainless steel band, comfortable for all-day wear.",
        price: 750,
        images: ["/products/watches-orbit-chrono-crimson-1.webp"],
        color: "Crimson",
        variantGroup: "orbit-chrono",
      },
      {
        slug: "orbit-chrono-graphite",
        name: "Orbit Chrono — Graphite",
        shortDesc: "Rounded case, globe emblem dial in graphite black.",
        description:
          "The understated edition of our Orbit Chrono: a graphite and black globe-emblem dial inside a polished stainless steel case. Minimal, versatile, and easy to dress up or down.",
        price: 750,
        images: ["/products/watches-orbit-chrono-graphite-1.webp"],
        color: "Graphite",
        variantGroup: "orbit-chrono",
      },
      {
        slug: "titanium-chrono",
        name: "Titanium Chrono",
        shortDesc: "Sculptural titanium-finish case with a multi-dial chronograph face.",
        description:
          "A sculptural, curved titanium-finish case wraps a detailed multi-dial chronograph face with day, date, and 24-hour sub-dials. A technical, futuristic piece for anyone who wants their watch to look like a piece of engineering.",
        price: 980,
        images: ["/products/watches-titanium-chrono-1.webp"],
      },
    ],
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    description: "Chrome and black frames with full UV400 protection.",
    products: [
      {
        slug: "shadow-wrap",
        name: "Shadow Wrap",
        shortDesc: "Wraparound frame with full UV400 protection.",
        description:
          "A wraparound frame for a bold, modern look, with full UV400 protection against harmful rays. Lightweight and comfortable for everyday wear.",
        price: 350,
        images: ["/products/sunglasses-shadow-wrap-1.svg", "/products/sunglasses-shadow-wrap-2.svg"],
        featured: true,
      },
      {
        slug: "chrome-aviator",
        name: "Chrome Aviator",
        shortDesc: "Chrome-plated aviator frame, polarized lenses.",
        description:
          "A chrome-plated aviator frame with polarized, anti-glare lenses. A timeless classic reimagined in the Clifstone palette.",
        price: 420,
        images: ["/products/sunglasses-chrome-aviator-1.svg", "/products/sunglasses-chrome-aviator-2.svg"],
      },
      {
        slug: "obsidian-round",
        name: "Obsidian Round",
        shortDesc: "Deep black round frame, flatters most face shapes.",
        description:
          "An elegant round frame in deep black, a simple design that suits most face shapes and adds a modern touch to any outfit.",
        price: 380,
        images: ["/products/sunglasses-obsidian-round-1.svg", "/products/sunglasses-obsidian-round-2.svg"],
      },
      {
        slug: "ghost-frame",
        name: "Ghost Frame",
        shortDesc: "Ultra-light frame with a clean, minimal design.",
        description:
          "An ultra-lightweight frame with a clean, minimal design. Comfortable for extended wear without ever compromising on style.",
        price: 400,
        images: ["/products/sunglasses-ghost-frame-1.svg", "/products/sunglasses-ghost-frame-2.svg"],
      },
    ],
  },
  {
    slug: "wallets",
    name: "Wallets",
    description: "Metal card cases and leather goods built to last.",
    products: [
      {
        slug: "panther-case-noir-gold",
        name: "Panther Case — Noir Gold",
        shortDesc: "Polished steel cigarette-style case, navy with gold leopard art.",
        description:
          "A polished stainless steel card and cash case with a hand-illustrated gold leopard motif on a deep navy panel. Two internal compartments keep cards, cash, and small essentials organized and protected. Compact enough to slip into any pocket.",
        price: 320,
        images: [
          "/products/wallets-panther-case-noir-gold-1.webp",
          "/products/wallets-panther-case-noir-gold-2.webp",
          "/products/wallets-panther-case-noir-gold-3.webp",
          "/products/wallets-panther-case-noir-gold-4.webp",
        ],
        featured: true,
        color: "Noir Gold",
        variantGroup: "panther-case",
      },
      {
        slug: "panther-case-scarlet",
        name: "Panther Case — Scarlet",
        shortDesc: "Polished steel cigarette-style case, bold red cat print.",
        description:
          "The same durable stainless steel card and cash case, finished with a bold red panel and a striking black cat print. A compact, protective way to carry your cards and cash.",
        price: 320,
        images: ["/products/wallets-panther-case-scarlet-1.webp"],
        color: "Scarlet",
        variantGroup: "panther-case",
      },
    ],
  },
  {
    slug: "jewelry",
    name: "Jewelry",
    description: "Silver and steel pieces, minimalist with character.",
    products: [
      {
        slug: "iron-chain",
        name: "Iron Chain",
        shortDesc: "Bold stainless steel chain necklace.",
        description:
          "A bold stainless steel chain necklace, resistant to rust and tarnish, equally suited to everyday wear or a night out.",
        price: 280,
        images: ["/products/jewelry-iron-chain-1.svg", "/products/jewelry-iron-chain-2.svg"],
      },
      {
        slug: "silver-cross-pendant",
        name: "Silver Cross Pendant",
        shortDesc: "Silver-finish cross pendant with adjustable chain.",
        description:
          "A silver-finish cross pendant on an adjustable chain. A symbolic, understated piece for a statement look.",
        price: 260,
        images: [
          "/products/jewelry-silver-cross-pendant-1.svg",
          "/products/jewelry-silver-cross-pendant-2.svg",
        ],
        featured: true,
      },
      {
        slug: "signet-noir",
        name: "Signet Noir",
        shortDesc: "Modern signet ring with polished edges.",
        description:
          "A modern signet ring with carefully polished edges, made from a wear-resistant alloy that keeps its shine over time.",
        price: 240,
        images: ["/products/jewelry-signet-noir-1.svg", "/products/jewelry-signet-noir-2.svg"],
      },
      {
        slug: "chrome-hoop",
        name: "Chrome Hoop",
        shortDesc: "Chrome-finish hoop earrings, unisex.",
        description:
          "Chrome-finish hoop earrings with a unisex cut. Lightweight and hypoallergenic for all-day comfort.",
        price: 190,
        images: ["/products/jewelry-chrome-hoop-1.svg", "/products/jewelry-chrome-hoop-2.svg"],
      },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "The details that complete the Clifstone look.",
    products: [
      {
        slug: "steel-keyring",
        name: "Steel Keyring",
        shortDesc: "Sleek stainless steel keyring.",
        description:
          "A sleek, minimal stainless steel keyring, durable and lightweight, carrying the Clifstone signature.",
        price: 150,
        images: ["/products/accessories-steel-keyring-1.svg", "/products/accessories-steel-keyring-2.svg"],
      },
      {
        slug: "noir-cap",
        name: "Noir Cap",
        shortDesc: "Black cap with embroidered Clifstone logo.",
        description:
          "A plain black cap with an embroidered Clifstone logo, adjustable strap, and streetwear-cut fit. An everyday wardrobe staple.",
        price: 220,
        images: ["/products/accessories-noir-cap-1.svg", "/products/accessories-noir-cap-2.svg"],
        featured: true,
      },
      {
        slug: "chrome-belt",
        name: "Chrome Belt",
        shortDesc: "Leather belt with a polished steel buckle.",
        description:
          "An elegant leather belt with a polished steel buckle, adjustable to fit a range of sizes — a finishing touch for any outfit.",
        price: 260,
        images: ["/products/accessories-chrome-belt-1.svg", "/products/accessories-chrome-belt-2.svg"],
      },
      {
        slug: "signature-pin",
        name: "Signature Pin",
        shortDesc: "Limited-edition Clifstone metal pin.",
        description:
          "A limited-edition Clifstone metal pin — pin it to a jacket, bag, or cap for a subtle touch of character.",
        price: 90,
        images: ["/products/accessories-signature-pin-1.svg", "/products/accessories-signature-pin-2.svg"],
      },
    ],
  },
];

async function main() {
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
      },
    });

    for (const p of cat.products) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          shortDesc: p.shortDesc,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice ?? null,
          images: JSON.stringify(p.images),
          categoryId: category.id,
          featured: p.featured ?? false,
          stockStatus: p.stockStatus ?? StockStatus.IN_STOCK,
          color: p.color ?? null,
          variantGroup: p.variantGroup ?? null,
          metaTitle: `${p.name} | Clifstone`,
          metaDesc: p.shortDesc,
        },
        create: {
          slug: p.slug,
          name: p.name,
          shortDesc: p.shortDesc,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice ?? null,
          images: JSON.stringify(p.images),
          categoryId: category.id,
          featured: p.featured ?? false,
          stockStatus: p.stockStatus ?? StockStatus.IN_STOCK,
          color: p.color ?? null,
          variantGroup: p.variantGroup ?? null,
          metaTitle: `${p.name} | Clifstone`,
          metaDesc: p.shortDesc,
        },
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@clifstone.co";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Clifstone Admin",
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${adminEmail} / password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
