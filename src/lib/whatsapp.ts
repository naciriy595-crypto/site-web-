import { formatOrderNumber } from "./order-number";

export type WhatsAppOrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type WhatsAppOrderInfo = {
  orderNumber: number;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string | null;
  total: number;
  items: WhatsAppOrderItem[];
};

export function buildOrderMessage(order: WhatsAppOrderInfo): string {
  const lines = [
    `New Clifstone order ${formatOrderNumber(order.orderNumber)}`,
    "",
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `City: ${order.city}`,
    `Address: ${order.address}`,
    order.notes ? `Note: ${order.notes}` : null,
    "",
    "Items:",
    ...order.items.map((it) => `- ${it.name} x${it.quantity} — ${it.price * it.quantity} MAD`),
    "",
    `Total: ${order.total} MAD (Cash on Delivery, free shipping)`,
  ].filter((l): l is string => l !== null);
  return lines.join("\n");
}

export function buildShipmentFailureAlert(order: WhatsAppOrderInfo, reason: string): string {
  const lines = [
    `⚠️ Ameex auto-shipment FAILED for order ${formatOrderNumber(order.orderNumber)}`,
    "",
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Reason: ${reason}`,
    "",
    "The order was saved normally — please create the shipment manually from the admin panel.",
  ];
  return lines.join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export const STORE_WHATSAPP_NUMBER = process.env.WHATSAPP_ORDER_NUMBER || "212640848752";
