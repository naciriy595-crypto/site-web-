export const ORDER_STATUS_STEPS = ["NEW", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  PROCESSING: "En traitement",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<string, string> = {
  NEW: "Votre commande a bien été reçue.",
  PROCESSING: "Votre commande est en cours de préparation.",
  SHIPPED: "Votre colis est en route vers vous.",
  DELIVERED: "Votre colis a été livré. Merci pour votre confiance !",
  CANCELLED: "Cette commande a été annulée.",
};
