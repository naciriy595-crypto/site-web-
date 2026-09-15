import type { DeliveryProvider, ShipmentOrderInput, ShipmentResult } from "./types";
import { DeliveryNotConfiguredError } from "./types";

/**
 * Ameex integration — PLACEHOLDER pending their real API documentation.
 *
 * We don't yet have Ameex's actual endpoint, auth scheme, or request/response
 * field names, so this sends a best-guess REST request shaped like a typical
 * Moroccan last-mile carrier's "create COD shipment" call. Once you get their
 * real API docs, update `endpoint`, the `headers`, and the `body` mapping
 * below to match exactly — everything else (the button in the admin order
 * page, the DB fields, the fallback behavior) already works and won't need
 * to change.
 *
 * Until AMEEX_API_BASE_URL / AMEEX_API_KEY are set, isConfigured() is false
 * and the admin UI falls back to the CSV export instead of calling this.
 */
export class AmeexProvider implements DeliveryProvider {
  name = "Ameex";

  isConfigured(): boolean {
    return Boolean(process.env.AMEEX_API_BASE_URL && process.env.AMEEX_API_KEY);
  }

  async createShipment(order: ShipmentOrderInput): Promise<ShipmentResult> {
    const baseUrl = process.env.AMEEX_API_BASE_URL;
    const apiKey = process.env.AMEEX_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new DeliveryNotConfiguredError(this.name);
    }

    // TODO: replace this endpoint + payload shape with what Ameex's docs specify.
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        reference: order.orderNumber,
        recipient_name: order.customerName,
        recipient_phone: order.phone,
        city: order.city,
        address: order.address,
        note: order.notes ?? undefined,
        cod_amount: order.codAmount,
        products: order.items.map((i) => `${i.name} x${i.quantity}`).join(", "),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ameex a refusé la commande (${res.status}): ${text || "erreur inconnue"}`);
    }

    const data = (await res.json()) as { tracking_id?: string; id?: string; label_url?: string };
    const trackingId = data.tracking_id ?? data.id;
    if (!trackingId) {
      throw new Error("Réponse Ameex inattendue : identifiant de suivi introuvable.");
    }

    return { carrierName: this.name, trackingId, labelUrl: data.label_url };
  }
}

export const ameexProvider = new AmeexProvider();

export function buildAmeexTrackingUrl(trackingId: string): string | null {
  const template = process.env.AMEEX_TRACKING_URL_TEMPLATE;
  if (!template) return null;
  return template.replace("{id}", encodeURIComponent(trackingId));
}
