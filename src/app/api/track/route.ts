import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseOrderNumber, formatOrderNumber } from "@/lib/order-number";
import { buildAmeexTrackingUrl } from "@/lib/delivery/ameex";

const trackSchema = z.object({
  orderNumber: z.string().trim().min(1),
  phone: z.string().trim().min(4),
});

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "").slice(-9);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Order number and phone are required" }, { status: 400 });
  }

  const n = parseOrderNumber(parsed.data.orderNumber);
  if (!n) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: n },
    include: { items: true },
  });

  if (!order || normalizePhone(order.phone) !== normalizePhone(parsed.data.phone)) {
    return NextResponse.json(
      { error: "No order found with that number and phone" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    orderNumber: formatOrderNumber(order.orderNumber),
    status: order.status,
    city: order.city,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    carrierName: order.carrierName,
    carrierTrackingId: order.carrierTrackingId,
    carrierTrackingUrl: order.carrierTrackingId
      ? buildAmeexTrackingUrl(order.carrierTrackingId)
      : null,
  });
}
