import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CSV columns follow the common field set Moroccan last-mile carriers (Ameex
// included) ask for on manual/bulk COD order upload. Rename headers here if
// your Ameex account portal expects different column names.
const HEADERS = [
  "Reference",
  "Nom destinataire",
  "Telephone",
  "Ville",
  "Adresse",
  "Produits",
  "Quantite totale",
  "Montant COD (MAD)",
  "Remarque",
];

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.map((o) => {
    const productsSummary = o.items.map((i) => `${i.name} x${i.quantity}`).join(" | ");
    const totalQty = o.items.reduce((sum, i) => sum + i.quantity, 0);
    return [
      o.id.slice(-8).toUpperCase(),
      o.customerName,
      o.phone,
      o.city,
      o.address,
      productsSummary,
      String(totalQty),
      String(o.total),
      o.notes ?? "",
    ]
      .map(csvEscape)
      .join(",");
  });

  const csv = [HEADERS.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clifstone-commandes-ameex.csv"`,
    },
  });
}
