import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMAD } from "@/lib/format";
import {
  buildOrderMessage,
  buildShipmentFailureAlert,
  buildWhatsAppLink,
  STORE_WHATSAPP_NUMBER,
} from "@/lib/whatsapp";
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

  const shipmentAlertLink = order.shipmentError
    ? buildWhatsAppLink(
        STORE_WHATSAPP_NUMBER,
        buildShipmentFailureAlert(
          {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            phone: order.phone,
            city: order.city,
            address: order.address,
            notes: order.notes,
            total: order.total,
            items: order.items,
          },
          order.shipmentError
        )
      )
    : null;

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Order {formatOrderNumber(order.orderNumber)}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      {order.shipmentError && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <span className="inline-flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            Ameex auto-shipment failed: {order.shipmentError}
          </span>
          {shipmentAlertLink && (
            <a
              href={shipmentAlertLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-9 items-center rounded-full bg-amber-800 px-4 text-xs font-medium text-white hover:opacity-90"
            >
              Forward alert on WhatsApp
            </a>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg uppercase tracking-wide">Customer</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Name</dt><dd>{order.customerName}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Phone</dt><dd>{order.phone}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">City</dt><dd>{order.city}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted shrink-0">Address</dt><dd className="text-right">{order.address}</dd></div>
            {order.notes && (
              <div className="flex justify-between gap-4"><dt className="text-muted shrink-0">Note</dt><dd className="text-right">{order.notes}</dd></div>
            )}
          </dl>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-medium text-white hover:opacity-90"
          >
            <MessageCircle size={16} /> Send / resend on WhatsApp
          </a>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg uppercase tracking-wide">Items</h2>
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
            estimatedDelivery={order.estimatedDelivery}
            trackingUrl={trackingUrl}
          />
        </div>
      </div>
    </div>
  );
}
