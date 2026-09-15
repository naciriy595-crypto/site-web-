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
    `Nouvelle commande Clifstone ${formatOrderNumber(order.orderNumber)}`,
    "",
    `Client: ${order.customerName}`,
    `Téléphone: ${order.phone}`,
    `Ville: ${order.city}`,
    `Adresse: ${order.address}`,
    order.notes ? `Note: ${order.notes}` : null,
    "",
    "Articles:",
    ...order.items.map((it) => `- ${it.name} x${it.quantity} — ${it.price * it.quantity} MAD`),
    "",
    `Total: ${order.total} MAD (COD, livraison gratuite)`,
  ].filter((l): l is string => l !== null);
  return lines.join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export const STORE_WHATSAPP_NUMBER = process.env.WHATSAPP_ORDER_NUMBER || "212640848752";
