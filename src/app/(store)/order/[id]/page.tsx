import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Banknote, Truck } from "lucide-react";
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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={48} className="text-foreground" />
        <h1 className="mt-4 font-display text-2xl uppercase tracking-wide sm:text-3xl">
          Thank You for Your Order
        </h1>
        <p className="mt-3 font-display text-xl tracking-wide">{orderNumber}</p>
        <p className="mt-2 text-sm text-muted">
          Save this number — you can use it anytime to track your package.
          We&apos;ll contact you shortly to arrange delivery.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-4 text-sm">
          <Banknote size={16} className="shrink-0 text-muted" />
          <span>Cash on Delivery — pay when your order arrives</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-4 text-sm">
          <Truck size={16} className="shrink-0 text-muted" />
          <span>{order.estimatedDelivery || "Estimated delivery: 2–5 business days"}</span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg uppercase tracking-wide">
          Order Summary
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
          <p><span className="text-foreground">Name:</span> {order.customerName}</p>
          <p><span className="text-foreground">Phone:</span> {order.phone}</p>
          <p><span className="text-foreground">City:</span> {order.city}</p>
          <p><span className="text-foreground">Address:</span> {order.address}</p>
          {order.notes && <p><span className="text-foreground">Note:</span> {order.notes}</p>}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Questions about your order? Reach us on{" "}
        <a href="https://instagram.com/clifstone.co" target="_blank" rel="noopener noreferrer" className="underline">
          Instagram
        </a>{" "}
        or at{" "}
        <a href="mailto:clifstone44@gmail.com" className="underline">
          clifstone44@gmail.com
        </a>
        .
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={`/track?order=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(order.phone)}`}
          className="flex min-h-12 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
        >
          Track My Order
        </Link>
        <Link
          href="/shop/all"
          className="flex min-h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
