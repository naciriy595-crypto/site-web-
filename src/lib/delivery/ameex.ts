import type { DeliveryProvider, ShipmentOrderInput, ShipmentResult } from "./types";
import { DeliveryNotConfiguredError } from "./types";

const AMEEX_BASE_URL = "https://api.ameex.app";
const AMEEX_ADD_PARCEL_PATH = "/customer/Delivery/Parcels/Action/Type/Add";

/**
 * Ameex integration, wired to their real "Add Parcel" endpoint.
 *
 * Two fields are still unverified for this specific account and may need
 * adjusting once you see a real response or failure from Ameex:
 *  - `business`: comes from AMEEX_BUSINESS_ID. Confirm this is your actual
 *    business/store id in Ameex, not just an example value.
 *  - `city`: Ameex's docs example shows a numeric city code (e.g. "1"), but
 *    we don't have their city-code list, so this sends the plain city name
 *    typed at checkout. If Ameex requires a numeric code instead, shipment
 *    creation will fail gracefully (order still saves, admin gets a
 *    WhatsApp alert) until we add the real name -> code mapping.
 */
export class AmeexProvider implements DeliveryProvider {
  name = "Ameex";

  isConfigured(): boolean {
    return Boolean(
      process.env.AMEEX_API_ID &&
        process.env.AMEEX_API_KEY &&
        process.env.AMEEX_BUSINESS_ID
    );
  }

  async createShipment(order: ShipmentOrderInput): Promise<ShipmentResult> {
    const apiId = process.env.AMEEX_API_ID;
    const apiKey = process.env.AMEEX_API_KEY;
    const businessId = process.env.AMEEX_BUSINESS_ID;

    if (!apiId || !apiKey || !businessId) {
      throw new DeliveryNotConfiguredError(this.name);
    }

    const form = new FormData();
    form.append("type", "SIMPLE");
    form.append("business", businessId);
    form.append("order_num", order.orderNumber);
    form.append("replace", "true");
    form.append("open", "YES");
    form.append("try", "YES");
    form.append("fragile", "0");
    form.append("receiver", order.customerName);
    form.append("phone", order.phone);
    form.append("city", order.city);
    form.append("address", order.address);
    form.append("comment", order.notes ?? "");
    form.append(
      "product",
      order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")
    );
    form.append("cod", String(order.codAmount));

    const res = await fetch(`${AMEEX_BASE_URL}${AMEEX_ADD_PARCEL_PATH}`, {
      method: "POST",
      headers: {
        "C-Api-Id": apiId,
        "C-Api-Key": apiKey,
      },
      body: form,
      signal: AbortSignal.timeout(10_000),
    });

    const raw = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      // Non-JSON response — fall through with data = {}, raw kept for the error message.
    }

    if (!res.ok) {
      throw new Error(`Ameex rejected the shipment (${res.status}): ${raw || "unknown error"}`);
    }

    const payload = (data.data ?? data) as Record<string, unknown>;
    const trackingId =
      (payload.tracking_num as string | undefined) ??
      (payload.code as string | undefined) ??
      (payload.parcel_code as string | undefined) ??
      (payload.id as string | undefined);

    if (!trackingId) {
      throw new Error(`Unexpected Ameex response: no tracking id found. Raw: ${raw}`);
    }

    return {
      carrierName: this.name,
      trackingId,
      labelUrl: payload.label_url as string | undefined,
      estimatedDelivery: payload.estimated_delivery as string | undefined,
    };
  }
}

export const ameexProvider = new AmeexProvider();

export function buildAmeexTrackingUrl(trackingId: string): string | null {
  const template = process.env.AMEEX_TRACKING_URL_TEMPLATE;
  if (!template) return null;
  return template.replace("{id}", encodeURIComponent(trackingId));
}
