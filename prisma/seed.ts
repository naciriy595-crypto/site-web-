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
};

type SeedCategory = {
  slug: string;
  nameFr: string;
  nameAr: string;
  description: string;
  products: SeedProduct[];
};

const categories: SeedCategory[] = [
  {
    slug: "watches",
    nameFr: "Montres",
    nameAr: "ساعات",
    description: "Montres minimalistes au chrome froid et lignes intemporelles.",
    products: [
      {
        slug: "onyx-chrono",
        name: "Onyx Chrono",
        shortDesc: "Montre chronographe noire mate, bracelet acier inoxydable.",
        description:
          "Chronographe au boîtier noir mat et cadran chrome, bracelet en acier inoxydable brossé. Étanche, mouvement à quartz haute précision. Une pièce discrète qui structure toute tenue, du streetwear au look habillé.",
        price: 890,
        compareAtPrice: 1090,
        images: ["/products/watches-onyx-chrono-1.svg", "/products/watches-onyx-chrono-2.svg"],
        featured: true,
      },
      {
        slug: "midnight-steel",
        name: "Midnight Steel",
        shortDesc: "ساعة كلاسيكية بمينا أسود وسوار فولاذي.",
        description:
          "ساعة كلاسيكية بمينا أسود عميق وسوار من الفولاذ المقاوم للصدأ. تصميم أنيق يجمع بين البساطة والفخامة، مقاومة للماء ومناسبة للاستخدام اليومي.",
        price: 750,
        images: ["/products/watches-midnight-steel-1.svg", "/products/watches-midnight-steel-2.svg"],
      },
      {
        slug: "argent-classic",
        name: "Argent Classic",
        shortDesc: "Cadran argenté, design minimaliste intemporel.",
        description:
          "Cadran argenté épuré sur bracelet milanais souple. Une montre intemporelle pensée pour durer, avec une finition chrome qui capte la lumière sans jamais être criarde.",
        price: 690,
        images: ["/products/watches-argent-classic-1.svg", "/products/watches-argent-classic-2.svg"],
      },
      {
        slug: "noir-heritage",
        name: "Noir Heritage",
        shortDesc: "طراز جلدي فاخر بلمسة عصرية.",
        description:
          "سوار جلدي أسود فاخر مع مينا كلاسيكي، يمزج بين التراث والحداثة. اختيار مثالي لمن يبحث عن إطلالة أنيقة تدوم طويلاً.",
        price: 820,
        images: ["/products/watches-noir-heritage-1.svg", "/products/watches-noir-heritage-2.svg"],
      },
    ],
  },
  {
    slug: "sunglasses",
    nameFr: "Lunettes de soleil",
    nameAr: "نظارات",
    description: "Montures chrome et noires, protection UV400.",
    products: [
      {
        slug: "shadow-wrap",
        name: "Shadow Wrap",
        shortDesc: "نظارة شمسية بتصميم ملفوف عصري، حماية UV400.",
        description:
          "نظارة شمسية بإطار ملفوف يمنح إطلالة جريئة وعصرية، مع عدسات بحماية UV400 كاملة من الأشعة فوق البنفسجية. خفيفة الوزن ومريحة للارتداء اليومي.",
        price: 350,
        images: ["/products/sunglasses-shadow-wrap-1.svg", "/products/sunglasses-shadow-wrap-2.svg"],
        featured: true,
      },
      {
        slug: "chrome-aviator",
        name: "Chrome Aviator",
        shortDesc: "Monture aviateur chromée, verres polarisés.",
        description:
          "Monture aviateur en métal chromé avec verres polarisés anti-reflets. Un classique intemporel revisité dans la palette Clifstone.",
        price: 420,
        images: ["/products/sunglasses-chrome-aviator-1.svg", "/products/sunglasses-chrome-aviator-2.svg"],
      },
      {
        slug: "obsidian-round",
        name: "Obsidian Round",
        shortDesc: "إطار دائري أسود أنيق يناسب كل الإطلالات.",
        description:
          "إطار دائري أنيق باللون الأسود العميق، تصميم بسيط يناسب مختلف أشكال الوجه ويضفي لمسة عصرية على أي إطلالة.",
        price: 380,
        images: ["/products/sunglasses-obsidian-round-1.svg", "/products/sunglasses-obsidian-round-2.svg"],
      },
      {
        slug: "ghost-frame",
        name: "Ghost Frame",
        shortDesc: "Design épuré, monture ultra-légère.",
        description:
          "Monture ultra-légère au design épuré et minimaliste. Confort optimal pour un port prolongé, sans jamais sacrifier le style.",
        price: 400,
        images: ["/products/sunglasses-ghost-frame-1.svg", "/products/sunglasses-ghost-frame-2.svg"],
      },
    ],
  },
  {
    slug: "wallets",
    nameFr: "Portefeuilles",
    nameAr: "محافظ",
    description: "Cuir texturé et finitions carbone pour un quotidien organisé.",
    products: [
      {
        slug: "slate-bifold",
        name: "Slate Bifold",
        shortDesc: "محفظة جلدية أنيقة بتصميم قابل للطي.",
        description:
          "محفظة جلدية أنيقة قابلة للطي بلونها الرمادي الداكن، تتسع لعدة بطاقات وأوراق نقدية، بتصميم رفيع يناسب الجيب بسهولة.",
        price: 320,
        images: ["/products/wallets-slate-bifold-1.svg", "/products/wallets-slate-bifold-2.svg"],
        featured: true,
      },
      {
        slug: "carbon-card-case",
        name: "Carbon Card Case",
        shortDesc: "Porte-cartes minimaliste en cuir texturé carbone.",
        description:
          "Porte-cartes minimaliste à la texture carbone, format compact pour un port quotidien discret. Coutures renforcées pour une longévité maximale.",
        price: 220,
        images: ["/products/wallets-carbon-card-case-1.svg", "/products/wallets-carbon-card-case-2.svg"],
      },
      {
        slug: "noir-leather-fold",
        name: "Noir Leather Fold",
        shortDesc: "جلد طبيعي أسود فاخر بحياكة دقيقة.",
        description:
          "محفظة من الجلد الطبيعي الأسود بحياكة دقيقة، تصميم كلاسيكي فاخر مع جيوب متعددة للبطاقات والعملات.",
        price: 350,
        images: ["/products/wallets-noir-leather-fold-1.svg", "/products/wallets-noir-leather-fold-2.svg"],
      },
      {
        slug: "ash-cardholder",
        name: "Ash Cardholder",
        shortDesc: "Format compact, idéal pour un port quotidien.",
        description:
          "Format compact et ultra-fin, idéal pour un port quotidien sans encombrement. Cuir grainé résistant à l'usure.",
        price: 240,
        images: ["/products/wallets-ash-cardholder-1.svg", "/products/wallets-ash-cardholder-2.svg"],
      },
    ],
  },
  {
    slug: "jewelry",
    nameFr: "Bijoux",
    nameAr: "مجوهرات",
    description: "Pièces argentées et acier, entre minimalisme et caractère.",
    products: [
      {
        slug: "iron-chain",
        name: "Iron Chain",
        shortDesc: "سلسلة رقبة فولاذية بتصميم جريء.",
        description:
          "سلسلة رقبة من الفولاذ المقاوم للصدأ بتصميم جريء وعصري، مقاومة للصدأ والاسمرار، تناسب الإطلالات اليومية والسهرات.",
        price: 280,
        images: ["/products/jewelry-iron-chain-1.svg", "/products/jewelry-iron-chain-2.svg"],
      },
      {
        slug: "silver-cross-pendant",
        name: "Silver Cross Pendant",
        shortDesc: "Pendentif croix argenté, chaîne ajustable.",
        description:
          "Pendentif croix au fini argenté, livré avec une chaîne ajustable. Un bijou symbolique et discret pour un style affirmé.",
        price: 260,
        images: ["/products/jewelry-silver-cross-pendant-1.svg", "/products/jewelry-silver-cross-pendant-2.svg"],
        featured: true,
      },
      {
        slug: "signet-noir",
        name: "Signet Noir",
        shortDesc: "خاتم فضي بتصميم عصري وحواف مصقولة.",
        description:
          "خاتم بتصميم عصري وحواف مصقولة بعناية، مصنوع من معدن مقاوم للاهتراء يحافظ على لمعانه لفترة طويلة.",
        price: 240,
        images: ["/products/jewelry-signet-noir-1.svg", "/products/jewelry-signet-noir-2.svg"],
      },
      {
        slug: "chrome-hoop",
        name: "Chrome Hoop",
        shortDesc: "Boucles d'oreilles anneaux chromés, unisexe.",
        description:
          "Boucles d'oreilles anneaux au fini chromé, coupe unisexe. Légères et hypoallergéniques pour un confort toute la journée.",
        price: 190,
        images: ["/products/jewelry-chrome-hoop-1.svg", "/products/jewelry-chrome-hoop-2.svg"],
      },
    ],
  },
  {
    slug: "accessories",
    nameFr: "Accessoires",
    nameAr: "إكسسوارات",
    description: "Les détails qui complètent le look Clifstone.",
    products: [
      {
        slug: "steel-keyring",
        name: "Steel Keyring",
        shortDesc: "ميدالية مفاتيح فولاذية بتصميم أنيق.",
        description:
          "ميدالية مفاتيح مصنوعة من الفولاذ بتصميم أنيق وبسيط، متينة وخفيفة الوزن، تحمل شعار Clifstone.",
        price: 150,
        images: ["/products/accessories-steel-keyring-1.svg", "/products/accessories-steel-keyring-2.svg"],
      },
      {
        slug: "noir-cap",
        name: "Noir Cap",
        shortDesc: "Casquette noire brodée, logo Clifstone.",
        description:
          "Casquette noire unie avec broderie du logo Clifstone, sangle ajustable et coupe streetwear. Un incontournable du dressing quotidien.",
        price: 220,
        images: ["/products/accessories-noir-cap-1.svg", "/products/accessories-noir-cap-2.svg"],
        featured: true,
      },
      {
        slug: "chrome-belt",
        name: "Chrome Belt",
        shortDesc: "حزام جلدي بإبزيم فولاذي لامع.",
        description:
          "حزام جلدي أنيق بإبزيم فولاذي لامع، قابل للتعديل ليناسب مختلف المقاسات، إضافة مثالية لأي إطلالة.",
        price: 260,
        images: ["/products/accessories-chrome-belt-1.svg", "/products/accessories-chrome-belt-2.svg"],
      },
      {
        slug: "signature-pin",
        name: "Signature Pin",
        shortDesc: "Pin's métallique édition Clifstone.",
        description:
          "Pin's métallique édition limitée Clifstone, à épingler sur veste, sac ou casquette pour une touche de caractère.",
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
        nameFr: cat.nameFr,
        nameAr: cat.nameAr,
        description: cat.description,
      },
      create: {
        slug: cat.slug,
        nameFr: cat.nameFr,
        nameAr: cat.nameAr,
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
