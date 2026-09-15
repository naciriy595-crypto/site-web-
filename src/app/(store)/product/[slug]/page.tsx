import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/types";
import { formatMAD } from "@/lib/format";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartActions } from "@/components/AddToCartActions";
import { WishlistButton } from "@/components/WishlistButton";
import { ProductCard } from "@/components/ProductCard";
import { Truck, Banknote } from "lucide-react";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const images = parseImages(product.images);

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <ProductGallery images={images} name={product.name} />

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                {product.category.name}
              </p>
              <h1 className="mt-1 font-display text-2xl uppercase tracking-wide sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-muted">{product.shortDesc}</p>
            </div>
            <WishlistButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={images[0] ?? ""}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface hover:border-foreground/40"
            />
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatMAD(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted line-through">
                {formatMAD(product.compareAtPrice)}
              </span>
            )}
          </div>

          <AddToCartActions
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={images[0] ?? ""}
            stockStatus={product.stockStatus}
          />

          <div className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-surface p-4 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-muted">
              <Truck size={16} /> Free shipping
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Banknote size={16} /> Cash on delivery
            </div>
          </div>

          <div className="prose-sm border-t border-border pt-6 text-sm leading-relaxed text-foreground/90">
            {product.description}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14 sm:mt-16">
          <h2 className="mb-6 font-display text-2xl uppercase tracking-wide">
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
