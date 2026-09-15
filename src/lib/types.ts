import type { Category, Product } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category };

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
    return [];
  } catch {
    return [];
  }
}

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
};
