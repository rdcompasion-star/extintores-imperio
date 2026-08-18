export interface AdminNavItem {
  href: string;
  label: string;
  emoji: string;
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Inicio", emoji: "🏠" },
  { href: "/admin/contenido", label: "Contenido", emoji: "📝" },
  { href: "/admin/medios", label: "Fotos", emoji: "🖼️" },
  { href: "/admin/productos", label: "Productos", emoji: "🛒" },
  { href: "/admin/servicios", label: "Servicios", emoji: "🧰" },
  { href: "/admin/cotizaciones", label: "Cotizaciones", emoji: "🧾" },
  { href: "/admin/faq", label: "Preguntas", emoji: "❓" },
  { href: "/admin/menu", label: "Menú", emoji: "📱" },
  { href: "/admin/vista-previa", label: "Vista previa", emoji: "👀" },
  { href: "/admin/actividad", label: "Actividad", emoji: "📊" },
  { href: "/admin/configuracion", label: "Configuración", emoji: "⚙️" },
];

// Los primeros 4 van en la barra inferior de mobile; el resto queda en "Más".
export const mobilePrimaryCount = 4;
