import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            shortDesc: product.shortDesc,
            description: product.description,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            categoryId: product.categoryId,
            images: parseImages(product.images),
            stockStatus: product.stockStatus,
            featured: product.featured,
            color: product.color,
            variantGroup: product.variantGroup,
            metaTitle: product.metaTitle,
            metaDesc: product.metaDesc,
          }}
        />
      </div>
    </div>
  );
}
