import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)"),
  shortDesc: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(4000),
  price: z.number().int().min(0).max(1_000_000),
  compareAtPrice: z.number().int().min(0).max(1_000_000).nullable().optional(),
  categoryId: z.string().min(1, "Catégorie requise"),
  images: z.array(z.string().trim().min(1)).min(1, "Au moins une image requise"),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK"]),
  featured: z.boolean().optional(),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDesc: z.string().trim().max(300).optional().or(z.literal("")),
});

export type ProductInput = z.infer<typeof productSchema>;

export const orderStatusSchema = z.object({
  status: z.enum(["NEW", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});
