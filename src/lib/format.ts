const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** Formato monetario chileno: $1.250.000 */
export function formatCLP(value: number): string {
  return clpFormatter.format(value);
}

/** Pluraliza una unidad ("persona" → "personas", "unidad" → "unidades"). Solo para mostrar junto a una cantidad. */
export function pluralizeUnit(quantity: number, unit: string): string {
  if (quantity === 1 || !unit) return unit;
  const lastChar = unit.slice(-1).toLowerCase();
  return "aeiouáéíóú".includes(lastChar) ? `${unit}s` : `${unit}es`;
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}-${month}-${year}`;
}
