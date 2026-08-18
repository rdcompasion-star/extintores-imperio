import Link from "next/link";
import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { listProducts, listServices, listFaqs, listHistory } from "@/lib/queries";

const cards = [
  { href: "/admin/contenido", emoji: "📝", title: "Contenido", desc: "Editar textos y secciones." },
  { href: "/admin/medios", emoji: "🖼️", title: "Fotos", desc: "Administrar imágenes." },
  { href: "/admin/productos", emoji: "🛒", title: "Productos", desc: "Agregar, modificar o eliminar productos." },
  { href: "/admin/servicios", emoji: "🧰", title: "Servicios", desc: "Administrar servicios." },
  { href: "/admin/faq", emoji: "❓", title: "Preguntas frecuentes", desc: "Agregar o editar preguntas." },
  { href: "/admin/menu", emoji: "📱", title: "Menú", desc: "Modificar la navegación." },
  { href: "/admin/cotizaciones", emoji: "🧾", title: "Cotizaciones", desc: "Crear y administrar cotizaciones." },
  { href: "/admin/configuracion", emoji: "⚙️", title: "Configuración", desc: "Datos de contacto y de la empresa." },
  { href: "/admin/vista-previa", emoji: "👀", title: "Vista previa", desc: "Ver el sitio en mobile, tablet y desktop." },
  { href: "/admin/actividad", emoji: "📊", title: "Actividad", desc: "Ver modificaciones recientes." },
];

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso.replace(" ", "T")).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} d`;
}

export default async function AdminDashboardPage() {
  const [products, services, faqs, recentHistory] = await Promise.all([
    listProducts({ includeDrafts: true }),
    listServices({ includeDrafts: true }),
    listFaqs({ includeDrafts: true }),
    listHistory(5),
  ]);
  const draftCount =
    products.filter((p) => p.status === "draft").length +
    services.filter((s) => s.status === "draft").length +
    faqs.filter((f) => f.status === "draft").length;

  const lastChange = recentHistory[0];

  return (
    <div>
      <AdminPageHeader title="Administración" breadcrumb={[{ label: "Inicio" }]} />

      <div className="px-5 py-6 sm:px-8">
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-bg p-4">
            <p className="text-xs font-medium text-ink-400">Estado</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Sitio en línea
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg p-4">
            <p className="text-xs font-medium text-ink-400">Última modificación</p>
            <p className="mt-1 text-sm font-semibold text-ink-900">
              {lastChange ? timeAgo(lastChange.createdAt) : "—"}
            </p>
            {lastChange && <p className="mt-0.5 truncate text-xs text-ink-500">{lastChange.summary}</p>}
          </div>
          <div className="rounded-xl border border-border bg-bg p-4">
            <p className="text-xs font-medium text-ink-400">Elementos en borrador</p>
            <p className="mt-1 text-sm font-semibold text-ink-900">
              {draftCount === 0 ? "Ninguno" : `${draftCount} sin publicar`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex flex-col gap-2 rounded-xl border border-border bg-bg p-5 transition-colors hover:border-ink-400"
            >
              <span className="text-2xl leading-none">{card.emoji}</span>
              <span className="text-[15px] font-semibold text-ink-950">{card.title}</span>
              <span className="text-xs leading-relaxed text-ink-500">{card.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
