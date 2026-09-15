import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMAD } from "@/lib/format";
import { buildOrderMessage, buildWhatsAppLink, STORE_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { formatOrderNumber } from "@/lib/order-number";
import { buildAmeexTrackingUrl } from "@/lib/delivery/ameex";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { CarrierPanel } from "@/components/admin/CarrierPanel";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });

  if (!order) notFound();

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
  const trackingUrl = order.carrierTrackingId ? buildAmeexTrackingUrl(order.carrierTrackingId) : null;

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={14} /> Retour aux commandes
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Commande {formatOrderNumber(order.orderNumber)}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg uppercase tracking-wide">Client</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Nom</dt><dd>{order.customerName}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Téléphone</dt><dd>{order.phone}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Ville</dt><dd>{order.city}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted shrink-0">Adresse</dt><dd className="text-right">{order.address}</dd></div>
            {order.notes && (
              <div className="flex justify-between gap-4"><dt className="text-muted shrink-0">Note</dt><dd className="text-right">{order.notes}</dd></div>
            )}
          </dl>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <MessageCircle size={16} /> Envoyer / renvoyer sur WhatsApp
          </a>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg uppercase tracking-wide">Articles</h2>
          <div className="mt-3 space-y-2">
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
        </div>

        <div className="md:col-span-2">
          <CarrierPanel
            orderId={order.id}
            carrierName={order.carrierName}
            carrierTrackingId={order.carrierTrackingId}
            carrierLabelUrl={order.carrierLabelUrl}
            trackingUrl={trackingUrl}
          />
        </div>
      </div>
    </div>
  );
}
