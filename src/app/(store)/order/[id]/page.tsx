import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMAD } from "@/lib/format";
import { formatOrderNumber } from "@/lib/order-number";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const orderNumber = formatOrderNumber(order.orderNumber);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={48} className="text-foreground" />
        <h1 className="mt-4 font-display text-3xl uppercase tracking-wide">
          Merci pour votre commande
        </h1>
        <p className="mt-3 font-display text-xl tracking-wide">{orderNumber}</p>
        <p className="mt-2 text-sm text-muted">
          Notez ce numéro : il vous permet de suivre votre colis à tout moment.
          Nous vous contacterons pour organiser la livraison — paiement à la réception.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg uppercase tracking-wide">
          Résumé de la commande
        </h2>

        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted">
                {item.name} <span className="text-foreground">× {item.quantity}</span>
              </span>
              <span className="font-medium">{formatMAD(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-border pt-4 flex justify-between text-base font-semibold">
          <span>Total (COD)</span>
          <span>{formatMAD(order.total)}</span>
        </div>

        <div className="mt-6 grid gap-1 text-sm text-muted">
          <p><span className="text-foreground">Nom :</span> {order.customerName}</p>
          <p><span className="text-foreground">Téléphone :</span> {order.phone}</p>
          <p><span className="text-foreground">Ville :</span> {order.city}</p>
          <p><span className="text-foreground">Adresse :</span> {order.address}</p>
          {order.notes && <p><span className="text-foreground">Note :</span> {order.notes}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/track?order=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(order.phone)}`}
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
        >
          Suivre ma commande
        </Link>
        <Link
          href="/shop/all"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
