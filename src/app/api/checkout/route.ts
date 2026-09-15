import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildOrderMessage, buildWhatsAppLink, STORE_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { formatOrderNumber } from "@/lib/order-number";
import { ameexProvider } from "@/lib/delivery/ameex";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Name is too short"),
  phone: z
    .string()
    .trim()
    .min(9, "Invalid phone number")
    .max(20)
    .regex(/^[0-9+ ]+$/, "Invalid phone number"),
  city: z.string().trim().min(2, "City is required").max(80),
  address: z.string().trim().min(5, "Address is too short").max(300),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, "Your cart is empty"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const { customerName, phone, city, address, notes, items } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== new Set(productIds).size) {
    return NextResponse.json({ error: "One or more products could not be found" }, { status: 400 });
  }

  const outOfStock = products.find((p) => p.stockStatus === "OUT_OF_STOCK");
  if (outOfStock) {
    return NextResponse.json(
      { error: `"${outOfStock.name}" is out of stock` },
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

  let order = await prisma.order.create({
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

  // Automatically try to register the shipment with Ameex. If it fails for
  // any reason (not configured yet, network error, rejected request), the
  // order stays saved as-is and we flag it for the admin instead of losing
  // the order or blocking checkout.
  let shipmentFailureReason: string | null = null;
  if (ameexProvider.isConfigured()) {
    try {
      const result = await ameexProvider.createShipment({
        orderNumber: formatOrderNumber(order.orderNumber),
        customerName: order.customerName,
        phone: order.phone,
        city: order.city,
        address: order.address,
        notes: order.notes,
        codAmount: order.total,
        items: order.items,
      });
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "SHIPPED",
          carrierName: result.carrierName,
          carrierTrackingId: result.trackingId,
          carrierLabelUrl: result.labelUrl ?? null,
          estimatedDelivery: result.estimatedDelivery ?? null,
        },
        include: { items: true },
      });
    } catch (err) {
      shipmentFailureReason = err instanceof Error ? err.message : "Unknown error";
      order = await prisma.order.update({
        where: { id: order.id },
        data: { shipmentError: shipmentFailureReason },
        include: { items: true },
      });
    }
  } else {
    shipmentFailureReason = "Ameex is not configured yet";
    order = await prisma.order.update({
      where: { id: order.id },
      data: { shipmentError: shipmentFailureReason },
      include: { items: true },
    });
  }

  const message = buildOrderMessage({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    total: order.total,
    items: order.items,
  });
  const whatsappLink = buildWhatsAppLink(STORE_WHATSAPP_NUMBER, message);

  return NextResponse.json({
    orderId: order.id,
    orderNumber: formatOrderNumber(order.orderNumber),
    whatsappLink,
    estimatedDelivery: order.estimatedDelivery,
    shipmentFailureReason,
  });
}
