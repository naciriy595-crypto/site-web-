import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";

type Params = { category: string };
type Search = { sort?: string; inStock?: string };

async function getCategories() {
  return prisma.category.findMany({ orderBy: { nameFr: "asc" } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  if (category === "all") {
    return { title: "Toute la boutique" };
  }
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return {};
  return {
    title: cat.nameFr,
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/shop/all"
          className={`rounded-full border px-4 py-1.5 text-sm ${
            category === "all"
              ? "border-foreground bg-foreground text-white"
              : "border-border text-muted hover:border-foreground/40"
          }`}
        >
          Tout
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              c.slug === category
                ? "border-foreground bg-foreground text-white"
                : "border-border text-muted hover:border-foreground/40"
            }`}
          >
            {c.nameFr}
          </Link>
        ))}
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide">
            {activeCategory ? activeCategory.nameFr : "Toute la boutique"}
          </h1>
          {activeCategory && (
            <p className="text-sm text-muted" dir="rtl">
              {activeCategory.nameAr}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={
              inStock === "1"
                ? `/shop/${category}${sort !== "newest" ? `?sort=${sort}` : ""}`
                : `/shop/${category}?${new URLSearchParams({
                    ...(sort !== "newest" ? { sort } : {}),
                    inStock: "1",
                  }).toString()}`
            }
            className={`hidden rounded-full border px-3 py-2 text-xs sm:block ${
              inStock === "1"
                ? "border-foreground bg-foreground text-white"
                : "border-border text-muted"
            }`}
          >
            En stock uniquement
          </Link>
          <SortSelect />
        </div>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-muted">
          Aucun produit dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
