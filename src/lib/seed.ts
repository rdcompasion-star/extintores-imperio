import { db, dbGet, dbRun, logHistory } from "@/lib/db";
import { contentRegistry } from "@/lib/content-registry";
import { quoteCatalogSeed } from "@/lib/quote-catalog-seed";

// Semilla idempotente: carga los datos reales publicados por Extintores Imperio
// (los mismos que ya existían hardcodeados en el sitio) la primera vez que se
// levanta el servidor. Si las tablas ya tienen datos, no hace nada.

const seedProducts = [
  {
    slug: "extintor-gas-co2-2kg-bc",
    name: "Extintor Gas CO₂ 2KG (BC)",
    category: "co2",
    categoryLabel: "CO₂",
    presentation: "portatil",
    agent: "Dióxido de carbono",
    capacityValue: 2,
    capacityUnit: "KG",
    capacityLabel: "2 KG",
    concentration: "100%",
    extinguishingRating: "2BC",
    classification: "BC",
    dischargedWeight: "5.4 KG",
    chargedWeight: "7.4 KG",
    certification: "CESMEC",
    description:
      "Extintor portátil de Dióxido de Carbono (CO₂) de 2 KG, contenido porcentual nominal 100%, potencial de extinción 2BC. Certificado por CESMEC.",
    fireClasses: ["B", "C"],
  },
  {
    slug: "extintor-gas-co2-5kg-bc",
    name: "Extintor Gas CO₂ 5KG (BC)",
    category: "co2",
    categoryLabel: "CO₂",
    presentation: "portatil",
    agent: "Dióxido de carbono",
    capacityValue: 5,
    capacityUnit: "KG",
    capacityLabel: "5 KG",
    concentration: "100%",
    extinguishingRating: "10BC",
    classification: "BC",
    dischargedWeight: "12 KG",
    chargedWeight: "17 KG",
    certification: "CESMEC",
    description:
      "Extintor portátil de Dióxido de Carbono (CO₂) de 5 KG, contenido porcentual nominal 100%, potencial de extinción 10BC. Certificado por CESMEC.",
    fireClasses: ["B", "C"],
  },
  {
    slug: "extintor-carro-co2-10kg-bc",
    name: "Extintor Carro CO₂ 10KG (BC)",
    category: "co2",
    categoryLabel: "CO₂",
    presentation: "rodante",
    agent: "Dióxido de carbono",
    capacityValue: 10,
    capacityUnit: "KG",
    capacityLabel: "10 KG",
    concentration: "100%",
    extinguishingRating: "10BC",
    classification: "BC",
    dischargedWeight: "25.1 KG",
    chargedWeight: "35.1 KG",
    certification: "CESMEC",
    description:
      "Extintor rodante (carro) de Dióxido de Carbono (CO₂) de 10 KG, contenido porcentual nominal 100%, potencial de extinción 10BC. Certificado por CESMEC.",
    fireClasses: ["B", "C"],
  },
  {
    slug: "extintor-pqs-abc-1kg-75",
    name: "Extintor Polvo Químico Seco (ABC) 1KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "portatil",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 1,
    capacityUnit: "KG",
    capacityLabel: "1 KG",
    concentration: "75%",
    extinguishingRating: "1A - 2BC",
    classification: "ABC",
    dischargedWeight: "0.7 KG",
    chargedWeight: "1.7 KG",
    certification: "CESMEC",
    description:
      "Extintor portátil de Polvo Químico Seco (ABC) de 1 KG, concentración nominal 75%, potencial de extinción 1A-2BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "extintor-pqs-abc-2kg-75",
    name: "Extintor Polvo Químico Seco (ABC) 2KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "portatil",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 2,
    capacityUnit: "KG",
    capacityLabel: "2 KG",
    concentration: "75%",
    extinguishingRating: "2A - 5BC",
    classification: "ABC",
    dischargedWeight: "1.2 KG",
    chargedWeight: "3.2 KG",
    certification: "CESMEC",
    description:
      "Extintor portátil de Polvo Químico Seco (ABC) de 2 KG, concentración nominal 75%, potencial de extinción 2A-5BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "extintor-pqs-abc-4kg-75",
    name: "Extintor Polvo Químico Seco (ABC) 4KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "portatil",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 4,
    capacityUnit: "KG",
    capacityLabel: "4 KG",
    concentration: "75%",
    extinguishingRating: "4A - 30BC",
    classification: "ABC",
    dischargedWeight: "1.9 KG",
    chargedWeight: "5.9 KG",
    certification: "CESMEC",
    description:
      "Extintor portátil de Polvo Químico Seco (ABC) de 4 KG, concentración nominal 75%, potencial de extinción 4A-30BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "extintor-pqs-abc-6kg-75",
    name: "Extintor Polvo Químico Seco (ABC) 6KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "portatil",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 6,
    capacityUnit: "KG",
    capacityLabel: "6 KG",
    concentration: "75%",
    extinguishingRating: "6A - 40BC",
    classification: "ABC",
    dischargedWeight: "2.5 KG",
    chargedWeight: "8.5 KG",
    certification: "CESMEC",
    description:
      "Extintor portátil de Polvo Químico Seco (ABC) de 6 KG, concentración nominal 75%, potencial de extinción 6A-40BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "extintor-pqs-abc-10kg-75",
    name: "Extintor Polvo Químico Seco (ABC) 10KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "portatil",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 10,
    capacityUnit: "KG",
    capacityLabel: "10 KG",
    concentration: "75%",
    extinguishingRating: "10A - 40BC",
    classification: "ABC",
    dischargedWeight: "3.6 KG",
    chargedWeight: "13.6 KG",
    certification: "CESMEC",
    description:
      "Extintor portátil de Polvo Químico Seco (ABC) de 10 KG, concentración nominal 75%, potencial de extinción 10A-40BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "extintor-carro-pqs-abc-25kg-75",
    name: "Extintor Carro Polvo Químico Seco (ABC) 25KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "rodante",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 25,
    capacityUnit: "KG",
    capacityLabel: "25 KG",
    concentration: "75%",
    extinguishingRating: "30A - 60BC",
    classification: "ABC",
    dischargedWeight: "21.5 KG",
    chargedWeight: "46.5 KG",
    certification: "CESMEC",
    description:
      "Extintor rodante (carro) de Polvo Químico Seco (ABC) de 25 KG, concentración nominal 75%, potencial de extinción 30A-60BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "extintor-carro-pqs-abc-50kg-75",
    name: "Extintor Carro Polvo Químico Seco (ABC) 50KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "rodante",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 50,
    capacityUnit: "KG",
    capacityLabel: "50 KG",
    concentration: "75%",
    extinguishingRating: "40A - 70BC",
    classification: "ABC",
    dischargedWeight: "29.5 KG",
    chargedWeight: "79.5 KG",
    certification: "CESMEC",
    description:
      "Extintor rodante (carro) de Polvo Químico Seco (ABC) de 50 KG, concentración nominal 75%, potencial de extinción 40A-70BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "extintor-carro-pqs-abc-100kg-75",
    name: "Extintor Carro Polvo Químico Seco (ABC) 100KG 75% F.M",
    category: "pqs-abc",
    categoryLabel: "Polvo Químico Seco (ABC)",
    presentation: "rodante",
    agent: "Polvo Químico Seco (ABC)",
    capacityValue: 100,
    capacityUnit: "KG",
    capacityLabel: "100 KG",
    concentration: "75%",
    extinguishingRating: "40A - 120BC",
    classification: "ABC",
    dischargedWeight: "41.5 KG",
    chargedWeight: "141.5 KG",
    certification: "CESMEC",
    description:
      "Extintor rodante (carro) de Polvo Químico Seco (ABC) de 100 KG, concentración nominal 75%, potencial de extinción 40A-120BC. Certificado por CESMEC.",
    fireClasses: ["A", "B", "C"],
  },
  {
    slug: "manguera-red-humeda-25-metros",
    name: "Manguera Red Húmeda 25 Metros Semi Rígida",
    category: "red-humeda",
    categoryLabel: "Red Húmeda",
    presentation: "gabinete",
    agent: "Agua (red húmeda)",
    capacityValue: 25,
    capacityUnit: "Lt",
    capacityLabel: "25 metros",
    certification: "CESMEC",
    cabinet: "75x75x30",
    hose: 'Manguera semirrígida 1" x 25 mts.',
    nozzle: "Pitón con alma de bronce",
    reel: "Carrete de ataque rápido abatible",
    description:
      'Sistema de red húmeda con gabinete 75x75x30, carrete de ataque rápido abatible, manguera semirrígida de 1" x 25 mts. y pitón con alma de bronce. Certificado por CESMEC.',
    fireClasses: [],
  },
  {
    slug: "manguera-red-humeda-30-metros",
    name: "Manguera Red Húmeda 30 Metros Semi Rígida",
    category: "red-humeda",
    categoryLabel: "Red Húmeda",
    presentation: "gabinete",
    agent: "Agua (red húmeda)",
    capacityValue: 30,
    capacityUnit: "Lt",
    capacityLabel: "30 metros",
    certification: "CESMEC",
    cabinet: "75x75x30",
    hose: 'Manguera semirrígida 1" x 30 mts.',
    nozzle: "Pitón con alma de bronce",
    description:
      'Sistema de red húmeda con gabinete 75x75x30, manguera semirrígida de 1" x 30 mts. y pitón con alma de bronce. Certificado por CESMEC.',
    fireClasses: [],
  },
  {
    slug: "extintor-clase-k-acetato-potasio-6lt",
    name: "Extintor Clase K — Acetato de Potasio — 6 Litros",
    category: "clase-k",
    categoryLabel: "Clase K",
    presentation: "portatil",
    agent: "Acetato de potasio",
    capacityValue: 6,
    capacityUnit: "Lt",
    capacityLabel: "6 Lt",
    extinguishingRating: "1A - K",
    classification: "K",
    cylinder: "Cilindro de acero inoxidable",
    description:
      "Extintor Clase K de Acetato de Potasio, 6 litros, cilindro de acero inoxidable, potencial de extinción 1A-K.",
    fireClasses: ["A", "K"],
  },
  {
    slug: "extintor-clase-k-acetato-potasio-10lt",
    name: "Extintor Clase K — Acetato de Potasio — 10 Litros",
    category: "clase-k",
    categoryLabel: "Clase K",
    presentation: "portatil",
    agent: "Acetato de potasio",
    capacityValue: 10,
    capacityUnit: "Lt",
    capacityLabel: "10 Lt",
    extinguishingRating: "1A - K",
    classification: "K",
    cylinder: "Cilindro de acero inoxidable",
    description:
      "Extintor Clase K de Acetato de Potasio, 10 litros, cilindro de acero inoxidable, potencial de extinción 1A-K.",
    fireClasses: ["A", "K"],
  },
];

const seedServices = [
  {
    slug: "venta",
    title: "Venta de extintores",
    summary: "Extintores CO₂, Polvo Químico Seco, Clase K y sistemas de red húmeda.",
    description:
      "Extintores Imperio comercializa extintores de Dióxido de Carbono (CO₂), Polvo Químico Seco (ABC), Clase K y sistemas de red húmeda, en formato portátil y rodante, con certificación CESMEC en sus productos aplicables.",
    ctaText: "Solicitar servicio",
    ctaType: "whatsapp",
    ctaValue: "Hola, quiero solicitar el servicio de venta de extintores.",
  },
  {
    slug: "mantencion",
    title: "Mantención",
    summary: "Servicio de mantención de extintores y equipos contra incendios.",
    description:
      "Extintores Imperio realiza mantención de extintores y equipos contra incendios. Para el detalle de procedimientos, plazos y alcance según cada equipo, contáctanos directamente.",
    ctaText: "Solicitar servicio",
    ctaType: "whatsapp",
    ctaValue: "Hola, quiero solicitar el servicio de mantención.",
  },
  {
    slug: "recarga",
    title: "Recarga",
    summary: "Servicio de recarga de extintores.",
    description:
      "Extintores Imperio realiza recarga de extintores. Para conocer los tiempos y requisitos según el tipo y capacidad de tu equipo, contáctanos directamente.",
    ctaText: "Solicitar servicio",
    ctaType: "whatsapp",
    ctaValue: "Hola, quiero solicitar el servicio de recarga.",
  },
];

const seedFaq = [
  {
    question: "¿Qué tipos de extintores venden?",
    answer:
      "Extintores de Dióxido de Carbono (CO₂), Polvo Químico Seco (ABC), Clase K (Acetato de Potasio) y sistemas de red húmeda, en formato portátil y rodante.",
  },
  {
    question: "¿Qué es un extintor PQS?",
    answer:
      "Es un extintor de Polvo Químico Seco. En el catálogo de Extintores Imperio corresponde a la clasificación ABC, indicada para fuegos de materiales sólidos, líquidos/gases inflamables y equipos energizados eléctricamente.",
  },
  {
    question: "¿Qué es un extintor CO₂?",
    answer:
      "Es un extintor que utiliza Dióxido de Carbono como agente extintor. En el catálogo de Extintores Imperio corresponde a la clasificación BC.",
  },
  {
    question: "¿Qué es un extintor Clase K?",
    answer:
      "Es un extintor con agente Acetato de Potasio, indicado para fuegos Clase K (grasas y aceites de cocina).",
  },
  {
    question: "¿Realizan recarga de extintores?",
    answer: "Sí, Extintores Imperio realiza recarga de extintores. Consúltanos por tu equipo específico.",
  },
  {
    question: "¿Realizan mantención?",
    answer: "Sí, Extintores Imperio realiza mantención de extintores y equipos contra incendios.",
  },
  {
    question: "¿Dónde están ubicados?",
    answer: "Obispo Vásquez Valencia Nº 3237, Cerrillos, Santiago, Chile.",
  },
  {
    question: "¿Cómo puedo solicitar una cotización?",
    answer: "A través del formulario de cotización de este sitio, por WhatsApp o llamando al +56 9 4210 8738.",
  },
];

const seedMenu = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Tipos de fuego", href: "/tipos-de-fuego" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

const seedContent: Record<string, Record<string, string>> = {
  hero: {
    badge: "15 años protegiendo empresas, comercios y hogares en Chile",
    title: "Protección contra incendios para empresas, comercios, oficinas, hogares e instituciones",
    subtitle:
      "Venta, recarga y mantención de extintores y equipos contra incendios. Extintores CO₂, Polvo Químico Seco, Clase K y red húmeda con certificación CESMEC.",
    cta_primary_text: "Cotizar extintores",
    cta_secondary_text: "Ver catálogo",
    certification_note: "Productos con certificación CESMEC",
  },
  trust: {
    stat1_value: "15",
    stat1_suffix: " años",
    stat1_label: "de experiencia en el mercado",
    stat2_value: "1.652",
    stat2_suffix: "",
    stat2_label: "clientes felices",
    stat3_value: "325",
    stat3_suffix: "",
    stat3_label: "clientes",
  },
  categories: { title: "Explora por tipo de agente" },
  featured_catalog: {
    title: "Catálogo destacado",
    lead: "Extintores CO₂, Polvo Químico Seco, Clase K y red húmeda con certificación CESMEC.",
  },
  fire_guide: {
    title: "¿Qué tipo de fuego necesitas combatir?",
    lead: "Guía educativa para orientar tu elección. No reemplaza una evaluación técnica de riesgo de tu instalación.",
    cta_text: "Escribir por WhatsApp",
  },
  services: {
    title: "Servicios",
    lead: "Venta, mantención y recarga de extintores y equipos contra incendios.",
  },
  normativa: {
    title: "Normativa y seguridad en extintores en Chile",
    lead: "Información general orientativa. No constituye asesoría legal.",
  },
  about: {
    title: "Nosotros",
    lead: "Extintores Imperio es una empresa chilena dedicada a la comercialización, recarga y mantención de equipos contra incendios.",
  },
  clients: { title: "Empresas que han confiado en nosotros" },
  faq_teaser: { title: "Preguntas frecuentes" },
  contact_cta: {
    title: "¿Listo para cotizar?",
    lead: "Escríbenos por WhatsApp o completa el formulario y te respondemos a la brevedad.",
  },
};

const seedSections = [
  { section_key: "trust", label: "Confianza (estadísticas)" },
  { section_key: "categories", label: "Categorías de productos" },
  { section_key: "featured_catalog", label: "Catálogo destacado" },
  { section_key: "fire_guide", label: "Guía de tipos de fuego" },
  { section_key: "services", label: "Servicios" },
  { section_key: "normativa", label: "Normativa y seguridad" },
  { section_key: "about", label: "Nosotros" },
  { section_key: "clients", label: "Clientes" },
  { section_key: "faq_teaser", label: "Preguntas frecuentes" },
  { section_key: "contact_cta", label: "Llamado a cotizar (final)" },
];

export async function ensureSeeded() {
  const settingsCount = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM settings`);
  if (!settingsCount || settingsCount.c === 0) {
    await dbRun(
      `INSERT INTO settings (
        id, company_name, phone_display, phone_e164, whatsapp_number, email,
        address_street, address_comuna, address_city, address_country,
        hours_weekday, hours_saturday, whatsapp_social_enabled, publish_immediately
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        "Extintores Imperio",
        "+56 9 4210 8738",
        "+56942108738",
        "56942108738",
        "extintorimperio@gmail.com",
        "Obispo Vásquez Valencia Nº 3237",
        "Cerrillos",
        "Santiago",
        "Chile",
        "09:00–19:00",
        "09:00–14:00",
      ]
    );
    await logHistory("settings", 1, "Configuración inicial cargada desde el sitio publicado.");
  }

  const productCount = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM products`);
  if (!productCount || productCount.c === 0) {
    const insertSql = `INSERT INTO products (
        slug, name, category, category_label, presentation, agent,
        capacity_value, capacity_unit, capacity_label, concentration,
        extinguishing_rating, classification, discharged_weight, charged_weight,
        certification, cabinet, hose, nozzle, reel, cylinder, description,
        fire_classes, status, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`;
    await db.batch(
      seedProducts.map((p, i) => ({
        sql: insertSql,
        args: [
          p.slug,
          p.name,
          p.category,
          p.categoryLabel,
          p.presentation,
          p.agent,
          p.capacityValue,
          p.capacityUnit,
          p.capacityLabel,
          p.concentration ?? null,
          p.extinguishingRating ?? null,
          p.classification ?? null,
          p.dischargedWeight ?? null,
          p.chargedWeight ?? null,
          p.certification ?? null,
          (p as { cabinet?: string }).cabinet ?? null,
          (p as { hose?: string }).hose ?? null,
          (p as { nozzle?: string }).nozzle ?? null,
          (p as { reel?: string }).reel ?? null,
          (p as { cylinder?: string }).cylinder ?? null,
          p.description,
          JSON.stringify(p.fireClasses),
          i,
        ],
      })),
      "write"
    );
    await logHistory("products", null, `Catálogo inicial cargado: ${seedProducts.length} productos.`);
  }

  const serviceCount = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM services`);
  if (!serviceCount || serviceCount.c === 0) {
    await db.batch(
      seedServices.map((s, i) => ({
        sql: `INSERT INTO services (slug, title, summary, description, cta_text, cta_type, cta_value, status, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
        args: [s.slug, s.title, s.summary, s.description, s.ctaText, s.ctaType, s.ctaValue, i],
      })),
      "write"
    );
    await logHistory("services", null, "Servicios iniciales cargados.");
  }

  const faqCount = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM faq`);
  if (!faqCount || faqCount.c === 0) {
    await db.batch(
      seedFaq.map((f, i) => ({
        sql: `INSERT INTO faq (question, answer, status, order_index) VALUES (?, ?, 'published', ?)`,
        args: [f.question, f.answer, i],
      })),
      "write"
    );
    await logHistory("faq", null, "Preguntas frecuentes iniciales cargadas.");
  }

  const menuCount = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM menu_items`);
  if (!menuCount || menuCount.c === 0) {
    await db.batch(
      seedMenu.map((m, i) => ({
        sql: `INSERT INTO menu_items (label, href, visible, order_index) VALUES (?, ?, 1, ?)`,
        args: [m.label, m.href, i],
      })),
      "write"
    );
    await logHistory("menu", null, "Menú de navegación inicial cargado.");
  }

  const contentCount = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM content_blocks`);
  if (!contentCount || contentCount.c === 0) {
    const statements: { sql: string; args: (string | number)[] }[] = [];
    for (const def of contentRegistry) {
      const values = seedContent[def.section] ?? {};
      for (const f of def.fields) {
        statements.push({
          sql: `INSERT INTO content_blocks (page, section, field, value) VALUES ('home', ?, ?, ?)`,
          args: [def.section, f.field, values[f.field] ?? ""],
        });
      }
    }
    await db.batch(statements, "write");
    await logHistory("content", null, "Textos iniciales del sitio cargados.");
  }

  const sectionCount = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM sections`);
  if (!sectionCount || sectionCount.c === 0) {
    await db.batch(
      seedSections.map((s, i) => ({
        sql: `INSERT INTO sections (page, section_key, label, visible, order_index) VALUES ('home', ?, ?, 1, ?)`,
        args: [s.section_key, s.label, i],
      })),
      "write"
    );
    await logHistory("sections", null, "Secciones del Home inicializadas.");
  }

  // Upsert por código en cada arranque: el archivo quote-catalog-seed.ts es la
  // fuente de verdad. Un ítem nuevo se inserta, uno existente actualiza sus
  // datos (precio, nombre, etc.) pero conserva el "active" que haya fijado el
  // admin desde el panel.
  const quoteCatalogCountBefore = await dbGet<{ c: number }>(`SELECT COUNT(*) as c FROM quote_catalog_items`);
  try {
    await db.batch(
    quoteCatalogSeed.map((item, i) => ({
      sql: `INSERT INTO quote_catalog_items (code, kind, category, name, unit, size_label, net_price, notes, catalog_group, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(code) DO UPDATE SET
              kind = excluded.kind,
              category = excluded.category,
              name = excluded.name,
              unit = excluded.unit,
              size_label = excluded.size_label,
              net_price = excluded.net_price,
              notes = excluded.notes,
              catalog_group = excluded.catalog_group,
              order_index = excluded.order_index,
              updated_at = datetime('now','localtime')`,
      args: [
        item.code,
        item.kind,
        item.category,
        item.name,
        item.unit,
        item.sizeLabel,
        item.netPrice,
        item.notes ?? "",
        item.catalogGroup ?? "general",
        i,
      ],
    })),
      "write"
    );
    if (!quoteCatalogCountBefore || quoteCatalogCountBefore.c === 0) {
      await logHistory("quote_catalog", null, `Catálogo del cotizador cargado: ${quoteCatalogSeed.length} ítems.`);
    }
  } catch (err) {
    // Puede chocar con otro proceso escribiendo la misma tabla al mismo tiempo
    // (varios workers de build, cold starts concurrentes). No es fatal: el
    // catálogo ya sembrado sigue sirviendo; se reintenta en el próximo arranque.
    // eslint-disable-next-line no-console
    console.error("No se pudo sincronizar el catálogo del cotizador:", err);
  }
}
