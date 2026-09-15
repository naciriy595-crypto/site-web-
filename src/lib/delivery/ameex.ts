import type { DeliveryProvider, ShipmentOrderInput, ShipmentResult } from "./types";
import { DeliveryNotConfiguredError } from "./types";

/**
 * Ameex integration — PLACEHOLDER pending their real API documentation.
 *
 * We have an API ID + API Key but still no base URL, auth header format, or
 * endpoint/field spec from Ameex, so this cannot make a real call yet — it
 * sends a best-guess REST request shaped like a typical Moroccan last-mile
 * carrier's "create COD shipment" call. Once you get the base URL and real
 * docs, set AMEEX_API_BASE_URL and update the request shape below (endpoint
 * path, header names, field names) to match exactly. Everything else — the
 * automatic call at checkout, the graceful failure path, the admin alert,
 * the manual tracking fallback — already works and won't need to change.
 */
export class AmeexProvider implements DeliveryProvider {
  name = "Ameex";

  isConfigured(): boolean {
    return Boolean(
      process.env.AMEEX_API_BASE_URL &&
        process.env.AMEEX_API_KEY &&
        process.env.AMEEX_API_ID
    );
  }

  async createShipment(order: ShipmentOrderInput): Promise<ShipmentResult> {
    const baseUrl = process.env.AMEEX_API_BASE_URL;
    const apiId = process.env.AMEEX_API_ID;
    const apiKey = process.env.AMEEX_API_KEY;

    if (!baseUrl || !apiId || !apiKey) {
      throw new DeliveryNotConfiguredError(this.name);
    }

    // TODO: replace this endpoint + payload shape with what Ameex's docs specify.
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Id": apiId,
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        apiId,
        apiKey,
        reference: order.orderNumber,
        recipient_name: order.customerName,
        recipient_phone: order.phone,
        city: order.city,
        address: order.address,
        note: order.notes ?? undefined,
        cod_amount: order.codAmount,
        products: order.items.map((i) => `${i.name} x${i.quantity}`).join(", "),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ameex rejected the shipment (${res.status}): ${text || "unknown error"}`);
    }

    const data = (await res.json()) as {
      tracking_id?: string;
      id?: string;
      label_url?: string;
      estimated_delivery?: string;
    };
    const trackingId = data.tracking_id ?? data.id;
    if (!trackingId) {
      throw new Error("Unexpected Ameex response: no tracking id found.");
    }

    return {
      carrierName: this.name,
      trackingId,
      labelUrl: data.label_url,
      estimatedDelivery: data.estimated_delivery,
    };
  }
}

export const ameexProvider = new AmeexProvider();

export function buildAmeexTrackingUrl(trackingId: string): string | null {
  const template = process.env.AMEEX_TRACKING_URL_TEMPLATE;
  if (!template) return null;
  return template.replace("{id}", encodeURIComponent(trackingId));
}
