import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMAD } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [ordersCount, newOrders, revenueAgg, productsCount, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.product.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
  ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    { label: "Commandes totales", value: ordersCount },
    { label: "Nouvelles commandes", value: newOrders },
    { label: "Revenu total", value: formatMAD(revenue) },
    { label: "Produits", value: productsCount },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide">Tableau de bord</h1>

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
          <h2 className="font-display text-xl uppercase tracking-wide">Commandes récentes</h2>
          <Link href="/admin/orders" className="text-sm text-muted hover:text-foreground">
            Voir tout
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Articles</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
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
                    Aucune commande pour le moment.
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
