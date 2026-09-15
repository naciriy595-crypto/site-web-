import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ameexProvider } from "@/lib/delivery/ameex";
import { DeliveryNotConfiguredError } from "@/lib/delivery/types";
import { formatOrderNumber } from "@/lib/order-number";

// Automatic path: calls the configured carrier API (Ameex today).
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  if (!ameexProvider.isConfigured()) {
    return NextResponse.json(
      {
        error:
          "Ameex n'est pas encore connecté (AMEEX_API_BASE_URL / AMEEX_API_KEY manquants). Utilisez l'export CSV ou ajoutez un numéro de suivi manuellement en attendant.",
        notConfigured: true,
      },
      { status: 422 }
    );
  }

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

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: "SHIPPED",
        carrierName: result.carrierName,
        carrierTrackingId: result.trackingId,
        carrierLabelUrl: result.labelUrl ?? null,
      },
    });

    return NextResponse.json({ order: updated });
  } catch (err) {
    if (err instanceof DeliveryNotConfiguredError) {
      return NextResponse.json({ error: err.message, notConfigured: true }, { status: 422 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi vers le transporteur" },
      { status: 502 }
    );
  }
}

// Manual fallback: admin ships through Ameex's own portal/CSV and pastes the
// tracking number back in, so customers still see it on /track.
const manualSchema = z.object({
  carrierName: z.string().trim().min(1).max(60),
  carrierTrackingId: z.string().trim().min(1).max(120),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = manualSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Transporteur et numéro de suivi requis" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      carrierName: parsed.data.carrierName,
      carrierTrackingId: parsed.data.carrierTrackingId,
      status: "SHIPPED",
    },
  });

  return NextResponse.json({ order });
}
