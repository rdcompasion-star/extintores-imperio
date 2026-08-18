// Helpers puros de formato de enlaces. La información real (teléfono,
// WhatsApp, email, dirección, horarios) vive en la base de datos — ver
// src/lib/settings.ts. Estas funciones solo arman el enlace a partir del
// dato que reciben.

export function buildWhatsAppLink(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(productName: string) {
  return `Hola, quiero cotizar el ${productName}. ¿Me pueden enviar información y precio?`;
}

export function buildTelLink(phoneE164: string) {
  return `tel:${phoneE164}`;
}

export function buildMailLink(email: string, subject?: string) {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

export type CtaType = "whatsapp" | "tel" | "email" | "internal" | "external";

export function resolveCta(
  type: CtaType,
  value: string,
  whatsappNumber: string
): { href: string; external: boolean } {
  switch (type) {
    case "whatsapp":
      return { href: buildWhatsAppLink(whatsappNumber, value), external: true };
    case "tel":
      return { href: `tel:${value}`, external: false };
    case "email":
      return { href: buildMailLink(value), external: false };
    case "external":
      return { href: value, external: true };
    case "internal":
    default:
      return { href: value || "/", external: false };
  }
}
