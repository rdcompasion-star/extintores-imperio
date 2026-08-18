// Constantes y tipos de producto que también usan componentes de cliente
// (formularios del panel, filtros). No debe importar nada del servidor
// (base de datos) para poder incluirse en el bundle del navegador.

export type AgentCategory = "co2" | "pqs-abc" | "red-humeda" | "clase-k";
export type Presentation = "portatil" | "rodante" | "gabinete";
export type FireClassId = "A" | "B" | "C" | "D" | "K";
export type ContentStatus = "draft" | "published";

export const categoryLabels: Record<AgentCategory, string> = {
  co2: "CO₂",
  "pqs-abc": "Polvo Químico Seco (ABC)",
  "red-humeda": "Red Húmeda",
  "clase-k": "Clase K",
};

export const agentFilterOptions: { value: AgentCategory; label: string }[] = [
  { value: "pqs-abc", label: "PQS" },
  { value: "co2", label: "CO₂" },
  { value: "clase-k", label: "Clase K" },
  { value: "red-humeda", label: "Red Húmeda" },
];

export const classificationFilterOptions: { value: "ABC" | "BC" | "K"; label: string }[] = [
  { value: "ABC", label: "ABC" },
  { value: "BC", label: "BC" },
  { value: "K", label: "K" },
];

export const capacityFilterOptions = [
  "1 KG",
  "2 KG",
  "4 KG",
  "5 KG",
  "6 KG",
  "10 KG",
  "25 KG",
  "50 KG",
  "100 KG",
];
