import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { listHistory } from "@/lib/queries";

function formatDate(iso: string) {
  const d = new Date(iso.replace(" ", "T"));
  return d.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const entityEmoji: Record<string, string> = {
  product: "🛒",
  service: "🧰",
  faq: "❓",
  menu: "📱",
  content: "📝",
  section: "👁️",
  media: "🖼️",
  settings: "⚙️",
  auth: "🔐",
  sections: "👁️",
  products: "🛒",
  services: "🧰",
};

export default async function ActividadPage() {
  const history = await listHistory(100);

  return (
    <div>
      <AdminPageHeader
        title="Actividad reciente"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Actividad" }]}
        description="Registro de los cambios realizados en el sitio."
      />

      <div className="flex flex-col gap-2 px-5 py-6 sm:px-8">
        {history.length === 0 && <p className="text-sm text-ink-500">Todavía no hay actividad registrada.</p>}
        {history.map((h) => (
          <div key={h.id} className="flex items-start gap-3 rounded-lg border border-border bg-bg p-3.5">
            <span className="text-lg leading-none">{entityEmoji[h.entityType] ?? "•"}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink-800">{h.summary}</p>
              <p className="mt-0.5 text-xs text-ink-400">
                {formatDate(h.createdAt)} · {h.username}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
