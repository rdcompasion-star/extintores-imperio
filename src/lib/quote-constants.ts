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
  "agua-a": "Agua Presurizada (Clase A)",
  general: "General",
};

export type CatalogGroup = "general" | "caf" | "blank";

export const catalogGroupLabels: Record<CatalogGroup, string> = {
  general: "Estándar",
  caf: "CAF",
  blank: "En blanco",
};

export const catalogKindLabels: Record<QuoteItemKind, string> = {
  producto: "Producto",
  servicio: "Servicio",
};

// Ítems cuyo precio NO se multiplica por la cantidad: la cantidad solo se
// muestra como dato (ej. número de personas), pero el valor cotizado es fijo
// sin importar cuántas haya. Hoy solo aplica a la Capacitación.
export const FIXED_PRICE_CATALOG_CODES: string[] = ["CAPACITACION-USO-MANEJO"];

export function isFixedPriceCode(code: string): boolean {
  return FIXED_PRICE_CATALOG_CODES.includes(code);
}
