import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMAD } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [ordersCount, newOrders, revenueAgg, productsCount, shipmentIssues, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "NEW" } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.product.count(),
      prisma.order.count({ where: { shipmentError: { not: null } } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
    ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    { label: "Total Orders", value: ordersCount },
    { label: "New Orders", value: newOrders },
    { label: "Total Revenue", value: formatMAD(revenue) },
    { label: "Products", value: productsCount },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide">Dashboard</h1>

      {shipmentIssues > 0 && (
        <Link
          href="/admin/orders"
          className="mt-6 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 hover:bg-amber-100"
        >
          <AlertTriangle size={18} className="shrink-0" />
          {shipmentIssues} order{shipmentIssues === 1 ? "" : "s"} failed to auto-ship with Ameex —
          review and add tracking manually.
        </Link>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl uppercase tracking-wide">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted hover:text-foreground">
            View all
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      {o.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{o.city}</td>
                  <td className="px-4 py-3 text-muted">{o.items.length}</td>
                  <td className="px-4 py-3 font-medium">{formatMAD(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
