import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildOrderMessage, buildWhatsAppLink, STORE_WHATSAPP_NUMBER } from "@/lib/whatsapp";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Nom trop court").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "Numéro de téléphone invalide")
    .max(20)
    .regex(/^[0-9+ ]+$/, "Numéro de téléphone invalide"),
  city: z.string().trim().min(2, "Ville requise").max(80),
  address: z.string().trim().min(5, "Adresse trop courte").max(300),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, "Le panier est vide"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { customerName, phone, city, address, notes, items } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== new Set(productIds).size) {
    return NextResponse.json({ error: "Un ou plusieurs produits sont introuvables" }, { status: 400 });
  }

  const outOfStock = products.find((p) => p.stockStatus === "OUT_OF_STOCK");
  if (outOfStock) {
    return NextResponse.json(
      { error: `"${outOfStock.name}" est en rupture de stock` },
      { status: 400 }
    );
  }

  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      city,
      address,
      notes: notes || null,
      total,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  const message = buildOrderMessage({
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    total: order.total,
    items: order.items,
  });
  const whatsappLink = buildWhatsAppLink(STORE_WHATSAPP_NUMBER, message);

  return NextResponse.json({ orderId: order.id, whatsappLink });
}
