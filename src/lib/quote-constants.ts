// Constantes y tipos del cotizador que también usan componentes de cliente.
// No debe importar nada del servidor (base de datos).

export type QuoteItemKind = "producto" | "servicio";
export type DiscountType = "none" | "percent" | "amount";
export type QuoteStatus = "borrador" | "enviada" | "aceptada" | "rechazada";

export const quoteStatusLabels: Record<QuoteStatus, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
};

export const catalogCategoryLabels: Record<string, string> = {
  "pqs-abc": "Polvo Químico Seco (ABC)",
  co2: "CO₂",
  "clase-k": "Clase K",
  "red-humeda": "Red Húmeda",
  general: "General",
};

export const catalogKindLabels: Record<QuoteItemKind, string> = {
  producto: "Producto",
  servicio: "Servicio",
};
