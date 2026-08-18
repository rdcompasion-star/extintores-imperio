// Capa de cálculo centralizada del cotizador.
// Todos los montos se manejan como enteros (pesos chilenos, sin decimales)
// para evitar errores de precisión de punto flotante. No duplicar estas
// fórmulas en componentes: todo cálculo de cotización pasa por aquí.

import type { DiscountType } from "@/lib/quote-constants";

export interface CalcLineInput {
  quantity: number;
  unitPrice: number;
  discountType: DiscountType;
  discountValue: number;
}

/** Redondea al entero más cercano. Todo monto CLP es entero. */
function round(value: number): number {
  return Math.round(value);
}

export function calculateLineSubtotal(quantity: number, unitPrice: number): number {
  return round(quantity * unitPrice);
}

export function calculateLineDiscountAmount(
  lineSubtotal: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (discountType === "percent") {
    const pct = Math.min(Math.max(discountValue, 0), 100);
    return round((lineSubtotal * pct) / 100);
  }
  if (discountType === "amount") {
    return Math.min(Math.max(discountValue, 0), lineSubtotal);
  }
  return 0;
}

export function calculateLineTotal(input: CalcLineInput): number {
  const subtotal = calculateLineSubtotal(input.quantity, input.unitPrice);
  const discount = calculateLineDiscountAmount(subtotal, input.discountType, input.discountValue);
  return subtotal - discount;
}

export interface CalcQuoteInput {
  lines: CalcLineInput[];
  globalDiscountType: DiscountType;
  globalDiscountValue: number;
  vatRate: number;
}

export interface CalcQuoteResult {
  subtotal: number;
  discountAmount: number;
  net: number;
  vatAmount: number;
  total: number;
}

/**
 * Recalcula TODO desde cero a partir de las líneas originales.
 * Nunca confiar en totales mostrados en pantalla: esta función es la
 * única fuente de verdad, y debe volver a llamarse justo antes de
 * generar el PDF.
 */
export function calculateQuote(input: CalcQuoteInput): CalcQuoteResult {
  // Subtotal = suma de (precio unitario × cantidad) de cada línea, ya con
  // el descuento propio de esa línea aplicado (nunca dos veces el mismo descuento).
  const subtotal = round(
    input.lines.reduce((sum, line) => sum + calculateLineTotal(line), 0)
  );

  const discountAmount = calculateLineDiscountAmount(
    subtotal,
    input.globalDiscountType,
    input.globalDiscountValue
  );

  const net = subtotal - discountAmount;
  const vatAmount = round(net * input.vatRate);
  const total = net + vatAmount;

  return { subtotal, discountAmount, net, vatAmount, total };
}
