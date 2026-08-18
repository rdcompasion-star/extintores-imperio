// Validación de RUT chileno (módulo 11). Sin dependencias, usable en cliente y servidor.

export function cleanRut(value: string): string {
  return value.replace(/[^0-9kK]/g, "").toUpperCase();
}

export function formatRut(value: string): string {
  const clean = cleanRut(value);
  if (clean.length === 0) return "";
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (body.length === 0) return dv;
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withDots}-${dv}`;
}

function computeDv(body: string): string {
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
}

export interface RutValidationResult {
  valid: boolean;
  error?: string;
}

export function validateRut(value: string): RutValidationResult {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { valid: false, error: "El RUT es obligatorio." };

  const clean = cleanRut(trimmed);
  if (!/^[0-9]+[0-9K]$/.test(clean)) {
    return { valid: false, error: "El RUT contiene caracteres inválidos." };
  }

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (body.length < 7 || body.length > 8) {
    return { valid: false, error: "El RUT tiene un formato incorrecto." };
  }

  const expectedDv = computeDv(body);
  if (dv !== expectedDv) {
    return { valid: false, error: `El dígito verificador es incorrecto (debería ser ${expectedDv}).` };
  }

  return { valid: true };
}
