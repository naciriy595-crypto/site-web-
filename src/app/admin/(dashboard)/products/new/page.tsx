import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { nameFr: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide">Nouveau produit</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
