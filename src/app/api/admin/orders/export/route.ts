import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatOrderNumber } from "@/lib/order-number";

// CSV columns follow the common field set Moroccan last-mile carriers (Ameex
// included) ask for on manual/bulk COD order upload. Rename headers here if
// your Ameex account portal expects different column names.
const HEADERS = [
  "Reference",
  "Recipient Name",
  "Phone",
  "City",
  "Address",
  "Products",
  "Total Quantity",
  "COD Amount (MAD)",
  "Note",
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
      formatOrderNumber(o.orderNumber),
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
      "Content-Disposition": `attachment; filename="clifstone-orders-ameex.csv"`,
    },
  });
}
