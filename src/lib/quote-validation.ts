// Validación centralizada antes de generar el PDF. Cada mensaje dice
// exactamente qué falta o qué está mal — nunca "Error" a secas.

import { validateRut } from "@/lib/rut";
import type { DiscountType } from "@/lib/quote-constants";

export interface QuoteFormLine {
  quantity: number;
  unitPrice: number;
  discountType: DiscountType;
  discountValue: number;
  name: string;
}

export interface QuoteFormForValidation {
  issueDate: string;
  validUntil: string;
  seller: string;
  client: {
    name: string;
    rut: string;
    email: string;
    phone: string;
  };
  items: QuoteFormLine[];
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export function validateQuoteForm(form: QuoteFormForValidation): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!form.issueDate) issues.push({ field: "issueDate", message: "Falta completar: fecha de la cotización." });
  if (!form.validUntil) {
    issues.push({ field: "validUntil", message: "Falta completar: fecha de vencimiento." });
  } else if (form.issueDate && form.validUntil < form.issueDate) {
    issues.push({ field: "validUntil", message: "Existe un error en: la fecha de vencimiento es anterior a la fecha de la cotización." });
  }
  if (!form.seller.trim()) issues.push({ field: "seller", message: "Falta completar: vendedor / responsable." });

  if (!form.client.name.trim()) issues.push({ field: "client.name", message: "Falta completar: nombre o razón social del cliente." });

  if (!form.client.rut.trim()) {
    issues.push({ field: "client.rut", message: "Falta completar: RUT del cliente." });
  } else {
    const rutResult = validateRut(form.client.rut);
    if (!rutResult.valid) {
      issues.push({ field: "client.rut", message: `Existe un error en: RUT del cliente (${rutResult.error})` });
    }
  }

  if (form.client.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client.email.trim())) {
    issues.push({ field: "client.email", message: "Existe un error en: el email del cliente no es válido." });
  }

  if (form.client.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(form.client.phone.trim())) {
    issues.push({ field: "client.phone", message: "Existe un error en: el teléfono del cliente no es válido." });
  }

  if (form.items.length === 0) {
    issues.push({ field: "items", message: "Falta completar: agrega al menos un producto o servicio." });
  }

  form.items.forEach((item, i) => {
    const label = item.name || `ítem #${i + 1}`;
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      issues.push({ field: `items.${i}.quantity`, message: `Existe un error en: la cantidad de "${label}" debe ser un número entero mayor o igual a 1.` });
    }
    if (!Number.isFinite(item.unitPrice) || item.unitPrice <= 0) {
      issues.push({ field: `items.${i}.unitPrice`, message: `Existe un error en: "${label}" no tiene un precio válido.` });
    }
    if (item.discountType === "percent" && (item.discountValue < 0 || item.discountValue > 100)) {
      issues.push({ field: `items.${i}.discountValue`, message: `Existe un error en: el descuento de "${label}" debe estar entre 0% y 100%.` });
    }
    if (item.discountType === "amount" && item.discountValue < 0) {
      issues.push({ field: `items.${i}.discountValue`, message: `Existe un error en: el descuento de "${label}" no puede ser negativo.` });
    }
  });

  return issues;
}
