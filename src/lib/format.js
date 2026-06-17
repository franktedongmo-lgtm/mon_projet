export function formatXAF(amount) {
  return `${Math.round(amount).toLocaleString("fr-FR").replace(/,/g, " ")} FCFA`;
}

export const CATEGORIES = [
  { value: "GATEAUX", label: "Gâteaux" },
  { value: "VIENNOISERIES", label: "Viennoiseries" },
  { value: "BOISSONS", label: "Boissons" },
  { value: "PLATS", label: "Plats" },
];

export const PAYMENT_METHODS = [
  { value: "ORANGE_MONEY", label: "Orange Money" },
  { value: "MTN_MOBILE_MONEY", label: "MTN Mobile Money" },
  { value: "CARD", label: "Carte bancaire (MasterCard / Visa)" },
  { value: "PAYPAL", label: "PayPal" },
];

export const ORDER_STATUSES = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "PREPARING", label: "En préparation" },
  { value: "DELIVERING", label: "En livraison" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function statusLabel(value) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label || value;
}

export function paymentLabel(value) {
  return PAYMENT_METHODS.find((p) => p.value === value)?.label || value;
}
