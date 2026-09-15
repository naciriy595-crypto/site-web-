export type ShipmentOrderInput = {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string | null;
  codAmount: number;
  items: { name: string; quantity: number }[];
};

export type ShipmentResult = {
  carrierName: string;
  trackingId: string;
  labelUrl?: string;
  estimatedDelivery?: string;
};

export class DeliveryNotConfiguredError extends Error {
  constructor(carrier: string) {
    super(`${carrier} is not configured (missing environment variables).`);
    this.name = "DeliveryNotConfiguredError";
  }
}

export interface DeliveryProvider {
  name: string;
  isConfigured(): boolean;
  createShipment(order: ShipmentOrderInput): Promise<ShipmentResult>;
}
