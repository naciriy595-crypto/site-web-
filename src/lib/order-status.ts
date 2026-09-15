export const ORDER_STATUS_STEPS = ["NEW", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<string, string> = {
  NEW: "Your order has been received.",
  PROCESSING: "Your order is being prepared.",
  SHIPPED: "Your package is on its way to you.",
  DELIVERED: "Your package has been delivered. Thank you for your trust!",
  CANCELLED: "This order has been cancelled.",
};
