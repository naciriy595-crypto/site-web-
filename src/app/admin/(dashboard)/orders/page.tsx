import Link from "next/link";
import { Download, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMAD } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatOrderNumber } from "@/lib/order-number";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const filters = [
    { value: "", label: "All" },
    { value: "NEW", label: "New" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl uppercase tracking-wide">Orders</h1>
        <a
          href={`/api/admin/orders/export${status ? `?status=${status}` : ""}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium hover:border-foreground/40"
        >
          <Download size={16} /> Export CSV (Ameex)
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/orders?status=${f.value}` : "/admin/orders"}
            className={`flex min-h-9 items-center rounded-full border px-3.5 text-xs ${
              (status ?? "") === f.value
                ? "border-foreground bg-foreground text-white"
                : "border-border text-muted hover:border-foreground/40"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="inline-flex items-center gap-1.5 font-medium hover:underline">
                    {o.shipmentError && (
                      <AlertTriangle size={13} className="shrink-0 text-amber-600" aria-label="Shipment issue" />
                    )}
                    {formatOrderNumber(o.orderNumber)}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3 text-muted">{o.city}</td>
                <td className="px-4 py-3 text-muted">{o.items.length}</td>
                <td className="px-4 py-3 font-medium">{formatMAD(o.total)}</td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(
                    o.createdAt
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
