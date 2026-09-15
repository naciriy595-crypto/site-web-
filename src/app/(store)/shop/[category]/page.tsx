import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import { groupProducts } from "@/lib/variants";

type Params = { category: string };
type Search = { sort?: string; inStock?: string };

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  if (category === "all") {
    return {
      title: "Shop All",
      description: "Browse the full Clifstone collection: watches, sunglasses, wallets, jewelry and accessories.",
    };
  }
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description ?? undefined,
  };
}

export default async function ShopCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { category } = await params;
  const { sort = "newest", inStock } = await searchParams;

  const categories = await getCategories();
  const activeCategory =
    category === "all" ? null : categories.find((c) => c.slug === category);

  if (category !== "all" && !activeCategory) notFound();

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where: {
      ...(activeCategory ? { categoryId: activeCategory.id } : {}),
      ...(inStock === "1" ? { stockStatus: "IN_STOCK" } : {}),
    },
    orderBy,
  });

  const grouped = groupProducts(products);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto">
        <Link
          href="/shop/all"
          className={`flex min-h-9 items-center rounded-full border px-4 text-sm ${
            category === "all"
              ? "border-foreground bg-foreground text-white"
              : "border-border text-muted hover:border-foreground/40"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className={`flex min-h-9 items-center rounded-full border px-4 text-sm ${
              c.slug === category
                ? "border-foreground bg-foreground text-white"
                : "border-border text-muted hover:border-foreground/40"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
          {activeCategory ? activeCategory.name : "Shop All"}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={
              inStock === "1"
                ? `/shop/${category}${sort !== "newest" ? `?sort=${sort}` : ""}`
                : `/shop/${category}?${new URLSearchParams({
                    ...(sort !== "newest" ? { sort } : {}),
                    inStock: "1",
                  }).toString()}`
            }
            className={`flex min-h-9 items-center rounded-full border px-3 text-xs ${
              inStock === "1"
                ? "border-foreground bg-foreground text-white"
                : "border-border text-muted"
            }`}
          >
            In stock only
          </Link>
          <SortSelect />
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="py-20 text-center text-muted">
          No products in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
          {grouped.map((g) => (
            <ProductCard key={g.key} product={g} />
          ))}
        </div>
      )}
    </div>
  );
}
