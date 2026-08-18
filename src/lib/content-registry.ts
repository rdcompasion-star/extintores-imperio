// Registro de campos editables desde el panel (Contenido del sitio).
// Es la única fuente de verdad de qué existe en content_blocks y cómo mostrarlo en el formulario.

export type FieldType = "text" | "textarea";

export interface ContentFieldDef {
  field: string;
  label: string;
  type: FieldType;
  help?: string;
}

export interface ContentSectionDef {
  page: string;
  section: string;
  sectionLabel: string;
  toggleable: boolean;
  fields: ContentFieldDef[];
}

export const contentRegistry: ContentSectionDef[] = [
  {
    page: "home",
    section: "hero",
    sectionLabel: "Portada (Hero)",
    toggleable: false,
    fields: [
      { field: "badge", label: "Texto de la insignia superior", type: "text" },
      { field: "title", label: "Título principal", type: "textarea" },
      { field: "subtitle", label: "Subtítulo", type: "textarea" },
      { field: "cta_primary_text", label: "Botón principal", type: "text" },
      { field: "cta_secondary_text", label: "Botón secundario", type: "text" },
      { field: "certification_note", label: "Texto de certificación", type: "text" },
    ],
  },
  {
    page: "home",
    section: "trust",
    sectionLabel: "Confianza (estadísticas)",
    toggleable: true,
    fields: [
      { field: "stat1_value", label: "Estadística 1 — número", type: "text" },
      { field: "stat1_suffix", label: "Estadística 1 — sufijo", type: "text" },
      { field: "stat1_label", label: "Estadística 1 — descripción", type: "text" },
      { field: "stat2_value", label: "Estadística 2 — número", type: "text" },
      { field: "stat2_suffix", label: "Estadística 2 — sufijo", type: "text" },
      { field: "stat2_label", label: "Estadística 2 — descripción", type: "text" },
      { field: "stat3_value", label: "Estadística 3 — número", type: "text" },
      { field: "stat3_suffix", label: "Estadística 3 — sufijo", type: "text" },
      { field: "stat3_label", label: "Estadística 3 — descripción", type: "text" },
    ],
  },
  {
    page: "home",
    section: "categories",
    sectionLabel: "Categorías de productos",
    toggleable: true,
    fields: [{ field: "title", label: "Título de la sección", type: "text" }],
  },
  {
    page: "home",
    section: "featured_catalog",
    sectionLabel: "Catálogo destacado",
    toggleable: true,
    fields: [
      { field: "title", label: "Título de la sección", type: "text" },
      { field: "lead", label: "Texto descriptivo", type: "textarea" },
    ],
  },
  {
    page: "home",
    section: "fire_guide",
    sectionLabel: "Guía de tipos de fuego",
    toggleable: true,
    fields: [
      { field: "title", label: "Título de la sección", type: "text" },
      { field: "lead", label: "Texto descriptivo", type: "textarea" },
      { field: "cta_text", label: "Texto del botón de consulta", type: "text" },
    ],
  },
  {
    page: "home",
    section: "services",
    sectionLabel: "Servicios",
    toggleable: true,
    fields: [
      { field: "title", label: "Título de la sección", type: "text" },
      { field: "lead", label: "Texto descriptivo", type: "textarea" },
    ],
  },
  {
    page: "home",
    section: "normativa",
    sectionLabel: "Normativa y seguridad",
    toggleable: true,
    fields: [
      { field: "title", label: "Título de la sección", type: "text" },
      { field: "lead", label: "Texto descriptivo", type: "textarea" },
    ],
  },
  {
    page: "home",
    section: "about",
    sectionLabel: "Nosotros",
    toggleable: true,
    fields: [
      { field: "title", label: "Título de la sección", type: "text" },
      { field: "lead", label: "Texto descriptivo", type: "textarea" },
    ],
  },
  {
    page: "home",
    section: "clients",
    sectionLabel: "Clientes",
    toggleable: true,
    fields: [{ field: "title", label: "Título de la sección", type: "text" }],
  },
  {
    page: "home",
    section: "faq_teaser",
    sectionLabel: "Preguntas frecuentes (resumen en Home)",
    toggleable: true,
    fields: [{ field: "title", label: "Título de la sección", type: "text" }],
  },
  {
    page: "home",
    section: "contact_cta",
    sectionLabel: "Llamado a cotizar (final)",
    toggleable: true,
    fields: [
      { field: "title", label: "Título", type: "text" },
      { field: "lead", label: "Texto descriptivo", type: "textarea" },
    ],
  },
];

export function findFieldDef(section: string, field: string) {
  const s = contentRegistry.find((s) => s.section === section);
  return s?.fields.find((f) => f.field === field);
}
