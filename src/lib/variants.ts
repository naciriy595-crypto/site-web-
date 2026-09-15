import { parseImages } from "@/lib/types";

export type ProductLite = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  price: number;
  compareAtPrice?: number | null;
  images: string;
  stockStatus: string;
  featured?: boolean;
  variantGroup?: string | null;
  color?: string | null;
};

export type VariantOption = {
  id: string;
  slug: string;
  color: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  stockStatus: string;
};

export type GroupedProduct = {
  key: string;
  baseName: string;
  shortDesc: string;
  variants: VariantOption[];
};

export function deriveColor(product: ProductLite): string {
  if (product.color) return product.color;
  if (product.name.includes(" — ")) return product.name.split(" — ")[1] ?? "Default";
  return "Default";
}

export function deriveBaseName(product: ProductLite): string {
  if (product.name.includes(" — ")) return product.name.split(" — ")[0];
  return product.name;
}

export function groupProducts(products: ProductLite[]): GroupedProduct[] {
  const order: string[] = [];
  const groups = new Map<string, ProductLite[]>();

  for (const p of products) {
    const key = p.variantGroup || p.id;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(p);
  }

  return order.map((key) => {
    const items = groups.get(key)!;
    const representative = items.find((p) => p.featured) ?? items[0];

    const variants: VariantOption[] = items.map((p) => ({
      id: p.id,
      slug: p.slug,
      color: deriveColor(p),
      image: parseImages(p.images)[0] ?? "",
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stockStatus: p.stockStatus,
    }));

    variants.sort((a, b) => {
      if (a.id === representative.id) return -1;
      if (b.id === representative.id) return 1;
      return 0;
    });

    return {
      key,
      baseName: deriveBaseName(representative),
      shortDesc: representative.shortDesc,
      variants,
    };
  });
}
